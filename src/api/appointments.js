import axios from 'axios'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const russianAppointments = [
  {
    id: 1,
    patientName: 'Иванов Иван Иванович',
    date: new Date(Date.now() + 0 * 86400000).toLocaleDateString('ru-RU'),
    time: '09:00',
    status: 'Запланировано',
    notes: 'Плановый осмотр, жалобы на головную боль. Необходимо провести общий анализ крови и измерить артериальное давление.',
    doctorId: 1
  },
  {
    id: 2,
    patientName: 'Петрова Мария Сергеевна',
    date: new Date(Date.now() + 0 * 86400000).toLocaleDateString('ru-RU'),
    time: '10:00',
    status: 'В процессе',
    notes: 'Консультация кардиолога. Пациентка жалуется на боли в области сердца и одышку при физических нагрузках.',
    doctorId: 2
  },
  {
    id: 3,
    patientName: 'Сидоров Алексей Петрович',
    date: new Date(Date.now() + 0 * 86400000).toLocaleDateString('ru-RU'),
    time: '11:00',
    status: 'Завершено',
    notes: 'Послеоперационный осмотр. Швы заживают хорошо, осложнений нет. Рекомендовано продолжить лечение.',
    doctorId: 3
  },
  {
    id: 4,
    patientName: 'Козлова Анна Владимировна',
    date: new Date(Date.now() + 1 * 86400000).toLocaleDateString('ru-RU'),
    time: '09:00',
    status: 'Запланировано',
    notes: 'Консультация невролога. Головокружения и онемение в руках. Требуется дополнительное обследование.',
    doctorId: 4
  },
  {
    id: 5,
    patientName: 'Морозов Дмитрий Александрович',
    date: new Date(Date.now() + 1 * 86400000).toLocaleDateString('ru-RU'),
    time: '10:00',
    status: 'Запланировано',
    notes: 'Проверка зрения, подбор очков. Пациент отмечает ухудшение зрения в последнее время.',
    doctorId: 5
  },
  {
    id: 6,
    patientName: 'Волкова Елена Николаевна',
    date: new Date(Date.now() + 1 * 86400000).toLocaleDateString('ru-RU'),
    time: '11:00',
    status: 'Запланировано',
    notes: 'Плановый осмотр ребёнка. Вакцинация по календарю. Общее состояние удовлетворительное.',
    doctorId: 6
  },
  {
    id: 7,
    patientName: 'Новиков Сергей Викторович',
    date: new Date(Date.now() + 2 * 86400000).toLocaleDateString('ru-RU'),
    time: '09:00',
    status: 'Запланировано',
    notes: 'Повторный приём. Контроль артериального давления после начала приёма лекарств.',
    doctorId: 1
  },
  {
    id: 8,
    patientName: 'Федорова Ольга Игоревна',
    date: new Date(Date.now() + 2 * 86400000).toLocaleDateString('ru-RU'),
    time: '10:00',
    status: 'Запланировано',
    notes: 'ЭКГ и консультация кардиолога. Профилактический осмотр перед отпуском.',
    doctorId: 2
  },
  {
    id: 9,
    patientName: 'Смирнов Павел Олегович',
    date: new Date(Date.now() + 2 * 86400000).toLocaleDateString('ru-RU'),
    time: '11:00',
    status: 'Запланировано',
    notes: 'Консультация хирурга. Планируется плановая операция по удалению аппендикса.',
    doctorId: 3
  },
  {
    id: 10,
    patientName: 'Лебедева Татьяна Дмитриевна',
    date: new Date(Date.now() + 3 * 86400000).toLocaleDateString('ru-RU'),
    time: '09:00',
    status: 'Запланировано',
    notes: 'Плановый осмотр у невролога. Контроль состояния после курса лечения.',
    doctorId: 4
  }
]

export const fetchAppointments = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return russianAppointments
}

export const fetchAppointment = async (appointmentId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const appointment = russianAppointments.find(a => a.id === appointmentId)
  if (appointment) {
    return appointment
  }
  const response = await api.get(`/comments/${appointmentId}`)
  return {
    id: response.data.id,
    patientName: response.data.name,
    date: new Date().toLocaleDateString('ru-RU'),
    time: '10:00',
    status: 'Запланировано',
    notes: response.data.body,
    doctorId: response.data.postId,
  }
}

export const createAppointment = async (appointmentData) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const newAppointment = {
    id: Date.now(),
    patientName: appointmentData.patientName,
    date: appointmentData.date || new Date().toLocaleDateString('ru-RU'),
    time: appointmentData.time || '10:00',
    status: 'Запланировано',
    notes: appointmentData.notes || 'Запись на приём',
    doctorId: appointmentData.doctorId || 1,
  }
  return newAppointment
}

export const updateAppointment = async ({ id, ...appointmentData }) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const updatedAppointment = {
    id: id,
    patientName: appointmentData.patientName,
    date: appointmentData.date || new Date().toLocaleDateString('ru-RU'),
    time: appointmentData.time || '10:00',
    status: appointmentData.status || 'Запланировано',
    notes: appointmentData.notes || 'Запись на приём',
    doctorId: appointmentData.doctorId || 1,
  }
  return updatedAppointment
}

export const deleteAppointment = async (appointmentId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return { id: appointmentId }
}
