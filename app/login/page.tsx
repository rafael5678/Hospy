'use client';

export default function LoginSelectPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        {/* Logo y Título */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '1rem',
              padding: '1rem',
              marginBottom: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}>
              <svg style={{ width: '48px', height: '48px' }} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Sistema Hospy
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              Tu asistente de gestión hospitalaria
            </p>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            ¿Cómo deseas ingresar?
          </h2>
          <p style={{ color: '#6b7280' }}>Selecciona tu tipo de acceso al sistema</p>
        </div>

        {/* Opciones de Login */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Administrador */}
          <a
            href="/admin/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              border: '2px solid transparent',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#9333ea';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(147,51,234,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                borderRadius: '0.75rem',
                padding: '1rem',
                color: 'white'
              }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                  Administrador
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Acceso completo con panel de control
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', fontSize: '0.875rem' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span style={{ fontWeight: '500' }}>Requiere contraseña</span>
                </div>
              </div>
            </div>
            <svg style={{ width: '24px', height: '24px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Médico */}
          <a
            href="/doctor/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              border: '2px solid transparent',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                borderRadius: '0.75rem',
                padding: '1rem',
                color: 'white'
              }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                  Médico
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Portal profesional para personal médico
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.875rem' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span style={{ fontWeight: '500' }}>Requiere contraseña</span>
                </div>
              </div>
            </div>
            <svg style={{ width: '24px', height: '24px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Paciente */}
          <a
            href="/patient/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              border: '2px solid transparent',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                borderRadius: '0.75rem',
                padding: '1rem',
                color: 'white'
              }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                  Paciente
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Acceso a tu historial y citas médicas
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span style={{ fontWeight: '500' }}>Acceso inmediato</span>
                </div>
              </div>
            </div>
            <svg style={{ width: '24px', height: '24px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Registro de Pacientes */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            ¿Eres paciente y no tienes cuenta?{' '}
            <a href="/patient/register" style={{ color: '#10b981', fontWeight: '600', textDecoration: 'underline' }}>
              Regístrate gratis aquí
            </a>
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          © 2024 Hospy - Sistema de Gestión Hospitalaria
        </div>
      </div>
    </div>
  );
}
