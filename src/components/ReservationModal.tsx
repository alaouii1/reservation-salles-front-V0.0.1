import React, { useState } from 'react';
import { Calendar, X, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    name: string;
    location: string;
    description: string;
  };
}

interface ReservationForm {
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
}

const TimeInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  id: string;
  label: string;
  error?: string;
}> = ({ value, onChange, id, label, error }) => {
  const validateTimeFormat = (time: string) => {
    // Permet la saisie partielle pendant que l'utilisateur tape
    if (time === '') return true;
    
    // Vérifie le format final HH:mm
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const formatTimeInput = (input: string) => {
    // Supprime tout sauf les chiffres
    const numbers = input.replace(/[^\d]/g, '');
    
    // Format automatique HH:mm
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    }
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          id={id}
          className={`w-full pl-10 pr-4 py-2 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg`}
          value={value}
          onChange={(e) => {
            const formattedValue = formatTimeInput(e.target.value);
            onChange(formattedValue);
          }}
          placeholder="HH:mm"
          maxLength={5}
        />
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, room }) => {
  const [form, setForm] = useState<ReservationForm>({
    date: new Date(),
    startTime: "",
    endTime: "",
    reason: ""
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeErrors, setTimeErrors] = useState({
    startTime: '',
    endTime: ''
  });

  const validateTime = (time: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Réinitialise les erreurs pendant la saisie
    setTimeErrors(prev => ({ ...prev, [field]: '' }));

    // Valide le format final si la longueur est correcte
    if (value.length === 5 && !validateTime(value)) {
      setTimeErrors(prev => ({ 
        ...prev, 
        [field]: 'Format invalide. Utilisez HH:mm (ex: 09:30)'
      }));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validation des horaires
    let hasError = false;
    const newErrors = { startTime: '', endTime: '' };

    if (!validateTime(form.startTime)) {
      newErrors.startTime = 'Heure de début invalide';
      hasError = true;
    }

    if (!validateTime(form.endTime)) {
      newErrors.endTime = 'Heure de fin invalide';
      hasError = true;
    }

    if (!hasError) {
      const [startHour, startMinute] = form.startTime.split(':').map(Number);
      const [endHour, endMinute] = form.endTime.split(':').map(Number);
      
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      
      if (endTotal <= startTotal) {
        newErrors.endTime = "L'heure de fin doit être après l'heure de début";
        hasError = true;
      }
    }

    setTimeErrors(newErrors);

    if (hasError) {
      return;
    }

    // TODO: Check availability and persist reservation
    console.log('Form submitted:', form);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-[800px] shadow-xl">
          <div className="p-6">
            {/* Title */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Calendar className="w-5 h-5" />
                <h2 className="text-xl font-medium mt-3">Détails de la réservation</h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600"
                aria-label="Fermer le modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-lg mb-1.5">{room.name}</h3>
              <div className="space-y-1.5 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{room.location}</span>
                </div>
                <p className="text-sm">{room.description}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Date */}
              <div>
                <label htmlFor="reservation-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date de réservation
                </label>
                <div className="relative">
                  <input
                    id="reservation-date"
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white cursor-pointer"
                    value={format(form.date, 'EEEE d MMMM yyyy', { locale: fr })}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    readOnly
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {showDatePicker && (
                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <DayPicker
                        mode="single"
                        selected={form.date}
                        onSelect={(date) => {
                          if (date) {
                            setForm({ ...form, date });
                            setShowDatePicker(false);
                          }
                        }}
                        locale={fr}
                        className="p-3"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Heure de début
                  </label>
                  <TimeInput
                    value={form.startTime}
                    onChange={(value) => handleTimeChange('startTime', value)}
                    id="start-time"
                    label="Heure de début"
                    error={timeErrors.startTime}
                  />
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Heure de fin
                  </label>
                  <TimeInput
                    value={form.endTime}
                    onChange={(value) => handleTimeChange('endTime', value)}
                    id="end-time"
                    label="Heure de fin"
                    error={timeErrors.endTime}
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reservation-reason" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Motif de la réservation
                </label>
                <textarea
                  id="reservation-reason"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none h-20"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Précisez le motif de votre réservation (cours, réunion, examen...)"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal; 