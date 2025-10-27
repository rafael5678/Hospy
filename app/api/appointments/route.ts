import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro
    const filter: any = {};
    
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;
    if (status) filter.status = status;
    if (date) {
      const searchDate = new Date(date);
      filter.appointmentDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }
    
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patient', 'firstName lastName email phone')
        .populate('doctor', 'firstName lastName specialty')
        .sort({ appointmentDate: -1, startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error al obtener citas:', error);
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
    
    // Mapear campos del formulario a los campos del modelo
    const appointmentData = {
      patient: body.patientId || body.patient,
      doctor: body.doctorId || body.doctor,
      appointmentDate: body.appointmentDate,
      startTime: body.startTime,
      endTime: body.endTime,
      duration: body.duration || (() => {
        // Calcular duración desde startTime y endTime
        const [startHours, startMinutes] = body.startTime.split(':').map(Number);
        const [endHours, endMinutes] = body.endTime.split(':').map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        return endTotalMinutes - startTotalMinutes;
      })(),
      reason: body.reason,
      notes: body.notes,
      status: body.status || 'Pendiente',
      consultationType: body.type || body.consultationType || 'Primera Vez',
      isVirtual: body.isVirtual || false,
      reminderSent: false,
      completed: false
    };
    
    const appointment = await Appointment.create(appointmentData);
    
    // Poblar datos para la respuesta
    await appointment.populate('patient', 'firstName lastName email phone');
    await appointment.populate('doctor', 'firstName lastName specialty');
    
    return NextResponse.json(
      { success: true, data: appointment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear cita:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

