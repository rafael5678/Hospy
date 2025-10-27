import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Prescription from '@/models/Prescription';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const prescription = await Prescription.findById(params.id)
      .populate('patient')
      .populate('doctor')
      .populate('consultation')
      .lean();
    
    if (!prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescripción no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: prescription });
  } catch (error: any) {
    console.error('Error al obtener prescripción:', error);
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
    const prescription = await Prescription.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('patient')
      .populate('doctor');
    
    if (!prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescripción no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: prescription });
  } catch (error: any) {
    console.error('Error al actualizar prescripción:', error);
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
    
    const prescription = await Prescription.findByIdAndDelete(params.id);
    
    if (!prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescripción no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Prescripción eliminada correctamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar prescripción:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

