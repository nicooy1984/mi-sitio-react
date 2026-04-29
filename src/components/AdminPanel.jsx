import React, { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader";
import {
  Lock,
  Unlock,
  X,
  Trash2,
  Plus,
  Loader2,
  Newspaper,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Pencil
} from 'lucide-react';

import { db, auth, appId } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

const ADMIN_UID = 'O2Up6DMDPpbo501tqMooouPqUIx2';

export default function AdminPanel({ news = [], events = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  const [editingNewsId, setEditingNewsId] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    category: 'academic',
    description: ''
  });

  const notify = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
  };

  const resetNewsForm = () => {
    setNewsForm({
      title: '',
      content: '',
      imageUrl: ''
    });
    setEditingNewsId(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ADMIN_UID) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (cred.user.uid !== ADMIN_UID) {
        await signOut(auth);
        notify('error', 'Usuario no autorizado para este panel');
        setLoading(false);
        return;
      }

      setEmail('');
      setPassword('');
      notify('success', 'Sesión administrativa iniciada');
    } catch (error) {
      notify('error', 'Correo o contraseña incorrectos');
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      notify('success', 'Sesión cerrada correctamente');
    } catch (error) {
      notify('error', 'No se pudo cerrar la sesión');
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNewsId(newsItem.id);
    setNewsForm({
      title: newsItem.title || '',
      content: newsItem.content || '',
      imageUrl: newsItem.imageUrl || ''
    });
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();

    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      notify('error', 'Debes completar título y contenido');
      return;
    }

    setLoading(true);

    try {
      const finalImageUrl = newsForm.imageUrl.trim();

      if (editingNewsId) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'news', editingNewsId),
          {
            title: newsForm.title.trim(),
            content: newsForm.content.trim(),
            imageUrl: finalImageUrl,
            updatedAt: new Date().toISOString()
          }
        );

        notify('success', 'Noticia actualizada correctamente');
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'news'), {
          title: newsForm.title.trim(),
          content: newsForm.content.trim(),
          imageUrl: finalImageUrl,
          createdAt: new Date().toISOString(),
          date: new Date().toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        });

        notify('success', 'Noticia publicada correctamente');
      }

      resetNewsForm();
    } catch (err) {
      console.error(err);
      notify('error', editingNewsId ? 'Error al actualizar la noticia' : 'Error al publicar la noticia');
    }

    setLoading(false);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    if (!eventForm.title.trim() || !eventForm.date) {
      notify('error', 'Debes completar título y fecha');
      return;
    }

    setLoading(true);
    try {
      await addDoc(
        collection(db, 'artifacts', appId, 'public', 'data', 'calendar_events'),
        {
          title: eventForm.title.trim(),
          date: eventForm.date,
          category: eventForm.category,
          description: eventForm.description.trim(),
          createdAt: new Date().toISOString()
        }
      );

      setEventForm({
        title: '',
        date: '',
        category: 'academic',
        description: ''
      });

      notify('success', 'Evento añadido al calendario');
    } catch (err) {
      console.error(err);
      notify('error', 'Error al guardar el evento');
    }
    setLoading(false);
  };

  const handleRemoveItem = async (colName, id) => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas eliminar este elemento de forma permanente?'
      )
    ) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, id));

        if (colName === 'news' && editingNewsId === id) {
          resetNewsForm();
        }

        notify('success', 'Registro eliminado');
      } catch (err) {
        console.error(err);
        notify('error', 'No se pudo eliminar el registro');
      }
    }
  };

  const SHOW_LOGIN_WHEN_NOT_AUTHENTICATED = false;

  if (checkingAuth) return null;

  if (!isAuthenticated && !SHOW_LOGIN_WHEN_NOT_AUTHENTICATED) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all transform active:scale-95 ${
          isAuthenticated ? 'bg-green-600' : 'bg-slate-900'
        } hover:scale-110`}
      >
        {isOpen ? <X size={24} /> : isAuthenticated ? <Unlock size={24} /> : <Lock size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] md:w-[420px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
          {status.msg && (
            <div
              className={`mb-4 p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 animate-in zoom-in ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {status.msg}
            </div>
          )}

          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-6 py-8 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                <Lock size={36} />
              </div>

              <div>
                <h4 className="font-black text-slate-800 uppercase text-sm tracking-[0.2em] mb-1">
                  Acceso Administrativo
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Colegio Italiano San Pedro
                </p>
              </div>

              <input
                type="email"
                placeholder="Correo autorizado"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-center border-2 border-transparent focus:border-green-500 transition-all font-bold text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                autoFocus
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-center border-2 border-transparent focus:border-green-500 transition-all font-bold text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Verificar identidad'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                <button
                  onClick={() => setActiveTab('news')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'news'
                      ? 'bg-white shadow-sm text-slate-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Newspaper size={14} /> Noticias
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'events'
                      ? 'bg-white shadow-sm text-slate-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Calendar size={14} /> Calendario
                </button>
              </div>

              <div className="overflow-y-auto space-y-6 pr-2 custom-scrollbar flex-grow pb-4">
                {activeTab === 'news' ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {editingNewsId && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest">
                          Estás editando una noticia
                        </div>
                      )}

                      <div className="relative">
                        <FileText className="absolute left-4 top-4 text-slate-300" size={16} />
                        <input
                          type="text"
                          placeholder="Título de la noticia"
                          className="w-full pl-11 p-4 bg-slate-50 rounded-2xl text-xs outline-none border focus:border-green-500 font-bold text-slate-700"
                          value={newsForm.title}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, title: e.target.value })
                          }
                        />
                      </div>

                      <textarea
                        placeholder="Contenido detallado..."
                        className="w-full p-4 bg-slate-50 rounded-2xl text-xs h-36 outline-none border focus:border-green-500 resize-none font-medium text-slate-600 leading-relaxed"
                        value={newsForm.content}
                        onChange={(e) =>
                          setNewsForm({ ...newsForm, content: e.target.value })
                        }
                      />

                      <ImageUploader
                        label="Imagen de la noticia"
                        value={newsForm.imageUrl}
                        folder="noticias"
                        previewClassName="w-full h-40"
                        onChange={(url) =>
                          setNewsForm({ ...newsForm, imageUrl: url })
                        }
                      />

                      <button
                        onClick={handleSaveNews}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : editingNewsId ? (
                          <Pencil size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                        {loading
                          ? 'Guardando...'
                          : editingNewsId
                            ? 'Guardar cambios'
                            : 'Publicar noticia'}
                      </button>

                      {editingNewsId && (
                        <button
                          onClick={resetNewsForm}
                          type="button"
                          className="w-full bg-slate-200 text-slate-700 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-300 transition-all"
                        >
                          <X size={18} />
                          Cancelar edición
                        </button>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Gestión de publicaciones
                      </p>
                      <div className="space-y-3">
                        {news.map((n) => (
                          <div
                            key={n.id}
                            className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group"
                          >
                            <span className="truncate text-[10px] font-bold text-slate-700 uppercase pr-4">
                              {n.title}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditNews(n)}
                                className="text-slate-300 hover:text-blue-600 transition-colors p-1"
                                title="Editar noticia"
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                onClick={() => handleRemoveItem('news', n.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                title="Eliminar noticia"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Nombre del evento escolar"
                        className="w-full p-4 bg-slate-50 rounded-2xl text-xs outline-none border font-bold text-slate-700"
                        value={eventForm.title}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, title: e.target.value })
                        }
                      />

                      <div className="relative">
                        <Calendar className="absolute left-4 top-4 text-slate-300" size={16} />
                        <input
                          type="date"
                          className="w-full pl-11 p-4 bg-slate-50 rounded-2xl text-xs outline-none border font-bold text-slate-700"
                          value={eventForm.date}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, date: e.target.value })
                          }
                        />
                      </div>

                      <select
                        className="w-full p-4 bg-slate-50 rounded-2xl text-xs outline-none border font-black uppercase text-slate-500 cursor-pointer"
                        value={eventForm.category}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, category: e.target.value })
                        }
                      >
                        <option value="academic">📚 Académico</option>
                        <option value="sports">🏆 Deportes / Salud</option>
                        <option value="holiday">🎉 Efeméride / Feriado</option>
                      </select>

                      <textarea
                        placeholder="Descripción del evento (Opcional)"
                        className="w-full p-4 bg-slate-50 rounded-2xl text-xs h-28 outline-none border focus:border-blue-500 resize-none font-medium text-slate-600 leading-relaxed"
                        value={eventForm.description}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, description: e.target.value })
                        }
                      />

                      <button
                        onClick={handleSaveEvent}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                        Añadir al calendario
                      </button>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Eventos programados
                      </p>
                      <div className="space-y-3">
                        {events.map((ev) => (
                          <div
                            key={ev.id}
                            className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group"
                          >
                            <div className="flex flex-col truncate pr-4">
                              <span className="truncate text-[10px] font-bold text-slate-700 uppercase">
                                {ev.title}
                              </span>
                              <span className="text-[9px] text-slate-400 font-black">
                                {ev.date}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveItem('calendar_events', ev.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 pt-5 border-t border-slate-100 w-full text-[10px] font-black uppercase text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                Cerrar sesión segura
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}