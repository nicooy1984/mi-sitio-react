import React from 'react';
import { Award, Quote, History } from 'lucide-react';

const Fundacion = () => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* SECCIÓN HEADER */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1523050335102-c3251d48b23f?auto=format&fit=crop&w=1600" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a4731]/80 to-slate-900"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <div className="inline-block p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <Award className="text-yellow-400" size={40} />
          </div>
          <h2 className="text-4xl md:text-[6rem] font-black text-white uppercase tracking-tighter leading-none mb-4">
            Fundación Educacional
          </h2>
          <p className="text-yellow-400 font-black uppercase tracking-[0.4em] text-xs md:text-sm">
            Julio Inocencio Alvear
          </p>
        </div>
      </section>

      {/* SECCIÓN BIOGRAFÍA */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="aspect-[4/5] bg-slate-100 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group relative">
                  <img src="https://www.colegioitalianosp.cl/Images/El%20Colegio/Fundaci%C3%B3n/20260414_113133.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Julio Inocencio Alvear" />
                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-slate-900 to-transparent">
                    <p className="text-white font-black uppercase text-sm tracking-widest">Julio Inocencio Alvear</p>
                    <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mt-1">Fundador y Sostenedor</p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl">
                  <History size={32} />
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div className="border-l-8 border-green-600 pl-8">
                <h3 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter mb-4 italic">
                  Una Vida Dedicada a la Educación
                </h3>
              </div>
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg">
                <p>
                  Julio Inocencio Alvear se titula de la <span className="text-green-700 font-bold">Escuela Normalista en 1967</span>, e ingresa a trabajar al Ministerio de Educación. Paralelamente comienza a hacer clases en la Escuela de Hombres 88 de Limache en la que se desempeñará por 15 años.
                </p>
                <p>
                  Posteriormente, se dedica a la educación particular subvencionada bajo el alero de la ley que daba la posibilidad a convertirse en colaborador de la función educacional del Estado.
                </p>
                
                {/* GRID DE HITOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border-b-4 border-blue-600">
                    <span className="block text-2xl font-black text-blue-600 mb-2">1985</span>
                    <p className="text-sm font-bold uppercase tracking-tight">Crea el Colegio Italiano de Limache</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-b-4 border-green-600">
                    <span className="block text-2xl font-black text-green-600 mb-2">1992</span>
                    <p className="text-sm font-bold uppercase tracking-tight">Funda el Colegio Italiano San Pedro</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-b-4 border-red-600">
                    <span className="block text-2xl font-black text-red-600 mb-2">1994</span>
                    <p className="text-sm font-bold uppercase tracking-tight">Escuela de Párvulos Italito en Limache</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-b-4 border-yellow-500">
                    <span className="block text-2xl font-black text-yellow-500 mb-2">2017</span>
                    <p className="text-sm font-bold uppercase tracking-tight">Crea la Fundación Educacional que lleva su nombre</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CITAS Y REFLEXIONES */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="aspect-video bg-white p-4 rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="https://www.colegioitalianosp.cl/Images/El%20Colegio/Fundaci%C3%B3n/20260414_113105.jpg" className="w-full h-full object-cover rounded-[1.5rem]" alt="Entrevista Fundador" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-[#1a4731] p-10 md:p-16 rounded-[3rem] text-white shadow-2xl relative">
                <Quote className="absolute -top-8 -left-8 text-yellow-400 opacity-30" size={100} />
                <div className="space-y-12 relative z-10">
                  <div className="space-y-4">
                    <h4 className="text-yellow-400 font-black uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                      <span className="w-8 h-px bg-yellow-400"></span> Reflexión de Trayectoria
                    </h4>
                    <p className="text-xl md:text-2xl font-black italic leading-tight">
                      "Nuestro colegio ha evolucionado bastante... hemos crecido de forma significativa enfocado principalmente en beneficio de nuestros alumnos y trabajadores."
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      "Aún nos quedan bastantes mejoramientos que realizar, pero gracias a la confianza que han depositado los padres y apoderados es que hemos podido crecer y tener un nombre en la comuna de Quillota y dentro de nuestra querida localidad que es San Pedro."
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-yellow-400 font-black uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                      <span className="w-8 h-px bg-yellow-400"></span> El cariño de la comunidad
                    </h4>
                    <p className="text-lg md:text-xl font-bold leading-relaxed italic">
                      "Todos los logros académicos que se han obtenido durante estos años han sido gracias a nuestro plantel de profesores, asistentes y equipo directivo."
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-yellow-400 font-black uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2">
                      <span className="w-8 h-px bg-yellow-400"></span> Mirada al Futuro
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      "Mi anhelo es que esta fundación siga funcionando y creciendo a través del tiempo como una gran fuente laboral para muchas personas y por sobre todo que crezca lo más posible en el ámbito educacional para mis queridos alumnos."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fundacion;