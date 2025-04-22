import { Reservation } from '../types/Reservation';

export const mockReservations: Reservation[] = [
  {
    id: 1,
    salleId: 1,
    salleNom: 'Amphithéâtre A',
    localisationNom: 'Bâtiment Central',
    dateDebut: '2024-04-18T14:00:00',
    dateFin: '2024-04-18T16:00:00',
    status: 'confirmee',
    userId: 1,
    createdAt: '2024-03-15T10:00:00'
  },
  {
    id: 2,
    salleId: 2,
    salleNom: 'Salle B204',
    localisationNom: 'Annexe 1',
    dateDebut: '2024-04-20T09:00:00',
    dateFin: '2024-04-20T12:00:00',
    status: 'en_attente',
    userId: 1,
    createdAt: '2024-03-16T11:30:00'
  },
  {
    id: 3,
    salleId: 3,
    salleNom: 'Laboratoire C103',
    localisationNom: 'Annexe 2',
    dateDebut: '2024-03-15T13:00:00',
    dateFin: '2024-03-15T15:00:00',
    status: 'annulee',
    userId: 1,
    createdAt: '2024-03-10T09:15:00'
  },
  {
    id: 4,
    salleId: 4,
    salleNom: 'Salle de conférence D101',
    localisationNom: 'Bâtiment Principal',
    dateDebut: '2024-04-25T10:00:00',
    dateFin: '2024-04-25T12:00:00',
    status: 'confirmee',
    userId: 1,
    createdAt: '2024-03-17T14:20:00'
  },
  {
    id: 5,
    salleId: 5,
    salleNom: 'Salle de réunion E305',
    localisationNom: 'Annexe 3',
    dateDebut: '2024-03-10T09:00:00',
    dateFin: '2024-03-10T11:00:00',
    status: 'confirmee',
    userId: 1,
    createdAt: '2024-03-01T08:00:00'
  },
  {
    id: 6,
    salleId: 1,
    salleNom: 'Amphithéâtre A',
    localisationNom: 'Bâtiment Central',
    dateDebut: '2024-04-22T15:00:00',
    dateFin: '2024-04-22T17:00:00',
    status: 'en_attente',
    userId: 1,
    createdAt: '2024-03-18T16:45:00'
  }
]; 