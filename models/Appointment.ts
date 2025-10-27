import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // minutos
  
  reason: string;
  notes?: string;
  
  status: 'Pendiente' | 'Confirmada' | 'En Curso' | 'Completada' | 'Cancelada' | 'No Asistió';
  cancelReason?: string;
  
  // Tipo de consulta
  consultationType: 'Primera Vez' | 'Seguimiento' | 'Emergencia' | 'Control' | 'Otro';
  
  // Si es virtual o presencial
  isVirtual: boolean;
  meetingLink?: string;
  
  // Recordatorios
  reminderSent: boolean;
  
  // Resultados de la cita
  completed: boolean;
  consultationId?: mongoose.Types.ObjectId; // Referencia a la consulta médica
  
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    
    appointmentDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    
    reason: { type: String, required: true },
    notes: { type: String },
    
    status: {
      type: String,
      enum: ['Pendiente', 'Confirmada', 'En Curso', 'Completada', 'Cancelada', 'No Asistió'],
      default: 'Pendiente'
    },
    cancelReason: { type: String },
    
    consultationType: {
      type: String,
      enum: ['Primera Vez', 'Seguimiento', 'Emergencia', 'Control', 'Otro'],
      default: 'Primera Vez'
    },
    
    isVirtual: { type: Boolean, default: false },
    meetingLink: { type: String },
    
    reminderSent: { type: Boolean, default: false },
    
    completed: { type: Boolean, default: false },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' }
  },
  {
    timestamps: true
  }
);

// Índices para búsquedas eficientes
AppointmentSchema.index({ appointmentDate: 1, doctor: 1 });
AppointmentSchema.index({ patient: 1, status: 1 });
AppointmentSchema.index({ doctor: 1, status: 1 });

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

