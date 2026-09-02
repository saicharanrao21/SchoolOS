import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../audit/audit.service';
import { Prisma, BookCopyStatus, IssueStatus } from '@prisma/client';

@Injectable()
export class LibraryService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async createBook(organizationId: string, data: any, actorId: string) {
    const book = await this.db.book.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        isbn: data.isbn,
        author: data.author,
        publisher: data.publisher,
        publicationYear: data.publicationYear,
        language: data.language,
        description: data.description,
        classification: data.classification,
        libraryId: data.libraryId,
        categoryId: data.categoryId,
      },
    });

    await this.audit.log({
      action: 'library.book.create',
      resource: 'Book',
      resourceId: book.id,
      actorId,
      organizationId,
    });

    return book;
  }

  async addCopy(organizationId: string, data: any, actorId: string) {
    const copy = await this.db.bookCopy.create({
      data: {
        accessionNumber: data.accessionNumber,
        barcode: data.barcode,
        bookId: data.bookId,
        libraryId: data.libraryId,
        location: data.location,
        condition: data.condition,
        cost: data.cost,
        status: BookCopyStatus.AVAILABLE,
      },
    });

    return copy;
  }

  async issueBook(organizationId: string, data: any, actorId: string) {
    return this.db.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findUnique({
        where: { id: data.copyId },
        include: { library: { include: { policies: true } } },
      });

      if (!copy || copy.status !== BookCopyStatus.AVAILABLE) {
        throw new BadRequestException('Book copy is not available');
      }

      const policy = copy.library.policies;
      const duration = policy?.issueDuration || 14;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + duration);

      const issue = await tx.libraryIssue.create({
        data: {
          copyId: data.copyId,
          memberId: data.memberId,
          dueDate,
          operatorId: actorId,
          libraryId: copy.libraryId,
          status: IssueStatus.ISSUED,
        },
      });

      await tx.bookCopy.update({
        where: { id: data.copyId },
        data: { status: BookCopyStatus.ISSUED },
      });

      return issue;
    });
  }

  async returnBook(organizationId: string, issueId: string, actorId: string) {
    return this.db.$transaction(async (tx) => {
      const issue = await tx.libraryIssue.findUnique({
        where: { id: issueId },
        include: { copy: { include: { library: { include: { policies: true } } } } },
      });

      if (!issue || issue.status === IssueStatus.RETURNED) {
        throw new BadRequestException('Invalid issue or already returned');
      }

      const returnDate = new Date();
      let fineAmount = new Prisma.Decimal(0);

      if (returnDate > issue.dueDate) {
        const diffTime = Math.abs(returnDate.getTime() - issue.dueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const policy = issue.copy.library.policies;
        if (policy && policy.finePerDay) {
           fineAmount = policy.finePerDay.mul(diffDays);
        }
      }

      await tx.libraryIssue.update({
        where: { id: issueId },
        data: {
          returnDate,
          status: IssueStatus.RETURNED,
        },
      });

      await tx.bookCopy.update({
        where: { id: issue.copyId },
        data: { status: BookCopyStatus.AVAILABLE },
      });

      if (fineAmount.gt(0)) {
        await tx.libraryFine.create({
          data: {
            issueId,
            amount: fineAmount,
            reason: 'Overdue return',
          },
        });
      }

      return { success: true, fineAmount };
    });
  }

  async getDashboard(organizationId: string, schoolId: string) {
    const [books, copies, issues, overdue] = await Promise.all([
      this.db.book.count({ where: { library: { schoolId } } }),
      this.db.bookCopy.count({ where: { library: { schoolId } } }),
      this.db.libraryIssue.count({ where: { status: IssueStatus.ISSUED, library: { schoolId } } }),
      this.db.libraryIssue.count({
        where: {
          status: IssueStatus.ISSUED,
          dueDate: { lt: new Date() },
          library: { schoolId },
        },
      }),
    ]);

    return { totalTitles: books, totalCopies: copies, issued: issues, overdue };
  }

  async findAllBooks(schoolId: string) {
    return this.db.book.findMany({
      where: { library: { schoolId } },
      include: { category: true, _count: { select: { copies: true } } },
    });
  }

  async getMemberIssues(userId: string) {
    return this.db.libraryIssue.findMany({
      where: { member: { userId }, status: { in: [IssueStatus.ISSUED, IssueStatus.OVERDUE] } },
      include: { copy: { include: { book: true } } },
    });
  }
}
