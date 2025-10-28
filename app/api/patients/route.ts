import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';

// GET - Obtener todos los pacientes con búsqueda y filtros
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const doctorId = searchParams.get('doctorId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Construir query
    const query: any = {};

    // Si se filtra por doctor, buscar solo pacientes con citas de ese médico
    if (doctorId) {
      const appointments = await Appointment.find({ doctor: doctorId }).distinct('patient');
      if (appointments.length === 0) {
        // Si el médico no tiene citas, devolver array vacío
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
          },
        });
      }
      query._id = { $in: appointments };
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    // Obtener total de documentos
    const total = await Patient.countDocuments(query);

    // Obtener pacientes con paginación
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: patients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error al obtener pacientes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo paciente
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const patient = await Patient.create(body);

    return NextResponse.json(
      { success: true, data: patient },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear paciente:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

