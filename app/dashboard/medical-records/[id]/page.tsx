'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FolderOpen, ArrowLeft, User, Calendar, FileText, Activity } from 'lucide-react';

interface MedicalRecord {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  recordType: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  attachments?: string[];
  doctor: {
    _id: string;
    firstName: string;
    lastName: string;
    specialty: string;
  };
  createdAt: string;
}

export default function MedicalRecordDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, []);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/medical-records/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setRecord(data.data);
      } else {
        alert('Registro no encontrado');
        router.push('/dashboard/medical-records');
      }
    } catch (error) {
      console.error('Error al cargar registro:', error);
      alert('Error al cargar registro');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando historia clínica...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <div className="ml-64 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/medical-records"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a historias clínicas
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-full p-4">
                <FolderOpen className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Historia Clínica</h1>
                <p className="text-gray-600 mt-1">
                  {new Date(record.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {record.recordType}
            </span>
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
                {record.patient.firstName} {record.patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-800">{record.patient.email}</p>
            </div>
            <div className="md:col-span-2">
              <Link
                href={`/dashboard/patients/${record.patient._id}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver perfil completo del paciente →
              </Link>
            </div>
          </div>
        </div>

        {/* Información del Médico */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-600" />
            Médico Responsable
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre</p>
              <p className="text-gray-800 font-medium text-lg">
                Dr. {record.doctor.firstName} {record.doctor.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Especialidad</p>
              <p className="text-purple-600 font-medium">{record.doctor.specialty}</p>
            </div>
          </div>
        </div>

        {/* Contenido del Registro */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Detalles del Registro
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Diagnóstico</h3>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{record.diagnosis}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Tratamiento</h3>
              <p className="text-gray-700 bg-green-50 p-4 rounded-lg">{record.treatment}</p>
            </div>

            {record.notes && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Notas Médicas</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{record.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <h2 className="text-xl font-bold mb-4">Información del Registro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Tipo de Registro</p>
              <p className="text-xl font-bold">{record.recordType}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Fecha de Creación</p>
              <p className="text-xl font-bold">
                {new Date(record.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.print()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🖨️ Imprimir
            </button>
            <Link
              href={`/dashboard/patients/${record.patient._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              👤 Ver Paciente
            </Link>
            <Link
              href={`/dashboard/medical-records/new?patientId=${record.patient._id}`}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ➕ Nuevo Registro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

