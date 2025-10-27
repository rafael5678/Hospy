import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';

// GET - Obtener estadísticas del dashboard
export async function GET() {
  try {
    await connectDB();

    const [
      totalPatients,
      activePatients,
      hospitalized,
      inactive,
      recentPatients,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ status: 'Activo' }),
      Patient.countDocuments({ status: 'Hospitalizado' }),
      Patient.countDocuments({ status: 'Inactivo' }),
      Patient.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        hospitalized,
        inactive,
        recentPatients,
      },
    });
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

