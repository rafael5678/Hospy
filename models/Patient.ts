import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  email?: string;
  password?: string; // Password hasheado (opcional para pacientes legacy)
  phone: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodType: string;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  status: 'Activo' | 'Inactivo' | 'Hospitalizado';
  admissionDate: Date;
  lastVisit?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida'],
    },
    gender: {
      type: String,
      enum: ['Masculino', 'Femenino', 'Otro'],
      required: [true, 'El género es requerido'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false, // No se envía por defecto en queries
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'La dirección es requerida'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'La ciudad es requerida'],
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'El nombre del contacto de emergencia es requerido'],
      },
      phone: {
        type: String,
        required: [true, 'El teléfono del contacto de emergencia es requerido'],
      },
      relationship: {
        type: String,
        required: [true, 'La relación del contacto de emergencia es requerida'],
      },
    },
    bloodType: {
      type: String,
      required: [true, 'El tipo de sangre es requerido'],
    },
    allergies: [String],
    medications: [String],
    medicalHistory: {
      type: String,
      trim: true,
    },
    insuranceProvider: {
      type: String,
      trim: true,
    },
    insuranceNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Activo', 'Inactivo', 'Hospitalizado'],
      default: 'Activo',
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    lastVisit: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas más rápidas
PatientSchema.index({ firstName: 1, lastName: 1 });
PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ status: 1 });

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);

