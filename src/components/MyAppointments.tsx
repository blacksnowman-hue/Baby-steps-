import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Appointment } from '../types/database';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Trash2 } from 'lucide-react';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const data = await api.appointments.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelAppointment = async (id: string) => {
    try {
      await api.appointments.delete(id);
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
      
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
          <p className="text-gray-500">Schedule your first appointment with one of our specialists.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {appointment.doctor?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{appointment.appointmentType}</p>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(parseISO(appointment.appointmentDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {format(parseISO(appointment.appointmentDate), 'h:mm a')}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="mt-4 text-gray-600 text-sm">{appointment.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}