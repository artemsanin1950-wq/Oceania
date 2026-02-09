import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAppointments, fetchAppointment, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments'

export const appointmentKeys = {
  all: ['appointments'],
  lists: () => [...appointmentKeys.all, 'list'],
  list: (filters) => [...appointmentKeys.lists(), { filters }],
  details: () => [...appointmentKeys.all, 'detail'],
  detail: (id) => [...appointmentKeys.details(), id],
}

export const useAppointments = (options = {}) => {
  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: fetchAppointments,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 20000,
    select: (data) => data,
    ...options,
  })
}

export const useAppointment = (appointmentId, options = {}) => {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => fetchAppointment(appointmentId),
    enabled: !!appointmentId,
    staleTime: 2 * 60 * 1000,
    ...options,
  })
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: (newAppointment) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.setQueryData(appointmentKeys.lists(), (oldAppointments) => {
        return [newAppointment, ...(oldAppointments || [])]
      })
    },
    onError: (error) => {
      console.error('Ошибка при создании записи:', error)
    },
  })
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(appointmentKeys.detail(updatedAppointment.id), updatedAppointment)
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
    },
    onError: (error) => {
      console.error('Ошибка при обновлении записи:', error)
    },
  })
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAppointment,
    onMutate: async (appointmentId) => {
      await queryClient.cancelQueries({ queryKey: appointmentKeys.lists() })

      const previousAppointments = queryClient.getQueryData(appointmentKeys.lists())

      queryClient.setQueryData(appointmentKeys.lists(), (oldAppointments) => {
        return oldAppointments.filter((appointment) => appointment.id !== appointmentId)
      })

      return { previousAppointments }
    },
    onError: (error, appointmentId, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(appointmentKeys.lists(), context.previousAppointments)
      }
      console.error('Ошибка при удалении записи:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
    },
  })
}

