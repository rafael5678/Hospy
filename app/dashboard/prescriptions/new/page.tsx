'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Pill, ArrowLeft, Save, Plus, X } from 'lucide-react';

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('consultationId');
  
  const [loading, setLoading] = useState(false);
  const [loadingConsultation, setLoadingConsultation] = useState(!!consultationId);
  const [consultation, setConsultation] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    consultation: consultationId || '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      }
    ],
    notes: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
    status: 'Activa',
  });

  useEffect(() => {
    if (consultationId) {
      fetchConsultation();
    }
  }, [consultationId]);

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      const data = await response.json();
      
      if (data.success) {
        setConsultation(data.data);
        setFormData(prev => ({
          ...prev,
          patient: data.data.patient._id,
          doctor: data.data.doctor._id,
          consultation: consultationId || '',
          diagnosis: data.data.diagnosis || '',
        }));
      }
    } catch (error) {
      console.error('Error al cargar consulta:', error);
    } finally {
      setLoadingConsultation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrar medicamentos vacíos
      const cleanedMedications = formData.medications.filter(
        med => med.name.trim() !== '' && med.dosage.trim() !== ''
      );

      if (cleanedMedications.length === 0) {
        alert('Debes agregar al menos un medicamento');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          medications: cleanedMedications,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('¡Receta creada exitosamente!');
        router.push('/dashboard/prescriptions');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear receta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData(prev => ({ ...prev, medications: updatedMedications }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        }
      ]
    }));
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length === 1) {
      alert('Debe haber al menos un medicamento');
      return;
    }
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  if (loadingConsultation) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
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
            href={consultationId ? `/dashboard/consultations/${consultationId}` : '/dashboard/prescriptions'}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {consultationId ? 'Volver a consulta' : 'Volver a recetas'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Pill className="w-10 h-10 text-green-600" />
            Nueva Receta Médica
          </h1>
          <p className="text-gray-600 mt-2">Prescribe medicamentos para el paciente</p>
        </div>

        {/* Información de la Consulta */}
        {consultation && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información de la Consulta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Paciente</p>
                <p className="font-medium">{consultation.patient.firstName} {consultation.patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Médico</p>
                <p className="font-medium">Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Emisión *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Válida Hasta *
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico *
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Diagnóstico médico que justifica la prescripción..."
                />
              </div>
            </div>
          </div>

          {/* Medicamentos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Medicamentos</h2>
              <button
                type="button"
                onClick={addMedication}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Medicamento
              </button>
            </div>

            <div className="space-y-6">
              {formData.medications.map((medication, index) => (
                <div key={index} className="border border-green-200 bg-green-50 p-6 rounded-lg relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Medicamento #{index + 1}</h3>
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Medicamento *
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Ibuprofeno"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosis *
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: 400mg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia *
                      </label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Cada 8 horas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración *
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: 7 días"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instrucciones Especiales
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Tomar con alimentos, evitar alcohol..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notas Adicionales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notas Adicionales</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Recomendaciones generales, precauciones, etc..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <Link
              href={consultationId ? `/dashboard/consultations/${consultationId}` : '/dashboard/prescriptions'}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Crear Receta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

