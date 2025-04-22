import axios from 'axios';
import { Reservation } from '../types/Reservation';

export const getNextReservation = async (): Promise<Reservation> => {
  try {
    const response = await axios.get('/next/1');
    return response.data;
  } catch (error) {
    console.error('Error fetching next reservation:', error);
    throw error; // Ensure errors are propagated
  }
};
