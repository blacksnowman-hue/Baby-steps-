import express from 'express';
import { Appointment } from '../models/appointment.js';
import { Doctor } from '../models/doctor.js';
import { parseISO, addMinutes } from 'date-fns';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctorId', 'name')
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'name');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { doctorId, appointmentDate, duration, patientName, appointmentType, notes } = req.body;

    // Validate time slot availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const requestedStart = parseISO(appointmentDate);
    const requestedEnd = addMinutes(requestedStart, duration);

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      $or: [
        {
          appointmentDate: {
            $lt: requestedEnd,
            $gte: requestedStart
          }
        },
        {
          $and: [
            { appointmentDate: { $lte: requestedStart } },
            {
              $expr: {
                $gt: {
                  $add: [
                    { $dateFromString: { dateString: '$appointmentDate' } },
                    { $multiply: ['$duration', 60000] }
                  ]
                },
                requestedStart
              }
            }
          ]
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    const appointment = new Appointment({
      doctorId,
      appointmentDate: requestedStart,
      duration,
      patientName,
      appointmentType,
      notes
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const { appointmentDate, duration } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointmentDate && duration) {
      const requestedStart = parseISO(appointmentDate);
      const requestedEnd = addMinutes(requestedStart, duration);

      // Check for conflicts excluding current appointment
      const conflictingAppointment = await Appointment.findOne({
        doctorId: appointment.doctorId,
        _id: { $ne: req.params.id },
        $or: [
          {
            appointmentDate: {
              $lt: requestedEnd,
              $gte: requestedStart
            }
          },
          {
            $and: [
              { appointmentDate: { $lte: requestedStart } },
              {
                $expr: {
                  $gt: {
                    $add: [
                      { $dateFromString: { dateString: '$appointmentDate' } },
                      { $multiply: ['$duration', 60000] }
                    ]
                  },
                  requestedStart
                }
              }
            ]
          }
        ]
      });

      if (conflictingAppointment) {
        return res.status(400).json({ message: 'Time slot is not available' });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const appointmentRoutes = router;