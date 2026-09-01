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
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/management/dashboard' },
  { label: 'Organizations', icon: ShieldCheck, href: '/management/organizations' },
  { label: 'Schools', icon: School, href: '/management/schools' },
  { label: 'Campuses', icon: MapPin, href: '/management/campuses' },
  { label: 'Users', icon: Users, href: '/management/users' },
  { label: 'Audit Logs', icon: History, href: '/management/audit' },
  { label: 'Settings', icon: Settings, href: '/management/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar-background flex flex-col h-screen text-sidebar-foreground transition-all duration-300 ease-in-out">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold text-white tracking-tight">SchoolOS</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-active text-sidebar-activeForeground shadow-sm"
                  : "hover:bg-sidebar-active/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-white"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-active/50">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
