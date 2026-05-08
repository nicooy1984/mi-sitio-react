import React, { useState } from 'react';
import {
  FileText,
  Users,
  Calculator,
  BriefcaseBusiness,
  ClipboardSignature,
  Archive,
  LockKeyhole,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Clock3,
  ArrowLeft,
} from 'lucide-react';

import AnexosDocentes from '../components/cisptema/AnexosDocentes';

export default function Cisptema({ userProfile, onNavigate }) {
  const isAdmin = userProfile?.role === 'admin';
  const [moduloInternoActivo, setModuloInternoActivo] = useState(null);

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <section className="max-w-xl w-full rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-xl p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 border border-red-400/30">
            <LockKeyhole className="h-8 w-8 text-red-200" />
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Acceso restringido
          </h1>

          <p className="mt-4 text-slate-300 leading-relaxed">
            CISPTEMA es una plataforma interna de gestión administrativa.
            Solo usuarios autorizados pueden ingresar a esta sección.
          </p>

          <button
            onClick={() => onNavigate?.('home')}
            className="mt-8 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 shadow-lg hover:bg-slate-100 transition"
          >
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  const modules = [
    {
      title: 'Base de Trabajadores',
      description:
        'Registro central de docentes y asistentes de la educación. Desde aquí se podrá generar documentación e historial.',
      icon: Users,
      color: 'from-blue-600 to-cyan-500',
      status: 'Próximamente',
      key: 'trabajadores',
      target: null,
      internalModule: null,
    },
    {
      title: 'Contratos Docentes',
      description:
        'Generación de contratos docentes institucionales en formato Word, con historial por trabajador.',
      icon: FileText,
      color: 'from-indigo-600 to-blue-500',
      status: 'Disponible',
      key: 'contratos-docentes',
      target: 'sistema-laboral',
      internalModule: null,
    },
    {
      title: 'Contratos Asistentes',
      description:
        'Módulo para crear contratos de asistentes de la educación con formato institucional imprimible.',
      icon: BriefcaseBusiness,
      color: 'from-emerald-600 to-teal-500',
      status: 'Próximamente',
      key: 'contratos-asistentes',
      target: null,
      internalModule: null,
    },
    {
      title: 'Anexos Docentes',
      description:
        'Creación de anexos de contrato para docentes, modificación de horas, funciones, financiamiento General/SEP y condiciones contractuales.',
      icon: ClipboardSignature,
      color: 'from-violet-600 to-fuchsia-500',
      status: 'Disponible',
      key: 'anexos-docentes',
      target: null,
      internalModule: 'anexos-docentes',
    },
    {
      title: 'Anexos Asistentes',
      description:
        'Generación de anexos contractuales para asistentes de la educación, listos para imprimir y archivar.',
      icon: ClipboardSignature,
      color: 'from-orange-500 to-amber-500',
      status: 'Próximamente',
      key: 'anexos-asistentes',
      target: null,
      internalModule: null,
    },
    {
      title: 'Cálculo de Bienios',
      description:
        'Sistema para calcular períodos laborales, bienios cumplidos, meses adicionales e informes oficiales.',
      icon: Calculator,
      color: 'from-red-600 to-rose-500',
      status: 'Disponible',
      key: 'bienios',
      target: 'sistema-bienios',
      internalModule: null,
    },
    {
      title: 'Historial Documental',
      description:
        'Archivo interno de contratos, anexos, informes y documentos generados para cada trabajador.',
      icon: Archive,
      color: 'from-slate-700 to-slate-500',
      status: 'Próximamente',
      key: 'historial',
      target: null,
      internalModule: null,
    },
  ];

  const handleModuleClick = (module) => {
    if (module.internalModule) {
      setModuloInternoActivo(module.internalModule);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!module.target) return;

    if (typeof onNavigate === 'function') {
      onNavigate(module.target);
      return;
    }

    const fallbackRoutes = {
      'sistema-bienios': '/sistema-bienios',
      'sistema-laboral': '/sistema-laboral',
    };

    window.location.href = fallbackRoutes[module.target] || '/cisptema';
  };

  if (moduloInternoActivo === 'anexos-docentes') {
    return (
      <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                CISPTEMA
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                Anexos Docentes
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Módulo interno para generar anexos asociados al contrato principal del trabajador.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setModuloInternoActivo(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a CISPTEMA
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <AnexosDocentes />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.25),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Plataforma interna administrativa
          </div>

          <div className="mt-8 max-w-4xl">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              CISPTEMA
            </h1>

            <p className="mt-5 text-xl font-semibold text-blue-100">
              Centro Interno de Sistemas y Procesos del Colegio Italiano San Pedro
            </p>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Herramientas internas para gestión laboral, contractual,
              documental y administrativa. Desde este panel se centralizan los
              sistemas actuales y las próximas funciones institucionales.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <ShieldCheck className="mb-3 h-7 w-7 text-green-300" />
              <p className="text-sm font-black uppercase tracking-widest text-white">
                Acceso seguro
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Panel visible solo para administrador autorizado.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <FileText className="mb-3 h-7 w-7 text-blue-300" />
              <p className="text-sm font-black uppercase tracking-widest text-white">
                Documentos internos
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Contratos, anexos, informes y futuros módulos laborales.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur sm:col-span-2 lg:col-span-1">
              <Clock3 className="mb-3 h-7 w-7 text-amber-300" />
              <p className="text-sm font-black uppercase tracking-widest text-white">
                Sistema escalable
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Preparado para agregar nuevas herramientas sin desordenar el sitio.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Panel principal
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Módulos del sistema
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
              Selecciona una herramienta interna. Los módulos disponibles ya
              pueden abrirse desde este panel.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 px-5 py-4 text-sm font-bold text-slate-700">
            Usuario administrador activo
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            const isAvailable = Boolean(module.target || module.internalModule);

            return (
              <button
                key={module.key}
                type="button"
                onClick={() => handleModuleClick(module)}
                disabled={!isAvailable}
                className={`group text-left rounded-[2rem] border bg-white p-6 shadow-sm transition duration-300 ${
                  isAvailable
                    ? 'border-slate-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer'
                    : 'border-slate-200 opacity-75 cursor-not-allowed'
                }`}
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${module.color} text-white shadow-lg`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black text-slate-950">
                    {module.title}
                  </h3>

                  <ChevronRight
                    className={`mt-1 h-5 w-5 transition ${
                      isAvailable
                        ? 'text-slate-300 group-hover:translate-x-1 group-hover:text-blue-600'
                        : 'text-slate-200'
                    }`}
                  />
                </div>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                  {module.description}
                </p>

                <div
                  className={`mt-6 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                    isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {module.status}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}