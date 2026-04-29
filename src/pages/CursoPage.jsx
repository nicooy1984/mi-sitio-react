import Primero from './Primero';
import { getCourseById } from '../data/courseConfig';

export default function CursoPage({ courseId, userProfile }) {
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="pt-32 text-center">
        Curso no encontrado
      </div>
    );
  }

  const canManageCourse =
    userProfile?.role === 'admin' ||
    course.allowedTeachers.includes(userProfile?.email);

  return (
    <Primero
      courseId={course.id}
      courseName={course.name}
      courseLevel={course.level}
      courseRoom={course.room}
      courseShift={course.shift}
      courseYear={course.year}
      courseStudents={course.students}
      courseHeroImage={course.heroImage}
      coursePhoto={course.coursePhoto}
      teacher={course.teacher}
      assistant={course.assistant}
      canManageCourse={canManageCourse}
      userProfile={userProfile}
    />
  );
}