import React, { useState, useEffect } from 'react';
import CourseList from '../Components/AssignedCourses/CourseList';
import AffectationAPI from '../scripts/API/ModelAPIs/AffectationAPI.ts';

// Interface pour typer les cours affichés dans la page
interface Course {
  id: number;
  course_id: number; // Cet identifiant sera extrait de l'objet course retourné par l'API
  profile_id: number;
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
        const affectations = coursesResponse.responseObject() || [];

        // Transformation : extraire le course id depuis l'objet course de l'affectation
        const mappedCourses: Course[] = affectations.map((affectation: any) => ({
          id: affectation.id,
          course_id: affectation.course.id, // Extraction de l'ID du cours à partir de l'objet course
          profile_id: affectation.profile,
          hours: affectation.hours,
          notes: affectation.notes,
          date: affectation.date,
          group: affectation.group,
        }));

        setCourses(mappedCourses);
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
