'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  School,
  MapPin,
  ShieldCheck,
  History,
  Settings,
  LogOut,
  Calendar,
  BookOpen,
  Layers,
  Home,
  Briefcase,
  UserPlus,
  FileText,
  Mail,
  Wallet,
  Plus,
  Landmark,
  FolderTree,
  BarChart3
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/management/dashboard' },
  {
    label: 'Admissions',
    icon: UserPlus,
    children: [
      { label: 'Dashboard', href: '/management/admissions/dashboard', icon: LayoutDashboard },
      { label: 'Leads & Enquiries', href: '/management/admissions/enquiries', icon: Mail },
      { label: 'Applications', href: '/management/admissions/applications', icon: FileText },
    ]
  },
  {
    label: 'Finance',
    icon: Wallet,
    children: [
      { label: 'Dashboard', href: '/management/finance/dashboard', icon: LayoutDashboard },
      { label: 'Fee Structures', href: '/management/finance/fee-structures', icon: Layers },
      { label: 'Invoices', href: '/management/finance/invoices', icon: FileText },
      { label: 'Collect Fee', href: '/management/finance/collect', icon: Plus },
    ]
  },
  {
    label: 'Accounting',
    icon: Landmark,
    children: [
      { label: 'Dashboard', href: '/management/accounting/dashboard', icon: LayoutDashboard },
      { label: 'Chart of Accounts', href: '/management/accounting/chart-of-accounts', icon: FolderTree },
      { label: 'Journal Entries', href: '/management/accounting/journal-entries', icon: FileText },
      { label: 'Financial Reports', href: '/management/accounting/reports', icon: BarChart3 },
    ]
  },
  { label: 'Students', icon: Users, href: '/management/students' },
  {
    label: 'Master Data',
    icon: ShieldCheck,
    children: [
      { label: 'Organizations', href: '/management/organizations', icon: ShieldCheck },
      { label: 'Schools', href: '/management/schools', icon: School },
      { label: 'Campuses', href: '/management/campuses', icon: MapPin },
      { label: 'Departments', href: '/management/departments', icon: Briefcase },
      { label: 'Locations', href: '/management/locations', icon: Home },
      { label: 'Houses', href: '/management/houses', icon: Layers },
    ]
  },
  {
    label: 'Academic Setup',
    icon: BookOpen,
    children: [
      { label: 'Academic Years', href: '/management/academic-years', icon: Calendar },
      { label: 'Classes & Sections', href: '/management/classes', icon: Layers },
      { label: 'Subjects', href: '/management/subjects', icon: BookOpen },
    ]
  },
  { label: 'Users', icon: Users, href: '/management/users' },
  { label: 'Audit Logs', icon: History, href: '/management/audit' },
  { label: 'Settings', icon: Settings, href: '/management/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar-background flex flex-col h-screen text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-white/5">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold text-white tracking-tight">SchoolOS</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <div key={item.label} className="space-y-1">
            {item.children ? (
              <>
                <div className="px-4 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  {item.label}
                </div>
                {item.children.map((child) => {
                  const isActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                        isActive
                          ? "bg-sidebar-active text-sidebar-activeForeground shadow-sm"
                          : "hover:bg-sidebar-active/50 hover:text-white"
                      )}
                    >
                      <child.icon className={cn(
                        "w-4 h-4",
                        isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-white"
                      )} />
                      <span className="font-medium text-sm">{child.label}</span>
                    </Link>
                  );
                })}
              </>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-sidebar-active text-sidebar-activeForeground shadow-sm"
                    : "hover:bg-sidebar-active/50 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  pathname === item.href ? "text-primary" : "text-sidebar-foreground group-hover:text-white"
                )} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 bg-sidebar-background/50 backdrop-blur-sm">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200">
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
