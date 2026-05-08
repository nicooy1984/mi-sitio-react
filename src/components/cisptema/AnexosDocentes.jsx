import React, { useMemo, useState } from "react";
import {
  Search,
  FileText,
  UserRound,
  BadgeCheck,
  BriefcaseBusiness,
  Wallet,
  Clock,
  Layers,
  AlertCircle,
  Printer,
} from "lucide-react";

const tiposAnexosDocentes = {
  remuneraciones: {
    label: "Remuneraciones",
    descripcion:
      "Actualizaciones de sueldo, bonos, reajustes y remuneración mensual.",
    tipos: [
      {
        id: "actualizacion_remuneraciones",
        label: "Actualización de remuneraciones",
      },
      {
        id: "reajuste_legal",
        label: "Reajuste legal / reajuste anual",
      },
      {
        id: "modificacion_bono",
        label: "Incorporación o modificación de bono",
      },
      {
        id: "correccion_remuneracion",
        label: "Corrección de remuneración por error administrativo",
      },
    ],
  },

  jornada_horas: {
    label: "Jornada y horas",
    descripcion:
      "Aumentos, disminuciones, renuncias o cambios de distribución horaria.",
    tipos: [
      {
        id: "aumento_horas",
        label: "Aumento de horas",
      },
      {
        id: "disminucion_horas",
        label: "Disminución de horas por mutuo acuerdo",
      },
      {
        id: "renuncia_horas",
        label: "Renuncia voluntaria a parte de la jornada",
      },
      {
        id: "termino_horas_adicionales",
        label: "Término de horas adicionales o transitorias",
      },
      {
        id: "cambio_distribucion_horaria",
        label: "Cambio de distribución horaria",
      },
      {
        id: "adecuacion_ley_40_horas",
        label: "Adecuación por Ley 40 horas",
      },
      {
        id: "cambio_horario",
        label: "Cambio de horario sin modificar total de horas",
      },
    ],
  },

  funciones: {
    label: "Funciones",
    descripcion:
      "Cambios de cargo, curso, nivel, asignatura o labores específicas.",
    tipos: [
      {
        id: "cambio_funcion",
        label: "Cambio de función",
      },
      {
        id: "funcion_adicional",
        label: "Incorporación de función adicional",
      },
      {
        id: "cambio_curso_nivel",
        label: "Cambio de curso o nivel",
      },
      {
        id: "cambio_asignatura",
        label: "Cambio de asignatura",
      },
      {
        id: "cambio_labor_sep",
        label: "Cambio de labores SEP",
      },
    ],
  },

  financiamiento: {
    label: "Financiamiento General / SEP",
    descripcion:
      "Anexos relacionados con imputación General, SEP o modalidad mixta.",
    tipos: [
      {
        id: "anexo_general",
        label: "Anexo General",
      },
      {
        id: "anexo_sep",
        label: "Anexo SEP",
      },
      {
        id: "anexo_mixto",
        label: "Anexo Mixto General + SEP",
      },
      {
        id: "cambio_general_sep",
        label: "Cambio de imputación General / SEP",
      },
      {
        id: "distribucion_general_sep",
        label: "Distribución de horas General / SEP",
      },
    ],
  },

  datos_administrativos: {
    label: "Datos personales o administrativos",
    descripcion:
      "Actualización de datos bancarios, correo, domicilio u otros antecedentes.",
    tipos: [
      {
        id: "datos_personales",
        label: "Rectificación de datos personales",
      },
      {
        id: "datos_bancarios",
        label: "Actualización de datos bancarios",
      },
      {
        id: "correo_notificacion",
        label: "Actualización de correo electrónico",
      },
      {
        id: "domicilio",
        label: "Actualización de domicilio",
      },
    ],
  },

  termino_regularizacion: {
    label: "Término o regularización",
    descripcion:
      "Término de funciones, asignaciones, horas especiales o regularizaciones.",
    tipos: [
      {
        id: "termino_funcion",
        label: "Término de función específica",
      },
      {
        id: "termino_asignacion_sep",
        label: "Término de asignación SEP",
      },
      {
        id: "regularizacion_contractual",
        label: "Regularización contractual",
      },
      {
        id: "reconocimiento_antiguedad",
        label: "Reconocimiento de antigüedad",
      },
    ],
  },
};

const contratosSimulados = [
  {
    id: "contrato_001",
    rut: "16.302.636-8",
    nombreCompleto: "María Paz Durán Herrera",
    tipoTrabajador: "Asistente de la Educación",
    financiamiento: "SEP",
    cargoFuncion: "Asistente de la Educación SEP",
    horasContrato: 44,
    fechaContrato: "2025-03-01",
    remuneracionBruta: 1092524,
    sueldoBaseGeneral: 0,
    sueldoBaseSEP: 1079588,
    bonosFijos: 12936,
    detalleBonos: "Ley 19.464",
    banco: "Credichile",
    tipoCuenta: "Cuenta Vista",
    numeroCuenta: "00071714087",
    correoPersonal: "",
  },
  {
    id: "contrato_002",
    rut: "12.345.678-9",
    nombreCompleto: "Profesor Ejemplo General",
    tipoTrabajador: "Docente",
    financiamiento: "GENERAL",
    cargoFuncion: "Profesor de Educación General Básica",
    horasContrato: 38,
    fechaContrato: "2025-03-01",
    remuneracionBruta: 950000,
    sueldoBaseGeneral: 950000,
    sueldoBaseSEP: 0,
    bonosFijos: 0,
    detalleBonos: "",
    banco: "Banco Estado",
    tipoCuenta: "Cuenta RUT",
    numeroCuenta: "12345678",
    correoPersonal: "profesor@correo.cl",
  },
  {
    id: "contrato_003",
    rut: "11.111.111-1",
    nombreCompleto: "Docente Ejemplo Mixto",
    tipoTrabajador: "Docente",
    financiamiento: "MIXTO GENERAL / SEP",
    cargoFuncion: "Profesor con horas generales y horas SEP",
    horasContrato: 44,
    fechaContrato: "2025-03-01",
    remuneracionBruta: 1200000,
    sueldoBaseGeneral: 800000,
    sueldoBaseSEP: 350000,
    bonosFijos: 50000,
    detalleBonos: "Asignación fija mensual",
    banco: "Banco de Chile",
    tipoCuenta: "Cuenta Corriente",
    numeroCuenta: "987654321",
    correoPersonal: "docente@correo.cl",
  },
];

const datosInicialesAnexo = {
  fechaAnexo: "",
  fechaDesde: "",
  leyReferencia: "Ley N°21.647",
  motivoActualizacion: "actualización de cláusula de remuneraciones",
  sueldoBaseGeneral: "",
  sueldoBaseSEP: "",
  bonosFijos: "",
  detalleBonos: "",
  remuneracionBruta: "",

  horasAnteriores: "",
  horasNuevas: "",
  horasVariacion: "",
  nuevaRemuneracionBruta: "",
  motivoJornada: "",
  nuevaDistribucionHoraria: "",
  declaracionVoluntariedad:
    "El trabajador(a) declara que la presente modificación se realiza de manera libre, voluntaria e informada, sin mediar presión alguna.",

  funcionAnterior: "",
  nuevaFuncion: "",
  cursoNivelAnterior: "",
  cursoNivelNuevo: "",
  asignaturaAnterior: "",
  asignaturaNueva: "",
  detalleLabores: "",
  motivoFuncion: "",

  financiamientoAnterior: "",
  nuevoFinanciamiento: "",
  horasGeneral: "",
  horasSEP: "",
  proyectoSEP: "",
  laborSEP: "",
  fundamentoFinanciamiento: "",

  datoAdministrativo: "",
  valorAnterior: "",
  valorNuevo: "",
  bancoAnterior: "",
  bancoNuevo: "",
  tipoCuentaAnterior: "",
  tipoCuentaNuevo: "",
  numeroCuentaAnterior: "",
  numeroCuentaNuevo: "",
  correoAnterior: "",
  correoNuevo: "",
  domicilioAnterior: "",
  domicilioNuevo: "",
  observacionAdministrativa: "",

  tipoTerminoRegularizacion: "",
  funcionAsignacionTermina: "",
  fechaTermino: "",
  motivoTerminoRegularizacion: "",
  detalleRegularizacion: "",
  fechaIngresoReconocida: "",
  antiguedadReconocida: "",
  observacionTerminoRegularizacion: "",
};

function normalizarRut(rut = "") {
  return rut
    .toString()
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase();
}

function formatoPeso(valor) {
  const numero = Number(valor || 0);

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(numero);
}

function formatoFechaDocumento(fecha) {
  if (!fecha) return "___ de __________ de 20__";

  const [year, month, day] = fecha.split("-");
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const indiceMes = Number(month) - 1;
  const nombreMes = meses[indiceMes] || "__________";

  return `${day} de ${nombreMes} de ${year}`;
}

function formatoFechaDesde(fecha) {
  if (!fecha) return "la fecha indicada por las partes";
  return formatoFechaDocumento(fecha);
}

export default function AnexosDocentes() {
  const [rutBusqueda, setRutBusqueda] = useState("");
  const [trabajadorEncontrado, setTrabajadorEncontrado] = useState(null);
  const [mensajeError, setMensajeError] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [datosAnexo, setDatosAnexo] = useState(datosInicialesAnexo);

  const categoriaActual = useMemo(() => {
    if (!categoriaSeleccionada) return null;
    return tiposAnexosDocentes[categoriaSeleccionada] || null;
  }, [categoriaSeleccionada]);

  const tipoAnexoActual = useMemo(() => {
    if (!categoriaActual || !tipoSeleccionado) return null;
    return (
      categoriaActual.tipos.find((item) => item.id === tipoSeleccionado) || null
    );
  }, [categoriaActual, tipoSeleccionado]);

  const buscarTrabajadorPorRut = () => {
    setMensajeError("");
    setTrabajadorEncontrado(null);
    setCategoriaSeleccionada("");
    setTipoSeleccionado("");
    setDatosAnexo(datosInicialesAnexo);

    const rutNormalizado = normalizarRut(rutBusqueda);

    if (!rutNormalizado) {
      setMensajeError("Debes ingresar un RUT para buscar.");
      return;
    }

    const contratoEncontrado = contratosSimulados.find(
      (contrato) => normalizarRut(contrato.rut) === rutNormalizado
    );

    if (!contratoEncontrado) {
      setMensajeError(
        "No se encontró un contrato principal asociado a este RUT."
      );
      return;
    }

    setTrabajadorEncontrado(contratoEncontrado);

    setDatosAnexo({
      fechaAnexo: "",
      fechaDesde: "",
      leyReferencia: "Ley N°21.647",
      motivoActualizacion: "actualización de cláusula de remuneraciones",
      sueldoBaseGeneral: contratoEncontrado.sueldoBaseGeneral || "",
      sueldoBaseSEP: contratoEncontrado.sueldoBaseSEP || "",
      bonosFijos: contratoEncontrado.bonosFijos || "",
      detalleBonos: contratoEncontrado.detalleBonos || "",
      remuneracionBruta: contratoEncontrado.remuneracionBruta || "",

      horasAnteriores: contratoEncontrado.horasContrato || "",
      horasNuevas: "",
      horasVariacion: "",
      nuevaRemuneracionBruta: "",
      motivoJornada: "",
      nuevaDistribucionHoraria: "",
      declaracionVoluntariedad:
        "El trabajador(a) declara que la presente modificación se realiza de manera libre, voluntaria e informada, sin mediar presión alguna.",

      funcionAnterior: contratoEncontrado.cargoFuncion || "",
      nuevaFuncion: "",
      cursoNivelAnterior: "",
      cursoNivelNuevo: "",
      asignaturaAnterior: "",
      asignaturaNueva: "",
      detalleLabores: "",
      motivoFuncion: "",

      financiamientoAnterior: contratoEncontrado.financiamiento || "",
      nuevoFinanciamiento: "",
      horasGeneral:
        contratoEncontrado.sueldoBaseGeneral > 0
          ? contratoEncontrado.horasContrato
          : "",
      horasSEP:
        contratoEncontrado.sueldoBaseSEP > 0
          ? contratoEncontrado.horasContrato
          : "",
      proyectoSEP: "",
      laborSEP: "",
      fundamentoFinanciamiento: "",

      datoAdministrativo: "",
      valorAnterior: "",
      valorNuevo: "",
      bancoAnterior: contratoEncontrado.banco || "",
      bancoNuevo: "",
      tipoCuentaAnterior: contratoEncontrado.tipoCuenta || "",
      tipoCuentaNuevo: "",
      numeroCuentaAnterior: contratoEncontrado.numeroCuenta || "",
      numeroCuentaNuevo: "",
      correoAnterior: contratoEncontrado.correoPersonal || "",
      correoNuevo: "",
      domicilioAnterior: "",
      domicilioNuevo: "",
      observacionAdministrativa: "",

      tipoTerminoRegularizacion: "",
      funcionAsignacionTermina: "",
      fechaTermino: "",
      motivoTerminoRegularizacion: "",
      detalleRegularizacion: "",
      fechaIngresoReconocida: "",
      antiguedadReconocida: "",
      observacionTerminoRegularizacion: "",
    });
  };

  const manejarCategoria = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setTipoSeleccionado("");
  };

  const manejarCambioDatoAnexo = (campo, valor) => {
    setDatosAnexo((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const imprimirVistaPrevia = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-6 py-8 text-white sm:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-blue-100">
                <FileText size={16} />
                CISPTEMA
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Anexos Docentes
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">
                Busca el contrato principal por RUT y genera anexos dependientes
                de la información contractual ya registrada.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm text-slate-100">
              <p className="font-semibold">Lógica del módulo</p>
              <p className="mt-1 text-slate-300">
                El anexo nunca nace vacío: siempre depende del contrato
                principal.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <Search className="text-blue-700" size={22} />
              Buscar trabajador
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ingresa el RUT del trabajador para cruzar la información con su
              contrato principal.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={rutBusqueda}
                onChange={(event) => setRutBusqueda(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") buscarTrabajadorPorRut();
                }}
                placeholder="Ej: 16.302.636-8"
                className="h-12 flex-1 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={buscarTrabajadorPorRut}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
              >
                <Search size={18} />
                Buscar
              </button>
            </div>

            {mensajeError && (
              <div className="mt-4 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                <p>{mensajeError}</p>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-800">
                RUT de prueba disponibles:
              </p>
              <p className="mt-1">16.302.636-8</p>
              <p>12.345.678-9</p>
              <p>11.111.111-1</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            {!trabajadorEncontrado ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-[1.3rem] bg-slate-50 p-8 text-center">
                <UserRound className="mb-4 text-slate-400" size={42} />
                <h3 className="text-lg font-black text-slate-900">
                  Sin trabajador seleccionado
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Cuando busques por RUT, aquí aparecerá la ficha resumida del
                  contrato principal.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 rounded-[1.3rem] bg-gradient-to-br from-blue-50 to-slate-50 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                      <BadgeCheck size={14} />
                      Contrato encontrado
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-slate-950">
                      {trabajadorEncontrado.nombreCompleto}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      RUT: {trabajadorEncontrado.rut}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                    <p className="font-black text-slate-900">
                      {trabajadorEncontrado.financiamiento}
                    </p>
                    <p className="text-slate-500">Financiamiento</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard
                    icon={<BriefcaseBusiness size={19} />}
                    label="Tipo trabajador"
                    value={trabajadorEncontrado.tipoTrabajador}
                  />
                  <InfoCard
                    icon={<Layers size={19} />}
                    label="Cargo / función"
                    value={trabajadorEncontrado.cargoFuncion}
                  />
                  <InfoCard
                    icon={<Clock size={19} />}
                    label="Horas contrato"
                    value={`${trabajadorEncontrado.horasContrato} horas`}
                  />
                  <InfoCard
                    icon={<Wallet size={19} />}
                    label="Remuneración bruta"
                    value={formatoPeso(trabajadorEncontrado.remuneracionBruta)}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-black text-slate-900">
                    Datos de pago registrados
                  </p>

                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Banco
                      </p>
                      <p className="font-semibold text-slate-800">
                        {trabajadorEncontrado.banco || "No registrado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Tipo cuenta
                      </p>
                      <p className="font-semibold text-slate-800">
                        {trabajadorEncontrado.tipoCuenta || "No registrado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        N° cuenta
                      </p>
                      <p className="font-semibold text-slate-800">
                        {trabajadorEncontrado.numeroCuenta || "No registrado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {trabajadorEncontrado && (
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-950">
              Categoría del anexo
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Selecciona primero el grupo general del anexo que deseas generar.
            </p>

            <div className="mt-5 space-y-3">
              {Object.entries(tiposAnexosDocentes).map(
                ([categoriaId, categoria]) => {
                  const activo = categoriaSeleccionada === categoriaId;

                  return (
                    <button
                      key={categoriaId}
                      type="button"
                      onClick={() => manejarCategoria(categoriaId)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        activo
                          ? "border-blue-700 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      <p
                        className={`font-black ${
                          activo ? "text-blue-800" : "text-slate-900"
                        }`}
                      >
                        {categoria.label}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {categoria.descripcion}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-950">
              Tipo específico de anexo
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Según la categoría seleccionada, aquí aparecerán las opciones
              disponibles.
            </p>

            {!categoriaActual ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                Primero selecciona una categoría de anexo.
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {categoriaActual.tipos.map((tipo) => {
                  const activo = tipoSeleccionado === tipo.id;

                  return (
                    <button
                      key={tipo.id}
                      type="button"
                      onClick={() => setTipoSeleccionado(tipo.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        activo
                          ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-black">{tipo.label}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {categoriaSeleccionada === "remuneraciones" && tipoSeleccionado && (
              <FormularioRemuneraciones
                datosAnexo={datosAnexo}
                manejarCambioDatoAnexo={manejarCambioDatoAnexo}
              />
            )}

            {categoriaSeleccionada === "jornada_horas" && tipoSeleccionado && (
              <FormularioJornadaHoras
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                manejarCambioDatoAnexo={manejarCambioDatoAnexo}
              />
            )}

            {categoriaSeleccionada === "funciones" && tipoSeleccionado && (
              <FormularioFunciones
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                manejarCambioDatoAnexo={manejarCambioDatoAnexo}
              />
            )}

            {categoriaSeleccionada === "financiamiento" && tipoSeleccionado && (
              <FormularioFinanciamiento
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                manejarCambioDatoAnexo={manejarCambioDatoAnexo}
              />
            )}

            {categoriaSeleccionada === "datos_administrativos" &&
              tipoSeleccionado && (
                <FormularioDatosAdministrativos
                  tipoSeleccionado={tipoSeleccionado}
                  datosAnexo={datosAnexo}
                  manejarCambioDatoAnexo={manejarCambioDatoAnexo}
                />
              )}

            {categoriaSeleccionada === "termino_regularizacion" &&
              tipoSeleccionado && (
                <FormularioTerminoRegularizacion
                  tipoSeleccionado={tipoSeleccionado}
                  datosAnexo={datosAnexo}
                  manejarCambioDatoAnexo={manejarCambioDatoAnexo}
                />
              )}

            {tipoSeleccionado && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-black">Selección lista</p>
                  <p className="mt-1">
                    Ya tenemos trabajador, categoría y tipo de anexo. Abajo
                    puedes revisar la vista previa imprimible de la estructura
                    del documento.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={imprimirVistaPrevia}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <Printer size={18} />
                    Imprimir vista previa
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {trabajadorEncontrado && tipoSeleccionado && (
        <section
          id="anexo-imprimible"
          className="mx-auto mt-8 max-w-4xl rounded-[1.5rem] border border-slate-200 bg-white p-10 text-slate-950 shadow-sm"
        >
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Contrato de Trabajo
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
              Anexo de Contrato de Trabajo
            </h2>

            <p className="mt-2 text-lg font-bold uppercase text-slate-700">
              {tipoAnexoActual?.label || "Anexo contractual"}
            </p>
          </div>

          <div className="mt-10 space-y-6 text-justify text-[15px] leading-8">
            <p>
              En Quillota, a {formatoFechaDocumento(datosAnexo.fechaAnexo)}{" "}
              comparece don JULIO ENRIQUE INOCENCIO ALVEAR, chileno, profesor,
              cédula nacional de identidad número 5.508.769-5, en
              representación de la FUNDACIÓN EDUCACIONAL JULIO INOCENCIO ALVEAR,
              del giro Educacional, Rol Único Tributario número 65.154.625-7,
              ambos con domicilio en Rene Schneider número 206, San Pedro,
              Quillota, en adelante el “COLEGIO”, en calidad de empleador y el
              trabajador don(a):
            </p>

            <div className="my-8 rounded-xl border border-slate-300 p-5 text-left">
              <p>
                <strong>NOMBRE:</strong> {trabajadorEncontrado.nombreCompleto}
              </p>
              <p>
                <strong>C.N.I. Nº:</strong> {trabajadorEncontrado.rut}
              </p>
              <p>
                <strong>TIPO DE TRABAJADOR:</strong>{" "}
                {trabajadorEncontrado.tipoTrabajador}
              </p>
              <p>
                <strong>FUNCIÓN:</strong> {trabajadorEncontrado.cargoFuncion}
              </p>
              <p>
                <strong>FINANCIAMIENTO:</strong>{" "}
                {trabajadorEncontrado.financiamiento}
              </p>
            </div>

            <p>
              <strong>PRIMERO:</strong> Por el presente instrumento, las partes
              vienen en modificar y complementar el contrato de trabajo vigente,
              dejando constancia que el presente anexo se genera en relación con
              la siguiente materia contractual:
            </p>

            <p className="rounded-xl border border-slate-300 bg-slate-50 p-4 text-left font-bold">
              {categoriaActual?.label} — {tipoAnexoActual?.label}
            </p>

            {categoriaSeleccionada === "remuneraciones" ? (
              <TextoRemuneraciones
                datosAnexo={datosAnexo}
                trabajadorEncontrado={trabajadorEncontrado}
              />
            ) : categoriaSeleccionada === "jornada_horas" ? (
              <TextoJornadaHoras
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                trabajadorEncontrado={trabajadorEncontrado}
              />
            ) : categoriaSeleccionada === "funciones" ? (
              <TextoFunciones
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                trabajadorEncontrado={trabajadorEncontrado}
              />
            ) : categoriaSeleccionada === "financiamiento" ? (
              <TextoFinanciamiento
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                trabajadorEncontrado={trabajadorEncontrado}
              />
            ) : categoriaSeleccionada === "datos_administrativos" ? (
              <TextoDatosAdministrativos
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                trabajadorEncontrado={trabajadorEncontrado}
              />
            ) : categoriaSeleccionada === "termino_regularizacion" ? (
              <TextoTerminoRegularizacion
                tipoSeleccionado={tipoSeleccionado}
                datosAnexo={datosAnexo}
                trabajadorEncontrado={trabajadorEncontrado}
              />
            ) : (
              <TextoGenerico trabajadorEncontrado={trabajadorEncontrado} />
            )}

            <p>
              <strong>SEGUNDO:</strong> En todo lo no modificado por el presente
              instrumento, se mantienen plenamente vigentes las cláusulas del
              contrato de trabajo principal y sus anexos anteriores, si los
              hubiere.
            </p>

            <p>
              Se suscribe el presente Anexo de Contrato en dos ejemplares del
              mismo tenor, quedando uno en poder del empleador y otro en poder
              del trabajador(a), quien declara recibirlo a su entera
              satisfacción y que es el fiel reflejo de la relación laboral que
              une a las partes.
            </p>

            <p>
              Para constancia, previa lectura, y en señal de conformidad firman
              las partes.
            </p>
          </div>

          <div className="mt-24 grid grid-cols-2 gap-16 text-center text-sm font-bold">
            <div>
              <div className="border-t border-slate-900 pt-3">
                TRABAJADOR(A)
              </div>
            </div>

            <div>
              <div className="border-t border-slate-900 pt-3">EMPLEADOR</div>
            </div>
          </div>
        </section>
      )}

      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #anexo-imprimible,
            #anexo-imprimible * {
              visibility: visible !important;
            }

            #anexo-imprimible {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 2cm !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              background: white !important;
              color: black !important;
            }

            #anexo-imprimible .bg-slate-50 {
              background: white !important;
            }

            @page {
              size: legal;
              margin: 1.5cm;
            }
          }
        `}
      </style>
    </div>
  );
}

function TextoRemuneraciones({ datosAnexo, trabajadorEncontrado }) {
  return (
    <>
      <p>
        Las partes convienen en aplicar{" "}
        <strong>
          {datosAnexo.leyReferencia || "la normativa correspondiente"}
        </strong>{" "}
        y en realizar la{" "}
        <strong>
          {datosAnexo.motivoActualizacion ||
            "actualización de remuneraciones"}
        </strong>
        , dejando constancia que la remuneración mensual del trabajador(a) rige
        desde <strong>{formatoFechaDesde(datosAnexo.fechaDesde)}</strong>.
      </p>

      <p>
        El TRABAJADOR(A) percibirá una remuneración bruta mensual de{" "}
        <strong>
          {formatoPeso(
            datosAnexo.remuneracionBruta ||
              trabajadorEncontrado.remuneracionBruta
          )}
        </strong>
        , que será liquidada y pagada conforme a las condiciones establecidas en
        el contrato principal y sus anexos. A solicitud del trabajador(a), será
        pagada mediante depósito o transferencia en{" "}
        <strong>{trabajadorEncontrado.tipoCuenta}</strong> N°{" "}
        <strong>{trabajadorEncontrado.numeroCuenta}</strong> del banco{" "}
        <strong>{trabajadorEncontrado.banco}</strong>.
      </p>

      <p>La remuneración está compuesta por los siguientes conceptos:</p>

      <div className="rounded-xl border border-slate-300 p-5 text-left">
        {Number(datosAnexo.sueldoBaseGeneral || 0) > 0 && (
          <p>
            <strong>Sueldo Base General:</strong>{" "}
            {formatoPeso(datosAnexo.sueldoBaseGeneral)}
          </p>
        )}

        {Number(datosAnexo.sueldoBaseSEP || 0) > 0 && (
          <p>
            <strong>Sueldo Base SEP:</strong>{" "}
            {formatoPeso(datosAnexo.sueldoBaseSEP)}
          </p>
        )}

        {Number(datosAnexo.bonosFijos || 0) > 0 && (
          <p>
            <strong>Bonos u otras remuneraciones fijas mensuales:</strong>{" "}
            {formatoPeso(datosAnexo.bonosFijos)} {datosAnexo.detalleBonos}
          </p>
        )}
      </div>

      <p>
        El empleador pagará los bonos estatales, leyes, aguinaldos y cualquier
        otro beneficio remuneratorio que otorgue el Estado y que sea financiado
        a través de subvención, en la liquidación de sueldo del mes en que se
        hubieren recibido los fondos correspondientes por parte del Ministerio
        de Educación.
      </p>

      <p>
        Asimismo, el trabajador(a) acepta y autoriza al empleador para efectuar
        los descuentos legales correspondientes por concepto de cotizaciones
        previsionales, salud, seguro de cesantía, impuestos y demás descuentos
        que procedan conforme a la normativa vigente.
      </p>
    </>
  );
}

function TextoJornadaHoras({ tipoSeleccionado, datosAnexo, trabajadorEncontrado }) {
  const horasActuales =
    datosAnexo.horasAnteriores || trabajadorEncontrado.horasContrato || "___";
  const horasNuevas = datosAnexo.horasNuevas || "___";
  const horasVariacion = datosAnexo.horasVariacion || "___";
  const fechaDesde = formatoFechaDesde(datosAnexo.fechaDesde);

  return (
    <>
      {tipoSeleccionado === "aumento_horas" && (
        <>
          <p>
            Las partes acuerdan aumentar la jornada semanal del trabajador(a),
            quien actualmente registra <strong>{horasActuales}</strong> horas
            semanales, pasando a desempeñar una jornada de{" "}
            <strong>{horasNuevas}</strong> horas semanales, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>

          <p>
            El aumento corresponde a <strong>{horasVariacion}</strong> horas
            semanales adicionales, manteniéndose las demás condiciones
            contractuales que no sean modificadas expresamente por este
            instrumento.
          </p>
        </>
      )}

      {tipoSeleccionado === "disminucion_horas" && (
        <>
          <p>
            Las partes acuerdan, por mutuo consentimiento, disminuir la jornada
            semanal del trabajador(a), quien actualmente registra{" "}
            <strong>{horasActuales}</strong> horas semanales, quedando desde{" "}
            <strong>{fechaDesde}</strong> con una jornada de{" "}
            <strong>{horasNuevas}</strong> horas semanales.
          </p>

          <p>
            La disminución corresponde a <strong>{horasVariacion}</strong> horas
            semanales, dejándose expresa constancia de que esta modificación se
            realiza por acuerdo de ambas partes.
          </p>
        </>
      )}

      {tipoSeleccionado === "renuncia_horas" && (
        <>
          <p>
            El trabajador(a) declara renunciar voluntariamente a parte de su
            jornada contractual, equivalente a{" "}
            <strong>{horasVariacion}</strong> horas semanales, quedando su
            jornada reducida desde <strong>{horasActuales}</strong> a{" "}
            <strong>{horasNuevas}</strong> horas semanales, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>

          <p>
            {datosAnexo.declaracionVoluntariedad ||
              "El trabajador(a) declara que la presente modificación se realiza de manera libre, voluntaria e informada, sin mediar presión alguna."}
          </p>
        </>
      )}

      {tipoSeleccionado === "termino_horas_adicionales" && (
        <>
          <p>
            Las partes dejan constancia del término de horas adicionales o
            transitorias que el trabajador(a) venía desempeñando, equivalentes a{" "}
            <strong>{horasVariacion}</strong> horas semanales, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>

          <p>
            En consecuencia, la jornada contractual quedará establecida en{" "}
            <strong>{horasNuevas}</strong> horas semanales, manteniéndose
            vigentes las demás cláusulas del contrato principal.
          </p>
        </>
      )}

      {tipoSeleccionado === "cambio_distribucion_horaria" && (
        <p>
          Las partes acuerdan modificar la distribución horaria del
          trabajador(a), manteniéndose una jornada total de{" "}
          <strong>{horasNuevas || horasActuales}</strong> horas semanales, a
          contar de <strong>{fechaDesde}</strong>.
        </p>
      )}

      {tipoSeleccionado === "adecuacion_ley_40_horas" && (
        <p>
          Las partes acuerdan adecuar la jornada del trabajador(a) conforme al
          proceso de implementación de reducción de jornada laboral, quedando
          establecida en <strong>{horasNuevas}</strong> horas semanales, a contar
          de <strong>{fechaDesde}</strong>.
        </p>
      )}

      {tipoSeleccionado === "cambio_horario" && (
        <p>
          Las partes acuerdan modificar el horario de prestación de servicios
          del trabajador(a), sin alterar el total de horas semanales pactadas,
          manteniéndose una jornada de <strong>{horasActuales}</strong> horas
          semanales, a contar de <strong>{fechaDesde}</strong>.
        </p>
      )}

      {datosAnexo.nuevaRemuneracionBruta && (
        <p>
          Como consecuencia de la presente modificación, la remuneración bruta
          mensual del trabajador(a) quedará fijada en{" "}
          <strong>{formatoPeso(datosAnexo.nuevaRemuneracionBruta)}</strong>, sin
          perjuicio de los descuentos legales que correspondan.
        </p>
      )}

      {datosAnexo.motivoJornada && (
        <p>
          La presente modificación se funda en lo siguiente:{" "}
          <strong>{datosAnexo.motivoJornada}</strong>.
        </p>
      )}

      {datosAnexo.nuevaDistribucionHoraria && (
        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Nueva distribución horaria:</strong>
          </p>
          <p className="whitespace-pre-line">{datosAnexo.nuevaDistribucionHoraria}</p>
        </div>
      )}
    </>
  );
}

function TextoFunciones({ tipoSeleccionado, datosAnexo, trabajadorEncontrado }) {
  const fechaDesde = formatoFechaDesde(datosAnexo.fechaDesde);
  const funcionAnterior = datosAnexo.funcionAnterior || trabajadorEncontrado.cargoFuncion || "la función actualmente registrada";
  const nuevaFuncion = datosAnexo.nuevaFuncion || "la nueva función indicada por las partes";
  const cursoAnterior = datosAnexo.cursoNivelAnterior || "el curso o nivel actualmente registrado";
  const cursoNuevo = datosAnexo.cursoNivelNuevo || "el nuevo curso o nivel indicado por las partes";
  const asignaturaAnterior = datosAnexo.asignaturaAnterior || "la asignatura actualmente registrada";
  const asignaturaNueva = datosAnexo.asignaturaNueva || "la nueva asignatura indicada por las partes";

  return (
    <>
      {tipoSeleccionado === "cambio_funcion" && (
        <>
          <p>
            Las partes acuerdan modificar la función que desempeña el
            trabajador(a), quien hasta la fecha se encontraba asociado(a) a la
            función de <strong>{funcionAnterior}</strong>, pasando a desempeñar
            la función de <strong>{nuevaFuncion}</strong>, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>

          <p>
            Esta modificación se entiende incorporada al contrato principal,
            manteniéndose vigentes las demás cláusulas que no sean expresamente
            modificadas por el presente instrumento.
          </p>
        </>
      )}

      {tipoSeleccionado === "funcion_adicional" && (
        <>
          <p>
            Las partes acuerdan incorporar una función adicional a las labores
            que actualmente desempeña el trabajador(a), manteniéndose su función
            base de <strong>{funcionAnterior}</strong> e incorporándose, desde{" "}
            <strong>{fechaDesde}</strong>, la siguiente función adicional:{" "}
            <strong>{nuevaFuncion}</strong>.
          </p>

          <p>
            La incorporación de esta función adicional no altera las demás
            condiciones contractuales, salvo aquellas que se indiquen
            expresamente en este anexo.
          </p>
        </>
      )}

      {tipoSeleccionado === "cambio_curso_nivel" && (
        <>
          <p>
            Las partes acuerdan modificar el curso, nivel o grupo de trabajo
            asociado a las labores del trabajador(a), desde{" "}
            <strong>{cursoAnterior}</strong> a <strong>{cursoNuevo}</strong>, a
            contar de <strong>{fechaDesde}</strong>.
          </p>

          <p>
            Esta modificación se realiza por necesidades de organización
            interna del establecimiento educacional, manteniéndose vigentes las
            demás condiciones pactadas en el contrato principal.
          </p>
        </>
      )}

      {tipoSeleccionado === "cambio_asignatura" && (
        <>
          <p>
            Las partes acuerdan modificar la asignatura o área de desempeño del
            trabajador(a), desde <strong>{asignaturaAnterior}</strong> a{" "}
            <strong>{asignaturaNueva}</strong>, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>

          <p>
            La presente modificación se incorpora al contrato principal y se
            aplicará conforme a la planificación académica y organización
            interna del establecimiento.
          </p>
        </>
      )}

      {tipoSeleccionado === "cambio_labor_sep" && (
        <>
          <p>
            Las partes acuerdan modificar o precisar las labores asociadas al
            financiamiento SEP, a contar de <strong>{fechaDesde}</strong>, en el
            marco del Plan de Mejoramiento Educativo y de la Ley de Subvención
            Escolar Preferencial.
          </p>

          <p>
            El trabajador(a) desempeñará las siguientes labores SEP:{" "}
            <strong>{datosAnexo.detalleLabores || nuevaFuncion}</strong>.
          </p>
        </>
      )}

      {datosAnexo.detalleLabores && tipoSeleccionado !== "cambio_labor_sep" && (
        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Detalle de labores:</strong>
          </p>
          <p className="whitespace-pre-line">{datosAnexo.detalleLabores}</p>
        </div>
      )}

      {datosAnexo.motivoFuncion && (
        <p>
          La presente modificación se funda en lo siguiente:{" "}
          <strong>{datosAnexo.motivoFuncion}</strong>.
        </p>
      )}
    </>
  );
}

function TextoFinanciamiento({ tipoSeleccionado, datosAnexo, trabajadorEncontrado }) {
  const fechaDesde = formatoFechaDesde(datosAnexo.fechaDesde);
  const financiamientoAnterior =
    datosAnexo.financiamientoAnterior ||
    trabajadorEncontrado.financiamiento ||
    "el financiamiento actualmente registrado";
  const nuevoFinanciamiento =
    datosAnexo.nuevoFinanciamiento || "el nuevo financiamiento indicado";
  const horasGeneral = datosAnexo.horasGeneral || "___";
  const horasSEP = datosAnexo.horasSEP || "___";
  const proyectoSEP = datosAnexo.proyectoSEP || "el proyecto educativo indicado por las partes";
  const laborSEP = datosAnexo.laborSEP || datosAnexo.detalleLabores || "las labores indicadas por las partes";

  return (
    <>
      {tipoSeleccionado === "anexo_general" && (
        <>
          <p>
            Las partes dejan constancia de que las labores desempeñadas por el
            trabajador(a) se imputan a financiamiento de subvención general, a
            contar de <strong>{fechaDesde}</strong>, manteniéndose la función de{" "}
            <strong>{trabajadorEncontrado.cargoFuncion}</strong>, salvo las
            modificaciones expresamente indicadas en este instrumento.
          </p>
        </>
      )}

      {tipoSeleccionado === "anexo_sep" && (
        <>
          <p>
            Las partes acuerdan que el trabajador(a) desarrollará la labor de{" "}
            <strong>{laborSEP}</strong> en el proyecto educativo denominado{" "}
            <strong>{proyectoSEP}</strong>, en el marco del Plan de Mejoramiento
            Educativo inserto en la Ley de Subvención Escolar Preferencial, en
            virtud del Convenio de Igualdad de Oportunidades suscrito entre el
            empleador y el Ministerio de Educación.
          </p>

          <p>
            Estas labores se pactan y se regulan de acuerdo a la normativa
            educacional y laboral aplicable, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>
        </>
      )}

      {tipoSeleccionado === "anexo_mixto" && (
        <>
          <p>
            Las partes dejan constancia de que la jornada del trabajador(a)
            tendrá una distribución mixta de financiamiento, compuesta por{" "}
            <strong>{horasGeneral}</strong> horas imputadas a subvención general
            y <strong>{horasSEP}</strong> horas imputadas a financiamiento SEP,
            a contar de <strong>{fechaDesde}</strong>.
          </p>

          <p>
            Respecto de las horas SEP, el trabajador(a) desarrollará la labor de{" "}
            <strong>{laborSEP}</strong> en el proyecto educativo denominado{" "}
            <strong>{proyectoSEP}</strong>, en el marco del Plan de Mejoramiento
            Educativo.
          </p>
        </>
      )}

      {tipoSeleccionado === "cambio_general_sep" && (
        <>
          <p>
            Las partes acuerdan modificar la imputación de financiamiento
            asociada al contrato de trabajo, pasando desde{" "}
            <strong>{financiamientoAnterior}</strong> a{" "}
            <strong>{nuevoFinanciamiento}</strong>, a contar de{" "}
            <strong>{fechaDesde}</strong>.
          </p>

          <p>
            Esta modificación no altera por sí sola las demás condiciones
            contractuales, salvo aquellas que se expresen en este instrumento.
          </p>
        </>
      )}

      {tipoSeleccionado === "distribucion_general_sep" && (
        <>
          <p>
            Las partes acuerdan precisar la distribución de horas por
            financiamiento, quedando establecidas <strong>{horasGeneral}</strong>{" "}
            horas bajo subvención general y <strong>{horasSEP}</strong> horas
            bajo subvención SEP, a contar de <strong>{fechaDesde}</strong>.
          </p>
        </>
      )}

      {datosAnexo.fundamentoFinanciamiento && (
        <p>
          La presente modificación se funda en lo siguiente:{" "}
          <strong>{datosAnexo.fundamentoFinanciamiento}</strong>.
        </p>
      )}
    </>
  );
}

function TextoGenerico({ trabajadorEncontrado }) {
  return (
    <>
      <p>
        El trabajador(a) actualmente registra una jornada de{" "}
        <strong>{trabajadorEncontrado.horasContrato} horas semanales</strong>,
        desempeñándose en la función de{" "}
        <strong>{trabajadorEncontrado.cargoFuncion}</strong>, bajo modalidad de
        financiamiento <strong>{trabajadorEncontrado.financiamiento}</strong>.
      </p>

      <p>
        Para efectos de la presente vista previa, los datos específicos del
        anexo serán completados en el formulario dinámico correspondiente, según
        el tipo de modificación contractual seleccionada.
      </p>
    </>
  );
}

function FormularioFunciones({ tipoSeleccionado, datosAnexo, manejarCambioDatoAnexo }) {
  const mostrarCursoNivel = tipoSeleccionado === "cambio_curso_nivel";
  const mostrarAsignatura = tipoSeleccionado === "cambio_asignatura";
  const mostrarLabores =
    tipoSeleccionado === "cambio_labor_sep" ||
    tipoSeleccionado === "funcion_adicional" ||
    tipoSeleccionado === "cambio_funcion";

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-lg font-black text-slate-950">
        Datos de funciones
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Completa los antecedentes que modificarán funciones, curso, nivel,
        asignatura o labores SEP del trabajador(a).
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CampoFormulario
          label="Fecha del anexo"
          type="date"
          value={datosAnexo.fechaAnexo}
          onChange={(value) => manejarCambioDatoAnexo("fechaAnexo", value)}
        />

        <CampoFormulario
          label="Rige desde"
          type="date"
          value={datosAnexo.fechaDesde}
          onChange={(value) => manejarCambioDatoAnexo("fechaDesde", value)}
        />

        <CampoFormulario
          label="Función anterior"
          value={datosAnexo.funcionAnterior}
          onChange={(value) => manejarCambioDatoAnexo("funcionAnterior", value)}
        />

        <CampoFormulario
          label="Nueva función"
          value={datosAnexo.nuevaFuncion}
          onChange={(value) => manejarCambioDatoAnexo("nuevaFuncion", value)}
        />

        {mostrarCursoNivel && (
          <>
            <CampoFormulario
              label="Curso / nivel anterior"
              value={datosAnexo.cursoNivelAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("cursoNivelAnterior", value)
              }
            />

            <CampoFormulario
              label="Curso / nivel nuevo"
              value={datosAnexo.cursoNivelNuevo}
              onChange={(value) =>
                manejarCambioDatoAnexo("cursoNivelNuevo", value)
              }
            />
          </>
        )}

        {mostrarAsignatura && (
          <>
            <CampoFormulario
              label="Asignatura anterior"
              value={datosAnexo.asignaturaAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("asignaturaAnterior", value)
              }
            />

            <CampoFormulario
              label="Asignatura nueva"
              value={datosAnexo.asignaturaNueva}
              onChange={(value) =>
                manejarCambioDatoAnexo("asignaturaNueva", value)
              }
            />
          </>
        )}

        <CampoFormulario
          label="Motivo o fundamento"
          value={datosAnexo.motivoFuncion}
          onChange={(value) => manejarCambioDatoAnexo("motivoFuncion", value)}
        />
      </div>

      {mostrarLabores && (
        <div className="mt-5">
          <CampoTextarea
            label="Detalle de nuevas labores"
            value={datosAnexo.detalleLabores}
            onChange={(value) => manejarCambioDatoAnexo("detalleLabores", value)}
          />
        </div>
      )}
    </div>
  );
}

function FormularioFinanciamiento({
  tipoSeleccionado,
  datosAnexo,
  manejarCambioDatoAnexo,
}) {
  const mostrarSEP =
    tipoSeleccionado === "anexo_sep" ||
    tipoSeleccionado === "anexo_mixto" ||
    tipoSeleccionado === "distribucion_general_sep";

  const mostrarDistribucion =
    tipoSeleccionado === "anexo_mixto" ||
    tipoSeleccionado === "distribucion_general_sep";

  const mostrarCambio =
    tipoSeleccionado === "cambio_general_sep";

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-lg font-black text-slate-950">
        Datos de financiamiento General / SEP
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Completa los antecedentes que dejarán trazabilidad sobre imputación
        General, SEP o modalidad mixta.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CampoFormulario
          label="Fecha del anexo"
          type="date"
          value={datosAnexo.fechaAnexo}
          onChange={(value) => manejarCambioDatoAnexo("fechaAnexo", value)}
        />

        <CampoFormulario
          label="Rige desde"
          type="date"
          value={datosAnexo.fechaDesde}
          onChange={(value) => manejarCambioDatoAnexo("fechaDesde", value)}
        />

        <CampoFormulario
          label="Financiamiento anterior"
          value={datosAnexo.financiamientoAnterior}
          onChange={(value) =>
            manejarCambioDatoAnexo("financiamientoAnterior", value)
          }
        />

        <CampoFormulario
          label="Nuevo financiamiento"
          value={datosAnexo.nuevoFinanciamiento}
          onChange={(value) =>
            manejarCambioDatoAnexo("nuevoFinanciamiento", value)
          }
        />

        {mostrarDistribucion && (
          <>
            <CampoFormulario
              label="Horas General"
              type="number"
              value={datosAnexo.horasGeneral}
              onChange={(value) => manejarCambioDatoAnexo("horasGeneral", value)}
            />

            <CampoFormulario
              label="Horas SEP"
              type="number"
              value={datosAnexo.horasSEP}
              onChange={(value) => manejarCambioDatoAnexo("horasSEP", value)}
            />
          </>
        )}

        {mostrarCambio && (
          <CampoFormulario
            label="Fundamento del cambio"
            value={datosAnexo.fundamentoFinanciamiento}
            onChange={(value) =>
              manejarCambioDatoAnexo("fundamentoFinanciamiento", value)
            }
          />
        )}
      </div>

      {mostrarSEP && (
        <div className="mt-5 grid gap-4">
          <CampoFormulario
            label="Nombre del proyecto SEP"
            value={datosAnexo.proyectoSEP}
            onChange={(value) => manejarCambioDatoAnexo("proyectoSEP", value)}
          />

          <CampoTextarea
            label="Labor SEP"
            value={datosAnexo.laborSEP}
            onChange={(value) => manejarCambioDatoAnexo("laborSEP", value)}
          />
        </div>
      )}

      {!mostrarCambio && (
        <div className="mt-5">
          <CampoTextarea
            label="Fundamento / observación"
            value={datosAnexo.fundamentoFinanciamiento}
            onChange={(value) =>
              manejarCambioDatoAnexo("fundamentoFinanciamiento", value)
            }
          />
        </div>
      )}
    </div>
  );
}

function TextoDatosAdministrativos({
  tipoSeleccionado,
  datosAnexo,
  trabajadorEncontrado,
}) {
  const fechaDesde = formatoFechaDesde(datosAnexo.fechaDesde);

  if (tipoSeleccionado === "datos_bancarios") {
    return (
      <>
        <p>
          Las partes dejan constancia de la actualización de los datos bancarios
          del trabajador(a), a contar de <strong>{fechaDesde}</strong>, para
          efectos del pago de remuneraciones y demás prestaciones que
          correspondan.
        </p>

        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Datos anteriores:</strong>
          </p>
          <p>Banco: {datosAnexo.bancoAnterior || trabajadorEncontrado.banco || "No registrado"}</p>
          <p>
            Tipo de cuenta:{" "}
            {datosAnexo.tipoCuentaAnterior ||
              trabajadorEncontrado.tipoCuenta ||
              "No registrado"}
          </p>
          <p>
            N° cuenta:{" "}
            {datosAnexo.numeroCuentaAnterior ||
              trabajadorEncontrado.numeroCuenta ||
              "No registrado"}
          </p>

          <p className="mt-4">
            <strong>Datos nuevos:</strong>
          </p>
          <p>Banco: {datosAnexo.bancoNuevo || "________________"}</p>
          <p>Tipo de cuenta: {datosAnexo.tipoCuentaNuevo || "________________"}</p>
          <p>N° cuenta: {datosAnexo.numeroCuentaNuevo || "________________"}</p>
        </div>

        <p>
          El trabajador(a) declara que los nuevos datos informados son correctos
          y autoriza al empleador para utilizarlos en los procesos de pago
          correspondientes.
        </p>

        {datosAnexo.observacionAdministrativa && (
          <p>
            Observación:{" "}
            <strong>{datosAnexo.observacionAdministrativa}</strong>.
          </p>
        )}
      </>
    );
  }

  if (tipoSeleccionado === "correo_notificacion") {
    return (
      <>
        <p>
          Las partes dejan constancia de la actualización del correo electrónico
          personal del trabajador(a), a contar de <strong>{fechaDesde}</strong>,
          para efectos de comunicación, notificación y remisión de documentación
          laboral.
        </p>

        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Correo anterior:</strong>{" "}
            {datosAnexo.correoAnterior ||
              trabajadorEncontrado.correoPersonal ||
              "No registrado"}
          </p>
          <p>
            <strong>Correo nuevo:</strong>{" "}
            {datosAnexo.correoNuevo || "________________"}
          </p>
        </div>

        <p>
          El trabajador(a) acepta y autoriza al empleador para que su
          documentación derivada de la relación laboral sea confeccionada,
          procesada, firmada y remitida de manera electrónica al correo
          señalado.
        </p>

        {datosAnexo.observacionAdministrativa && (
          <p>
            Observación:{" "}
            <strong>{datosAnexo.observacionAdministrativa}</strong>.
          </p>
        )}
      </>
    );
  }

  if (tipoSeleccionado === "domicilio") {
    return (
      <>
        <p>
          Las partes dejan constancia de la actualización del domicilio del
          trabajador(a), a contar de <strong>{fechaDesde}</strong>, para todos
          los efectos derivados de la relación laboral.
        </p>

        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Domicilio anterior:</strong>{" "}
            {datosAnexo.domicilioAnterior || "No registrado"}
          </p>
          <p>
            <strong>Domicilio nuevo:</strong>{" "}
            {datosAnexo.domicilioNuevo || "________________"}
          </p>
        </div>

        {datosAnexo.observacionAdministrativa && (
          <p>
            Observación:{" "}
            <strong>{datosAnexo.observacionAdministrativa}</strong>.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <p>
        Las partes dejan constancia de la rectificación o actualización de datos
        personales del trabajador(a), a contar de <strong>{fechaDesde}</strong>,
        conforme a los antecedentes proporcionados por este(a).
      </p>

      <div className="rounded-xl border border-slate-300 p-5 text-left">
        <p>
          <strong>Dato que se modifica:</strong>{" "}
          {datosAnexo.datoAdministrativo || "________________"}
        </p>
        <p>
          <strong>Valor anterior:</strong>{" "}
          {datosAnexo.valorAnterior || "________________"}
        </p>
        <p>
          <strong>Valor correcto / nuevo:</strong>{" "}
          {datosAnexo.valorNuevo || "________________"}
        </p>
      </div>

      <p>
        El trabajador(a) declara que la información actualizada corresponde a la
        realidad y que debe ser considerada por el empleador para todos los
        efectos administrativos y laborales pertinentes.
      </p>

      {datosAnexo.observacionAdministrativa && (
        <p>
          Observación:{" "}
          <strong>{datosAnexo.observacionAdministrativa}</strong>.
        </p>
      )}
    </>
  );
}

function FormularioDatosAdministrativos({
  tipoSeleccionado,
  datosAnexo,
  manejarCambioDatoAnexo,
}) {
  const esDatosBancarios = tipoSeleccionado === "datos_bancarios";
  const esCorreo = tipoSeleccionado === "correo_notificacion";
  const esDomicilio = tipoSeleccionado === "domicilio";
  const esDatosPersonales = tipoSeleccionado === "datos_personales";

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-lg font-black text-slate-950">
        Datos personales o administrativos
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Completa la información que será actualizada en el anexo contractual.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CampoFormulario
          label="Fecha del anexo"
          type="date"
          value={datosAnexo.fechaAnexo}
          onChange={(value) => manejarCambioDatoAnexo("fechaAnexo", value)}
        />

        <CampoFormulario
          label="Rige desde"
          type="date"
          value={datosAnexo.fechaDesde}
          onChange={(value) => manejarCambioDatoAnexo("fechaDesde", value)}
        />

        {esDatosPersonales && (
          <>
            <CampoFormulario
              label="Dato que se modifica"
              value={datosAnexo.datoAdministrativo}
              onChange={(value) =>
                manejarCambioDatoAnexo("datoAdministrativo", value)
              }
            />

            <CampoFormulario
              label="Valor anterior"
              value={datosAnexo.valorAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("valorAnterior", value)
              }
            />

            <CampoFormulario
              label="Valor correcto / nuevo"
              value={datosAnexo.valorNuevo}
              onChange={(value) => manejarCambioDatoAnexo("valorNuevo", value)}
            />
          </>
        )}

        {esDatosBancarios && (
          <>
            <CampoFormulario
              label="Banco anterior"
              value={datosAnexo.bancoAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("bancoAnterior", value)
              }
            />

            <CampoFormulario
              label="Banco nuevo"
              value={datosAnexo.bancoNuevo}
              onChange={(value) => manejarCambioDatoAnexo("bancoNuevo", value)}
            />

            <CampoFormulario
              label="Tipo de cuenta anterior"
              value={datosAnexo.tipoCuentaAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("tipoCuentaAnterior", value)
              }
            />

            <CampoFormulario
              label="Tipo de cuenta nueva"
              value={datosAnexo.tipoCuentaNuevo}
              onChange={(value) =>
                manejarCambioDatoAnexo("tipoCuentaNuevo", value)
              }
            />

            <CampoFormulario
              label="N° cuenta anterior"
              value={datosAnexo.numeroCuentaAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("numeroCuentaAnterior", value)
              }
            />

            <CampoFormulario
              label="N° cuenta nueva"
              value={datosAnexo.numeroCuentaNuevo}
              onChange={(value) =>
                manejarCambioDatoAnexo("numeroCuentaNuevo", value)
              }
            />
          </>
        )}

        {esCorreo && (
          <>
            <CampoFormulario
              label="Correo anterior"
              value={datosAnexo.correoAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("correoAnterior", value)
              }
            />

            <CampoFormulario
              label="Correo nuevo"
              value={datosAnexo.correoNuevo}
              onChange={(value) => manejarCambioDatoAnexo("correoNuevo", value)}
            />
          </>
        )}

        {esDomicilio && (
          <>
            <CampoFormulario
              label="Domicilio anterior"
              value={datosAnexo.domicilioAnterior}
              onChange={(value) =>
                manejarCambioDatoAnexo("domicilioAnterior", value)
              }
            />

            <CampoFormulario
              label="Domicilio nuevo"
              value={datosAnexo.domicilioNuevo}
              onChange={(value) =>
                manejarCambioDatoAnexo("domicilioNuevo", value)
              }
            />
          </>
        )}
      </div>

      <div className="mt-5">
        <CampoTextarea
          label="Observación / fundamento"
          value={datosAnexo.observacionAdministrativa}
          onChange={(value) =>
            manejarCambioDatoAnexo("observacionAdministrativa", value)
          }
        />
      </div>
    </div>
  );
}

function TextoTerminoRegularizacion({
  tipoSeleccionado,
  datosAnexo,
  trabajadorEncontrado,
}) {
  const fechaDesde = formatoFechaDesde(datosAnexo.fechaDesde);
  const fechaTermino = formatoFechaDesde(datosAnexo.fechaTermino);
  const funcionBase =
    datosAnexo.funcionAsignacionTermina ||
    datosAnexo.funcionAnterior ||
    trabajadorEncontrado.cargoFuncion ||
    "la función o asignación indicada por las partes";

  if (tipoSeleccionado === "termino_funcion") {
    return (
      <>
        <p>
          Las partes dejan constancia del término de la función específica de{" "}
          <strong>{funcionBase}</strong>, a contar de{" "}
          <strong>{fechaTermino}</strong>.
        </p>

        <p>
          Esta modificación no implica por sí sola el término de la relación
          laboral, sino únicamente el término de la función específica señalada,
          manteniéndose vigentes las demás condiciones del contrato principal
          que no sean modificadas por este instrumento.
        </p>

        {datosAnexo.motivoTerminoRegularizacion && (
          <p>
            El término se funda en lo siguiente:{" "}
            <strong>{datosAnexo.motivoTerminoRegularizacion}</strong>.
          </p>
        )}
      </>
    );
  }

  if (tipoSeleccionado === "termino_asignacion_sep") {
    return (
      <>
        <p>
          Las partes dejan constancia del término de la asignación, función o
          labor asociada a financiamiento SEP denominada{" "}
          <strong>{funcionBase}</strong>, a contar de{" "}
          <strong>{fechaTermino}</strong>.
        </p>

        <p>
          En consecuencia, desde dicha fecha el trabajador(a) dejará de
          desempeñar las labores SEP individualizadas en este anexo, sin
          perjuicio de mantenerse vigentes las demás obligaciones contractuales
          que correspondan.
        </p>

        {datosAnexo.motivoTerminoRegularizacion && (
          <p>
            El término se funda en lo siguiente:{" "}
            <strong>{datosAnexo.motivoTerminoRegularizacion}</strong>.
          </p>
        )}
      </>
    );
  }

  if (tipoSeleccionado === "regularizacion_contractual") {
    return (
      <>
        <p>
          Las partes acuerdan regularizar antecedentes contractuales del
          trabajador(a), a contar de <strong>{fechaDesde}</strong>, con el objeto
          de dejar concordancia entre la realidad de la prestación de servicios,
          los registros administrativos y el contrato de trabajo vigente.
        </p>

        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Detalle de regularización:</strong>
          </p>
          <p className="whitespace-pre-line">
            {datosAnexo.detalleRegularizacion || "________________"}
          </p>
        </div>

        {datosAnexo.motivoTerminoRegularizacion && (
          <p>
            La regularización se funda en lo siguiente:{" "}
            <strong>{datosAnexo.motivoTerminoRegularizacion}</strong>.
          </p>
        )}
      </>
    );
  }

  if (tipoSeleccionado === "reconocimiento_antiguedad") {
    return (
      <>
        <p>
          Las partes dejan constancia del reconocimiento de antigüedad laboral
          del trabajador(a), para los efectos administrativos y contractuales
          que correspondan.
        </p>

        <div className="rounded-xl border border-slate-300 p-5 text-left">
          <p>
            <strong>Fecha de ingreso reconocida:</strong>{" "}
            {formatoFechaDesde(datosAnexo.fechaIngresoReconocida)}
          </p>
          <p>
            <strong>Antigüedad reconocida:</strong>{" "}
            {datosAnexo.antiguedadReconocida || "________________"}
          </p>
        </div>

        <p>
          Este reconocimiento se incorpora al historial contractual del
          trabajador(a), manteniéndose vigentes las demás condiciones pactadas en
          el contrato principal.
        </p>

        {datosAnexo.motivoTerminoRegularizacion && (
          <p>
            El reconocimiento se funda en lo siguiente:{" "}
            <strong>{datosAnexo.motivoTerminoRegularizacion}</strong>.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <p>
        Las partes dejan constancia de una modificación, término o regularización
        contractual a contar de <strong>{fechaDesde}</strong>, conforme a los
        antecedentes ingresados en el presente anexo.
      </p>
    </>
  );
}

function FormularioTerminoRegularizacion({
  tipoSeleccionado,
  datosAnexo,
  manejarCambioDatoAnexo,
}) {
  const esTerminoFuncion = tipoSeleccionado === "termino_funcion";
  const esTerminoSEP = tipoSeleccionado === "termino_asignacion_sep";
  const esRegularizacion = tipoSeleccionado === "regularizacion_contractual";
  const esAntiguedad = tipoSeleccionado === "reconocimiento_antiguedad";

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-lg font-black text-slate-950">
        Datos de término o regularización
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Completa los antecedentes para dejar constancia del término de una
        función, asignación SEP, regularización contractual o reconocimiento de
        antigüedad.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CampoFormulario
          label="Fecha del anexo"
          type="date"
          value={datosAnexo.fechaAnexo}
          onChange={(value) => manejarCambioDatoAnexo("fechaAnexo", value)}
        />

        <CampoFormulario
          label="Rige desde"
          type="date"
          value={datosAnexo.fechaDesde}
          onChange={(value) => manejarCambioDatoAnexo("fechaDesde", value)}
        />

        {(esTerminoFuncion || esTerminoSEP) && (
          <>
            <CampoFormulario
              label="Función / asignación que termina"
              value={datosAnexo.funcionAsignacionTermina}
              onChange={(value) =>
                manejarCambioDatoAnexo("funcionAsignacionTermina", value)
              }
            />

            <CampoFormulario
              label="Fecha de término"
              type="date"
              value={datosAnexo.fechaTermino}
              onChange={(value) => manejarCambioDatoAnexo("fechaTermino", value)}
            />
          </>
        )}

        {esAntiguedad && (
          <>
            <CampoFormulario
              label="Fecha de ingreso reconocida"
              type="date"
              value={datosAnexo.fechaIngresoReconocida}
              onChange={(value) =>
                manejarCambioDatoAnexo("fechaIngresoReconocida", value)
              }
            />

            <CampoFormulario
              label="Antigüedad reconocida"
              value={datosAnexo.antiguedadReconocida}
              onChange={(value) =>
                manejarCambioDatoAnexo("antiguedadReconocida", value)
              }
            />
          </>
        )}

        <CampoFormulario
          label="Motivo o fundamento"
          value={datosAnexo.motivoTerminoRegularizacion}
          onChange={(value) =>
            manejarCambioDatoAnexo("motivoTerminoRegularizacion", value)
          }
        />
      </div>

      {esRegularizacion && (
        <div className="mt-5">
          <CampoTextarea
            label="Detalle de regularización contractual"
            value={datosAnexo.detalleRegularizacion}
            onChange={(value) =>
              manejarCambioDatoAnexo("detalleRegularizacion", value)
            }
          />
        </div>
      )}

      <div className="mt-5">
        <CampoTextarea
          label="Observaciones"
          value={datosAnexo.observacionTerminoRegularizacion}
          onChange={(value) =>
            manejarCambioDatoAnexo("observacionTerminoRegularizacion", value)
          }
        />
      </div>
    </div>
  );
}

function FormularioRemuneraciones({ datosAnexo, manejarCambioDatoAnexo }) {
  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-lg font-black text-slate-950">
        Datos de remuneraciones
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Completa o ajusta los datos que aparecerán en la cláusula PRIMERO del
        anexo.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CampoFormulario
          label="Fecha del anexo"
          type="date"
          value={datosAnexo.fechaAnexo}
          onChange={(value) => manejarCambioDatoAnexo("fechaAnexo", value)}
        />

        <CampoFormulario
          label="Rige desde"
          type="date"
          value={datosAnexo.fechaDesde}
          onChange={(value) => manejarCambioDatoAnexo("fechaDesde", value)}
        />

        <CampoFormulario
          label="Ley o referencia"
          value={datosAnexo.leyReferencia}
          onChange={(value) => manejarCambioDatoAnexo("leyReferencia", value)}
        />

        <CampoFormulario
          label="Motivo de actualización"
          value={datosAnexo.motivoActualizacion}
          onChange={(value) =>
            manejarCambioDatoAnexo("motivoActualizacion", value)
          }
        />

        <CampoFormulario
          label="Sueldo Base General"
          type="number"
          value={datosAnexo.sueldoBaseGeneral}
          onChange={(value) =>
            manejarCambioDatoAnexo("sueldoBaseGeneral", value)
          }
        />

        <CampoFormulario
          label="Sueldo Base SEP"
          type="number"
          value={datosAnexo.sueldoBaseSEP}
          onChange={(value) => manejarCambioDatoAnexo("sueldoBaseSEP", value)}
        />

        <CampoFormulario
          label="Bonos fijos"
          type="number"
          value={datosAnexo.bonosFijos}
          onChange={(value) => manejarCambioDatoAnexo("bonosFijos", value)}
        />

        <CampoFormulario
          label="Detalle bonos"
          value={datosAnexo.detalleBonos}
          onChange={(value) => manejarCambioDatoAnexo("detalleBonos", value)}
        />

        <CampoFormulario
          label="Remuneración bruta mensual"
          type="number"
          value={datosAnexo.remuneracionBruta}
          onChange={(value) =>
            manejarCambioDatoAnexo("remuneracionBruta", value)
          }
        />
      </div>
    </div>
  );
}

function FormularioJornadaHoras({
  tipoSeleccionado,
  datosAnexo,
  manejarCambioDatoAnexo,
}) {
  const mostrarDeclaracionVoluntariedad = tipoSeleccionado === "renuncia_horas";

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-lg font-black text-slate-950">
        Datos de jornada y horas
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Completa los antecedentes que modificarán la jornada, horas o
        distribución horaria del contrato.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CampoFormulario
          label="Fecha del anexo"
          type="date"
          value={datosAnexo.fechaAnexo}
          onChange={(value) => manejarCambioDatoAnexo("fechaAnexo", value)}
        />

        <CampoFormulario
          label="Rige desde"
          type="date"
          value={datosAnexo.fechaDesde}
          onChange={(value) => manejarCambioDatoAnexo("fechaDesde", value)}
        />

        <CampoFormulario
          label="Horas anteriores"
          type="number"
          value={datosAnexo.horasAnteriores}
          onChange={(value) => manejarCambioDatoAnexo("horasAnteriores", value)}
        />

        <CampoFormulario
          label="Nuevas horas"
          type="number"
          value={datosAnexo.horasNuevas}
          onChange={(value) => manejarCambioDatoAnexo("horasNuevas", value)}
        />

        <CampoFormulario
          label="Horas que aumentan / disminuyen / renuncia"
          type="number"
          value={datosAnexo.horasVariacion}
          onChange={(value) => manejarCambioDatoAnexo("horasVariacion", value)}
        />

        <CampoFormulario
          label="Nueva remuneración bruta mensual"
          type="number"
          value={datosAnexo.nuevaRemuneracionBruta}
          onChange={(value) =>
            manejarCambioDatoAnexo("nuevaRemuneracionBruta", value)
          }
        />

        <CampoFormulario
          label="Motivo o fundamento"
          value={datosAnexo.motivoJornada}
          onChange={(value) => manejarCambioDatoAnexo("motivoJornada", value)}
        />

        <CampoFormulario
          label="Nueva distribución horaria"
          value={datosAnexo.nuevaDistribucionHoraria}
          onChange={(value) =>
            manejarCambioDatoAnexo("nuevaDistribucionHoraria", value)
          }
        />
      </div>

      {mostrarDeclaracionVoluntariedad && (
        <div className="mt-5">
          <CampoTextarea
            label="Declaración de voluntariedad"
            value={datosAnexo.declaracionVoluntariedad}
            onChange={(value) =>
              manejarCambioDatoAnexo("declaracionVoluntariedad", value)
            }
          />
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-2 text-blue-700">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function CampoFormulario({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function CampoTextarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
