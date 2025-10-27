import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Password hasheado
  phone: string;
  licenseNumber: string; // Número de colegiatura
  specialty: string;
  subSpecialty?: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  city: string;
  
  // Información profesional (opcional)
  education?: {
    degree?: string;
    institution?: string;
    year?: number;
  }[];
  
  certifications: string[];
  yearsOfExperience: number;
  languages: string[];
  
  // Horarios de trabajo (opcional)
  schedule?: {
    day?: string; // Lunes, Martes, etc.
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  }[];
  
  // Configuración de consultas
  consultationDuration: number; // minutos
  consultationFee: number;
  
  // Estado
  status: 'Activo' | 'Inactivo' | 'Vacaciones' | 'Licencia';
  avatar?: string;
  biography?: string;
  
  // Estadísticas
  totalConsultations: number;
  averageRating: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // No se envía por defecto en queries
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    specialty: { type: String, required: true },
    subSpecialty: { type: String },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Masculino', 'Femenino', 'Otro'], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    
    education: [{
      degree: { type: String },
      institution: { type: String },
      year: { type: Number }
    }],
    
    certifications: [{ type: String }],
    yearsOfExperience: { type: Number, default: 0 },
    languages: [{ type: String }],
    
    schedule: [{
      day: { type: String },
      startTime: { type: String },
      endTime: { type: String },
      isAvailable: { type: Boolean, default: true }
    }],
    
    consultationDuration: { type: Number, default: 30 },
    consultationFee: { type: Number, default: 0 },
    
    status: {
      type: String,
      enum: ['Activo', 'Inactivo', 'Vacaciones', 'Licencia'],
      default: 'Activo'
    },
    avatar: { type: String },
    biography: { type: String },
    
    totalConsultations: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Índices para búsquedas rápidas
DoctorSchema.index({ specialty: 1, status: 1 });
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ licenseNumber: 1 });

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

