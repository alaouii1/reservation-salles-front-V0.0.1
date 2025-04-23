import { Salle } from "./Salle";
import { Utilisateur } from "./Utilisateur";

export type ReservationStatus = 'en_attente' | 'confirmee' | 'annulee';

export interface Reservation {
  id: number;
  salleId: number;
  salleNom: string;
  localisationNom: string;
  dateDebut: string;
  dateFin: string;
  status: ReservationStatus;
  userId: number;
  createdAt: string;
  salle: Salle;
  utilisateur: Utilisateur;
}