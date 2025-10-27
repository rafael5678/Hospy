'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Activity,
  FileText,
  Settings,
  Heart,
  Stethoscope,
  Calendar,
  ClipboardList,
  Pill,
  FolderOpen,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Pacientes', icon: Users, href: '/patients' },
  { name: 'Médicos', icon: Stethoscope, href: '/doctors' },
  { name: 'Citas', icon: Calendar, href: '/appointments' },
  { name: 'Consultas', icon: ClipboardList, href: '/consultations' },
  { name: 'Prescripciones', icon: Pill, href: '/prescriptions' },
  { name: 'Historias Clínicas', icon: FolderOpen, href: '/medical-records' },
  { name: 'Estadísticas', icon: Activity, href: '/statistics' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-gradient-to-b from-blue-600 to-blue-800 text-white w-64 min-h-screen p-4 fixed left-0 top-0 shadow-xl">
      <div className="flex items-center gap-3 mb-8 p-2">
        <div className="bg-white rounded-full p-2">
          <Heart className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Hospy</h1>
          <p className="text-xs text-blue-200">Sistema Hospitalario</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'hover:bg-blue-700 text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-700 transition-all text-white"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configuración</span>
        </Link>
      </div>
    </aside>
  );
}

