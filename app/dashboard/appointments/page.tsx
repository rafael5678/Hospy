'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Plus, Clock, User, Stethoscope, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
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
  appointmentDate: string;
  startTime: string;
  reason: string;
  status: string;
  consultationType: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`/api/appointments?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Confirmada': 'bg-blue-100 text-blue-800',
      'En Curso': 'bg-purple-100 text-purple-800',
      'Completada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'No Asistió': 'bg-gray-100 text-gray-800'
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
              <Calendar className="w-10 h-10 text-blue-600" />
              Citas Médicas
            </h1>
            <p className="text-gray-600 mt-2">Gestión de citas y agendamiento</p>
          </div>
          <Link
            href="/dashboard/appointments/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva Cita
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="En Curso">En Curso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        {/* Lista de Citas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando citas...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay citas registradas</p>
            <Link
              href="/dashboard/appointments/new"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Agendar primera cita
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-blue-500"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Stethoscope className="w-4 h-4" />
                          Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                          <span className="text-blue-600">• {appointment.doctor.specialty}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(appointment.appointmentDate), 'EEEE, d \'de\' MMMM yyyy', { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.startTime}</span>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-700">
                      <span className="font-medium">Motivo:</span> {appointment.reason}
                    </p>
                    
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {appointment.consultationType}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex md:flex-col gap-2">
                    <Link
                      href={`/dashboard/appointments/${appointment._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver Detalles
                    </Link>
                    {appointment.status === 'Confirmada' && (
                      <Link
                        href={`/dashboard/consultations/new?appointmentId=${appointment._id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Iniciar Consulta
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

