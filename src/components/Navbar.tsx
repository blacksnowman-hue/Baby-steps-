import React from 'react';
import { Link } from 'react-router-dom';
import { Baby, Calendar } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Baby className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-bold text-gray-900">BabySteps</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Doctors
            </Link>
            <Link
              to="/my-appointments"
              className="flex items-center space-x-1 text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              <span>My Appointments</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}