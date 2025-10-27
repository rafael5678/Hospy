'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Stethoscope, ArrowLeft, Search, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  email: string;
  phone: string;
  bloodType: string;
  status: string;
  lastVisit?: Date;
}

export default function DoctorPacientesPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        setFilteredPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
      patient.phone.includes(term) ||
      patient.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Activo': 'bg-green-100 text-green-800',
      'Inactivo': 'bg-gray-100 text-gray-800',
      'Hospitalizado': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
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
              <Link href="/doctor/dashboard" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Mis Pacientes</h1>
                  <p className="text-purple-100 text-sm">Listado completo de pacientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{filteredPatients.length}</span> paciente{filteredPatients.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Lista de Pacientes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Listado de Pacientes</h2>
          
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No se encontraron pacientes con ese criterio' : 'No tienes pacientes registrados'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPatients.map((patient) => (
                <div 
                  key={patient._id} 
                  className="border border-gray-200 rounded-lg p-6 hover:border-purple-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 rounded-full p-3">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {calculateAge(patient.dateOfBirth)} años • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                    
                    {patient.email && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{patient.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Stethoscope className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold">Tipo de Sangre: {patient.bloodType}</span>
                    </div>

                    {patient.lastVisit && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          Última visita: {format(new Date(patient.lastVisit), 'd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      href={`/doctor/pacientes/${patient._id}/historial`}
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors text-sm font-semibold text-center"
                    >
                      Ver Historial Completo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

