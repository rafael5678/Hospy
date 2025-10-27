import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { hashPassword } from '@/lib/auth';

// Esta ruta solo funcionará si NO hay administradores en la BD
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verificar si ya existe un admin
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un administrador. No se puede crear otro.' },
        { status: 403 }
      );
    }
    
    const { username, email, password, fullName } = await request.json();
    
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    // Hashear contraseña
    const hashedPassword = await hashPassword(password);
    
    // Crear administrador
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: 'super_admin',
      status: 'Activo'
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Administrador creado exitosamente',
        admin: {
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName
        }
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error al crear administrador:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

