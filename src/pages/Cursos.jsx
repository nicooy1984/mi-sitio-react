import React from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

function CourseButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition-all duration-300 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
    >
      <span className="text-[1.02rem] font-semibold tracking-[0.01em] text-slate-800">
        {label}
      </span>

      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
        <ArrowRight size={16} />
      </span>
    </button>
  );
}

function CycleCard({
  accent = 'blue',
  icon,
  eyebrow,
  title,
  description,
  courses,
}) {
  const theme = {
    blue: {
      line: 'bg-blue-700',
      border: 'border-slate-200',
      bg: 'bg-white',
      iconWrap: 'bg-blue-700',
      glow: 'from-blue-50 to-white',
    },
    burgundy: {
      line: 'bg-rose-700',
      border: 'border-slate-200',
      bg: 'bg-white',
      iconWrap: 'bg-rose-700',
      glow: 'from-rose-50 to-white',
    },
    emerald: {
      line: 'bg-emerald-700',
      border: 'border-slate-200',
      bg: 'bg-white',
      iconWrap: 'bg-emerald-700',
      glow: 'from-emerald-50 to-white',
    },
  }[accent];

  return (
    <article
      className={`relative overflow-hidden rounded-[2rem] border ${theme.border} ${theme.bg} bg-gradient-to-b ${theme.glow} p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]`}
    >
      <div className={`absolute left-0 right-0 top-0 h-1.5 ${theme.line}`} />

      <div
        className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${theme.iconWrap} text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]`}
      >
        {icon}
      </div>

      <p className="mb-3 text-[0.78rem] font-bold uppercase tracking-[0.28em] text-slate-500">
        {eyebrow}
      </p>

      <h2 className="text-[2rem] font-black leading-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-5 text-[1rem] leading-8 text-slate-600">
        {description}
      </p>

      <div className="mt-8 space-y-3.5">
        {courses.map((course) => (
          <CourseButton
            key={course.label}
            label={course.label}
            onClick={course.onClick}
          />
        ))}
      </div>
    </article>
  );
}

export default function Cursos({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] pt-28 md:pt-32">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* HERO PRINCIPAL CON FOTO DE FONDO */}
        <section className="relative mb-12 overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
          {/* IMAGEN DE FONDO */}
          <img
            src="https://www.colegioitalianosp.cl/Images/El%20Colegio/Fundaci%C3%B3n/20260414_113105.jpg"
            alt="Colegio Italiano San Pedro"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* OVERLAY OSCURO DIFUMINADO */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#06152f]/95 via-[#0b1f46]/85 to-[#132d5c]/95 backdrop-blur-[2px]" />

          {/* LUCES SUAVES */}
          <div className="absolute inset-0">
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          {/* CONTENIDO */}
          <div className="relative px-8 py-14 text-white md:px-12 md:py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur">
                <Sparkles size={15} />
                Trayectoria académica por niveles
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.08] md:text-6xl">
                Conoce nuestros
                <span className="mt-2 block bg-gradient-to-r from-white via-slate-100 to-blue-100 bg-clip-text text-transparent">
                  cursos y ciclos formativos
                </span>
              </h1>

              <div className="mt-8 h-px w-28 bg-gradient-to-r from-white/80 to-transparent" />

              <p className="mt-8 max-w-3xl text-[1.05rem] leading-8 text-slate-200 md:text-lg">
                Explora el recorrido académico de nuestros estudiantes desde
                Educación Parvularia hasta Segundo Ciclo Básico. Cada nivel cuenta
                con un acceso individual para revisar su espacio correspondiente
                mediante el botón{' '}
                <span className="font-bold text-white">“Ver detalle”</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ENCABEZADO DE SECCIÓN */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-slate-500">
              Organización académica
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              Cursos organizados por ciclo
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Una estructura clara, ordenada y accesible para que las familias
            puedan ubicar rápidamente cada curso y acceder a su información
            específica.
          </p>
        </section>

        {/* GRID */}
        <section className="grid gap-8 xl:grid-cols-3">
          <CycleCard
            accent="blue"
            icon={<Sparkles size={24} />}
            eyebrow="PRIMEROS PASOS EN EL APRENDIZAJE"
            title="Educación Parvularia"
            description="Una etapa centrada en el juego, la exploración, la socialización y el desarrollo emocional de nuestros niños y niñas."
            courses={[
              {
                label: 'Pre-Kínder',
                onClick: () => onNavigate('prekinder'),
              },
              {
                label: 'Kínder',
                onClick: () => onNavigate('kinder'),
              },
            ]}
          />

          <CycleCard
            accent="burgundy"
            icon={<BookOpen size={24} />}
            eyebrow="BASES FUNDAMENTALES PARA APRENDER"
            title="Primer Ciclo Básico"
            description="Espacio formativo donde se fortalecen habilidades esenciales como la lectura, la escritura, el pensamiento lógico y la convivencia escolar."
            courses={[
              {
                label: '1° Básico',
                onClick: () => onNavigate('primero'),
              },
              {
                label: '2° Básico',
                onClick: () => onNavigate('segundo'),
              },
              {
                label: '3° Básico',
                onClick: () => onNavigate('tercero'),
              },
              {
                label: '4° Básico',
                onClick: () => onNavigate('cuarto'),
              },
            ]}
          />

          <CycleCard
            accent="emerald"
            icon={<GraduationCap size={24} />}
            eyebrow="CONSOLIDACIÓN, AUTONOMÍA Y PROYECCIÓN"
            title="Segundo Ciclo Básico"
            description="Etapa orientada al desarrollo del pensamiento crítico, la autonomía, la responsabilidad y la profundización de los aprendizajes."
            courses={[
              {
                label: '5° Básico',
                onClick: () => onNavigate('quinto'),
              },
              {
                label: '6° Básico',
                onClick: () => onNavigate('sexto'),
              },
              {
                label: '7° Básico',
                onClick: () => onNavigate('septimo'),
              },
              {
                label: '8° Básico',
                onClick: () => onNavigate('octavo'),
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}