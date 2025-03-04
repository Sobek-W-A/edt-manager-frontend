import React, { useEffect, useState } from 'react';
import AffectationAPI from '../../scripts/API/ModelAPIs/AffectationAPI.ts';

// Interfaces TypeScript
interface Course {
  id: number;
  course_id: number;
  profile_id: number;
  hours: number;
  notes: string;
  date: string;
  group: number;
}

interface Colleague {
  firstname: string;
  lastname: string;
}

interface CourseItemProps {
  course: Course;
}

const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentProfessor, setCurrentProfessor] = useState<{ firstname: string; lastname: string } | null>(null);
  const [courseName, setCourseName] = useState<string>('');

  // Récupérer le profil de l'utilisateur connecté (professeur)
  useEffect(() => {
    const fetchCurrentProfessor = async () => {
      try {
        const response = await AffectationAPI.getProfile();
        if (!response.isError()) {
          const profile = response.responseObject();
          setCurrentProfessor({ firstname: profile.firstname, lastname: profile.lastname });
        }
      } catch (error) {
        console.error('Error fetching current professor:', error);
      }
    };

    fetchCurrentProfessor();
  }, []);

  // Récupérer le nom du cours à partir de l'ID du cours
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const response = await AffectationAPI.getCourseById(course.course_id);
        if (!response.isError()) {
          const courseData = response.responseObject();
          setCourseName(courseData.course_type.name);
        }
      } catch (error) {
        console.error('Error fetching course name:', error);
      }
    };

    fetchCourseName();
  }, [course.course_id]);

  // Filtrer les collègues pour ne pas inclure le profil déjà connecté
  const filterColleagues = (colleagues: Colleague[]) => {
    const uniqueColleagues = new Map<string, Colleague>();
    colleagues.forEach((colleague) => {
      const fullName = `${colleague.firstname} ${colleague.lastname}`;
      if (!uniqueColleagues.has(fullName)) {
        uniqueColleagues.set(fullName, colleague);
      }
    });

    if (currentProfessor) {
      const professorFullName = `${currentProfessor.firstname} ${currentProfessor.lastname}`;
      uniqueColleagues.delete(professorFullName);
    }

    return Array.from(uniqueColleagues.values());
  };

  // Récupérer les collègues assignés au cours et extraire leur prénom et nom
  useEffect(() => {
    const fetchColleagues = async () => {
      try {
        const response = await AffectationAPI.getColleaguesByCourseId(course.course_id);
        if (response.isError()) {
          console.error('Error fetching colleagues:', response.errorMessage());
        } else {
          const fetchedData = response.responseObject() || [];
          // Extraction des données depuis item.profile si présent
          const colleaguesNames: Colleague[] = fetchedData.map((item: any) => ({
            firstname: item.profile ? item.profile.firstname : item.firstname,
            lastname: item.profile ? item.profile.lastname : item.lastname,
          }));
          setColleagues(filterColleagues(colleaguesNames));
        }
      } catch (error) {
        console.error('Error fetching colleagues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleagues();
  }, [course.course_id, currentProfessor]);

  return (
    <li className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-6 border border-green-700/10">
      <div className="flex flex-col space-y-4">
        {/* Informations sur le cours */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">
              📚 Cours: {courseName || 'Chargement...'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">⏳ Heures: {course.hours} h</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">👥 Groupe: {course.group}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">
              📅 Date: {new Date(course.date).toLocaleDateString()} à {new Date(course.date).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 italic">✏️ {course.notes}</span>
          </div>
        </div>

        {/* Section des collègues */}
        <div className="pt-4 border-t border-gray-150">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Collègues :</h3>
          {loading ? (
            <p className="text-gray-500 italic">Chargement des collègues...</p>
          ) : colleagues.length > 0 ? (
            <ul className="space-y-2">
              {colleagues.map((colleague, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-700">
                  <span className="text-gray-500">👤</span>
                  <span>
                    {colleague.firstname} {colleague.lastname}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Aucun collègue trouvé.</p>
          )}
        </div>
      </div>
    </li>
  );
};

export default CourseItem;
