'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pill, ArrowLeft, User, Stethoscope, Calendar, FileText } from 'lucide-react';

interface Prescription {
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
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  diagnosis: string;
  notes?: string;
  status: string;
  validUntil: string;
  createdAt: string;
}

export default function PrescriptionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescription();
  }, []);

  const fetchPrescription = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setPrescription(data.data);
      } else {
        alert('Receta no encontrada');
        router.push('/dashboard/prescriptions');
      }
    } catch (error) {
      console.error('Error al cargar receta:', error);
      alert('Error al cargar receta');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando receta...</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return null;
  }

  const isValid = new Date(prescription.validUntil) > new Date();

  return (
    <div className="ml-64 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/prescriptions"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a recetas
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-4">
                <Pill className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Receta Médica</h1>
                <p className="text-gray-600 mt-1">
                  Emitida el {new Date(prescription.date).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isValid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {isValid ? 'Vigente' : 'Vencida'}
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
                  {prescription.patient.firstName} {prescription.patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{prescription.patient.email}</p>
              </div>
              <Link
                href={`/dashboard/patients/${prescription.patient._id}`}
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
              Médico Prescriptor
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-gray-800 font-medium text-lg">
                  Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Especialidad</p>
                <p className="text-purple-600 font-medium">{prescription.doctor.specialty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Diagnóstico
          </h2>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{prescription.diagnosis}</p>
        </div>

        {/* Medicamentos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Pill className="w-6 h-6 text-green-600" />
            Medicamentos Prescritos
          </h2>
          <div className="space-y-4">
            {prescription.medications.map((med, index) => (
              <div key={index} className="border border-green-200 bg-green-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                    <p className="text-green-600 font-medium text-lg">{med.dosage}</p>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    #{index + 1}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Frecuencia</p>
                    <p className="text-gray-800 font-medium">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duración</p>
                    <p className="text-gray-800 font-medium">{med.duration}</p>
                  </div>
                </div>

                {med.instructions && (
                  <div className="mt-4 bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Instrucciones Especiales</p>
                    <p className="text-gray-700">{med.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        {prescription.notes && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notas Adicionales</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{prescription.notes}</p>
          </div>
        )}

        {/* Validez */}
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${
          isValid 
            ? 'bg-gradient-to-r from-green-600 to-blue-600' 
            : 'bg-gradient-to-r from-red-600 to-orange-600'
        } text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Validez de la Receta</h2>
              <p className="text-white/90">
                Válida hasta: {new Date(prescription.validUntil).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Calendar className="w-12 h-12 opacity-20" />
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🖨️ Imprimir Receta
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📧 Enviar por Email
            </button>
            <Link
              href={`/dashboard/patients/${prescription.patient._id}`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              👤 Ver Paciente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

