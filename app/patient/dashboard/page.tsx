'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Calendar, FileText, Pill, LogOut, Bell, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  status: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('patientToken');
    const patientData = localStorage.getItem('patientData');
    
    if (!token || !patientData) {
      router.push('/patient/login');
      return;
    }
    
    setPatient(JSON.parse(patientData));
    fetchPatientData(JSON.parse(patientData).id);
  }, [router]);

  const fetchPatientData = async (patientId: string) => {
    try {
      // Cargar citas del paciente
      const appointmentsRes = await fetch(`/api/appointments?patientId=${patientId}`);
      const appointmentsData = await appointmentsRes.json();
      if (appointmentsData.success) {
        setAppointments(appointmentsData.data.slice(0, 5));
      }

      // Cargar consultas del paciente
      const consultationsRes = await fetch(`/api/consultations?patientId=${patientId}`);
      const consultationsData = await consultationsRes.json();
      if (consultationsData.success) {
        setConsultations(consultationsData.data.slice(0, 5));
      }

      // Cargar prescripciones del paciente
      const prescriptionsRes = await fetch(`/api/prescriptions?patientId=${patientId}`);
      const prescriptionsData = await prescriptionsRes.json();
      if (prescriptionsData.success) {
        setPrescriptions(prescriptionsData.data.slice(0, 5));
      }

      // Cargar historias clínicas del paciente
      const recordsRes = await fetch(`/api/medical-records?patientId=${patientId}`);
      const recordsData = await recordsRes.json();
      if (recordsData.success) {
        setMedicalRecords(recordsData.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientData');
    router.push('/patient/login');
  };

  if (loading || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  const age = Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / 31557600000);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-green-100 text-sm">
                  {age} años • Tipo de Sangre: {patient.bloodType} • Tel: {patient.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-green-700 rounded-lg transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">{appointments.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Citas</p>
            <p className="text-sm text-gray-500">Programadas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <User className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{consultations.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Consultas</p>
            <p className="text-sm text-gray-500">Historial</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Pill className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">{prescriptions.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Recetas</p>
            <p className="text-sm text-gray-500">Activas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">{medicalRecords.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Documentos</p>
            <p className="text-sm text-gray-500">Médicos</p>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas Citas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Mis Próximas Citas
              </h2>
              {appointments.length > 0 && (
                <a 
                  href="/patient/citas"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Ver todas →
                </a>
              )}
            </div>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tienes citas programadas</p>
                <a 
                  href="/patient/citas/nueva"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agendar Cita
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt: any) => (
                  <div key={apt._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Dr. {apt.doctor.firstName} {apt.doctor.lastName}
                        </p>
                        <p className="text-sm text-blue-600">{apt.doctor.specialty}</p>
                        <p className="text-sm text-gray-600 mt-1">{apt.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(apt.appointmentDate), "d 'de' MMMM", { locale: es })} • {apt.startTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        apt.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recetas Activas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Pill className="w-6 h-6 text-purple-600" />
              Mis Recetas Médicas
            </h2>
            {prescriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tienes recetas activas</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((presc: any) => (
                  <div key={presc._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          Dr. {presc.doctor.firstName} {presc.doctor.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{presc.diagnosis}</p>
                        <div className="mt-2 space-y-1">
                          {presc.medications.slice(0, 2).map((med: any, idx: number) => (
                            <p key={idx} className="text-xs text-purple-600">
                              • {med.name} - {med.dosage}
                            </p>
                          ))}
                          {presc.medications.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{presc.medications.length - 2} medicamento(s) más
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        presc.status === 'Activa' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {presc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Historial Médico Reciente */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            Historial Médico Reciente
          </h2>
          {consultations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay consultas registradas</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consultations.map((cons: any) => (
                <div key={cons._id} className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                  <p className="font-semibold text-gray-800">
                    Dr. {cons.doctor.firstName} {cons.doctor.lastName}
                  </p>
                  <p className="text-sm text-green-600">{cons.doctor.specialty}</p>
                  <p className="text-sm text-gray-600 mt-2">{cons.chiefComplaint}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(cons.consultationDate), "d 'de' MMMM yyyy", { locale: es })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/patient/citas/nueva"
              className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <p className="font-semibold">Agendar Cita</p>
              <p className="text-sm text-blue-100">Nueva cita médica</p>
            </a>
            <a
              href="/patient/recetas"
              className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <Pill className="w-6 h-6 mb-2" />
              <p className="font-semibold">Mis Recetas</p>
              <p className="text-sm text-purple-100">Ver todas</p>
            </a>
            <a
              href="/patient/historial"
              className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <FileText className="w-6 h-6 mb-2" />
              <p className="font-semibold">Mi Historial</p>
              <p className="text-sm text-green-100">Consultas médicas</p>
            </a>
            <a
              href="/patient/perfil"
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-left cursor-pointer block"
            >
              <User className="w-6 h-6 mb-2" />
              <p className="font-semibold">Mi Perfil</p>
              <p className="text-sm text-orange-100">Actualizar datos</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

