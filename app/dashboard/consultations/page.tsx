'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardList, Plus, User, Stethoscope, Calendar, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Consultation {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  doctor: {
    _id: string;
    firstName: string;
    lastName: string;
    specialty: string;
  };
  consultationDate: string;
  chiefComplaint: string;
  diagnosis: Array<{
    description: string;
    type: string;
  }>;
  status: string;
  vitalSigns: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
  };
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, [statusFilter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`/api/consultations?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setConsultations(data.data);
      }
    } catch (error) {
      console.error('Error al cargar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'En Curso': 'bg-yellow-100 text-yellow-800',
      'Completada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <ClipboardList className="w-10 h-10 text-blue-600" />
              Consultas Médicas
            </h1>
            <p className="text-gray-600 mt-2">Registro de consultas y diagnósticos</p>
          </div>
          <Link
            href="/dashboard/consultations/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva Consulta
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="En Curso">En Curso</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {/* Lista de Consultas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando consultas...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay consultas registradas</p>
            <Link
              href="/dashboard/consultations/new"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Registrar primera consulta
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div
                key={consultation._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-blue-500"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          {consultation.patient.firstName} {consultation.patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Stethoscope className="w-4 h-4" />
                          Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
                          <span className="text-blue-600">• {consultation.doctor.specialty}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(consultation.consultationDate), 'EEEE, d \'de\' MMMM yyyy', { locale: es })}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">
                      <span className="font-medium">Motivo de consulta:</span> {consultation.chiefComplaint}
                    </p>
                    
                    {consultation.diagnosis && consultation.diagnosis.length > 0 && (
                      <div className="mb-3">
                        <span className="font-medium text-gray-700">Diagnóstico:</span>
                        {consultation.diagnosis.map((diag, idx) => (
                          <div key={idx} className="ml-4 mt-1">
                            <span className="text-blue-600">• {diag.description}</span>
                            <span className="ml-2 text-xs text-gray-500">({diag.type})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Signos Vitales */}
                    {consultation.vitalSigns && (
                      <div className="flex gap-4 text-sm text-gray-600 mt-3 flex-wrap">
                        {consultation.vitalSigns.bloodPressureSystolic && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4 text-red-600" />
                            <span>PA: {consultation.vitalSigns.bloodPressureSystolic}/{consultation.vitalSigns.bloodPressureDiastolic}</span>
                          </div>
                        )}
                        {consultation.vitalSigns.heartRate && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <span>FC: {consultation.vitalSigns.heartRate} lpm</span>
                          </div>
                        )}
                        {consultation.vitalSigns.temperature && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4 text-orange-600" />
                            <span>Temp: {consultation.vitalSigns.temperature}°C</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex md:flex-col gap-2">
                    <Link
                      href={`/dashboard/consultations/${consultation._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver Completa
                    </Link>
                    {consultation.status === 'Completada' && (
                      <Link
                        href={`/dashboard/prescriptions/new?consultationId=${consultation._id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Recetar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

