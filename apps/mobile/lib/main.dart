import 'package:flutter/material.dart';
import 'core/responsive_layout.dart';

void main() {
  runApp(const SchoolOSApp());
}

class SchoolOSApp extends StatelessWidget {
  const SchoolOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SchoolOS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const RootPage(),
    );
  }
}

class RootPage extends StatelessWidget {
  const RootPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ResponsiveLayout(
        mobile: const MobileDashboard(),
        tablet: const TabletDashboard(),
        desktop: const DesktopDashboard(),
      ),
    );
  }
}

class MobileDashboard extends StatelessWidget {
  const MobileDashboard({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
      body: Center(child: Text('Mobile View')),
    );
  }
}

class TabletDashboard extends StatelessWidget {
  const TabletDashboard({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            destinations: const [
              NavigationRailDestination(icon: Icon(Icons.home), label: Text('Home')),
              NavigationRailDestination(icon: Icon(Icons.person), label: Text('Profile')),
            ],
            selectedIndex: 0,
          ),
          const VerticalDivider(thickness: 1, width: 1),
          const Expanded(child: Center(child: Text('Tablet View'))),
        ],
      ),
    );
  }
}

class DesktopDashboard extends StatelessWidget {
  const DesktopDashboard({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Drawer(
            child: ListView(
              children: const [
                ListTile(leading: Icon(Icons.home), title: Text('Home')),
                ListTile(leading: Icon(Icons.person), title: Text('Profile')),
              ],
            ),
          ),
          const Expanded(child: Center(child: Text('Desktop View'))),
        ],
      ),
    );
  }
}
