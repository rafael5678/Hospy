'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, ArrowLeft, Save, User, Stethoscope } from 'lucide-react';

function NewConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  
  const [loading, setLoading] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(!!appointmentId);
  const [appointment, setAppointment] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointment: appointmentId || '',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
    },
    prescriptions: [] as string[],
    followUpDate: '',
    status: 'En Progreso',
  });

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointment(data.data);
        setFormData(prev => ({
          ...prev,
          patient: data.data.patient._id,
          doctor: data.data.doctor._id,
          appointment: appointmentId || '',
          reason: data.data.reason || '',
        }));
      }
    } catch (error) {
      console.error('Error al cargar cita:', error);
    } finally {
      setLoadingAppointment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('¡Consulta registrada exitosamente!');
        
        // Si viene de una cita, actualizar su estado
        if (appointmentId) {
          await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Completada' }),
          });
        }
        
        router.push('/dashboard/consultations');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar consulta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vitalSigns.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loadingAppointment) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
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
            href={appointmentId ? `/dashboard/appointments/${appointmentId}` : '/dashboard/consultations'}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {appointmentId ? 'Volver a cita' : 'Volver a consultas'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <ClipboardList className="w-10 h-10 text-blue-600" />
            Nueva Consulta Médica
          </h1>
          <p className="text-gray-600 mt-2">Registra la información de la consulta</p>
        </div>

        {/* Información de la Cita */}
        {appointment && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información de la Cita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Paciente</p>
                  <p className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Médico</p>
                  <p className="font-medium">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                </div>
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
                  Fecha de Consulta *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de Consulta *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Dolor de cabeza recurrente, fiebre..."
                />
              </div>
            </div>
          </div>

          {/* Signos Vitales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Signos Vitales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Arterial
                </label>
                <input
                  type="text"
                  name="vitalSigns.bloodPressure"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia Cardíaca
                </label>
                <input
                  type="text"
                  name="vitalSigns.heartRate"
                  value={formData.vitalSigns.heartRate}
                  onChange={handleChange}
                  placeholder="70 bpm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura
                </label>
                <input
                  type="text"
                  name="vitalSigns.temperature"
                  value={formData.vitalSigns.temperature}
                  onChange={handleChange}
                  placeholder="36.5°C"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso
                </label>
                <input
                  type="text"
                  name="vitalSigns.weight"
                  value={formData.vitalSigns.weight}
                  onChange={handleChange}
                  placeholder="70 kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura
                </label>
                <input
                  type="text"
                  name="vitalSigns.height"
                  value={formData.vitalSigns.height}
                  onChange={handleChange}
                  placeholder="170 cm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Evaluación Médica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Evaluación Médica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Síntomas *
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe los síntomas observados..."
                />
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Diagnóstico médico..."
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Plan de tratamiento..."
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
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Seguimiento
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <Link
              href={appointmentId ? `/dashboard/appointments/${appointmentId}` : '/dashboard/consultations'}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Consulta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewConsultationPage() {
  return (
    <Suspense fallback={
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <NewConsultationForm />
    </Suspense>
  );
}

