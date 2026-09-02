import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../theme/app_theme.dart';
import '../../networking/api_client.dart';
import '../parent/data/repositories/parent_repository.dart';
import '../parent/presentation/bloc/parent_bloc.dart';
import '../parent/presentation/bloc/parent_event.dart';
import '../parent/presentation/pages/parent_home_page.dart';
import '../parent/presentation/pages/parent_academics_page.dart';
import '../parent/presentation/pages/parent_attendance_page.dart';
import '../parent/presentation/pages/parent_exams_page.dart';
import '../parent/presentation/pages/parent_fees_page.dart';
import '../parent/presentation/pages/parent_transport_page.dart';
import '../parent/presentation/pages/parent_profile_page.dart';
import '../parent/presentation/pages/parent_notifications_page.dart';
import '../teacher/data/repositories/teacher_repository.dart';
import '../teacher/presentation/bloc/teacher_bloc.dart';
import '../teacher/presentation/bloc/teacher_event.dart';
import '../teacher/presentation/pages/teacher_home_page.dart';
import '../teacher/presentation/pages/teacher_classes_page.dart';
import '../teacher/presentation/pages/teacher_timetable_page.dart';
import '../student/data/repositories/student_repository.dart';
import '../student/presentation/bloc/student_bloc.dart';
import '../student/presentation/bloc/student_event.dart';
import '../student/presentation/pages/student_home_page.dart';
import '../student/presentation/pages/student_academics_page.dart';
import '../student/presentation/pages/student_tasks_page.dart';
import '../student/presentation/pages/student_results_page.dart';
import '../student/presentation/pages/student_attendance_page.dart';
import '../student/presentation/pages/student_exams_page.dart';
import '../student/presentation/pages/student_transport_page.dart';

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
  bool _showProfile = false;

  @override
  Widget build(BuildContext context) {
    String title = widget.title;
    if (_showNotifications) title = 'Notifications';
    if (_showProfile) title = 'My Profile';

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navyColor, fontSize: 20)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        leading: (_showNotifications || _showProfile) 
          ? IconButton(
              icon: const Icon(Icons.arrow_back, color: AppTheme.navyColor), 
              onPressed: () => setState(() { _showNotifications = false; _showProfile = false; })
            ) 
          : null,
        actions: [
          if (!_showNotifications && !_showProfile)
            IconButton(
              icon: const Icon(Icons.notifications_none_rounded, color: AppTheme.navyColor),
              onPressed: () => setState(() => _showNotifications = true),
            ),
          if (!_showProfile)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: GestureDetector(
                onTap: () => setState(() => _showProfile = true),
                child: const CircleAvatar(
                  radius: 18,
                  backgroundColor: AppTheme.primaryColor,
                  child: Text('JD', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _showNotifications 
          ? const ParentNotificationsPage() 
          : _showProfile 
            ? const ParentProfilePage()
            : widget.pages[_selectedIndex],
      ),
      bottomNavigationBar: (_showNotifications || _showProfile) ? null : Container(
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
    final apiClient = ApiClient(baseUrl: 'http://localhost:3000/api/v1'); 
    final repository = ParentRepository(apiClient: apiClient);

    return BlocProvider(
      create: (context) => ParentBloc(repository: repository)..add(LoadChildren()),
      child: const RoleShell(
        title: 'Parent Portal',
        destinations: [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Attendance'),
          NavigationDestination(icon: Icon(Icons.school_outlined), selectedIcon: Icon(Icons.school), label: 'Academics'),
          NavigationDestination(icon: Icon(Icons.assignment_turned_in_outlined), selectedIcon: Icon(Icons.assignment_turned_in), label: 'Exams'),
          NavigationDestination(icon: Icon(Icons.account_balance_wallet_outlined), selectedIcon: Icon(Icons.account_balance_wallet), label: 'Fees'),
          NavigationDestination(icon: Icon(Icons.directions_bus_outlined), selectedIcon: Icon(Icons.directions_bus), label: 'Transport'),
        ],
        pages: [
          ParentHomePage(),
          ParentAttendancePage(),
          ParentAcademicsPage(),
          ParentExamsPage(),
          ParentFeesPage(),
          ParentTransportPage(),
        ],
      ),
    );
  }
}

class TeacherShell extends StatelessWidget {
  const TeacherShell({super.key});
  
  @override
  Widget build(BuildContext context) {
    final apiClient = ApiClient(baseUrl: 'http://localhost:3000/api/v1'); 
    final repository = TeacherRepository(apiClient: apiClient);

    return BlocProvider(
      create: (context) => TeacherBloc(repository: repository)..add(LoadTeacherDashboard()),
      child: const RoleShell(
        title: 'Teacher Portal',
        destinations: [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.class_outlined), selectedIcon: Icon(Icons.class_), label: 'Classes'),
          NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Schedule'),
          NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Homework'),
        ],
        pages: [
          TeacherHomePage(),
          TeacherClassesPage(),
          TeacherTimetablePage(),
          Center(child: Text('Homework Management')),
        ],
      ),
    );
  }
}

class StudentShell extends StatelessWidget {
  const StudentShell({super.key});

  @override
  Widget build(BuildContext context) {
    final apiClient = ApiClient(baseUrl: 'http://localhost:3000/api/v1'); 
    final repository = StudentRepository(apiClient: apiClient);

    return BlocProvider(
      create: (context) => StudentBloc(repository: repository)..add(LoadStudentDashboard()),
      child: const RoleShell(
        title: 'My Student Portal',
        destinations: [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.school_outlined), selectedIcon: Icon(Icons.school), label: 'Academics'),
          NavigationDestination(icon: Icon(Icons.assignment_turned_in_outlined), selectedIcon: Icon(Icons.assignment_turned_in), label: 'Tasks'),
          NavigationDestination(icon: Icon(Icons.analytics_outlined), selectedIcon: Icon(Icons.analytics), label: 'Results'),
          NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Attendance'),
          NavigationDestination(icon: Icon(Icons.directions_bus_outlined), selectedIcon: Icon(Icons.directions_bus), label: 'Transport'),
        ],
        pages: [
          StudentHomePage(),
          StudentAcademicsPage(),
          StudentTasksPage(),
          StudentResultsPage(),
          StudentAttendancePage(),
          StudentTransportPage(),
        ],
      ),
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
        Card(
          child: ListTile(
            title: const Text('Calculus Worksheet', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text('Due Tomorrow'),
            trailing: const Text('Pending', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
          ),
        ),
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
        NavigationDestination(icon: Icon(Icons.route_outlined), selectedIcon: Icon(Icons.route), label: 'My Trip'),
        NavigationDestination(icon: Icon(Icons.people_outline), selectedIcon: Icon(Icons.people), label: 'Manifest'),
        NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
      ],
      pages: [
        const DriverTripAction(),
        Center(child: Text('Student Manifest')),
        Center(child: Text('Driver Profile')),
      ],
    );
  }
}

class DriverTripAction extends StatelessWidget {
  const DriverTripAction({super.key});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('Assigned Trip', style: TextStyle(color: Colors.black54)),
          const Text('North City Express', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.navyColor)),
          const Text('Direction: PICKUP • 01 Sept', style: TextStyle(fontSize: 14, color: Colors.black38)),
          const Spacer(),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.blue[50],
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.blue[100]!),
            ),
            child: Column(
              children: [
                const Icon(Icons.gps_fixed, size: 48, color: Colors.blue),
                const SizedBox(height: 16),
                const Text('GPS Tracking Ready', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
                const Text('Location updates will start with the trip.', style: TextStyle(fontSize: 12, color: Colors.blueGrey)),
              ],
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20),
              backgroundColor: Colors.green,
            ),
            onPressed: () {},
            child: const Text('START TRIP', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 16),
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20),
              side: const BorderSide(color: Colors.red),
              foregroundColor: Colors.red,
            ),
            onPressed: () {},
            child: const Text('EMERGENCY SOS', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
