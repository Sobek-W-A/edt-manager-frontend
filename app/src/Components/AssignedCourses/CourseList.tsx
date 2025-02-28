import React from 'react';
import CourseItem from './CourseItem';

// TypeScript interface
interface Course {
  id: number;
  course_id: number;
  profile_id: number;
  hours: number;
  notes: string;
  date: string;
  group: number;
}

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="max-w-10xl mx-10 px-4 sm:px-6 lg:px-8 py-6">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </ul>
    </div>
  );
};

export default CourseList;