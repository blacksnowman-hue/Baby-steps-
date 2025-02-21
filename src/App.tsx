import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DoctorList from './components/DoctorList';
import AppointmentBooking from './components/AppointmentBooking';
import MyAppointments from './components/MyAppointments';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DoctorList />} />
            <Route path="/book/:doctorId" element={<AppointmentBooking />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;