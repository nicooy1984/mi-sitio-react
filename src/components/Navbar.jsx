import React, { useState, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  LogOut,
  UserRound,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const currentAge = new Date().getFullYear() - 1992;

const sitemapData = [
  {
    title: 'El Colegio',
    id: 'el_colegio',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    subItems: [
      { label: 'La Fundación', id: 'fundacion' },
      { label: 'Historia', id: 'historia' },
      { label: 'Misión y Visión', id: 'mision' },
      { label: 'PEI', id: 'pei' },
      { label: 'Sellos Institucionales', id: 'sellos' },
    ],
  },
  {
    title: 'Equipo',
    id: 'equipo',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    subItems: [
      { label: 'Profesores', id: 'profesores' },
    ],
  },
  {
    title: 'Vida Escolar',
    id: 'vida_escolar',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    subItems: [
      { label: 'Actividades', id: 'actividades' },
      { label: 'Noticias', id: 'noticias' },
    ],
  },
  {
    title: 'Info Académica',
    id: 'info_academica',
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    subItems: [
      { label: 'Cursos', id: 'cursos' },
      { label: 'Horarios', id: 'horarios' },
    ],
  },
  {
    title: 'Protocolos',
    id: 'protocolos_menu',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    subItems: [{ label: 'Protocolos Colegio', id: 'protocolos' }],
  },
  {
    title: 'Contacto',
    id: 'contacto',
    color: 'bg-blue-900',
    hoverColor: 'hover:bg-slate-800',
    subItems: [
      { label: 'Ubicación', id: 'ubicacion' },
      { label: 'Formulario', id: 'formulario' },
    ],
  },
];

export default function Navbar({ onNavigate, userProfile = null }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const closeTimeout = useRef(null);

  const handleNavClick = (viewId) => {
    onNavigate(viewId);
    setIsMenuOpen(false);
    setMobileOpenDropdown(null);
    setActiveDropdown(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      setMobileOpenDropdown(null);
      setActiveDropdown(null);
      handleNavClick('home');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleMouseEnter = (idx) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveDropdown(idx);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleParentClickDesktop = (item, idx) => {
    if (item.subItems && item.subItems.length > 0) {
      setActiveDropdown(activeDropdown === idx ? null : idx);
      return;
    }
    handleNavClick(item.id);
  };

  const handleParentClickMobile = (idx, item) => {
    if (item.subItems && item.subItems.length > 0) {
      setMobileOpenDropdown(mobileOpenDropdown === idx ? null : idx);
      return;
    }
    handleNavClick(item.id);
  };

  return (
    <>
      <style>{`
        @keyframes drawSignatureLine {
          from { stroke-dashoffset: 260; }
          to { stroke-dashoffset: 0; }
        }

        .signature-line {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: drawSignatureLine 1.8s ease forwards;
        }
      `}</style>

      <header className="fixed top-0 w-full z-50 bg-white shadow-lg font-sans">
        <div className="bg-[#1a4731] text-white text-[10px] md:text-xs py-2 hidden md:block border-b border-green-800">
          <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
            <div className="flex space-x-6 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-green-300" /> +56 33 2329331
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-green-300" /> citalianosp@gmail.com
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {!userProfile ? (
                <button
                  onClick={() => handleNavClick('admin-login')}
                  className="bg-slate-900 text-white px-5 py-1.5 rounded-full font-black text-[10px] uppercase hover:bg-slate-700 transition-all shadow-sm border border-slate-700"
                >
                  Ingreso funcionarios
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5">
                    <UserRound size={14} className="text-green-200" />
                    <span className="font-black text-[10px] uppercase tracking-widest">
                      {userProfile.name || 'Usuario'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-5 py-1.5 rounded-full font-black text-[10px] uppercase hover:bg-red-700 transition-all shadow-sm border border-red-500 flex items-center gap-2"
                  >
                    <LogOut size={13} />
                    Cerrar sesión
                  </button>
                </>
              )}

              <a
                href="https://www.myschool.cl"
                target="_blank"
                rel="noreferrer"
                className="bg-white text-[#1a4731] px-5 py-1.5 rounded-full font-black text-[10px] uppercase hover:bg-slate-100 transition-all shadow-sm"
              >
                MySchool
              </a>

              <a
                href="https://colegioitalianosp.cl:2083/"
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 text-white px-5 py-1.5 rounded-full font-black text-[10px] uppercase hover:bg-red-700 transition-all shadow-sm border border-red-500"
              >
                Correo institucional
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl h-20 md:h-24 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white border border-slate-100 rounded-xl p-1 shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="https://colegioitalianosp.cl/Images/257178_185047934885229_23267_o.jpg"
                className="h-full object-contain"
                alt="Logo Colegio Italiano San Pedro"
              />
            </div>

            <div className="flex flex-col">
              <div className="hidden sm:block mb-2">
                <div className="relative w-fit">
                  <span className="block text-emerald-700 text-[14px] md:text-[16px] font-semibold italic tracking-wide">
                    {currentAge} años formando personas
                  </span>

                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-emerald-600"
                    viewBox="0 0 260 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      className="signature-line"
                      d="M3 11C38 3 72 15 108 9C145 3 180 5 219 10C236 12 249 9 257 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <span className="font-black text-slate-800 text-xl md:text-2xl lg:text-3xl leading-none uppercase tracking-tighter">
                COLEGIO ITALIANO
              </span>

              <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-[0.4em] uppercase mt-1">
                SAN PEDRO
              </span>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-2">
            {sitemapData.map((item, idx) => (
              <div
                key={idx}
                className="relative pb-3"
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleParentClickDesktop(item, idx)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase text-white ${item.color} ${item.hoverColor} shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95`}
                >
                  {item.title}
                  {item.subItems && item.subItems.length > 0 && (
                    <ChevronDown
                      size={14}
                      className={`opacity-60 transition-transform duration-300 ${
                        activeDropdown === idx ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {item.subItems &&
                  item.subItems.length > 0 &&
                  activeDropdown === idx && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white shadow-2xl rounded-2xl mt-1 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className={`h-1.5 w-full ${item.color}`}></div>

                      <div className="p-2">
                        {item.subItems.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleNavClick(sub.id)}
                            className="group w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                          >
                            {sub.label}
                            <ChevronRight
                              size={12}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 transition-all"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-3 bg-slate-50 text-slate-800 rounded-2xl border border-slate-200"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] xl:hidden">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            ></div>

            <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <span className="font-black text-slate-800 text-sm tracking-widest uppercase">
                  Navegación CISP
                </span>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-white shadow-sm rounded-full text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mx-4 mt-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-900/10">
                <div className="relative w-fit mx-auto">
                  <span className="block text-emerald-700 text-[18px] font-semibold italic tracking-wide">
                    {currentAge} años formando personas
                  </span>

                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-emerald-600"
                    viewBox="0 0 260 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      className="signature-line"
                      d="M3 11C38 3 72 15 108 9C145 3 180 5 219 10C236 12 249 9 257 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {userProfile && (
                <div className="mx-4 mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                    Sesión activa
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a4731] text-white">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <p className="font-black text-slate-800 text-sm">
                        {userProfile.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {userProfile.role === 'admin'
                          ? 'Administrador'
                          : userProfile.assignedCourse
                          ? `Curso: ${userProfile.assignedCourse}`
                          : 'Gestión'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {sitemapData.map((item, idx) => (
                  <div key={idx} className="overflow-hidden rounded-2xl shadow-sm">
                    <button
                      onClick={() => handleParentClickMobile(idx, item)}
                      className={`w-full flex items-center justify-between p-5 transition-all duration-300 text-white font-black uppercase tracking-widest text-xs ${item.color} ${item.hoverColor} ${
                        mobileOpenDropdown === idx ? 'ring-4 ring-black/10' : ''
                      }`}
                    >
                      <span>{item.title}</span>

                      {item.subItems && item.subItems.length > 0 ? (
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            mobileOpenDropdown === idx
                              ? 'rotate-180 text-white'
                              : 'text-white/60'
                          }`}
                        />
                      ) : (
                        <ChevronRight size={18} className="text-white/70" />
                      )}
                    </button>

                    {item.subItems &&
                      item.subItems.length > 0 &&
                      mobileOpenDropdown === idx && (
                        <div className="bg-slate-50 p-3 space-y-1 animate-in slide-in-from-top duration-300">
                          {item.subItems.map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleNavClick(sub.id)}
                              className="w-full text-left p-4 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-white flex justify-between items-center transition-all"
                            >
                              {sub.label}
                              <ChevronRight size={14} className="opacity-30" />
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t bg-slate-50 flex flex-col gap-3">
                {!userProfile ? (
                  <button
                    onClick={() => handleNavClick('admin-login')}
                    className="bg-slate-900 text-white p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    Ingreso funcionarios
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="bg-slate-900 text-white p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                )}

                <a
                  href="https://www.myschool.cl"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#1a4731] text-white p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  MySchool
                </a>

                <a
                  href="https://colegioitalianosp.cl:2083/"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-red-600 text-white p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Correo institucional
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}