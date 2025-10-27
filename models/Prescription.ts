import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  consultation?: mongoose.Types.ObjectId;
  
  prescriptionDate: Date;
  
  // Medicamentos
  medications: {
    name: string;
    genericName?: string;
    dosage: string;
    frequency: string; // Cada 8 horas, 2 veces al día, etc.
    duration: string; // 7 días, 2 semanas, etc.
    route: string; // Oral, IV, Tópica, etc.
    instructions: string;
    quantity: number;
  }[];
  
  // Indicaciones generales
  generalInstructions?: string;
  
  // Diagnóstico asociado
  diagnosis: string;
  
  // Estado de la receta
  status: 'Activa' | 'Completada' | 'Cancelada' | 'Vencida';
  
  // Validez de la receta
  validUntil?: Date;
  
  // Reabastecimiento
  refillable: boolean;
  refillsRemaining: number;
  
  // Notas
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    consultation: { type: Schema.Types.ObjectId, ref: 'Consultation' },
    
    prescriptionDate: { type: Date, required: true, default: Date.now },
    
    medications: [{
      name: { type: String, required: true },
      genericName: { type: String },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      route: { type: String, required: true },
      instructions: { type: String, required: true },
      quantity: { type: Number, required: true }
    }],
    
    generalInstructions: { type: String },
    
    diagnosis: { type: String, required: true },
    
    status: {
      type: String,
      enum: ['Activa', 'Completada', 'Cancelada', 'Vencida'],
      default: 'Activa'
    },
    
    validUntil: { type: Date },
    
    refillable: { type: Boolean, default: false },
    refillsRemaining: { type: Number, default: 0 },
    
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

// Índices
PrescriptionSchema.index({ patient: 1, prescriptionDate: -1 });
PrescriptionSchema.index({ doctor: 1, prescriptionDate: -1 });
PrescriptionSchema.index({ status: 1 });

export default mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', PrescriptionSchema);

