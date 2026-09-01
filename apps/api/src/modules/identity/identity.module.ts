import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { SchoolsModule } from './schools/schools.module';
import { UsersModule } from './users/users.module';
import { CampusesModule } from './campuses/campuses.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [OrganizationsModule, SchoolsModule, UsersModule, CampusesModule, RolesModule],
})
export class IdentityModule {}
