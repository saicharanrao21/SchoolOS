import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../audit/audit.service';
import { InventoryService } from '../inventory/inventory.service';
import { AccountingIntegrationService } from '../accounting/accounting-integration.service';
import { PurchaseOrderStatus, StockMovementType } from '@prisma/client';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
    private readonly inventory: InventoryService,
    private readonly accounting: AccountingIntegrationService,
  ) {}

  async createPO(organizationId: string, data: any, actorId: string) {
    const poNumber = await this.generatePoNumber(organizationId);

    return this.db.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          poNumber,
          vendorId: data.vendorId,
          schoolId: data.schoolId,
          totalAmount: data.totalAmount,
          status: PurchaseOrderStatus.DRAFT,
          lines: {
            create: data.lines.map((l: any) => ({
              itemId: l.itemId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
              totalPrice: l.totalPrice,
            })),
          },
        },
        include: { lines: true },
      });

      await this.audit.log({
        action: 'procurement.po.create',
        resource: 'PurchaseOrder',
        resourceId: po.id,
        actorId,
        organizationId,
      });

      return po;
    });
  }

  private async generatePoNumber(organizationId: string): Promise<string> {
    const count = await this.db.purchaseOrder.count({
      where: { school: { organizationId } },
    });
    return `PO-${(count + 1).toString().padStart(6, '0')}`;
  }

  async recordReceipt(organizationId: string, data: any, actorId: string) {
    return this.db.$transaction(async (tx) => {
      const grnNumber = await this.generateGrnNumber(organizationId);

      const receipt = await tx.goodsReceipt.create({
        data: {
          grnNumber,
          poId: data.poId,
          schoolId: data.schoolId,
          receivedById: actorId,
        },
      });

      // Update PO and Stock for each line
      for (const item of data.items) {
        await tx.purchaseOrderLine.updateMany({
          where: { poId: data.poId, itemId: item.itemId },
          data: { receivedQty: { increment: item.quantity } },
        });

        // Trigger stock movement
        await this.inventory.recordMovement(organizationId, {
          itemId: item.itemId,
          type: StockMovementType.RECEIPT,
          quantity: item.quantity,
          destWarehouseId: item.warehouseId,
          referenceType: 'GRN',
          referenceId: receipt.id,
          reason: `Goods received against PO`,
        }, actorId);
      }

      // Check if PO is fully received
      const lines = await tx.purchaseOrderLine.findMany({ where: { poId: data.poId } });
      const fullyReceived = lines.every(l => l.receivedQty >= l.quantity);

      if (fullyReceived) {
        await tx.purchaseOrder.update({
          where: { id: data.poId },
          data: { status: PurchaseOrderStatus.RECEIVED },
        });
      } else {
        await tx.purchaseOrder.update({
          where: { id: data.poId },
          data: { status: PurchaseOrderStatus.PARTIALLY_RECEIVED },
        });
      }

      // Accounting Integration (Debit Inventory Asset, Credit Accounts Payable)
      // Assuming vendor has a linked liability account or organization has a default AP
      // For now, using a placeholder call. I should extend AccountingIntegrationService.
      // await this.accounting.handleGoodsReceipt(organizationId, receipt.id, data.totalCost);

      return receipt;
    });
  }

  private async generateGrnNumber(organizationId: string): Promise<string> {
    const count = await this.db.goodsReceipt.count({
      where: { school: { organizationId } },
    });
    return `GRN-${(count + 1).toString().padStart(6, '0')}`;
  }

  async getDashboard(organizationId: string, schoolId: string) {
    const [pendingPOs, totalValue] = await Promise.all([
      this.db.purchaseOrder.count({ where: { schoolId, status: { in: [PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.SENT, PurchaseOrderStatus.PARTIALLY_RECEIVED] } } }),
      this.db.purchaseOrder.aggregate({
        where: { schoolId, status: { not: PurchaseOrderStatus.CANCELLED } },
        _sum: { totalAmount: true }
      }),
    ]);

    return { pendingOrders: pendingPOs, totalProcurementValue: totalValue._sum.totalAmount || 0 };
  }
}
