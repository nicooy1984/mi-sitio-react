import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  HeartPulse,
  Users,
  School,
  Building2,
  Sparkles,
  CalendarDays,
  FolderOpen,
  CheckCircle2,
} from "lucide-react";

const palette = {
  primary: "#0F172A",
  primarySoft: "#1E293B",
  accent: "#2563EB",
  accentDeep: "#1D4ED8",
  accentSoft: "#DBEAFE",

  success: "#059669",
  successDeep: "#047857",
  successSoft: "#D1FAE5",

  danger: "#DC2626",
  dangerDeep: "#B91C1C",
  dangerSoft: "#FEE2E2",

  warning: "#D97706",
  warningSoft: "#FEF3C7",

  violet: "#7C3AED",
  violetSoft: "#EDE9FE",

  cyan: "#0891B2",
  cyanSoft: "#CFFAFE",

  slate: "#334155",
  text: "#1F2937",
  muted: "#6B7280",

  white: "#FFFFFF",
  border: "#E5E7EB",
  bg: "#F8FAFC",
  bgSoft: "#F1F5F9",
};

const protocolosPorCategoria = [
  {
    id: "convivencia",
    nombre: "Convivencia Escolar",
    descripcion:
      "Protocolos vinculados a la convivencia, resolución de conflictos, conducto regular y relaciones entre miembros de la comunidad educativa.",
    icon: Users,
    color: {
      bg: "linear-gradient(135deg, #DCFCE7 0%, #A7F3D0 100%)",
      badge: "#BBF7D0",
      text: "#047857",
      border: "#6EE7B7",
    },
    protocolos: [
      {
        titulo: "Protocolos de acción Convivencia Escolar",
        archivo: "/protocolos/protocolos-accion-convivencia-escolar.pdf",
      },
      {
        titulo: "Protocolo de acción Acoso o Violencia Escolar o Bullying",
        archivo: "/protocolos/acoso-violencia-escolar-bullying.pdf",
      },
      {
        titulo: "Protocolo de acción en caso de Ciberbullying",
        archivo: "/protocolos/ciberbullying.pdf",
      },
      {
        titulo:
          "Protocolo por faltas a la Convivencia Escolar por parte de los trabajadores del colegio",
        archivo: "/protocolos/faltas-convivencia-trabajadores.pdf",
      },
      {
        titulo: "Protocolo casos violencia o agresión de alumnos a funcionarios",
        archivo: "/protocolos/violencia-alumnos-a-funcionarios.pdf",
      },
      {
        titulo: "Protocolo de acción maltrato de un adulto a un estudiante",
        archivo: "/protocolos/maltrato-adulto-a-estudiante.pdf",
      },
      {
        titulo: "Protocolo maltrato entre adultos",
        archivo: "/protocolos/maltrato-entre-adultos.pdf",
      },
      {
        titulo:
          "Protocolo de acción frente a denuncias de padres y apoderados contra funcionarios del colegio",
        archivo: "/protocolos/denuncias-apoderados-contra-funcionarios.pdf",
      },
      {
        titulo: "Protocolo conducto regular Apoderado-Colegio",
        archivo: "/protocolos/conducto-regular-apoderado-colegio.pdf",
      },
      {
        titulo:
          "Protocolos actuación en clases virtuales Convivencia Escolar en caso que autoridad disponga volver a modalidad 2023",
        archivo: "/protocolos/clases-virtuales-convivencia-escolar.pdf",
      },
    ],
  },
  {
    id: "proteccion",
    nombre: "Protección de Estudiantes y Derechos",
    descripcion:
      "Protocolos orientados al resguardo integral de los estudiantes, la protección de derechos y el abordaje de situaciones sensibles.",
    icon: Sparkles,
    color: {
      bg: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
      badge: "#FECACA",
      text: "#B91C1C",
      border: "#FCA5A5",
    },
    protocolos: [
      {
        titulo:
          "Protocolo reconocimiento de identidad de género niños, niñas, estudiantes, gays, lesbianas, bisexuales y otros..",
        archivo: "/protocolos/reconocimiento-identidad-genero.pdf",
      },
      {
        titulo: "Protocolo de acción Maltrato infantil – Violencia Intrafamiliar",
        archivo: "/protocolos/maltrato-infantil-violencia-intrafamiliar.pdf",
      },
      {
        titulo:
          "Protocolo de acción en caso de vulneración de derechos a menores",
        archivo: "/protocolos/vulneracion-derechos-menores.pdf",
      },
      {
        titulo: "Protocolo ante casos de abuso o agresión sexual a un alumno",
        archivo: "/protocolos/abuso-agresion-sexual-alumno.pdf",
      },
      {
        titulo:
          "Protocolo de actuación en caso de alumnas embarazadas, madres y padres alumnos",
        archivo: "/protocolos/alumnas-embarazadas-madres-padres-alumnos.pdf",
      },
      {
        titulo:
          "Protocolo de acción frente al maltrato escolar de funcionario a un estudiante",
        archivo: "/protocolos/maltrato-funcionario-a-estudiante.pdf",
      },
      {
        titulo:
          "Protocolo de acción de Prevención del Suicidio, y otros trastornos de Salud Mental",
        archivo: "/protocolos/prevencion-suicidio-salud-mental.pdf",
      },
      {
        titulo:
          "Protocolo observación, respuesta y trabajo con estudiantes TEA y otros diagnósticos.",
        archivo: "/protocolos/estudiantes-tea-y-otros-diagnosticos.pdf",
      },
    ],
  },
  {
    id: "seguridad",
    nombre: "Seguridad y Emergencias",
    descripcion:
      "Documentos asociados a prevención, evacuación, gestión de riesgos, seguridad escolar y respuestas frente a emergencias.",
    icon: Shield,
    color: {
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
      badge: "#BFDBFE",
      text: "#1D4ED8",
      border: "#93C5FD",
    },
    protocolos: [
      {
        titulo:
          "PISE. PLAN INTEGRAL DE SEGURIDAD ESCOLAR Presentación, Comité Convivencia Escolar, roles",
        archivo: "/protocolos/pise-plan-integral-seguridad-escolar.pdf",
      },
      {
        titulo: "Protocolo ante accidente escolar",
        archivo: "/protocolos/accidente-escolar.pdf",
      },
      {
        titulo: "Protocolo en caso de incendio",
        archivo: "/protocolos/incendio.pdf",
      },
      {
        titulo: "Protocolo en caso de sismo",
        archivo: "/protocolos/sismo.pdf",
      },
      {
        titulo: "Protocolo general de evacuación del colegio",
        archivo: "/protocolos/evacuacion-general.pdf",
      },
      {
        titulo: "Protocolo en caso de fuga de gas",
        archivo: "/protocolos/fuga-de-gas.pdf",
      },
      {
        titulo: "Protocolo prevención accidentes y autocuidado",
        archivo: "/protocolos/prevencion-accidentes-autocuidado.pdf",
      },
      {
        titulo: "Ensayo PISE",
        archivo: "/protocolos/ensayo-pise.pdf",
      },
      {
        titulo: "Anexo Ficha evaluación de riesgo",
        archivo: "/protocolos/ficha-evaluacion-riesgo.pdf",
      },
      {
        titulo: "Protocolo de acción en caso de Robo o Hurto",
        archivo: "/protocolos/robo-o-hurto.pdf",
      },
      {
        titulo:
          "Protocolo de acción en caso de porte de arma blanca o de fuego por alumno",
        archivo: "/protocolos/porte-arma-blanca-o-fuego.pdf",
      },
      {
        titulo: "Protocolo ante el ingreso de terceros al recinto escolar",
        archivo: "/protocolos/ingreso-terceros-recinto-escolar.pdf",
      },
    ],
  },
  {
    id: "salud",
    nombre: "Salud y Medidas Sanitarias",
    descripcion:
      "Protocolos relacionados con salud escolar, prevención sanitaria, higiene, brotes epidemiológicos y funcionamiento preventivo.",
    icon: HeartPulse,
    color: {
      bg: "linear-gradient(135deg, #CCFBF1 0%, #A5F3FC 100%)",
      badge: "#A5F3FC",
      text: "#0F766E",
      border: "#67E8F9",
    },
    protocolos: [
      {
        titulo: "Protocolo Medidas Sanitarias",
        archivo: "/protocolos/medidas-sanitarias.pdf",
      },
      {
        titulo:
          "Protocolo vigilancia epidemiológica investigación de brotes",
        archivo: "/protocolos/vigilancia-epidemiologica-brotes.pdf",
      },
      {
        titulo: "Gestión de casos Covid, y otros virales",
        archivo: "/protocolos/gestion-casos-covid-y-virales.pdf",
      },
      {
        titulo: "Protocolo Higienización Colegio",
        archivo: "/protocolos/higienizacion-colegio.pdf",
      },
      {
        titulo: "Protocolo limpieza y desinfección",
        archivo: "/protocolos/limpieza-y-desinfeccion.pdf",
      },
      {
        titulo: "Protocolo limpieza dependencias",
        archivo: "/protocolos/limpieza-dependencias.pdf",
      },
      {
        titulo:
          "Protocolo funcionamiento general del Colegio en caso de Pandemia",
        archivo: "/protocolos/funcionamiento-general-pandemia.pdf",
      },
      {
        titulo:
          "Protocolo seguridad por apoderado por sospecha fiebre o enfermedad viral",
        archivo: "/protocolos/sospecha-fiebre-o-enfermedad-viral.pdf",
      },
      {
        titulo:
          "Protocolo sala de clases, para prevención contagio enfermedades virales",
        archivo: "/protocolos/sala-clases-prevencion-contagio.pdf",
      },
      {
        titulo: "Protocolo uso baños",
        archivo: "/protocolos/uso-banos.pdf",
      },
      {
        titulo: "Protocolo sala primeros auxilios",
        archivo: "/protocolos/sala-primeros-auxilios.pdf",
      },
      {
        titulo:
          "Protocolo inasistencias y recepción certificados médicos",
        archivo: "/protocolos/inasistencias-certificados-medicos.pdf",
      },
      {
        titulo: "Protocolo recreos",
        archivo: "/protocolos/recreos.pdf",
      },
      {
        titulo:
          "Protocolo ante enfermedades, accidentes, malestares comunes y sospecha de casos Covid",
        archivo: "/protocolos/enfermedades-accidentes-malestares-covid.pdf",
      },
    ],
  },
  {
    id: "apoderados",
    nombre: "Apoderados y Comunidad Educativa",
    descripcion:
      "Protocolos vinculados a la relación con apoderados, derechos parentales, retiro de documentos y comunicaciones institucionales.",
    icon: Building2,
    color: {
      bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
      badge: "#FDE68A",
      text: "#B45309",
      border: "#FCD34D",
    },
    protocolos: [
      {
        titulo:
          "Protocolo acción respecto de los Derechos de padres y madres que no tienen tuición de sus hijos",
        archivo: "/protocolos/derechos-padres-y-madres-sin-tuicion.pdf",
      },
      {
        titulo: "Protocolo para solicitud y retiro de documentos",
        archivo: "/protocolos/solicitud-y-retiro-de-documentos.pdf",
      },
      {
        titulo: "Protocolo conducto regular apoderado-colegio",
        archivo: "/protocolos/conducto-regular-apoderado-colegio-2.pdf",
      },
    ],
  },
  {
    id: "gestion",
    nombre: "Gestión Escolar y Funcionamiento",
    descripcion:
      "Protocolos sobre organización escolar, uso de espacios, asistencia, salidas, ceremonias y funcionamiento general del establecimiento.",
    icon: School,
    color: {
      bg: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)",
      badge: "#DDD6FE",
      text: "#6D28D9",
      border: "#C4B5FD",
    },
    protocolos: [
      {
        titulo:
          "Protocolo acción ante consumo porte o tráfico de Alcohol y Drogas",
        archivo: "/protocolos/alcohol-y-drogas.pdf",
      },
      {
        titulo: "Protocolo para actos ceremonias oficiales del colegio",
        archivo: "/protocolos/actos-y-ceremonias-oficiales.pdf",
      },
      {
        titulo: "Protocolo para salidas pedagógicas y otras salidas",
        archivo: "/protocolos/salidas-pedagogicas-y-otras-salidas.pdf",
      },
      {
        titulo:
          "Protocolo de ingreso o retiro de alumnos durante la jornada",
        archivo: "/protocolos/ingreso-o-retiro-alumnos-jornada.pdf",
      },
      {
        titulo: "Protocolo control ausentismo escolar",
        archivo: "/protocolos/control-ausentismo-escolar.pdf",
      },
      {
        titulo: "Protocolo de uso elementos tecnológicos",
        archivo: "/protocolos/uso-elementos-tecnologicos.pdf",
      },
      {
        titulo: "Protocolo de acción en celebraciones de Fiestas Patrias",
        archivo: "/protocolos/celebraciones-fiestas-patrias.pdf",
      },
      {
        titulo:
          "Protocolo de actuación frente a eventos catastróficos, pandemias, epidemias, desordenes civiles y otros.",
        archivo: "/protocolos/eventos-catastroficos-pandemias-epidemias.pdf",
      },
      {
        titulo: "Protocolo seguridad recepción y retiro de alumnos",
        archivo: "/protocolos/seguridad-recepcion-y-retiro-alumnos.pdf",
      },
      {
        titulo:
          "Protocolo seguridad ingreso de personal al establecimiento",
        archivo: "/protocolos/seguridad-ingreso-personal.pdf",
      },
      {
        titulo:
          "Protocolo seguridad recibo de materiales de proveedores o Mineduc",
        archivo: "/protocolos/seguridad-recibo-materiales.pdf",
      },
    ],
  },
];

function CategoryCard({ categoria, active, onClick }) {
  const Icon = categoria.icon;
  const total = categoria.protocolos.length;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[28px] border p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.14)]"
      style={{
        background: categoria.color.bg,
        borderColor: active ? categoria.color.text : categoria.color.border,
        boxShadow: active ? "0 18px 40px rgba(15,23,42,0.12)" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: "rgba(255,255,255,0.8)" }}
        >
          <Icon size={28} style={{ color: categoria.color.text }} />
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-extrabold"
          style={{
            background: "rgba(255,255,255,0.75)",
            color: categoria.color.text,
          }}
        >
          {total} protocolo{total !== 1 ? "s" : ""}
        </span>
      </div>

      <h3
        className="mt-5 text-xl font-black leading-tight"
        style={{ color: palette.primary }}
      >
        {categoria.nombre}
      </h3>

      <p className="mt-3 text-sm leading-6" style={{ color: palette.slate }}>
        {categoria.descripcion}
      </p>
    </button>
  );
}

function ProtocolRow({ titulo, archivo, categoriaNombre, colorText, colorSoft }) {
  return (
    <div
      className="rounded-2xl border p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
      style={{
        background: palette.white,
        borderColor: palette.border,
      }}
    >
      <div className="flex items-start gap-4 min-w-0">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: colorSoft }}
        >
          <FileText size={22} style={{ color: colorText }} />
        </div>

        <div className="min-w-0">
          <h4
            className="text-base md:text-lg font-extrabold leading-7"
            style={{ color: palette.primary }}
          >
            {titulo}
          </h4>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: palette.bgSoft,
                color: palette.primarySoft,
              }}
            >
              {categoriaNombre}
            </span>

            <span
              className="inline-flex items-center gap-1 text-xs font-medium"
              style={{ color: palette.muted }}
            >
              <CalendarDays size={14} />
              Documento institucional
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 shrink-0">
        <a
          href={archivo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${colorText} 0%, ${palette.primary} 100%)`,
            color: palette.white,
          }}
        >
          <Eye size={18} />
          Ver
        </a>

        <a
          href={archivo}
          download
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold border transition"
          style={{
            background: palette.white,
            color: palette.primary,
            borderColor: palette.border,
          }}
        >
          <Download size={18} />
          Descargar
        </a>
      </div>
    </div>
  );
}

function AccordionCategory({ categoria, isOpen, onToggle, busqueda }) {
  const Icon = categoria.icon;

  const protocolosFiltrados = categoria.protocolos.filter((p) =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (busqueda && protocolosFiltrados.length === 0) return null;

  return (
    <section
      className="rounded-[30px] border overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
      style={{
        background: palette.white,
        borderColor: categoria.color.border,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-6 md:p-7 text-left flex items-center justify-between gap-4"
        style={{
          background: categoria.color.bg,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: "rgba(255,255,255,0.78)" }}
          >
            <Icon size={28} style={{ color: categoria.color.text }} />
          </div>

          <div>
            <h3
              className="text-xl md:text-2xl font-black"
              style={{ color: palette.primary }}
            >
              {categoria.nombre}
            </h3>

            <p
              className="mt-2 text-sm md:text-base leading-7 max-w-3xl"
              style={{ color: palette.slate }}
            >
              {categoria.descripcion}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold"
                style={{
                  background: "rgba(255,255,255,0.78)",
                  color: categoria.color.text,
                }}
              >
                {protocolosFiltrados.length} resultado
                {protocolosFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(255,255,255,0.78)",
            color: palette.primary,
          }}
        >
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 md:p-6 space-y-4 bg-white">
          {protocolosFiltrados.map((protocolo, index) => (
            <ProtocolRow
              key={`${categoria.id}-${index}`}
              titulo={protocolo.titulo}
              archivo={protocolo.archivo}
              categoriaNombre={categoria.nombre}
              colorText={categoria.color.text}
              colorSoft={categoria.color.badge}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Protocolos() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [abiertas, setAbiertas] = useState(["convivencia"]);

  const totalProtocolos = protocolosPorCategoria.reduce(
    (acc, cat) => acc + cat.protocolos.length,
    0
  );

  const categoriasFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      if (!categoriaActiva) return protocolosPorCategoria;
      return protocolosPorCategoria.filter((c) => c.id === categoriaActiva);
    }

    return protocolosPorCategoria
      .map((categoria) => ({
        ...categoria,
        protocolos: categoria.protocolos.filter((p) =>
          p.titulo.toLowerCase().includes(busqueda.toLowerCase())
        ),
      }))
      .filter((categoria) => {
        if (categoriaActiva && categoria.id !== categoriaActiva) return false;
        return categoria.protocolos.length > 0;
      });
  }, [busqueda, categoriaActiva]);

  const totalResultados = categoriasFiltradas.reduce(
    (acc, cat) => acc + cat.protocolos.length,
    0
  );

  const toggleAccordion = (id) => {
    setAbiertas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const seleccionarCategoria = (id) => {
    setCategoriaActiva((prev) => (prev === id ? null : id));
    if (!abiertas.includes(id)) {
      setAbiertas((prev) => [...prev, id]);
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.white} 38%, ${palette.bgSoft} 100%)`,
      }}
    >
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1D4ED8 40%, #7C3AED 72%, #DC2626 100%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full opacity-20 blur-2xl"
          style={{
            background: "radial-gradient(circle, #67E8F9 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full opacity-20 blur-2xl"
          style={{
            background: "radial-gradient(circle, #86EFAC 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  color: palette.white,
                  borderColor: "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FolderOpen size={16} />
                Centro Documental del Establecimiento
              </div>

              <h1
                className="text-4xl md:text-6xl font-black leading-tight"
                style={{ color: palette.white }}
              >
                Protocolos{" "}
                <span style={{ color: "#FDE68A" }}>Institucionales</span>
              </h1>

              <p
                className="mt-5 text-lg leading-8 max-w-3xl"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Acceda a los protocolos oficiales del Colegio Italiano San Pedro,
                organizados por áreas para facilitar su consulta, revisión y
                descarga en una experiencia visual clara y moderna.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#categorias"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition hover:scale-[1.02]"
                  style={{
                    background: palette.white,
                    color: palette.primary,
                  }}
                >
                  Explorar protocolos
                </a>

                <div
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: palette.white,
                    borderColor: "rgba(255,255,255,0.22)",
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: "#FDE68A" }} />
                  Documentos oficiales descargables
                </div>
              </div>
            </div>

            <div
              className="rounded-[32px] p-6 md:p-7 border shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
              style={{
                background: "rgba(255,255,255,0.14)",
                borderColor: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded-2xl p-5 border"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    borderColor: "rgba(255,255,255,0.28)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
                    }}
                  >
                    <FileText size={24} style={{ color: palette.accentDeep }} />
                  </div>
                  <p
                    className="mt-4 text-3xl font-black"
                    style={{ color: palette.primary }}
                  >
                    {totalProtocolos}
                  </p>
                  <p className="text-sm mt-1" style={{ color: palette.muted }}>
                    Protocolos disponibles
                  </p>
                </div>

                <div
                  className="rounded-2xl p-5 border"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    borderColor: "rgba(255,255,255,0.28)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                    }}
                  >
                    <FolderOpen size={24} style={{ color: palette.danger }} />
                  </div>
                  <p
                    className="mt-4 text-3xl font-black"
                    style={{ color: palette.primary }}
                  >
                    {protocolosPorCategoria.length}
                  </p>
                  <p className="text-sm mt-1" style={{ color: palette.muted }}>
                    Áreas organizadas
                  </p>
                </div>

                <div
                  className="rounded-2xl p-5 col-span-2 border"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    borderColor: "rgba(255,255,255,0.28)",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: palette.violet }}
                  >
                    Información importante
                  </p>
                  <p
                    className="mt-2 text-[15px] leading-7"
                    style={{ color: palette.text }}
                  >
                    Esta sección reúne documentos institucionales vigentes,
                    organizados por categorías para facilitar el acceso de la
                    comunidad educativa y evitar una navegación desordenada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-14">
        <div
          className="rounded-[30px] p-6 md:p-8 border shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
          style={{
            background: palette.white,
            borderColor: palette.border,
          }}
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p
                className="text-sm font-bold tracking-[0.18em] uppercase"
                style={{ color: palette.accent }}
              >
                Búsqueda documental
              </p>
              <h2
                className="mt-2 text-3xl md:text-4xl font-black"
                style={{ color: palette.primary }}
              >
                Encuentra el protocolo que necesitas
              </h2>
              <p
                className="mt-3 max-w-3xl leading-7"
                style={{ color: palette.muted }}
              >
                Busca por palabras clave o selecciona una categoría para acotar
                los resultados.
              </p>
            </div>

            <div
              className="text-sm font-semibold"
              style={{ color: palette.primarySoft }}
            >
              {totalResultados} resultado{totalResultados !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-4 border shadow-sm"
              style={{
                background: palette.bg,
                borderColor: palette.border,
              }}
            >
              <Search size={20} style={{ color: palette.accent }} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar protocolo por nombre..."
                className="w-full bg-transparent outline-none text-[15px]"
                style={{ color: palette.text }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="categorias"
        className="max-w-7xl mx-auto px-6 pt-12 md:pt-14"
      >
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p
              className="text-sm font-bold tracking-[0.18em] uppercase"
              style={{ color: palette.violet }}
            >
              Organización por áreas
            </p>
            <h2
              className="mt-2 text-3xl md:text-4xl font-black"
              style={{ color: palette.primary }}
            >
              Categorías principales
            </h2>
          </div>

          {categoriaActiva && (
            <button
              onClick={() => setCategoriaActiva(null)}
              className="px-4 py-2 rounded-xl font-semibold border transition hover:shadow-sm"
              style={{
                background: palette.white,
                color: palette.primary,
                borderColor: palette.border,
              }}
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {protocolosPorCategoria.map((categoria) => (
            <CategoryCard
              key={categoria.id}
              categoria={categoria}
              active={categoriaActiva === categoria.id}
              onClick={() => seleccionarCategoria(categoria.id)}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="space-y-6">
          {categoriasFiltradas.length > 0 ? (
            categoriasFiltradas.map((categoria) => (
              <AccordionCategory
                key={categoria.id}
                categoria={categoria}
                busqueda={busqueda}
                isOpen={abiertas.includes(categoria.id) || !!busqueda}
                onToggle={() => toggleAccordion(categoria.id)}
              />
            ))
          ) : (
            <div
              className="rounded-[28px] border p-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
              style={{
                background: palette.white,
                borderColor: palette.border,
              }}
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%)",
                }}
              >
                <Search size={28} style={{ color: palette.violet }} />
              </div>

              <h3
                className="mt-5 text-2xl font-black"
                style={{ color: palette.primary }}
              >
                No se encontraron protocolos
              </h3>

              <p
                className="mt-3 max-w-xl mx-auto leading-7"
                style={{ color: palette.muted }}
              >
                Intenta con otra palabra o elimina el filtro de categoría para
                revisar más resultados.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}