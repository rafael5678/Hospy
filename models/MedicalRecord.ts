import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  
  // Tipo de documento
  recordType: 'Historia Clínica' | 'Examen de Laboratorio' | 'Imagen Médica' | 'Receta' | 'Informe' | 'Otro';
  
  title: string;
  description?: string;
  date: Date;
  
  // Archivos adjuntos
  files: {
    fileName: string;
    fileUrl: string;
    fileType: string; // pdf, jpg, png, etc.
    fileSize: number; // en bytes
    uploadedAt: Date;
  }[];
  
  // Metadata
  category: string; // Cardiología, Neurología, etc.
  tags: string[];
  
  // Confidencialidad
  isConfidential: boolean;
  accessLevel: 'Público' | 'Privado' | 'Solo Médico';
  
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    
    recordType: {
      type: String,
      enum: ['Historia Clínica', 'Examen de Laboratorio', 'Imagen Médica', 'Receta', 'Informe', 'Otro'],
      required: true
    },
    
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true, default: Date.now },
    
    files: [{
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    category: { type: String, required: true },
    tags: [{ type: String }],
    
    isConfidential: { type: Boolean, default: false },
    accessLevel: {
      type: String,
      enum: ['Público', 'Privado', 'Solo Médico'],
      default: 'Privado'
    }
  },
  {
    timestamps: true
  }
);

// Índices
MedicalRecordSchema.index({ patient: 1, date: -1 });
MedicalRecordSchema.index({ doctor: 1, date: -1 });
MedicalRecordSchema.index({ recordType: 1 });

export default mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);

