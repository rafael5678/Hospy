'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    specialty: '',
    subSpecialty: '',
    dateOfBirth: '',
    gender: 'Masculino',
    address: '',
    city: '',
    education: [{ degree: '', institution: '', year: new Date().getFullYear() }],
    yearsOfExperience: 0,
    languages: ['Español'],
    consultationDuration: 30,
    consultationFee: 0,
    status: 'Activo',
    biography: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpiar campos opcionales vacíos antes de enviar
      const cleanData = { ...formData };
      
      // Si education tiene campos vacíos, no lo enviamos
      if (cleanData.education[0].degree === '' && cleanData.education[0].institution === '') {
        delete (cleanData as any).education;
      }
      
      const response = await fetch('/api/auth/doctor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Médico registrado exitosamente! Ya puede ingresar al portal médico.');
        router.push('/dashboard/doctors');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al registrar médico:', error);
      alert('Error al registrar médico');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const specialties = [
    'Cardiología',
    'Neurología',
    'Pediatría',
    'Ginecología',
    'Traumatología',
    'Medicina General',
    'Dermatología',
    'Psiquiatría',
    'Oftalmología',
    'Otorrinolaringología',
    'Endocrinología',
    'Gastroenterología',
    'Urología',
    'Oncología'
  ];

  return (
    <div className="ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/doctors"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a médicos
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Stethoscope className="w-10 h-10 text-blue-600" />
            Registrar Nuevo Médico
          </h1>
          <p className="text-gray-600 mt-2">Complete la información del nuevo médico</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Información Personal */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="doctor@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña * (para acceso al portal médico)
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="809-555-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Calle Principal 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Santo Domingo"
                />
              </div>
            </div>
          </div>

          {/* Información Profesional */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Información Profesional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Licencia *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="LIC-12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad *
                </label>
                <select
                  name="specialty"
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione una especialidad</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-especialidad
                </label>
                <input
                  type="text"
                  name="subSpecialty"
                  value={formData.subSpecialty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años de Experiencia *
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  required
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración de Consulta (minutos) *
                </label>
                <input
                  type="number"
                  name="consultationDuration"
                  required
                  min="15"
                  step="15"
                  value={formData.consultationDuration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifa de Consulta (RD$) *
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  required
                  min="0"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Breve descripción profesional del médico..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard/doctors"
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
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Registrando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Registrar Médico
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

