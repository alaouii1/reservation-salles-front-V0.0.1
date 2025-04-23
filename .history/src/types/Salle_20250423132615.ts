export interface Salle {
    id: number;
    nom: string;
    description?: string;
    localisation : {
      nom: string;
    };
  }
  
  export interface SalleRequest {
    nom: string;
    description?: string;
    localisation : {
      nom: string;
    };
  }
  