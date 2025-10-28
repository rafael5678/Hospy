import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const doctor = await Doctor.findById(params.id);
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Médico no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: doctor });
  } catch (error: any) {
    console.error('Error al obtener médico:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Si viene newPassword, encriptar y actualizar
    if (body.newPassword) {
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      body.password = hashedPassword;
      delete body.newPassword;
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Médico no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: doctor });
  } catch (error: any) {
    console.error('Error al actualizar médico:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const doctor = await Doctor.findByIdAndDelete(params.id);
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Médico no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Médico eliminado correctamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar médico:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

