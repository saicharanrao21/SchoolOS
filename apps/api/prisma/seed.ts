import { PrismaClient, UserStatus, AcademicYearStatus } from '@prisma/client';
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
    'campus.read', 'campus.create', 'campus.update', 'campus.archive',
    'user.read', 'user.create', 'user.update', 'user.disable',
    'role.read', 'role.manage',
    'audit.read',
    'academic_year.read', 'academic_year.create', 'academic_year.update',
    'class.read', 'class.create', 'class.update',
    'department.read', 'department.create', 'location.read', 'location.create',
    'attendance.read', 'attendance.mark', 'attendance.lock', 'attendance.correct', 'attendance.approve', 'attendance.policy.manage',
    'leave.read', 'leave.request', 'leave.approve', 'leave.manage', 'leave.policy.manage'
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

  // 6. Create a Demo School
  const demoSchool = await prisma.school.upsert({
    where: { id: 'demo-school-id' }, // Just for deterministic seeding
    update: {},
    create: {
      id: 'demo-school-id',
      name: 'Global Academy',
      displayName: 'Global Academy High',
      code: 'GA-01',
      organizationId: systemOrg.id,
    },
  });

  // 7. Create Academic Year
  let ay = await prisma.academicYear.findFirst({
    where: { schoolId: demoSchool.id, name: '2026-27' },
  });

  if (!ay) {
    ay = await prisma.academicYear.create({
      data: {
        name: '2026-27',
        startDate: new Date('2026-08-01'),
        endDate: new Date('2027-05-31'),
        status: AcademicYearStatus.ACTIVE,
        isCurrent: true,
        schoolId: demoSchool.id,
      },
    });
  }

  // 8. Create Classes
  for (let i = 1; i <= 10; i++) {
    const cls = await prisma.class.upsert({
      where: { schoolId_name_academicYearId: { schoolId: demoSchool.id, name: `Grade ${i}`, academicYearId: ay.id } },
      update: {},
      create: {
        name: `Grade ${i}`,
        sequence: i,
        schoolId: demoSchool.id,
        academicYearId: ay.id,
      },
    });

    // Create Sections
    for (const secName of ['A', 'B']) {
      await prisma.section.upsert({
        where: { classId_name: { classId: cls.id, name: secName } },
        update: {},
        create: {
          name: secName,
          classId: cls.id,
          capacity: 30,
        },
      });
    }
  }

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
