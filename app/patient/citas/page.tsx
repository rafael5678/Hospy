'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Clock, User, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Appointment {
  _id: string;
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
    phone: string;
  };
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: string;
  type: string;
}

export default function PatientCitasPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // todas, proximas, pasadas

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const patientData = localStorage.getItem('patientData');
    
    if (!token || !patientData) {
      router.push('/patient/login');
      return;
    }
    
    const parsedPatient = JSON.parse(patientData);
    setPatient(parsedPatient);
    fetchAppointments(parsedPatient.id);
  }, [router]);

  const fetchAppointments = async (patientId: string) => {
    try {
      const response = await fetch(`/api/appointments?patientId=${patientId}`);
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
    
    if (filter === 'proximas') {
      return aptDate >= today;
    } else if (filter === 'pasadas') {
      return aptDate < today;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
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
              <Link href="/patient/dashboard" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Mis Citas Médicas</h1>
                  <p className="text-blue-100 text-sm">Consulta y gestiona tus citas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón de Agendar */}
        <div className="mb-6">
          <Link
            href="/patient/citas/nueva"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg font-semibold"
          >
            <Calendar className="w-5 h-5" />
            Agendar Nueva Cita
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
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
                onClick={() => setFilter('proximas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'proximas' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Próximas
              </button>
              <button
                onClick={() => setFilter('pasadas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pasadas' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pasadas
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-gray-900">{filteredAppointments.length}</span> citas
            </div>
          </div>
        </div>

        {/* Lista de Citas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Citas</h2>
          
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                No tienes citas {filter === 'proximas' ? 'próximas' : filter === 'pasadas' ? 'pasadas' : 'programadas'}
              </p>
              <Link 
                href="/patient/citas/nueva"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Agendar Nueva Cita
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Fecha */}
                    <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[80px]">
                      <p className="text-2xl font-bold text-blue-600">
                        {format(new Date(appointment.appointmentDate), 'd')}
                      </p>
                      <p className="text-sm text-blue-600 uppercase">
                        {format(new Date(appointment.appointmentDate), 'MMM', { locale: es })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {format(new Date(appointment.appointmentDate), 'yyyy')}
                      </p>
                    </div>

                    {/* Información */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                          </h3>
                          <p className="text-sm text-blue-600 mt-1">{appointment.doctor.specialty}</p>
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
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{appointment.doctor.phone}</span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Motivo:</span> {appointment.reason}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-semibold">Tipo:</span> {appointment.type}
                        </p>
                      </div>

                      {appointment.status === 'Confirmada' && new Date(appointment.appointmentDate) > new Date() && (
                        <div className="mt-4 flex gap-2">
                          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold">
                            Cancelar Cita
                          </button>
                          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
                            Reagendar
                          </button>
                        </div>
                      )}
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

