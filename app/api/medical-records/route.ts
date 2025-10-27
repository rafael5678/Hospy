import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MedicalRecord from '@/models/MedicalRecord';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const recordType = searchParams.get('recordType');
    const category = searchParams.get('category');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro
    const filter: any = {};
    
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;
    if (recordType) filter.recordType = recordType;
    if (category) filter.category = category;
    
    const [records, total] = await Promise.all([
      MedicalRecord.find(filter)
        .populate('patient', 'firstName lastName email dateOfBirth')
        .populate('doctor', 'firstName lastName specialty')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MedicalRecord.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error al obtener historias clínicas:', error);
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
    const record = await MedicalRecord.create(body);
    
    // Poblar datos para la respuesta
    await record.populate('patient', 'firstName lastName email');
    await record.populate('doctor', 'firstName lastName specialty');
    
    return NextResponse.json(
      { success: true, data: record },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear historia clínica:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

