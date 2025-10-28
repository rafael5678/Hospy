'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, ArrowLeft, User, Stethoscope, Calendar, Activity, FileText, Edit } from 'lucide-react';

interface Consultation {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  doctor: {
    _id: string;
    firstName: string;
    lastName: string;
    specialty: string;
  };
  date: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
  };
  prescriptions: string[];
  followUpDate?: string;
  status: string;
  createdAt: string;
}

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultation();
  }, []);

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setConsultation(data.data);
      } else {
        alert('Consulta no encontrada');
        router.push('/dashboard/consultations');
      }
    } catch (error) {
      console.error('Error al cargar consulta:', error);
      alert('Error al cargar consulta');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando consulta...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  return (
    <div className="ml-64 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/consultations"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a consultas
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-4">
                <ClipboardList className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Consulta Médica</h1>
                <p className="text-gray-600 mt-1">
                  {new Date(consultation.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              consultation.status === 'Completada'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {consultation.status}
            </span>
          </div>
        </div>

        {/* Información del Paciente y Médico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Paciente */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Paciente
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-gray-800 font-medium text-lg">
                  {consultation.patient.firstName} {consultation.patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{consultation.patient.email}</p>
              </div>
              <Link
                href={`/dashboard/patients/${consultation.patient._id}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                Ver perfil completo →
              </Link>
            </div>
          </div>

          {/* Médico */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-purple-600" />
              Médico
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-gray-800 font-medium text-lg">
                  Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Especialidad</p>
                <p className="text-purple-600 font-medium">{consultation.doctor.specialty}</p>
              </div>
              <Link
                href={`/dashboard/doctors/${consultation.doctor._id}`}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mt-2"
              >
                Ver perfil completo →
              </Link>
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        {(consultation.vitalSigns.bloodPressure || consultation.vitalSigns.heartRate || 
          consultation.vitalSigns.temperature || consultation.vitalSigns.weight || 
          consultation.vitalSigns.height) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-600" />
              Signos Vitales
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {consultation.vitalSigns.bloodPressure && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Presión Arterial</p>
                  <p className="text-lg font-bold text-red-600">{consultation.vitalSigns.bloodPressure}</p>
                </div>
              )}
              {consultation.vitalSigns.heartRate && (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Frecuencia Cardíaca</p>
                  <p className="text-lg font-bold text-pink-600">{consultation.vitalSigns.heartRate}</p>
                </div>
              )}
              {consultation.vitalSigns.temperature && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Temperatura</p>
                  <p className="text-lg font-bold text-orange-600">{consultation.vitalSigns.temperature}</p>
                </div>
              )}
              {consultation.vitalSigns.weight && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Peso</p>
                  <p className="text-lg font-bold text-blue-600">{consultation.vitalSigns.weight}</p>
                </div>
              )}
              {consultation.vitalSigns.height && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Altura</p>
                  <p className="text-lg font-bold text-green-600">{consultation.vitalSigns.height}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evaluación Médica */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Evaluación Médica
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Motivo de Consulta</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{consultation.reason}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Síntomas</h3>
              <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">{consultation.symptoms}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Diagnóstico</h3>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{consultation.diagnosis}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Tratamiento</h3>
              <p className="text-gray-700 bg-green-50 p-4 rounded-lg">{consultation.treatment}</p>
            </div>

            {consultation.notes && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Notas Adicionales</h3>
                <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">{consultation.notes}</p>
              </div>
            )}

            {consultation.followUpDate && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-bold text-gray-800">Fecha de Seguimiento</p>
                    <p className="text-gray-700">
                      {new Date(consultation.followUpDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/dashboard/prescriptions/new?consultationId=${consultation._id}`}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              💊 Crear Receta
            </Link>
            <Link
              href={`/dashboard/medical-records/new?consultationId=${consultation._id}`}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              📋 Agregar a Historia Clínica
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

