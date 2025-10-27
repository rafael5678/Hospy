'use client';

import { FileText, Calendar } from 'lucide-react';

export default function MedicalHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Historial Médico</h1>
        <p className="text-gray-600 mt-1">
          Consulta el historial médico completo de los pacientes
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Módulo en Desarrollo
          </h2>
          <p className="text-gray-600 mb-6">
            Esta sección estará disponible próximamente. Podrás consultar y gestionar
            todo el historial médico de tus pacientes de forma detallada.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Próximamente disponible</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Consultas Médicas</h3>
          <p className="text-blue-100 text-sm">
            Registra y consulta todas las visitas médicas
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Diagnósticos</h3>
          <p className="text-green-100 text-sm">
            Historial completo de diagnósticos
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Tratamientos</h3>
          <p className="text-purple-100 text-sm">
            Seguimiento de tratamientos y medicamentos
          </p>
        </div>
      </div>
    </div>
  );
}

