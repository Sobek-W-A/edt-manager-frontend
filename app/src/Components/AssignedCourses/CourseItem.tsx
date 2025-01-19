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
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showNotification, setShowNotification] = useState(false);
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
          setNotification({ message: `Erreur: ${response.errorMessage()}`, type: 'alert-error' });
          setShowNotification(true);
        } else {
          const fetchedColleagues = response.responseObject() || [];
          setColleagues(filterColleagues(fetchedColleagues));
        }
      } catch {
        setNotification({ message: 'Erreur lors de la récupération des collègues.', type: 'alert-error' });
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    };

    fetchColleagues();
  }, [course.course_id, currentProfessor]); // Re-fetch when course_id or currentProfessor changes

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <li className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 w-full max-w-[800px] h-auto mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Colonne des informations du cours */}
        <div className="flex-1 pr-4">
          {/* Course ID */}
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="font-semibold text-gray-800">Course ID: {course.course_id}</p>
          </div>

          {/* Hours */}
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-700">Heures: {course.hours} h</p>
          </div>

          {/* Group */}
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-700">Groupe: {course.group}</p>
          </div>

          {/* Date */}
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-700">
              Date: {new Date(course.date).toLocaleDateString()} à {new Date(course.date).toLocaleTimeString()}
            </p>
          </div>

          {/* Notes */}
          <div className="flex items-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-gray-600 italic">📝 {course.notes}</p>
          </div>
        </div>

        {/* Colonne des collègues */}
        <div className="flex-1 pl-4 border-l border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Collègues:</h3>
          {loading ? (
            <p className="text-gray-500 italic">Chargement des collègues...</p>
          ) : colleagues.length > 0 ? (
            <ul className="list-none space-y-2">
              {colleagues.map((colleague, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {colleague.firstname} {colleague.lastname}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Aucun collègue trouvé.</p>
          )}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            notification.type === 'alert-error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {notification.message}
        </div>
      )}
    </li>
  );
};

export default CourseItem;