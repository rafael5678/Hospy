'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Save, Stethoscope, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  subSpecialty?: string;
  phone: string;
  consultationDuration: number;
  consultationFee: number;
}

export default function NuevaCitaPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    startTime: '',
    reason: '',
    type: 'Consulta General',
    notes: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const patientData = localStorage.getItem('patientData');
    
    if (!token || !patientData) {
      router.push('/patient/login');
      return;
    }
    
    const parsedPatient = JSON.parse(patientData);
    setPatient(parsedPatient);
    fetchDoctors();
  }, [router]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors?status=Activo');
      const data = await response.json();
      
      if (data.success) {
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar doctores:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calcular endTime basado en la duración de consulta del doctor
      const selectedDoctor = doctors.find(d => d._id === formData.doctorId);
      const duration = selectedDoctor?.consultationDuration || 30;
      
      // Convertir startTime a endTime
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const endHours = hours + Math.floor((minutes + duration) / 60);
      const endMinutes = (minutes + duration) % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

      const appointmentData = {
        patientId: patient._id || patient.id,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime,
        endTime: endTime,
        duration: duration, // Añadir duración explícitamente
        reason: formData.reason,
        type: formData.type,
        notes: formData.notes,
        status: 'Pendiente' // Las citas nuevas comienzan como pendientes
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Cita agendada exitosamente! El doctor confirmará tu cita pronto.');
        router.push('/patient/citas');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al agendar cita:', error);
      alert('Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Obtener la fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  if (loadingDoctors || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const selectedDoctor = doctors.find(d => d._id === formData.doctorId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/citas" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Agendar Nueva Cita</h1>
                  <p className="text-blue-100 text-sm">Selecciona un doctor y programa tu cita</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Paciente */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tu Información</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Paciente</p>
                <p className="font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-semibold text-gray-900">{patient.phone}</p>
              </div>
            </div>
          </div>

          {/* Selección de Doctor */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-600" />
              Seleccionar Doctor
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médico *
              </label>
              <select
                name="doctorId"
                required
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Seleccione un doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                    {doctor.subSpecialty ? ` (${doctor.subSpecialty})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Información del Doctor Seleccionado */}
            {selectedDoctor && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3">Información del Doctor</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Especialidad</p>
                    <p className="text-sm font-semibold text-blue-700">{selectedDoctor.specialty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duración de Consulta</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedDoctor.consultationDuration} minutos</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tarifa de Consulta</p>
                    <p className="text-sm font-semibold text-green-700">RD$ {selectedDoctor.consultationFee}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-600">Contacto</p>
                  <p className="text-sm font-semibold text-gray-900">📞 {selectedDoctor.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-600" />
              Fecha y Hora de la Cita
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  required
                  min={today}
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedDoctor && formData.startTime && (
                  <p className="text-xs text-gray-600 mt-2">
                    Hora de fin aproximada: {(() => {
                      const [hours, minutes] = formData.startTime.split(':').map(Number);
                      const duration = selectedDoctor.consultationDuration;
                      const endHours = hours + Math.floor((minutes + duration) / 60);
                      const endMinutes = (minutes + duration) % 60;
                      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
                    })()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la Cita */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Detalles de la Cita
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Consulta General">Consulta General</option>
                  <option value="Control">Control</option>
                  <option value="Primera Vez">Primera Vez</option>
                  <option value="Emergencia">Emergencia</option>
                  <option value="Seguimiento">Seguimiento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la Consulta *
                </label>
                <input
                  type="text"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Ej: Dolor de cabeza, Chequeo general, Fiebre, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales (Opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe brevemente tus síntomas o cualquier información adicional que el doctor deba saber..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end bg-white rounded-xl shadow-md p-6">
            <Link
              href="/patient/citas"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50 font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Agendando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Agendar Cita
                </>
              )}
            </button>
          </div>
        </form>

        {/* Información Importante */}
        <div className="mt-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-600" />
            Información Importante
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Tu cita será creada con estado <span className="font-semibold text-yellow-700">PENDIENTE</span> hasta que el doctor la confirme.</li>
            <li>• Recibirás una notificación cuando el doctor confirme tu cita.</li>
            <li>• Por favor llega <span className="font-semibold">15 minutos antes</span> de tu hora programada.</li>
            <li>• Si necesitas cancelar o reagendar, hazlo con al menos 24 horas de anticipación.</li>
            <li>• Trae contigo tu cédula de identidad y tarjeta del seguro (si aplica).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

