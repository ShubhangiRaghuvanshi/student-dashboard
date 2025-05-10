import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

type Student = {
  id: number;
  name: string;
  email: string;
  course: string;
};

type Props = {
  onAddStudent: (student: Student) => void;
};

const AddStudentForm: React.FC<Props> = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !course) {
      setError('Please fill in all fields.');
      return;
    }

    const newStudent: Student = {
      id: Date.now(),
      name,
      email,
      course,
    };

    onAddStudent(newStudent);
    setName('');
    setEmail('');
    setCourse('');
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto mt-12">
      <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
        <UserPlus className="text-blue-600 mr-3" size={26} />
        <h2 className="text-2xl font-semibold text-gray-900">Add New Student</h2>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g. Priya Sharma"
            aria-label="Full Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g. priya@example.com"
            aria-label="Email Address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Course</label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g. Computer Science"
            aria-label="Course"
            required
          />
        </div>

        <button
  type="submit"
  className="w-full bg-blue-600 hover:bg-blue-700 text-black font-semibold py-3 rounded-lg flex items-center justify-center shadow-md transition z-10"
>
  <UserPlus className="mr-2" size={18} />
  Add Student
</button>

      </form>
    </div>
  );
};

export default AddStudentForm;
