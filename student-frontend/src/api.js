import axios from 'axios';

const BASE_URL = 'http://localhost:8080/student';

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentApi = {
  // Fetch all students
  getAllStudents: async () => {
    const response = await api.get('');
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/id/${id}`);
    return response.data;
  },

  // Find student by Name
  getStudentByName: async (name) => {
    const response = await api.get(`/name/${name}`);
    return response.data;
  },

  // Get students by percentage
  getStudentsByPercentage: async (percentage) => {
    const response = await api.get(`/percentage/${percentage}`);
    return response.data;
  },

  // Insert a single student
  insertStudent: async (student) => {
    const response = await api.post('', student);
    return response.data;
  },

  // Bulk insert students
  insertListStudent: async (students) => {
    const response = await api.post('/list', students);
    return response.data;
  },

  // Delete student by ID
  deleteStudent: async (id) => {
    const response = await api.delete(`/id/${id}`);
    return response.data;
  },

  // Update student email by ID
  updateStudentEmail: async (id, email) => {
    const response = await api.put(`/email/${id}/${encodeURIComponent(email)}`);
    return response.data;
  },

  // Sort students by column
  sortStudentsByColumn: async (columnName) => {
    const response = await api.get(`/sort/${columnName}`);
    return response.data;
  },

  // Update student grade by percentage range
  updateStudentGradeByPercentage: async (start, end, grade) => {
    const response = await api.patch(`/grade`, null, {
      params: { start, end, grade }
    });
    return response.data;
  },

  // Update section by student grade
  updateSectionByStudentGrade: async (grade, section) => {
    const response = await api.patch(`/section`, null, {
      params: { grade, section }
    });
    return response.data;
  },

  // Delete students by percentage range
  deleteStudentsByPercentage: async (start, end) => {
    const response = await api.delete(`/percentage`, {
      params: { start, end }
    });
    return response.data;
  }
};
