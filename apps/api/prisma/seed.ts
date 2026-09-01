import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Create System Organization
  const systemOrg = await prisma.organization.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'SchoolOS System',
      slug: 'system',
      displayName: 'SchoolOS Platform',
    },
  });

  // 2. Create Core Permissions
  const permissions = [
    'organization.read', 'organization.create', 'organization.update', 'organization.archive',
    'school.read', 'school.create', 'school.update', 'school.archive',
    'user.read', 'user.create', 'user.update', 'user.disable',
    'role.read', 'role.manage',
    'audit.read'
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p },
    });
  }

  // 3. Create SUPER_ADMIN role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'System-wide administrator',
    },
  });

  // 4. Create Initial Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@schoolos.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@schoolos.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      organizationId: systemOrg.id,
      status: UserStatus.ACTIVE,
    },
  });

  // 5. Assign Role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
