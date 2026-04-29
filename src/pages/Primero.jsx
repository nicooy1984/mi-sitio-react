import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  Users,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Clock3,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  ClipboardList,
  X,
  Expand,
  BookOpen,
  Table2,
  Megaphone,
  Trash2,
  Pencil,
  Save,
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { db } from '../firebase/config';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const DEFAULT_COURSE_ID = 'primero';

const DEFAULT_READING_PLAN = {
  month: 'Abril 2026',
  title: 'El lugar más bonito del mundo',
  author: 'Ann Cameron',
  description:
    'Durante este mes los estudiantes trabajarán comprensión lectora, vocabulario, expresión oral y actividades de reflexión familiar.',
  objective:
    'Fomentar el gusto por la lectura, desarrollar la comprensión lectora y fortalecer la expresión oral.',
  coverImage: '/images/plan-lector/el-lugar-mas-bonito.jpg',
  isActive: true,
};

const DEFAULT_SCHEDULE_BLOCKS = [
  {
    time: '14:00 - 14:45',
    order: 1,
    lunes: 'Lenguaje',
    martes: 'Matemática',
    miercoles: 'Ciencias',
    jueves: 'Historia',
    viernes: 'Artes',
  },
  {
    time: '14:45 - 15:30',
    order: 2,
    lunes: 'Lenguaje',
    martes: 'Matemática',
    miercoles: 'Ciencias',
    jueves: 'Historia',
    viernes: 'Artes',
  },
  {
    time: '15:45 - 16:30',
    order: 3,
    lunes: 'Educ. Física',
    martes: 'Inglés',
    miercoles: 'Música',
    jueves: 'Tecnología',
    viernes: 'Religión',
  },
  {
    time: '16:30 - 17:15',
    order: 4,
    lunes: 'Educ. Física',
    martes: 'Inglés',
    miercoles: 'Música',
    jueves: 'Tecnología',
    viernes: 'Religión',
  },
  {
    time: '17:30 - 18:15',
    order: 5,
    lunes: 'Matemática',
    martes: 'Lenguaje',
    miercoles: 'Artes',
    jueves: 'Ciencias',
    viernes: 'Orientación',
  },
  {
    time: '18:15 - 19:00',
    order: 6,
    lunes: 'Matemática',
    martes: 'Lenguaje',
    miercoles: 'Artes',
    jueves: 'Ciencias',
    viernes: 'Orientación',
  },
];

const SCHEDULE_RECESSES = [
  {
    afterOrder: 2,
    label: 'Recreo · 15:30 - 15:45',
  },
  {
    afterOrder: 4,
    label: 'Recreo · 17:15 - 17:30',
  },
];

function formatMonthYear(date) {
  return new Intl.DateTimeFormat('es-CL', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatHumanDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function getEventBadgeClasses(type) {
  const map = {
    Prueba: 'bg-rose-100 text-rose-700 border-rose-200',
    Actividad: 'bg-blue-100 text-blue-700 border-blue-200',
    Reunión: 'bg-amber-100 text-amber-700 border-amber-200',
    Trabajo: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Tarea: 'bg-violet-100 text-violet-700 border-violet-200',
  };

  return map[type] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function getCommunicationBadgeClasses(type) {
  const map = {
    Comunicado: 'bg-blue-100 text-blue-700 border-blue-200',
    Importante: 'bg-amber-100 text-amber-700 border-amber-200',
    Recordatorio: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Urgente: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return map[type] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function buildCalendarDays(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const days = [];

  for (let i = 0; i < startWeekDay; i += 1) days.push(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function StaffCard({
  role,
  name,
  email,
  phone,
  detail,
  image,
  accent = 'blue',
}) {
  const accentMap = {
    blue: 'bg-blue-700',
    emerald: 'bg-emerald-700',
  };

  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <div className="h-24 w-24 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-200 shadow-sm">
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accentMap[accent]} text-white`}
            >
              <UserRound size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {role}
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">{name}</h3>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2 break-all">
              <Mail size={15} />
              {email}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} />
              {phone}
            </div>
            <div className="flex items-start gap-2">
              <ClipboardList size={15} className="mt-0.5" />
              <span>{detail}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Primero({
  canManageCourse = false,
  userProfile = null,
  courseId = DEFAULT_COURSE_ID,
  courseName = '1° Básico',
  courseHeroImage = '/images/cursos/primero.jpg',
  coursePhoto = '/images/cursos/primero-curso.jpg',
  courseLevel = 'Primer Ciclo Básico',
  courseStudents = 26,
  courseRoom = 'Pabellón Básica - Sala 2',
  courseShift = '14:00 a 19:00 hrs.',
  courseYear = '2026',
  teacher = {
    role: 'Profesora jefe',
    name: 'Profesora Julia Arancibia',
    email: 'j.arancibia@colegioitalianosp.cl',
    phone: '+56 9 1234 5678',
    detail:
      'Acompañamiento pedagógico, seguimiento general del curso y coordinación con las familias.',
    image: '/images/equipo/profesora-primero.jpg',
    accent: 'blue',
  },
  assistant = {
  role: 'Asistente de aula',
  name: 'Asistente del curso',
  email: 'contacto@colegioitalianosp.cl',
  phone: '+56 9 0000 0000',
  detail: 'Apoyo en aula y acompañamiento pedagógico.',
  image: '/images/equipo/default.jpg',
  accent: 'emerald',
},
}) {
  const COURSE_ID = courseId;
const today = new Date();

const todayIso = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const [currentMonth, setCurrentMonth] = useState(
  new Date(today.getFullYear(), today.getMonth(), 1)
);

const [events, setEvents] = useState([]);
const [selectedDate, setSelectedDate] = useState(todayIso);
  const [isCoursePhotoOpen, setIsCoursePhotoOpen] = useState(false);
  const [staffImages, setStaffImages] = useState({
  coursePhoto: '',
  teacherImage: '',
  assistantImage: '',
});
const [staffInfo, setStaffInfo] = useState({
  teacherName: '',
  teacherEmail: '',
  teacherPhone: '',
  teacherDetail: '',
  assistantName: '',
  assistantEmail: '',
  assistantPhone: '',
  assistantDetail: '',
});
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventError, setEventError] = useState('');
  const [eventSuccess, setEventSuccess] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);

  const [readingPlans, setReadingPlans] = useState([]);
  const [activeReadingPlan, setActiveReadingPlan] =
    useState(DEFAULT_READING_PLAN);
  const [editingReadingPlanId, setEditingReadingPlanId] = useState(null);
  const [readingPlanForm, setReadingPlanForm] = useState(DEFAULT_READING_PLAN);
  const [readingSuccess, setReadingSuccess] = useState('');

  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    time: '',
    order: 1,
    lunes: '',
    martes: '',
    miercoles: '',
    jueves: '',
    viernes: '',
  });

  const [communications, setCommunications] = useState([]);
  const [communicationSuccess, setCommunicationSuccess] = useState('');
  const [communicationError, setCommunicationError] = useState('');
  const [editingCommunicationId, setEditingCommunicationId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Actividad',
    date: '2026-04-08',
    description: '',
  });

  const [newCommunication, setNewCommunication] = useState({
    title: '',
    type: 'Comunicado',
    message: '',
  });

  const formRef = useRef(null);

  useEffect(() => {
    const eventsRef = collection(db, 'courses', COURSE_ID, 'events');

    const unsubscribe = onSnapshot(
      eventsRef,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        data.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        setEvents(data);
      },
      (error) => {
        console.error('Error cargando eventos del curso:', error);
      }
    );

    return () => unsubscribe();
  }, [COURSE_ID]);

  useEffect(() => {
    const readingPlansRef = collection(db, 'courses', COURSE_ID, 'readingPlans');

    const unsubscribe = onSnapshot(
      readingPlansRef,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        data.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setReadingPlans(data);

        const activePlan = data.find((item) => item.isActive);

        if (activePlan) {
          setActiveReadingPlan({
            ...DEFAULT_READING_PLAN,
            ...activePlan,
          });
        } else if (data.length > 0) {
          setActiveReadingPlan({
            ...DEFAULT_READING_PLAN,
            ...data[0],
          });
        } else {
          setActiveReadingPlan(DEFAULT_READING_PLAN);
        }
      },
      (error) => {
        console.error('Error cargando planes lectores:', error);
      }
    );

    return () => unsubscribe();
  }, [COURSE_ID]);

  useEffect(() => {
    const scheduleRef = collection(db, 'courses', COURSE_ID, 'schedule');

    const unsubscribe = onSnapshot(
      scheduleRef,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        data.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
        setScheduleBlocks(data);
      },
      (error) => {
        console.error('Error cargando horario:', error);
      }
    );

    return () => unsubscribe();
  }, [COURSE_ID]);

  useEffect(() => {
    const communicationsRef = collection(
      db,
      'courses',
      COURSE_ID,
      'communications'
    );

    const unsubscribe = onSnapshot(
      communicationsRef,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        data.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setCommunications(data);
      },
      (error) => {
        console.error('Error cargando comunicados:', error);
      }
    );

    return () => unsubscribe();
  }, [COURSE_ID]);
  useEffect(() => {
  const ref = doc(db, 'courses', COURSE_ID);

  const unsubscribe = onSnapshot(ref, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

setStaffImages({
  coursePhoto: data.coursePhoto || '',
  teacherImage: data.teacherImage || '',
  assistantImage: data.assistantImage || '',
});

setStaffInfo({
  teacherName: data.teacherName || '',
  teacherEmail: data.teacherEmail || '',
  teacherPhone: data.teacherPhone || '',
  teacherDetail: data.teacherDetail || '',
  assistantName: data.assistantName || '',
  assistantEmail: data.assistantEmail || '',
  assistantPhone: data.assistantPhone || '',
  assistantDetail: data.assistantDetail || '',
});
    }
  });

  return () => unsubscribe();
}, [COURSE_ID]);

  const visibleScheduleBlocks = useMemo(() => {
    return scheduleBlocks.length > 0 ? scheduleBlocks : DEFAULT_SCHEDULE_BLOCKS;
  }, [scheduleBlocks]);

  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth),
    [currentMonth]
  );

  const selectedDateEvents = useMemo(() => {
    return events
      .filter((event) => event.date === selectedDate)
      .sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }, [events, selectedDate]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {});
  }, [events]);

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleCalendarDayClick = (isoDate) => {
    setSelectedDate(isoDate);

    if (canManageCourse) {
      setEditingEventId(null);
      setNewEvent((prev) => ({
        ...prev,
        date: isoDate,
      }));

      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 120);
    }
  };

  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();

    if (!canManageCourse) {
      setEventError('No tienes permiso para gestionar este curso.');
      return;
    }

    if (!newEvent.title.trim() || !newEvent.date) {
      setEventError('Debes ingresar un título y una fecha.');
      return;
    }

    setSavingEvent(true);
    setEventError('');
    setEventSuccess('');

    try {
      if (editingEventId) {
        await updateDoc(doc(db, 'courses', COURSE_ID, 'events', editingEventId), {
          title: newEvent.title.trim(),
          type: newEvent.type,
          date: newEvent.date,
          description: newEvent.description.trim(),
          updatedAt: serverTimestamp(),
          updatedByUid: userProfile?.uid || '',
          updatedByName: userProfile?.name || '',
          updatedByEmail: userProfile?.email || '',
        });

        setEventSuccess('Actividad actualizada correctamente.');
        setEditingEventId(null);
      } else {
        await addDoc(collection(db, 'courses', COURSE_ID, 'events'), {
          title: newEvent.title.trim(),
          type: newEvent.type,
          date: newEvent.date,
          description: newEvent.description.trim(),
          courseId: COURSE_ID,
          createdAt: serverTimestamp(),
          createdByUid: userProfile?.uid || '',
          createdByName: userProfile?.name || '',
          createdByEmail: userProfile?.email || '',
        });

        setEventSuccess('Actividad guardada correctamente.');
      }

      setSelectedDate(newEvent.date);

      setNewEvent((prev) => ({
        ...prev,
        title: '',
        type: 'Actividad',
        description: '',
      }));
    } catch (error) {
      console.error('Error guardando actividad:', error);
      setEventError('No fue posible guardar la actividad. Revisa permisos o conexión.');
    } finally {
      setSavingEvent(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);

    setNewEvent({
      title: event.title || '',
      type: event.type || 'Actividad',
      date: event.date || selectedDate,
      description: event.description || '',
    });

    setEventError('');
    setEventSuccess('');

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!canManageCourse) return;

    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar esta actividad del calendario?'
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'courses', COURSE_ID, 'events', eventId));
      setEventSuccess('Actividad eliminada correctamente.');

      if (editingEventId === eventId) {
        setEditingEventId(null);
        setNewEvent({
          title: '',
          type: 'Actividad',
          date: selectedDate,
          description: '',
        });
      }
    } catch (error) {
      console.error('Error eliminando actividad:', error);
      setEventError('No fue posible eliminar la actividad.');
    }
  };

  const handleCancelEditEvent = () => {
    setEditingEventId(null);
    setNewEvent({
      title: '',
      type: 'Actividad',
      date: selectedDate,
      description: '',
    });
    setEventError('');
    setEventSuccess('');
  };

  const handleSaveReadingPlan = async () => {
    if (!canManageCourse) return;

    try {
      const plansRef = collection(db, 'courses', COURSE_ID, 'readingPlans');

      if (readingPlanForm.isActive) {
        await Promise.all(
          readingPlans.map((plan) =>
            updateDoc(doc(db, 'courses', COURSE_ID, 'readingPlans', plan.id), {
              isActive: false,
            })
          )
        );
      }

      if (editingReadingPlanId) {
        await updateDoc(
          doc(db, 'courses', COURSE_ID, 'readingPlans', editingReadingPlanId),
          {
            ...readingPlanForm,
            updatedAt: serverTimestamp(),
            updatedByUid: userProfile?.uid || '',
            updatedByName: userProfile?.name || '',
            updatedByEmail: userProfile?.email || '',
          }
        );

        setReadingSuccess('Plan lector actualizado correctamente.');
      } else {
        await addDoc(plansRef, {
          ...readingPlanForm,
          courseId: COURSE_ID,
          createdAt: serverTimestamp(),
          createdByUid: userProfile?.uid || '',
          createdByName: userProfile?.name || '',
          createdByEmail: userProfile?.email || '',
        });

        setReadingSuccess('Plan lector creado correctamente.');
      }

      setEditingReadingPlanId(null);
      setReadingPlanForm({
        ...DEFAULT_READING_PLAN,
        isActive: false,
      });
    } catch (error) {
      console.error('Error guardando plan lector:', error);
    }
  };

  const handleEditReadingPlan = (plan) => {
    setEditingReadingPlanId(plan.id);

    setReadingPlanForm({
      month: plan.month || '',
      title: plan.title || '',
      author: plan.author || '',
      description: plan.description || '',
      objective: plan.objective || '',
      coverImage:
        plan.coverImage || '/images/plan-lector/el-lugar-mas-bonito.jpg',
      isActive: !!plan.isActive,
    });

    setReadingSuccess('');
  };

  const handleDeleteReadingPlan = async (planId) => {
    if (!canManageCourse) return;

    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar este plan lector?'
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'courses', COURSE_ID, 'readingPlans', planId));

      setReadingSuccess('Plan lector eliminado correctamente.');

      if (editingReadingPlanId === planId) {
        setEditingReadingPlanId(null);
        setReadingPlanForm({
          ...DEFAULT_READING_PLAN,
          isActive: false,
        });
      }
    } catch (error) {
      console.error('Error eliminando plan lector:', error);
    }
  };

  const handleSetActiveReadingPlan = async (planId) => {
    if (!canManageCourse) return;

    try {
      await Promise.all(
        readingPlans.map((plan) =>
          updateDoc(doc(db, 'courses', COURSE_ID, 'readingPlans', plan.id), {
            isActive: plan.id === planId,
            updatedAt: serverTimestamp(),
            updatedByUid: userProfile?.uid || '',
            updatedByName: userProfile?.name || '',
            updatedByEmail: userProfile?.email || '',
          })
        )
      );

      setReadingSuccess('Plan lector activo actualizado correctamente.');
    } catch (error) {
      console.error('Error activando plan lector:', error);
    }
  };

  const handleCancelEditReadingPlan = () => {
    setEditingReadingPlanId(null);
    setReadingPlanForm({
      ...DEFAULT_READING_PLAN,
      isActive: false,
    });
    setReadingSuccess('');
  };

  const handleScheduleInputChange = (field, value) => {
    setScheduleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveScheduleBlock = async () => {
    if (!canManageCourse) return;

    if (!scheduleForm.time.trim()) {
      setScheduleError('Debes ingresar el horario del bloque.');
      return;
    }

    setScheduleError('');
    setScheduleSuccess('');

    try {
      if (editingScheduleId) {
        await updateDoc(
          doc(db, 'courses', COURSE_ID, 'schedule', editingScheduleId),
          {
            ...scheduleForm,
            order: Number(scheduleForm.order) || 1,
            updatedAt: serverTimestamp(),
            updatedByUid: userProfile?.uid || '',
            updatedByName: userProfile?.name || '',
            updatedByEmail: userProfile?.email || '',
          }
        );

        setScheduleSuccess('Bloque de horario actualizado correctamente.');
        setEditingScheduleId(null);
      } else {
        await addDoc(collection(db, 'courses', COURSE_ID, 'schedule'), {
          ...scheduleForm,
          order: Number(scheduleForm.order) || visibleScheduleBlocks.length + 1,
          courseId: COURSE_ID,
          createdAt: serverTimestamp(),
          createdByUid: userProfile?.uid || '',
          createdByName: userProfile?.name || '',
          createdByEmail: userProfile?.email || '',
        });

        setScheduleSuccess('Bloque de horario creado correctamente.');
      }

      setScheduleForm({
        time: '',
        order: visibleScheduleBlocks.length + 1,
        lunes: '',
        martes: '',
        miercoles: '',
        jueves: '',
        viernes: '',
      });
    } catch (error) {
      console.error('Error guardando horario:', error);
      setScheduleError('No fue posible guardar el bloque de horario.');
    }
  };

  const handleEditScheduleBlock = (block) => {
    setEditingScheduleId(block.id);

    setScheduleForm({
      time: block.time || '',
      order: block.order || 1,
      lunes: block.lunes || '',
      martes: block.martes || '',
      miercoles: block.miercoles || '',
      jueves: block.jueves || '',
      viernes: block.viernes || '',
    });

    setScheduleError('');
    setScheduleSuccess('');
  };

  const handleUpdateScheduleCell = async (block, field, value) => {
    if (!canManageCourse || !block.id) return;

    try {
      await updateDoc(doc(db, 'courses', COURSE_ID, 'schedule', block.id), {
        [field]: value,
        updatedAt: serverTimestamp(),
        updatedByUid: userProfile?.uid || '',
        updatedByName: userProfile?.name || '',
        updatedByEmail: userProfile?.email || '',
      });
    } catch (error) {
      console.error('Error actualizando celda del horario:', error);
    }
  };

  const handleDeleteScheduleBlock = async (blockId) => {
    if (!canManageCourse) return;

    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar este bloque del horario?'
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'courses', COURSE_ID, 'schedule', blockId));
      setScheduleSuccess('Bloque de horario eliminado correctamente.');

      if (editingScheduleId === blockId) {
        setEditingScheduleId(null);
        setScheduleForm({
          time: '',
          order: visibleScheduleBlocks.length + 1,
          lunes: '',
          martes: '',
          miercoles: '',
          jueves: '',
          viernes: '',
        });
      }
    } catch (error) {
      console.error('Error eliminando bloque de horario:', error);
      setScheduleError('No fue posible eliminar el bloque de horario.');
    }
  };

  const handleCancelEditScheduleBlock = () => {
    setEditingScheduleId(null);
    setScheduleForm({
      time: '',
      order: visibleScheduleBlocks.length + 1,
      lunes: '',
      martes: '',
      miercoles: '',
      jueves: '',
      viernes: '',
    });
    setScheduleError('');
    setScheduleSuccess('');
  };

  const handleCreateDefaultSchedule = async () => {
    if (!canManageCourse) return;

    const confirmCreate = window.confirm(
      'Esto creará los bloques base del horario. ¿Deseas continuar?'
    );

    if (!confirmCreate) return;

    try {
      await Promise.all(
        DEFAULT_SCHEDULE_BLOCKS.map((block) =>
          addDoc(collection(db, 'courses', COURSE_ID, 'schedule'), {
            ...block,
            courseId: COURSE_ID,
            createdAt: serverTimestamp(),
            createdByUid: userProfile?.uid || '',
            createdByName: userProfile?.name || '',
            createdByEmail: userProfile?.email || '',
          })
        )
      );

      setScheduleSuccess('Horario base creado correctamente.');
    } catch (error) {
      console.error('Error creando horario base:', error);
      setScheduleError('No fue posible crear el horario base.');
    }
  };

  const handleAddOrUpdateCommunication = async () => {
    if (!canManageCourse) return;

    if (!newCommunication.title.trim() || !newCommunication.message.trim()) {
      setCommunicationError('Debes ingresar título y mensaje.');
      return;
    }

    setCommunicationError('');
    setCommunicationSuccess('');

    try {
      if (editingCommunicationId) {
        await updateDoc(
          doc(db, 'courses', COURSE_ID, 'communications', editingCommunicationId),
          {
            title: newCommunication.title.trim(),
            type: newCommunication.type,
            message: newCommunication.message.trim(),
            updatedAt: serverTimestamp(),
            updatedByUid: userProfile?.uid || '',
            updatedByName: userProfile?.name || '',
            updatedByEmail: userProfile?.email || '',
          }
        );

        setCommunicationSuccess('Comunicado actualizado correctamente.');
        setEditingCommunicationId(null);
      } else {
        await addDoc(collection(db, 'courses', COURSE_ID, 'communications'), {
          ...newCommunication,
          title: newCommunication.title.trim(),
          message: newCommunication.message.trim(),
          courseId: COURSE_ID,
          createdAt: serverTimestamp(),
          createdByUid: userProfile?.uid || '',
          createdByName: userProfile?.name || '',
          createdByEmail: userProfile?.email || '',
        });

        setCommunicationSuccess('Comunicado publicado correctamente.');
      }

      setNewCommunication({
        title: '',
        type: 'Comunicado',
        message: '',
      });
    } catch (error) {
      console.error('Error publicando comunicado:', error);
      setCommunicationError('No fue posible guardar el comunicado.');
    }
  };

  const handleEditCommunication = (item) => {
    setEditingCommunicationId(item.id);
    setNewCommunication({
      title: item.title || '',
      type: item.type || 'Comunicado',
      message: item.message || '',
    });
    setCommunicationError('');
    setCommunicationSuccess('');
  };

  const handleDeleteCommunication = async (communicationId) => {
    if (!canManageCourse) return;

    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar este comunicado?'
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, 'courses', COURSE_ID, 'communications', communicationId)
      );

      setCommunicationSuccess('Comunicado eliminado correctamente.');

      if (editingCommunicationId === communicationId) {
        setEditingCommunicationId(null);
        setNewCommunication({
          title: '',
          type: 'Comunicado',
          message: '',
        });
      }
    } catch (error) {
      console.error('Error eliminando comunicado:', error);
      setCommunicationError('No fue posible eliminar el comunicado.');
    }
  };

  const handleCancelEditCommunication = () => {
    setEditingCommunicationId(null);
    setNewCommunication({
      title: '',
      type: 'Comunicado',
      message: '',
    });
    setCommunicationError('');
    setCommunicationSuccess('');
  };

  const monthName = formatMonthYear(currentMonth);
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const renderScheduleRecess = (order) => {
    const recess = SCHEDULE_RECESSES.find((item) => item.afterOrder === order);
    if (!recess) return null;

    return (
      <div
        key={`recess-${order}`}
        className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-center"
      >
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">
          {recess.label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] pt-28 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        {isCoursePhotoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl">
              <button
                type="button"
                onClick={() => setIsCoursePhotoOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
              >
                <X size={20} />
              </button>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
                <img
                  src={staffImages.coursePhoto || coursePhoto}
                  alt={`Fotografía del ${courseName}`}
                  className="max-h-[85vh] w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        <section className="relative mb-10 overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.20)] md:rounded-[2.5rem]">
          <img
            src={courseHeroImage}
            alt={courseName}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#07162f]/90 via-[#0c2348]/78 to-[#15315d]/88 backdrop-blur-[2px]" />

          <div className="relative px-6 py-12 text-white md:px-12 md:py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur">
                <Sparkles size={15} />
                Espacio académico del curso
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.05] md:text-6xl">
                {courseName}
              </h1>

              <div className="mt-4 h-px w-28 bg-gradient-to-r from-white/80 to-transparent" />

              <p className="mt-7 max-w-3xl text-[1.03rem] leading-8 text-slate-200 md:text-lg">
                Un espacio pensado para acompañar el trayecto escolar, mantener
                informadas a las familias y organizar la vida pedagógica del curso.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur">
                  Jornada {courseShift}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur">
                  {courseRoom}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur">
                  Año lectivo {courseYear}
                </span>

                {canManageCourse && (
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur">
                    Gestión habilitada {userProfile?.name ? `· ${userProfile.name}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2.6rem] border border-slate-200 bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.09)] md:p-7">
          <div className="mb-8 rounded-[2rem] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-6 py-7 md:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[0.78rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  Panel integral del curso
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
                  Organización pedagógica de {courseName}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                  Información del curso, comunicados, plan lector, calendario y horario reunidos en un mismo espacio.
                </p>
              </div>

              {canManageCourse && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                  Gestión del profesor habilitada
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2.2rem] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-white p-2 md:p-3">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                    Información del curso
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Datos generales
                  </h2>

                  <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setIsCoursePhotoOpen(true)}
                      className="group relative block w-full overflow-hidden"
                    >
                      <img
                        src={staffImages.coursePhoto || coursePhoto}
                        alt={`Fotografía del curso ${courseName}`}
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-72"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                      <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                        <Expand size={16} />
                        Ver fotografía ampliada
                      </div>
                    </button>
{canManageCourse && (
  <div className="mt-4">
    <p className="text-sm font-bold text-slate-700 mb-2">
      Subir fotografía del curso
    </p>

    <ImageUploader
      label="Imagen del curso"
      value={staffImages.coursePhoto}
      folder={`cursos/${COURSE_ID}/general`}
      previewClassName="w-full h-56"
      onChange={async (url) => {
        try {
          await updateDoc(doc(db, 'courses', COURSE_ID), {
            coursePhoto: url,
          });

          setStaffImages((prev) => ({
            ...prev,
            coursePhoto: url,
          }));
        } catch (error) {
          console.error('Error guardando imagen:', error);
        }
      }}
    />
  </div>
)}
{canManageCourse && (
  <div className="mt-4">
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-slate-700 mb-3">
        Editar información del equipo
      </p>

      <input
        type="text"
        placeholder="Nombre profesora"
        value={staffInfo.teacherName}
        onChange={(e) =>
          setStaffInfo((prev) => ({
            ...prev,
            teacherName: e.target.value,
          }))
        }
        className="w-full mb-2 rounded-xl border px-3 py-2"
      />

      <input
        type="text"
        placeholder="Email profesora"
        value={staffInfo.teacherEmail}
        onChange={(e) =>
          setStaffInfo((prev) => ({
            ...prev,
            teacherEmail: e.target.value,
          }))
        }
        className="w-full mb-2 rounded-xl border px-3 py-2"
      />

      <input
        type="text"
        placeholder="Teléfono profesora"
        value={staffInfo.teacherPhone}
        onChange={(e) =>
          setStaffInfo((prev) => ({
            ...prev,
            teacherPhone: e.target.value,
          }))
        }
        className="w-full mb-2 rounded-xl border px-3 py-2"
      />

      <textarea
        placeholder="Descripción profesora"
        value={staffInfo.teacherDetail}
        onChange={(e) =>
          setStaffInfo((prev) => ({
            ...prev,
            teacherDetail: e.target.value,
          }))
        }
        className="w-full mb-2 rounded-xl border px-3 py-2"
      />
<hr className="my-4" />

<p className="text-sm font-bold text-slate-700 mb-2">
  Datos asistente
</p>

<input
  type="text"
  placeholder="Nombre asistente"
  value={staffInfo.assistantName}
  onChange={(e) =>
    setStaffInfo((prev) => ({
      ...prev,
      assistantName: e.target.value,
    }))
  }
  className="w-full mb-2 rounded-xl border px-3 py-2"
/>

<input
  type="text"
  placeholder="Email asistente"
  value={staffInfo.assistantEmail}
  onChange={(e) =>
    setStaffInfo((prev) => ({
      ...prev,
      assistantEmail: e.target.value,
    }))
  }
  className="w-full mb-2 rounded-xl border px-3 py-2"
/>

<input
  type="text"
  placeholder="Teléfono asistente"
  value={staffInfo.assistantPhone}
  onChange={(e) =>
    setStaffInfo((prev) => ({
      ...prev,
      assistantPhone: e.target.value,
    }))
  }
  className="w-full mb-2 rounded-xl border px-3 py-2"
/>

<textarea
  placeholder="Descripción asistente"
  value={staffInfo.assistantDetail}
  onChange={(e) =>
    setStaffInfo((prev) => ({
      ...prev,
      assistantDetail: e.target.value,
    }))
  }
  className="w-full mb-2 rounded-xl border px-3 py-2"
/>
      <button
        type="button"
        onClick={async () => {
          try {
            await updateDoc(doc(db, 'courses', COURSE_ID), {
              ...staffInfo,
            });
            alert('Datos guardados correctamente');
          } catch (error) {
            console.error(error);
          }
        }}
        className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-xl"
      >
        Guardar cambios
      </button>
    </div>
  </div>
)}
                    <div className="grid gap-4 p-5 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white">
                            <GraduationCap size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Nivel</p>
                            <p className="mt-1 font-semibold text-slate-800">{courseLevel}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                            <Users size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Estudiantes</p>
                            <p className="mt-1 font-semibold text-slate-800">{courseStudents} alumnos</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white">
                            <Clock3 size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Jornada</p>
                            <p className="mt-1 font-semibold text-slate-800">{courseShift}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-700 text-white">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Sala</p>
                            <p className="mt-1 font-semibold text-slate-800">{courseRoom}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                    Equipo del curso
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    {assistant ? 'Profesora y asistente' : teacher?.role || 'Profesor jefe'}
                  </h2>

                  <div className="mt-6 space-y-5">
                    <StaffCard
                      name={staffInfo.teacherName || teacher.name}
                      email={staffInfo.teacherEmail || teacher.email}
                      phone={staffInfo.teacherPhone || teacher.phone}
                      detail={staffInfo.teacherDetail || teacher.detail}
                      image={staffImages.teacherImage || teacher.image}
                      accent={teacher.accent}
                      role={teacher.role}
                    />

                    {assistant && (
                      <StaffCard
                       name={staffInfo.assistantName || assistant.name}
                       email={staffInfo.assistantEmail || assistant.email}
                       phone={staffInfo.assistantPhone || assistant.phone}
                       detail={staffInfo.assistantDetail || assistant.detail}
                       image={staffImages.assistantImage || assistant.image}
                       accent={assistant.accent}
                       role={assistant.role}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
{canManageCourse && (
  <div className="mt-6 space-y-6">
    
    {/* PROFESORA */}
    <div>
      <p className="text-sm font-bold text-slate-700 mb-2">
        Imagen profesora
      </p>

      <ImageUploader
        label="Subir imagen profesora"
        value={staffImages.teacherImage}
        folder={`cursos/${COURSE_ID}/profesora`}
        previewClassName="w-full h-48"
        onChange={async (url) => {
          try {
            await updateDoc(doc(db, 'courses', COURSE_ID), {
              teacherImage: url,
            });

            setStaffImages((prev) => ({
              ...prev,
              teacherImage: url,
            }));
          } catch (error) {
            console.error('Error guardando imagen profesora:', error);
          }
        }}
      />
    </div>

    {/* ASISTENTE */}
    {assistant && (
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2">
          Imagen asistente
        </p>

        <ImageUploader
          label="Subir imagen asistente"
          value={staffImages.assistantImage}
          folder={`cursos/${COURSE_ID}/asistente`}
          previewClassName="w-full h-48"
          onChange={async (url) => {
            try {
              await updateDoc(doc(db, 'courses', COURSE_ID), {
                assistantImage: url,
              });

              setStaffImages((prev) => ({
                ...prev,
                assistantImage: url,
              }));
            } catch (error) {
              console.error('Error guardando imagen asistente:', error);
            }
          }}
        />
      </div>
    )}
  </div>
)}
            <div className="rounded-[2.2rem] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-white p-2 md:p-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-blue-600">
                      Comunicados
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-900">
                      Comunicados del curso
                    </h2>
                  </div>

                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white md:flex">
                    <Megaphone size={22} />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {communications.length > 0 ? (
                    communications.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getCommunicationBadgeClasses(item.type)}`}>
                                {item.type}
                              </span>

                              {item.createdAt?.seconds && (
                                <span className="text-xs font-semibold text-slate-400">
                                  {new Intl.DateTimeFormat('es-CL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  }).format(new Date(item.createdAt.seconds * 1000))}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3 text-lg font-black text-slate-900">{item.title}</h3>
                            <p className="mt-2 leading-7 text-slate-600">{item.message}</p>

                            {(item.createdByName || item.createdByEmail) && (
                              <p className="mt-4 text-xs font-semibold text-slate-400">
                                Publicado por: {item.createdByName || item.createdByEmail}
                              </p>
                            )}
                          </div>

                          {canManageCourse && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditCommunication(item)}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCommunication(item.id)}
                                className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                              >
                                <Trash2 size={14} />
                                Borrar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                      Aún no hay comunicados publicados.
                    </div>
                  )}
                </div>

                {canManageCourse && (
                  <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Gestión del profesor</p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      {editingCommunicationId ? 'Editar comunicado' : 'Publicar comunicado'}
                    </h3>

                    {communicationError && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {communicationError}
                      </div>
                    )}

                    {communicationSuccess && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        {communicationSuccess}
                      </div>
                    )}

                    <div className="mt-5 space-y-4">
                      <input
                        type="text"
                        value={newCommunication.title}
                        onChange={(e) => setNewCommunication((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Título del comunicado"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                      />

                      <select
                        value={newCommunication.type}
                        onChange={(e) => setNewCommunication((prev) => ({ ...prev, type: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                      >
                        <option>Comunicado</option>
                        <option>Importante</option>
                        <option>Recordatorio</option>
                        <option>Urgente</option>
                      </select>

                      <textarea
                        rows="4"
                        value={newCommunication.message}
                        onChange={(e) => setNewCommunication((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Mensaje para las familias"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                      />

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleAddOrUpdateCommunication}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                        >
                          <Save size={18} />
                          {editingCommunicationId ? 'Guardar cambios' : 'Publicar comunicado'}
                        </button>

                        {editingCommunicationId && (
                          <button
                            type="button"
                            onClick={handleCancelEditCommunication}
                            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.78rem] font-black uppercase tracking-[0.28em] text-emerald-700">
                      Plan lector
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      Lectura del mes
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Libro y orientaciones de lectura definidas para el curso.
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white md:flex">
                    <BookOpen size={22} />
                  </div>
                </div>

                <div className="mt-7 grid gap-6 rounded-[1.7rem] border border-emerald-100 bg-white p-5 md:grid-cols-[190px_1fr]">
                  <div className="overflow-hidden rounded-[1.4rem] border border-emerald-100 bg-emerald-50 shadow-sm">
                    <img
                      src={activeReadingPlan.coverImage || '/images/plan-lector/el-lugar-mas-bonito.jpg'}
                      alt={activeReadingPlan.title}
                      className="h-full min-h-[240px] w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
                      {activeReadingPlan.month}
                    </span>

                    <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
                      {activeReadingPlan.title}
                    </h3>

                    <p className="mt-2 font-bold text-slate-600">
                      Autor: {activeReadingPlan.author}
                    </p>

                    <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                      {activeReadingPlan.description}
                    </p>

                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <p className="font-black text-emerald-800">Objetivo del mes</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {activeReadingPlan.objective}
                      </p>
                    </div>
                  </div>
                </div>

                {canManageCourse && (
                  <div className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                      Gestión del profesor
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      {editingReadingPlanId ? 'Editar plan lector' : 'Crear nuevo plan lector'}
                    </h3>

                    {readingSuccess && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        {readingSuccess}
                      </div>
                    )}

                    <div className="mt-5 space-y-4">
                      <input
                        type="text"
                        value={readingPlanForm.month}
                        onChange={(e) => setReadingPlanForm((prev) => ({ ...prev, month: e.target.value }))}
                        placeholder="Mes. Ej: Abril 2026"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                      />

                      <input
                        type="text"
                        value={readingPlanForm.title}
                        onChange={(e) => setReadingPlanForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Título del libro"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                      />

                      <input
                        type="text"
                        value={readingPlanForm.author}
                        onChange={(e) => setReadingPlanForm((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Autor"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                      />
                      
                      <ImageUploader
                      label="Portada o imagen del plan lector"
                       value={readingPlanForm.coverImage}
                       folder={`cursos/${COURSE_ID}/plan-lector`}
                       previewClassName="w-full h-56"
                       onChange={(url) =>
                       setReadingPlanForm((prev) => ({
                       ...prev,
                      coverImage: url,
                    }))
                   }
/>

                      <textarea
                        rows="4"
                        value={readingPlanForm.description}
                        onChange={(e) => setReadingPlanForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción del plan lector"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                      />

                      <textarea
                        rows="3"
                        value={readingPlanForm.objective}
                        onChange={(e) => setReadingPlanForm((prev) => ({ ...prev, objective: e.target.value }))}
                        placeholder="Objetivo del mes"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                      />

                      <label className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                        <input
                          type="checkbox"
                          checked={readingPlanForm.isActive}
                          onChange={(e) => setReadingPlanForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        />
                        Marcar como plan lector activo
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleSaveReadingPlan}
                          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                        >
                          <Save size={18} />
                          {editingReadingPlanId ? 'Guardar cambios' : 'Crear plan lector'}
                        </button>

                        {editingReadingPlanId && (
                          <button
                            type="button"
                            onClick={handleCancelEditReadingPlan}
                            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-black text-slate-900">
                        Historial de planes lectores
                      </h4>

                      <div className="mt-4 space-y-3">
                        {readingPlans.length > 0 ? (
                          readingPlans.map((plan) => (
                            <div key={plan.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                      {plan.month}
                                    </span>

                                    {plan.isActive && (
                                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                                        Activo
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="mt-2 font-black text-slate-900">{plan.title}</h5>
                                  <p className="mt-1 text-sm text-slate-500">Autor: {plan.author}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {!plan.isActive && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetActiveReadingPlan(plan.id)}
                                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                      Activar
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleEditReadingPlan(plan)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                                  >
                                    <Pencil size={14} />
                                    Editar
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReadingPlan(plan.id)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                                  >
                                    <Trash2 size={14} />
                                    Borrar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                            Aún no hay planes lectores guardados.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                      Organización pedagógica
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-900">
                      Calendario del curso
                    </h2>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <button
                      type="button"
                      onClick={handlePreviousMonth}
                      className="rounded-full p-2 text-slate-600 transition hover:bg-white hover:text-slate-900"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <span className="min-w-[150px] text-center text-sm font-semibold capitalize text-slate-800 md:min-w-[180px]">
                      {monthName}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="rounded-full p-2 text-slate-600 transition hover:bg-white hover:text-slate-900"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-slate-200 bg-slate-50 p-3 md:p-5">
                  <div className="mb-4 grid grid-cols-7 gap-1.5 md:gap-3">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 md:text-xs md:tracking-[0.18em]">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 md:gap-3">
                    {calendarDays.map((day, index) => {
                      if (!day) {
                        return <div key={`empty-${index}`} className="min-h-20 rounded-2xl bg-transparent md:h-24" />;
                      }

                      const isoDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                      const dayEvents = eventsByDate[isoDate] || [];
                      const isSelected = selectedDate === isoDate;
                      const isToday = todayIso === isoDate;
                      return (
                        <button
                          key={isoDate}
                          type="button"
                          onClick={() => handleCalendarDayClick(isoDate)}
                          className={`min-h-20 rounded-2xl border p-2 text-left transition md:h-24 md:p-3 ${
                          isSelected
                          ? 'border-slate-900 bg-white shadow-md'
                          : isToday
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                          <div className="flex flex-col items-start">
                          <span className="text-xs font-bold text-slate-900 md:text-sm">
                          {day.getDate()}
                          </span>

                         {isToday && (
                         <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                         )}
                           </div>
                            {dayEvents.length > 0 && (
                              <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white md:px-2 md:text-[10px]">
                                {dayEvents.length}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 space-y-1 md:mt-3">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`truncate rounded-full border px-1.5 py-1 text-[9px] font-semibold md:px-2 md:text-[10px] ${getEventBadgeClasses(event.type)}`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-slate-200 bg-white p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <CalendarDays size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        Fecha seleccionada
                      </p>
                      <h3 className="mt-1 text-xl font-bold capitalize text-slate-900">
                        {formatHumanDate(selectedDate)}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map((event) => (
                        <div key={event.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
                                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getEventBadgeClasses(event.type)}`}>
                                  {event.type}
                                </span>
                              </div>

                              {event.description && (
                                <p className="mt-3 leading-7 text-slate-600">{event.description}</p>
                              )}
                            </div>

                            {canManageCourse && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditEvent(event)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                                >
                                  <Pencil size={14} />
                                  Editar
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                                >
                                  <Trash2 size={14} />
                                  Borrar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                        No hay actividades registradas para esta fecha.
                      </div>
                    )}
                  </div>
                </div>

                {canManageCourse && (
                  <div ref={formRef} className="mt-6 rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <Plus size={22} />
                      </div>
                      <div>
                        <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                          Gestión del calendario
                        </p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">
                          {editingEventId ? 'Editar actividad' : 'Agregar actividad'}
                        </h2>
                      </div>
                    </div>

                    <form onSubmit={handleAddOrUpdateEvent} className="mt-6 space-y-4">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        Fecha seleccionada: <span className="font-bold capitalize">{formatHumanDate(newEvent.date)}</span>
                      </div>

                      {eventError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                          {eventError}
                        </div>
                      )}

                      {eventSuccess && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                          {eventSuccess}
                        </div>
                      )}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Título</label>
                        <input
                          type="text"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                          placeholder="Ej: Prueba de Matemática"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo</label>
                          <select
                            value={newEvent.type}
                            onChange={(e) => setNewEvent((prev) => ({ ...prev, type: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                          >
                            <option>Actividad</option>
                            <option>Prueba</option>
                            <option>Trabajo</option>
                            <option>Reunión</option>
                            <option>Tarea</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Fecha</label>
                          <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Descripción</label>
                        <textarea
                          rows="4"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                          placeholder="Detalle breve de la actividad"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={savingEvent}
                          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                        >
                          <Save size={18} />
                          {savingEvent ? 'Guardando...' : editingEventId ? 'Guardar cambios' : 'Guardar actividad'}
                        </button>

                        {editingEventId && (
                          <button
                            type="button"
                            onClick={handleCancelEditEvent}
                            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-white p-2 md:p-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] font-black uppercase tracking-[0.24em] text-violet-700">
                      Organización semanal
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Horario del curso
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Distribución semanal de asignaturas.
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-violet-700 text-white md:flex">
                    <Table2 size={19} />
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="bg-violet-700 text-white">
                      <tr>
                        <th className="px-3 py-3 text-left">Bloque</th>
                        <th className="px-3 py-3 text-center">Lunes</th>
                        <th className="px-3 py-3 text-center">Martes</th>
                        <th className="px-3 py-3 text-center">Miércoles</th>
                        <th className="px-3 py-3 text-center">Jueves</th>
                        <th className="px-3 py-3 text-center">Viernes</th>
                        {canManageCourse && <th className="px-3 py-3 text-center">Gestión</th>}
                      </tr>
                    </thead>

                    <tbody>
                      {visibleScheduleBlocks.map((block) => (
                        <React.Fragment key={block.id || block.order || block.time}>
                          <tr className="bg-white even:bg-slate-50">
                            <td className="border-t border-slate-200 px-3 py-3 font-black text-slate-800">
                              {block.time}
                            </td>

                            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].map((field) => (
                              <td
                                key={`${block.id || block.time}-${field}`}
                                className="border-t border-slate-200 px-3 py-3 text-center font-semibold text-slate-600"
                              >
                                {canManageCourse && block.id ? (
                                  <input
                                    type="text"
                                    defaultValue={block[field] || ''}
                                    onBlur={(e) => handleUpdateScheduleCell(block, field, e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-xs font-semibold outline-none focus:border-violet-400"
                                  />
                                ) : (
                                  block[field] || '—'
                                )}
                              </td>
                            ))}

                            {canManageCourse && (
                              <td className="border-t border-slate-200 px-3 py-3 text-center">
                                {block.id && (
                                  <div className="flex justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditScheduleBlock(block)}
                                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
                                    >
                                      Editar
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteScheduleBlock(block.id)}
                                      className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                                    >
                                      Borrar
                                    </button>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>

                          {SCHEDULE_RECESSES.find((item) => item.afterOrder === Number(block.order)) && (
                            <tr className="bg-violet-50">
                              <td
                                colSpan={canManageCourse ? 7 : 6}
                                className="border-t border-violet-100 px-3 py-2 text-center"
                              >
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-violet-700">
                                  {SCHEDULE_RECESSES.find((item) => item.afterOrder === Number(block.order)).label}
                                </span>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {canManageCourse && (
                  <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                      Gestión del profesor
                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">
                      {editingScheduleId ? 'Editar bloque' : 'Crear nuevo bloque'}
                    </h3>

                    {scheduleError && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                        {scheduleError}
                      </div>
                    )}

                    {scheduleSuccess && (
                      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                        {scheduleSuccess}
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_90px]">
                      <input
                        type="text"
                        value={scheduleForm.time}
                        onChange={(e) => handleScheduleInputChange('time', e.target.value)}
                        placeholder="Ej: 14:00 - 14:45"
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                      />

                      <input
                        type="number"
                        value={scheduleForm.order}
                        onChange={(e) => handleScheduleInputChange('order', e.target.value)}
                        placeholder="Orden"
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                      />
                    </div>

                    <div className="mt-3 grid gap-2 md:grid-cols-5">
                      {[
                        ['lunes', 'Lunes'],
                        ['martes', 'Martes'],
                        ['miercoles', 'Miércoles'],
                        ['jueves', 'Jueves'],
                        ['viernes', 'Viernes'],
                      ].map(([field, label]) => (
                        <input
                          key={`form-${field}`}
                          type="text"
                          value={scheduleForm[field]}
                          onChange={(e) => handleScheduleInputChange(field, e.target.value)}
                          placeholder={label}
                          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSaveScheduleBlock}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
                      >
                        <Save size={16} />
                        {editingScheduleId ? 'Guardar cambios' : 'Crear bloque'}
                      </button>

                      {editingScheduleId && (
                        <button
                          type="button"
                          onClick={handleCancelEditScheduleBlock}
                          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                      )}

                      {scheduleBlocks.length === 0 && (
                        <button
                          type="button"
                          onClick={handleCreateDefaultSchedule}
                          className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                        >
                          Crear horario base
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}