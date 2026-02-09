import axios from 'axios'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const russianDoctors = [
  {
    id: 1,
    name: 'Доктор Петров',
    specialization: 'Терапевт',
    experience: '15 лет',
    description: 'Опытный терапевт с многолетним стажем работы. Специализируется на лечении заболеваний внутренних органов, профилактике и диагностике различных патологий. Внимательный подход к каждому пациенту.'
  },
  {
    id: 2,
    name: 'Доктор Смирнова',
    specialization: 'Кардиолог',
    experience: '12 лет',
    description: 'Высококвалифицированный кардиолог, специалист по диагностике и лечению заболеваний сердечно-сосудистой системы. Проводит комплексное обследование и назначает эффективное лечение.'
  },
  {
    id: 3,
    name: 'Доктор Иванов',
    specialization: 'Хирург',
    experience: '20 лет',
    description: 'Опытный хирург с большим опытом проведения операций различной сложности. Специализируется на общей хирургии, лапароскопических операциях. Высокий процент успешных операций.'
  },
  {
    id: 4,
    name: 'Доктор Козлова',
    specialization: 'Невролог',
    experience: '10 лет',
    description: 'Специалист по диагностике и лечению заболеваний нервной системы. Помогает пациентам с головными болями, мигренями, нарушениями сна и другими неврологическими проблемами.'
  },
  {
    id: 5,
    name: 'Доктор Волков',
    specialization: 'Офтальмолог',
    experience: '18 лет',
    description: 'Врач-офтальмолог с большим опытом работы. Проводит диагностику и лечение заболеваний глаз, подбор очков и контактных линз. Использует современное оборудование для точной диагностики.'
  },
  {
    id: 6,
    name: 'Доктор Новикова',
    specialization: 'Педиатр',
    experience: '14 лет',
    description: 'Опытный педиатр, специализирующийся на лечении детей всех возрастов. Доброжелательный подход к маленьким пациентам, комплексное лечение детских заболеваний.'
  }
]

export const fetchDoctors = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return russianDoctors
}

export const fetchDoctor = async (doctorId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const doctor = russianDoctors.find(d => d.id === doctorId)
  if (doctor) {
    return doctor
  }
  const response = await api.get(`/posts/${doctorId}`)
  return {
    id: response.data.id,
    name: `Доктор ${response.data.title.split(' ')[0]}`,
    specialization: response.data.title,
    experience: `${5 + response.data.id} лет`,
    description: response.data.body,
  }
}
