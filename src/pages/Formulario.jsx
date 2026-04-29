import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock3,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EMAILJS_SERVICE_ID = 'service_o85zuqj';
const EMAILJS_TEMPLATE_ID = 'template_u8g92hj';
const EMAILJS_PUBLIC_KEY = 'PisHgJwnSpl-Lh7no';
const TURNSTILE_SITE_KEY = '0x4AAAAAAC_Gk7ZzN3Zq-AFl';

const initialForm = {
  nombre: '',
  correo: '',
  telefono: '',
  asunto: '',
  mensaje: '',
  website: '',
};

function loadTurnstileScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]'
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(window.turnstile));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function Formulario() {
  const formRef = useRef(null);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const formStartedAtRef = useRef(Date.now());
  const lastSentAtRef = useRef(0);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initTurnstile() {
      try {
        const turnstile = await loadTurnstileScript();

        if (
          cancelled ||
          !turnstile ||
          !turnstileRef.current ||
          widgetIdRef.current !== null
        ) {
          return;
        }

        const widgetId = turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          appearance: 'always',
          callback: (token) => {
            setTurnstileToken(token);
            setSendError('');
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
          'error-callback': () => {
            setTurnstileToken('');
            setSendError(
              'No se pudo validar la protección anti-spam. Recarga la página e inténtalo nuevamente.'
            );
          },
        });

        widgetIdRef.current = widgetId;
        setTurnstileReady(true);
      } catch (error) {
        console.error('Error cargando Turnstile:', error);
        setSendError(
          'No se pudo cargar la protección anti-spam. Revisa bloqueadores o extensiones e inténtalo nuevamente.'
        );
      }
    }

    initTurnstile();

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // noop
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (window.turnstile && widgetIdRef.current !== null) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // noop
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Ingresa tu nombre';

    if (!formData.correo.trim()) {
      newErrors.correo = 'Ingresa tu correo';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Correo no válido';
    }

    if (!formData.asunto.trim()) newErrors.asunto = 'Ingresa un asunto';

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'Escribe tu mensaje';
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (formData.website) {
      newErrors.website = 'Bloqueado por seguridad.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setSendError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setSent(false);
    setSendError('');

    if (Object.keys(validationErrors).length > 0) return;

    const secondsElapsed = (Date.now() - formStartedAtRef.current) / 1000;
    if (secondsElapsed < 4) {
      setSendError('Envío bloqueado por seguridad. Intenta nuevamente.');
      return;
    }

    const secondsSinceLastSend = (Date.now() - lastSentAtRef.current) / 1000;
    if (secondsSinceLastSend < 15) {
      setSendError('Espera unos segundos antes de volver a enviar.');
      return;
    }

    if (!turnstileToken) {
      setSendError('Confirma la validación de seguridad antes de enviar.');
      return;
    }

    try {
      setSending(true);

      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      lastSentAtRef.current = Date.now();
      setSent(true);
      setFormData(initialForm);
      formRef.current.reset();
      resetTurnstile();
      formStartedAtRef.current = Date.now();

      setTimeout(() => {
        setSent(false);
      }, 5000);
    } catch (error) {
      console.error('Error enviando formulario:', error);
      setSendError(
        'No fue posible enviar el mensaje en este momento. Inténtalo nuevamente.'
      );
      resetTurnstile();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-700 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute top-16 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md border border-white/20 mb-6">
              <Mail size={16} />
              Contacto · Formulario
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Estamos para
              <span className="block text-cyan-300">escucharte</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
              Si deseas realizar una consulta, solicitar información o comunicarte
              con nuestro establecimiento, completa el siguiente formulario y te
              responderemos a la brevedad.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-700" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Canal directo</h3>
              <p className="text-slate-600 leading-relaxed">
                Comunícate con nuestro colegio mediante un formulario claro, cómodo
                y accesible desde cualquier dispositivo.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center mb-4">
                <ShieldCheck className="text-cyan-700" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Atención confiable</h3>
              <p className="text-slate-600 leading-relaxed">
                Tu mensaje será recibido de manera ordenada para facilitar una
                respuesta oportuna y profesional.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                <Building2 className="text-amber-700" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Vínculo con la comunidad</h3>
              <p className="text-slate-600 leading-relaxed">
                Este espacio fortalece la comunicación entre el establecimiento,
                las familias y la comunidad educativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <div className="rounded-[2rem] bg-white shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white p-8 md:p-10">
                <h2 className="text-3xl font-extrabold mb-3">
                  Envíanos tu mensaje
                </h2>
                <p className="text-blue-100 max-w-2xl leading-relaxed">
                  Completa los campos requeridos para que podamos orientarte de
                  mejor manera.
                </p>
              </div>

              <div className="p-8 md:p-10">
                {sent && (
                  <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} />
                    <div>
                      <p className="font-bold text-emerald-800">Mensaje enviado</p>
                      <p className="text-emerald-700 text-sm mt-1">
                        Tu mensaje fue enviado correctamente.
                      </p>
                    </div>
                  </div>
                )}

                {sendError && (
                  <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={22} />
                    <div>
                      <p className="font-bold text-red-800">Aviso</p>
                      <p className="text-red-700 text-sm mt-1">{sendError}</p>
                    </div>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="hidden">
                    <label htmlFor="website">Sitio web</label>
                    <input
                      id="website"
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      autoComplete="off"
                      tabIndex="-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Ingresa tu nombre"
                          className={`w-full rounded-2xl border bg-slate-50 pl-11 pr-4 py-4 outline-none transition ${
                            errors.nombre
                              ? 'border-red-300 focus:border-red-400'
                              : 'border-slate-200 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      {errors.nombre && (
                        <p className="text-red-500 text-sm mt-2">{errors.nombre}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          placeholder="correo@ejemplo.com"
                          className={`w-full rounded-2xl border bg-slate-50 pl-11 pr-4 py-4 outline-none transition ${
                            errors.correo
                              ? 'border-red-300 focus:border-red-400'
                              : 'border-slate-200 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      {errors.correo && (
                        <p className="text-red-500 text-sm mt-2">{errors.correo}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="+56..."
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-4 outline-none transition focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Asunto
                      </label>
                      <input
                        type="text"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        placeholder="Motivo de tu consulta"
                        className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition ${
                          errors.asunto
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-slate-200 focus:border-blue-400'
                        }`}
                      />
                      {errors.asunto && (
                        <p className="text-red-500 text-sm mt-2">{errors.asunto}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows="7"
                      placeholder="Escribe aquí tu mensaje..."
                      className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition resize-none ${
                        errors.mensaje
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-slate-200 focus:border-blue-400'
                      }`}
                    />
                    {errors.mensaje && (
                      <p className="text-red-500 text-sm mt-2">{errors.mensaje}</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-700 mb-3">
                      Verificación de seguridad
                    </p>
                    <div ref={turnstileRef} />
                    {!turnstileReady && (
                      <p className="text-sm text-slate-500 mt-3">
                        Cargando protección anti-spam...
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    <p className="text-sm text-slate-500">
                      Al enviar este formulario, tu consulta será remitida al correo institucional.
                    </p>

                    <button
                      type="submit"
                      disabled={sending || !turnstileReady}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-lg transition ${
                        sending || !turnstileReady
                          ? 'bg-slate-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-700 via-blue-800 to-cyan-700 text-white hover:scale-[1.02] active:scale-[0.99]'
                      }`}
                    >
                      <Send size={18} />
                      {sending ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[2rem] bg-white p-7 shadow-xl border border-slate-100">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold mb-5">
                <Mail size={16} />
                Información de contacto
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-5">
                También puedes comunicarte por estas vías
              </h3>

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
                    <p className="font-semibold text-slate-900">Correo</p>
                    <p className="text-slate-600">citalianosp@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Clock3 className="text-violet-700" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Horario de atención</p>
                    <p className="text-slate-600">Lunes a viernes · 08:00 a 19:00 </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white p-7 shadow-2xl">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-10 left-0 h-28 w-28 rounded-full bg-cyan-300/20"></div>

              <div className="relative">
                <p className="text-cyan-200 font-semibold mb-2">Atención cercana</p>
                <h3 className="text-2xl font-extrabold mb-4">
                  Un canal pensado para nuestra comunidad
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  Este formulario permite enviar consultas reales al correo institucional
                  del establecimiento, con una capa adicional de protección anti-spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}