'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Save } from 'lucide-react';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    consultationType: 'Presencial',
    reason: '',
    notes: '',
    status: 'Pendiente',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        fetch('/api/patients?limit=100'),
        fetch('/api/doctors?limit=100')
      ]);

      const patientsData = await patientsRes.json();
      const doctorsData = await doctorsRes.json();

      if (patientsData.success) setPatients(patientsData.data);
      if (doctorsData.success) setDoctors(doctorsData.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('¡Cita creada exitosamente!');
        router.push('/dashboard/appointments');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear cita');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loadingData) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
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
            href="/dashboard/appointments"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a citas
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Calendar className="w-10 h-10 text-blue-600" />
            Nueva Cita Médica
          </h1>
          <p className="text-gray-600 mt-2">Agenda una nueva cita para un paciente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Paciente y Médico */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Paciente y Médico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente *
                </label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                <Link
                  href="/dashboard/patients/new"
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                >
                  + Crear nuevo paciente
                </Link>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico *
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar médico...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                    </option>
                  ))}
                </select>
                <Link
                  href="/dashboard/doctors/new"
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                >
                  + Crear nuevo médico
                </Link>
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Fecha y Hora</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta *
                </label>
                <select
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Telemedicina">Telemedicina</option>
                  <option value="Urgencia">Urgencia</option>
                  <option value="Control">Control</option>
                  <option value="Primera Vez">Primera Vez</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información de la Cita */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información de la Cita</h2>
            <div className="space-y-4">
              <div>
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
                  placeholder="Describe el motivo de la consulta..."
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
                  placeholder="Información adicional, preparación necesaria, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Inicial
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información Importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-2">ℹ️ Información Importante</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• El paciente recibirá una notificación por email (si está configurado)</li>
              <li>• El médico podrá ver esta cita en su agenda</li>
              <li>• Puedes cambiar el estado de la cita después de crearla</li>
              <li>• Se recomienda confirmar las citas 24 horas antes</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard/appointments"
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
                  Crear Cita
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

