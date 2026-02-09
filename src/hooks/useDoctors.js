import { useQuery } from '@tanstack/react-query'
import { fetchDoctors, fetchDoctor } from '../api/doctors'

export const doctorKeys = {
  all: ['doctors'],
  lists: () => [...doctorKeys.all, 'list'],
  details: () => [...doctorKeys.all, 'detail'],
  detail: (id) => [...doctorKeys.details(), id],
}

export const useDoctors = (options = {}) => {
  return useQuery({
    queryKey: doctorKeys.lists(),
    queryFn: fetchDoctors,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 60000,
    select: (data) => data,
    ...options,
  })
}

export const useDoctor = (doctorId, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.detail(doctorId),
    queryFn: () => fetchDoctor(doctorId),
    enabled: !!doctorId,
    staleTime: 10 * 60 * 1000,
    ...options,
  })
}

