import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class RoleShell extends StatefulWidget {
  final List<NavigationDestination> destinations;
  final List<Widget> pages;
  final String title;

  const RoleShell({
    super.key,
    required this.destinations,
    required this.pages,
    required this.title,
  });

  @override
  State<RoleShell> createState() => _RoleShellState();
}

class _RoleShellState extends State<RoleShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navyColor, fontSize: 20)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded, color: AppTheme.navyColor),
            onPressed: () {},
          ),
          const Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              radius: 18,
              backgroundColor: AppTheme.primaryColor,
              child: Text('JD', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: widget.pages[_selectedIndex],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: NavigationBar(
          height: 70,
          elevation: 0,
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) => setState(() => _selectedIndex = index),
          destinations: widget.destinations,
        ),
      ),
    );
  }
}

class ParentShell extends StatelessWidget {
  const ParentShell({super.key});
  @override
  Widget build(BuildContext context) {
    return RoleShell(
      title: 'Parent Portal',
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.child_care_outlined), selectedIcon: Icon(Icons.child_care), label: 'Children'),
        NavigationDestination(icon: Icon(Icons.payments_outlined), selectedIcon: Icon(Icons.payments), label: 'Payments'),
        NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
      ],
      pages: [
        const ParentHome(),
        const ChildrenList(),
        const ParentPayments(),
        const Center(child: Text('Profile Settings')),
      ],
    );
  }
}

class ParentPayments extends StatelessWidget {
  const ParentPayments({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Fee Summary', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.borderColor),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Outstanding Balance', style: TextStyle(color: Colors.black54, fontSize: 13)),
                      SizedBox(height: 4),
                      Text('₹15,700.00', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(15)),
                    child: const Icon(Icons.priority_high_rounded, color: Colors.orange),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {},
                child: const Text('Pay Now'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        const Text('Recent Invoices', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 16),
        const InvoiceCard(id: 'INV-2026-00124', date: 'Aug 24, 2026', amount: '₹12,500', status: 'Paid'),
        const InvoiceCard(id: 'INV-2026-00125', date: 'Aug 25, 2026', amount: '₹15,700', status: 'Pending'),
      ],
    );
  }
}

class InvoiceCard extends StatelessWidget {
  final String id;
  final String date;
  final String amount;
  final String status;

  const InvoiceCard({super.key, required this.id, required this.date, required this.amount, required this.status});

  @override
  Widget build(BuildContext context) {
    final isPaid = status == 'Paid';
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(id, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(date, style: const TextStyle(fontSize: 12)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
            const SizedBox(height: 2),
            Text(
              status, 
              style: TextStyle(
                fontSize: 10, 
                fontWeight: FontWeight.bold, 
                color: isPaid ? Colors.green : Colors.orange
              )
            ),
          ],
        ),
      ),
    );
  }
}

class ParentHome extends StatelessWidget {
  const ParentHome({super.key});
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Welcome back,', style: TextStyle(color: Colors.black54)),
          const Text('Robert Johnson', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppTheme.primaryColor, Color(0xFF60A5FA)]),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: AppTheme.primaryColor.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))],
            ),
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Next Event', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                      SizedBox(height: 4),
                      Text('Parent-Teacher Meeting', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      SizedBox(height: 4),
                      Text('Tomorrow, 10:00 AM', style: TextStyle(color: Colors.white70, fontSize: 13)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(15)),
                  child: const Icon(Icons.calendar_today, color: Colors.white),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('My Children', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
              Text('View All', style: TextStyle(color: AppTheme.primaryColor, fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 16),
          const ChildCard(name: 'Alice Johnson', grade: 'Grade 10-A', id: 'GA260001'),
          const ChildCard(name: 'Ben Johnson', grade: 'Grade 6-B', id: 'GA260124'),
        ],
      ),
    );
  }
}

class ChildCard extends StatelessWidget {
  final String name;
  final String grade;
  final String id;

  const ChildCard({super.key, required this.name, required this.grade, required this.id});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          radius: 25,
          backgroundColor: AppTheme.secondaryColor.withOpacity(0.1),
          child: Text(name[0], style: const TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold)),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(grade, style: const TextStyle(fontSize: 13)),
            Text('ID: $id', style: const TextStyle(fontSize: 11, color: Colors.black38)),
          ],
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: Colors.black26),
      ),
    );
  }
}

class ChildrenList extends StatelessWidget {
  const ChildrenList({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        ChildCard(name: 'Alice Johnson', grade: 'Grade 10-A', id: 'GA260001'),
        ChildCard(name: 'Ben Johnson', grade: 'Grade 6-B', id: 'GA260124'),
      ],
    );
  }
}

class TeacherShell extends StatelessWidget {
  const TeacherShell({super.key});
  @override
  Widget build(BuildContext context) {
    return const RoleShell(
      title: 'Teacher Portal',
      destinations: [
        NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.how_to_reg_outlined), selectedIcon: Icon(Icons.how_to_reg), label: 'Attendance'),
        NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Homework'),
        NavigationDestination(icon: Icon(Icons.menu), label: 'More'),
      ],
      pages: [
        const TeacherDashboard(),
        const AttendanceMarking(),
        Center(child: Text('Homework Assignments')),
        Center(child: Text('More Options')),
      ],
    );
  }
}

class TeacherDashboard extends StatelessWidget {
  const TeacherDashboard({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Today\'s Overview', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _QuickStat(
                label: 'Present',
                value: '38/42',
                icon: Icons.check_circle_outline,
                color: Colors.green,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _QuickStat(
                label: 'Period 3',
                value: 'Mathematics',
                icon: Icons.schedule,
                color: AppTheme.primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        const Text('Class Schedule', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 16),
        const ScheduleItem(time: '09:00 AM', subject: 'Grade 10-A • Mathematics', room: 'Room 302'),
        const ScheduleItem(time: '10:15 AM', subject: 'Grade 9-B • Physics', room: 'Lab 1'),
      ],
    );
  }
}

class _QuickStat extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _QuickStat({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          Text(label, style: const TextStyle(fontSize: 11, color: Colors.black38, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class ScheduleItem extends StatelessWidget {
  final String time;
  final String subject;
  final String room;

  const ScheduleItem({super.key, required this.time, required this.subject, required this.room});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          width: 4,
          height: 40,
          decoration: BoxDecoration(color: AppTheme.primaryColor, borderRadius: BorderRadius.circular(2)),
        ),
        title: Text(subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text('$time • $room', style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.chevron_right, color: Colors.black12),
      ),
    );
  }
}

class AttendanceMarking extends StatelessWidget {
  const AttendanceMarking({super.key});
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.borderColor)),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: 'Grade 10-A',
                      items: const [DropdownMenuItem(value: 'Grade 10-A', child: Text('Grade 10-A', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)))],
                      onChanged: null,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                style: ElevatedButton.styleFrom(minimumSize: const Size(100, 48)),
                onPressed: () {},
                child: const Text('Save'),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: 10,
            itemBuilder: (context, i) => ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              leading: const CircleAvatar(backgroundColor: AppTheme.backgroundColor, child: Text('AJ', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
              title: const Text('Student Name', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: const Text('Roll: 10-A-01', style: TextStyle(fontSize: 12)),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _StatusBtn(icon: Icons.check, color: Colors.green, isActive: i % 3 == 0),
                  const SizedBox(width: 8),
                  _StatusBtn(icon: Icons.close, color: Colors.red, isActive: i % 3 == 1),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _StatusBtn extends StatelessWidget {
  final IconData icon;
  final Color color;
  final bool isActive;
  const _StatusBtn({required this.icon, required this.color, required this.isActive});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: isActive ? color : Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isActive ? color : AppTheme.borderColor),
        boxShadow: isActive ? [BoxShadow(color: color.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))] : null,
      ),
      child: Icon(icon, size: 16, color: isActive ? Colors.white : Colors.black26),
    );
  }
}

class ManagementShell extends StatelessWidget {
  const ManagementShell({super.key});
  @override
  Widget build(BuildContext context) {
    return const RoleShell(
      title: 'Admin Console',
      destinations: [
        NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Dashboard'),
        NavigationDestination(icon: Icon(Icons.people_outline), selectedIcon: Icon(Icons.people), label: 'Students'),
        NavigationDestination(icon: Icon(Icons.account_balance_wallet_outlined), selectedIcon: Icon(Icons.account_balance_wallet), label: 'Finance'),
        NavigationDestination(icon: Icon(Icons.menu), label: 'More'),
      ],
      pages: [
        Center(child: Text('Management Dashboard')),
        Center(child: Text('Student Directory')),
        FinanceSummary(),
        Center(child: Text('Settings & Logs')),
      ],
    );
  }
}

class FinanceSummary extends StatelessWidget {
  const FinanceSummary({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Today\'s Collection', style: TextStyle(color: Colors.black54)),
        const Text('₹1,42,500', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 24),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 1.5,
          children: const [
            StatCard(label: 'Total Billed', value: '48.2L', icon: Icons.receipt_long, color: Colors.blue),
            StatCard(label: 'Collected', value: '32.5L', icon: Icons.check_circle, color: Colors.green),
            StatCard(label: 'Outstanding', value: '15.7L', icon: Icons.pending, color: Colors.orange),
            StatCard(label: 'Overdue', value: '4.2L', icon: Icons.warning, color: Colors.red),
          ],
        ),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const StatCard({super.key, required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: 20),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
              Text(label, style: const TextStyle(fontSize: 10, color: Colors.black54, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }
}

class DriverShell extends StatelessWidget {
  const DriverShell({super.key});
  @override
  Widget build(BuildContext context) {
    return const RoleShell(
      title: 'Transport Portal',
      destinations: [
        NavigationDestination(icon: Icon(Icons.route_outlined), selectedIcon: Icon(Icons.route), label: 'Route'),
        NavigationDestination(icon: Icon(Icons.people_outline), selectedIcon: Icon(Icons.people), label: 'Students'),
        NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
      ],
      pages: [
        Center(child: Text('Active Route Map')),
        Center(child: Text('Student Manifest')),
        Center(child: Text('Driver Profile')),
      ],
    );
  }
}
