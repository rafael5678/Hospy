import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
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
    
    // Buscar médico por email e incluir el password
    const doctor = await Doctor.findOne({ email }).select('+password');
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña
    const isValid = await verifyPassword(password, doctor.password);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Generar token
    const token = generateToken({
      id: doctor._id.toString(),
      email: doctor.email,
      role: 'doctor',
      name: `${doctor.firstName} ${doctor.lastName}`
    });
    
    // Retornar datos del médico sin el password
    const doctorData = {
      id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialty: doctor.specialty,
      licenseNumber: doctor.licenseNumber,
      avatar: doctor.avatar,
      status: doctor.status
    };
    
    return NextResponse.json({
      success: true,
      token,
      doctor: doctorData
    });
    
  } catch (error: any) {
    console.error('Error en login de médico:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

