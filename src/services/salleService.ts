// src/services/salleService.ts
import { api } from '../api/axios';
import { Salle, SalleRequest } from '../types/Salle';

export const getAllSalles = () => api.get<Salle[]>('http://localhost:8080/api/salles');

export const getSalleById = (id: number) => api.get<Salle>(`http://localhost:8080/api/salles/${id}`);

export const createSalle = (data: SalleRequest) =>
  api.post<Salle>('http://localhost:8080/api/salles', data);

export const updateSalle = (id: number, data: SalleRequest) =>
  api.put<Salle>(`http://localhost:8080/api/salles/${id}`, data);

export const deleteSalle = (id: number) => api.delete(`http://localhost:8080/api/salles/${id}`);
