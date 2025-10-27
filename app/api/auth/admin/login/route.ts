import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    // Buscar admin por username e incluir el password
    const admin = await Admin.findOne({ username }).select('+password');
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña
    const isValid = await verifyPassword(password, admin.password);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Generar token
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: 'admin',
      name: admin.fullName
    });
    
    // Retornar datos del admin sin el password
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      status: admin.status
    };
    
    return NextResponse.json({
      success: true,
      token,
      admin: adminData
    });
    
  } catch (error: any) {
    console.error('Error en login de administrador:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

