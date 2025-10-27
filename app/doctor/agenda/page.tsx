'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Stethoscope, Clock, User, ArrowLeft, Filter, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Appointment {
  _id: string;
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: string;
  type: string;
}

export default function DoctorAgendaPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // todas, hoy, semana

  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    const doctorData = localStorage.getItem('doctorData');
    
    if (!token || !doctorData) {
      router.push('/doctor/login');
      return;
    }
    
    const parsedDoctor = JSON.parse(doctorData);
    setDoctor(parsedDoctor);
    fetchAppointments(parsedDoctor.id);
  }, [router]);

  const fetchAppointments = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/appointments?doctorId=${doctorId}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    if (!confirm('¿Confirmar esta cita médica?')) return;
    
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmada' })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Cita confirmada exitosamente');
        fetchAppointments(doctor.id);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      alert('Error al confirmar la cita');
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    const reason = prompt('¿Por qué rechazas esta cita? (opcional)');
    
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Cancelada',
          cancelReason: reason || 'Rechazada por el doctor'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('❌ Cita rechazada');
        fetchAppointments(doctor.id);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al rechazar cita:', error);
      alert('Error al rechazar la cita');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Confirmada': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'Completada': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.appointmentDate);
    
    if (filter === 'hoy') {
      return aptDate.toDateString() === today.toDateString();
    } else if (filter === 'semana') {
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return aptDate >= today && aptDate <= weekFromNow;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Mi Agenda</h1>
                  <p className="text-blue-100 text-sm">Gestión de citas médicas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'todas' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('hoy')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'hoy' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setFilter('semana')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'semana' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Esta Semana
              </button>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-gray-600">
                Total: <span className="font-bold text-gray-900">{filteredAppointments.length}</span> citas
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Citas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Citas Programadas</h2>
          
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tienes citas {filter === 'hoy' ? 'para hoy' : filter === 'semana' ? 'esta semana' : 'programadas'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* Fecha */}
                      <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[80px]">
                        <p className="text-2xl font-bold text-blue-600">
                          {format(new Date(appointment.appointmentDate), 'd')}
                        </p>
                        <p className="text-sm text-blue-600 uppercase">
                          {format(new Date(appointment.appointmentDate), 'MMM', { locale: es })}
                        </p>
                      </div>

                      {/* Información */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <User className="w-5 h-5 text-gray-600" />
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">📞 {appointment.patient.phone}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Stethoscope className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{appointment.type}</span>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Motivo:</span> {appointment.reason}
                          </p>
                        </div>

                        {/* Botones de Acción */}
                        {appointment.status === 'Pendiente' && (
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => handleConfirmAppointment(appointment._id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                            >
                              <Check className="w-4 h-4" />
                              Confirmar Cita
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(appointment._id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                            >
                              <X className="w-4 h-4" />
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

