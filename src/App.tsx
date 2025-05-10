import React, { useState, useEffect } from 'react';
import AddStudentForm from './components/AddStudentForm';
import StudentList from './components/StudentList';
import Login from './components/Login';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BookOpen, Filter, Loader, AlertCircle } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const courses = ['React', 'Node', 'JavaScript'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents([
        { id: 1, name: 'John Doe', email: 'john@example.com', course: 'React' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Node' },
        { id: 3, name: 'Tom Brown', email: 'tom@example.com', course: 'JavaScript' },
      ]);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
    setSelectedCourse('');
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditStudent = (id: number, updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    setSelectedCourse('');
  };

  const filteredStudents = selectedCourse
    ? students.filter((s) => s.course === selectedCourse)
    : students;

  const courseCount = students.reduce((acc, s) => {
    acc[s.course] = (acc[s.course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="h-10 w-10 text-indigo-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Student Dashboard</h1>
          </div>

          {user && (
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="h-10 w-10 rounded-full" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">{user.displayName?.charAt(0) || 'U'}</span>
                </div>
              )}
              <div className="text-sm">
                <p className="text-gray-800 font-medium">{user.displayName || user.email}</p>
                <p className="text-gray-600 text-xs">Administrator</p>
              </div>
            </div>
          )}
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-indigo-600">{students.length}</p>
          </div>
          {courses.map((course) => (
            <div key={course} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">{course}</h3>
              <p className="text-4xl font-bold text-indigo-600">{courseCount[course] || 0}</p>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Student Form */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <AddStudentForm onAddStudent={handleAddStudent} />
          </div>

          {/* Student List */}
          <div className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
            {/* Filter */}
            <div className="bg-white shadow p-4 mb-6 rounded-lg flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Filter by Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {selectedCourse && (
                <button
                  onClick={() => setSelectedCourse('')}
                  className="ml-4 text-sm text-gray-500 hover:text-red-600"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Loading or Student List */}
            {loading ? (
              <div className="flex justify-center items-center p-12 bg-white shadow rounded-lg">
                <Loader className="animate-spin h-8 w-8 text-indigo-600 mr-2" />
                <p className="text-gray-600">Loading student data...</p>
              </div>
            ) : (
              <StudentList
                students={filteredStudents}
                loading={loading}
                handleDeleteStudent={handleDeleteStudent}
                handleEditStudent={handleEditStudent}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
