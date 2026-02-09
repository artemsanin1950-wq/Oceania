import axios from 'axios'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const russianPatients = [
  {
    id: 1,
    name: 'Иванов Иван Иванович',
    email: 'ivanov@example.com',
    phone: '+7 (495) 123-45-67',
    username: 'ivanov',
    website: 'ivanov.ru',
    address: {
      street: 'ул. Ленина, д. 10',
      suite: 'кв. 25',
      city: 'Москва',
      zipcode: '101000',
      geo: { lat: '55.7558', lng: '37.6173' }
    },
    company: {
      name: 'ООО "Технологии"',
      catchPhrase: 'Инновационные решения',
      bs: 'IT-услуги'
    }
  },
  {
    id: 2,
    name: 'Петрова Мария Сергеевна',
    email: 'petrova@example.com',
    phone: '+7 (812) 234-56-78',
    username: 'petrova',
    website: 'petrova.ru',
    address: {
      street: 'пр. Невский, д. 50',
      suite: 'кв. 12',
      city: 'Санкт-Петербург',
      zipcode: '191186',
      geo: { lat: '59.9343', lng: '30.3351' }
    },
    company: {
      name: 'ЗАО "Медицина"',
      catchPhrase: 'Здоровье превыше всего',
      bs: 'Медицинские услуги'
    }
  },
  {
    id: 3,
    name: 'Сидоров Алексей Петрович',
    email: 'sidorov@example.com',
    phone: '+7 (343) 345-67-89',
    username: 'sidorov',
    website: 'sidorov.ru',
    address: {
      street: 'ул. Мира, д. 5',
      suite: 'кв. 8',
      city: 'Екатеринбург',
      zipcode: '620000',
      geo: { lat: '56.8431', lng: '60.6454' }
    },
    company: {
      name: 'ИП Сидоров',
      catchPhrase: 'Качественные услуги',
      bs: 'Консалтинг'
    }
  },
  {
    id: 4,
    name: 'Козлова Анна Владимировна',
    email: 'kozlova@example.com',
    phone: '+7 (391) 456-78-90',
    username: 'kozlova',
    website: 'kozlova.ru',
    address: {
      street: 'ул. Красная, д. 20',
      suite: 'кв. 15',
      city: 'Красноярск',
      zipcode: '660000',
      geo: { lat: '56.0184', lng: '92.8672' }
    },
    company: {
      name: 'ООО "Стройка"',
      catchPhrase: 'Надёжное строительство',
      bs: 'Строительство'
    }
  },
  {
    id: 5,
    name: 'Морозов Дмитрий Александрович',
    email: 'morozov@example.com',
    phone: '+7 (383) 567-89-01',
    username: 'morozov',
    website: 'morozov.ru',
    address: {
      street: 'ул. Советская, д. 30',
      suite: 'кв. 42',
      city: 'Новосибирск',
      zipcode: '630000',
      geo: { lat: '55.0084', lng: '82.9357' }
    },
    company: {
      name: 'АО "Транспорт"',
      catchPhrase: 'Быстрая доставка',
      bs: 'Логистика'
    }
  },
  {
    id: 6,
    name: 'Волкова Елена Николаевна',
    email: 'volkova@example.com',
    phone: '+7 (846) 678-90-12',
    username: 'volkova',
    website: 'volkova.ru',
    address: {
      street: 'ул. Московское шоссе, д. 15',
      suite: 'кв. 7',
      city: 'Самара',
      zipcode: '443000',
      geo: { lat: '53.2001', lng: '50.15' }
    },
    company: {
      name: 'ООО "Образование"',
      catchPhrase: 'Знания для всех',
      bs: 'Образовательные услуги'
    }
  },
  {
    id: 7,
    name: 'Новиков Сергей Викторович',
    email: 'novikov@example.com',
    phone: '+7 (351) 789-01-23',
    username: 'novikov',
    website: 'novikov.ru',
    address: {
      street: 'пр. Ленина, д. 100',
      suite: 'кв. 33',
      city: 'Челябинск',
      zipcode: '454000',
      geo: { lat: '55.1644', lng: '61.4368' }
    },
    company: {
      name: 'ИП Новиков',
      catchPhrase: 'Индивидуальный подход',
      bs: 'Услуги'
    }
  },
  {
    id: 8,
    name: 'Федорова Ольга Игоревна',
    email: 'fedorova@example.com',
    phone: '+7 (831) 890-12-34',
    username: 'fedorova',
    website: 'fedorova.ru',
    address: {
      street: 'ул. Большая Покровская, д. 1',
      suite: 'кв. 18',
      city: 'Нижний Новгород',
      zipcode: '603000',
      geo: { lat: '56.2965', lng: '43.9361' }
    },
    company: {
      name: 'ООО "Торговля"',
      catchPhrase: 'Лучшие цены',
      bs: 'Розничная торговля'
    }
  },
  {
    id: 9,
    name: 'Смирнов Павел Олегович',
    email: 'smirnov@example.com',
    phone: '+7 (342) 901-23-45',
    username: 'smirnov',
    website: 'smirnov.ru',
    address: {
      street: 'ул. Ленина, д. 50',
      suite: 'кв. 22',
      city: 'Пермь',
      zipcode: '614000',
      geo: { lat: '58.0105', lng: '56.2294' }
    },
    company: {
      name: 'АО "Энергия"',
      catchPhrase: 'Энергия для жизни',
      bs: 'Энергетика'
    }
  },
  {
    id: 10,
    name: 'Лебедева Татьяна Дмитриевна',
    email: 'lebedeva@example.com',
    phone: '+7 (4212) 012-34-56',
    username: 'lebedeva',
    website: 'lebedeva.ru',
    address: {
      street: 'ул. Муравьёва-Амурского, д. 25',
      suite: 'кв. 11',
      city: 'Хабаровск',
      zipcode: '680000',
      geo: { lat: '48.4647', lng: '135.0578' }
    },
    company: {
      name: 'ООО "Дальний Восток"',
      catchPhrase: 'Развитие региона',
      bs: 'Региональное развитие'
    }
  }
]

export const fetchPatients = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return russianPatients
}

export const fetchPatient = async (patientId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const patient = russianPatients.find(p => p.id === patientId)
  if (patient) {
    return patient
  }
  const response = await api.get(`/users/${patientId}`)
  return response.data
}

export const createPatient = async (patientData) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const newPatient = {
    id: Date.now(),
    name: patientData.name,
    email: patientData.email || `${patientData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    phone: patientData.phone || '+7 (XXX) XXX-XX-XX',
    username: patientData.name.toLowerCase().replace(/\s/g, '.'),
    website: `${patientData.name.toLowerCase().replace(/\s/g, '.')}.ru`,
    address: {
      city: patientData.city || 'Не указан',
      street: patientData.street || 'Не указан',
      suite: patientData.suite || '',
      zipcode: '',
      geo: { lat: '', lng: '' }
    },
    company: {
      name: patientData.company || 'Не указано',
      catchPhrase: '',
      bs: ''
    }
  }
  return newPatient
}

export const updatePatient = async ({ id, ...patientData }) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const updatedPatient = {
    id: id,
    name: patientData.name,
    email: patientData.email,
    phone: patientData.phone,
    username: patientData.username || patientData.name.toLowerCase().replace(/\s/g, '.'),
    website: patientData.website || `${patientData.name.toLowerCase().replace(/\s/g, '.')}.ru`,
    address: {
      city: patientData.city || 'Не указан',
      street: patientData.street || '',
      suite: patientData.suite || '',
      zipcode: '',
      geo: { lat: '', lng: '' }
    },
    company: {
      name: patientData.company || 'Не указано',
      catchPhrase: '',
      bs: ''
    }
  }
  return updatedPatient
}

export const deletePatient = async (patientId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return { id: patientId }
}
