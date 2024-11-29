import React from 'react';

// TypeScript interface
interface Course {
  id: number;
  title: string;
  colleagues: string[];
}

interface CourseItemProps {
  course: Course;
}

const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  return (
    <li className="border border-gray-300 rounded-lg bg-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {course.title}
      </h2>
      <p className="text-lg text-gray-700 mb-3 font-medium">Collègues :</p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {course.colleagues.map((colleague, index) => (
          <li key={index} className="text-md">
            {colleague}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default CourseItem;
