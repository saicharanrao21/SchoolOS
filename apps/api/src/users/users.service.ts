import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findOne(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }
}
