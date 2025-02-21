import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, parseISO, isAfter } from 'date-fns';
import { api } from '../lib/api';
import { Doctor, TimeSlot } from '../types/database';
import { Calendar, Clock } from 'lucide-react';

export default function AppointmentBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    appointmentType: 'Routine Check-Up',
    notes: '',
  });

  useEffect(() => {
    async function fetchDoctor() {
      if (!doctorId) return;

      try {
        const doctors = await api.doctors.getAll();
        const doctor = doctors.find(d => d._id === doctorId);
        if (doctor) {
          setDoctor(doctor);
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    }

    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    async function fetchTimeSlots() {
      if (!doctor) return;

      try {
        const slots = await api.doctors.getSlots(doctorId!, format(selectedDate, 'yyyy-MM-dd'));
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeSlots();
  }, [doctor, selectedDate, doctorId]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !selectedSlot) return;

    try {
      const appointmentDate = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedSlot.start}`;

      await api.appointments.create({
        doctorId: doctor._id,
        patientName: bookingData.patientName,
        appointmentDate,
        duration: 30,
        appointmentType: bookingData.appointmentType,
        notes: bookingData.notes,
      });

      navigate('/my-appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  if (loading || !doctor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Book Appointment with {doctor.name}
        </h1>
        <p className="text-gray-600 mb-6">{doctor.specialization}</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {[...Array(7)].map((_, index) => {
                const date = addDays(new Date(), index);
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center p-3 rounded-lg min-w-[100px] ${
                      format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-sm">{format(date, 'EEE')}</span>
                    <span className="text-lg font-semibold">{format(date, 'd')}</span>
                    <span className="text-sm">{format(date, 'MMM')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h2>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg flex items-center justify-center space-x-2 ${
                    selectedSlot === slot
                      ? 'bg-pink-500 text-white'
                      : slot.available
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{slot.start}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedSlot && (
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={bookingData.patientName}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, patientName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Type
                </label>
                <select
                  value={bookingData.appointmentType}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, appointmentType: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option>Routine Check-Up</option>
                  <option>Ultrasound</option>
                  <option>First Trimester Screening</option>
                  <option>Second Trimester Screening</option>
                  <option>Glucose Test</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}