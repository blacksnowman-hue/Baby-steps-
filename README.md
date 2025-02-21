# BabySteps - Prenatal Care Appointment System

A modern, user-friendly appointment scheduling system for prenatal care services, built with React, Node.js, and MongoDB.

![BabySteps Screenshot](https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200)

## Features

- 👩‍⚕️ Browse and select from specialized prenatal care doctors
- 📅 Real-time appointment scheduling
- ⏰ Intelligent time slot management
- 📱 Responsive design for all devices
- 🗓️ Appointment management (view, schedule, cancel)

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Router
  - Lucide Icons
  - Date-fns

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - CORS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account (for database)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/babysteps.git
cd babysteps
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string.

4. **Start the development server**

```bash
npm run dev
```

This will start both the frontend (Vite) and backend (Express) servers concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
babysteps/
├── src/                    # Frontend source files
│   ├── components/        # React components
│   ├── lib/              # Utility functions and API client
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Main React component
├── server/                # Backend source files
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── index.js          # Server entry point
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id/slots` - Get available time slots for a doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI styling with [Tailwind CSS](https://tailwindcss.com/)
- Date handling by [date-fns](https://date-fns.org/)
