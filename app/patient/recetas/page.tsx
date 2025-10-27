'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pill, ArrowLeft, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Prescription {
  _id: string;
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
    licenseNumber: string;
  };
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  prescriptionDate: string;
  status: string;
  notes: string;
}

export default function PatientRecetasPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // todas, activas, vencidas

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const patientData = localStorage.getItem('patientData');
    
    if (!token || !patientData) {
      router.push('/patient/login');
      return;
    }
    
    const parsedPatient = JSON.parse(patientData);
    setPatient(parsedPatient);
    fetchPrescriptions(parsedPatient.id);
  }, [router]);

  const fetchPrescriptions = async (patientId: string) => {
    try {
      const response = await fetch(`/api/prescriptions?patientId=${patientId}`);
      const data = await response.json();
      
      if (data.success) {
        setPrescriptions(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Activa': 'bg-green-100 text-green-800',
      'Vencida': 'bg-red-100 text-red-800',
      'Completada': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredPrescriptions = prescriptions.filter(presc => {
    if (filter === 'activas') {
      return presc.status === 'Activa';
    } else if (filter === 'vencidas') {
      return presc.status === 'Vencida';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <Pill className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Mis Recetas Médicas</h1>
                  <p className="text-purple-100 text-sm">Historial de prescripciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'todas' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('activas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'activas' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFilter('vencidas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'vencidas' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vencidas
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-gray-900">{filteredPrescriptions.length}</span> recetas
            </div>
          </div>
        </div>

        {/* Lista de Recetas */}
        <div className="space-y-6">
          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No tienes recetas {filter === 'activas' ? 'activas' : filter === 'vencidas' ? 'vencidas' : 'registradas'}
              </p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div 
                key={prescription._id} 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
              >
                {/* Encabezado de la receta */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                      </h3>
                      <p className="text-sm text-purple-600">{prescription.doctor.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Lic. {prescription.doctor.licenseNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(prescription.prescriptionDate), "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                {/* Diagnóstico */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Diagnóstico</h4>
                  </div>
                  <p className="text-gray-700">{prescription.diagnosis}</p>
                </div>

                {/* Medicamentos */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Medicamentos Prescritos</h4>
                  </div>
                  <div className="space-y-4">
                    {prescription.medications.map((medication, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-bold text-gray-900 text-lg">{medication.name}</h5>
                            <p className="text-sm text-purple-600 font-medium">{medication.dosage}</p>
                          </div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-semibold">
                            {medication.duration}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Frecuencia</p>
                            <p className="text-sm text-gray-700">{medication.frequency}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Instrucciones</p>
                            <p className="text-sm text-gray-700">{medication.instructions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                {prescription.notes && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Notas Adicionales</p>
                    <p className="text-sm text-gray-700">{prescription.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

