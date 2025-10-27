import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

export async function GET() {
  try {
    await connectDB();
    
    const [
      totalDoctors,
      activeDoctors,
      specialties,
      recentDoctors
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ status: 'Activo' }),
      Doctor.aggregate([
        { $group: { _id: '$specialty', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Doctor.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName specialty status createdAt')
        .lean()
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalDoctors,
        activeDoctors,
        specialties,
        recentDoctors
      }
    });
  } catch (error: any) {
    console.error('Error al obtener estadísticas de médicos:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

