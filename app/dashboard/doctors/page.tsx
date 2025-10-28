'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, Plus, Search, Mail, Phone, Award } from 'lucide-react';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  status: string;
  yearsOfExperience: number;
  totalConsultations: number;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [search, specialtyFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (specialtyFilter) params.append('specialty', specialtyFilter);
      
      const response = await fetch(`/api/doctors?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error('Error al cargar médicos:', error);
    } finally {
      setLoading(false);
    }
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
    'Otorrinolaringología'
  ];

  return (
    <div className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Stethoscope className="w-10 h-10 text-blue-600" />
              Médicos
            </h1>
            <p className="text-gray-600 mt-2">Gestión del personal médico</p>
          </div>
          <Link
            href="/dashboard/doctors/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Médico
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o licencia..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Médicos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando médicos...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay médicos registrados</p>
            <Link
              href="/dashboard/doctors/new"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Registrar primer médico
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Link
                key={doctor._id}
                href={`/doctors/${doctor._id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Stethoscope className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.status === 'Activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doctor.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                
                <p className="text-blue-600 font-medium mb-4">
                  {doctor.specialty}
                </p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Lic. {doctor.licenseNumber}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{doctor.totalConsultations}</p>
                    <p className="text-xs text-gray-500">Consultas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{doctor.yearsOfExperience}</p>
                    <p className="text-xs text-gray-500">Años exp.</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

