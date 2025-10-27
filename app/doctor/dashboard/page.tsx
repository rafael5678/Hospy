'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Calendar, ClipboardList, Users, LogOut, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  status: string;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('doctorToken');
    const doctorData = localStorage.getItem('doctorData');
    
    if (!token || !doctorData) {
      router.push('/doctor/login');
      return;
    }
    
    setDoctor(JSON.parse(doctorData));
    fetchDoctorData(JSON.parse(doctorData).id);
  }, [router]);

  const fetchDoctorData = async (doctorId: string) => {
    try {
      // Cargar citas del médico
      const appointmentsRes = await fetch(`/api/appointments?doctorId=${doctorId}&status=Confirmada`);
      const appointmentsData = await appointmentsRes.json();
      if (appointmentsData.success) {
        setAppointments(appointmentsData.data.slice(0, 5));
      }

      // Cargar consultas del médico
      const consultationsRes = await fetch(`/api/consultations?doctorId=${doctorId}`);
      const consultationsData = await consultationsRes.json();
      if (consultationsData.success) {
        setConsultations(consultationsData.data.slice(0, 5));
      }

      // Cargar pacientes del médico
      const patientsRes = await fetch(`/api/patients?limit=10`);
      const patientsData = await patientsRes.json();
      if (patientsData.success) {
        setPatients(patientsData.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorData');
    router.push('/doctor/login');
  };

  if (loading || !doctor) {
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
              <div className="bg-white rounded-full p-3">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="text-blue-100 text-sm">{doctor.specialty} • Lic. {doctor.licenseNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Fecha actual */}
        <div className="mb-8">
          <p className="text-gray-600">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">{appointments.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Citas Pendientes</p>
            <p className="text-sm text-gray-500">Próximas confirmadas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <ClipboardList className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{consultations.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Consultas Realizadas</p>
            <p className="text-sm text-gray-500">Este mes</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">{patients.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Pacientes</p>
            <p className="text-sm text-gray-500">Bajo tu cuidado</p>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas Citas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Próximas Citas
            </h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tienes citas pendientes</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt: any) => (
                  <div key={apt._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {apt.patient.firstName} {apt.patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{apt.reason}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {format(new Date(apt.appointmentDate), 'd MMM', { locale: es })} • {apt.startTime}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consultas Recientes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-green-600" />
              Consultas Recientes
            </h2>
            {consultations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay consultas registradas</p>
            ) : (
              <div className="space-y-3">
                {consultations.map((cons: any) => (
                  <div key={cons._id} className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {cons.patient.firstName} {cons.patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{cons.chiefComplaint}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(cons.consultationDate), 'd MMM yyyy', { locale: es })}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {cons.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/doctor/agenda"
              className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <p className="font-semibold">Ver Agenda</p>
              <p className="text-sm text-blue-100">Mis citas programadas</p>
            </a>
            <a
              href="/doctor/consultas/nueva"
              className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <ClipboardList className="w-6 h-6 mb-2" />
              <p className="font-semibold">Nueva Consulta</p>
              <p className="text-sm text-green-100">Registrar consulta</p>
            </a>
            <a
              href="/doctor/pacientes"
              className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <Users className="w-6 h-6 mb-2" />
              <p className="font-semibold">Mis Pacientes</p>
              <p className="text-sm text-purple-100">Ver lista completa</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

