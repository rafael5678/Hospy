'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (params.id) {
      fetchPatientData(params.id as string);
    }
  }, [params.id]);

  const fetchPatientData = async (id: string) => {
    try {
      // Cargar todo en paralelo para mayor velocidad
      const [patientRes, consultationsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        fetch(`/api/patients/${id}`),
        fetch(`/api/consultations?patientId=${id}`),
        fetch(`/api/appointments?patientId=${id}`),
        fetch(`/api/prescriptions?patientId=${id}`)
      ]);

      const [patientData, consultationsData, appointmentsData, prescriptionsData] = await Promise.all([
        patientRes.json(),
        consultationsRes.json(),
        appointmentsRes.json(),
        prescriptionsRes.json()
      ]);

      if (patientData.success) setPatient(patientData.data);
      if (consultationsData.success) setConsultations(consultationsData.data || []);
      if (appointmentsData.success) setAppointments(appointmentsData.data || []);
      if (prescriptionsData.success) setPrescriptions(prescriptionsData.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh' 
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>
          Paciente no encontrado
        </h2>
        <button
          onClick={() => router.push('/patients')}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Volver a pacientes
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.push('/patients')}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          ← Volver a pacientes
        </button>

        <div style={{ 
          background: 'white', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                {patient.firstName} {patient.lastName}
              </h1>
              <p style={{ color: '#6b7280' }}>
                {calculateAge(patient.dateOfBirth)} años • {patient.gender} • Tipo: {patient.bloodType}
              </p>
            </div>
          </div>

          {/* Info Rápida */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Teléfono</p>
              <p style={{ fontWeight: '600', color: '#111827' }}>{patient.phone}</p>
            </div>
            {patient.email && (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{patient.email}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ciudad</p>
              <p style={{ fontWeight: '600', color: '#111827' }}>{patient.city}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Estado</p>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: patient.status === 'Activo' ? '#d1fae5' : '#fee2e2',
                color: patient.status === 'Activo' ? '#065f46' : '#991b1b',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {patient.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        background: 'white', 
        borderRadius: '1rem', 
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e5e7eb',
          gap: '0'
        }}>
          {['info', 'consultas', 'citas', 'recetas'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '1rem',
                background: activeTab === tab ? '#f9fafb' : 'white',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
                color: activeTab === tab ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab === 'info' ? 'Información' : 
               tab === 'consultas' ? `Consultas (${consultations.length})` : 
               tab === 'citas' ? `Citas (${appointments.length})` : 
               `Recetas (${prescriptions.length})`}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Información General */}
          {activeTab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Dirección</h3>
                <p style={{ color: '#6b7280' }}>{patient.address}</p>
              </div>
              {patient.allergies && patient.allergies.length > 0 && (
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Alergias</h3>
                  <p style={{ color: '#78350f' }}>{patient.allergies.join(', ')}</p>
                </div>
              )}
              {patient.medications && patient.medications.length > 0 && (
                <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Medicamentos Actuales</h3>
                  <p style={{ color: '#1e3a8a' }}>{patient.medications.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Consultas */}
          {activeTab === 'consultas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {consultations.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No hay consultas registradas
                </p>
              ) : (
                consultations.map(c => (
                  <div key={c._id} style={{ 
                    padding: '1rem', 
                    background: '#f9fafb', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600' }}>
                        Dr. {c.doctor?.firstName} {c.doctor?.lastName}
                      </h4>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(c.consultationDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
                      <strong>Motivo:</strong> {c.chiefComplaint}
                    </p>
                    <p style={{ color: '#374151' }}>
                      <strong>Diagnóstico:</strong> {c.diagnosis}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Citas */}
          {activeTab === 'citas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No hay citas programadas
                </p>
              ) : (
                appointments.map(a => (
                  <div key={a._id} style={{ 
                    padding: '1rem', 
                    background: '#f9fafb', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600' }}>
                        Dr. {a.doctor?.firstName} {a.doctor?.lastName}
                      </h4>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: a.status === 'Confirmada' ? '#d1fae5' : '#fef3c7',
                        color: a.status === 'Confirmada' ? '#065f46' : '#78350f',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {a.status}
                      </span>
                    </div>
                    <p style={{ color: '#374151' }}>
                      {new Date(a.appointmentDate).toLocaleDateString('es-ES')} • {a.startTime} - {a.endTime}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {a.reason}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Recetas */}
          {activeTab === 'recetas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {prescriptions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No hay recetas registradas
                </p>
              ) : (
                prescriptions.map(p => (
                  <div key={p._id} style={{ 
                    padding: '1rem', 
                    background: '#f9fafb', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600' }}>
                        Dr. {p.doctor?.firstName} {p.doctor?.lastName}
                      </h4>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(p.prescriptionDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
                      <strong>Diagnóstico:</strong> {p.diagnosis}
                    </p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong style={{ fontSize: '0.875rem' }}>Medicamentos:</strong>
                      <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                        {p.medications?.map((m: any, i: number) => (
                          <li key={i} style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {m.name} - {m.dosage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
