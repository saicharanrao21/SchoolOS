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
  bool _showNotifications = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_showNotifications ? 'Notifications' : widget.title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navyColor, fontSize: 20)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        leading: _showNotifications ? IconButton(icon: const Icon(Icons.arrow_back, color: AppTheme.navyColor), onPressed: () => setState(() => _showNotifications = false)) : null,
        actions: [
          if (!_showNotifications)
            IconButton(
              icon: const Icon(Icons.notifications_none_rounded, color: AppTheme.navyColor),
              onPressed: () => setState(() => _showNotifications = true),
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
        child: _showNotifications ? const NotificationCenter() : widget.pages[_selectedIndex],
      ),
      bottomNavigationBar: _showNotifications ? null : Container(
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

class NotificationCenter extends StatelessWidget {
  const NotificationCenter({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: const [
        NotificationTile(title: 'Student Absence', body: 'Alice was marked absent today.', time: '2m ago', icon: Icons.person_off, color: Colors.red),
        NotificationTile(title: 'Fee Payment', body: 'Payment of ₹12,500 received.', time: '1h ago', icon: Icons.payments, color: Colors.green),
        NotificationTile(title: 'New Homework', body: 'Mathematics assignment posted.', time: '3h ago', icon: Icons.assignment, color: Colors.blue),
      ],
    );
  }
}

class NotificationTile extends StatelessWidget {
  final String title;
  final String body;
  final String time;
  final IconData icon;
  final Color color;

  const NotificationTile({super.key, required this.title, required this.body, required this.time, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.1),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(body, style: const TextStyle(fontSize: 12)),
        trailing: Text(time, style: const TextStyle(fontSize: 10, color: Colors.black26)),
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
        NavigationDestination(icon: Icon(Icons.school_outlined), selectedIcon: Icon(Icons.school), label: 'Academics'),
        NavigationDestination(icon: Icon(Icons.assignment_turned_in_outlined), selectedIcon: Icon(Icons.assignment_turned_in), label: 'Results'),
        NavigationDestination(icon: Icon(Icons.payments_outlined), selectedIcon: Icon(Icons.payments), label: 'Payments'),
      ],
      pages: [
        const ParentHome(),
        const ChildAcademics(),
        const ChildResults(),
        const ParentPayments(),
      ],
    );
  }
}

class ChildResults extends StatelessWidget {
  const ChildResults({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Exam Results', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 20),
        const ResultCard(examName: 'Unit Test 1', percentage: '88.5%', grade: 'A', status: 'Published'),
        const ResultCard(examName: 'Monthly Test', percentage: '72.1%', grade: 'B', status: 'Published'),
      ],
    );
  }
}

class ResultCard extends StatelessWidget {
  final String examName;
  final String percentage;
  final String grade;
  final String status;

  const ResultCard({super.key, required this.examName, required this.percentage, required this.grade, required this.status});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(examName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(status, style: const TextStyle(fontSize: 11, color: Colors.green, fontWeight: FontWeight.bold)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(percentage, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
                Text('Grade $grade', style: const TextStyle(fontSize: 10, color: Colors.black38)),
              ],
            ),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right, size: 16, color: Colors.black12),
          ],
        ),
      ),
    );
  }
}

class ChildAcademics extends StatelessWidget {
  const ChildAcademics({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Academic Progress', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 20),
        const AcademicInfoCard(title: 'Active Homework', count: '4', icon: Icons.assignment, color: Colors.blue),
        const AcademicInfoCard(title: 'Upcoming Tests', count: '2', icon: Icons.event, color: Colors.orange),
        const AcademicInfoCard(title: 'Attendance Rate', count: '94%', icon: Icons.check_circle, color: Colors.green),
        const SizedBox(height: 32),
        const Text('Today\'s Timetable', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 16),
        const ScheduleItem(time: '09:00 AM', subject: 'Mathematics', room: 'Room 302'),
        const ScheduleItem(time: '10:15 AM', subject: 'Physics', room: 'Lab 1'),
      ],
    );
  }
}

class AcademicInfoCard extends StatelessWidget {
  final String title;
  final String count;
  final IconData icon;
  final Color color;

  const AcademicInfoCard({super.key, required this.title, required this.count, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        trailing: Text(count, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.navyColor)),
      ),
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
        NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Timetable'),
        NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Homework'),
        NavigationDestination(icon: Icon(Icons.border_color_outlined), selectedIcon: Icon(Icons.border_color), label: 'Exams'),
      ],
      pages: [
        const TeacherDashboard(),
        const TeacherTimetable(),
        const TeacherHomework(),
        const TeacherExams(),
      ],
    );
  }
}

class TeacherExams extends StatelessWidget {
  const TeacherExams({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Examination Tasks', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 20),
        const ExamTaskTile(title: 'Term 1 Final - Mathematics', sub: 'Marks Entry Pending', students: '0/38'),
        const ExamTaskTile(title: 'Monthly Test - Physics', sub: 'Completed', students: '40/40'),
      ],
    );
  }
}

class ExamTaskTile extends StatelessWidget {
  final String title;
  final String sub;
  final String students;

  const ExamTaskTile({super.key, required this.title, required this.sub, required this.students});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(sub, style: const TextStyle(fontSize: 12)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(students, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            const Text('Students', style: TextStyle(fontSize: 10, color: Colors.black26)),
          ],
        ),
      ),
    );
  }
}

class TeacherTimetable extends StatelessWidget {
  const TeacherTimetable({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('My Schedule', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 20),
        const ScheduleItem(time: '08:30 AM', subject: 'Grade 10-A • Mathematics', room: 'Room 302'),
        const ScheduleItem(time: '09:15 AM', subject: 'Grade 10-B • Mathematics', room: 'Room 305'),
        const ScheduleItem(time: '10:00 AM', subject: 'Break', room: 'Staff Room'),
        const ScheduleItem(time: '10:15 AM', subject: 'Grade 9-A • Mathematics', room: 'Room 201'),
      ],
    );
  }
}

class TeacherHomework extends StatelessWidget {
  const TeacherHomework({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Assignments', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 20),
        const AssignmentTile(title: 'Calculus Worksheet', classInfo: 'Grade 10-A', submissions: '32/38', dueDate: 'Tomorrow'),
        const AssignmentTile(title: 'Geometry Project', classInfo: 'Grade 10-B', submissions: '15/40', dueDate: 'Sept 05'),
      ],
    );
  }
}

class AssignmentTile extends StatelessWidget {
  final String title;
  final String classInfo;
  final String submissions;
  final String dueDate;

  const AssignmentTile({super.key, required this.title, required this.classInfo, required this.submissions, required this.dueDate});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text('$classInfo • Due $dueDate', style: const TextStyle(fontSize: 12)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(submissions, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            const Text('Submissions', style: TextStyle(fontSize: 10, color: Colors.black26)),
          ],
        ),
      ),
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
                label: 'Next Period',
                value: 'Mathematics',
                icon: Icons.schedule,
                color: AppTheme.primaryColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        const Text('Quick Access', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
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

class StudentShell extends StatelessWidget {
  const StudentShell({super.key});
  @override
  Widget build(BuildContext context) {
    return const RoleShell(
      title: 'My Student Portal',
      destinations: [
        NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Timetable'),
        NavigationDestination(icon: Icon(Icons.assignment_turned_in_outlined), selectedIcon: Icon(Icons.assignment_turned_in), label: 'Results'),
        NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
      ],
      pages: [
        const StudentHome(),
        const TeacherTimetable(),
        const ChildResults(),
        const Center(child: Text('My Profile')),
      ],
    );
  }
}

class StudentHome extends StatelessWidget {
  const StudentHome({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Hi, Alice Johnson', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const Text('Grade 10-A', style: TextStyle(color: Colors.black54)),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.primaryColor,
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Current Period', style: TextStyle(color: Colors.white70, fontSize: 12)),
              SizedBox(height: 4),
              Text('Mathematics', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              Text('09:00 AM - 09:45 AM • Room 302', style: TextStyle(color: Colors.white70, fontSize: 13)),
            ],
          ),
        ),
        const SizedBox(height: 32),
        const Text('My Tasks', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
        const SizedBox(height: 16),
        const AssignmentTile(title: 'Calculus Worksheet', classInfo: 'Due Tomorrow', submissions: 'Pending', dueDate: ''),
      ],
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

  const StatCard({required this.label, required this.value, required this.icon, required this.color});

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
