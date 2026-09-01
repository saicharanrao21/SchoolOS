import 'package:flutter_test/flutter_test.dart';
import 'package:schoolos_mobile/main.dart';

void main() {
  testWidgets('Dashboard smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const SchoolOSApp());

    // Verify that dashboard shows tablet view by default in tests (800x600)
    expect(find.text('Tablet View'), findsOneWidget);
  });
}
