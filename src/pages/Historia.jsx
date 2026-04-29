import React from 'react';
import { Award, Calendar, Users, BookOpen, Star, Building, GraduationCap, History, Heart, Laptop, TrendingUp, MapPin, Sun, Sparkles } from 'lucide-react';

const Historia = () => {
  // Paleta de colores para cada hito para dar variedad y alegría
  const hitoStyles = [
    { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', accent: 'bg-yellow-400', icon: <Users className="text-yellow-600" /> },
    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-500', icon: <Calendar className="text-green-600" /> },
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500', icon: <Building className="text-blue-600" /> },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-500', icon: <BookOpen className="text-purple-600" /> },
    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'bg-orange-500', icon: <Award className="text-orange-600" /> },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', accent: 'bg-cyan-500', icon: <Laptop className="text-cyan-600" /> },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500', icon: <Star className="text-emerald-600" /> },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', accent: 'bg-rose-500', icon: <Heart className="text-rose-600" /> },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-yellow-200 selection:text-yellow-900 overflow-x-hidden">
      
      {/* Elementos decorativos de fondo para todo el sitio */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-20 w-80 h-80 bg-green-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section - Compacta y Alegre */}
      <section className="bg-slate-900 pt-16 pb-12 md:pt-24 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/20260414_135102.jpg" 
            className="w-full h-full object-cover" 
            alt="Fondo Historia Institucional" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4731]/95 via-slate-900/90 to-blue-900/50"></div>
        
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
              <span className="relative p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 text-yellow-400 flex items-center justify-center">
                <History size={28} />
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white text-center uppercase tracking-tighter leading-none mb-6">
            Nuestra Historia: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-400 drop-shadow-sm">
              Un sueño que creció con la comunidad
            </span>
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-slate-200 text-lg md:text-xl text-center leading-relaxed font-medium italic">
              "Hay historias que nacen en oficinas… y otras que nacen en la calle, en la conversación sencilla, en la preocupación genuina."
            </p>
          </div>
        </div>
      </section>

      {/* Cuerpo de la Historia */}
      <article className="py-16 relative z-10">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* 1. Los Orígenes (Amarillo - Energía) */}
          <section className={`${hitoStyles[0].bg} border-2 ${hitoStyles[0].border} p-8 md:p-12 rounded-[2.5rem] mb-20 shadow-xl shadow-yellow-100/50 relative overflow-hidden group`}>
            <div className="absolute top-4 right-4 text-yellow-200 rotate-12 group-hover:rotate-0 transition-transform">
              <Sun size={64} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-yellow-600 first-letter:mr-3 first-letter:float-left">
                  La historia del Colegio Italiano San Pedro es de esas que nacen de la preocupación genuina de quienes quieren algo mejor para sus hijos. Corrían los primeros años de la década de los 90 cuando un grupo de vecinos de la población Enrique Arenas comenzó a hacerse una pregunta profunda: <strong>¿Dónde educamos a nuestros niños?</strong>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Las alternativas eran escasas. Por ello buscaron a don Julio Inocencio Alvear. La propuesta era clara, pero desafiante: volver a darle vida a un espacio que había quedado en silencio tras el cierre de la antigua escuela F-176 en 1987.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-2 bg-yellow-400/20 rounded-3xl -rotate-1"></div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/20260414_134742.jpg" className="w-full h-full object-cover" alt="Origen" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs font-bold uppercase tracking-widest text-yellow-700 flex items-center gap-2">
                    <MapPin size={14} /> El terreno del nuevo comienzo
                  </div>
                </div>
              </div>

              <div className="bg-white/60 p-6 rounded-2xl border-l-4 border-yellow-400 italic font-medium text-slate-700">
                "Hubo trabajo, esfuerzo y compromiso. Hubo que limpiar, reparar, reconstruir y, sobre todo, creer."
              </div>
            </div>
          </section>

          {/* 2. La Apertura (Verde - Esperanza) */}
          <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-black text-xs uppercase tracking-widest">
                <Sparkles size={14} /> 1 de marzo de 1992
              </div>
              <h2 className="text-3xl font-black text-slate-800 uppercase leading-none">El primer toque <br/><span className="text-green-600">de campana</span></h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                Finalmente, abrimos nuestras puertas en calle René Schneider #206. Ese primer día no fue multitudinario, pero sí significativo: <strong>54 alumnos, 5 cursos y un sueño en marcha.</strong> Don Julio asumió como su primer director, guiando los pasos de una institución que recién comenzaba a escribir su historia.
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute inset-0 bg-green-500 rounded-[2rem] rotate-3 opacity-10"></div>
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/20260414_134830.jpg" className="w-full h-full object-cover" alt="Apertura" />
              </div>
            </div>
          </section>

          {/* 3. Crecimiento (Azul - Estabilidad) */}
          <section className={`${hitoStyles[2].bg} border-2 ${hitoStyles[2].border} p-8 md:p-12 rounded-[2.5rem] mb-24 relative overflow-hidden`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-blue-800 uppercase">Crecer paso a paso</h2>
                <p className="text-slate-700 leading-relaxed">
                  Ya en 1993 asume la dirección la profesora Erika Leiva Vásquez, marcando una etapa de consolidación. Llegaron nuevos docentes, se amplió el equipo humano y el colegio comenzó a tomar forma como comunidad educativa.
                </p>
                <div className="p-4 bg-white/80 rounded-2xl shadow-sm">
                   <p className="text-blue-900 font-bold">
                     En 1996 se vivió un momento clave: la primera licenciatura de 8° año. Fue la señal de que el proyecto estaba dando frutos.
                   </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white rotate-2">
                <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/20260414_135102.jpg" className="w-full h-full object-cover" alt="Crecimiento" />
              </div>
            </div>
          </section>

          {/* 4. Mejora Continua (Púrpura - Calidad) */}
          <section className="mb-24 flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-black text-purple-800 uppercase">Aprender, mejorar <br/>y avanzar</h2>
              <p className="text-slate-700 leading-relaxed">
                El camino no ha sido lineal. Pero si hay algo que ha caracterizado al colegio es su capacidad de adaptarse. En 2008, nos incorporamos a la Ley SEP, dando paso a un trabajo sistemático de mejora continua con foco en el desarrollo integral.
              </p>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
                <p className="font-bold italic">
                  "En 2010 logramos un aumento de más de 100 puntos en SIMCE, reflejo de un trabajo pedagógico serio y comprometido."
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-2 bg-purple-500 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/20260414_134948.jpg" className="relative rounded-2xl shadow-xl border-4 border-white" alt="Mejora SEP" />
              </div>
            </div>
          </section>

          {/* 5. Reconocimiento (Naranja - Triunfo) */}
          <section className="bg-gradient-to-br from-orange-400 to-yellow-500 p-10 md:p-16 rounded-[3rem] mb-24 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-20">
              <Award size={200} />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <h2 className="text-4xl font-black uppercase leading-tight">Reconocimiento <br/>Supérate 2015</h2>
                  <p className="text-orange-50 text-lg leading-relaxed">
                    Entre 6.000 establecimientos, fuimos reconocidos como el mejor colegio de la Región de Valparaíso en nuestra categoría. Un logro que llegó por años de trabajo silencioso y constante.
                  </p>
               </div>
               <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                  <img src="https://www.colegioitalianosp.cl/Images/Antiguas/12347617_10153180093402231_6315904574571136235_n.jpg" className="w-full h-full object-cover" alt="Reconocimiento" />
               </div>
            </div>
          </section>

          {/* 6. Resiliencia (Cian - Adaptación) */}
          <section className="mb-24 space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-cyan-800 uppercase">Nuevos tiempos <br/>y resiliencia</h2>
                <p className="text-slate-700 leading-relaxed">
                  En 2017, pasamos a manos de la Fundación Educacional Julio Inocencio Alvear. Luego, la pandemia nos obligó a cerrar las puertas físicas, pero no nuestra esencia. Las aulas se trasladaron a las pantallas durante casi dos años de resiliencia.
                </p>
                <div className="inline-flex items-center gap-3 p-4 bg-cyan-100 text-cyan-800 rounded-2xl font-bold">
                  <Heart className="fill-cyan-500 text-cyan-500" /> El reencuentro fue un momento profundamente humano.
                </div>
              </div>
              <div className="relative">
                <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/DPP_0004.JPG" className="rounded-3xl shadow-xl border-4 border-white grayscale hover:grayscale-0 transition-all duration-700" alt="Resiliencia" />
              </div>
            </div>
          </section>

          {/* 7. Presente Inclusivo (Esmeralda - Crecimiento) */}
          <section className="mb-24 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg border-4 border-emerald-500/20">
                <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/3d96cf91-1005-4b4b-9bc1-84d7736ad3e6.jpg" className="w-full h-full object-cover" alt="Actualidad" />
              </div>
            </div>
            <div className="md:w-2/3 space-y-6">
              <h2 className="text-3xl font-black text-emerald-800 uppercase">Un presente firme e inclusivo</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                Fortalecemos la convivencia y consolidamos una educación cada vez más inclusiva. No es solo una meta, sino nuestra forma de entender la educación: respeto, empatía y acompañamiento real para cada estudiante.
              </p>
            </div>
          </section>

          {/* 8. Excelencia y Futuro (Rosa/Rojo - Pasión) */}
          <section className="bg-slate-900 p-8 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            {/* Fondo con brillo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] group-hover:bg-red-600/30 transition-colors"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/40">
                    <Star className="text-white fill-white" size={24} />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight">Excelencia Académica 2026</h2>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Este logro refleja el esfuerzo de toda la comunidad. Pero nuestro mayor orgullo son las personas: <strong>el 70% de nuestros exalumnos son hoy técnicos o profesionales</strong> que aportan a la sociedad.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl flex-1 text-center">
                    <div className="text-3xl font-black text-red-500">70%</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Exalumnos Profesionales</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl flex-1 text-center">
                    <div className="text-3xl font-black text-yellow-500">30+</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Años de Historia</div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-md group-hover:bg-white/10 transition-colors"></div>
                <img src="https://www.colegioitalianosp.cl/Images/Antiguas/historia/WhatsApp%20Image%202026-04-14%20at%2010.00.59%20%281%29.jpeg" className="relative rounded-2xl shadow-2xl border-4 border-white/20" alt="Legado" />
              </div>
            </div>
          </section>

          {/* Cierre Final */}
          <div className="mt-32 text-center space-y-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 scale-150 blur-3xl bg-green-400 opacity-20"></div>
              <h2 className="relative text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter">
                Un camino que <span className="text-green-600">continúa</span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                Hoy miramos atrás y vemos esfuerzo, comunidad y aprendizaje. Seguimos adelante con la misma convicción de aquel grupo de vecinos de hace 30 años.
              </p>
              <div className="p-1 w-full bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 rounded-full">
                <div className="bg-white py-4 px-8 rounded-full">
                  <p className="text-green-700 font-black uppercase tracking-[0.2em] text-sm md:text-lg">
                    Creciendo junto a nuestra comunidad
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 pt-12 text-slate-300">
               <TrendingUp size={32} />
               <Heart className="text-red-500 fill-red-500" size={32} />
               <Sun size={32} />
            </div>
          </div>

        </div>
      </article>

      <footer className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <div className="font-black text-slate-800 mb-2 tracking-widest uppercase">Colegio Italiano San Pedro</div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Educación y Valores desde 1992 &bull; San Pedro
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Historia;