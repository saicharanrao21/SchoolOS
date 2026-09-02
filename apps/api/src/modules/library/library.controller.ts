import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { LibraryService } from './library.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorators/user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('library')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LibraryController {
  constructor(private readonly service: LibraryService) {}

  @Post('books')
  @Permissions('library.books.create')
  async createBook(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.createBook(organizationId, data, actorId);
  }

  @Post('copies')
  @Permissions('library.copies.manage')
  async addCopy(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.addCopy(organizationId, data, actorId);
  }

  @Post('issues')
  @Permissions('library.issue')
  async issueBook(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.issueBook(organizationId, data, actorId);
  }

  @Patch('issues/:id/return')
  @Permissions('library.return')
  async returnBook(@User('org') organizationId: string, @Param('id') id: string, @User('id') actorId: string) {
    return this.service.returnBook(organizationId, id, actorId);
  }

  @Get('dashboard')
  @Permissions('library.read')
  async getDashboard(@User('org') organizationId: string, @Query('schoolId') schoolId: string) {
    return this.service.getDashboard(organizationId, schoolId);
  }

  @Get('books')
  @Permissions('library.read')
  async findAll(@Query('schoolId') schoolId: string) {
    return this.service.findAllBooks(schoolId);
  }

  @Get('my-issues')
  async getMyIssues(@User('id') userId: string) {
    return this.service.getMemberIssues(userId);
  }
}
