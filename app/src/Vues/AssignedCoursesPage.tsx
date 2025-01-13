import React, { useState, useEffect } from 'react';
import CourseList from '../Components/AssignedCourses/CourseList.tsx';
import AffectationAPI from '/Users/mohamed_benhamou/Desktop/edt-manager-frontend/app/src/scripts/API/ModelAPIs/AffectationAPI.ts'; // Import the API class

// TypeScript interfaces pour typer les données
interface Course {
  id: number;
  profile_id: number;
  course_id: number;
  hours: number;
  notes: string;
  date: string;
  group: number;
}

const AssignedCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); // Liste des cours
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs
  const [notification, setNotification] = useState({ message: '', type: '' }); // Notification message and type
  const [showNotification, setShowNotification] = useState(false); // To control the visibility of notification

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesList = [];
      try {
        const coursesResponse = await AffectationAPI.getTeacherAffectations(); // Fetch courses from the API
        if (coursesResponse.isError()) {
          setNotification({ message: `Erreur : ${coursesResponse.errorMessage()}.`, type: 'alert-error' });
          setShowNotification(true);
        } else {
          const fetchedCourses = coursesResponse.responseObject() || [];
          coursesList.push(...fetchedCourses);
        }
      } catch (error) {
        setNotification({ message: 'Erreur lors du chargement des cours.', type: 'alert-error' });
        setShowNotification(true);
      } finally {
        setCourses(coursesList);
        setLoading(false);
      }
    };

    fetchCourses().then(); // Explicitly handle the promise
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-600 animate-pulse">
          Chargement des cours...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        Vos cours attribués
      </h1>
      {showNotification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <CourseList courses={courses} />
    </div>
  );
};

export default AssignedCoursesPage;
