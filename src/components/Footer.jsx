import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Users,
  LockKeyhole,
  Calculator,
} from 'lucide-react';

/**
 * COMPONENTE FOOTER MODULAR - ACTUALIZADO
 * Se ha corregido el horario a 08:00 - 19:00.
 * Se mantiene link a Privacidad.
 * Se agrega acceso interno al Sistema de Bienios.
 */

const FacebookIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer({ onNavigate }) {
  const goTo = (view) => {
    if (typeof onNavigate === 'function') {
      onNavigate(view);
    }
  };

  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-20 pb-10 relative overflow-hidden font-sans mt-auto">
      <div className="absolute top-0 left-0 w-full h-1.5 flex">
        <div className="flex-1 bg-green-600"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-red-600"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl border border-slate-200">
                <img
                  src="https://colegioitalianosp.cl/Images/257178_185047934885229_23267_o.jpg"
                  alt="Escudo CISP"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-left">
                <h2 className="text-2xl font-black text-white leading-none tracking-tighter italic">
                  CISP
                </h2>
                <p className="text-[10px] font-black uppercase text-green-500 tracking-widest mt-1">
                  Quillota
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
              Formando estudiantes integrales con excelencia académica y valores
              sólidos en Quillota desde 1992.
            </p>

            <div className="flex space-x-4 pt-2 justify-center md:justify-start">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-lg"
                aria-label="Facebook Colegio Italiano San Pedro"
              >
                <FacebookIcon size={18} />
              </a>

              <a
                href="https://www.instagram.com/citalianosp"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 transition-all shadow-lg"
                aria-label="Instagram Colegio Italiano San Pedro"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-white font-black text-sm mb-8 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start">
              <span className="w-8 h-px bg-green-600 mr-3"></span>
              Secciones
            </h3>

            <ul className="space-y-4">
              {[
                { label: 'Historia', id: 'historia' },
                { label: 'Admisión', id: 'admision' },
                { label: 'Noticias', id: 'noticias' },
                { label: 'Privacidad', id: 'privacidad' },
                { label: 'Contacto', id: 'contacto' },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => goTo(link.id)}
                    className="text-xs font-black uppercase tracking-widest hover:text-white hover:translate-x-2 transition-all flex items-center group mx-auto md:mx-0"
                  >
                    <ChevronRight
                      size={12}
                      className="mr-2 text-green-600 group-hover:text-red-500 transition-colors"
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-white font-black text-sm mb-8 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start">
              <span className="w-8 h-px bg-red-600 mr-3"></span>
              Información
            </h3>

            <ul className="space-y-5 text-xs font-bold text-slate-400">
              <li className="flex flex-col md:flex-row items-center md:items-start group gap-3">
                <MapPin size={18} className="text-green-500 shrink-0" />
                <div className="text-center md:text-left">
                  <span className="block text-white mb-1 uppercase tracking-widest text-[9px]">
                    Dirección
                  </span>
                  René Schneider 206, Quillota.
                </div>
              </li>

              <li className="flex flex-col md:flex-row items-center md:items-start group gap-3">
                <Phone size={18} className="text-green-500 shrink-0" />
                <div className="text-center md:text-left">
                  <span className="block text-white mb-1 uppercase tracking-widest text-[9px]">
                    Teléfono
                  </span>
                  +56 33 2329331
                </div>
              </li>

              <li className="flex flex-col md:flex-row items-center md:items-start group gap-3">
                <Mail size={18} className="text-green-500 shrink-0" />
                <div className="text-center md:text-left">
                  <span className="block text-white mb-1 uppercase tracking-widest text-[9px]">
                    Email
                  </span>
                  citalianosp@gmail.com
                </div>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-white font-black text-sm mb-8 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start">
              <span className="w-8 h-px bg-blue-600 mr-3"></span>
              Portales
            </h3>

            <div className="flex flex-col gap-3 max-w-[240px] mx-auto md:mx-0">
              <a
                href="https://www.myschool.cl"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 p-4 rounded-xl flex items-center group hover:bg-slate-700 transition-all border border-slate-700"
              >
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                  <Users
                    size={20}
                    className="text-green-500 group-hover:text-white"
                  />
                </div>

                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  MySchool
                </span>
              </a>

              <button
                type="button"
                onClick={() => goTo('sistema-bienios')}
                className="relative overflow-hidden bg-slate-900 p-4 rounded-xl flex items-center group hover:bg-blue-950 transition-all border border-blue-900/60 text-left shadow-lg shadow-blue-950/20"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-500 via-white to-red-500 opacity-80"></div>

                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors">
                  <Calculator
                    size={20}
                    className="text-blue-300 group-hover:text-white"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-black text-white uppercase tracking-widest">
                    Sistema Bienios
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-100">
                    <LockKeyhole size={11} />
                    Acceso interno
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
            <span>
              © {new Date().getFullYear()} Diseño Colegio Italiano San Pedro
              2026
            </span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="text-green-600 italic">
              Tradición y Excelencia
            </span>
          </div>

          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500 items-center bg-slate-800/50 px-5 py-2.5 rounded-full border border-slate-700/50">
            <Clock size={14} className="text-green-600" />
            Horario: 08:00 - 19:00
          </div>
        </div>
      </div>
    </footer>
  );
}