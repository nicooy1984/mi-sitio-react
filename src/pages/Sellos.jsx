import React, { useState } from 'react';
import {
  Heart,
  Users,
  Leaf,
  Lightbulb,
  BookOpen,
  Star,
  X
} from 'lucide-react';

const seals = [
  {
    icon: Heart,
    title: 'Formación Valórica y Desarrollo Humano',
    text: 'Promovemos una educación centrada en el respeto, la responsabilidad, la empatía y la formación integral de nuestros estudiantes.',
    accent: 'from-rose-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Comunidad Educativa Participativa',
    text: 'Creemos en una comunidad donde familias, estudiantes y equipo educativo construyen juntos un ambiente de compromiso y colaboración.',
    accent: 'from-sky-500 to-blue-600'
  },
  {
    icon: Leaf,
    title: 'Conciencia Ecológica',
    text: 'Fomentamos el cuidado del entorno y la valoración del medio ambiente como parte esencial de una formación responsable.',
    accent: 'from-emerald-500 to-green-600'
  },
  {
    icon: Lightbulb,
    title: 'Espíritu Emprendedor y Creativo',
    text: 'Impulsamos la curiosidad, la iniciativa, la creatividad y el pensamiento crítico para enfrentar los desafíos del presente y del futuro.',
    accent: 'from-amber-400 to-orange-500'
  },
  {
    icon: BookOpen,
    title: 'Educación Inclusiva y de Calidad',
    text: 'Reconocemos la diversidad como una riqueza y promovemos oportunidades de aprendizaje significativas para todos.',
    accent: 'from-violet-500 to-purple-600'
  },
  {
    icon: Star,
    title: 'Formación para la Vida y la Felicidad',
    text: 'Buscamos que cada estudiante desarrolle herramientas para construir una vida plena, con sentido, valores y proyección.',
    accent: 'from-cyan-500 to-teal-500'
  }
];

const galleryItems = [
  {
    image: '/images/sellos/aula.jpg',
    title: 'Aprender con sentido',
    subtitle: 'Educación inclusiva y de calidad'
  },
  {
    image: '/images/sellos/comunidad.jpg',
    title: 'Crecer en comunidad',
    subtitle: 'Participación y compromiso'
  },
  {
    image: '/images/sellos/deporte.jpg',
    title: 'Vida activa y saludable',
    subtitle: 'Formación integral'
  },
  {
    image: '/images/sellos/medioambiente.jpg',
    title: 'Cuidar nuestro entorno',
    subtitle: 'Conciencia ecológica'
  },
  {
    image: '/images/sellos/acto.jpg',
    title: 'Vivir nuestros valores',
    subtitle: 'Identidad institucional'
  },
  {
    image: '/images/sellos/convivencia.jpg',
    title: 'Convivir con respeto',
    subtitle: 'Desarrollo humano'
  }
];

export default function Sellos() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (item) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-slate-950 text-white overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[78vh] flex items-center px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="uppercase tracking-[0.35em] text-cyan-300 text-sm font-bold mb-5">
              El Colegio
            </p>

            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Sellos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Institucionales
              </span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed">
              Son la expresión viva de nuestra identidad. En ellos se refleja la manera
              en que entendemos la educación: como un proceso de formación humana,
              crecimiento personal y compromiso con la comunidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                Formación integral
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                Comunidad
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                Inclusión
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                Conciencia ecológica
              </span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              {seals.slice(0, 4).map((seal, index) => {
                const Icon = seal.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${seal.accent} flex items-center justify-center mb-4`}
                    >
                      <Icon size={22} />
                    </div>
                    <p className="text-sm font-bold">{seal.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-6 py-24 bg-white text-slate-900">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-sm font-bold text-blue-600 mb-4">
            Nuestra identidad
          </p>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Una educación que busca dejar huella
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            En el Colegio Italiano San Pedro, cada sello representa una convicción
            profunda. No son solo principios escritos: son ideas que orientan nuestras
            decisiones, nuestras prácticas pedagógicas y la forma en que acompañamos
            a nuestros estudiantes en su crecimiento.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {seals.map((seal, index) => {
            const Icon = seal.icon;
            return (
              <article
                key={index}
                className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${seal.accent}`} />

                <div className="p-8">
                  <div
                    className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${seal.accent} text-white flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={30} />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                    {seal.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-base">
                    {seal.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* GALERÍA */}
      <section className="px-6 py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="uppercase tracking-[0.3em] text-sm font-bold text-blue-600 mb-4">
              Nuestra comunidad
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
              Así vivimos nuestros sellos
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Cada sello institucional se expresa en la vida diaria del colegio: en el aula,
              en los patios, en las actividades y en cada experiencia compartida por nuestra comunidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openImage(item)}
                className="group relative overflow-hidden rounded-[2rem] h-[320px] shadow-xl text-left focus:outline-none focus:ring-4 focus:ring-cyan-400/40"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-cyan-300 text-sm font-bold uppercase tracking-widest mb-2">
                    {item.subtitle}
                  </p>
                  <h3 className="text-white text-2xl font-black leading-tight">
                    {item.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FRASE */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-2xl md:text-4xl font-black leading-tight text-white">
            “Educar no es solo enseñar contenidos,
            <span className="block text-cyan-300 mt-2">
              es formar personas para la vida.”
            </span>
          </blockquote>
        </div>
      </section>

      {/* CIERRE */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-sm font-bold text-cyan-300 mb-4">
            Compromiso institucional
          </p>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Educar con sentido,
            <span className="block text-cyan-300">formar para la vida</span>
          </h2>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
            Nuestros sellos institucionales resumen aquello que queremos proyectar
            en cada niño y niña que forma parte de nuestra comunidad: una educación
            humana, cercana, exigente y profundamente comprometida con el desarrollo
            integral de cada estudiante.
          </p>
        </div>
      </section>

      {/* MODAL IMAGEN */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeImage}
              className="absolute -top-4 -right-4 md:top-4 md:right-4 z-10 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
            >
              <X size={24} />
            </button>

            <div className="overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl border border-white/10">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[75vh] object-cover"
              />

              <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800">
                <p className="text-cyan-300 text-sm font-bold uppercase tracking-[0.25em] mb-2">
                  {selectedImage.subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  {selectedImage.title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}