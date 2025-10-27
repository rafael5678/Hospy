'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Stethoscope, Calendar, Activity, LogOut, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalConsultations: 0
  });

  useEffect(() => {
    // Verificar si está autenticado
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    
    if (!token || !admin) {
      router.push('/admin/login');
      return;
    }

    setAdminData(JSON.parse(admin));
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        fetch('/api/patients/stats'),
        fetch('/api/doctors/stats')
      ]);

      const patients = await patientsRes.json();
      const doctors = await doctorsRes.json();

      if (patients.success && doctors.success) {
        setStats({
          totalPatients: patients.data.totalPatients || 0,
          totalDoctors: doctors.data.totalDoctors || 0,
          totalAppointments: 0,
          totalConsultations: 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/login');
  };

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administrador</h1>
                <p className="text-xs text-gray-600">Sistema Hospy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{adminData.fullName}</p>
                <p className="text-xs text-purple-600">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {adminData.fullName}! 👋
          </h2>
          <p className="text-gray-600">Gestiona todo el sistema desde aquí.</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Pacientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Médicos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDoctors}</p>
              </div>
              <Stethoscope className="w-12 h-12 text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Citas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAppointments}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Consultas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalConsultations}</p>
              </div>
              <Activity className="w-12 h-12 text-orange-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/patients"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ver Pacientes</p>
                <p className="text-xs text-gray-600">Gestionar todos los pacientes</p>
              </div>
            </a>

            <a
              href="/doctors/new"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 cursor-pointer"
            >
              <Stethoscope className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Crear Médico</p>
                <p className="text-xs text-gray-600">Registrar nuevo médico</p>
              </div>
            </a>

            <a
              href="/appointments"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 cursor-pointer"
            >
              <Calendar className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Citas Médicas</p>
                <p className="text-xs text-gray-600">Ver todas las citas</p>
              </div>
            </a>

            <a
              href="/consultations"
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 cursor-pointer"
            >
              <Activity className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Consultas</p>
                <p className="text-xs text-gray-600">Historial de consultas</p>
              </div>
            </a>

            <a
              href="/statistics"
              className="flex items-center gap-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200 cursor-pointer"
            >
              <Activity className="w-6 h-6 text-pink-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Estadísticas</p>
                <p className="text-xs text-gray-600">Ver reportes completos</p>
              </div>
            </a>

            <a
              href="/settings"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
            >
              <Shield className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Configuración</p>
                <p className="text-xs text-gray-600">Ajustes del sistema</p>
              </div>
            </a>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Sistema Hospy</h3>
              <p className="text-purple-100">Control total del sistema hospitalario</p>
            </div>
            <Shield className="w-16 h-16 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

