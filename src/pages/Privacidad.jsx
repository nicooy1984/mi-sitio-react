import React from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function Privacidad({ onNavigate }) {
  return (
    <div className="bg-slate-50 min-h-screen py-24 px-6 font-sans">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 md:p-20 border border-slate-100 mb-12 relative overflow-hidden">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-400 hover:text-green-600 font-black uppercase text-[10px] tracking-widest mb-10 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al Inicio
          </button>

          <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-green-200">
            <ShieldCheck size={40} />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-6">
            Políticas de <br />
            <span className="text-green-600">Privacidad</span>
          </h1>

          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">
            Colegio Italiano San Pedro • Quillota
          </p>
        </div>

        <div className="space-y-8 pb-20">
          <section className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Compromiso Ético
              </h3>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium">
              En el Colegio Italiano San Pedro , la privacidad de nuestros alumnos y familias es prioritaria.
              Toda la información recolectada se utiliza exclusivamente para fines
              académicos y administrativos internos, bajo estrictos protocolos de seguridad.
              Colegio Italiano San Pedro 1992-2026 34 años con las familias de San Pedro 
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}