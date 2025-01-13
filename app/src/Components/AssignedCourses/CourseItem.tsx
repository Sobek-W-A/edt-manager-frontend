import React from 'react';

// TypeScript interface
interface Course {
  id: number;
  profile_id: number;
  course_id: number;
  hours: number;
  notes: string;
  date: string;
  group: number;
}

interface CourseItemProps {
  course: Course;
}

const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  return (
    <li className="border border-gray-300 rounded-lg bg-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Cours ID: {course.course_id}
      </h2>
      <p className="text-lg text-gray-700 mb-2">
        Profil ID: {course.profile_id}
      </p>
      <p className="text-lg text-gray-700 mb-2">Heures: {course.hours}</p>
      <p className="text-lg text-gray-700 mb-2">Groupe: {course.group}</p>
      <p className="text-md text-gray-600 italic mb-2">
        Date: {new Date(course.date).toLocaleString()}
      </p>
      <p className="text-lg text-gray-700">{course.notes}</p>
    </li>
  );
};

export default CourseItem;
