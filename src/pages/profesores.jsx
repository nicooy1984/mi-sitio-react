import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import {
  Pencil,
  Trash2,
  Plus,
  X,
  UserRound,
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ArrowUp,
  LayoutGrid,
  ShieldCheck,
  UsersRound,
  BookOpenCheck,
  Upload,
  Loader2,
  Mail,
  Phone,
  Star,
} from 'lucide-react';

const LEVELS = [
  'Equipo Directivo',
  'Apoyo Profesional',
  'Pre Kínder',
  'Kínder',
  '1° Básico',
  '2° Básico',
  '3° Básico',
  '4° Básico',
  '5° Básico',
  '6° Básico',
  '7° Básico',
  '8° Básico',
];

const levelOrder = LEVELS.reduce((acc, level, index) => {
  acc[level] = index;
  return acc;
}, {});

const emptyForm = {
  nombre: '',
  cargo: '',
  nivel: 'Equipo Directivo',
  resena: '',
  fotoUrl: '',
  correo: '',
  telefono: '',
};

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function Notification({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4200);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-4 rounded-3xl border border-white/30 px-7 py-4 shadow-[0_24px_70px_rgba(15,23,42,0.22)] backdrop-blur-2xl ${
        isSuccess ? 'bg-emerald-500/95 text-white' : 'bg-rose-500/95 text-white'
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
        {isSuccess ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}
      </div>
      <span className="text-sm font-black tracking-tight">{message}</span>
    </div>
  );
}

function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const imageRef = ref(storage, `profesores/${Date.now()}-${safeName}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      onChange(url);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('No se pudo subir la imagen. Revisa Storage o los permisos de Firebase.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
        Fotografía institucional
      </label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex h-56 w-full cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/80 transition-all hover:border-blue-500 hover:bg-blue-50/50"
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Vista previa"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-slate-900 shadow-xl">
                <Upload size={15} /> Cambiar imagen
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <div className="rounded-full bg-white p-5 shadow-sm">
              {uploading ? <Loader2 size={30} className="animate-spin" /> : <ImageIcon size={30} />}
            </div>
            <span className="text-xs font-black uppercase tracking-widest">
              {uploading ? 'Subiendo imagen...' : 'Subir fotografía'}
            </span>
          </div>
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}

function LevelIcon({ level }) {
  if (level === 'Equipo Directivo') return <ShieldCheck size={34} strokeWidth={1.5} />;
  if (level === 'Apoyo Profesional') return <UsersRound size={34} strokeWidth={1.5} />;
  if (level.includes('Básico')) return <BookOpenCheck size={34} strokeWidth={1.5} />;
  return <GraduationCap size={34} strokeWidth={1.5} />;
}

export default function Profesores({ userProfile }) {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isAdmin = userProfile?.role === 'admin' || userProfile?.isAdmin === true;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'profesores'),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setProfesores(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error al cargar profesores:', error);
        setLoading(false);
        showNotify('Error al cargar el equipo docente', 'error');
      }
    );

    const handleScroll = () => setShowScrollTop(window.scrollY > 520);
    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const filteredAndGrouped = useMemo(() => {
    const term = normalizeText(searchQuery);

    const filtered = profesores.filter((profesor) => {
      const text = normalizeText(
        `${profesor.nombre || ''} ${profesor.cargo || ''} ${profesor.nivel || ''} ${profesor.resena || ''}`
      );
      return text.includes(term);
    });

    const sorted = [...filtered].sort((a, b) => {
      const orderA = levelOrder[a.nivel] ?? 999;
      const orderB = levelOrder[b.nivel] ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es');
    });

    return LEVELS.map((level) => ({
      level,
      items: sorted.filter((profesor) => profesor.nivel === level),
    })).filter((group) => group.items.length > 0);
  }, [profesores, searchQuery]);

  const totalDocentes = profesores.length;
  const totalCursos = new Set(
    profesores
      .map((p) => p.nivel)
      .filter((nivel) => nivel && nivel !== 'Equipo Directivo' && nivel !== 'Apoyo Profesional')
  ).size;

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      showNotify('El nombre es obligatorio', 'error');
      return;
    }

    try {
      const data = {
        nombre: form.nombre.trim(),
        cargo: form.cargo.trim(),
        nivel: form.nivel,
        resena: form.resena.trim(),
        fotoUrl: form.fotoUrl || '',
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editing) {
        await updateDoc(doc(db, 'profesores', editing.id), data);
        showNotify('Perfil actualizado con éxito');
      } else {
        await addDoc(collection(db, 'profesores'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        showNotify('Nuevo integrante registrado');
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      console.error('Error al guardar:', error);
      showNotify('No se pudo completar la acción', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este integrante del equipo docente?')) return;

    try {
      await deleteDoc(doc(db, 'profesores', id));
      showNotify('Registro eliminado');
    } catch (error) {
      console.error('Error al eliminar:', error);
      showNotify('Error al eliminar el registro', 'error');
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (profesor) => {
    setEditing(profesor);
    setForm({ ...emptyForm, ...profesor });
    setModalOpen(true);
  };

  const scrollToSection = (level) => {
    const el = document.getElementById(`nivel-${level.replaceAll(' ', '-').replaceAll('°', '')}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 122;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9fc] font-sans text-slate-900 selection:bg-blue-700 selection:text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <header className="relative isolate overflow-hidden bg-slate-950 pb-36 pt-28 text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,#1d4ed8,transparent_35%),radial-gradient(circle_at_80%_20%,#16a34a,transparent_28%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f7f9fc] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-blue-200 backdrop-blur-md">
                <Sparkles size={14} className="text-emerald-300" />
                Colegio Italiano San Pedro
              </div>

              <h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
                Nuestro <span className="bg-gradient-to-b from-white via-white to-white/35 bg-clip-text text-transparent">equipo</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 sm:text-2xl">
                Profesionales comprometidos con una educación cercana, exigente y profundamente humana, acompañando a nuestros estudiantes desde Pre-Kínder hasta 8° Básico.
              </p>

              <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-3xl font-black tracking-tighter">{totalDocentes}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Integrantes</p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-3xl font-black tracking-tighter">{totalCursos}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Niveles</p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-3xl font-black tracking-tighter">1992</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Trayectoria</p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={openCreate}
                className="group relative flex items-center gap-4 overflow-hidden rounded-[2rem] bg-white px-9 py-5 text-sm font-black text-slate-950 shadow-[0_24px_80px_rgba(255,255,255,0.12)] transition-all hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-emerald-50 transition-transform duration-500 group-hover:translate-x-full" />
                <Plus size={20} className="relative z-10" />
                <span className="relative z-10">Añadir integrante</span>
              </button>
            )}
          </div>

          <div className="mt-14 flex max-w-2xl items-center gap-4 rounded-[2.3rem] border border-white/10 bg-white/10 p-3 backdrop-blur-2xl ring-1 ring-white/10 transition-all focus-within:ring-blue-400/60">
            <Search size={22} className="ml-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, cargo o curso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-4 text-base font-bold text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 -mt-8 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 overflow-x-auto rounded-[2.3rem] border border-slate-200/70 bg-white/80 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="flex shrink-0 items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
              <LayoutGrid size={17} />
              <span className="text-[10px] font-black uppercase tracking-widest">Niveles</span>
            </div>

            {filteredAndGrouped.map((group) => (
              <button
                key={group.level}
                onClick={() => scrollToSection(group.level)}
                className="shrink-0 rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-950 hover:text-white active:scale-95"
              >
                {group.level}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-[4/5] animate-pulse rounded-[3rem] bg-slate-100" />
            ))}
          </div>
        ) : filteredAndGrouped.length > 0 ? (
          <div className="space-y-28">
            {filteredAndGrouped.map((group) => (
              <section
                key={group.level}
                id={`nivel-${group.level.replaceAll(' ', '-').replaceAll('°', '')}`}
                className="scroll-mt-32"
              >
                <div className="mb-12 flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
                      <LevelIcon level={group.level} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-slate-950 sm:text-5xl">{group.level}</h2>
                      <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-blue-700">
                        {group.items.length} {group.items.length === 1 ? 'integrante' : 'integrantes'}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm ring-1 ring-slate-200">
                    <Star size={15} className="text-amber-500" /> Formación integral
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((profesor) => (
                    <article
                      key={profesor.id}
                      className="group relative flex flex-col overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_90px_rgba(15,23,42,0.13)]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-100 to-slate-50">
                        {profesor.fotoUrl ? (
                          <img
                            src={profesor.fotoUrl}
                            alt={profesor.nombre}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-300">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-inner">
                              {profesor.nombre ? (
                                <span className="text-4xl font-black text-slate-400">{getInitials(profesor.nombre)}</span>
                              ) : (
                                <UserRound size={80} strokeWidth={1} />
                              )}
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/28 to-transparent opacity-85 transition-opacity group-hover:opacity-95" />

                        <div className="absolute left-7 right-7 top-7 flex justify-between gap-3">
                          <span className="rounded-full bg-white/95 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-950 shadow-xl backdrop-blur-md">
                            {profesor.nivel || 'Equipo'}
                          </span>
                        </div>

                        <div className="absolute bottom-8 left-7 right-7 transition-transform duration-500 group-hover:-translate-y-1">
                          <span className="mb-4 inline-block rounded-full bg-blue-700/95 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                            {profesor.cargo || 'Docente'}
                          </span>
                          <h3 className="text-3xl font-black leading-none tracking-tighter text-white">
                            {profesor.nombre}
                          </h3>
                        </div>

                        {isAdmin && (
                          <div className="absolute right-6 top-20 flex flex-col gap-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:translate-x-4">
                            <button
                              onClick={() => openEdit(profesor)}
                              className="rounded-full bg-white/95 p-4 text-slate-900 shadow-2xl backdrop-blur-md transition hover:bg-blue-700 hover:text-white active:scale-90"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(profesor.id)}
                              className="rounded-full bg-white/95 p-4 text-rose-600 shadow-2xl backdrop-blur-md transition hover:bg-rose-600 hover:text-white active:scale-90"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-7">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="h-px w-8 bg-blue-200" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                            Perfil institucional
                          </span>
                        </div>

                        <p className="line-clamp-4 text-sm font-medium leading-relaxed text-slate-500">
                          {profesor.resena ||
                            'Profesional comprometido con el aprendizaje, el acompañamiento y la formación integral de nuestros estudiantes.'}
                        </p>

                        {(profesor.correo || profesor.telefono) && (
                          <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                            {profesor.correo && (
                              <a
                                href={`mailto:${profesor.correo}`}
                                className="flex items-center gap-3 text-xs font-bold text-slate-500 transition hover:text-blue-700"
                              >
                                <Mail size={15} /> {profesor.correo}
                              </a>
                            )}
                            {profesor.telefono && (
                              <a
                                href={`tel:${profesor.telefono}`}
                                className="flex items-center gap-3 text-xs font-bold text-slate-500 transition hover:text-blue-700"
                              >
                                <Phone size={15} /> {profesor.telefono}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-slate-200 bg-white py-28 text-center shadow-sm">
            <div className="mb-8 rounded-full bg-slate-50 p-10 text-slate-200 shadow-inner">
              <Search size={74} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-slate-950">Sin resultados</h3>
            <p className="mx-auto mt-4 max-w-sm font-medium text-slate-500">
              No encontramos integrantes que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-9 text-sm font-black uppercase tracking-widest text-blue-700 underline-offset-8 hover:underline"
            >
              Reiniciar búsqueda
            </button>
          </div>
        )}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xl" onClick={() => setModalOpen(false)} />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_50px_120px_rgba(0,0,0,0.32)]">
            <div className="bg-slate-950 px-8 py-7 text-white sm:px-10 sm:py-8">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter">
                    {editing ? 'Editar integrante' : 'Nuevo integrante'}
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Equipo Colegio Italiano San Pedro
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full bg-white/10 p-3 transition hover:bg-rose-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="max-h-[68vh] space-y-8 overflow-y-auto p-8 sm:p-10">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ej. María José González"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Cargo o función</label>
                  <input
                    type="text"
                    placeholder="Ej. Profesora Jefe"
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Nivel</label>
                  <select
                    value={form.nivel}
                    onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    {LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Correo</label>
                  <input
                    type="email"
                    placeholder="correo@colegioitalianosp.cl"
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Teléfono</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Reseña profesional</label>
                <textarea
                  rows={4}
                  placeholder="Breve descripción del rol, experiencia o sello profesional..."
                  value={form.resena}
                  onChange={(e) => setForm({ ...form, resena: e.target.value })}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <ImageUploader value={form.fotoUrl} onChange={(url) => setForm({ ...form, fotoUrl: url })} />
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-8 sm:p-10">
              <button
                onClick={handleSave}
                className="w-full rounded-2xl bg-blue-700 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-500/20 transition-all hover:bg-slate-950 active:scale-[0.98]"
              >
                {editing ? 'Confirmar actualización' : 'Registrar integrante'}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex h-15 w-15 items-center justify-center rounded-full bg-slate-950 p-5 text-white shadow-[0_20px_45px_rgba(0,0,0,0.25)] transition-all hover:scale-110 active:scale-90"
        >
          <ArrowUp size={22} />
        </button>
      )}
    </div>
  );
}
