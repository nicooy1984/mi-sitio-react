import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  ArrowRight,
  Newspaper,
  Star,
  Archive,
  ChevronDown,
  FolderOpen,
} from 'lucide-react';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function parseNewsDate(item) {
  if (!item?.date) return null;

  const raw = String(item.date).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const d = new Date(`${raw}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getYearMonth(item) {
  const dateObj = parseNewsDate(item);
  if (!dateObj) return null;

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth(),
  };
}

function getNewsImage(item) {
  return (
    item?.imageUrl ||
    item?.image ||
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop'
  );
}

export default function Noticias({
  newsItems = [],
  setSelectedNews,
  setCurrentView,
}) {
  const sortedNews = useMemo(() => {
    return [...newsItems].sort((a, b) => {
      const dateA = parseNewsDate(a);
      const dateB = parseNewsDate(b);

      if (dateA && dateB) return dateB - dateA;
      if (dateA) return -1;
      if (dateB) return 1;
      return 0;
    });
  }, [newsItems]);

  const archiveData = useMemo(() => {
    const grouped = {};

    sortedNews.forEach((item) => {
      const ym = getYearMonth(item);
      if (!ym) return;

      if (!grouped[ym.year]) {
        grouped[ym.year] = {};
      }

      if (!grouped[ym.year][ym.month]) {
        grouped[ym.year][ym.month] = [];
      }

      grouped[ym.year][ym.month].push(item);
    });

    return grouped;
  }, [sortedNews]);

  const archiveYears = useMemo(() => {
    return Object.keys(archiveData)
      .map(Number)
      .sort((a, b) => b - a);
  }, [archiveData]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [openYears, setOpenYears] = useState(() => {
    const initial = {};
    archiveYears.forEach((year, index) => {
      initial[year] = index === 0;
    });
    return initial;
  });

  const filteredNews = useMemo(() => {
    if (selectedYear === null || selectedMonth === null) return sortedNews;

    return sortedNews.filter((item) => {
      const ym = getYearMonth(item);
      return ym && ym.year === selectedYear && ym.month === selectedMonth;
    });
  }, [sortedNews, selectedYear, selectedMonth]);

  const featuredNews = filteredNews[0];
  const secondaryNews = filteredNews.slice(1);

  const heroBackground = featuredNews
    ? getNewsImage(featuredNews)
    : sortedNews[0]
      ? getNewsImage(sortedNews[0])
      : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop';

  const toggleYear = (year) => {
    setOpenYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const handleArchiveFilter = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilter = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNews = (item) => {
    setSelectedNews(item);
    setCurrentView('newsDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterLabel =
    selectedYear !== null && selectedMonth !== null
      ? `${MONTHS[selectedMonth]} ${selectedYear}`
      : 'Todas las noticias';

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt="Noticias del colegio"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-emerald-900/80 backdrop-blur-[2px]" />

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-yellow-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Newspaper size={18} />
              <span className="text-sm md:text-base font-medium">
                Vida Escolar · Noticias
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Noticias de nuestra
              <span className="block text-emerald-300">comunidad educativa</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-200 leading-relaxed">
              Revisa actividades, logros, celebraciones y los acontecimientos más
              importantes que dan vida a nuestro colegio.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <Archive size={18} />
              <span className="font-medium">{filterLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {sortedNews.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 md:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
              <Newspaper className="text-emerald-600" size={34} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Aún no hay noticias publicadas
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Cuando publiques noticias desde el panel de administración,
              aparecerán aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-10">
            <aside className="xl:sticky xl:top-24 self-start">
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-emerald-700 text-white px-6 py-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                      <Archive size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Archivo</h2>
                      <p className="text-white/80 text-sm">
                        Explora las noticias por fecha
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <button
                    onClick={clearFilter}
                    className={`w-full text-left rounded-2xl px-4 py-3 mb-4 transition border ${
                      selectedYear === null && selectedMonth === null
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Todas las noticias</span>
                      <FolderOpen size={18} />
                    </div>
                  </button>

                  <div className="space-y-3">
                    {archiveYears.map((year) => {
                      const months = Object.keys(archiveData[year] || {})
                        .map(Number)
                        .sort((a, b) => b - a);

                      return (
                        <div
                          key={year}
                          className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleYear(year)}
                            className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-slate-100 transition"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{year}</div>
                              <div className="text-sm text-slate-500">
                                {months.reduce(
                                  (acc, month) =>
                                    acc + archiveData[year][month].length,
                                  0
                                )}{' '}
                                noticia(s)
                              </div>
                            </div>

                            <ChevronDown
                              size={18}
                              className={`text-slate-500 transition-transform ${
                                openYears[year] ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {openYears[year] && (
                            <div className="px-3 pb-3">
                              <div className="space-y-2">
                                {months.map((month) => {
                                  const isActive =
                                    selectedYear === year &&
                                    selectedMonth === month;

                                  return (
                                    <button
                                      key={`${year}-${month}`}
                                      onClick={() =>
                                        handleArchiveFilter(year, month)
                                      }
                                      className={`w-full flex items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                                        isActive
                                          ? 'bg-emerald-600 text-white shadow-md'
                                          : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                                      }`}
                                    >
                                      <span className="font-medium">
                                        {MONTHS[month]}
                                      </span>
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}
                                      >
                                        {archiveData[year][month].length}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <div>
              {(selectedYear !== null || selectedMonth !== null) && (
                <div className="mb-8 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-4 py-2">
                    <Archive size={16} />
                    <span className="font-medium">{filterLabel}</span>
                  </div>

                  <button
                    onClick={clearFilter}
                    className="text-slate-600 hover:text-slate-800 font-medium transition"
                  >
                    Ver todas
                  </button>
                </div>
              )}

              {filteredNews.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-10 text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    No hay noticias en este periodo
                  </h3>
                  <p className="text-slate-600 mb-5">
                    Selecciona otro mes o vuelve a ver todas las noticias.
                  </p>
                  <button
                    onClick={clearFilter}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-2xl transition"
                  >
                    Ver todas las noticias
                  </button>
                </div>
              ) : (
                <>
                  {featuredNews && (
                    <section className="mb-14">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                          <Star size={20} />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Noticia destacada
                          </h2>
                          <p className="text-slate-500 text-sm md:text-base">
                            {selectedYear !== null && selectedMonth !== null
                              ? `Selección de ${filterLabel}`
                              : 'Lo más reciente de nuestra comunidad escolar'}
                          </p>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
                        <div className="relative min-h-[280px] md:min-h-[420px] bg-slate-200">
                          <img
                            src={getNewsImage(featuredNews)}
                            alt={featuredNews.title}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          <div className="absolute top-5 left-5">
                            <span className="inline-flex items-center gap-2 bg-white/90 text-slate-800 text-sm font-semibold px-4 py-2 rounded-full shadow">
                              <Star size={16} className="text-amber-500" />
                              Destacada
                            </span>
                          </div>
                        </div>

                        <div className="p-6 md:p-10 flex flex-col justify-center">
                          <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 w-fit mb-5">
                            <CalendarDays size={18} />
                            <span className="text-sm font-medium">
                              {featuredNews.date || 'Fecha no disponible'}
                            </span>
                          </div>

                          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-5">
                            {featuredNews.title}
                          </h3>

                          <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            {featuredNews.summary ||
                              (featuredNews.content
                                ? `${featuredNews.content.slice(0, 260)}...`
                                : 'Conoce más detalles sobre esta importante noticia de nuestra comunidad educativa.')}
                          </p>

                          <div>
                            <button
                              onClick={() => handleOpenNews(featuredNews)}
                              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              Leer noticia completa
                              <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  <section>
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Más noticias
                      </h2>
                      <p className="text-slate-500 mt-1">
                        {selectedYear !== null && selectedMonth !== null
                          ? `Noticias publicadas en ${filterLabel}`
                          : 'Todas las novedades, actividades y noticias de nuestro colegio'}
                      </p>
                    </div>

                    {secondaryNews.length === 0 ? (
                      <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-8 text-slate-600">
                        Por ahora solo hay una noticia en esta selección.
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {secondaryNews.map((item) => (
                          <article
                            key={item.id}
                            className="group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl border border-slate-200 hover:-translate-y-1 transition-all duration-300"
                          >
                            <div className="relative h-56 bg-slate-200 overflow-hidden">
                              <img
                                src={getNewsImage(item)}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            <div className="p-6">
                              <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                                <CalendarDays size={16} />
                                <span>{item.date || 'Fecha no disponible'}</span>
                              </div>

                              <h3 className="text-xl font-bold text-slate-800 leading-snug mb-3 group-hover:text-emerald-700 transition-colors">
                                {item.title}
                              </h3>

                              <p className="text-slate-600 leading-relaxed mb-5 line-clamp-4">
                                {item.summary ||
                                  (item.content
                                    ? `${item.content.slice(0, 140)}...`
                                    : 'Conoce más detalles sobre esta noticia de nuestra comunidad escolar.')}
                              </p>

                              <button
                                onClick={() => handleOpenNews(item)}
                                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition"
                              >
                                Ver más
                                <ArrowRight size={17} />
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}