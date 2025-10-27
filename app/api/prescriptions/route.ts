import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Prescription from '@/models/Prescription';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro
    const filter: any = {};
    
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;
    if (status) filter.status = status;
    
    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate('patient', 'firstName lastName email dateOfBirth')
        .populate('doctor', 'firstName lastName specialty licenseNumber')
        .populate('consultation')
        .sort({ prescriptionDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prescription.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: prescriptions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error al obtener prescripciones:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const prescription = await Prescription.create(body);
    
    // Poblar datos para la respuesta
    await prescription.populate('patient', 'firstName lastName email');
    await prescription.populate('doctor', 'firstName lastName specialty');
    
    return NextResponse.json(
      { success: true, data: prescription },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear prescripción:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

