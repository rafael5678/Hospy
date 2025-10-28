'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Activity, PieChart } from 'lucide-react';
import StatCard from '@/components/StatCard';

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    hospitalized: 0,
    inactive: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/patients/stats');
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const percentage = (value: number) => {
    return stats.totalPatients > 0
      ? ((value / stats.totalPatients) * 100).toFixed(1)
      : '0';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Estadísticas</h1>
        <p className="text-gray-600 mt-1">
          Análisis y métricas del sistema hospitalario
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pacientes"
          value={stats.totalPatients}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pacientes Activos"
          value={stats.activePatients}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Hospitalizados"
          value={stats.hospitalized}
          icon={TrendingUp}
          color="orange"
        />
        <StatCard
          title="Inactivos"
          value={stats.inactive}
          icon={PieChart}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Distribución por Estado
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Activos</span>
                <span className="font-semibold text-green-600">
                  {percentage(stats.activePatients)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${percentage(stats.activePatients)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Hospitalizados</span>
                <span className="font-semibold text-orange-600">
                  {percentage(stats.hospitalized)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${percentage(stats.hospitalized)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Inactivos</span>
                <span className="font-semibold text-gray-600">
                  {percentage(stats.inactive)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-500 h-3 rounded-full transition-all"
                  style={{ width: `${percentage(stats.inactive)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Resumen General
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total de Pacientes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalPatients}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Tasa de Actividad</p>
                <p className="text-2xl font-bold text-green-600">
                  {percentage(stats.activePatients)}%
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">En Hospitalización</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.hospitalized}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <PieChart className="w-12 h-12" />
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Análisis de Datos del Sistema
            </h2>
            <p className="text-purple-100">
              Estos datos se actualizan en tiempo real y reflejan el estado actual
              de todos los pacientes registrados en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

