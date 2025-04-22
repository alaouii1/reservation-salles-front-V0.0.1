// src/services/salleService.ts
import { api } from '../api/axios';
import { Salle, SalleRequest } from '../types/Salle';

export const getAllSalles = () => api.get<Salle[]>('/salles');

export const getSalleById = (id: number) => api.get<Salle>(`/salles/${id}`);

export const createSalle = (data: SalleRequest) =>
  api.post<Salle>('/salles', data);

export const updateSalle = (id: number, data: SalleRequest) =>
  api.put<Salle>(`/salles/${id}`, data);

export const deleteSalle = (id: number) => api.delete(`/salles/${id}`);
