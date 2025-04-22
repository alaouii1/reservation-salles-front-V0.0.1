import { Salle } from './Salle';
import { Utilisateur } from './Utilisateur';

export interface Reservation {
  id: number;
  salle: Salle;
  utilisateur: Utilisateur;
  dateDebut: string;
  dateFin: string;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
}
