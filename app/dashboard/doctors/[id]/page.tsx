'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope, ArrowLeft, Edit, Mail, Phone, Award, Calendar, MapPin, BookOpen } from 'lucide-react';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  subSpecialty?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  yearsOfExperience: number;
  consultationDuration: number;
  consultationFee: number;
  status: string;
  biography?: string;
  totalConsultations: number;
  createdAt: string;
}

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`/api/doctors/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDoctor(data.data);
      } else {
        alert('Médico no encontrado');
        router.push('/dashboard/doctors');
      }
    } catch (error) {
      console.error('Error al cargar médico:', error);
      alert('Error al cargar médico');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando médico...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="ml-64 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/doctors"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a médicos
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-4">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="text-xl text-blue-600 mt-1">{doctor.specialty}</p>
              </div>
            </div>
            
            <Link
              href={`/dashboard/doctors/${params.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <Edit className="w-5 h-5" />
              Editar
            </Link>
          </div>
        </div>

        {/* Estado */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            doctor.status === 'Activo'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {doctor.status}
          </span>
        </div>

        {/* Información Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Datos de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{doctor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-gray-800 font-medium">{doctor.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="text-gray-800 font-medium">{doctor.address}</p>
                  <p className="text-gray-600 text-sm">{doctor.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Datos Profesionales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información Profesional</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Licencia Médica</p>
                  <p className="text-gray-800 font-medium">{doctor.licenseNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Especialidad</p>
                  <p className="text-gray-800 font-medium">{doctor.specialty}</p>
                  {doctor.subSpecialty && (
                    <p className="text-gray-600 text-sm">{doctor.subSpecialty}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Años de Experiencia</p>
                  <p className="text-gray-800 font-medium">{doctor.yearsOfExperience} años</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Datos Personales */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Fecha de Nacimiento</p>
              <p className="text-gray-800 font-medium">
                {new Date(doctor.dateOfBirth).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Género</p>
              <p className="text-gray-800 font-medium">{doctor.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Fecha de Registro</p>
              <p className="text-gray-800 font-medium">
                {new Date(doctor.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Configuración de Consultas */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Configuración de Consultas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Duración de Consulta</p>
              <p className="text-gray-800 font-medium">{doctor.consultationDuration} minutos</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tarifa por Consulta</p>
              <p className="text-gray-800 font-medium">${doctor.consultationFee}</p>
            </div>
          </div>
        </div>

        {/* Biografía */}
        {doctor.biography && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Biografía
            </h2>
            <p className="text-gray-700 leading-relaxed">{doctor.biography}</p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Total de Consultas</p>
              <p className="text-3xl font-bold">{doctor.totalConsultations}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Años de Experiencia</p>
              <p className="text-3xl font-bold">{doctor.yearsOfExperience}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

