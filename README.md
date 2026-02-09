1. Установка и настройка

Установил необходимые пакеты:
- @tanstack/react-query
- @tanstack/react-query-devtools

Создал файл src/lib/queryClient.js с настройками QueryClient. Там настроил:
- staleTime: 5 минут - время когда данные считаются свежими
- cacheTime: 10 минут - время хранения данных в кэше
- retry: 3 попытки при ошибке
- retryDelay: экспоненциальная задержка между попытками

В main.jsx обернул приложение в QueryClientProvider и добавил DevTools для разработки.

2. Замена useEffect на useQuery

В проекте было 3 компонента которые использовали useEffect для загрузки данных:
- PatientsList - загрузка пациентов
- DoctorsList - загрузка врачей  
- AppointmentsList - загрузка записей

Все они теперь используют useQuery вместо useEffect. Это упростило код и добавило автоматическое кэширование.

3. Кастомные хуки

Создал 4 кастомных хука в папке hooks/:
- usePatients - для работы с пациентами
- useDoctors - для работы с врачами
- useAppointments - для работы с записями
- useProfile - для зависимых запросов профилей

Все API функции вынес в отдельную папку api/ для лучшей организации кода.

4. Мутации

Реализовал мутации для создания, обновления и удаления:
- useCreatePatient, useCreateAppointment
- useUpdatePatient, useUpdateAppointment  
- useDeletePatient, useDeleteAppointment

После успешных мутаций кэш автоматически обновляется через invalidateQueries или setQueryData.

5. Оптимистичные обновления

Для удаления записей добавил оптимистичные обновления. Это значит что UI обновляется сразу, а если запрос упадет с ошибкой - изменения откатываются. Использовал onMutate, onError и onSettled callbacks.

6. Дополнительные возможности

Настроил автоматическое обновление данных:
- Пациенты обновляются каждые 30 секунд
- Врачи каждые 60 секунд
- Записи каждые 20 секунд

Реализовал зависимые запросы (dependent queries) - профили загружаются только когда выбран конкретный пациент или врач.

Добавил prefetching - при наведении на карточку данные предзагружаются для быстрого отображения.

7. Обработка ошибок

Настроил глобальную обработку ошибок в QueryClient. При ошибках запросы повторяются автоматически (до 3 раз для queries, до 1 раза для mutations). Ошибки 4xx не повторяются.

Добавил ErrorBoundary компонент для отлова критических ошибок.

Query Keys и их логика

Query keys используются для идентификации данных в кэше React Query. Я организовал их иерархически.

Для пациентов:

```javascript
patientKeys = {
  all: ['patients'],
  lists: () => ['patients', 'list'],
  list: (filters) => ['patients', 'list', { filters }],
  details: () => ['patients', 'detail'],
  detail: (id) => ['patients', 'detail', id]
}
```

- all - базовый ключ для всех запросов пациентов
- lists - для списков пациентов
- list - для списка с фильтрами
- details - для детальных запросов
- detail(id) - для конкретного пациента по ID

Такая структура позволяет легко инвалидировать связанные запросы. Например если обновить пациента, можно инвалидировать все списки через patientKeys.lists().

Для врачей:

```javascript
doctorKeys = {
  all: ['doctors'],
  lists: () => ['doctors', 'list'],
  details: () => ['doctors', 'detail'],
  detail: (id) => ['doctors', 'detail', id]
}
```

Аналогичная структура как для пациентов.

Для записей:

```javascript
appointmentKeys = {
  all: ['appointments'],
  lists: () => ['appointments', 'list'],
  list: (filters) => ['appointments', 'list', { filters }],
  details: () => ['appointments', 'detail'],
  detail: (id) => ['appointments', 'detail', id]
}
```

Такая же структура для записей на прием.

Сравнение до и после интеграции

До интеграции (lab 1)

В предыдущем проекте использовался обычный подход с useEffect и ручным управлением состоянием:

```javascript
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  loadPosts()
}, [])

const loadPosts = async () => {
  setLoading(true)
  setError(null)
  const result = await getPosts()
  
  if (result.success) {
    setPosts(result.data)
  } else {
    setError(result.error)
  }
  setLoading(false)
}
```

Проблемы этого подхода:
- Нужно вручную управлять loading, error состояниями
- При переключении вкладок запросы выполняются заново
- Нет кэширования - каждый раз идет запрос на сервер
- Много повторяющегося кода
- Сложно обрабатывать ошибки и повторные попытки

### После интеграции (lab 2)

Теперь используется useQuery:

```javascript
const { data: patients = [], isLoading, error, refetch } = usePatients()
```

Преимущества:
- Автоматическое управление состониями loading, error, success
- Кэширование данных - при повторном открытии вкладки данные берутся из кэша
- Автоматические повторные попытки при ошибках
- Меньше кода - не нужно писать try/catch и управлять состояниями
- Автоматическое обновление данных через refetchInterval
- Легко инвалидировать кэш после мутаций

Пример сравнения кода

До (создание поста):
```javascript
const addPost = async () => {
  setLoading(true)
  setError(null)
  
  const result = await createPost({
    title: newPostTitle,
    body: newPostBody,
  })

  if (result.success) {
    setPosts([result.data, ...posts])
    setNewPostTitle('')
    setNewPostBody('')
  } else {
    setError(result.error)
  }
  setLoading(false)
}
```

После (создание пациента):
```javascript
const createPatientMutation = useCreatePatient()

const handleCreatePatient = async () => {
  try {
    await createPatientMutation.mutateAsync({
      name: newPatientName,
      email: newPatientEmail,
    })
    setNewPatientName('')
    setNewPatientEmail('')
  } catch (err) {
    console.error('Ошибка:', err)
  }
}
```

Код стал короче и проще. Кэш обновляется автоматически через onSuccess callback в хуке.

Производительность

До интеграции:
- При каждом открытии вкладки выполнялся новый запрос
- Нет кэширования - лишние запросы к серверу
- При ошибке нужно вручную обрабатывать повтор

После интеграции:
- Данные кэшируются и переиспользуются
- Меньше запросов к серверу - лучше производительность
- Автоматические повторные попытки
- Prefetching улучшает UX

В Network tab видно что запросы не дублируются при переключении вкладок, данные берутся из кэша.

Структура проекта

lab2/
├── src/
│   ├── api/
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   └── index.js
│   ├── hooks/
│   │   ├── usePatients.js
│   │   ├── useDoctors.js
│   │   ├── useAppointments.js
│   │   ├── useProfile.js
│   │   └── index.js
│   ├── lib/
│   │   └── queryClient.js
│   ├── components/
│   │   └── ErrorBoundary.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

## Запуск проекта

Установка зависимостей:
```bash
npm install
```

Запуск в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу http://localhost:5173

Что было использовано в ходе лаборатрной работы

- React 18
- Vite
- React Query (TanStack Query) 5.17.0
- React Query DevTools
- Axios
- JSONPlaceholder API (для тестирования)

