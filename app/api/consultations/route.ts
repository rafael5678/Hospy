import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Consultation from '@/models/Consultation';

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
    
    const [consultations, total] = await Promise.all([
      Consultation.find(filter)
        .populate('patient', 'firstName lastName email dateOfBirth gender')
        .populate('doctor', 'firstName lastName specialty')
        .populate('prescriptions')
        .sort({ consultationDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Consultation.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: consultations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error al obtener consultas:', error);
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
    
    // Calcular BMI si se proporcionan peso y altura
    if (body.vitalSigns?.weight && body.vitalSigns?.height) {
      const heightInMeters = body.vitalSigns.height / 100;
      body.vitalSigns.bmi = parseFloat(
        (body.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(2)
      );
    }
    
    const consultation = await Consultation.create(body);
    
    // Poblar datos para la respuesta
    await consultation.populate('patient', 'firstName lastName email');
    await consultation.populate('doctor', 'firstName lastName specialty');
    
    return NextResponse.json(
      { success: true, data: consultation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear consulta:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

