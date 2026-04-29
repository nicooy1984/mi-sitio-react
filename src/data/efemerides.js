// =====================================================
// EFEMÉRIDES V2 - COLEGIO ITALIANO SAN PEDRO
// 365 días con efeméride
// Incluye:
// - title
// - description
// - type
// - icon
// - color
// - official
// - badge
// =====================================================

// ----------------------
// UTILIDADES
// ----------------------
function pad(value) {
  return String(value).padStart(2, '0');
}

function getKeyFromDate(date = new Date()) {
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${month}-${day}`;
}

function toLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function createEfemeride({
  title,
  description,
  type = 'cultural',
  icon = 'sparkles',
  color = 'emerald',
  official = false,
  badge = 'Efeméride del día'
}) {
  return {
    title,
    description,
    type,
    icon,
    color,
    official,
    badge
  };
}

// ----------------------
// TEMAS DE RESPALDO POR MES
// Se usan para completar los días sin una fecha
// chilena o internacional especialmente fuerte.
// ----------------------
const MONTHLY_THEMES = {
  1: [
    createEfemeride({
      title: 'Verano, descanso y familia',
      description:
        'El verano invita a compartir en familia, cuidar el tiempo libre y valorar los espacios de encuentro propios de esta época del año en Chile.',
      type: 'cultural',
      icon: 'sun',
      color: 'amber',
      badge: 'Verano'
    }),
    createEfemeride({
      title: 'Cuidado del entorno en vacaciones',
      description:
        'También en vacaciones podemos demostrar responsabilidad, respeto por los espacios comunes y compromiso con el medioambiente.',
      type: 'medioambiente',
      icon: 'leaf',
      color: 'green',
      badge: 'Conciencia ambiental'
    }),
    createEfemeride({
      title: 'Lectura y aprendizaje en verano',
      description:
        'Aprender no ocurre solo en la sala de clases: leer, conversar y observar nuestro entorno también fortalece nuestra formación.',
      type: 'educacion',
      icon: 'book-open',
      color: 'blue',
      badge: 'Formación'
    }),
    createEfemeride({
      title: 'Identidad y tradiciones de verano',
      description:
        'Las costumbres del verano chileno nos recuerdan la importancia de la vida comunitaria, la cultura local y el encuentro entre generaciones.',
      type: 'cultural',
      icon: 'flag',
      color: 'red',
      badge: 'Tradiciones'
    }),
    createEfemeride({
      title: 'Hábitos saludables',
      description:
        'El descanso, la hidratación, la alimentación equilibrada y la actividad física también son parte de una vida sana y responsable.',
      type: 'salud',
      icon: 'heart',
      color: 'rose',
      badge: 'Bienestar'
    })
  ],
  2: [
    createEfemeride({
      title: 'Convivencia y regreso paulatino',
      description:
        'Febrero es un tiempo propicio para prepararnos con serenidad y entusiasmo para un nuevo ciclo de aprendizajes.',
      type: 'convivencia',
      icon: 'users',
      color: 'violet',
      badge: 'Comunidad'
    }),
    createEfemeride({
      title: 'Responsabilidad y preparación',
      description:
        'Organizar materiales, horarios y metas ayuda a comenzar el año con mayor orden, motivación y confianza.',
      type: 'educacion',
      icon: 'calendar-days',
      color: 'blue',
      badge: 'Preparación'
    }),
    createEfemeride({
      title: 'Patrimonio y cultura de Chile',
      description:
        'Nuestro país posee una riqueza natural y cultural que merece ser conocida, cuidada y valorada por las nuevas generaciones.',
      type: 'patrimonio',
      icon: 'landmark',
      color: 'amber',
      badge: 'Patrimonio'
    }),
    createEfemeride({
      title: 'Buen trato y vida en comunidad',
      description:
        'La convivencia diaria se fortalece cuando practicamos el respeto, la empatía y la colaboración.',
      type: 'convivencia',
      icon: 'handshake',
      color: 'violet',
      badge: 'Buen trato'
    }),
    createEfemeride({
      title: 'Esperanza para un nuevo ciclo',
      description:
        'Cada cierre de verano abre también la posibilidad de iniciar un año con nuevos sueños y desafíos.',
      type: 'valores',
      icon: 'sparkles',
      color: 'emerald',
      badge: 'Nuevo ciclo'
    })
  ],
  3: [
    createEfemeride({
      title: 'Inicio del año escolar',
      description:
        'Marzo nos invita a reencontrarnos, retomar rutinas y asumir con responsabilidad un nuevo año escolar.',
      type: 'educacion',
      icon: 'school',
      color: 'blue',
      badge: 'Año escolar'
    }),
    createEfemeride({
      title: 'Compromiso con el aprendizaje',
      description:
        'Cada clase, conversación y experiencia cotidiana puede transformarse en una oportunidad para crecer.',
      type: 'educacion',
      icon: 'graduation-cap',
      color: 'blue',
      badge: 'Aprendizaje'
    }),
    createEfemeride({
      title: 'Vida escolar y comunidad',
      description:
        'El colegio es un espacio de formación, convivencia y trabajo compartido entre estudiantes, familias y educadores.',
      type: 'convivencia',
      icon: 'users',
      color: 'violet',
      badge: 'Comunidad escolar'
    }),
    createEfemeride({
      title: 'Derechos, participación y respeto',
      description:
        'Una comunidad educativa sana se construye escuchando, dialogando y valorando a cada persona.',
      type: 'derechos',
      icon: 'scale',
      color: 'indigo',
      badge: 'Derechos'
    }),
    createEfemeride({
      title: 'Metas y superación',
      description:
        'El inicio del año es una invitación a proponernos metas y avanzar con constancia.',
      type: 'valores',
      icon: 'target',
      color: 'emerald',
      badge: 'Superación'
    })
  ],
  4: [
    createEfemeride({
      title: 'Lectura, cultura y reflexión',
      description:
        'Abril es un mes especialmente propicio para valorar los libros, la creatividad y el pensamiento crítico.',
      type: 'cultural',
      icon: 'book-open',
      color: 'amber',
      badge: 'Cultura'
    }),
    createEfemeride({
      title: 'Convivencia escolar',
      description:
        'El buen trato, el respeto y la vida en comunidad son pilares fundamentales de toda experiencia educativa.',
      type: 'convivencia',
      icon: 'users',
      color: 'violet',
      badge: 'Convivencia'
    }),
    createEfemeride({
      title: 'Salud y bienestar',
      description:
        'Cuidar la salud física y emocional permite aprender mejor y convivir de forma más armónica.',
      type: 'salud',
      icon: 'heart-pulse',
      color: 'rose',
      badge: 'Bienestar'
    }),
    createEfemeride({
      title: 'Memoria e identidad',
      description:
        'Conocer nuestra historia nos ayuda a comprender mejor el presente y proyectar un futuro más consciente.',
      type: 'patrimonio',
      icon: 'landmark',
      color: 'amber',
      badge: 'Identidad'
    }),
    createEfemeride({
      title: 'Creatividad y expresión',
      description:
        'Las artes, las ideas y la imaginación enriquecen la formación integral de niños, niñas y jóvenes.',
      type: 'cultural',
      icon: 'palette',
      color: 'pink',
      badge: 'Expresión'
    })
  ],
  5: [
    createEfemeride({
      title: 'Trabajo, esfuerzo y vocación',
      description:
        'Mayo nos invita a reconocer el valor del trabajo, la dedicación y el servicio a los demás.',
      type: 'valores',
      icon: 'briefcase',
      color: 'slate',
      badge: 'Esfuerzo'
    }),
    createEfemeride({
      title: 'Mar, historia y patria',
      description:
        'En este mes recordamos hitos navales y episodios que forman parte de la memoria histórica de Chile.',
      type: 'patriotica',
      icon: 'anchor',
      color: 'red',
      badge: 'Historia de Chile'
    }),
    createEfemeride({
      title: 'Familia y comunidad',
      description:
        'La formación de los estudiantes se fortalece con el apoyo de la familia y el trabajo conjunto con la escuela.',
      type: 'convivencia',
      icon: 'home',
      color: 'violet',
      badge: 'Familia'
    }),
    createEfemeride({
      title: 'Arte y patrimonio',
      description:
        'La cultura y el patrimonio nos conectan con lo que somos y con aquello que debemos cuidar.',
      type: 'patrimonio',
      icon: 'museum',
      color: 'amber',
      badge: 'Patrimonio'
    }),
    createEfemeride({
      title: 'Solidaridad cotidiana',
      description:
        'Los pequeños gestos de ayuda, respeto y colaboración también construyen una mejor comunidad.',
      type: 'valores',
      icon: 'heart-handshake',
      color: 'emerald',
      badge: 'Solidaridad'
    })
  ],
  6: [
    createEfemeride({
      title: 'Medioambiente y responsabilidad',
      description:
        'Junio nos llama a cuidar la naturaleza, usar responsablemente los recursos y pensar en el futuro del planeta.',
      type: 'medioambiente',
      icon: 'leaf',
      color: 'green',
      badge: 'Medioambiente'
    }),
    createEfemeride({
      title: 'Pueblos originarios y diversidad',
      description:
        'Valorar las raíces de Chile implica reconocer la riqueza cultural de sus pueblos originarios.',
      type: 'cultural',
      icon: 'mountain',
      color: 'amber',
      badge: 'Diversidad'
    }),
    createEfemeride({
      title: 'Prevención y autocuidado',
      description:
        'La educación también forma en hábitos sanos, decisiones responsables y cuidado mutuo.',
      type: 'salud',
      icon: 'shield-plus',
      color: 'rose',
      badge: 'Autocuidado'
    }),
    createEfemeride({
      title: 'Invierno y vida escolar',
      description:
        'Con la llegada del invierno, reforzamos el autocuidado, la asistencia y la preocupación por el bienestar común.',
      type: 'educacion',
      icon: 'snowflake',
      color: 'sky',
      badge: 'Invierno'
    }),
    createEfemeride({
      title: 'Servicio y vocación pública',
      description:
        'Muchas instituciones sirven al país con esfuerzo silencioso; reconocerlas también educa.',
      type: 'civica',
      icon: 'building-2',
      color: 'indigo',
      badge: 'Servicio público'
    })
  ],
  7: [
    createEfemeride({
      title: 'Identidad nacional',
      description:
        'Julio ofrece una oportunidad para valorar símbolos, relatos y expresiones que forman parte de la identidad chilena.',
      type: 'patriotica',
      icon: 'flag',
      color: 'red',
      badge: 'Identidad'
    }),
    createEfemeride({
      title: 'Descanso y renovación',
      description:
        'El receso de invierno puede ser un tiempo de descanso, lectura y reencuentro familiar.',
      type: 'valores',
      icon: 'sparkles',
      color: 'emerald',
      badge: 'Renovación'
    }),
    createEfemeride({
      title: 'Bandera, historia y memoria',
      description:
        'Nuestros símbolos patrios expresan historia, pertenencia y responsabilidad con el país.',
      type: 'patriotica',
      icon: 'flag-triangle-right',
      color: 'red',
      badge: 'Símbolos patrios'
    }),
    createEfemeride({
      title: 'Arte, poesía y cultura',
      description:
        'La vida cultural de Chile ha sido enriquecida por creadoras y creadores que siguen inspirando a nuevas generaciones.',
      type: 'cultural',
      icon: 'pen-tool',
      color: 'pink',
      badge: 'Cultura'
    }),
    createEfemeride({
      title: 'Amistad y comunidad',
      description:
        'Compartir con respeto y lealtad fortalece los vínculos que hacen más humana la convivencia.',
      type: 'convivencia',
      icon: 'users-round',
      color: 'violet',
      badge: 'Amistad'
    })
  ],
  8: [
    createEfemeride({
      title: 'Solidaridad y esperanza',
      description:
        'Agosto suele invitarnos a cultivar gestos de generosidad, compañía y servicio.',
      type: 'valores',
      icon: 'heart-handshake',
      color: 'emerald',
      badge: 'Solidaridad'
    }),
    createEfemeride({
      title: 'Niñez y desarrollo integral',
      description:
        'Cada niño y niña merece crecer en un entorno de afecto, protección y oportunidades.',
      type: 'derechos',
      icon: 'baby',
      color: 'indigo',
      badge: 'Infancia'
    }),
    createEfemeride({
      title: 'Juventud y proyección',
      description:
        'La escuela acompaña a las nuevas generaciones para que descubran sus talentos y construyan su futuro.',
      type: 'educacion',
      icon: 'rocket',
      color: 'blue',
      badge: 'Juventud'
    }),
    createEfemeride({
      title: 'Patrimonio vivo',
      description:
        'Las costumbres, oficios y saberes de nuestras comunidades también forman parte de la educación.',
      type: 'patrimonio',
      icon: 'landmark',
      color: 'amber',
      badge: 'Patrimonio'
    }),
    createEfemeride({
      title: 'Mes de la solidaridad',
      description:
        'La solidaridad no es solo una palabra: se expresa en acciones concretas de ayuda y compromiso.',
      type: 'valores',
      icon: 'hand-heart',
      color: 'emerald',
      badge: 'Mes de la solidaridad'
    })
  ],
  9: [
    createEfemeride({
      title: 'Patria e identidad',
      description:
        'Septiembre fortalece el sentido de pertenencia, la memoria histórica y el aprecio por nuestras tradiciones.',
      type: 'patriotica',
      icon: 'flag',
      color: 'red',
      badge: 'Patria'
    }),
    createEfemeride({
      title: 'Tradiciones chilenas',
      description:
        'La música, los juegos, la gastronomía y las expresiones populares también educan y unen.',
      type: 'cultural',
      icon: 'music-4',
      color: 'amber',
      badge: 'Tradiciones'
    }),
    createEfemeride({
      title: 'Ciudadanía y participación',
      description:
        'Amar a Chile también implica respetar a los demás, cuidar los espacios comunes y aportar al bien común.',
      type: 'civica',
      icon: 'vote',
      color: 'indigo',
      badge: 'Ciudadanía'
    }),
    createEfemeride({
      title: 'Historia nacional',
      description:
        'Conocer los hitos del país permite comprender mejor el camino recorrido como sociedad.',
      type: 'patriotica',
      icon: 'scroll-text',
      color: 'red',
      badge: 'Historia'
    }),
    createEfemeride({
      title: 'Celebración con sentido',
      description:
        'Las fiestas y conmemoraciones también pueden ser espacios para aprender, compartir y reflexionar.',
      type: 'valores',
      icon: 'party-popper',
      color: 'emerald',
      badge: 'Celebración'
    })
  ],
  10: [
    createEfemeride({
      title: 'Ciencia, conocimiento y curiosidad',
      description:
        'Octubre es un buen momento para valorar la investigación, la observación y el aprendizaje activo.',
      type: 'ciencia',
      icon: 'flask-conical',
      color: 'cyan',
      badge: 'Ciencia'
    }),
    createEfemeride({
      title: 'Respeto por la diversidad',
      description:
        'Educar también significa abrirnos al diálogo, la inclusión y el reconocimiento de distintas realidades.',
      type: 'derechos',
      icon: 'equal',
      color: 'indigo',
      badge: 'Diversidad'
    }),
    createEfemeride({
      title: 'Docencia y gratitud',
      description:
        'La labor de quienes enseñan deja huellas profundas en la vida de los estudiantes.',
      type: 'educacion',
      icon: 'graduation-cap',
      color: 'blue',
      badge: 'Docencia'
    }),
    createEfemeride({
      title: 'Arte, patrimonio y memoria',
      description:
        'La cultura y la creación siguen siendo claves para una formación integral.',
      type: 'cultural',
      icon: 'palette',
      color: 'pink',
      badge: 'Arte'
    }),
    createEfemeride({
      title: 'Cuidado de la naturaleza',
      description:
        'La primavera nos recuerda la belleza del entorno y la importancia de protegerlo.',
      type: 'medioambiente',
      icon: 'flower-2',
      color: 'green',
      badge: 'Primavera'
    })
  ],
  11: [
    createEfemeride({
      title: 'Derechos y participación',
      description:
        'Noviembre invita a reflexionar sobre la dignidad, los derechos y la responsabilidad social.',
      type: 'derechos',
      icon: 'scale',
      color: 'indigo',
      badge: 'Derechos'
    }),
    createEfemeride({
      title: 'Infancia y protección',
      description:
        'Toda comunidad educativa debe resguardar a niños, niñas y adolescentes con especial compromiso.',
      type: 'derechos',
      icon: 'shield-check',
      color: 'indigo',
      badge: 'Protección'
    }),
    createEfemeride({
      title: 'Ciencia y futuro',
      description:
        'El conocimiento nos ayuda a comprender el mundo y a enfrentar con mejores herramientas los desafíos del mañana.',
      type: 'ciencia',
      icon: 'atom',
      color: 'cyan',
      badge: 'Futuro'
    }),
    createEfemeride({
      title: 'Diálogo y sana convivencia',
      description:
        'Escuchar con respeto y debatir con argumentos fortalece la vida democrática.',
      type: 'convivencia',
      icon: 'messages-square',
      color: 'violet',
      badge: 'Diálogo'
    }),
    createEfemeride({
      title: 'Memoria institucional y cierre de procesos',
      description:
        'Al acercarse el fin del año, también valoramos el esfuerzo realizado y lo aprendido en comunidad.',
      type: 'educacion',
      icon: 'notebook-pen',
      color: 'blue',
      badge: 'Cierre de año'
    })
  ],
  12: [
    createEfemeride({
      title: 'Encuentro y cierre de año',
      description:
        'Diciembre es tiempo de balance, gratitud y reconocimiento por el camino recorrido.',
      type: 'valores',
      icon: 'sparkles',
      color: 'emerald',
      badge: 'Cierre de año'
    }),
    createEfemeride({
      title: 'Derechos humanos y dignidad',
      description:
        'La formación valórica se fortalece cuando reconocemos la dignidad de cada persona.',
      type: 'derechos',
      icon: 'scale',
      color: 'indigo',
      badge: 'Derechos humanos'
    }),
    createEfemeride({
      title: 'Navidad y esperanza',
      description:
        'Estas fechas invitan a renovar la esperanza, el afecto y el sentido de comunidad.',
      type: 'cultural',
      icon: 'gift',
      color: 'red',
      badge: 'Navidad'
    }),
    createEfemeride({
      title: 'Descanso merecido',
      description:
        'Cerrar el año también significa valorar el esfuerzo realizado y abrir espacio al descanso.',
      type: 'valores',
      icon: 'moon-star',
      color: 'sky',
      badge: 'Descanso'
    }),
    createEfemeride({
      title: 'Proyección y nuevos desafíos',
      description:
        'Cada fin de año nos prepara para imaginar con optimismo lo que vendrá.',
      type: 'valores',
      icon: 'rocket',
      color: 'emerald',
      badge: 'Proyección'
    })
  ]
};

// ----------------------
// EFEMÉRIDES ESPECIALES
// ----------------------
const SPECIAL_EFEMERIDES = {
  '01-01': createEfemeride({
    title: 'Año Nuevo',
    description:
      'Comenzamos un nuevo año con esperanza, gratitud y el compromiso de seguir creciendo como comunidad.',
    type: 'cultural',
    icon: 'sparkles',
    color: 'amber',
    official: true,
    badge: 'Conmemoración'
  }),
  '01-04': createEfemeride({
    title: 'Día Mundial del Braille',
    description:
      'Valoramos la inclusión, la accesibilidad y el derecho de todas las personas a participar plenamente en la vida educativa y social.',
    type: 'derechos',
    icon: 'accessibility',
    color: 'indigo',
    official: true,
    badge: 'Inclusión'
  }),
  '01-24': createEfemeride({
    title: 'Día Internacional de la Educación',
    description:
      'Reconocemos la educación como un derecho fundamental y como la base del desarrollo personal y social.',
    type: 'educacion',
    icon: 'graduation-cap',
    color: 'blue',
    official: true,
    badge: 'Educación'
  }),

  '02-11': createEfemeride({
    title: 'Día Internacional de la Mujer y la Niña en la Ciencia',
    description:
      'Promovemos vocaciones científicas sin barreras, con igualdad de oportunidades para niñas y jóvenes.',
    type: 'ciencia',
    icon: 'flask-conical',
    color: 'cyan',
    official: true,
    badge: 'Ciencia'
  }),
  '02-13': createEfemeride({
    title: 'Día Mundial de la Radio',
    description:
      'Reconocemos a la radio como un medio cercano que informa, acompaña y fortalece la vida comunitaria.',
    type: 'cultural',
    icon: 'radio',
    color: 'amber',
    official: true,
    badge: 'Comunicación'
  }),
  '02-20': createEfemeride({
    title: 'Día Mundial de la Justicia Social',
    description:
      'Reflexionamos sobre la importancia de construir una sociedad más equitativa, solidaria e inclusiva.',
    type: 'derechos',
    icon: 'scale',
    color: 'indigo',
    official: true,
    badge: 'Justicia social'
  }),
  '02-21': createEfemeride({
    title: 'Día Internacional de la Lengua Materna',
    description:
      'Valoramos las lenguas como parte esencial de la identidad cultural y del patrimonio de los pueblos.',
    type: 'cultural',
    icon: 'languages',
    color: 'amber',
    official: true,
    badge: 'Lenguaje'
  }),

  '03-01': createEfemeride({
    title: 'Inicio del Año Escolar',
    description:
      'Damos inicio a un nuevo ciclo de aprendizajes, desafíos, convivencia y crecimiento compartido.',
    type: 'educacion',
    icon: 'school',
    color: 'blue',
    official: true,
    badge: 'Año escolar'
  }),
  '03-03': createEfemeride({
    title: 'Día Mundial de la Vida Silvestre',
    description:
      'Promovemos el cuidado de la biodiversidad y el respeto por toda forma de vida.',
    type: 'medioambiente',
    icon: 'paw-print',
    color: 'green',
    official: true,
    badge: 'Naturaleza'
  }),
  '03-08': createEfemeride({
    title: 'Día Internacional de la Mujer',
    description:
      'Reconocemos el aporte de las mujeres en todos los ámbitos de la sociedad y renovamos nuestro compromiso con la igualdad y el respeto.',
    type: 'derechos',
    icon: 'badge-female',
    color: 'pink',
    official: true,
    badge: 'Conmemoración'
  }),
  '03-14': createEfemeride({
    title: 'Día contra el Ciberacoso y la Violencia Digital',
    description:
      'Recordamos la importancia de usar la tecnología con respeto, responsabilidad y empatía.',
    type: 'convivencia',
    icon: 'shield-alert',
    color: 'violet',
    badge: 'Ciudadanía digital'
  }),
  '03-21': createEfemeride({
    title: 'Día Internacional de la Eliminación de la Discriminación Racial',
    description:
      'Promovemos una convivencia basada en la dignidad, el respeto y la igualdad entre todas las personas.',
    type: 'derechos',
    icon: 'equal',
    color: 'indigo',
    official: true,
    badge: 'Igualdad'
  }),
  '03-22': createEfemeride({
    title: 'Día Mundial del Agua',
    description:
      'Invitamos a cuidar este recurso esencial para la vida y para el futuro del planeta.',
    type: 'medioambiente',
    icon: 'droplets',
    color: 'sky',
    official: true,
    badge: 'Agua'
  }),
  '03-24': createEfemeride({
    title: 'Día Mundial de la Tuberculosis',
    description:
      'La prevención, la información y el acceso a la salud siguen siendo fundamentales para el bienestar común.',
    type: 'salud',
    icon: 'heart-pulse',
    color: 'rose',
    official: true,
    badge: 'Salud'
  }),
  '03-26': createEfemeride({
    title: 'Día Mundial del Clima',
    description:
      'Reflexionamos sobre el impacto de nuestras acciones en el medioambiente y en la vida de las futuras generaciones.',
    type: 'medioambiente',
    icon: 'cloud-sun',
    color: 'green',
    official: true,
    badge: 'Clima'
  }),

  '04-02': createEfemeride({
    title: 'Día Mundial de Concienciación sobre el Autismo',
    description:
      'Promovemos la inclusión, el respeto y la valoración de la diversidad en todas sus formas.',
    type: 'derechos',
    icon: 'accessibility',
    color: 'indigo',
    official: true,
    badge: 'Inclusión'
  }),
  '04-06': createEfemeride({
    title: 'Día Internacional del Deporte para el Desarrollo y la Paz',
    description:
      'Destacamos el deporte como una herramienta de salud, trabajo en equipo y formación valórica.',
    type: 'deporte',
    icon: 'dumbbell',
    color: 'orange',
    official: true,
    badge: 'Deporte'
  }),
  '04-07': createEfemeride({
    title: 'Día Mundial de la Salud',
    description:
      'Cuidar la salud física y emocional es clave para aprender, convivir y desarrollarnos plenamente.',
    type: 'salud',
    icon: 'heart-pulse',
    color: 'rose',
    official: true,
    badge: 'Salud'
  }),
  '04-22': createEfemeride({
    title: 'Día de la Tierra',
    description:
      'Renovamos el compromiso de proteger el planeta mediante acciones concretas y hábitos responsables.',
    type: 'medioambiente',
    icon: 'globe',
    color: 'green',
    official: true,
    badge: 'Planeta'
  }),
  '04-23': createEfemeride({
    title: 'Día Internacional del Libro',
    description:
      'Celebramos la lectura como una puerta al conocimiento, la imaginación y la libertad.',
    type: 'cultural',
    icon: 'book-open',
    color: 'amber',
    official: true,
    badge: 'Lectura'
  }),
  '04-26': createEfemeride({
    title: 'Día de Carabineros de Chile',
    description:
      'Reconocemos la labor institucional de Carabineros de Chile en el resguardo del orden público y la seguridad.',
    type: 'civica',
    icon: 'shield',
    color: 'indigo',
    official: true,
    badge: 'Instituciones'
  }),
  '04-27': createEfemeride({
    title: 'Día de la Convivencia Escolar',
    description:
      'Promovemos el buen trato, la empatía y el respeto como bases de toda comunidad educativa.',
    type: 'convivencia',
    icon: 'users',
    color: 'violet',
    official: true,
    badge: 'Convivencia'
  }),
  '04-29': createEfemeride({
    title: 'Día Internacional de la Danza',
    description:
      'Valoramos la expresión artística como parte del desarrollo integral de las personas.',
    type: 'cultural',
    icon: 'music-4',
    color: 'pink',
    official: true,
    badge: 'Arte'
  }),

  '05-01': createEfemeride({
    title: 'Día Internacional del Trabajo',
    description:
      'Valoramos el esfuerzo, la dedicación y la contribución de quienes trabajan día a día por un mejor país.',
    type: 'civica',
    icon: 'briefcase',
    color: 'slate',
    official: true,
    badge: 'Trabajo'
  }),
  '05-03': createEfemeride({
    title: 'Día Mundial de la Libertad de Prensa',
    description:
      'Una sociedad informada y libre fortalece la democracia y la participación ciudadana.',
    type: 'civica',
    icon: 'newspaper',
    color: 'indigo',
    official: true,
    badge: 'Democracia'
  }),
  '05-11': createEfemeride({
    title: 'Día del Estudiante',
    description:
      'Celebramos a quienes dan vida a la escuela con su curiosidad, energía y deseo de aprender.',
    type: 'educacion',
    icon: 'graduation-cap',
    color: 'blue',
    official: true,
    badge: 'Estudiantes'
  }),
  '05-15': createEfemeride({
    title: 'Día Internacional de la Familia',
    description:
      'Reconocemos a la familia como un espacio fundamental de apoyo, formación y afecto.',
    type: 'convivencia',
    icon: 'home',
    color: 'violet',
    official: true,
    badge: 'Familia'
  }),
  '05-17': createEfemeride({
    title: 'Día Internacional contra la Homofobia, la Transfobia y la Bifobia',
    description:
      'Promovemos el respeto irrestricto por la dignidad de cada persona y la convivencia sin discriminación.',
    type: 'derechos',
    icon: 'equal',
    color: 'indigo',
    official: true,
    badge: 'Respeto'
  }),
  '05-21': createEfemeride({
    title: 'Día de las Glorias Navales',
    description:
      'Recordamos un hito significativo de la historia de Chile y honramos la memoria de quienes sirvieron al país.',
    type: 'patriotica',
    icon: 'anchor',
    color: 'red',
    official: true,
    badge: 'Historia de Chile'
  }),
  '05-22': createEfemeride({
    title: 'Día Internacional de la Diversidad Biológica',
    description:
      'Cuidar la biodiversidad es proteger la vida, los ecosistemas y nuestro futuro común.',
    type: 'medioambiente',
    icon: 'leaf',
    color: 'green',
    official: true,
    badge: 'Biodiversidad'
  }),
  '05-28': createEfemeride({
    title: 'Día del Juego',
    description:
      'Reconocemos el juego como una experiencia clave para aprender, crear y desarrollarse integralmente.',
    type: 'educacion',
    icon: 'blocks',
    color: 'blue',
    badge: 'Infancia'
  }),
  '05-31': createEfemeride({
    title: 'Día Mundial Sin Tabaco',
    description:
      'Fomentamos decisiones saludables y acciones de prevención para cuidar la vida y la salud.',
    type: 'salud',
    icon: 'heart-pulse',
    color: 'rose',
    official: true,
    badge: 'Prevención'
  }),

  '06-05': createEfemeride({
    title: 'Día Mundial del Medio Ambiente',
    description:
      'Promovemos el cuidado del entorno, la conciencia ecológica y el compromiso con el planeta.',
    type: 'medioambiente',
    icon: 'leaf',
    color: 'green',
    official: true,
    badge: 'Medioambiente'
  }),
  '06-08': createEfemeride({
    title: 'Día Mundial de los Océanos',
    description:
      'Chile es un país de mar; cuidar los océanos es también cuidar nuestra identidad y nuestro futuro.',
    type: 'medioambiente',
    icon: 'waves',
    color: 'sky',
    official: true,
    badge: 'Océanos'
  }),
  '06-12': createEfemeride({
    title: 'Día Mundial contra el Trabajo Infantil',
    description:
      'Defendemos el derecho de niños y niñas a crecer, aprender y desarrollarse protegidos.',
    type: 'derechos',
    icon: 'shield-check',
    color: 'indigo',
    official: true,
    badge: 'Infancia protegida'
  }),
  '06-19': createEfemeride({
    title: 'Día de la Policía de Investigaciones de Chile',
    description:
      'Reconocemos la labor institucional de la PDI en la investigación criminal y el servicio al país.',
    type: 'civica',
    icon: 'search',
    color: 'indigo',
    official: true,
    badge: 'Instituciones'
  }),
  '06-21': createEfemeride({
    title: 'Día Nacional de los Pueblos Indígenas',
    description:
      'Valoramos la riqueza cultural, espiritual e histórica de los pueblos originarios presentes en Chile.',
    type: 'cultural',
    icon: 'mountain',
    color: 'amber',
    official: true,
    badge: 'Pueblos originarios'
  }),
  '06-24': createEfemeride({
    title: 'We Tripantu y Año Nuevo de los Pueblos Originarios',
    description:
      'Saludamos este tiempo de renovación de la naturaleza y de profunda significación cultural.',
    type: 'cultural',
    icon: 'sunrise',
    color: 'amber',
    badge: 'Renovación'
  }),
  '06-26': createEfemeride({
    title: 'Día Nacional de la Prevención del Consumo de Drogas',
    description:
      'La prevención, la información y el acompañamiento son claves para el cuidado de la salud.',
    type: 'salud',
    icon: 'shield-plus',
    color: 'rose',
    badge: 'Prevención'
  }),
  '06-30': createEfemeride({
    title: 'Día Nacional del Bombero',
    description:
      'Reconocemos con gratitud la vocación de servicio de Bomberos de Chile.',
    type: 'civica',
    icon: 'flame',
    color: 'red',
    official: true,
    badge: 'Servicio'
  }),

  '07-01': createEfemeride({
    title: 'Inicio del segundo semestre escolar',
    description:
      'Renovamos energías para continuar el año con metas, compromiso y nuevos aprendizajes.',
    type: 'educacion',
    icon: 'school',
    color: 'blue',
    badge: 'Segundo semestre'
  }),
  '07-09': createEfemeride({
    title: 'Día de la Bandera',
    description:
      'Nuestros símbolos patrios representan historia, identidad y pertenencia.',
    type: 'patriotica',
    icon: 'flag',
    color: 'red',
    official: true,
    badge: 'Símbolos patrios'
  }),
  '07-12': createEfemeride({
    title: 'Natalicio de Pablo Neruda',
    description:
      'Recordamos la huella literaria de uno de los poetas chilenos más influyentes del mundo.',
    type: 'cultural',
    icon: 'pen-tool',
    color: 'pink',
    badge: 'Literatura chilena'
  }),
  '07-30': createEfemeride({
    title: 'Día Mundial contra la Trata de Personas',
    description:
      'Reflexionamos sobre la dignidad humana y la necesidad de proteger a las personas frente a toda forma de abuso.',
    type: 'derechos',
    icon: 'shield-alert',
    color: 'indigo',
    official: true,
    badge: 'Dignidad humana'
  }),

  '08-01': createEfemeride({
    title: 'Mes de la Solidaridad',
    description:
      'Iniciamos un tiempo que en Chile invita a servir, acompañar y pensar en los demás con generosidad.',
    type: 'valores',
    icon: 'heart-handshake',
    color: 'emerald',
    badge: 'Solidaridad'
  }),
  '08-09': createEfemeride({
    title: 'Día Internacional de los Pueblos Indígenas',
    description:
      'Valoramos el aporte de los pueblos originarios a la identidad, la memoria y la diversidad cultural.',
    type: 'cultural',
    icon: 'mountain',
    color: 'amber',
    official: true,
    badge: 'Diversidad cultural'
  }),
  '08-12': createEfemeride({
    title: 'Día Internacional de la Juventud',
    description:
      'Reconocemos a las y los jóvenes como protagonistas del presente y constructores del futuro.',
    type: 'educacion',
    icon: 'rocket',
    color: 'blue',
    official: true,
    badge: 'Juventud'
  }),
  '08-18': createEfemeride({
    title: 'Día de la Solidaridad',
    description:
      'Inspirados en la memoria de san Alberto Hurtado, destacamos el valor de ayudar al prójimo.',
    type: 'valores',
    icon: 'hand-heart',
    color: 'emerald',
    official: true,
    badge: 'Solidaridad'
  }),
  '08-19': createEfemeride({
    title: 'Día Mundial de la Asistencia Humanitaria',
    description:
      'Reconocemos a quienes sirven en contextos difíciles para aliviar el sufrimiento humano.',
    type: 'derechos',
    icon: 'heart-handshake',
    color: 'indigo',
    official: true,
    badge: 'Ayuda humanitaria'
  }),
  '08-26': createEfemeride({
    title: 'Día de la Educación Técnico-Profesional',
    description:
      'Valoramos la formación técnico-profesional y su aporte al desarrollo del país.',
    type: 'educacion',
    icon: 'wrench',
    color: 'blue',
    official: true,
    badge: 'Formación TP'
  }),
  '08-29': createEfemeride({
    title: 'Día del Árbol',
    description:
      'Promovemos el cuidado de los árboles como parte esencial de un ambiente sano y equilibrado.',
    type: 'medioambiente',
    icon: 'tree-pine',
    color: 'green',
    badge: 'Naturaleza'
  }),

  '09-04': createEfemeride({
    title: 'Día Nacional del Vino Chileno',
    description:
      'Reconocemos una expresión productiva y cultural profundamente vinculada a la historia de Chile.',
    type: 'patrimonio',
    icon: 'glass-water',
    color: 'amber',
    official: true,
    badge: 'Patrimonio'
  }),
  '09-08': createEfemeride({
    title: 'Día Internacional de la Alfabetización',
    description:
      'La alfabetización abre oportunidades, fortalece la autonomía y favorece la participación.',
    type: 'educacion',
    icon: 'book-open',
    color: 'blue',
    official: true,
    badge: 'Alfabetización'
  }),
  '09-11': createEfemeride({
    title: 'Memoria y reflexión democrática',
    description:
      'Invitamos a reflexionar con respeto sobre la historia reciente de Chile y el valor de la democracia.',
    type: 'civica',
    icon: 'scroll-text',
    color: 'indigo',
    badge: 'Memoria'
  }),
  '09-18': createEfemeride({
    title: 'Fiestas Patrias',
    description:
      'Celebramos nuestra historia, nuestras tradiciones y el orgullo de ser parte de Chile.',
    type: 'patriotica',
    icon: 'flag',
    color: 'red',
    official: true,
    badge: 'Patria'
  }),
  '09-19': createEfemeride({
    title: 'Día de las Glorias del Ejército',
    description:
      'Reconocemos el lugar de esta conmemoración en la historia cívica del país.',
    type: 'patriotica',
    icon: 'shield',
    color: 'red',
    official: true,
    badge: 'Historia de Chile'
  }),
  '09-21': createEfemeride({
    title: 'Día Internacional de la Paz',
    description:
      'Renovamos el compromiso con una convivencia basada en el diálogo, el respeto y la cooperación.',
    type: 'convivencia',
    icon: 'handshake',
    color: 'violet',
    official: true,
    badge: 'Paz'
  }),
  '09-26': createEfemeride({
    title: 'Día Marítimo Mundial',
    description:
      'Como país oceánico, Chile mantiene una profunda relación con el mar y sus desafíos.',
    type: 'patriotica',
    icon: 'ship',
    color: 'red',
    official: true,
    badge: 'Mar'
  }),
  '09-27': createEfemeride({
    title: 'Día Mundial del Turismo',
    description:
      'Valorar el patrimonio natural y cultural también implica conocerlo y cuidarlo.',
    type: 'patrimonio',
    icon: 'map',
    color: 'amber',
    official: true,
    badge: 'Patrimonio'
  }),

  '10-01': createEfemeride({
    title: 'Día Internacional de las Personas Mayores',
    description:
      'Reconocemos la experiencia, la memoria y el aporte de las personas mayores a la sociedad.',
    type: 'derechos',
    icon: 'users-round',
    color: 'indigo',
    official: true,
    badge: 'Respeto'
  }),
  '10-05': createEfemeride({
    title: 'Día Mundial de los Docentes',
    description:
      'Agradecemos la labor de quienes enseñan, orientan y acompañan procesos de aprendizaje.',
    type: 'educacion',
    icon: 'graduation-cap',
    color: 'blue',
    official: true,
    badge: 'Docentes'
  }),
  '10-10': createEfemeride({
    title: 'Día Mundial de la Salud Mental',
    description:
      'Cuidar la salud mental es esencial para una vida equilibrada, respetuosa y humana.',
    type: 'salud',
    icon: 'brain',
    color: 'rose',
    official: true,
    badge: 'Salud mental'
  }),
  '10-11': createEfemeride({
    title: 'Día Internacional de la Niña',
    description:
      'Promovemos derechos, oportunidades y protección para todas las niñas.',
    type: 'derechos',
    icon: 'baby',
    color: 'indigo',
    official: true,
    badge: 'Niñez'
  }),
  '10-12': createEfemeride({
    title: 'Encuentro de Dos Mundos',
    description:
      'Reflexionamos sobre la historia, la diversidad cultural y los procesos que dieron forma a nuestra sociedad.',
    type: 'cultural',
    icon: 'globe',
    color: 'amber',
    official: true,
    badge: 'Historia y cultura'
  }),
  '10-13': createEfemeride({
    title: 'Día Internacional para la Reducción del Riesgo de Desastres',
    description:
      'En un país sísmico y diverso como Chile, la prevención y la preparación son fundamentales.',
    type: 'civica',
    icon: 'triangle-alert',
    color: 'indigo',
    official: true,
    badge: 'Prevención'
  }),
  '10-15': createEfemeride({
    title: 'Día Mundial del Lavado de Manos',
    description:
      'Los hábitos de higiene son sencillos, pero muy importantes para la salud y la prevención.',
    type: 'salud',
    icon: 'hand',
    color: 'rose',
    official: true,
    badge: 'Autocuidado'
  }),
  '10-16': createEfemeride({
    title: 'Día del Profesor y la Profesora',
    description:
      'Reconocemos con gratitud a quienes enseñan con vocación, conocimiento y compromiso.',
    type: 'educacion',
    icon: 'graduation-cap',
    color: 'blue',
    official: true,
    badge: 'Reconocimiento'
  }),
  '10-24': createEfemeride({
    title: 'Día de las Bibliotecas',
    description:
      'Las bibliotecas son espacios de encuentro con la lectura, el estudio y la memoria.',
    type: 'cultural',
    icon: 'library',
    color: 'amber',
    badge: 'Lectura'
  }),
  '10-27': createEfemeride({
    title: 'Día de las Manipuladoras y Manipuladores de Alimentos',
    description:
      'Valoramos a quienes, con dedicación, contribuyen al cuidado alimentario de la comunidad escolar.',
    type: 'civica',
    icon: 'utensils',
    color: 'indigo',
    badge: 'Comunidad escolar'
  }),

  '11-05': createEfemeride({
    title: 'Día Mundial de Concienciación sobre los Tsunamis',
    description:
      'En Chile, la educación preventiva es clave para cuidar la vida frente a riesgos naturales.',
    type: 'civica',
    icon: 'waves',
    color: 'indigo',
    official: true,
    badge: 'Prevención'
  }),
  '11-06': createEfemeride({
    title: 'Día Internacional contra la Violencia y el Acoso en la Escuela',
    description:
      'Reafirmamos el compromiso con una convivencia segura, respetuosa y libre de violencia.',
    type: 'convivencia',
    icon: 'shield-alert',
    color: 'violet',
    official: true,
    badge: 'Buen trato'
  }),
  '11-10': createEfemeride({
    title: 'Día Mundial de la Ciencia para la Paz y el Desarrollo',
    description:
      'La ciencia aporta herramientas concretas para mejorar la vida de las personas y construir futuro.',
    type: 'ciencia',
    icon: 'atom',
    color: 'cyan',
    official: true,
    badge: 'Ciencia'
  }),
  '11-12': createEfemeride({
    title: 'Día del Diálogo y el Debate',
    description:
      'Escuchar, argumentar y dialogar con respeto fortalece la vida democrática.',
    type: 'convivencia',
    icon: 'messages-square',
    color: 'violet',
    badge: 'Diálogo'
  }),
  '11-16': createEfemeride({
    title: 'Día Internacional de la Tolerancia',
    description:
      'Promovemos el respeto por la diversidad y la convivencia pacífica.',
    type: 'derechos',
    icon: 'equal',
    color: 'indigo',
    official: true,
    badge: 'Respeto'
  }),
  '11-19': createEfemeride({
    title: 'Día de los Patrimonios de Niñas, Niños y Adolescentes',
    description:
      'La infancia y la adolescencia también forman parte viva del patrimonio cultural del país.',
    type: 'patrimonio',
    icon: 'landmark',
    color: 'amber',
    badge: 'Patrimonio'
  }),
  '11-20': createEfemeride({
    title: 'Día Universal de los Derechos del Niño y la Niña',
    description:
      'Recordamos el deber de proteger, escuchar y resguardar integralmente a niños y niñas.',
    type: 'derechos',
    icon: 'shield-check',
    color: 'indigo',
    official: true,
    badge: 'Derechos de la niñez'
  }),
  '11-25': createEfemeride({
    title: 'Día Internacional de la Eliminación de la Violencia contra la Mujer',
    description:
      'Reafirmamos el compromiso con el respeto, la igualdad y la erradicación de toda forma de violencia.',
    type: 'derechos',
    icon: 'shield-alert',
    color: 'indigo',
    official: true,
    badge: 'No violencia'
  }),

  '12-03': createEfemeride({
    title: 'Día Internacional de las Personas con Discapacidad',
    description:
      'Promovemos una sociedad accesible, inclusiva y respetuosa de la diversidad.',
    type: 'derechos',
    icon: 'accessibility',
    color: 'indigo',
    official: true,
    badge: 'Inclusión'
  }),
  '12-10': createEfemeride({
    title: 'Día de los Derechos Humanos',
    description:
      'La dignidad humana, la justicia y la igualdad deben orientar toda convivencia democrática.',
    type: 'derechos',
    icon: 'scale',
    color: 'indigo',
    official: true,
    badge: 'Derechos humanos'
  }),
  '12-18': createEfemeride({
    title: 'Día Internacional del Migrante',
    description:
      'Reconocemos el aporte de las personas migrantes a la vida social, cultural y comunitaria.',
    type: 'derechos',
    icon: 'plane',
    color: 'indigo',
    official: true,
    badge: 'Diversidad'
  }),
  '12-24': createEfemeride({
    title: 'Víspera de Navidad',
    description:
      'Tiempo de encuentro, gratitud y esperanza compartida.',
    type: 'cultural',
    icon: 'gift',
    color: 'red',
    badge: 'Navidad'
  }),
  '12-25': createEfemeride({
    title: 'Navidad',
    description:
      'Celebramos una fecha que invita a la paz, la solidaridad y el encuentro familiar.',
    type: 'cultural',
    icon: 'gift',
    color: 'red',
    official: true,
    badge: 'Celebración'
  }),
  '12-31': createEfemeride({
    title: 'Cierre del año',
    description:
      'Despedimos el año valorando lo vivido, lo aprendido y las metas que están por venir.',
    type: 'valores',
    icon: 'sparkles',
    color: 'emerald',
    badge: 'Nuevo comienzo'
  })
};

// ----------------------
// GENERACIÓN DE 365 DÍAS
// ----------------------
function buildEfemerides(year = 2026) {
  const map = {};
  const start = new Date(year, 0, 1);
  const cursor = new Date(start);

  while (cursor.getFullYear() === year) {
    const month = cursor.getMonth() + 1;
    const day = cursor.getDate();
    const key = `${pad(month)}-${pad(day)}`;

    if (SPECIAL_EFEMERIDES[key]) {
      map[key] = SPECIAL_EFEMERIDES[key];
    } else {
      const themeList = MONTHLY_THEMES[month];
      map[key] = themeList[(day - 1) % themeList.length];
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return map;
}

export const EFEMERIDES = buildEfemerides(2026);

// ----------------------
// API PRINCIPAL
// ----------------------
export function getEfemerideForDate(date = new Date()) {
  const key = getKeyFromDate(date);
  return EFEMERIDES[key];
}

export function getEfemerideHoy() {
  return getEfemerideForDate(new Date());
}

export function getEfemeridesForYear(year = 2026) {
  const map = buildEfemerides(year);

  return Object.entries(map).map(([key, value]) => {
    const [month, day] = key.split('-');
    const date = `${year}-${month}-${day}`;

    return {
      id: `efemeride-${date}`,
      date,
      createdAt: `${date}T00:00:00`,
      title: value.title,
      description: value.description,
      type: value.type,
      icon: value.icon,
      color: value.color,
      official: value.official,
      badge: value.badge,
      category: 'efemeride',
      isEfemeride: true
    };
  });
}

// ----------------------
// HELPERS VISUALES
// ----------------------
export function getColorClasses(color = 'emerald') {
  const colors = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badge: 'bg-emerald-600 text-white'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      badge: 'bg-blue-600 text-white'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      badge: 'bg-indigo-600 text-white'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      badge: 'bg-red-600 text-white'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-500 text-slate-900'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      badge: 'bg-green-600 text-white'
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      badge: 'bg-violet-600 text-white'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      badge: 'bg-rose-600 text-white'
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      border: 'border-pink-200',
      badge: 'bg-pink-600 text-white'
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      badge: 'bg-cyan-600 text-white'
    },
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      badge: 'bg-sky-600 text-white'
    },
    slate: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-700 text-white'
    }
  };

  return colors[color] || colors.emerald;
}