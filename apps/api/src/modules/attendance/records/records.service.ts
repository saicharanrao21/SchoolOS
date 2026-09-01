import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../../database/database.service';
import { AuditService } from '../../../audit/audit.service';
import { Prisma, AttendanceStatus, AttendanceSessionStatus } from '@prisma/client';

@Injectable()
export class AttendanceRecordsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async markBulk(organizationId: string, sessionId: string, records: any[], actorId: string) {
    const session = await this.db.attendanceSession.findFirst({
      where: { id: sessionId, school: { organizationId } },
    });

    if (!session) throw new NotFoundException('Attendance session not found');
    if (session.status === AttendanceSessionStatus.LOCKED) {
      throw new BadRequestException('Cannot mark attendance for a locked session');
    }

    return this.db.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const record of records) {
        const result = await tx.studentAttendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId,
              studentId: record.studentId,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            checkInTime: record.checkInTime ? new Date(record.checkInTime) : undefined,
            checkOutTime: record.checkOutTime ? new Date(record.checkOutTime) : undefined,
            markedById: actorId,
          },
          create: {
            sessionId,
            studentId: record.studentId,
            status: record.status,
            remarks: record.remarks,
            checkInTime: record.checkInTime ? new Date(record.checkInTime) : undefined,
            checkOutTime: record.checkOutTime ? new Date(record.checkOutTime) : undefined,
            markedById: actorId,
          },
        });

        // Emit event for absence or lateness
        if (record.status === AttendanceStatus.ABSENT) {
          this.eventEmitter.emit('student.absent', {
            organizationId,
            schoolId: session.schoolId,
            studentId: record.studentId,
            date: session.date,
          });
        } else if (record.status === AttendanceStatus.LATE) {
          this.eventEmitter.emit('student.late', {
            organizationId,
            schoolId: session.schoolId,
            studentId: record.studentId,
            date: session.date,
          });
        }
      }

      // Update session status to IN_PROGRESS if it was OPEN
      if (session.status === AttendanceSessionStatus.OPEN) {
        await tx.attendanceSession.update({
          where: { id: sessionId },
          data: { status: AttendanceSessionStatus.IN_PROGRESS },
        });
      }

      await this.audit.log({
        action: 'attendance.mark_bulk',
        resource: 'AttendanceSession',
        resourceId: sessionId,
        actorId,
        organizationId,
        schoolId: session.schoolId,
        metadata: { count: records.length },
      });

      return { success: true, count: records.length };
    });
  }

  async getStudentStats(organizationId: string, studentId: string, academicYearId: string) {
    const records = await this.db.studentAttendanceRecord.findMany({
      where: {
        studentId,
        session: { academicYearId },
      },
      select: { status: true },
    });

    const total = records.length;
    const stats = records.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as any);

    return {
      total,
      stats,
      percentage: total > 0 ? ((stats[AttendanceStatus.PRESENT] || 0) / total) * 100 : 0,
    };
  }

  async markEmployeeAttendance(organizationId: string, schoolId: string, data: any, actorId: string) {
    const employee = await this.db.employee.findFirst({
      where: { id: data.employeeId, schoolId, school: { organizationId } },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const date = new Date(data.date || new Date());
    date.setHours(0, 0, 0, 0);

    const record = await this.db.employeeAttendanceRecord.upsert({
      where: {
        date_employeeId: {
          date,
          employeeId: data.employeeId,
        },
      },
      update: {
        status: data.status,
        checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
        checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : undefined,
        remarks: data.remarks,
      },
      create: {
        date,
        employeeId: data.employeeId,
        status: data.status,
        checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
        checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : undefined,
        remarks: data.remarks,
        schoolId,
      },
    });

    await this.audit.log({
      action: 'attendance.employee.mark',
      resource: 'EmployeeAttendanceRecord',
      resourceId: record.id,
      actorId,
      organizationId,
      schoolId,
    });

    return record;
  }
}
