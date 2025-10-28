import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Conectar a MongoDB
    console.log('[REGISTRO] Conectando a MongoDB...');
    await connectDB();
    console.log('[REGISTRO] MongoDB conectado!');
    
    const body = await request.json();
    console.log('[REGISTRO] Datos recibidos:', { ...body, password: '***' });
    
    const { email, password, ...patientData } = body;
    
    // Validaciones básicas
    if (!email || !password) {
      console.log('[REGISTRO] Error: Email o contraseña faltante');
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      console.log('[REGISTRO] Error: Contraseña muy corta');
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }
    
    // Verificar si el email ya existe
    console.log('[REGISTRO] Verificando si email ya existe...');
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      console.log('[REGISTRO] Error: Email ya registrado');
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado. Por favor usa otro email o inicia sesión.' },
        { status: 400 }
      );
    }
    
    // Hashear contraseña
    console.log('[REGISTRO] Hasheando contraseña...');
    const hashedPassword = await hashPassword(password);
    console.log('[REGISTRO] Contraseña hasheada!');
    
    // Crear paciente
    console.log('[REGISTRO] Creando paciente en base de datos...');
    const patient = await Patient.create({
      ...patientData,
      email,
      password: hashedPassword
    });
    console.log('[REGISTRO] Paciente creado!', patient._id);
    
    // Generar token
    console.log('[REGISTRO] Generando token JWT...');
    const token = generateToken({
      id: patient._id.toString(),
      email: patient.email,
      role: 'patient',
      name: `${patient.firstName} ${patient.lastName}`
    });
    console.log('[REGISTRO] Token generado!');
    
    // Retornar datos sin password
    const patientResponse = {
      id: patient._id,
      _id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      bloodType: patient.bloodType,
      status: patient.status
    };
    
    console.log('[REGISTRO] ✅ Registro exitoso!');
    return NextResponse.json(
      { success: true, token, patient: patientResponse },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('[REGISTRO] ❌ Error:', error);
    console.error('[REGISTRO] Stack:', error.stack);
    
    // Mensaje de error más descriptivo
    let errorMessage = 'Error al registrar paciente';
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message).join(', ');
      errorMessage = `Error de validación: ${validationErrors}`;
    } else if (error.code === 11000) {
      errorMessage = 'El email o teléfono ya está registrado';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

