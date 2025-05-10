import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { firebaseConfig } from './firebase'; // Make sure firebase is initialized
import { initializeApp } from 'firebase/app';
import { 
  LogIn, 
  LogOut, 
  User, 
  Book, 
  Mail, 
  Search, 
  Plus, 
  Filter, 
  Loader,
  MoreHorizontal,
  Bell,
  ChevronDown,
  X,
  CheckCircle
} from 'lucide-react';
import './App.css';
import './index.css';

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const StudentDashboard = () => {

  type Student = {
    id: number;
    name: string;
    email: string;
    course: string;
    lastActive: string;
  };



  type Notification = {
    message: string;
    type: 'success' | 'error'; 
  };
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courseFilter, setCourseFilter] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', email: '', course: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Available courses for dropdown with colors
  const availableCourses = [
    { name: 'React', color: 'blue' },
    { name: 'Node.js', color: 'green' },
    { name: 'JavaScript', color: 'yellow' },
    { name: 'TypeScript', color: 'blue' },
    { name: 'Python', color: 'purple' }
  ];

  // Get course color
  const getCourseColor = (courseName:string):string => {
    const course = availableCourses.find(c => c.name === courseName);
    return course ? course.color : 'gray';
  };


  const fetchStudents = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 1, name: 'John Doe', email: 'john@example.com', course: 'React', lastActive: '2 days ago' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Node.js', lastActive: '5 hours ago' },
        { id: 3, name: 'Robert Brown', email: 'robert@example.com', course: 'React', lastActive: 'Just now' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', course: 'JavaScript', lastActive: '1 week ago' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', course: 'TypeScript', lastActive: '3 days ago' },
        { id: 6, name: 'Sarah Johnson', email: 'sarah@example.com', course: 'Python', lastActive: 'Yesterday' },
      ]);
      setIsLoading(false);
    }, 1000); // Simulating an API call with a delay
  };

  // Handle login with Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.error('Error signing in:', error.message);
      });
  };

  // Handle sign out
  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error.message);
      });
  };

  // Listen for auth state changes (user login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchStudents(); // Fetch students when user is logged in
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Show notification
  const showNotification = (message:string, type : 'success'|'error'='success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle student form submission
  const handleStudentFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newStudentWithId = { ...newStudent, id: students.length + 1, lastActive: 'Just now' };
    setStudents([...students, newStudentWithId]);
    setNewStudent({ name: '', email: '', course: '' });
    setIsFormOpen(false); // Close form after submission
    showNotification(`Student ${newStudentWithId.name} added successfully`);
  };

  // Filter students based on course filter and search term
  const filteredStudents = students
    .filter((student) => !courseFilter || student.course === courseFilter)
    .filter((student) => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get course badge style based on course name
  const getCourseBadgeStyle = (course:string) => {
    const color = getCourseColor(course);
    const styles :Record<string,string>= {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[color] || styles.gray;
  };

  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Book size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-gray-500 mt-2">Sign in to access the student management system</p>
          </div>
          
          <button 
            onClick={loginWithGoogle} 
            className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
          >
            <LogIn className="mr-2" size={20} />
            Login with Google
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Manage your students and courses efficiently</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
  <div className="min-h-screen bg-gray-50">
    {/* Notification */}
    {notification && (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center ${notification.type === 'success' ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}>
        {notification.type === 'success' ? (
          <CheckCircle size={20} className="mr-3 text-green-500" />
        ) : (
          <X size={20} className="mr-3 text-red-500" />
        )}
        <span className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {notification.message}
        </span>
        <button 
          onClick={() => setNotification(null)}
          className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X size={16} />
        </button>
      </div>
    )}

    {/* Header */}
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
              <Book size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">EduDashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                {user ? (
                  <img 
                    src={user?.photoURL || 'default-avatar.png'} 
                    alt={user.displayName || "User"} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.displayName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="md:hidden flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{students.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-green-600 flex items-center">
            <span>↑ 12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Courses</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{availableCourses.length}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Book size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-green-600 flex items-center">
            <span>↑ 5% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Today</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">3</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-red-600 flex items-center">
            <span>↓ 2% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span>Student Management</span>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {filteredStudents.length} Students
              </span>
            </h2>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none w-full md:w-48"
                >
                  <option value="">All Courses</option>
                  {availableCourses.map(course => (
                    <option key={course.name} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-6 text-left font-medium">Student</th>
                <th className="py-3 px-6 text-left font-medium">Course</th>
                <th className="py-3 px-6 text-left font-medium">Status</th>
                <th className="py-3 px-6 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-800">
                    <div className="flex items-center">
                      <User size={18} className="mr-2 text-gray-600" />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{student.course}</td>
              
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</Router>
  );
};

export default StudentDashboard;