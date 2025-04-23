import { api } from '../api/axios';
import { Reservation } from '../types/Reservation';
import { mockReservations } from '../mocks/reservationsMock';

// Temporary mock implementation
export const getUserReservations = () => 
  Promise.resolve({ data: mockReservations });

export const cancelReservation = (id: number) => 
  Promise.resolve({ 
    data: mockReservations.find(r => r.id === id)
  });

  export const getNextReservation = () => api.get<Reservation>('http://localhost:8080/api/reservations/next/1');

export const createReservation = (data: {
  salleId: number;
  dateDebut: string;
  dateFin: string;
}) => Promise.resolve({
  data: {
    id: Math.max(...mockReservations.map(r => r.id)) + 1,
    ...data,
    status: 'en_attente',
    userId: 1,
    createdAt: new Date().toISOString(),
    salleNom: 'Nouvelle Salle',
    localisationNom: 'Localisation'
  } as Reservation
});
