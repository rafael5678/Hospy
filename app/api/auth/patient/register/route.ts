import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password, ...patientData } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar si el email ya existe
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado' },
        { status: 400 }
      );
    }
    
    // Hashear contraseña
    const hashedPassword = await hashPassword(password);
    
    // Crear paciente
    const patient = await Patient.create({
      ...patientData,
      email,
      password: hashedPassword
    });
    
    // Generar token
    const token = generateToken({
      id: patient._id.toString(),
      email: patient.email,
      role: 'patient',
      name: `${patient.firstName} ${patient.lastName}`
    });
    
    // Retornar datos sin password
    const patientResponse = {
      id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      bloodType: patient.bloodType,
      status: patient.status
    };
    
    return NextResponse.json(
      { success: true, token, patient: patientResponse },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error al registrar paciente:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

