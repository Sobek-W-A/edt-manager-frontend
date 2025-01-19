import React, { useEffect, useState } from 'react';
import AffectationAPI from '../../scripts/API/ModelAPIs/AffectationAPI.ts';

// TypeScript interfaces
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

  // Fetch the current professor's profile
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

  // Remove duplicate colleagues and filter out the current professor
  const filterColleagues = (colleagues: Colleague[]) => {
    const uniqueColleagues = new Map();
    colleagues.forEach((colleague) => {
      const fullName = `${colleague.firstname} ${colleague.lastname}`;
      if (!uniqueColleagues.has(fullName)) {
        uniqueColleagues.set(fullName, colleague);
      }
    });

    // Filter out the current professor
    if (currentProfessor) {
      const professorFullName = `${currentProfessor.firstname} ${currentProfessor.lastname}`;
      uniqueColleagues.delete(professorFullName);
    }

    return Array.from(uniqueColleagues.values());
  };

  useEffect(() => {
    const fetchColleagues = async () => {
      try {
        const response = await AffectationAPI.getColleaguesByCourseId(course.course_id);
        if (response.isError()) {
          console.error('Error fetching colleagues:', response.errorMessage());
        } else {
          const fetchedColleagues = response.responseObject() || [];
          setColleagues(filterColleagues(fetchedColleagues));
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
        {/* Course Information */}
        <div className="space-y-3">
          {/* Course ID */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">📚 Course ID: {course.course_id}</span>
          </div>

          {/* Hours */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">⏳ Heures: {course.hours} h</span>
          </div>

          {/* Group */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">👥 Groupe: {course.group}</span>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">
              📅 Date: {new Date(course.date).toLocaleDateString()} à {new Date(course.date).toLocaleTimeString()}
            </span>
          </div>

          {/* Notes */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 italic">✏️ {course.notes}</span>
          </div>
        </div>

        {/* Colleagues Section */}
        <div className="pt-4 border-t border-gray-150">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Collègues:</h3>
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