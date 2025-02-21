const API_URL = 'http://localhost:5000/api';

export const api = {
  doctors: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      return response.json();
    },
    getSlots: async (doctorId: string, date: string) => {
      const response = await fetch(`${API_URL}/doctors/${doctorId}/slots?date=${date}`);
      if (!response.ok) throw new Error('Failed to fetch slots');
      return response.json();
    }
  },
  appointments: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
    create: async (appointment: any) => {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create appointment');
      }
      return response.json();
    },
    update: async (id: string, appointment: any) => {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update appointment');
      }
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      return response.json();
    }
  }
};