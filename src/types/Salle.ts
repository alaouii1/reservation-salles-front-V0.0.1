export interface Salle {
    id: number;
    nom: string;
    description?: string;
    localisationNom: string;
  }
  
  export interface SalleRequest {
    nom: string;
    description?: string;
    localisationNom: string;
  }
  