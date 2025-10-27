import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MedicalRecord from '@/models/MedicalRecord';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const record = await MedicalRecord.findById(params.id)
      .populate('patient')
      .populate('doctor')
      .lean();
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Historia clínica no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    console.error('Error al obtener historia clínica:', error);
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
    const record = await MedicalRecord.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('patient')
      .populate('doctor');
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Historia clínica no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    console.error('Error al actualizar historia clínica:', error);
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
    
    const record = await MedicalRecord.findByIdAndDelete(params.id);
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Historia clínica no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Historia clínica eliminada correctamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar historia clínica:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

