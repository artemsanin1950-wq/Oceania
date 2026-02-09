import { useQuery } from '@tanstack/react-query'
import { usePatient } from './usePatients'
import { useDoctor } from './useDoctors'

export const profileKeys = {
  all: ['profile'],
  patient: (id) => [...profileKeys.all, 'patient', id],
  doctor: (id) => [...profileKeys.all, 'doctor', id],
}

export const usePatientProfile = (patientId, options = {}) => {
  return usePatient(patientId, {
    ...options,
    enabled: !!patientId && (options.enabled !== false),
  })
}

export const useDoctorProfile = (doctorId, options = {}) => {
  return useDoctor(doctorId, {
    ...options,
    enabled: !!doctorId && (options.enabled !== false),
  })
}

