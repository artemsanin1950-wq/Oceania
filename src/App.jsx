import { useState } from 'react'
import './App.css'
import { usePatients, useCreatePatient, useDeletePatient } from './hooks/usePatients'
import { useDoctors } from './hooks/useDoctors'
import { useAppointments, useCreateAppointment, useDeleteAppointment } from './hooks/useAppointments'
import { usePatientProfile, useDoctorProfile } from './hooks/useProfile'
import { useQueryClient } from '@tanstack/react-query'
import { fetchPatient } from './api/patients'
import { fetchDoctor } from './api/doctors'

function PatientsList() {
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const queryClient = useQueryClient()

  const { data: patients = [], isLoading, error, refetch } = usePatients()

  const handlePatientHover = (patientId) => {
    queryClient.prefetchQuery({
      queryKey: ['patients', 'detail', patientId],
      queryFn: () => fetchPatient(patientId),
      staleTime: 5 * 60 * 1000,
    })
  }

  const { data: patientProfile, isLoading: profileLoading } = usePatientProfile(selectedPatientId, {
    enabled: !!selectedPatientId,
  })

  if (isLoading) return <div className="loading">Загрузка пациентов...</div>
  if (error) return <div className="error">Ошибка: {error.message || 'Не удалось загрузить пациентов'}</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Список пациентов</h2>
        <button className="btn btn-primary" onClick={() => refetch()}>
          🔄 Обновить
        </button>
      </div>
      <div className="grid">
        {patients.map(patient => (
          <div
            key={patient.id}
            className="card"
            onMouseEnter={() => handlePatientHover(patient.id)}
            onClick={() => setSelectedPatientId(patient.id === selectedPatientId ? null : patient.id)}
            style={{ cursor: 'pointer', border: selectedPatientId === patient.id ? '2px solid var(--primary-color)' : '2px solid transparent' }}
          >
            <h3>{patient.name}</h3>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Телефон:</strong> {patient.phone}</p>
            <p><strong>Город:</strong> {patient.address?.city}</p>
            {selectedPatientId === patient.id && patientProfile && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <h4>Детали профиля (Dependent Query)</h4>
                {profileLoading ? (
                  <p>Загрузка профиля...</p>
                ) : (
                  <>
                    <p><strong>Username:</strong> {patientProfile.username}</p>
                    <p><strong>Website:</strong> {patientProfile.website}</p>
                    <p><strong>Компания:</strong> {patientProfile.company?.name}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DoctorsList() {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)
  const queryClient = useQueryClient()

  const { data: doctors = [], isLoading, error } = useDoctors()

  const handleDoctorHover = (doctorId) => {
    queryClient.prefetchQuery({
      queryKey: ['doctors', 'detail', doctorId],
      queryFn: () => fetchDoctor(doctorId),
      staleTime: 10 * 60 * 1000,
    })
  }

  const { data: doctorProfile } = useDoctorProfile(selectedDoctorId, {
    enabled: !!selectedDoctorId,
  })

  if (isLoading) return <div className="loading">Загрузка врачей...</div>
  if (error) return <div className="error">Ошибка: {error.message || 'Не удалось загрузить врачей'}</div>

  return (
    <div>
      <h2>Наши врачи</h2>
      <div className="grid">
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className="card"
            onMouseEnter={() => handleDoctorHover(doctor.id)}
            onClick={() => setSelectedDoctorId(doctor.id === selectedDoctorId ? null : doctor.id)}
            style={{ cursor: 'pointer', border: selectedDoctorId === doctor.id ? '2px solid var(--primary-color)' : '2px solid transparent' }}
          >
            <h3>{doctor.name}</h3>
            <p><strong>Специализация:</strong> {doctor.specialization}</p>
            <p><strong>Опыт работы:</strong> {doctor.experience}</p>
            <p>{doctor.description}</p>
            {selectedDoctorId === doctor.id && doctorProfile && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <h4>Детали профиля (Dependent Query)</h4>
                <p><strong>Полное описание:</strong> {doctorProfile.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AppointmentsList() {
  const [newAppointment, setNewAppointment] = useState({ patientName: '', date: '', time: '', notes: '' })
  const [showForm, setShowForm] = useState(false)

  const { data: appointments = [], isLoading, error } = useAppointments()

  const createAppointmentMutation = useCreateAppointment()
  const deleteAppointmentMutation = useDeleteAppointment()

  const handleCreateAppointment = async () => {
    if (!newAppointment.patientName.trim()) {
      return
    }

    try {
      await createAppointmentMutation.mutateAsync({
        patientName: newAppointment.patientName,
        date: newAppointment.date || new Date().toLocaleDateString('ru-RU'),
        time: newAppointment.time || '10:00',
        notes: newAppointment.notes,
        doctorId: 1,
      })
      setNewAppointment({ patientName: '', date: '', time: '', notes: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Ошибка при создании записи:', err)
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      return
    }

    try {
      await deleteAppointmentMutation.mutateAsync(id)
    } catch (err) {
      console.error('Ошибка при удалении записи:', err)
    }
  }

  if (isLoading) return <div className="loading">Загрузка записей...</div>
  if (error) return <div className="error">Ошибка: {error.message || 'Не удалось загрузить записи'}</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Записи на приём</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Отмена' : '➕ Добавить запись'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Новая запись на приём</h3>
          <div className="form-group">
            <label>Имя пациента</label>
            <input
              type="text"
              className="input"
              value={newAppointment.patientName}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              placeholder="Введите имя пациента"
            />
          </div>
          <div className="form-group">
            <label>Дата</label>
            <input
              type="date"
              className="input"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Время</label>
            <input
              type="time"
              className="input"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Примечания</label>
            <textarea
              className="textarea"
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              placeholder="Дополнительная информация"
            />
          </div>
          <button
            className="btn btn-success"
            onClick={handleCreateAppointment}
            disabled={createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending ? '⏳ Создание...' : '✓ Создать запись'}
          </button>
        </div>
      )}

      <div className="grid">
        {appointments.map(appointment => (
          <div key={appointment.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3>{appointment.patientName}</h3>
                <p><strong>Дата:</strong> {appointment.date}</p>
                <p><strong>Время:</strong> {appointment.time}</p>
                <p>
                  <span className={`badge ${
                    appointment.status === 'Завершено' ? 'badge-success' :
                    appointment.status === 'В процессе' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {appointment.status}
                  </span>
                </p>
                <p>{appointment.notes}</p>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteAppointment(appointment.id)}
                disabled={deleteAppointmentMutation.isPending}
                style={{ marginLeft: '1rem' }}
              >
                {deleteAppointmentMutation.isPending ? '⏳' : '×'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('patients')

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">🏥 Система управления больницей</h1>
          <p className="subtitle">Интеграция React Query - замена useEffect на useQuery и useMutation</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)' }}>
            <button
              className="btn"
              onClick={() => setActiveTab('patients')}
              style={{
                background: activeTab === 'patients' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'patients' ? 'white' : 'var(--text-primary)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0'
              }}
            >
              Пациенты
            </button>
            <button
              className="btn"
              onClick={() => setActiveTab('doctors')}
              style={{
                background: activeTab === 'doctors' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'doctors' ? 'white' : 'var(--text-primary)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0'
              }}
            >
              Врачи
            </button>
            <button
              className="btn"
              onClick={() => setActiveTab('appointments')}
              style={{
                background: activeTab === 'appointments' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'appointments' ? 'white' : 'var(--text-primary)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0'
              }}
            >
              Записи на приём
            </button>
          </div>

          {activeTab === 'patients' && <PatientsList />}
          {activeTab === 'doctors' && <DoctorsList />}
          {activeTab === 'appointments' && <AppointmentsList />}

        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Система управления больницей © 2024 | React Query Integration</p>
        </div>
      </footer>
    </div>
  )
}

export default App
