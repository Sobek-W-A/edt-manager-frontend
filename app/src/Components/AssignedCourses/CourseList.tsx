import React from 'react';
import CourseItem from './CourseItem';

// TypeScript interface
interface Course {
  id: number;
  title: string;
  colleagues: string[];
}

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <p className="text-center text-lg text-gray-500">
        Aucun cours attribué.
      </p>
    );
  }

  return (
    <ul className="grid gap-8 md:grid-cols-2">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </ul>
  );
};

export default CourseList;
