import React, { useState, useEffect } from 'react';
import CourseList from '../Components/AssignedCourses/CourseList.tsx';

// TypeScript interfaces pour typer les données
interface Course {
  id: number;
  title: string;
  colleagues: string[];
}

const AssignedCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); // Liste des cours
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // TODO: Remplacer avec un appel API réel
        const data: Course[] = [
          {
            id: 1,
            title: 'Infrastructures virtualisées',
            colleagues: ['HOMBERG Guillaume', 'CIRSTEA Horatiu'],
          },
          {
            id: 2,
            title: 'Paradigmes de programmation',
            colleagues: ['DUVAL Sébastien'],
          },
          {
            id: 3,
            title: 'Systèmes distribués',
            colleagues: ['MARTIN Jacques'],
          },
        ];
        setCourses(data);
      } catch (err) {
        setError('Erreur lors du chargement des cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      <CourseList courses={courses} />
    </div>
  );
};

export default AssignedCoursesPage;
