import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Globe, 
  GraduationCap, 
  Users, 
  Smile, 
  Leaf,
  Download
} from 'lucide-react';

const Proyecto = () => {
  // URL oficial del PDF del Proyecto Educativo Institucional
  const pdfUrl = "https://www.colegioitalianosp.cl/Images/El%20Colegio/PEI/ProyectoEducativo14308.pdf";

  return (
    <div className="animate-in fade-in duration-1000 bg-white">
      {/* SECCIÓN HEADER */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600" 
            className="w-full h-full object-cover" 
            alt="Fondo Proyecto Educativo" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-slate-900"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <h2 className="text-5xl md:text-[7rem] font-black text-white uppercase tracking-tighter leading-none mb-6">
            Proyecto <br/><span className="text-yellow-400">Educativo</span>
          </h2>
          <p className="text-slate-300 font-bold uppercase tracking-[0.4em] text-xs md:text-sm">
            Nuestra Esencia y Modelo de Formación
          </p>
        </div>
      </section>

      {/* SECCIÓN 1: FORMACIÓN DE PERSONAS */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 relative z-10">
                  <img 
                    src="https://www.colegioitalianosp.cl/Images/El%20Colegio/PEI/20251125_110000.jpg" 
                    className="w-full h-full object-cover" 
                    alt="Formación Integral" 
                  />
                </div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-600 rounded-full blur-[80px] opacity-20"></div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <div className="flex items-center gap-4 text-green-600">
                <Heart size={40} fill="currentColor" className="opacity-20" />
                <span className="font-black uppercase tracking-[0.3em] text-xs">Formación Humana</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-tight">
                Mucho más que <br/><span className="text-green-600">estudiantes</span>
              </h3>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                En nuestro colegio formamos mucho más que estudiantes: <span className="text-slate-800 font-bold">formamos personas</span>. Promovemos con convicción la superación personal, la responsabilidad y el respeto profundo por sí mismos, por los demás y por el entorno, integrando estos valores en cada experiencia del quehacer escolar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: COMUNIDAD VIVA (Tarjetas de Valores) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform origin-top"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl mb-16">
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic">
              Una Comunidad <br/><span className="text-yellow-400">Educativa Viva</span>
            </h3>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Somos una comunidad en permanente evolución, que genera espacios significativos para el desarrollo de los intereses y talentos de estudiantes, familias y docentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:scale-110 transition-transform">
                <Smile size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase mb-4 tracking-tight">El camino a la felicidad</h4>
              <p className="text-slate-400 leading-relaxed">
                Creemos firmemente que la educación también es un camino hacia la felicidad, y que ésta se construye en comunidad, con sentido, propósito y humanidad.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase mb-4 tracking-tight">Conectados con el Entorno</h4>
              <p className="text-slate-400 leading-relaxed">
                Nos proyectamos como un establecimiento profundamente conectado con su entorno, capaz de construir relaciones basadas en la confianza, la tolerancia y el respeto mutuo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: MISIÓN Y COMPROMISO */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-slate-50 rounded-[4rem] p-10 md:p-20 shadow-sm border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest">
                  <GraduationCap size={16} /> Compromiso Académico
                </div>
                <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none">
                  Formación Integral <br/>y Futuro Sostenible
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Nuestra misión es formar integralmente a niños y niñas, entregándoles herramientas académicas, valores sólidos y habilidades esenciales para desenvolverse en un mundo dinámico y desafiante.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Sparkles className="text-yellow-500" />, text: "Espíritu Emprendedor" },
                    { icon: <Users className="text-blue-500" />, text: "Juicio Crítico" },
                    { icon: <Leaf className="text-green-500" />, text: "Conciencia Ecológica" },
                    { icon: <Smile className="text-red-500" />, text: "Personas Íntegras" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      {item.icon}
                      <span className="font-bold text-slate-700 text-sm uppercase tracking-tight">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="bg-[#1a4731] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter mb-6 relative z-10 italic">Aportando a la Sociedad</h4>
                  <p className="text-lg text-white/80 font-medium leading-relaxed relative z-10 mb-8">
                    Aspiramos a que cada uno de nuestros estudiantes se convierta en una persona íntegra, feliz y comprometida con la construcción de una sociedad democrática y sostenible.
                  </p>
                  
                  <div className="relative z-10">
                    <a 
                      href={pdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-white text-[#1a4731] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg"
                    >
                      <Download size={20} /> Descargar PEI en PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER DE SECCIÓN: FRASE FINAL */}
      <section className="py-20 bg-[#1a4731]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-2xl md:text-4xl font-black text-white italic leading-tight uppercase tracking-tighter">
            "Construyendo juntos una sociedad más consciente, inclusiva y humanizada."
          </p>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default Proyecto;