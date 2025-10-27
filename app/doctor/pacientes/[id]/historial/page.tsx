'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, User, Calendar, Stethoscope, FileText, Pill, 
  Activity, Heart, Thermometer, Weight, Ruler, Clock 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  email: string;
  phone: string;
  bloodType: string;
  status: string;
  allergies?: string[];
  chronicDiseases?: string[];
}

interface Appointment {
  _id: string;
  appointmentDate: string;
  startTime: string;
  reason: string;
  status: string;
  doctor: { firstName: string; lastName: string; };
}

interface Consultation {
  _id: string;
  consultationDate: Date;
  consultationType: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
}

interface Prescription {
  _id: string;
  prescriptionDate: Date;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  diagnosis: string;
}

export default function HistorialPacientePage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'citas' | 'consultas' | 'recetas'>('info');

  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    if (!token) {
      router.push('/doctor/login');
      return;
    }
    
    fetchPatientData();
  }, [patientId, router]);

  const fetchPatientData = async () => {
    try {
      // Cargar datos en paralelo
      const [patientRes, appointmentsRes, consultationsRes, prescriptionsRes] = await Promise.all([
        fetch(`/api/patients/${patientId}`),
        fetch(`/api/appointments?patientId=${patientId}`),
        fetch(`/api/consultations?patientId=${patientId}`),
        fetch(`/api/prescriptions?patientId=${patientId}`)
      ]);

      const [patientData, appointmentsData, consultationsData, prescriptionsData] = await Promise.all([
        patientRes.json(),
        appointmentsRes.json(),
        consultationsRes.json(),
        prescriptionsRes.json()
      ]);

      if (patientData.success) setPatient(patientData.data);
      if (appointmentsData.success) setAppointments(appointmentsData.data || []);
      if (consultationsData.success) setConsultations(consultationsData.data || []);
      if (prescriptionsData.success) setPrescriptions(prescriptionsData.data || []);

    } catch (error) {
      console.error('Error al cargar datos del paciente:', error);
      alert('Error al cargar el historial del paciente');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Confirmada': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'Completada': 'bg-blue-100 text-blue-800',
      'Activo': 'bg-green-100 text-green-800',
      'Hospitalizado': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Paciente no encontrado</p>
          <Link href="/doctor/pacientes" className="text-purple-600 hover:underline mt-4 inline-block">
            Volver a Mis Pacientes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/doctor/pacientes" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-4">
              <User className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  Historial Médico: {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-purple-100 text-sm">Información completa del paciente</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Información del Paciente - Resumen */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Edad</p>
                <p className="text-lg font-bold text-gray-900">{calculateAge(patient.dateOfBirth)} años</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-3">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tipo de Sangre</p>
                <p className="text-lg font-bold text-gray-900">{patient.bloodType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-3">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Estado</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Consultas</p>
                <p className="text-lg font-bold text-gray-900">{consultations.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'info'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Información General
              </div>
            </button>

            <button
              onClick={() => setActiveTab('citas')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'citas'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Citas ({appointments.length})
              </div>
            </button>

            <button
              onClick={() => setActiveTab('consultas')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'consultas'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Consultas ({consultations.length})
              </div>
            </button>

            <button
              onClick={() => setActiveTab('recetas')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'recetas'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Pill className="w-4 h-4" />
                Recetas ({prescriptions.length})
              </div>
            </button>
          </div>
        </div>

        {/* Contenido según Tab Activo */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* TAB: Información General */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Datos Personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nombre Completo</label>
                    <p className="text-base font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Fecha de Nacimiento</label>
                    <p className="text-base font-semibold text-gray-900">
                      {format(new Date(patient.dateOfBirth), 'd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Género</label>
                    <p className="text-base font-semibold text-gray-900">{patient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Teléfono</label>
                    <p className="text-base font-semibold text-gray-900">{patient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-base font-semibold text-gray-900">{patient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tipo de Sangre</label>
                    <p className="text-base font-semibold text-red-600">{patient.bloodType}</p>
                  </div>
                </div>
              </div>

              {(patient.allergies && patient.allergies.length > 0) && (
                <div>
                  <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Alergias</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(patient.chronicDiseases && patient.chronicDiseases.length > 0) && (
                <div>
                  <h3 className="text-lg font-bold text-orange-600 mb-4">🏥 Enfermedades Crónicas</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.chronicDiseases.map((disease, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Citas */}
          {activeTab === 'citas' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Citas</h3>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay citas registradas</p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div key={apt._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">
                            {format(new Date(apt.appointmentDate), 'd MMMM yyyy', { locale: es })}
                          </span>
                          <Clock className="w-4 h-4 text-gray-600 ml-2" />
                          <span className="text-gray-700">{apt.startTime}</span>
                        </div>
                        <p className="text-sm text-gray-700"><span className="font-semibold">Motivo:</span> {apt.reason}</p>
                        <p className="text-xs text-gray-600 mt-1">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Consultas */}
          {activeTab === 'consultas' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Consultas</h3>
              {consultations.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay consultas registradas</p>
                </div>
              ) : (
                consultations.map((cons) => (
                  <div key={cons._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        {format(new Date(cons.consultationDate), 'd MMMM yyyy', { locale: es })}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {cons.consultationType}
                      </span>
                    </div>
                    
                    {/* Signos Vitales */}
                    {cons.vitalSigns && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                        {cons.vitalSigns.bloodPressure && (
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-red-600" />
                            <div>
                              <p className="text-xs text-gray-600">Presión</p>
                              <p className="text-sm font-semibold">{cons.vitalSigns.bloodPressure}</p>
                            </div>
                          </div>
                        )}
                        {cons.vitalSigns.heartRate && (
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-600" />
                            <div>
                              <p className="text-xs text-gray-600">Pulso</p>
                              <p className="text-sm font-semibold">{cons.vitalSigns.heartRate} bpm</p>
                            </div>
                          </div>
                        )}
                        {cons.vitalSigns.temperature && (
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-600" />
                            <div>
                              <p className="text-xs text-gray-600">Temp</p>
                              <p className="text-sm font-semibold">{cons.vitalSigns.temperature}°C</p>
                            </div>
                          </div>
                        )}
                        {cons.vitalSigns.weight && (
                          <div className="flex items-center gap-2">
                            <Weight className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-600">Peso</p>
                              <p className="text-sm font-semibold">{cons.vitalSigns.weight} kg</p>
                            </div>
                          </div>
                        )}
                        {cons.vitalSigns.height && (
                          <div className="flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-600">Altura</p>
                              <p className="text-sm font-semibold">{cons.vitalSigns.height} cm</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Motivo de Consulta:</p>
                        <p className="text-sm text-gray-600">{cons.chiefComplaint}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Diagnóstico:</p>
                        <p className="text-sm text-gray-900 font-medium">{cons.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Tratamiento:</p>
                        <p className="text-sm text-gray-600">{cons.treatment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Recetas */}
          {activeTab === 'recetas' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Recetas</h3>
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay recetas registradas</p>
                </div>
              ) : (
                prescriptions.map((presc) => (
                  <div key={presc._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        {format(new Date(presc.prescriptionDate), 'd MMMM yyyy', { locale: es })}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700">Diagnóstico:</p>
                      <p className="text-sm text-gray-900">{presc.diagnosis}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Medicamentos:</p>
                      <div className="space-y-2">
                        {presc.medications.map((med, idx) => (
                          <div key={idx} className="bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Pill className="w-4 h-4 text-purple-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{med.name}</p>
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mt-1">
                                  <span>📊 {med.dosage}</span>
                                  <span>⏰ {med.frequency}</span>
                                  <span>📅 {med.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

