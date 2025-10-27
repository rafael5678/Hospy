import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password, ...doctorData } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar si el email ya existe
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado' },
        { status: 400 }
      );
    }
    
    // Hashear contraseña
    const hashedPassword = await hashPassword(password);
    
    // Crear médico
    const doctor = await Doctor.create({
      ...doctorData,
      email,
      password: hashedPassword
    });
    
    // Generar token
    const token = generateToken({
      id: doctor._id.toString(),
      email: doctor.email,
      role: 'doctor',
      name: `${doctor.firstName} ${doctor.lastName}`
    });
    
    // Retornar datos sin password
    const doctorResponse = {
      id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialty: doctor.specialty,
      licenseNumber: doctor.licenseNumber,
      status: doctor.status
    };
    
    return NextResponse.json(
      { success: true, token, doctor: doctorResponse },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error al registrar médico:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

