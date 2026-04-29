import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  PartyPopper,
  CalendarDays,
  Lightbulb,
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Flag,
  Globe,
  HeartPulse,
  Leaf,
  Scale,
  Landmark,
  Radio,
  PlusCircle,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, appId } from '../firebase/config';
import { getEfemerideHoy, getColorClasses } from '../data/efemerides';

const sliderImages = [
  {
    url: 'https://www.colegioitalianosp.cl/Images/Slider/20251030_120741.jpg',
    title: 'Excelencia educativa desde 1992',
    subtitle: 'Formando personas íntegras con valores sólidos',
    buttonText: 'Conoce nuestra historia',
    action: 'historia',
  },
  {
    url: 'https://www.colegioitalianosp.cl/Images/Slider/20230915_111455.jpg',
    title: 'Comunidad educativa unida',
    subtitle: 'Aprendizaje colaborativo en un entorno seguro',
    buttonText: 'Ver noticias',
    action: 'noticias',
  },
  {
    url: 'https://www.colegioitalianosp.cl/Images/Slider/20251028_111914.jpg',
    title: 'Excelencia académica 2026–2027',
    subtitle: 'Compromiso permanente con una educación de calidad',
    buttonText: 'Ver PEI',
    action: 'pei',
  },
  {
    url: 'https://www.colegioitalianosp.cl/Images/Slider/6fa70f87-8b22-4cee-904e-720d52faa74e.jpg',
    title: 'Sé parte de nuestra comunidad',
    subtitle: 'Un colegio con identidad, valores y proyección',
    buttonText: 'Nuestros sellos',
    action: 'sellos',
  },
];

const galleryImages = [
  'https://www.colegioitalianosp.cl/Images/Slider/20230915_111455.jpg',
  'https://www.colegioitalianosp.cl/Images/Slider/20251028_111914.jpg',
  'https://www.colegioitalianosp.cl/Images/Slider/20251030_120741.jpg',
  'https://www.colegioitalianosp.cl/Images/Antiguas/12347617_10153180093402231_6315904574571136235_n.jpg',
  'https://www.colegioitalianosp.cl/Images/Antiguas/504079807_24013264584970230_212165518267922505_n.jpg',
  'https://www.colegioitalianosp.cl/Images/Slider/6fa70f87-8b22-4cee-904e-720d52faa74e.jpg',
  'https://www.colegioitalianosp.cl/Images/Slider/20230915_111455.jpg',
  'https://www.colegioitalianosp.cl/Images/Slider/20251028_111914.jpg',
];

const quickLinks = [
  {
    title: 'Historia',
    desc: 'Origen y trayectoria',
    icon: <BookOpen size={22} />,
    id: 'historia',
    borderColor: 'border-blue-500',
    color: 'text-blue-600',
  },
  {
    title: 'PEI',
    desc: 'Proyecto educativo',
    icon: <GraduationCap size={22} />,
    id: 'pei',
    borderColor: 'border-green-500',
    color: 'text-green-600',
  },
  {
    title: 'Sellos',
    desc: 'Identidad institucional',
    icon: <Sparkles size={22} />,
    id: 'sellos',
    borderColor: 'border-yellow-500',
    color: 'text-yellow-600',
  },
  {
    title: 'Protocolos',
    desc: 'Información importante',
    icon: <ShieldCheck size={22} />,
    id: 'protocolos',
    borderColor: 'border-purple-500',
    color: 'text-purple-600',
  },
];

const normalizeCategory = (category) => {
  const value = (category || '').toLowerCase();

  if (value.includes('acad')) return 'academic';
  if (value.includes('sport') || value.includes('deport')) return 'sports';
  if (
    value.includes('holi') ||
    value.includes('fer') ||
    value.includes('cele') ||
    value.includes('acto')
  ) {
    return 'holiday';
  }

  return 'general';
};

const getCategoryMeta = (category) => {
  const normalized = normalizeCategory(category);

  switch (normalized) {
    case 'academic':
      return {
        key: 'academic',
        label: 'Académico',
        icon: <BookOpen className="text-blue-600" size={18} />,
        pill: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'sports':
      return {
        key: 'sports',
        label: 'Deportivo',
        icon: <Trophy className="text-orange-600" size={18} />,
        pill: 'bg-orange-50 text-orange-700 border-orange-200',
      };
    case 'holiday':
      return {
        key: 'holiday',
        label: 'Celebración',
        icon: <PartyPopper className="text-purple-600" size={18} />,
        pill: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    default:
      return {
        key: 'general',
        label: 'Institucional',
        icon: <CalendarDays className="text-emerald-600" size={18} />,
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
  }
};

const renderEfemerideIcon = (efemeride) => {
  const icon = efemeride?.icon || '';
  const type = efemeride?.type || 'cultural';

  if (icon === 'book-open') return <BookOpen size={28} />;
  if (icon === 'graduation-cap') return <GraduationCap size={28} />;
  if (icon === 'users') return <Users size={28} />;
  if (icon === 'shield-check' || icon === 'accessibility') return <ShieldCheck size={28} />;
  if (icon === 'leaf' || icon === 'tree-pine') return <Leaf size={28} />;
  if (icon === 'heart-pulse') return <HeartPulse size={28} />;
  if (icon === 'flag' || icon === 'anchor') return <Flag size={28} />;
  if (icon === 'globe' || icon === 'map') return <Globe size={28} />;
  if (icon === 'scale') return <Scale size={28} />;
  if (icon === 'landmark') return <Landmark size={28} />;
  if (icon === 'radio') return <Radio size={28} />;

  switch (type) {
    case 'educacion':
      return <GraduationCap size={28} />;
    case 'convivencia':
      return <Users size={28} />;
    case 'patriotica':
      return <Flag size={28} />;
    case 'medioambiente':
      return <Leaf size={28} />;
    case 'salud':
      return <HeartPulse size={28} />;
    case 'derechos':
      return <Scale size={28} />;
    case 'patrimonio':
      return <Landmark size={28} />;
    case 'civica':
      return <ShieldCheck size={28} />;
    default:
      return <Sparkles size={28} />;
  }
};

const formatLongDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatWeekday = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', {
    weekday: 'long',
  });

const formatMonthShort = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', {
    month: 'short',
  });

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function Home({
  news = [],
  events = [],
  onNavigate,
  onSelectNews,
  isAdmin = false,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [todayKey, setTodayKey] = useState(() => new Date().toDateString());

  const [calendarFilter, setCalendarFilter] = useState('all');
  const [calendarMonthDate, setCalendarMonthDate] = useState(() => new Date());
  const [featuredEventIndex, setFeaturedEventIndex] = useState(0);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarForm, setCalendarForm] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    category: 'general',
  });

  const newsSectionRef = useRef(null);
  const [isNewsVisible, setIsNewsVisible] = useState(false);

  const featuredNews = news[0] || null;
  const secondaryNews = news.slice(1, 4);

  const optimizeImage = (url, size = 'w_1600,h_900,c_fill,q_auto,f_auto') => {
    if (!url) return '';
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/${size}/`);
  };

  const getNewsSummary = (item, fallback = '') => {
    const rawText = item?.content || item?.description || fallback;
    return rawText.length > 190 ? `${rawText.slice(0, 190).trim()}...` : rawText;
  };

  const latestNewsSlide = featuredNews?.imageUrl
    ? {
        type: 'news',
        url: optimizeImage(featuredNews.imageUrl),
        title: featuredNews.title || 'Nueva noticia institucional',
        subtitle: getNewsSummary(
          featuredNews,
          'Revisa la última información publicada por nuestra comunidad educativa.'
        ),
        buttonText: 'Leer noticia',
        action: 'latest-news',
        newsData: featuredNews,
      }
    : null;

  const heroSlides = latestNewsSlide ? [latestNewsSlide, ...sliderImages] : sliderImages;

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    setCurrentSlide((prev) => (prev >= heroSlides.length ? 0 : prev));
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(goToNextSlide, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const currentKey = now.toDateString();

    setTodayKey((prev) => (prev !== currentKey ? currentKey : prev));

    setCalendarMonthDate((prev) => {
      const sameMonth =
        prev.getFullYear() === now.getFullYear() &&
        prev.getMonth() === now.getMonth();

      return sameMonth ? prev : new Date(now.getFullYear(), now.getMonth(), 1);
    });
  }, 60000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const node = newsSectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNewsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const efemerideHoy = useMemo(() => getEfemerideHoy(), [todayKey]);
  const efemerideColors = getColorClasses(efemerideHoy?.color || 'emerald');

  const todayFormatted = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const schoolEvents = useMemo(() => {
    return [...events]
      .filter((event) => !event.isEfemeride)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [events]);

  const filterTabs = useMemo(
    () => [
      { key: 'all', label: 'Todos' },
      { key: 'academic', label: 'Académico' },
      { key: 'sports', label: 'Deportivo' },
      { key: 'holiday', label: 'Celebraciones' },
      { key: 'general', label: 'Institucional' },
    ],
    []
  );

  const filteredSchoolEvents = useMemo(() => {
    if (calendarFilter === 'all') return schoolEvents;
    return schoolEvents.filter((event) => normalizeCategory(event.category) === calendarFilter);
  }, [schoolEvents, calendarFilter]);

  useEffect(() => {
    setFeaturedEventIndex(0);
  }, [calendarFilter]);

  useEffect(() => {
    if (filteredSchoolEvents.length <= 1 || selectedCalendarEvent) return undefined;

    const interval = setInterval(() => {
      setFeaturedEventIndex((prev) => (prev + 1) % Math.min(filteredSchoolEvents.length, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredSchoolEvents, selectedCalendarEvent]);

  const featuredPool = filteredSchoolEvents.slice(0, 5);
  const rotatingFeaturedEvent = featuredPool.length
    ? featuredPool[featuredEventIndex % featuredPool.length]
    : null;

  const displayedFeaturedEvent =
    selectedCalendarEvent || rotatingFeaturedEvent || filteredSchoolEvents[0] || null;

  const nextEventInfo = useMemo(() => {
    if (!displayedFeaturedEvent?.date) return null;

    const today = new Date();
    const eventDate = new Date(`${displayedFeaturedEvent.date}T12:00:00`);
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = Math.ceil((eventDate - today) / msPerDay);

    if (diff < 0) return 'Ya ocurrió';
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    return `En ${diff} días`;
  }, [displayedFeaturedEvent]);

  const monthCalendarDays = useMemo(() => {
    const year = calendarMonthDate.getFullYear();
    const month = calendarMonthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startWeekDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];

    for (let i = 0; i < startWeekDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const currentDate = new Date(year, month, day);

      const dayEvents = filteredSchoolEvents.filter((event) => {
        const eventDate = new Date(`${event.date}T12:00:00`);
        return isSameDay(eventDate, currentDate);
      });

      cells.push({
        date: currentDate,
        day,
        events: dayEvents,
      });
    }

    return cells;
  }, [calendarMonthDate, filteredSchoolEvents]);

  const handleCalendarDayClick = (cell) => {
    if (!cell) return;

    const clickedDate = cell.date.toISOString().split('T')[0];
    const existingEvent = filteredSchoolEvents.find((event) => event.date === clickedDate) || null;

    setSelectedCalendarDate(clickedDate);

    if (isAdmin) {
      setCalendarForm({
        id: existingEvent?.id || '',
        title: existingEvent?.title || '',
        description: existingEvent?.description || '',
        date: clickedDate,
        category: existingEvent?.category || 'general',
      });
      setIsCalendarModalOpen(true);
      return;
    }

    if (existingEvent) {
      setSelectedCalendarEvent(existingEvent);
    } else {
      setSelectedCalendarEvent(null);
    }
  };

  const handleSaveCalendarEvent = async () => {
    try {
      if (!calendarForm.title.trim() || !calendarForm.date) return;

      const payload = {
        title: calendarForm.title.trim(),
        description: calendarForm.description.trim(),
        date: calendarForm.date,
        category: calendarForm.category,
        isEfemeride: false,
      };

      if (calendarForm.id) {
        await updateDoc(
          doc(
            db,
            'artifacts',
            appId,
            'public',
            'data',
            'calendar_events',
            calendarForm.id
          ),
          payload
        );
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'calendar_events'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }

      setSelectedCalendarEvent({
        ...payload,
        id: calendarForm.id || `temp-${Date.now()}`,
      });
      setIsCalendarModalOpen(false);
    } catch (error) {
      console.error('Error guardando evento:', error);
    }
  };

  const handleDeleteCalendarEvent = async () => {
    try {
      if (!calendarForm.id) return;

      await deleteDoc(
        doc(
          db,
          'artifacts',
          appId,
          'public',
          'data',
          'calendar_events',
          calendarForm.id
        )
      );

      setIsCalendarModalOpen(false);
      setSelectedCalendarEvent(null);
      setCalendarForm({
        id: '',
        title: '',
        description: '',
        date: '',
        category: 'general',
      });
    } catch (error) {
      console.error('Error eliminando evento:', error);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 font-sans bg-white">
      {/* HERO 2026 LIMPIO E INTERACTIVO */}
      <section className="relative h-[620px] md:h-[820px] bg-[#06140e] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#06140e] via-[#06140e]/75 to-[#06140e]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06140e] via-transparent to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(250,204,21,0.18),transparent_26%)]" />

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-5 sm:px-6 max-w-7xl pt-10 sm:pt-16">
                <div
                  className={`max-w-5xl transition-all duration-700 delay-200 ${
                    index === currentSlide
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <span className="h-px w-10 sm:w-14 bg-yellow-400" />
                    <span className="text-white/75 text-[10px] md:text-xs font-black uppercase tracking-[0.35em]">
                      {slide.type === 'news' ? 'Última noticia' : 'Colegio Italiano San Pedro'}
                    </span>

                    {slide.type === 'news' && (
                      <span className="hidden sm:inline-flex items-center gap-2 bg-yellow-400 text-[#06140e] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.22em] shadow-xl">
                        <Sparkles size={13} />
                        Nueva publicación
                      </span>
                    )}
                  </div>

                  <h1 className="text-\[2\.65rem\] min-\[380px\]:text-\[3rem\] sm:text-6xl md:text-7xl lg:text-\[7\.3rem\] font-black text-white tracking-\[\-0\.055em\] md:tracking-\[\-0\.08em\] leading-\[0\.9\] md:leading-\[0\.84\] max-w-5xl drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  <p className="mt-5 sm:mt-8 text-white/84 text-base sm:text-lg md:text-2xl leading-relaxed max-w-3xl font-medium line-clamp-3 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={() => {
                        if (slide.type === 'news') {
                          onSelectNews?.(slide.newsData);
                          return;
                        }

                        onNavigate?.(slide.action);
                      }}
                      className="group bg-yellow-400 text-\[\#06140e\] px-6 md:px-8 py-4 md:py-5 rounded-full font-black text-\[10px\] md:text-xs uppercase tracking-\[0\.22em\] md:tracking-\[0\.3em\] shadow-\[0_25px_70px_rgba\(250\,204\,21\,0\.25\)\] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {slide.buttonText}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>

                    <button
                      onClick={() => onNavigate?.('noticias')}
                      className="bg-white/10 border border-white/20 text-white px-6 md:px-8 py-4 md:py-5 rounded-full font-black text-\[10px\] md:text-xs uppercase tracking-\[0\.22em\] md:tracking-\[0\.3em\] hover:bg-white/18 transition-all backdrop-blur-md text-center"
                    >
                      Actualidad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* FLECHAS */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-3 md:left-8 top-\[46\%\] md:top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-xl flex items-center justify-center hover:bg-yellow-400 hover:text-\[\#06140e\] transition-all shadow-2xl"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={26} />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-3 md:right-8 top-\[46\%\] md:top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-xl flex items-center justify-center hover:bg-yellow-400 hover:text-\[\#06140e\] transition-all shadow-2xl"
          aria-label="Slide siguiente"
        >
          <ChevronRight size={26} />
        </button>

        {/* CONTADOR / PROGRESO */}
        <div className="absolute bottom-6 md:bottom-9 left-5 right-5 md:left-6 md:right-6 z-40">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-5">
              <div className="flex items-center gap-4 text-white">
                <span className="text-2xl md:text-5xl font-black tracking-tighter">
                  {String(currentSlide + 1).padStart(2, '0')}
                </span>

                <div className="h-px w-12 md:w-28 bg-white/25" />

                <span className="text-white/55 text-sm font-bold">
                  {String(heroSlides.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`group flex items-center gap-2 sm:gap-3 transition-all ${
                      idx === currentSlide ? 'opacity-100' : 'opacity-45 hover:opacity-100'
                    }`}
                    aria-label={`Ir al slide ${idx + 1}`}
                  >
                    <span
                      className={`h-[3px] rounded-full transition-all ${
                        idx === currentSlide ? 'w-10 sm:w-16 bg-yellow-400' : 'w-6 sm:w-8 bg-white'
                      }`}
                    />
                    <span className="hidden lg:block text-\[10px\] text-white font-black uppercase tracking-\[0\.25em\] max-w-\[170px\] truncate">
                      {slide.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESOS */}
      <section className="relative z-30 -mt-12 md:-mt-20 px-4 pb-12">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((card, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate?.(card.id)}
              className={`bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-8 ${card.borderColor} flex flex-col items-center text-center transition-all hover:-translate-y-3 group`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${card.color}`}
              >
                {card.icon}
              </div>
              <h3 className="text-base font-black uppercase text-slate-800 tracking-tighter">
                {card.title}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                {card.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

            {/* NOTICIAS EDITORIAL PREMIUM */}
      <section
        ref={newsSectionRef}
        className={`py-24 bg-[#f8faf8] relative overflow-hidden transition-all duration-700 ${
          isNewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,71,49,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.13),transparent_24%)]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div
            className={`mb-12 transition-all duration-700 ${
              isNewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-[#1a4731] text-yellow-300 flex items-center justify-center shadow-xl">
                    <BookOpen size={21} />
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-[0.34em] text-amber-600">
                    Actualidad institucional
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl font-black tracking-[-0.065em] leading-[0.9] text-[#123524]">
                  Noticias de nuestra comunidad
                </h2>

                <p className="mt-5 text-slate-600 text-lg md:text-xl max-w-3xl leading-relaxed">
                  Lo que ocurre en nuestra comunidad también construye historia.
                </p>
              </div>

              <button
                onClick={() => onNavigate?.('noticias')}
                className="group inline-flex items-center justify-center gap-3 border border-[#1a4731] text-[#1a4731] px-7 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.26em] hover:bg-[#1a4731] hover:text-white transition-all"
              >
                Ver todas las noticias
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {!featuredNews ? (
            <div className="py-20 text-center text-slate-400 border border-dashed border-slate-300 rounded-[2rem] bg-white">
              Sin noticias aún
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
              <article
                onClick={() => onSelectNews?.(featuredNews)}
                className={`xl:col-span-7 group cursor-pointer relative overflow-hidden rounded-[2.2rem] min-h-[560px] shadow-[0_30px_80px_rgba(15,23,42,0.18)] border border-white bg-slate-900 ${
                  isNewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transition: 'all 700ms ease', transitionDelay: '120ms' }}
              >
                <img
                  src={
                    optimizeImage(
                      featuredNews.imageUrl ||
                        'https://www.colegioitalianosp.cl/Images/Slider/20230915_111455.jpg',
                      'w_1200,h_760,c_fill,q_auto,f_auto'
                    )
                  }
                  className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  alt={featuredNews.title || 'Noticia destacada'}
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#06140e] via-[#06140e]/70 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.20),transparent_26%)]" />

                <div className="absolute top-7 left-7">
                  <span className="inline-flex items-center gap-2 bg-[#1a4731] text-white px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.26em] shadow-xl">
                    <Sparkles size={14} className="text-yellow-300" />
                    Noticia destacada
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-2 text-yellow-300 text-[11px] font-black uppercase tracking-[0.26em]">
                      <CalendarDays size={15} />
                      {featuredNews.date || 'Reciente'}
                    </span>

                    <span className="hidden sm:block w-px h-4 bg-white/25" />

                    <span className="text-white/80 text-[11px] font-black uppercase tracking-[0.26em]">
                      Colegio Italiano San Pedro
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-[-0.045em] leading-[0.95] max-w-4xl group-hover:text-yellow-300 transition-colors">
                    {featuredNews.title}
                  </h3>

                  <p className="text-white/82 mt-5 text-sm md:text-base leading-relaxed max-w-3xl line-clamp-3">
                    {getNewsSummary(featuredNews)}
                  </p>

                  <button
                    type="button"
                    className="mt-8 inline-flex items-center gap-2 sm:gap-3 bg-yellow-400 text-[#06140e] px-6 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.26em] shadow-xl group-hover:scale-[1.03] transition-all"
                  >
                    Leer noticia completa
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>

              <aside
                className={`xl:col-span-5 bg-white rounded-[2.2rem] shadow-[0_24px_70px_rgba(15,23,42,0.10)] border border-slate-100 overflow-hidden ${
                  isNewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transition: 'all 700ms ease', transitionDelay: '220ms' }}
              >
                <div className="p-7 md:p-8 border-b border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <h3 className="text-[#123524] font-black uppercase tracking-[0.22em] text-sm">
                      Últimas publicaciones
                    </h3>
                  </div>

                  <div className="mt-5 w-20 h-[2px] bg-yellow-400 rounded-full" />
                </div>

                <div className="divide-y divide-slate-100">
                  {secondaryNews.length === 0 ? (
                    <div className="p-8 text-slate-400 text-sm">
                      Aún no hay más publicaciones disponibles.
                    </div>
                  ) : (
                    secondaryNews.map((n, i) => (
                      <article
                        key={n.id || i}
                        onClick={() => onSelectNews?.(n)}
                        className="group cursor-pointer p-6 md:p-7 flex gap-5 hover:bg-slate-50 transition-all"
                      >
                        <div className="w-28 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                          <img
                            src={
                              optimizeImage(
                                n.imageUrl ||
                                  'https://www.colegioitalianosp.cl/Images/Slider/20251028_111914.jpg',
                                'w_360,h_280,c_fill,q_auto,f_auto'
                              )
                            }
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt={n.title || 'Noticia'}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-black">
                              {n.date || 'Reciente'}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-slate-300" />

                            <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a4731] font-black">
                              Institucional
                            </span>
                          </div>

                          <h4 className="text-base md:text-lg font-bold text-slate-900 leading-tight group-hover:text-[#1a4731] transition-colors line-clamp-3">
                            {n.title}
                          </h4>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 group-hover:text-[#1a4731] transition-colors">
                              Leer más
                            </span>

                            <ArrowRight
                              size={17}
                              className="text-[#1a4731] group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                <div className="p-6 md:p-7 bg-[#fbf7e8] border-t border-yellow-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-[#123524] flex items-center justify-center shadow-md">
                        <CalendarDays size={22} />
                      </div>

                      <div>
                        <p className="text-[#123524] font-black leading-tight">
                          Mantente informado
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          Revisa nuestras actividades más recientes.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate?.('noticias')}
                      className="bg-[#1a4731] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.24em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      Ver más
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}

          <div className="mt-14 flex items-center justify-center gap-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-yellow-400" />
            <div className="text-center">
              <p className="text-[#123524] font-black uppercase tracking-[0.24em] text-xs">
                Colegio Italiano San Pedro
              </p>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.25em] mt-1">
                Comunidad educativa
              </p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-yellow-400 to-yellow-400" />
          </div>
        </div>
      </section>

      {/* CALENDARIO ESCOLAR COMPACTO INTERACTIVO */}
      <section className="py-20 bg-[#143728] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.12),transparent_22%)]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-wrap gap-3 mb-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setCalendarFilter(tab.key);
                  setSelectedCalendarEvent(null);
                }}
                className={`px-5 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.28em] border transition-all ${
                  calendarFilter === tab.key
                    ? 'bg-yellow-400 text-[#143728] border-yellow-400 shadow-xl'
                    : 'bg-white/8 text-white border-white/10 hover:bg-white/14'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredSchoolEvents.length === 0 ? (
            <div className="py-20 text-center bg-white/5 rounded-[3rem] border border-white/10 text-white/50 backdrop-blur-sm">
              <CalendarDays className="mx-auto mb-4 opacity-30" size={48} />
              <p className="font-black uppercase text-xs tracking-widest">
                No hay eventos para este filtro
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-5">
                {displayedFeaturedEvent &&
                  (() => {
                    const d = new Date(`${displayedFeaturedEvent.date}T12:00:00`);
                    const meta = getCategoryMeta(displayedFeaturedEvent.category);

                    return (
                      <div className="relative rounded-[2.8rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.28)] border border-white/10 bg-[#d9c3e7]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_35%)]" />

                        <div className="relative p-8 md:p-10">
                          <div className="flex items-center justify-between gap-4 mb-8">
                            <span className="inline-flex items-center gap-2 bg-[#10214f] text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.28em] font-black">
                              <Sparkles size={14} />
                              {selectedCalendarEvent
                                ? 'Evento seleccionado'
                                : 'Destacado rotativo'}
                            </span>

                            {!selectedCalendarEvent && featuredPool.length > 1 && (
                              <div className="flex gap-2">
                                {featuredPool.map((item, idx) => (
                                  <button
                                    key={item.id || idx}
                                    onClick={() => setFeaturedEventIndex(idx)}
                                    className={`h-2 rounded-full transition-all ${
                                      idx === featuredEventIndex
                                        ? 'w-10 bg-[#1a4731]'
                                        : 'w-2 bg-white/40'
                                    }`}
                                    aria-label={`Mostrar evento ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-start justify-between gap-5 mb-8">
                            <div className="flex items-center gap-4">
                              <div className="bg-[#154f35] text-white rounded-[2rem] px-5 py-5 min-w-[118px] text-center shadow-xl">
                                <span className="block text-[10px] uppercase tracking-[0.3em] font-black text-white/70">
                                  {formatMonthShort(displayedFeaturedEvent.date)}
                                </span>
                                <span className="block text-5xl font-black leading-none my-2">
                                  {d.getDate()}
                                </span>
                                <span className="block text-[10px] uppercase tracking-[0.28em] font-black text-white/70">
                                  {formatWeekday(displayedFeaturedEvent.date)}
                                </span>
                              </div>

                              <div>
                                <span
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.28em] font-black border ${meta.pill}`}
                                >
                                  {meta.icon}
                                  {meta.label}
                                </span>
                              </div>
                            </div>

                            <div className="bg-white/70 border border-white/60 rounded-2xl px-4 py-3 text-right">
                              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                Cuenta regresiva
                              </div>
                              <div className="text-[#1a4731] text-lg font-black uppercase tracking-tight mt-1">
                                {nextEventInfo || 'Próximamente'}
                              </div>
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-[0.95] text-[#10214f] mb-5">
                            {displayedFeaturedEvent.title}
                          </h3>

                          <p className="text-slate-700 leading-relaxed text-sm md:text-base mb-8">
                            {displayedFeaturedEvent.description ||
                              'Actividad destacada de nuestra comunidad educativa.'}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-[1.6rem] bg-white/70 border border-white/60 px-5 py-4">
                              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 mb-2">
                                Fecha
                              </div>
                              <div className="text-slate-800 font-black uppercase tracking-tight">
                                {formatLongDate(displayedFeaturedEvent.date)}
                              </div>
                            </div>

                            <div className="rounded-[1.6rem] bg-white/70 border border-white/60 px-5 py-4">
                              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 mb-2">
                                Tipo de actividad
                              </div>
                              <div className="text-slate-800 font-black uppercase tracking-tight">
                                {meta.label}
                              </div>
                            </div>
                          </div>

                          {selectedCalendarEvent && !isAdmin && (
                            <button
                              onClick={() => setSelectedCalendarEvent(null)}
                              className="mt-5 bg-[#10214f] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em]"
                            >
                              Volver al rotativo
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
              </div>

              <div className="xl:col-span-7">
                <div className="rounded-[2.4rem] border border-white/10 bg-white/8 backdrop-blur-md p-6 md:p-7 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <span className="text-yellow-300 text-[10px] font-black uppercase tracking-[0.35em] block mb-2">
                        Vista mensual
                      </span>
                      <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter capitalize">
                        {calendarMonthDate.toLocaleDateString('es-CL', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h3>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          setCalendarMonthDate(
                            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                          )
                        }
                        className="px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/15 transition-all"
                      >
                        Mes anterior
                      </button>
                      <button
                        onClick={() =>
                          setCalendarMonthDate(
                            (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                          )
                        }
                        className="px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/15 transition-all"
                      >
                        Mes siguiente
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                      <div
                        key={`${day}-${idx}`}
                        className="text-center text-white/55 text-[10px] font-black uppercase tracking-[0.28em] py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {monthCalendarDays.map((cell, idx) =>
                      cell ? (
                        <button
                          key={`${cell.day}-${idx}`}
                          type="button"
                          onClick={() => handleCalendarDayClick(cell)}
                          className={`min-h-[84px] rounded-2xl border p-2.5 transition-all text-left ${
                            cell.events.length
                              ? 'bg-white text-slate-900 border-white shadow-lg hover:scale-[1.02]'
                              : 'bg-white/5 text-white/80 border-white/8 hover:bg-white/10'
                          } ${
                            selectedCalendarDate === cell.date.toISOString().split('T')[0]
                              ? 'ring-2 ring-yellow-400'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-black ${
                                cell.events.length ? 'text-slate-900' : 'text-white/80'
                              }`}
                            >
                              {cell.day}
                            </span>
                            {cell.events.length > 0 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1a4731] text-white text-[10px] font-black">
                                {cell.events.length}
                              </span>
                            ) : isAdmin ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white text-[10px]">
                                <PlusCircle size={12} />
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2 space-y-1">
                            {cell.events.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className="rounded-xl px-2 py-1 text-[10px] font-black truncate border bg-blue-50 text-blue-700 border-blue-200"
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}

                            {cell.events.length === 0 && isAdmin && (
                              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">
                                Agregar
                              </div>
                            )}
                          </div>
                        </button>
                      ) : (
                        <div
                          key={`empty-${idx}`}
                          className="min-h-[84px] rounded-2xl bg-transparent"
                        />
                      )
                    )}
                  </div>

                  {isAdmin && (
                    <div className="mt-5 rounded-[1.5rem] bg-white/10 border border-white/10 px-5 py-4 text-white/80 text-sm">
                      Como administrador, puedes hacer click en cualquier día para crear,
                      editar o eliminar una actividad.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
{/* HISTORIA / IDENTIDAD PREMIUM */}
<section className="relative overflow-hidden bg-[#f5f7f6] py-24">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.95),transparent_34%)]" />
  <div className="absolute right-0 top-0 h-full w-[52%] bg-[#07351f] rounded-l-[7rem]" />
  <div className="absolute right-0 top-0 h-full w-[52%] bg-[radial-gradient(circle_at_35%_20%,rgba(250,204,21,0.16),transparent_28%)]" />
  <div className="absolute right-0 bottom-0 h-[55%] w-[52%] bg-[linear-gradient(to_top,rgba(0,0,0,0.30),transparent)]" />

  <div className="container mx-auto px-6 max-w-7xl relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
      
      {/* TEXTO */}
      <div className="lg:col-span-5">
        <div className="inline-flex items-center gap-2 bg-[#0b5a34] text-white rounded-full px-5 py-3 shadow-xl mb-8">
          <Sparkles size={15} className="text-yellow-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.32em]">
            Nuestra trayectoria
          </span>
        </div>

        <h2 className="text-5xl md:text-7xl font-black tracking-[-0.075em] leading-[0.82] text-slate-900 mb-8">
          Desde 1992
          <br />
          <span className="text-[#008037]">formando</span>
          <br />
          el futuro
        </h2>

        <div className="w-20 h-1.5 bg-yellow-400 rounded-full mb-8" />

        <p className="text-slate-600 text-lg leading-relaxed max-w-xl mb-10">
          Más de tres décadas entregando conocimiento, valores y oportunidades
          en un ambiente familiar, cercano y de excelencia académica.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="flex gap-3 items-start">
            <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <HeartPulse size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm leading-tight">
                Formación integral
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Personas íntegras
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm leading-tight">
                Comunidad unida
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Familias y colegio
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm leading-tight">
                Excelencia académica
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Aprender para la vida
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate?.('historia')}
          className="group bg-[#0b4a2d] text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.28em] shadow-2xl hover:bg-[#063820] hover:-translate-y-1 transition-all flex items-center gap-2 sm:gap-3"
        >
          Conocer nuestra historia
          <ArrowRight size={17} className="text-yellow-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* COLLAGE PREMIUM */}
      <div className="lg:col-span-7 relative min-h-[620px]">
        <div className="absolute -right-8 top-0 w-[78%] h-[500px] rounded-[4rem] bg-white/10 border border-white/10 backdrop-blur-sm" />

        <button
          onClick={() =>
            setSelectedGalleryImage(
              'https://www.colegioitalianosp.cl/Images/Antiguas/12347617_10153180093402231_6315904574571136235_n.jpg'
            )
          }
          className="group absolute left-0 top-8 w-[48%] h-[390px] bg-white p-4 rounded-[2.4rem] shadow-[0_35px_90px_rgba(0,0,0,0.25)] rotate-[-5deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-500"
        >
          <img
            src="https://www.colegioitalianosp.cl/Images/Antiguas/12347617_10153180093402231_6315904574571136235_n.jpg"
            alt="Historia Colegio Italiano San Pedro"
            className="w-full h-full object-cover rounded-[1.8rem] group-hover:scale-[1.03] transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
        </button>

        <button
          onClick={() =>
            setSelectedGalleryImage(
              'https://www.colegioitalianosp.cl/Images/Antiguas/504079807_24013264584970230_212165518267922505_n.jpg'
            )
          }
          className="group absolute right-0 top-24 w-[43%] h-[300px] bg-white p-4 rounded-[2.4rem] shadow-[0_35px_90px_rgba(0,0,0,0.25)] rotate-[7deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-500"
        >
          <img
            src="https://www.colegioitalianosp.cl/Images/Antiguas/504079807_24013264584970230_212165518267922505_n.jpg"
            alt="Vida escolar Colegio Italiano San Pedro"
            className="w-full h-full object-cover rounded-[1.8rem] group-hover:scale-[1.03] transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
        </button>

        <button
          onClick={() =>
            setSelectedGalleryImage(
              'https://www.colegioitalianosp.cl/Images/Slider/20230915_111455.jpg'
            )
          }
          className="group absolute left-[38%] bottom-24 w-56 h-56 bg-white p-3 rounded-full shadow-[0_35px_90px_rgba(0,0,0,0.28)] hover:scale-105 transition-all duration-500"
        >
          <img
            src="https://www.colegioitalianosp.cl/Images/Slider/20230915_111455.jpg"
            alt="Comunidad Colegio Italiano San Pedro"
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            decoding="async"
          />
        </button>

        <div className="absolute right-8 bottom-14 text-right max-w-xs">
          <p className="text-white text-3xl md:text-4xl font-serif italic leading-tight drop-shadow-xl">
            Nuestra historia
          </p>
          <p className="text-yellow-300 text-2xl md:text-3xl font-serif italic leading-tight mt-2 drop-shadow-xl">
            nos inspira a seguir construyendo futuro.
          </p>
          <div className="ml-auto mt-5 w-48 h-[3px] bg-yellow-300 rounded-full" />
        </div>

        <div className="absolute right-16 top-4 grid grid-cols-8 gap-2 opacity-40">
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          ))}
        </div>
      </div>
    </div>

    {/* TIMELINE */}
    <div className="mt-8 rounded-[2.4rem] bg-[#07351f] text-white shadow-[0_30px_90px_rgba(0,0,0,0.22)] border border-white/10 px-8 py-8 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-2 flex justify-center lg:justify-start">
          <div className="w-28 h-28 rounded-full border-4 border-yellow-300 bg-white shadow-2xl overflow-hidden flex items-center justify-center">
            <img
              src="https://www.colegioitalianosp.cl/Images/Logo/logo.png"
              alt="Colegio Italiano San Pedro"
              className="w-full h-full object-contain p-2"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-4 h-px bg-white/35" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {[
                ['1992', 'Nace nuestro colegio'],
                ['2000+', 'Creciendo juntos como comunidad'],
                ['2010+', 'Nuevos desafíos y más oportunidades'],
                ['2020+', 'Innovación y proyección'],
              ].map(([year, text], idx) => (
                <div key={year} className="text-center md:text-left">
                  <div
                    className={`mx-auto md:mx-0 w-8 h-8 rounded-full border-4 ${
                      idx === 0
                        ? 'bg-[#07351f] border-yellow-300 ring-4 ring-yellow-300/20'
                        : 'bg-white border-white'
                    }`}
                  />
                  <p className="mt-4 text-2xl font-black text-yellow-300 tracking-tight">
                    {year}
                  </p>
                  <p className="text-white/85 text-sm leading-snug mt-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-[1.8rem] border border-yellow-300/40 bg-yellow-300/10 p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-300 text-[#07351f] flex items-center justify-center shrink-0">
              <Users size={30} />
            </div>
            <div>
              <p className="text-4xl font-black text-yellow-300 leading-none">
                30+
              </p>
              <p className="text-white/85 text-sm font-bold leading-tight mt-1">
                años formando generaciones
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* BLOQUE PREMIUM */}
      <section className="py-28 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22)_0,_transparent_28%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.22)_0,_transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0,transparent_35%,rgba(255,255,255,0.03)_100%)]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="inline-block px-4 py-2 rounded-full bg-green-500/15 text-green-300 text-[10px] font-black uppercase tracking-[0.35em] mb-6 border border-green-400/20">
                Proyecto educativo
              </span>

              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-6">
                Formación con
                <br />
                <span className="text-green-400">visión de futuro</span>
              </h2>

              <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-2xl">
                Nuestro proyecto educativo combina excelencia académica, formación integral,
                convivencia escolar e inclusión, para acompañar a cada estudiante en su
                desarrollo personal y académico con identidad, valores y proyección.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate?.('pei')}
                  className="bg-yellow-400 text-slate-900 px-7 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all"
                >
                  Ver PEI
                </button>

                <button
                  onClick={() => onNavigate?.('sellos')}
                  className="bg-white/10 text-white border border-white/15 px-7 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white/15 transition-all"
                >
                  Conocer sellos
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/8 backdrop-blur-md rounded-[2rem] p-7 border border-white/10 shadow-2xl hover:-translate-y-2 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-green-400/15 text-green-300 flex items-center justify-center mb-5">
                  <BookOpen size={26} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                  Formación integral
                </h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  Potenciamos conocimientos, habilidades y valores para el desarrollo
                  completo de cada estudiante.
                </p>
              </div>

              <div className="bg-white/8 backdrop-blur-md rounded-[2rem] p-7 border border-white/10 shadow-2xl hover:-translate-y-2 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-blue-400/15 text-blue-300 flex items-center justify-center mb-5">
                  <Users size={26} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                  Inclusión y convivencia
                </h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  Creemos en una comunidad cercana, segura y respetuosa, donde todos
                  tengan un lugar.
                </p>
              </div>

              <div className="bg-white/8 backdrop-blur-md rounded-[2rem] p-7 border border-white/10 shadow-2xl hover:-translate-y-2 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-yellow-400/15 text-yellow-300 flex items-center justify-center mb-5">
                  <Lightbulb size={26} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                  Mirada de futuro
                </h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  Desarrollamos pensamiento crítico, autonomía y herramientas para enfrentar
                  nuevos desafíos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white text-slate-800 rounded-[2rem] p-7 shadow-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-green-700 font-black mb-2">
                Excelencia
              </p>
              <p className="leading-relaxed text-slate-600">
                Compromiso con aprendizajes de calidad y mejora continua.
              </p>
            </div>

            <div className="bg-white text-slate-800 rounded-[2rem] p-7 shadow-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-700 font-black mb-2">
                Identidad
              </p>
              <p className="leading-relaxed text-slate-600">
                Una propuesta formativa con historia, valores y sentido institucional.
              </p>
            </div>

            <div className="bg-white text-slate-800 rounded-[2rem] p-7 shadow-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-700 font-black mb-2">
                Proyección
              </p>
              <p className="leading-relaxed text-slate-600">
                Preparación para un mundo cambiante, con herramientas para aprender y
                convivir mejor.
              </p>
            </div>
          </div>
        </div>
      </section>
{/* YOUTUBE PRÓXIMAMENTE */}
<section className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
  <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
    
    {/* TEXTO */}
    <div>
      <span className="inline-block px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-md">
        Próximamente
      </span>

      <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter leading-[0.9] mb-6">
        Nuestro canal de YouTube
      </h2>

      <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">
        Muy pronto podrás revivir actividades, ceremonias, vida escolar y momentos importantes 
        de nuestra comunidad educativa a través de nuestro canal oficial.
      </p>

      <div className="flex flex-wrap gap-4">
        <button
          disabled
          className="bg-red-600/40 text-white px-7 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.25em] cursor-not-allowed"
        >
          Canal en preparación
        </button>

        <span className="text-slate-400 text-sm flex items-center">
          Lanzamiento próximo
        </span>
      </div>
    </div>

    {/* VIDEO MOCKUP */}
    <div className="relative">
      <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-200">
        
        <div className="aspect-video rounded-[2rem] overflow-hidden bg-slate-900 flex items-center justify-center relative">

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center px-6">
            
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-xl">
              <span className="text-2xl font-black">▶</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2">
              Próximamente
            </h3>

            <p className="text-white/80 text-sm max-w-xs">
              Estamos preparando contenido audiovisual para toda la comunidad.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200"
            alt="Preview YouTube"
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
            decoding="async"
          />
        </div>

      </div>

      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-500/20 blur-3xl rounded-full" />
    </div>

  </div>
</section>
      {/* EFEMÉRIDES ANTES DEL MAPA */}
      <section className="container mx-auto max-w-7xl px-4 mb-20">
        <div className="relative overflow-hidden rounded-[2.7rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.02),transparent_40%,rgba(15,23,42,0.03))]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            <div className="lg:col-span-4 relative overflow-hidden bg-slate-950 text-white p-8 md:p-10 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#13213d] to-[#0b1220]" />
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/90">
                  <CalendarDays size={14} />
                  Efeméride del día
                </span>

                <h2 className="mt-8 text-3xl md:text-[2.6rem] font-black uppercase tracking-tighter leading-[0.95]">
                  Hoy en nuestra comunidad
                </h2>

                <p className="mt-6 text-white/72 leading-relaxed text-sm md:text-base max-w-md">
                  Un espacio para recordar fechas significativas, fortalecer la identidad y
                  dar sentido formativo a cada jornada.
                </p>
              </div>

              <div className="relative z-10 mt-10">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/10 backdrop-blur-md p-5">
                  <span className="block text-[10px] uppercase tracking-[0.28em] font-black text-white/55 mb-2">
                    Fecha
                  </span>

                  <p className="text-lg md:text-xl font-bold capitalize text-white">
                    {todayFormatted}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white/80">
                      {efemerideHoy?.official
                        ? 'Conmemoración destacada'
                        : 'Reflexión institucional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-8 md:p-12 lg:p-14">
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center border shadow-lg shrink-0 bg-white ${efemerideColors.border} ${efemerideColors.text}`}
                >
                  {renderEfemerideIcon(efemerideHoy)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.28em] shadow-sm ${efemerideColors.badge}`}
                    >
                      {efemerideHoy?.badge || 'Efeméride'}
                    </span>

                    <span
                      className={`inline-flex items-center px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border ${efemerideColors.border} ${efemerideColors.text}`}
                    >
                      {efemerideHoy?.type || 'cultural'}
                    </span>
                  </div>

                  <h3
                    className={`text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95] mb-6 ${efemerideColors.text}`}
                  >
                    {efemerideHoy?.title || 'Efeméride del día'}
                  </h3>

                  <p className="text-slate-700 text-base md:text-xl leading-relaxed max-w-4xl">
                    {efemerideHoy?.description ||
                      'Cada día ofrece una oportunidad para aprender, reflexionar y fortalecer nuestra identidad como comunidad educativa.'}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6">
                  <span className="block text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 mb-3">
                    ¿Por qué lo recordamos?
                  </span>

                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                    Porque las efemérides no solo conmemoran hechos o fechas: también ayudan
                    a comprender nuestra historia, valorar la diversidad y fortalecer la
                    formación integral de la comunidad escolar.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="block text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 mb-3">
                    Sentido formativo
                  </span>

                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                    Esta fecha puede transformarse en una oportunidad para conversar,
                    reflexionar y conectar el aprendizaje con la vida cotidiana, la
                    ciudadanía y los valores que compartimos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[6px] w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500" />
        </div>
      </section>

      {/* MAPA */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl font-black uppercase text-slate-800 mb-12 tracking-tighter">
            Buscanos en René Schneider 206 San Pedro • Quillota
          </h2>

          <div className="bg-white p-4 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
            <iframe
              src="https://www.google.com/maps?q=Ren%C3%A9%20Schneider%20206%2C%20San%20Pedro%2C%20Quillota%2C%20Chile&z=16&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-[2rem]"
              title="Ubicación Colegio Italiano San Pedro"
            />
          </div>
        </div>
      </section>

      {/* CIERRE ADMISIÓN */}
      <section className="py-20 bg-gradient-to-r from-[#1a4731] to-green-700 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Sé parte de nuestra comunidad educativa
          </h2>
          <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Conoce nuestro proyecto institucional, nuestra propuesta formativa y el
            proceso de postulación para integrarte al Colegio Italiano San Pedro.
          </p>
         <button
  onClick={() =>
    window.open(
      'https://registropublicodigital.mineduc.gob.cl/rpd-app-registro-apoderado/login',
      '_blank',
      'noopener,noreferrer'
    )
  }
            className="bg-yellow-400 text-[#1a4731] px-8 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Inicia tu proceso de admisión
          </button>
        </div>
      </section>

      {/* MODAL CALENDARIO ADMIN */}
      {isCalendarModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[130] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">
                  {calendarForm.id ? 'Editar actividad' : 'Nueva actividad'}
                </h3>
                <p className="text-slate-500 text-sm mt-1">{calendarForm.date}</p>
              </div>

              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={calendarForm.title}
                  onChange={(e) =>
                    setCalendarForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Ej. Día del Carabinero"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">
                  Descripción
                </label>
                <textarea
                  value={calendarForm.description}
                  onChange={(e) =>
                    setCalendarForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Detalle de la actividad"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={calendarForm.date}
                    onChange={(e) =>
                      setCalendarForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">
                    Categoría
                  </label>
                  <select
                    value={calendarForm.category}
                    onChange={(e) =>
                      setCalendarForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="academic">Académico</option>
                    <option value="sports">Deportivo</option>
                    <option value="holiday">Celebración</option>
                    <option value="general">Institucional</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex flex-wrap justify-between gap-3">
              <div>
                {calendarForm.id && (
                  <button
                    onClick={handleDeleteCalendarEvent}
                    className="bg-red-100 text-red-700 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-red-200 transition-all"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSaveCalendarEvent}
                  className="bg-[#1a4731] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:brightness-110 transition-all flex items-center gap-2"
                >
                  {calendarForm.id ? <Pencil size={14} /> : <PlusCircle size={14} />}
                  Guardar actividad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GALERÍA */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[120] bg-black/85 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
              aria-label="Cerrar imagen"
            >
              <X size={22} />
            </button>

            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="w-full bg-slate-100 flex items-center justify-center max-h-[85vh] overflow-hidden">
                <img
                  src={selectedGalleryImage}
                  alt="Imagen ampliada"
                  className="max-w-full max-h-[85vh] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}