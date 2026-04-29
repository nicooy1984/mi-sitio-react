import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  Navigation,
  Bus,
  Car,
  Users,
  ShieldCheck,
  Route,
  Camera
} from 'lucide-react';

const colegioFrontal =
  'https://www.colegioitalianosp.cl/Images/ubicacion/colegio-frontal.jpg';

const colegioPatio =
  'https://www.colegioitalianosp.cl/Images/ubicacion/colegio-patio.jpg';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Ren%C3%A9%20Schneider%20206%20San%20Pedro%20Quillota';

const WAZE_APP_URL =
  'waze://?q=Ren%C3%A9%20Schneider%20206%20San%20Pedro%20Quillota&navigate=yes';

const WAZE_WEB_URL =
  'https://waze.com/ul?q=Ren%C3%A9%20Schneider%20206%20San%20Pedro%20Quillota&navigate=yes';

function RevealOnScroll({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function FloatingCard({ icon: Icon, title, text, className = '' }) {
  return (
    <div
      className={`rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Icon className="text-blue-700" size={20} />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function AppButton({
  href,
  icon: Icon,
  title,
  subtitle,
  className = '',
  target = '_self',
  rel,
  onClick
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-[1.4rem] p-4 md:p-5 text-white
        shadow-lg hover:-translate-y-1 active:scale-[0.98]
        transition duration-300 ${className}
      `}
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition" />
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col h-full">
        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 shadow-sm">
          <Icon size={22} />
        </div>

        <p className="font-extrabold text-sm md:text-base leading-tight">{title}</p>
        <p className="text-xs text-white/85 mt-1">{subtitle}</p>

        <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">
          Abrir
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </a>
  );
}

export default function Ubicacion() {
  const handleWazeClick = (e) => {
    e.preventDefault();

    const start = Date.now();
    let fallbackTriggered = false;

    const fallbackToWeb = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      window.location.href = WAZE_WEB_URL;
    };

    const cancelFallbackIfAppOpened = () => {
      const elapsed = Date.now() - start;
      if (elapsed < 1300) {
        clearTimeout(fallbackTimer);
      }
      window.removeEventListener('blur', cancelFallbackIfAppOpened);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', cancelFallbackIfAppOpened);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelFallbackIfAppOpened();
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      fallbackToWeb();
      window.removeEventListener('blur', cancelFallbackIfAppOpened);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', cancelFallbackIfAppOpened);
    }, 1200);

    window.addEventListener('blur', cancelFallbackIfAppOpened);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', cancelFallbackIfAppOpened);

    window.location.href = WAZE_APP_URL;
  };

  return (
    <div className="bg-slate-50 text-slate-800 overflow-hidden">
      {/* HERO CON FOTO REAL DE FONDO */}
      <section className="relative min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${colegioFrontal})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-sky-800/65" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative max-w-7xl mx-auto w-full px-6 py-20 md:py-28">
          <RevealOnScroll>
            <div className="max-w-3xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md border border-white/20 mb-6">
                <MapPin size={16} />
                Contacto · Ubicación
              </span>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Conoce dónde estamos
                <span className="block text-cyan-300">y cómo llegar</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
                Nuestro establecimiento se encuentra inserto en la comunidad de San Pedro,
                en un entorno cercano, accesible y pensado para el desarrollo integral
                de nuestros estudiantes.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#mapa"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-900 px-6 py-3 font-semibold shadow-lg hover:scale-[1.03] transition"
                >
                  <Navigation size={18} />
                  Ver ubicación
                </a>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur-md hover:bg-white/20 transition"
                >
                  <Route size={18} />
                  Cómo llegar
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* TARJETAS SUPERIORES */}
      <section className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <RevealOnScroll delay={0}>
              <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                  <MapPin className="text-blue-700" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Ubicación accesible</h3>
                <p className="text-slate-600 leading-relaxed">
                  Nos encontramos en un punto cercano a nuestra comunidad educativa,
                  favoreciendo la llegada diaria de estudiantes y familias.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={120}>
              <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition">
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="text-cyan-700" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Entorno seguro</h3>
                <p className="text-slate-600 leading-relaxed">
                  Nuestro colegio busca ofrecer un espacio resguardado, acogedor
                  y cercano para toda la comunidad escolar.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                  <Bus className="text-amber-700" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Fácil de encontrar</h3>
                <p className="text-slate-600 leading-relaxed">
                  La ubicación del establecimiento permite una orientación clara y
                  un acceso cómodo desde distintos puntos del sector.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FOTO REAL + INFORMACIÓN */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <RevealOnScroll>
            <div className="relative h-full min-h-[420px] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src={colegioPatio}
                alt="Vista del Colegio Italiano San Pedro"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md border border-white/20 mb-4">
                  <Camera size={16} />
                  Imagen institucional
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold">
                  Nuestro colegio, más cerca de la comunidad
                </h2>
                <p className="mt-3 text-blue-100 leading-relaxed max-w-xl">
                 
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="h-full rounded-[2rem] bg-white p-7 shadow-xl border border-slate-100">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold mb-5">
                <MapPin size={16} />
                Datos de ubicación
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Colegio Italiano San Pedro
              </h2>

              <p className="text-slate-600 leading-relaxed mb-8">
                Ponemos a disposición de nuestra comunidad la información de contacto
                y ubicación del establecimiento para facilitar visitas, consultas
                y orientación general.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="text-blue-700" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Dirección</p>
                    <p className="text-slate-600">René Schneider 206, San Pedro, Quillota</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Phone className="text-emerald-700" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Teléfono</p>
                    <p className="text-slate-600">+56 33 2329331</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Mail className="text-amber-700" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Correo electrónico</p>
                    <p className="text-slate-600">citalianosp@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Clock3 className="text-violet-700" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Horario de atención</p>
                    <p className="text-slate-600">Lunes a viernes  08:00 a 19:00 Hrs  </p>
                  </div>
                </div>
              </div>

              {/* BOTONES DE APLICACIONES Y ACCIONES */}
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                    Accesos rápidos
                  </p>
                  <span className="hidden md:inline-flex text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Optimizado para móvil
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <AppButton
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={MapPin}
                    title="Google Maps"
                    subtitle="Abrir ubicación"
                    className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"
                  />

                  <AppButton
                    href={WAZE_APP_URL}
                    onClick={handleWazeClick}
                    icon={Navigation}
                    title="Waze"
                    subtitle="Abrir app primero"
                    className="bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600"
                  />

                  <AppButton
                    href="tel:+56332329331"
                    icon={Phone}
                    title="Llamar"
                    subtitle="Contacto directo"
                    className="bg-gradient-to-br from-emerald-500 via-green-600 to-green-800"
                  />

                  <AppButton
                    href="mailto:citalianosp@gmail.com"
                    icon={Mail}
                    title="Correo"
                    subtitle="Escribir ahora"
                    className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* MAPA CON TARJETAS FLOTANTES */}
      <section id="mapa" className="max-w-7xl mx-auto px-6 pb-16">
        <RevealOnScroll>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 bg-white min-h-[560px]">
            <iframe
              title="Mapa Colegio Italiano San Pedro"
              src="https://www.google.com/maps?q=Ren%C3%A9%20Schneider%20206%20San%20Pedro%20Quillota&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />

            <div className="absolute top-5 left-5 z-10 max-w-xs">
              <FloatingCard
                icon={MapPin}
                title="Dirección"
                text="René Schneider 206, San Pedro, Quillota"
              />
            </div>

            <div className="absolute top-5 right-5 z-10 max-w-xs hidden md:block">
              <FloatingCard
                icon={Users}
                title="Comunidad escolar"
                text="Ubicación cercana a estudiantes, familias y visitas."
              />
            </div>

            <div className="absolute bottom-5 left-5 z-10 max-w-xs hidden md:block">
              <FloatingCard
                icon={ShieldCheck}
                title="Entorno"
                text="Sector de referencia para la comunidad educativa."
              />
            </div>

            <div className="absolute bottom-5 right-5 z-10 max-w-xs">
              <FloatingCard
                icon={Navigation}
                title="Acceso rápido"
                text="Abre el mapa y obtén la ruta directamente desde tu dispositivo."
              />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* MINI FICHA: CÓMO LLEGAR DESDE */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <RevealOnScroll>
          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-8 md:p-10">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 text-cyan-700 px-4 py-2 text-sm font-semibold mb-4">
                <Route size={16} />
                Orientación de llegada
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Cómo llegar desde...
              </h2>
              <p className="text-slate-600 mt-3 max-w-2xl">
             
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Car className="text-blue-700" size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2">Desde el centro de Quillota</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Parte en la Plaza de Armas de Quillota
(referencia: Municipalidad / Iglesias).
Toma calle Condell o Freire hacia el sur (salida de Quillota hacia San Pedro).
Conecta con la Ruta F-382 (Camino a San Pedro)
Esta es la vía principal que une Quillota con San Pedro.
Sigue derecho por aproximadamente 6 a 8 km
Vas a notar que sales de la ciudad y entras a un sector más rural.
Pasarás parcelas, negocios pequeños y señalética hacia San Pedro.
Al llegar a San Pedro (zona urbana):
Doblas en el cruce que da hacia limache e ingresas a mano izquierda
Busca referencias como CESFAM San Pedro
Gira hacia calle René Schneider
Ahí está el colegio.
Avanza unos metros y verás el colegio al costado.
📍 Dirección: René Schneider 206, San Pedro, Quillota
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Bus className="text-amber-700" size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2">Desde sectores cercanos</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  El establecimiento cuenta con una ubicación reconocible dentro del sector,
                  lo que facilita el acceso por locomoción y desplazamiento cotidiano.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <Navigation className="text-emerald-700" size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2">Usando Google Maps</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  También puedes abrir la ubicación directamente en Google Maps para
                  recibir indicaciones precisas desde tu punto de partida.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* CIERRE VISUAL */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white p-8 md:p-12 shadow-2xl">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-cyan-300/20"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-cyan-200 font-semibold mb-2">
                  Visítanos
                </p>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Te invitamos a conocer nuestro establecimiento
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Esta sección puede transformarse en un punto muy fuerte del sitio si
                  añadimos fotografías reales, orientación clara y una experiencia visual
                  moderna para las familias.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-900 px-6 py-3 font-bold hover:scale-[1.02] transition"
                >
                  <MapPin size={18} />
                  Abrir ubicación
                </a>

                <a
                  href="mailto:citalianosp@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold backdrop-blur-md hover:bg-white/20 transition"
                >
                  <Mail size={18} />
                  Contactar
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}