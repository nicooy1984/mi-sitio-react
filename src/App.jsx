import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, X, Lock } from 'lucide-react';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

import Home from './pages/Home';
import Privacidad from './pages/Privacidad';
import Fundacion from './pages/Fundacion';
import Historia from './pages/Historia';
import MisionyVision from './pages/MisionyVision';
import Pei from './pages/Pei';
import AdminLoginPage from './pages/AdminLoginPage';
import Sellos from './pages/Sellos';
import Protocolos from './pages/Protocolos';
import Noticias from './pages/Noticias';
import Ubicacion from './pages/Ubicacion';
import Formulario from './pages/Formulario';
import Cursos from './pages/Cursos';
import CursoPage from './pages/CursoPage';
import Profesores from './pages/Profesores';
import SistemaBienios from './pages/SistemaBienios';
import SistemaLaboral from './pages/SistemaLaboral';
import Cisptema from './pages/Cisptema';

import { db, appId, auth } from './firebase/config';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getEfemeridesForYear } from './data/efemerides';

const ADMIN_UID = 'O2Up6DMDPpbo501tqMooouPqUIx2';

const routeMap = {
  '/': 'home',
  '/admin-login': 'admin-login',
  '/noticias': 'noticias',
  '/privacidad': 'privacidad',
  '/fundacion': 'fundacion',
  '/historia': 'historia',
  '/mision-y-vision': 'mision',
  '/pei': 'pei',
  '/sellos': 'sellos',
  '/protocolos': 'protocolos',
  '/ubicacion': 'ubicacion',
  '/formulario': 'formulario',
  '/cursos': 'cursos',
  '/profesores': 'profesores',

  '/cisptema': 'cisptema',
  '/sistema-bienios': 'sistema-bienios',
  '/sistema-laboral': 'sistema-laboral',

  '/prekinder': 'prekinder',
  '/kinder': 'kinder',
  '/primero': 'primero',
  '/segundo': 'segundo',
  '/tercero': 'tercero',
  '/cuarto': 'cuarto',
  '/quinto': 'quinto',
  '/sexto': 'sexto',
  '/septimo': 'septimo',
  '/octavo': 'octavo',
};

const viewToRouteMap = {
  home: '/',
  'admin-login': '/admin-login',
  noticias: '/noticias',
  privacidad: '/privacidad',
  fundacion: '/fundacion',
  historia: '/historia',
  mision: '/mision-y-vision',
  pei: '/pei',
  sellos: '/sellos',
  protocolos: '/protocolos',
  ubicacion: '/ubicacion',
  formulario: '/formulario',
  cursos: '/cursos',
  profesores: '/profesores',

  cisptema: '/cisptema',
  'sistema-bienios': '/sistema-bienios',
  'sistema-laboral': '/sistema-laboral',

  prekinder: '/prekinder',
  kinder: '/kinder',
  primero: '/primero',
  segundo: '/segundo',
  tercero: '/tercero',
  cuarto: '/cuarto',
  quinto: '/quinto',
  sexto: '/sexto',
  septimo: '/septimo',
  octavo: '/octavo',
};

const courseViewMap = {
  prekinder: 'preKinderTarde',
  kinder: 'kinderManana',
  primero: 'primero',
  segundo: 'segundo',
  tercero: 'tercero',
  cuarto: 'cuarto',
  quinto: 'quinto',
  sexto: 'sexto',
  septimo: 'septimo',
  octavo: 'octavo',
};

/**
 * Normaliza la ruta para evitar que React mande al Home cuando:
 * - viene con barra final: /cisptema/
 * - viene desde un subdirectorio: /mi-sitio-react/cisptema
 * - viene con mayúsculas accidentales.
 */
const normalizePath = (pathname = window.location.pathname) => {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (routeMap[cleanPath]) {
    return cleanPath;
  }

  const segments = cleanPath.split('/').filter(Boolean);
  const lastSegment =
    segments.length > 0 ? `/${segments[segments.length - 1]}` : '/';

  if (routeMap[lastSegment]) {
    return lastSegment;
  }

  return cleanPath;
};

const getViewFromPath = () => {
  const path = normalizePath();
  return routeMap[path] || 'home';
};

function AdminOnlyAccess({
  title = 'Sistema interno',
  description = 'Esta herramienta contiene información administrativa interna. Para ingresar debes iniciar sesión con una cuenta autorizada de administrador.',
}) {
  return (
    <div className="min-h-[70vh] bg-slate-100 px-4 py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-8 py-10 text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
            <Lock className="h-4 w-4" />
            Acceso restringido
          </div>

          <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>

          <p className="mt-3 max-w-2xl text-blue-50">{description}</p>
        </div>

        <div className="p-6 md:p-8">
          <AdminLoginPage />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState(getViewFromPath());
  const [selectedNews, setSelectedNews] = useState(null);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const dailyEfemerides = useMemo(() => {
    return getEfemeridesForYear(new Date().getFullYear());
  }, []);

  const mergedEvents = useMemo(() => {
    const manualEvents = Array.isArray(events) ? events : [];
    const allEvents = [...dailyEfemerides, ...manualEvents];

    allEvents.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    return allEvents;
  }, [events, dailyEfemerides]);

  const handleNavigation = (view) => {
    const newPath = viewToRouteMap[view] || '/';

    setCurrentView(view);
    setSelectedNews(null);

    window.history.pushState({ view }, '', newPath);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const view = getViewFromPath();
    setCurrentView(view);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      setAuthReady(false);

      if (!user) {
        setIsAdmin(false);
        setUserProfile(null);
        setAuthReady(true);
        return;
      }

      if (user.uid === ADMIN_UID) {
        setIsAdmin(true);
        setUserProfile({
          uid: user.uid,
          name: 'Administrador Principal',
          email: user.email || '',
          role: 'admin',
          assignedCourse: 'all',
          active: true,
          isPrimaryAdmin: true,
        });
        setAuthReady(true);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!isMounted) return;

        if (!userSnap.exists()) {
          setIsAdmin(false);
          setUserProfile(null);
          setAuthReady(true);
          return;
        }

        const firestoreUser = userSnap.data();

        const normalizedUser = {
          uid: user.uid,
          name: firestoreUser.name || '',
          email: firestoreUser.email || user.email || '',
          role: firestoreUser.role || '',
          assignedCourse: firestoreUser.assignedCourse || '',
          active: firestoreUser.active === true,
        };

        setUserProfile(normalizedUser);

        setIsAdmin(
          normalizedUser.active === true && normalizedUser.role === 'admin'
        );

        setAuthReady(true);
      } catch (error) {
        console.error('Error leyendo permisos de usuario:', error);
        setIsAdmin(false);
        setUserProfile(null);
        setAuthReady(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = normalizePath();
      const view = routeMap[path] || 'home';

      setCurrentView(view);
      setSelectedNews(null);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const unsubNews = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'news'),
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        data.sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        );

        setNews(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error cargando noticias:', error);
        setLoading(false);
      }
    );

    const unsubEvents = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'calendar_events'),
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        data.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        setEvents(data);
      },
      (error) => {
        console.error('Error cargando eventos:', error);
      }
    );

    return () => {
      unsubNews();
      unsubEvents();
    };
  }, []);

  const courseId = courseViewMap[currentView];

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar onNavigate={handleNavigation} userProfile={userProfile} />

      {selectedNews && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-white rounded-full p-2 transition"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              <div className="w-full bg-slate-100 flex items-center justify-center min-h-[260px] md:min-h-[420px]">
                <img
                  src={
                    selectedNews.imageUrl ||
                    selectedNews.image ||
                    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'
                  }
                  className="max-w-full max-h-[420px] object-contain"
                  alt="Noticia"
                />
              </div>

              <div className="p-6 md:p-10">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  {selectedNews.title}
                </h2>

                <div className="text-gray-700 leading-8 whitespace-pre-line">
                  {selectedNews.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {currentView === 'admin-login' ? (
          <AdminLoginPage />
        ) : currentView === 'cisptema' && !authReady ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : currentView === 'cisptema' && !isAdmin ? (
          <AdminOnlyAccess
            title="CISPTEMA"
            description="CISPTEMA es el Centro Interno de Sistemas y Procesos del Colegio Italiano San Pedro. Para ingresar debes iniciar sesión con una cuenta autorizada de administrador."
          />
        ) : currentView === 'cisptema' && isAdmin ? (
          <Cisptema userProfile={userProfile} onNavigate={handleNavigation} />
        ) : currentView === 'sistema-bienios' && !authReady ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : currentView === 'sistema-bienios' && !isAdmin ? (
          <AdminOnlyAccess
            title="Sistema de Bienios"
            description="Esta herramienta contiene información administrativa interna. Para ingresar debes iniciar sesión con una cuenta autorizada de administrador."
          />
        ) : currentView === 'sistema-bienios' && isAdmin ? (
          <SistemaBienios userProfile={userProfile} />
        ) : currentView === 'sistema-laboral' && !authReady ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : currentView === 'sistema-laboral' && !isAdmin ? (
          <AdminOnlyAccess
            title="Sistema Laboral Interno"
            description="Esta herramienta permite generar contratos, anexos y documentación laboral del establecimiento. Solo puede ser utilizada por el administrador autorizado."
          />
        ) : currentView === 'sistema-laboral' && isAdmin ? (
          <SistemaLaboral userProfile={userProfile} />
        ) : loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : currentView === 'home' ? (
          <Home
            news={news}
            events={mergedEvents}
            onNavigate={handleNavigation}
            onSelectNews={setSelectedNews}
            isAdmin={isAdmin}
          />
        ) : currentView === 'noticias' ? (
          <Noticias
            newsItems={news}
            setSelectedNews={setSelectedNews}
            setCurrentView={setCurrentView}
          />
        ) : currentView === 'privacidad' ? (
          <Privacidad />
        ) : currentView === 'fundacion' ? (
          <Fundacion />
        ) : currentView === 'historia' ? (
          <Historia />
        ) : currentView === 'mision' ? (
          <MisionyVision />
        ) : currentView === 'pei' ? (
          <Pei />
        ) : currentView === 'sellos' ? (
          <Sellos />
        ) : currentView === 'protocolos' ? (
          <Protocolos />
        ) : currentView === 'ubicacion' ? (
          <Ubicacion />
        ) : currentView === 'formulario' ? (
          <Formulario />
        ) : currentView === 'cursos' ? (
          <Cursos onNavigate={handleNavigation} />
        ) : currentView === 'profesores' ? (
          <Profesores userProfile={userProfile} />
        ) : courseId ? (
          <CursoPage courseId={courseId} userProfile={userProfile} />
        ) : (
          <Home
            news={news}
            events={mergedEvents}
            onNavigate={handleNavigation}
            onSelectNews={setSelectedNews}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {isAdmin && currentView !== 'admin-login' && (
        <AdminPanel news={news} events={events} />
      )}

      <Footer
        onNavigate={handleNavigation}
        userProfile={userProfile}
        isAdmin={isAdmin}
      />
    </div>
  );
}