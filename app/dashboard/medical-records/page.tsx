'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, User, Stethoscope, Calendar, FileText, Image } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MedicalRecord {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  doctor: {
    _id: string;
    firstName: string;
    lastName: string;
    specialty: string;
  };
  recordType: string;
  title: string;
  description?: string;
  date: string;
  category: string;
  files: Array<{
    fileName: string;
    fileType: string;
    fileSize: number;
  }>;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [typeFilter]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append('recordType', typeFilter);
      
      const response = await fetch(`/api/medical-records?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error('Error al cargar historias clínicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Historia Clínica':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Examen de Laboratorio':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Imagen Médica':
        return <Image className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Historia Clínica': 'bg-blue-100 text-blue-800',
      'Examen de Laboratorio': 'bg-purple-100 text-purple-800',
      'Imagen Médica': 'bg-green-100 text-green-800',
      'Receta': 'bg-pink-100 text-pink-800',
      'Informe': 'bg-orange-100 text-orange-800',
      'Otro': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FolderOpen className="w-10 h-10 text-blue-600" />
              Historias Clínicas
            </h1>
            <p className="text-gray-600 mt-2">Documentos y archivos médicos de pacientes</p>
          </div>
          <Link
            href="/medical-records/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Subir Documento
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="Historia Clínica">Historia Clínica</option>
            <option value="Examen de Laboratorio">Examen de Laboratorio</option>
            <option value="Imagen Médica">Imagen Médica</option>
            <option value="Receta">Receta</option>
            <option value="Informe">Informe</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Lista de Registros */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando historias clínicas...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay historias clínicas registradas</p>
            <Link
              href="/medical-records/new"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Subir primer documento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Link
                key={record._id}
                href={`/medical-records/${record._id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gray-100 rounded-full p-3">
                    {getTypeIcon(record.recordType)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(record.recordType)}`}>
                    {record.recordType}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {record.title}
                </h3>
                
                {record.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {record.description}
                  </p>
                )}
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">
                      {record.patient.firstName} {record.patient.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    <span className="truncate">
                      Dr. {record.doctor.firstName} {record.doctor.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(record.date), 'd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {record.files.length} archivo(s)
                    </span>
                    {record.files.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {formatFileSize(record.files.reduce((sum, f) => sum + f.fileSize, 0))}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    {record.category}
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

