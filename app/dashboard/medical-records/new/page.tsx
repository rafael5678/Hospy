'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FolderOpen, ArrowLeft, Save } from 'lucide-react';

export default function NewMedicalRecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('consultationId');
  const patientId = searchParams.get('patientId');
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!(consultationId || patientId));
  
  const [formData, setFormData] = useState({
    patient: patientId || '',
    doctor: '',
    consultation: consultationId || '',
    recordType: 'Historia Clínica',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  useEffect(() => {
    if (consultationId) {
      fetchConsultation();
    } else {
      setLoadingData(false);
    }
  }, [consultationId]);

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          patient: data.data.patient._id,
          doctor: data.data.doctor._id,
          diagnosis: data.data.diagnosis || '',
          treatment: data.data.treatment || '',
        }));
      }
    } catch (error) {
      console.error('Error al cargar consulta:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('¡Historia clínica creada exitosamente!');
        router.push('/dashboard/medical-records');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear historia clínica');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const recordTypes = [
    'Historia Clínica',
    'Informe Médico',
    'Resultados de Laboratorio',
    'Imagenología',
    'Cirugía',
    'Hospitalización',
    'Emergencia',
    'Seguimiento',
    'Otro'
  ];

  if (loadingData) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/medical-records"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a historias clínicas
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <FolderOpen className="w-10 h-10 text-purple-600" />
            Nueva Historia Clínica
          </h1>
          <p className="text-gray-600 mt-2">Registra un nuevo evento médico del paciente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Registro *
                </label>
                <select
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {recordTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información Médica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico *
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Diagnóstico médico detallado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento *
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Plan de tratamiento aplicado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Observaciones, evolución, comentarios..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard/medical-records"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Crear Historia Clínica
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

