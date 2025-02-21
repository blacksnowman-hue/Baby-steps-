import express from 'express';
import { Doctor } from '../models/doctor.js';
import { Appointment } from '../models/appointment.js';
import { startOfDay, endOfDay, parseISO, addMinutes, format } from 'date-fns';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available slots for a doctor
router.get('/:id/slots', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const queryDate = parseISO(date);
    const start = startOfDay(queryDate);
    const end = endOfDay(queryDate);

    // Get existing appointments
    const appointments = await Appointment.find({
      doctorId: id,
      appointmentDate: {
        $gte: start,
        $lte: end
      }
    });

    // Generate all possible slots
    const slots = [];
    let currentTime = parseISO(`${date}T${doctor.workingHours.start}`);
    const endTime = parseISO(`${date}T${doctor.workingHours.end}`);

    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, 30);
      
      // Check if slot overlaps with any existing appointment
      const isBooked = appointments.some(appointment => {
        const appointmentStart = new Date(appointment.appointmentDate);
        const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
        return (
          (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd)
        );
      });

      if (!isBooked) {
        slots.push({
          start: format(currentTime, 'HH:mm'),
          end: format(slotEnd, 'HH:mm'),
          available: true
        });
      }

      currentTime = slotEnd;
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const doctorRoutes = router;