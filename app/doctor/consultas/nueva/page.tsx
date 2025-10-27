'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, ArrowLeft, Save, User, FileText } from 'lucide-react';
import Link from 'next/link';

export default function NuevaConsultaPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    chiefComplaint: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    const doctorData = localStorage.getItem('doctorData');
    
    if (!token || !doctorData) {
      router.push('/doctor/login');
      return;
    }
    
    const parsedDoctor = JSON.parse(doctorData);
    setDoctor(parsedDoctor);
    fetchPatients();
  }, [router]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const consultationData = {
        ...formData,
        doctorId: doctor.id,
        consultationDate: new Date().toISOString(),
        status: 'Completada'
      };

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationData)
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Consulta registrada exitosamente!');
        router.push('/doctor/dashboard');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al registrar consulta:', error);
      alert('Error al registrar la consulta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vitalSigns.')) {
      const vitalSign = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [vitalSign]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard" className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <ClipboardList className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Nueva Consulta</h1>
                  <p className="text-green-100 text-sm">Registrar consulta médica</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Paciente */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Información del Paciente
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Paciente *
              </label>
              <select
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">-- Seleccione un paciente --</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName} - {patient.phone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Signos Vitales */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Signos Vitales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Arterial
                </label>
                <input
                  type="text"
                  name="vitalSigns.bloodPressure"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80 mmHg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="72 bpm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="36.5 °C"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="text"
                  name="vitalSigns.weight"
                  value={formData.vitalSigns.weight}
                  onChange={handleChange}
                  placeholder="70 kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="text"
                  name="vitalSigns.height"
                  value={formData.vitalSigns.height}
                  onChange={handleChange}
                  placeholder="170 cm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Consulta */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-green-600" />
              Detalles de la Consulta
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de Consulta *
                </label>
                <input
                  type="text"
                  name="chiefComplaint"
                  required
                  value={formData.chiefComplaint}
                  onChange={handleChange}
                  placeholder="Dolor de cabeza, fiebre, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Síntomas *
                </label>
                <textarea
                  name="symptoms"
                  required
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descripción detallada de los síntomas..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico *
                </label>
                <textarea
                  name="diagnosis"
                  required
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Diagnóstico médico..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento *
                </label>
                <textarea
                  name="treatment"
                  required
                  value={formData.treatment}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Medicamentos recetados, dosis, instrucciones..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="Observaciones adicionales, recomendaciones..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end bg-white rounded-xl shadow-md p-6">
            <Link
              href="/doctor/dashboard"
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
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
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

