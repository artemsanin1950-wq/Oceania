import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPatients, fetchPatient, createPatient, updatePatient, deletePatient } from '../api/patients'

export const patientKeys = {
  all: ['patients'],
  lists: () => [...patientKeys.all, 'list'],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, 'detail'],
  detail: (id) => [...patientKeys.details(), id],
}

export const usePatients = (options = {}) => {
  return useQuery({
    queryKey: patientKeys.lists(),
    queryFn: fetchPatients,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
    ...options,
  })
}

export const usePatient = (patientId, options = {}) => {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatient(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatient,
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.setQueryData(patientKeys.lists(), (oldPatients) => {
        return [newPatient, ...(oldPatients || [])]
      })
    },
    onError: (error) => {
      console.error('Ошибка при создании пациента:', error)
    },
  })
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(patientKeys.detail(updatedPatient.id), updatedPatient)
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
    onError: (error) => {
      console.error('Ошибка при обновлении пациента:', error)
    },
  })
}

export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePatient,
    onMutate: async (patientId) => {
      await queryClient.cancelQueries({ queryKey: patientKeys.lists() })

      const previousPatients = queryClient.getQueryData(patientKeys.lists())

      queryClient.setQueryData(patientKeys.lists(), (oldPatients) => {
        return oldPatients.filter((patient) => patient.id !== patientId)
      })

      return { previousPatients }
    },
    onError: (error, patientId, context) => {
      if (context?.previousPatients) {
        queryClient.setQueryData(patientKeys.lists(), context.previousPatients)
      }
      console.error('Ошибка при удалении пациента:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}

