import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'super_admin' | 'admin';
  status: 'Activo' | 'Inactivo';
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    fullName: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['super_admin', 'admin'],
      default: 'admin'
    },
    status: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      default: 'Activo'
    }
  },
  {
    timestamps: true
  }
);

AdminSchema.index({ username: 1 });
AdminSchema.index({ email: 1 });

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

