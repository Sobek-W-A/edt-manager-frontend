import React, { useState, useEffect } from 'react';
import CourseList from '../Components/AssignedCourses/CourseList.tsx';
import AffectationAPI from '../scripts/API/ModelAPIs/AffectationAPI.ts';

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Étape 1: Récupérer le profil de l'utilisateur
        const profileResponse = await AffectationAPI.getProfile();
        if (profileResponse.isError()) {
          throw new Error(profileResponse.errorMessage());
        }

        const profileId = profileResponse.responseObject()?.id;
        if (!profileId) {
          throw new Error('ID du profil non trouvé');
        }

        // Étape 2: Récupérer les affectations de l'enseignant
        const coursesResponse = await AffectationAPI.getTeacherAffectations(profileId);
        if (coursesResponse.isError()) {
          throw new Error(coursesResponse.errorMessage());
        }

        setCourses(coursesResponse.responseObject() || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setNotification({ message: 'Erreur lors du chargement des cours.', type: 'alert-error' });
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-600 animate-pulse">Chargement des cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-gray-200">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8 pt-8">Cours attribués</h1>
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