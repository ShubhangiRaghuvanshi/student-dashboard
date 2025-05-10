import React, { useState } from "react";
import { Pencil, Trash2, Save, X, Loader, UserX } from "lucide-react";

type Student = {
  id: number;
  name: string;
  email: string;
  course: string;
};

type Props = {
  students: Student[];
  loading: boolean;
  handleDeleteStudent: (id: number) => void;
  handleEditStudent: (id: number, updatedStudent: Student) => void;
};

const StudentList: React.FC<Props> = ({
  students,
  loading,
  handleDeleteStudent,
  handleEditStudent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const handleEditClick = (student: Student) => {
    setIsEditing(true);
    setEditStudent({ ...student });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editStudent) {
      const { name, value } = e.target;
      setEditStudent({ ...editStudent, [name]: value });
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStudent) {
      handleEditStudent(editStudent.id, editStudent);
      setIsEditing(false);
      setEditStudent(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-screen p-8 text-gray-500">
        <Loader className="animate-spin mr-2" size={20} />
        <span>Loading students data...</span>
      </div>
    );

  if (students.length === 0)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border border-gray-200">
          <UserX size={40} className="mx-auto mb-2 text-gray-400" />
          <p>No students found</p>
        </div>
      </div>
    );

  return (
    <div className="h-screen w-screen bg-gray-100 p-4 sm:p-6 md:p-8 overflow-auto">
      <div className="mx-auto h-full w-full max-w-7xl flex flex-col">
        <div className="flex-grow overflow-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) =>
                isEditing && editStudent?.id === student.id ? (
                  <tr key={student.id} className="bg-blue-50">
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="name"
                        value={editStudent.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="email"
                        name="email"
                        value={editStudent.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="course"
                        value={editStudent.course}
                        onChange={handleChange}
                        className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button
                        onClick={handleSubmitEdit}
                        className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-white text-sm hover:bg-green-700 transition"
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditStudent(null);
                        }}
                        className="inline-flex items-center rounded-md bg-gray-500 px-3 py-1.5 text-white text-sm hover:bg-gray-600 transition"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-medium text-gray-800">{student.name}</td>
                    <td className="px-6 py-3 text-gray-600">{student.email}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {student.course}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm transition"
                      >
                        <Pencil size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            `Are you sure you want to delete student "${student.name}"?`
                          );
                          if (confirmDelete) {
                            handleDeleteStudent(student.id);
                          }
                        }}
                        className="inline-flex items-center text-red-600 hover:text-red-800 text-sm transition"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
