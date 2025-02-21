export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  doctorId: string;
  patientName: string;
  appointmentDate: string;
  duration: number;
  appointmentType: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    name: string;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}