import mongoose, { Schema, Document } from 'mongoose';

export interface IConsultation extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  
  consultationDate: Date;
  
  // Motivo de consulta
  chiefComplaint: string; // Motivo principal
  presentIllness: string; // Historia de enfermedad actual
  
  // Signos vitales
  vitalSigns: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };
  
  // Examen físico
  physicalExamination?: string;
  
  // Diagnóstico
  diagnosis: {
    code?: string; // CIE-10
    description: string;
    type: 'Principal' | 'Secundario' | 'Provisional' | 'Confirmado';
  }[];
  
  // Tratamiento y plan
  treatment: string;
  plan: string;
  
  // Prescripciones asociadas
  prescriptions: mongoose.Types.ObjectId[];
  
  // Exámenes solicitados
  requestedTests: {
    testName: string;
    testType: string;
    notes?: string;
    status: 'Solicitado' | 'En Proceso' | 'Completado';
  }[];
  
  // Notas adicionales del médico
  doctorNotes?: string;
  
  // Próximo control
  followUpDate?: Date;
  followUpNotes?: string;
  
  // Estado
  status: 'En Curso' | 'Completada' | 'Cancelada';
  
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    
    consultationDate: { type: Date, required: true, default: Date.now },
    
    chiefComplaint: { type: String, required: true },
    presentIllness: { type: String, required: true },
    
    vitalSigns: {
      bloodPressureSystolic: { type: Number },
      bloodPressureDiastolic: { type: Number },
      heartRate: { type: Number },
      temperature: { type: Number },
      respiratoryRate: { type: Number },
      oxygenSaturation: { type: Number },
      weight: { type: Number },
      height: { type: Number },
      bmi: { type: Number }
    },
    
    physicalExamination: { type: String },
    
    diagnosis: [{
      code: { type: String },
      description: { type: String, required: true },
      type: {
        type: String,
        enum: ['Principal', 'Secundario', 'Provisional', 'Confirmado'],
        default: 'Principal'
      }
    }],
    
    treatment: { type: String, required: true },
    plan: { type: String, required: true },
    
    prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
    
    requestedTests: [{
      testName: { type: String, required: true },
      testType: { type: String, required: true },
      notes: { type: String },
      status: {
        type: String,
        enum: ['Solicitado', 'En Proceso', 'Completado'],
        default: 'Solicitado'
      }
    }],
    
    doctorNotes: { type: String },
    
    followUpDate: { type: Date },
    followUpNotes: { type: String },
    
    status: {
      type: String,
      enum: ['En Curso', 'Completada', 'Cancelada'],
      default: 'En Curso'
    }
  },
  {
    timestamps: true
  }
);

// Índices
ConsultationSchema.index({ patient: 1, consultationDate: -1 });
ConsultationSchema.index({ doctor: 1, consultationDate: -1 });

export default mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);

