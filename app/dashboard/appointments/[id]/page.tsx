'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, User, Stethoscope, Clock, MapPin, Phone, Mail, Edit } from 'lucide-react';

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  doctor: {
    _id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  consultationType: string;
  status: string;
  reason: string;
  notes?: string;
  createdAt: string;
}

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointment(data.data);
      } else {
        alert('Cita no encontrada');
        router.push('/dashboard/appointments');
      }
    } catch (error) {
      console.error('Error al cargar cita:', error);
      alert('Error al cargar cita');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`¿Cambiar estado a ${newStatus}?`)) return;

    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Estado actualizado exitosamente');
        fetchAppointment();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando cita...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Completada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="ml-64 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a citas
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-4">
                <Calendar className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Detalles de la Cita</h1>
                <p className="text-gray-600 mt-1">
                  Creada el {new Date(appointment.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
        </div>

        {/* Información de la Cita */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Fecha y Hora */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Fecha y Hora</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(appointment.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="text-gray-800 font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tipo de Consulta */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tipo de Consulta</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Modalidad</p>
                <p className="text-gray-800 font-medium text-lg">{appointment.consultationType}</p>
              </div>
              {appointment.reason && (
                <div>
                  <p className="text-sm text-gray-500">Motivo</p>
                  <p className="text-gray-800">{appointment.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información del Paciente */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Información del Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
              <p className="text-gray-800 font-medium text-lg">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-800">{appointment.patient.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Teléfono</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-800">{appointment.patient.phone}</p>
              </div>
            </div>
            <div>
              <Link
                href={`/dashboard/patients/${appointment.patient._id}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver perfil completo →
              </Link>
            </div>
          </div>
        </div>

        {/* Información del Médico */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-purple-600" />
            Información del Médico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
              <p className="text-gray-800 font-medium text-lg">
                Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Especialidad</p>
              <p className="text-purple-600 font-medium">{appointment.doctor.specialty}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-800">{appointment.doctor.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Teléfono</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-800">{appointment.doctor.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {appointment.notes && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notas</h2>
            <p className="text-gray-700">{appointment.notes}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-4">
            {appointment.status === 'Pendiente' && (
              <>
                <button
                  onClick={() => handleStatusChange('Confirmada')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Confirmar Cita
                </button>
                <button
                  onClick={() => handleStatusChange('Cancelada')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar Cita
                </button>
              </>
            )}
            
            {appointment.status === 'Confirmada' && (
              <>
                <Link
                  href={`/dashboard/consultations/new?appointmentId=${appointment._id}`}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Iniciar Consulta
                </Link>
                <button
                  onClick={() => handleStatusChange('Completada')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Marcar Completada
                </button>
                <button
                  onClick={() => handleStatusChange('Cancelada')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar Cita
                </button>
              </>
            )}

            {appointment.status === 'Completada' && (
              <div className="text-white">
                ✅ Esta cita ya ha sido completada
              </div>
            )}

            {appointment.status === 'Cancelada' && (
              <button
                onClick={() => handleStatusChange('Pendiente')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Reactivar Cita
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

