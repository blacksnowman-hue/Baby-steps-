import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Doctor } from '../types/database';
import { Clock } from 'lucide-react';

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await api.doctors.getAll();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Our Prenatal Care Specialists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h2>
              <p className="text-gray-600 mb-4">{doctor.specialization}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {doctor.workingHours.start} - {doctor.workingHours.end}
                </span>
              </div>
              <Link
                to={`/book/${doctor._id}`}
                className="block w-full text-center bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}