import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    // Buscar paciente por email e incluir el password
    const patient = await Patient.findOne({ email }).select('+password');
    
    if (!patient || !patient.password) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña
    const isValid = await verifyPassword(password, patient.password);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Generar token
    const token = generateToken({
      id: patient._id.toString(),
      email: patient.email,
      role: 'patient',
      name: `${patient.firstName} ${patient.lastName}`
    });
    
    // Retornar datos del paciente sin el password
    const patientData = {
      id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      bloodType: patient.bloodType,
      status: patient.status
    };
    
    return NextResponse.json({
      success: true,
      token,
      patient: patientData
    });
    
  } catch (error: any) {
    console.error('Error en login de paciente:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

