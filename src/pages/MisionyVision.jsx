import React from 'react';
import { Target, Compass } from 'lucide-react';

const Mision = () => {
  return (
    <div className="animate-in fade-in duration-1000 bg-white">
      {/* SECCIÓN HEADER */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://www.colegioitalianosp.cl/Images/El%20Colegio/mision%20y%20vision/WhatsApp%20Image%202026-04-14%20at%2010.00.59.jpeg" 
            className="w-full h-full object-cover" 
            alt="Background Misión y Visión" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a4731]/90 to-slate-900"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <h2 className="text-4xl md:text-[6rem] font-black text-white uppercase tracking-tighter leading-none mb-4">
            Horizonte <br/><span className="text-yellow-400">Institucional</span>
          </h2>
          <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs md:text-sm">
            Nuestra Misión y Visión Educativa
          </p>
        </div>
      </section>

      {/* SECCIÓN MISIÓN */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-30"></div>
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-slate-50">
                <img 
                  src="https://www.colegioitalianosp.cl/Images/El%20Colegio/mision%20y%20vision/WhatsApp%20Image%202026-04-14%20at%2010.00.57.jpeg" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
                  alt="Misión del Colegio" 
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-[#1a4731] text-white p-6 rounded-3xl shadow-xl z-20 flex items-center justify-center">
                <Target size={48} className="text-yellow-400" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-red-600 font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-4">
                NUESTRO PROPÓSITO
              </span>
              <h3 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter mb-8">
                Nuestra Misión
              </h3>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-green-600 pl-6 py-2">
                La misión de nuestro establecimiento, es el <span className="font-bold text-slate-800">desarrollo integral de niños y niñas</span>, 
                entregándoles conocimientos, valores y actitudes que le permitan desarrollar las habilidades y destrezas necesarias para explorar y enfrentar la vida en un mundo cambiante, 
                que le permitan ser <span className="font-bold text-slate-800">personas felices</span> que puedan insertarse en una sociedad democrática, con juicio crítico, con espíritu emprendedor y con conciencia ecológica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN VISIÓN */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img 
                  src="https://www.colegioitalianosp.cl/Images/El%20Colegio/mision%20y%20vision/WhatsApp%20Image%202026-04-14%20at%2010.00.59.jpeg" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
                  alt="Visión del Colegio" 
                />
              </div>
              <div className="absolute -top-8 -left-8 bg-blue-600 text-white p-6 rounded-3xl shadow-xl z-20 flex items-center justify-center">
                <Compass size={48} className="text-white" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-4">
                NUESTRA PROYECCIÓN
              </span>
              <h3 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter mb-8">
                Nuestra Visión
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">1</div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                    Un colegio que enfatice en sus alumnos la superación personal, la responsabilidad, el respeto a si mismo, a los demás y al medio ambiente; a través del desarrollo del quehacer escolar cotidiano.
                  </p>
                </div>
                <div className="flex gap-4 items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                  <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">2</div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                    Un colegio en la que se creen los espacios para desarrollar los intereses de alumnos, padres y profesores, donde éstos sean elementos articuladores de la felicidad a la que todos aspiran. En beneficio de una sociedad humanizada.
                  </p>
                </div>
                <div className="flex gap-4 items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                  <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">3</div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                    Un colegio capaz de mantener una relación con el entorno comunitario, sustentada en el respeto, la tolerancia y la responsabilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mision;