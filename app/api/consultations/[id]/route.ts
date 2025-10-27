import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Consultation from '@/models/Consultation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const consultation = await Consultation.findById(params.id)
      .populate('patient')
      .populate('doctor')
      .populate('prescriptions')
      .populate('appointment')
      .lean();
    
    if (!consultation) {
      return NextResponse.json(
        { success: false, error: 'Consulta no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: consultation });
  } catch (error: any) {
    console.error('Error al obtener consulta:', error);
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
    
    // Recalcular BMI si se actualizan peso o altura
    if (body.vitalSigns?.weight && body.vitalSigns?.height) {
      const heightInMeters = body.vitalSigns.height / 100;
      body.vitalSigns.bmi = parseFloat(
        (body.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(2)
      );
    }
    
    const consultation = await Consultation.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('patient')
      .populate('doctor')
      .populate('prescriptions');
    
    if (!consultation) {
      return NextResponse.json(
        { success: false, error: 'Consulta no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: consultation });
  } catch (error: any) {
    console.error('Error al actualizar consulta:', error);
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
    
    const consultation = await Consultation.findByIdAndDelete(params.id);
    
    if (!consultation) {
      return NextResponse.json(
        { success: false, error: 'Consulta no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Consulta eliminada correctamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar consulta:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

