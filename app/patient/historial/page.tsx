'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft, User, Calendar, Activity, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Consultation {
  _id: string;
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
  };
  consultationDate: string;
  chiefComplaint: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
  };
  notes?: string;
  status: string;
}

export default function PatientHistorialPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const patientData = localStorage.getItem('patientData');
    
    if (!token || !patientData) {
      router.push('/patient/login');
      return;
    }
    
    const parsedPatient = JSON.parse(patientData);
    setPatient(parsedPatient);
    fetchConsultations(parsedPatient.id);
  }, [router]);

  const fetchConsultations = async (patientId: string) => {
    try {
      const response = await fetch(`/api/consultations?patientId=${patientId}`);
      const data = await response.json();
      
      if (data.success) {
        setConsultations(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Completada': 'bg-green-100 text-green-800',
      'En Proceso': 'bg-yellow-100 text-yellow-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard" className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Mi Historial Médico</h1>
                  <p className="text-green-100 text-sm">Registro completo de consultas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Resumen del Paciente */}
        {patient && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre Completo</p>
                <p className="font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Sangre</p>
                <p className="font-semibold text-red-600">{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-semibold text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{patient.email || 'No registrado'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <Activity className="w-10 h-10 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{consultations.length}</span>
            </div>
            <p className="text-gray-600 font-medium mt-2">Consultas Totales</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <User className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">
                {new Set(consultations.map(c => c.doctor.firstName + c.doctor.lastName)).size}
              </span>
            </div>
            <p className="text-gray-600 font-medium mt-2">Médicos Diferentes</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <FileText className="w-10 h-10 text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">
                {consultations.filter(c => c.status === 'Completada').length}
              </span>
            </div>
            <p className="text-gray-600 font-medium mt-2">Completadas</p>
          </div>
        </div>

        {/* Lista de Consultas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Historial de Consultas</h2>
          
          {consultations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tienes consultas registradas</p>
            </div>
          ) : (
            <div className="space-y-6">
              {consultations.map((consultation) => (
                <div 
                  key={consultation._id} 
                  className="border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-md transition-all"
                >
                  {/* Encabezado */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 rounded-lg p-3">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
                        </h3>
                        <p className="text-sm text-green-600">{consultation.doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(consultation.consultationDate), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>

                  {/* Signos Vitales (si existen) */}
                  {consultation.vitalSigns && Object.values(consultation.vitalSigns).some(v => v) && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Signos Vitales</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {consultation.vitalSigns.bloodPressure && (
                          <div>
                            <p className="text-xs text-gray-500">Presión</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vitalSigns.bloodPressure}</p>
                          </div>
                        )}
                        {consultation.vitalSigns.heartRate && (
                          <div>
                            <p className="text-xs text-gray-500">Pulso</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vitalSigns.heartRate}</p>
                          </div>
                        )}
                        {consultation.vitalSigns.temperature && (
                          <div>
                            <p className="text-xs text-gray-500">Temperatura</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vitalSigns.temperature}</p>
                          </div>
                        )}
                        {consultation.vitalSigns.weight && (
                          <div>
                            <p className="text-xs text-gray-500">Peso</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vitalSigns.weight}</p>
                          </div>
                        )}
                        {consultation.vitalSigns.height && (
                          <div>
                            <p className="text-xs text-gray-500">Altura</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vitalSigns.height}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Motivo y Síntomas */}
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Motivo de Consulta</p>
                      <p className="text-sm text-gray-700">{consultation.chiefComplaint}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Síntomas</p>
                      <p className="text-sm text-gray-700">{consultation.symptoms}</p>
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <p className="text-xs text-gray-500 uppercase font-semibold">Diagnóstico</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{consultation.diagnosis}</p>
                  </div>

                  {/* Tratamiento */}
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-500 uppercase font-semibold">Tratamiento</p>
                    </div>
                    <p className="text-sm text-gray-900">{consultation.treatment}</p>
                  </div>

                  {/* Notas */}
                  {consultation.notes && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Notas Adicionales</p>
                      <p className="text-sm text-gray-700">{consultation.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

