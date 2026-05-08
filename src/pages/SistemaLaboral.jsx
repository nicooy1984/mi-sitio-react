import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Lock,
  UserRound,
  BriefcaseBusiness,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Printer,
  Eye,
  ShieldCheck,
  Save,
  Database,
  Download,
  FolderOpen,
  Layers,
} from 'lucide-react';

import { db, appId } from '../firebase/config';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const formatCurrency = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(number);
};

const normalizeTimeInput = (value) => {
  const clean = String(value || '')
    .replace(/[^\d:]/g, '')
    .slice(0, 5);

  if (/^\d{1,2}$/.test(clean)) return clean;
  if (/^\d{1,2}:$/.test(clean)) return clean;
  if (/^\d{1,2}:\d{0,2}$/.test(clean)) return clean;

  return clean;
};

const timeToMinutes = (time) => {
  if (!time) return null;

  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})$/);

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
};

const calculateBlockHours = (start, end) => {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  if (startMinutes === null || endMinutes === null) return 0;
  if (endMinutes <= startMinutes) return 0;

  return (endMinutes - startMinutes) / 60;
};

const calculateDayHours = (dayItem) => {
  const morningHours = calculateBlockHours(dayItem.morningStart, dayItem.morningEnd);
  const afternoonHours = calculateBlockHours(dayItem.afternoonStart, dayItem.afternoonEnd);
  return morningHours + afternoonHours;
};

const calculateScheduleHours = (schedule) => {
  return (schedule || []).reduce((total, dayItem) => total + calculateDayHours(dayItem), 0);
};

const formatHours = (hours) => {
  if (!hours) return '0';
  if (Number.isInteger(hours)) return String(hours);
  return hours.toFixed(1).replace('.', ',');
};

const formatScheduleText = (start, end) => {
  if (!start && !end) return '';
  if (start && end) return `${start} A ${end}`;
  return `${start || '____'} A ${end || '____'}`;
};

const sanitizeFileName = (value) => {
  return String(value || 'trabajador')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
};

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const initialFunctions = [
  'Atención de apoderados.',
  'Actividades extraescolares.',
  'Jefatura de curso.',
  'Reforzamiento educativo.',
  'Reunión de apoderados.',
  'Preparación, confección y selección del material didáctico.',
  'Asistencia al Consejo de Profesores.',
  'Actividades relacionadas con planes y programas de estudio.',
  'Actividades relacionadas con la administración de la educación.',
  'Actividades anexas a la función docente propiamente tal.',
  'Toda aquella actividad que tenga relación directa con su calidad de docente.',
  'Asistir a los actos del Colegio, aniversario institucional, licenciatura, premiación y actividades organizadas por la comunidad educativa, cuando corresponda.',
  'Colaborar en el proceso de admisión y selección de alumnos junto a otras actividades que pueda solicitar la Dirección.',
];

const defaultSchedule = [
  { day: 'LUNES', morningStart: '08:00', morningEnd: '13:00', afternoonStart: '14:00', afternoonEnd: '19:00' },
  { day: 'MARTES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'MIÉRCOLES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'JUEVES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'VIERNES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
];

const emptySchedule = [
  { day: 'LUNES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'MARTES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'MIÉRCOLES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'JUEVES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
  { day: 'VIERNES', morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' },
];

const LABORAL_CONTRACTS_COLLECTION = [
  'artifacts',
  appId,
  'private',
  'data',
  'laboral_contracts',
];

const getFundingLabel = (tipoFinanciamiento) => {
  if (tipoFinanciamiento === 'sep') return 'SEP';
  if (tipoFinanciamiento === 'mixto') return 'General + SEP';
  return 'General';
};

const usesGeneral = (tipoFinanciamiento) => {
  return tipoFinanciamiento === 'general' || tipoFinanciamiento === 'mixto';
};

const usesSep = (tipoFinanciamiento) => {
  return tipoFinanciamiento === 'sep' || tipoFinanciamiento === 'mixto';
};

const buildScheduleRowsHtml = (schedule) => {
  const rows = (schedule || [])
    .map((dayItem) => {
      const dayHours = calculateDayHours(dayItem);
      return `
        <tr>
          <td>${escapeHtml(dayItem.day)}</td>
          <td>${escapeHtml(formatScheduleText(dayItem.morningStart, dayItem.morningEnd) || '—')}</td>
          <td>${escapeHtml(formatScheduleText(dayItem.afternoonStart, dayItem.afternoonEnd) || '—')}</td>
          <td>${dayHours > 0 ? `${escapeHtml(formatHours(dayHours))} horas` : '—'}</td>
        </tr>
      `;
    })
    .join('');

  const totalWeeklyHours = calculateScheduleHours(schedule);

  return `${rows}
    <tr>
      <td colspan="3" style="text-align:right;font-weight:bold;background:#e2e8f0;">TOTAL HORAS SEMANALES EFECTIVAS</td>
      <td style="font-weight:bold;background:#e2e8f0;">${escapeHtml(formatHours(totalWeeklyHours))} horas</td>
    </tr>`;
};

const buildScheduleBlockHtml = (title, schedule) => {
  return `
    <p class="subclause-title">${escapeHtml(title)}</p>
    <table class="schedule-table">
      <thead>
        <tr>
          <th>Día</th>
          <th>Jornada mañana</th>
          <th>Jornada tarde</th>
          <th>Total horas efectivas</th>
        </tr>
      </thead>
      <tbody>${buildScheduleRowsHtml(schedule)}</tbody>
    </table>
  `;
};

const buildFundingScheduleHtml = ({ form, scheduleGeneral, scheduleSep }) => {
  const tipo = form.tipoFinanciamiento || 'general';
  const blocks = [];

  if (usesGeneral(tipo)) {
    blocks.push(buildScheduleBlockHtml('Horario financiado con Subvención General', scheduleGeneral));
  }

  if (usesSep(tipo)) {
    blocks.push(buildScheduleBlockHtml('Horario financiado con Subvención Escolar Preferencial (SEP)', scheduleSep));
  }

  return blocks.join('');
};

const buildFundingSummaryHtml = ({ form, totalHorasGeneral, totalHorasSep, totalHorasHorario }) => {
  const tipo = form.tipoFinanciamiento || 'general';
  const rows = [];

  if (usesGeneral(tipo)) {
    rows.push(`
      <tr>
        <td>Subvención General</td>
        <td>${escapeHtml(form.horasGeneral || formatHours(totalHorasGeneral))}</td>
        <td>${escapeHtml(formatCurrency(form.sueldoBaseGeneral))}</td>
      </tr>
    `);
  }

  if (usesSep(tipo)) {
    rows.push(`
      <tr>
        <td>Subvención Escolar Preferencial (SEP)</td>
        <td>${escapeHtml(form.horasSep || formatHours(totalHorasSep))}</td>
        <td>${escapeHtml(formatCurrency(form.sueldoBaseSep))}</td>
      </tr>
    `);
  }

  return `
    <table class="concept-table">
      <tr><th>Financiamiento</th><th>Horas semanales</th><th>Sueldo base asociado</th></tr>
      ${rows.join('')}
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${escapeHtml(form.jornadaHoras || formatHours(totalHorasHorario))}</strong></td>
        <td><strong>${escapeHtml(formatCurrency(Number(form.sueldoBaseGeneral || 0) + Number(form.sueldoBaseSep || 0)))}</strong></td>
      </tr>
    </table>
  `;
};

const buildExtraItemsRowsHtml = (extraItems) => {
  const cleanItems = (extraItems || []).filter(
    (item) => String(item.nombre || '').trim() || Number(item.monto || 0) > 0
  );

  if (cleanItems.length === 0) return '';

  return cleanItems
    .map((item) => {
      const observacion = String(item.observacion || '').trim();
      return `
        <tr>
          <td>${escapeHtml(item.nombre || 'Ítem adicional')}${observacion ? `<br /><span class="muted">${escapeHtml(observacion)}</span>` : ''}</td>
          <td><strong>${escapeHtml(formatCurrency(item.monto))}</strong></td>
        </tr>
      `;
    })
    .join('');
};

const buildWordHtml = ({
  form,
  funciones,
  scheduleGeneral,
  scheduleSep,
  extraItems,
  totalHorasGeneral,
  totalHorasSep,
  totalHorasHorario,
  totalRemuneracion,
}) => {
  const tipo = form.tipoFinanciamiento || 'general';
  const funcionesHtml = funciones
    .filter((funcion) => funcion.trim() !== '')
    .map((funcion) => `<li>${escapeHtml(funcion)}</li>`)
    .join('');

  const extraRows = buildExtraItemsRowsHtml(extraItems);

  const primeroGeneralHtml = `
  <div class="clause"><p><span class="clause-title">PRIMERO:</span> El Docente se obliga a desarrollar la función de <strong>${escapeHtml(form.funcionPrincipal)}</strong> y cualquier otra labor relacionada con la función docente propiamente tal que le encomiende el empleador. Además, consiente en ser cambiado de área de trabajo según las necesidades del servicio educativo, alguna labor afín para la que fue contratado, si fuere necesario y que la alteración no produzca menoscabo para el Docente.</p></div>`;

  const primeroSepHtml = (titulo = 'PRIMERO') => `
  <div class="clause"><p><span class="clause-title">${titulo}:</span> El Docente se obliga a desarrollar la labor de <strong>${escapeHtml(form.laborSep || '____________________________')}</strong> en el proyecto educativo denominado <strong>“${escapeHtml(form.proyectoSep || '____________________________')}”</strong>, en el marco del Plan de Mejoramiento Educativo inserto en la Ley de Subvención Escolar Preferencial, en virtud del Convenio de Igualdad de Oportunidades suscrito entre el empleador y el Ministerio de Educación. Estas labores se pactan y se regulan de acuerdo a lo dispuesto en el inciso 4° del artículo 79 de la Ley N° 19.070.</p></div>`;

  const primeroHtml =
    tipo === 'sep'
      ? primeroSepHtml('PRIMERO')
      : tipo === 'mixto'
        ? `${primeroGeneralHtml}${primeroSepHtml('PRIMERO BIS')}`
        : primeroGeneralHtml;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Contrato de trabajo docente</title>
  <style>
    @page WordSection1 { size: 8.5in 13in; margin: 1.35cm 1.45cm 1.35cm 1.45cm; }
    div.WordSection1 { page: WordSection1; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 10.7pt; line-height: 1.34; color: #111827; background: #ffffff; }
    p { text-align: justify; margin: 8px 0; }
    .top-band { border-collapse: collapse; width: 100%; margin: 0 0 12px 0; }
    .top-band td { border: none; padding: 0; }
    .brand-block { background: #0f2f5f; color: #ffffff; padding: 16px 18px; border-bottom: 5px solid #d99b2b; }
    .brand-title { font-size: 15pt; font-weight: bold; letter-spacing: 0.7px; text-transform: uppercase; margin: 0; }
    .brand-subtitle { font-size: 9.2pt; margin: 4px 0 0 0; color: #dbeafe; }
    .document-type { text-align: center; border: 1.5px solid #0f2f5f; background: #f8fafc; padding: 12px 18px; margin: 14px 0 16px 0; }
    .document-type .small { font-size: 9pt; color: #475569; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin-bottom: 4px; }
    .document-type .main { font-size: 17pt; color: #0f2f5f; font-weight: bold; text-transform: uppercase; margin: 0; }
    .meta-table { width: 100%; border-collapse: collapse; margin: 12px 0 14px 0; font-size: 9.8pt; }
    .meta-table th { background: #0f2f5f; color: #ffffff; border: 1px solid #0f2f5f; padding: 7px 8px; text-align: left; text-transform: uppercase; letter-spacing: 0.4px; font-size: 8.7pt; }
    .meta-table td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
    .meta-table .label { width: 23%; background: #f1f5f9; font-weight: bold; color: #1e293b; }
    .clause { margin: 10px 0; padding: 0 0 0 10px; border-left: 3px solid #d99b2b; page-break-inside: avoid; }
    .clause-title { color: #0f2f5f; font-weight: bold; text-transform: uppercase; }
    .subclause-title { margin-top: 12px; font-weight: bold; color: #0f2f5f; text-transform: uppercase; }
    ol { margin-top: 6px; margin-bottom: 8px; padding-left: 24px; }
    li { margin: 3px 0; text-align: justify; }
    .schedule-table { width: 100%; border-collapse: collapse; margin: 10px 0 8px 0; font-size: 9.3pt; page-break-inside: avoid; }
    .schedule-table th { background: #0f2f5f; color: #ffffff; border: 1px solid #0f2f5f; padding: 7px 6px; text-align: center; font-weight: bold; text-transform: uppercase; }
    .schedule-table td { border: 1px solid #94a3b8; padding: 6px 6px; text-align: center; vertical-align: middle; }
    .note-box { border: 1px solid #d99b2b; background: #fffbeb; padding: 9px 11px; margin: 10px 0; font-size: 9.6pt; page-break-inside: avoid; }
    .remuneration-box { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px 12px; margin: 10px 0; page-break-inside: avoid; }
    .amount-main { font-size: 12.5pt; font-weight: bold; color: #0f2f5f; }
    .concept-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9.7pt; }
    .concept-table th { background: #e2e8f0; color: #0f172a; border: 1px solid #94a3b8; padding: 6px; text-align: left; }
    .concept-table td { border: 1px solid #cbd5e1; padding: 6px; }
    .muted { color: #64748b; font-size: 8.6pt; }
    .signatures { margin-top: 54px; width: 100%; border-collapse: collapse; page-break-inside: avoid; }
    .signatures td { width: 50%; border: none; text-align: center; vertical-align: top; padding: 0 28px; font-size: 9.8pt; }
    .signature-line { border-top: 1.3px solid #111827; padding-top: 8px; margin-top: 30px; font-weight: bold; }
    .footer-note { margin-top: 22px; padding-top: 8px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 8.5pt; text-align: center; }
  </style>
</head>
<body>
<div class="WordSection1">
  <table class="top-band"><tr><td class="brand-block"><p class="brand-title">${escapeHtml(form.fundacion)}</p><p class="brand-subtitle">RUT N° ${escapeHtml(form.rutFundacion)} · ${escapeHtml(form.domicilioEmpleador)}</p></td></tr></table>
  <div class="document-type"><div class="small">Documento laboral interno</div><p class="main">Contrato de Trabajo Docente</p></div>

  <p>En ${escapeHtml(form.ciudad)}, a ${escapeHtml(form.fechaContrato)} comparece don <strong>${escapeHtml(form.representante)}</strong>, chileno, profesor, cédula nacional de identidad número ${escapeHtml(form.rutRepresentanteTexto)}, en representación de la <strong>${escapeHtml(form.fundacion)}</strong>, del giro Educacional, Rol Único Tributario número ${escapeHtml(form.rutFundacion)}, ambos con domicilio en ${escapeHtml(form.domicilioEmpleador)}, en adelante el <strong>“COLEGIO”</strong>, en calidad de empleador y el trabajador don(a):</p>

  <table class="meta-table">
    <tr><th colspan="4">Identificación del trabajador</th></tr>
    <tr><td class="label">Nombre</td><td>${escapeHtml(form.nombre || '____________________________')}</td><td class="label">Cédula de Identidad</td><td>${escapeHtml(form.rut || '____________________________')}</td></tr>
    <tr><td class="label">Domicilio</td><td colspan="3">${escapeHtml(form.domicilio || '____________________________')}</td></tr>
    <tr><td class="label">Nacionalidad</td><td>${escapeHtml(form.nacionalidad || '____________________________')}</td><td class="label">Estado civil</td><td>${escapeHtml(form.estadoCivil || '____________________________')}</td></tr>
    <tr><td class="label">Fecha nacimiento</td><td>${escapeHtml(form.fechaNacimiento || '____________________________')}</td><td class="label">Cargas</td><td>${escapeHtml(form.cargas || '0')}</td></tr>
    <tr><td class="label">Sistema Previsional</td><td>${escapeHtml(form.sistemaPrevisional || '____________________________')}</td><td class="label">Sistema de Salud</td><td>${escapeHtml(form.sistemaSalud || '____________________________')}</td></tr>
    <tr><td class="label">Profesión / oficio</td><td>${escapeHtml(form.profesion || '____________________________')}</td><td class="label">Teléfono</td><td>${escapeHtml(form.telefono || '____________________________')}</td></tr>
    <tr><td class="label">Correo electrónico</td><td colspan="3">${escapeHtml(form.correo || '____________________________')}</td></tr>
  </table>

  ${primeroHtml}

  <div class="clause"><p><span class="clause-title">SEGUNDO:</span> El Docente se obliga a desarrollar las siguientes funciones:</p><p><strong>a) DOCENCIA DE AULA:</strong> El docente realizará esta función como ${escapeHtml(form.funcionPrincipal)}, además de las funciones que le sean solicitadas por la Dirección de acuerdo a lo dispuesto en el artículo 6 letra b de la Ley N° 19.070 y en el artículo 20 del Reglamento del Estatuto Docente:</p><ol>${funcionesHtml}</ol></div>

  <div class="clause"><p><span class="clause-title">TERCERO:</span> Los servicios del Trabajador(a) se deben prestar en el Establecimiento Educacional denominado <strong>${escapeHtml(form.establecimiento)}</strong>, R.B.D. ${escapeHtml(form.rbd)}, ubicado en ${escapeHtml(form.direccionTrabajo)}; sin perjuicio de la facultad del empleador para modificar, por causa justificada, sea con consulta a el Trabajador(a) y sin menoscabo de esta, el sitio o recinto en donde deban prestarse los servicios, con la limitación de que el nuevo sitio o recinto quede dentro de la misma localidad o ciudad.</p></div>

  <div class="clause">
    <p><span class="clause-title">CUARTO:</span> La jornada de trabajo ordinaria será ${escapeHtml(form.diasTrabajo)} y corresponde a <strong>${escapeHtml(form.jornadaHoras || formatHours(totalHorasHorario))}</strong> horas cronológicas semanales. El presente contrato se registra con financiamiento <strong>${escapeHtml(getFundingLabel(tipo))}</strong>${tipo === 'mixto' ? ', diferenciándose las horas y horarios asociados a Subvención General y a Subvención Escolar Preferencial (SEP)' : ''}, conforme al siguiente detalle:</p>
    ${buildFundingSummaryHtml({ form, totalHorasGeneral, totalHorasSep, totalHorasHorario })}
    ${buildFundingScheduleHtml({ form, scheduleGeneral, scheduleSep })}
    <div class="note-box"><strong>Nota sobre colación:</strong> Se deja expresa constancia que el tiempo destinado a colación o almuerzo, especialmente el comprendido entre las 13:00 y las 14:00 horas cuando corresponda, no forma parte de la jornada efectiva de trabajo y, por tanto, no se considera para el cálculo de las horas cronológicas semanales.</div>
    <p>El horario precedente forma parte integrante del presente contrato de trabajo, sin perjuicio de las modificaciones que puedan acordarse conforme a las necesidades de funcionamiento del establecimiento y dentro de los márgenes permitidos por la normativa laboral vigente.</p>
    <p>El Docente realizará sus funciones no lectivas de acuerdo a lo dispuesto en el artículo 6 letra b de la Ley N° 19.070, modificada por la Ley N° 20.903, y en el artículo 20 del Reglamento del Estatuto Docente.</p>
    <p>El Docente deberá registrar su asistencia en el sistema que el Colegio lleva para tal efecto, tanto a la salida de su jornada de colación como a su reingreso a labores, cuando corresponda.</p>
    <p>El COLEGIO, en conformidad con la ley y de acuerdo con las necesidades de funcionamiento del establecimiento, podrá alterar el horario de inicio y término de la jornada diaria de trabajo, de acuerdo con las normas legales vigentes y sin menoscabo del trabajador.</p>
    <p>El Trabajador(a), acepta y autoriza al empleador para que le descuente las cotizaciones previsionales, de salud, seguro de cesantía e impuestos correspondientes y, además, el tiempo efectivamente no trabajado debido a atrasos, inasistencias o permisos, en caso de que procediere; asimismo acepta y autoriza al empleador para que su documentación derivada de la relación laboral sea confeccionada, procesada, firmada y remitida de manera electrónica, para esto, señala como medio válido de notificación y recepción su correo electrónico personal <strong>${escapeHtml(form.correo || '____________________________')}</strong>.</p>
  </div>

  <div class="clause">
    <p><span class="clause-title">QUINTO:</span> El Docente percibirá una remuneración bruta mensual de <span class="amount-main"><strong>${escapeHtml(formatCurrency(totalRemuneracion))}</strong></span> que será liquidada y pagada el 5to día hábil de cada mes, que a solicitud del trabajador(a) será pagada mediante depósito o transferencia a su ${escapeHtml(form.tipoCuenta || 'cuenta')} N° ${escapeHtml(form.numeroCuenta || '________________')} del ${escapeHtml(form.banco || '________________')}; debiendo pasar a la oficina de administración al día siguiente hábil que le corresponda prestar servicio, a retirar y firmar su comprobante de pago de remuneraciones.</p>
    <div class="remuneration-box">
      <strong>La remuneración está compuesta por los siguientes conceptos:</strong>
      <table class="concept-table">
        <tr><th>Concepto</th><th>Monto</th></tr>
        ${usesGeneral(tipo) ? `<tr><td>Sueldo Base General</td><td><strong>${escapeHtml(formatCurrency(form.sueldoBaseGeneral))}</strong></td></tr>` : ''}
        ${usesSep(tipo) ? `<tr><td>Sueldo Base SEP</td><td><strong>${escapeHtml(formatCurrency(form.sueldoBaseSep))}</strong></td></tr>` : ''}
        <tr><td>Ley 19.410 + 19.933</td><td><strong>${escapeHtml(formatCurrency(form.leyes))}</strong></td></tr>
        ${extraRows}
        <tr><td><strong>Total remuneración bruta mensual</strong></td><td><strong>${escapeHtml(formatCurrency(totalRemuneracion))}</strong></td></tr>
      </table>
      <p>${escapeHtml(form.brpTexto)}</p>
    </div>
    <p>El empleador pagará los bonos estatales, aguinaldos y cualquier otro beneficio remuneratorio que otorgue el Estado y que sean financiados a través de la subvención en la liquidación de sueldo del mes que se hubieren recibido los fondos por parte del Mineduc; toda vez que el empleador sólo es un intermediador de dicho pago.</p>
  </div>

  <div class="clause"><p><span class="clause-title">SEXTO:</span> De las obligaciones y prohibiciones. Son obligaciones y prohibiciones esenciales del presente contrato de trabajo, y cuya infracción se entenderá como infracción grave a las obligaciones que impone el contrato, sin perjuicio que esta causal sea calificada por los tribunales de justicia, las siguientes:</p><ol><li>Cumplir íntegramente la jornada de trabajo y la distribución de la carga horaria establecida en el presente contrato y/o anexo horario.</li><li>Registrar asistencia en el sistema que el Colegio lleve para tal efecto.</li><li>Acatar las órdenes e instrucciones de la autoridad del empleador.</li><li>Respetar al empleador, representantes, jefes, compañeros de trabajo, apoderados y alumnos.</li><li>Mantener estricta reserva de los antecedentes que conozca en razón de su cargo.</li><li>Cumplir el Proyecto Educativo Institucional, Reglamento Interno, Reglamento de Evaluación, protocolos y demás instructivos internos.</li><li>Denunciar inmediatamente a la Dirección del Colegio cualquier situación que implique eventual vulneración de derechos de estudiantes.</li></ol></div>
  <div class="clause"><p><span class="clause-title">SÉPTIMO:</span> Sin perjuicio de lo establecido en la cláusula precedente, son obligaciones esenciales del docente de aula llevar control de asistencia de los alumnos, mantener actualizados los registros pedagógicos, asistir a reuniones determinadas por Dirección, cumplir con las disposiciones del reglamento de evaluación, participar en actividades técnico-pedagógicas y desarrollar sus funciones conforme al Proyecto Educativo Institucional.</p></div>
  <div class="clause"><p><span class="clause-title">OCTAVO:</span> Las partes convienen en elevar a la calidad de esencial de este contrato la obligación del trabajador de guardar secreto total respecto a las informaciones de que tome conocimiento en relación al proyecto educativo, su ejecución y cualquier otro antecedente cuya divulgación signifique o pueda significar perjuicio para el Colegio o su sostenedora educacional.</p></div>
  <div class="clause"><p><span class="clause-title">NOVENO:</span> El Docente se obliga a realizar todas las labores propias e inherentes del cargo para que se le contrata, así como las funciones que están contenidas en la descripción de cargo y en el Reglamento Interno de Orden, Higiene y Seguridad del Colegio.</p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO:</span> El trabajador se obliga a respetar el Reglamento Interno de Orden, Higiene y Seguridad, el Reglamento Interno del Colegio, sus protocolos y el respeto a todos los miembros de la comunidad escolar.</p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO PRIMERO:</span> El Docente hará uso de su feriado anual de acuerdo a las normas establecidas en la Ley N° 19.070. Con todo, deberá participar de las actividades de capacitación y preparación del año escolar a que el empleador le cite en jornada laboral.</p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO SEGUNDO:</span> En caso de renuncia voluntaria, se debe dar el aviso correspondiente con a lo menos 30 días de anticipación como mínimo y deberá presentar esta renuncia por escrito y firmarla ante Notario o en la Inspección del Trabajo.</p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO TERCERO:</span> El presente contrato comenzará a regir el <strong>${escapeHtml(form.fechaInicio)}</strong> y tendrá una duración hasta el día <strong>${escapeHtml(form.fechaTermino)}</strong>, terminado ipso facto al vencimiento del tiempo estipulado en él.</p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO CUARTO:</span> Para todos los efectos de comunicaciones y notificaciones, las partes establecen los siguientes correos electrónicos, obligándose a dar aviso en caso de que los cambien o presenten problemas.<br /><br />Correo electrónico empleador: <strong>${escapeHtml(form.correoEmpleador)}</strong><br />Correo electrónico personal del trabajador: <strong>${escapeHtml(form.correo || '____________________________')}</strong></p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO QUINTO:</span> Para todos los efectos derivados del presente contrato las partes fijan su domicilio en la ciudad de Quillota y se someten a la jurisdicción de sus tribunales.</p></div>
  <div class="clause"><p><span class="clause-title">DÉCIMO SEXTO:</span> El presente contrato se extiende en dos ejemplares, quedando uno en poder del empleador y uno en poder del trabajador, quien declara recibirlo en este acto, en conjunto con una copia del reglamento interno.</p></div>

  <table class="signatures"><tr><td><div class="signature-line">EMPLEADOR</div>${escapeHtml(form.fundacion)}<br />RUT N° ${escapeHtml(form.rutFundacion)}</td><td><div class="signature-line">${escapeHtml(form.nombre || 'TRABAJADOR(A)')}</div>${escapeHtml(form.rut || 'RUT')}<br />TRABAJADOR(A)</td></tr></table>
  <div class="footer-note">Documento generado por CISPTEMA · Sistema de Gestión Documental Laboral del Colegio Italiano de San Pedro.</div>
</div>
</body>
</html>`;
};

const defaultForm = {
  fechaContrato: '01 de Marzo 2026',
  ciudad: 'Quillota (Localidad San Pedro)',
  representante: 'JULIO ENRIQUE INOCENCIO ALVEAR',
  rutRepresentanteTexto: 'cinco millones quinientos ocho mil setecientos sesenta y nueve guión cinco',
  fundacion: 'FUNDACIÓN EDUCACIONAL JULIO INOCENCIO ALVEAR',
  rutFundacion: '65.154.625-7',
  domicilioEmpleador: 'Rene Schneider número 206, San Pedro, Quillota',
  nombre: '',
  rut: '',
  domicilio: '',
  nacionalidad: 'Chilena',
  estadoCivil: '',
  fechaNacimiento: '',
  sistemaPrevisional: '',
  sistemaSalud: '',
  cargas: '0',
  profesion: '',
  telefono: '',
  correo: '',
  funcionPrincipal: 'Profesor educación básica',
  laborSep: '',
  proyectoSep: '',
  establecimiento: 'COLEGIO ITALIANO DE SAN PEDRO',
  rbd: '14308-1',
  direccionTrabajo: 'Rene Schneider número 206, San Pedro, Quillota',
  tipoFinanciamiento: 'general',
  jornadaHoras: '26',
  horasGeneral: '26',
  horasSep: '',
  diasTrabajo: 'Lunes a Viernes',
  fechaInicio: '1 de marzo 2026',
  fechaTermino: '28 de febrero 2027',
  sueldoBaseGeneral: '',
  sueldoBaseSep: '',
  leyes: '',
  remuneracionBruta: '',
  brpTexto: 'Además, el trabajador tendrá derecho a percibir, además de la remuneración base, la Bonificación de Reconocimiento Profesional (BRP), cuyo monto se determinará conforme a la normativa legal vigente y sus modificaciones, en proporción a su carga horaria y antecedentes profesionales.',
  banco: '',
  tipoCuenta: '',
  numeroCuenta: '',
  correoEmpleador: 'inocenciojulio@yahoo.es',
};

export default function SistemaLaboral({ userProfile }) {
  const [form, setForm] = useState(defaultForm);
  const [funciones, setFunciones] = useState(initialFunctions);
  const [scheduleGeneral, setScheduleGeneral] = useState(defaultSchedule);
  const [scheduleSep, setScheduleSep] = useState(emptySchedule);
  const [extraItems, setExtraItems] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [savedContracts, setSavedContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [saving, setSaving] = useState(false);
  const [databaseError, setDatabaseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isAdmin = userProfile?.role === 'admin';
  const tipo = form.tipoFinanciamiento || 'general';
  const showGeneral = usesGeneral(tipo);
  const showSep = usesSep(tipo);

  const totalHorasGeneral = useMemo(() => calculateScheduleHours(scheduleGeneral), [scheduleGeneral]);
  const totalHorasSep = useMemo(() => calculateScheduleHours(scheduleSep), [scheduleSep]);

  const totalHorasHorario = useMemo(() => {
    if (tipo === 'sep') return totalHorasSep;
    if (tipo === 'mixto') return totalHorasGeneral + totalHorasSep;
    return totalHorasGeneral;
  }, [tipo, totalHorasGeneral, totalHorasSep]);

  const totalExtraItems = useMemo(() => {
    return extraItems.reduce((total, item) => total + Number(item.monto || 0), 0);
  }, [extraItems]);

  const totalRemuneracion = useMemo(() => {
    const general = showGeneral ? Number(form.sueldoBaseGeneral || 0) : 0;
    const sep = showSep ? Number(form.sueldoBaseSep || 0) : 0;
    const leyes = Number(form.leyes || 0);
    return general + sep + leyes + totalExtraItems;
  }, [showGeneral, showSep, form.sueldoBaseGeneral, form.sueldoBaseSep, form.leyes, totalExtraItems]);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const contractsRef = collection(db, ...LABORAL_CONTRACTS_COLLECTION);
    const contractsQuery = query(contractsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      contractsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }));

        setSavedContracts(data);
        setDatabaseError('');
      },
      (error) => {
        console.error('Error cargando contratos laborales:', error);
        setDatabaseError('No se pudo cargar la base de datos laboral. Revisa las reglas de Firestore para la colección privada.');
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateTipoFinanciamiento = (value) => {
    setForm((prev) => {
      const next = { ...prev, tipoFinanciamiento: value };
      if (value === 'general') {
        next.horasGeneral = prev.horasGeneral || prev.jornadaHoras || '';
        next.horasSep = '';
        next.sueldoBaseSep = '';
      }
      if (value === 'sep') {
        next.horasSep = prev.horasSep || prev.jornadaHoras || '';
        next.horasGeneral = '';
        next.sueldoBaseGeneral = '';
      }
      if (value === 'mixto') {
        next.horasGeneral = prev.horasGeneral || '';
        next.horasSep = prev.horasSep || '';
      }
      return next;
    });
  };

  const updateFunction = (index, value) => {
    setFunciones((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const addFunction = () => setFunciones((prev) => [...prev, '']);
  const removeFunction = (index) => setFunciones((prev) => prev.filter((_, itemIndex) => itemIndex !== index));

  const updateScheduleDay = (kind, day, field, value) => {
    const normalizedValue = normalizeTimeInput(value);
    const setter = kind === 'sep' ? setScheduleSep : setScheduleGeneral;
    setter((prev) => prev.map((item) => (item.day === day ? { ...item, [field]: normalizedValue } : item)));
  };

  const clearDaySchedule = (kind, day) => {
    const setter = kind === 'sep' ? setScheduleSep : setScheduleGeneral;
    setter((prev) =>
      prev.map((item) =>
        item.day === day
          ? { ...item, morningStart: '', morningEnd: '', afternoonStart: '', afternoonEnd: '' }
          : item
      )
    );
  };

  const copyMondayToFriday = (kind) => {
    const setter = kind === 'sep' ? setScheduleSep : setScheduleGeneral;
    setter((prev) => {
      const monday = prev.find((item) => item.day === 'LUNES');
      if (!monday) return prev;
      return prev.map((item) =>
        ['MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'].includes(item.day)
          ? {
              ...item,
              morningStart: monday.morningStart,
              morningEnd: monday.morningEnd,
              afternoonStart: monday.afternoonStart,
              afternoonEnd: monday.afternoonEnd,
            }
          : item
      );
    });
  };

  const addExtraItem = () => {
    setExtraItems((prev) => [...prev, { nombre: '', monto: '', observacion: '' }]);
  };

  const updateExtraItem = (index, field, value) => {
    setExtraItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const removeExtraItem = (index) => {
    setExtraItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const buildContractPayload = () => {
    return {
      documentType: 'Contrato docente plazo fijo',
      workerName: form.nombre || 'Sin nombre',
      workerRut: form.rut || '',
      tipoFinanciamiento: form.tipoFinanciamiento || 'general',
      form: {
        ...form,
        remuneracionBruta: totalRemuneracion,
      },
      funciones,
      scheduleGeneral,
      scheduleSep,
      schedule: scheduleGeneral,
      extraItems,
      totalHorasGeneral,
      totalHorasSep,
      totalHorasHorario,
      totalRemuneracionCalculado: totalRemuneracion,
      updatedAt: serverTimestamp(),
      updatedBy: userProfile?.email || userProfile?.uid || 'admin',
    };
  };

  const saveNewContract = async () => {
    try {
      setSaving(true);
      setDatabaseError('');
      setSuccessMessage('');
      const contractsRef = collection(db, ...LABORAL_CONTRACTS_COLLECTION);
      const docRef = await addDoc(contractsRef, { ...buildContractPayload(), createdAt: serverTimestamp() });
      setSelectedContractId(docRef.id);
      setSuccessMessage('Contrato guardado correctamente en la base de datos.');
    } catch (error) {
      console.error('Error guardando contrato:', error);
      setDatabaseError('No se pudo guardar el contrato. Revisa las reglas de Firestore y que tu usuario tenga permisos de administrador.');
    } finally {
      setSaving(false);
    }
  };

  const updateSelectedContract = async () => {
    if (!selectedContractId) {
      setDatabaseError('Primero debes cargar o guardar un contrato para poder actualizarlo.');
      return;
    }

    try {
      setSaving(true);
      setDatabaseError('');
      setSuccessMessage('');
      const contractRef = doc(db, ...LABORAL_CONTRACTS_COLLECTION, selectedContractId);
      await updateDoc(contractRef, buildContractPayload());
      setSuccessMessage('Contrato actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando contrato:', error);
      setDatabaseError('No se pudo actualizar el contrato seleccionado. Revisa los permisos de Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const loadContract = (contract) => {
    if (!contract) return;

    setForm({
      ...defaultForm,
      ...(contract.form || {}),
      tipoFinanciamiento: contract.tipoFinanciamiento || contract.form?.tipoFinanciamiento || 'general',
    });
    setFunciones(Array.isArray(contract.funciones) && contract.funciones.length > 0 ? contract.funciones : initialFunctions);
    setScheduleGeneral(
      Array.isArray(contract.scheduleGeneral) && contract.scheduleGeneral.length > 0
        ? contract.scheduleGeneral
        : Array.isArray(contract.schedule) && contract.schedule.length > 0
          ? contract.schedule
          : defaultSchedule
    );
    setScheduleSep(Array.isArray(contract.scheduleSep) && contract.scheduleSep.length > 0 ? contract.scheduleSep : emptySchedule);
    setExtraItems(Array.isArray(contract.extraItems) ? contract.extraItems : []);
    setSelectedContractId(contract.id);
    setSuccessMessage(`Contrato cargado: ${contract.workerName || 'Sin nombre'}.`);
    setDatabaseError('');
  };

  const startNewContract = () => {
    setSelectedContractId('');
    setSuccessMessage('');
    setDatabaseError('');
    setForm(defaultForm);
    setFunciones(initialFunctions);
    setScheduleGeneral(defaultSchedule);
    setScheduleSep(emptySchedule);
    setExtraItems([]);
  };

  const downloadWordContract = () => {
    const html = buildWordHtml({
      form: { ...form, remuneracionBruta: totalRemuneracion },
      funciones,
      scheduleGeneral,
      scheduleSep,
      extraItems,
      totalHorasGeneral,
      totalHorasSep,
      totalHorasHorario,
      totalRemuneracion,
    });
    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const workerName = sanitizeFileName(form.nombre || 'trabajador');
    link.href = url;
    link.download = `contrato_docente_${workerName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    const confirmed = window.confirm('¿Seguro que deseas limpiar el formulario?');
    if (!confirmed) return;
    startNewContract();
  };

  const handlePrint = () => window.print();

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/20 text-red-200"><Lock size={34} /></div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-red-200">Acceso restringido</p>
          <h1 className="text-3xl font-black md:text-5xl">Sistema Laboral Interno</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">Esta sección contiene documentación laboral del establecimiento y solo puede ser utilizada por el administrador autorizado.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.25),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur"><ShieldCheck size={18} />Área privada de administración</div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Sistema de Gestión Documental Laboral</h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-300">Generador de contratos docentes con financiamiento General, SEP o mixto, horarios separados, remuneraciones desglosadas y descarga en Word.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[420px_1fr]">
        <aside className="space-y-6 print:hidden">
          <Panel title="Datos del documento" icon={<FileText size={20} />}>
            <Input label="Ciudad / localidad" value={form.ciudad} onChange={(value) => updateField('ciudad', value)} />
            <Input label="Fecha del contrato" value={form.fechaContrato} onChange={(value) => updateField('fechaContrato', value)} />
            <Input label="Fecha de inicio" value={form.fechaInicio} onChange={(value) => updateField('fechaInicio', value)} />
            <Input label="Fecha de término" value={form.fechaTermino} onChange={(value) => updateField('fechaTermino', value)} />
          </Panel>

          <Panel title="Base de datos e historial" icon={<Database size={20} />}>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              <p className="font-bold text-slate-900">Contrato actual</p>
              <p className="mt-1">{selectedContractId ? 'Estás trabajando sobre un contrato guardado. Puedes actualizarlo o descargarlo en Word.' : 'Este contrato aún no está asociado a un registro guardado.'}</p>
            </div>

            {successMessage && <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{successMessage}</div>}
            {databaseError && <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{databaseError}</div>}

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={saveNewContract} disabled={saving} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"><Save size={18} />Guardar nuevo</button>
              <button type="button" onClick={updateSelectedContract} disabled={saving || !selectedContractId} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><Save size={18} />Actualizar</button>
            </div>

            <button type="button" onClick={downloadWordContract} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"><Download size={18} />Descargar Word del contrato actual</button>
            <button type="button" onClick={startNewContract} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"><FileText size={18} />Crear contrato en blanco</button>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Historial guardado</h3><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{savedContracts.length}</span></div>
              <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {savedContracts.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">Aún no hay contratos guardados.</p>
                ) : (
                  savedContracts.map((contract) => (
                    <button key={contract.id} type="button" onClick={() => loadContract(contract)} className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedContractId === contract.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><FolderOpen size={17} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900">{contract.workerName || 'Sin nombre'}</p>
                          <p className="text-xs font-semibold text-slate-500">{contract.workerRut || 'Sin RUT'} · {contract.documentType || 'Contrato'}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{getFundingLabel(contract.tipoFinanciamiento || contract.form?.tipoFinanciamiento || 'general')} · Horas: {formatHours(contract.totalHorasHorario || 0)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </Panel>

          <Panel title="Datos del trabajador" icon={<UserRound size={20} />}>
            <Input label="Nombre completo" value={form.nombre} onChange={(value) => updateField('nombre', value)} />
            <Input label="RUT" value={form.rut} onChange={(value) => updateField('rut', value)} />
            <Input label="Domicilio" value={form.domicilio} onChange={(value) => updateField('domicilio', value)} />
            <div className="grid grid-cols-2 gap-3"><Input label="Nacionalidad" value={form.nacionalidad} onChange={(value) => updateField('nacionalidad', value)} /><Input label="Estado civil" value={form.estadoCivil} onChange={(value) => updateField('estadoCivil', value)} /></div>
            <Input label="Fecha de nacimiento" value={form.fechaNacimiento} onChange={(value) => updateField('fechaNacimiento', value)} />
            <div className="grid grid-cols-2 gap-3"><Input label="Sistema previsional" value={form.sistemaPrevisional} onChange={(value) => updateField('sistemaPrevisional', value)} /><Input label="Sistema de salud" value={form.sistemaSalud} onChange={(value) => updateField('sistemaSalud', value)} /></div>
            <div className="grid grid-cols-2 gap-3"><Input label="Cargas" value={form.cargas} onChange={(value) => updateField('cargas', value)} /><Input label="Teléfono" value={form.telefono} onChange={(value) => updateField('telefono', value)} /></div>
            <Input label="Profesión / oficio" value={form.profesion} onChange={(value) => updateField('profesion', value)} />
            <Input label="Correo electrónico personal" value={form.correo} onChange={(value) => updateField('correo', value)} />
          </Panel>

          <Panel title="Datos contractuales" icon={<BriefcaseBusiness size={20} />}>
            <Input label="Función principal General" value={form.funcionPrincipal} onChange={(value) => updateField('funcionPrincipal', value)} />
            {showSep && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                  Cláusula PRIMERO SEP
                </p>
                <div className="space-y-3">
                  <Input label="Labor SEP" value={form.laborSep} onChange={(value) => updateField('laborSep', value)} />
                  <Input label="Nombre del proyecto SEP" value={form.proyectoSep} onChange={(value) => updateField('proyectoSep', value)} />
                </div>
              </div>
            )}
            <Input label="Establecimiento" value={form.establecimiento} onChange={(value) => updateField('establecimiento', value)} />
            <Input label="RBD" value={form.rbd} onChange={(value) => updateField('rbd', value)} />
            <Input label="Dirección donde prestará servicios" value={form.direccionTrabajo} onChange={(value) => updateField('direccionTrabajo', value)} />
          </Panel>

          <Panel title="Financiamiento del contrato" icon={<Layers size={20} />}>
            <Select label="Tipo de financiamiento" value={form.tipoFinanciamiento} onChange={updateTipoFinanciamiento} options={[{ value: 'general', label: 'General' }, { value: 'sep', label: 'SEP' }, { value: 'mixto', label: 'General + SEP' }]} />
            <div className="rounded-2xl bg-blue-50 p-4 text-sm font-medium leading-relaxed text-blue-900">
              Si seleccionas <strong>General + SEP</strong>, el contrato mostrará dos horarios separados y dos sueldos base: uno General y otro SEP.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Horas totales contrato" type="number" value={form.jornadaHoras} onChange={(value) => updateField('jornadaHoras', value)} />
              <Input label="Resumen de días" value={form.diasTrabajo} onChange={(value) => updateField('diasTrabajo', value)} />
            </div>
            {showGeneral && <Input label="Horas General" type="number" value={form.horasGeneral} onChange={(value) => updateField('horasGeneral', value)} />}
            {showSep && <Input label="Horas SEP" type="number" value={form.horasSep} onChange={(value) => updateField('horasSep', value)} />}
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Total horario calculado</p>
              <p className="mt-1 text-2xl font-black">{formatHours(totalHorasHorario)} horas</p>
              <p className="mt-1 text-xs text-slate-300">General: {formatHours(totalHorasGeneral)} · SEP: {formatHours(totalHorasSep)}</p>
              {Number(form.jornadaHoras || 0) > 0 && totalHorasHorario !== Number(form.jornadaHoras || 0) && (
                <p className="mt-2 rounded-xl bg-orange-500/20 px-3 py-2 text-xs font-bold text-orange-100">Atención: el total calculado no coincide con las horas semanales indicadas en el contrato.</p>
              )}
            </div>
          </Panel>

          {showGeneral && (
            <Panel title="Horario General" icon={<Clock size={20} />}>
              <ScheduleEditor kind="general" schedule={scheduleGeneral} totalHoras={totalHorasGeneral} onUpdate={updateScheduleDay} onClearDay={clearDaySchedule} onCopyMonday={copyMondayToFriday} />
            </Panel>
          )}

          {showSep && (
            <Panel title="Horario SEP" icon={<Clock size={20} />}>
              <ScheduleEditor kind="sep" schedule={scheduleSep} totalHoras={totalHorasSep} onUpdate={updateScheduleDay} onClearDay={clearDaySchedule} onCopyMonday={copyMondayToFriday} />
            </Panel>
          )}

          <Panel title="Remuneraciones" icon={<DollarSign size={20} />}>
            {showGeneral && <Input label="Sueldo Base General" type="number" value={form.sueldoBaseGeneral} onChange={(value) => updateField('sueldoBaseGeneral', value)} />}
            {showSep && <Input label="Sueldo Base SEP" type="number" value={form.sueldoBaseSep} onChange={(value) => updateField('sueldoBaseSep', value)} />}
            <Input label="Ley 19.410 + 19.933" type="number" value={form.leyes} onChange={(value) => updateField('leyes', value)} />

            <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              <p className="font-bold">Total remuneración bruta calculada:</p>
              <p className="text-lg font-black text-slate-950">{formatCurrency(totalRemuneracion)}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Incluye sueldos base, leyes e ítems adicionales.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Otros ítems de remuneración</h3>
                  <p className="text-xs text-slate-500">Bonos, asignaciones o pagos especiales.</p>
                </div>
                <button type="button" onClick={addExtraItem} className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"><Plus size={15} />Agregar</button>
              </div>

              {extraItems.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">Sin ítems adicionales.</p>
              ) : (
                <div className="space-y-3">
                  {extraItems.map((item, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="grid grid-cols-[1fr_120px_38px] gap-2">
                        <input value={item.nombre} onChange={(event) => updateExtraItem(index, 'nombre', event.target.value)} placeholder="Nombre del ítem" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                        <input type="number" value={item.monto} onChange={(event) => updateExtraItem(index, 'monto', event.target.value)} placeholder="Monto" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                        <button type="button" onClick={() => removeExtraItem(index)} className="flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={17} /></button>
                      </div>
                      <input value={item.observacion} onChange={(event) => updateExtraItem(index, 'observacion', event.target.value)} placeholder="Observación opcional" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <TextArea label="Texto BRP" value={form.brpTexto} onChange={(value) => updateField('brpTexto', value)} />
            <Input label="Banco" value={form.banco} onChange={(value) => updateField('banco', value)} />
            <Input label="Tipo de cuenta" value={form.tipoCuenta} onChange={(value) => updateField('tipoCuenta', value)} />
            <Input label="Número de cuenta" value={form.numeroCuenta} onChange={(value) => updateField('numeroCuenta', value)} />
          </Panel>

          <Panel title="Funciones editables" icon={<FileText size={20} />}>
            <div className="space-y-3">
              {funciones.map((funcion, index) => (
                <div key={index} className="flex gap-2">
                  <textarea value={funcion} onChange={(event) => updateFunction(index, event.target.value)} className="min-h-[74px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder={`Función ${index + 1}`} />
                  <button type="button" onClick={() => removeFunction(index)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100" title="Eliminar función"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addFunction} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"><Plus size={18} />Agregar función</button>
          </Panel>

          <div className="sticky bottom-4 grid grid-cols-2 gap-3 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-2xl backdrop-blur">
            <button type="button" onClick={() => setShowPreview((prev) => !prev)} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"><Eye size={18} />Vista</button>
            <button type="button" onClick={handlePrint} className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"><Printer size={18} />Imprimir</button>
            <button type="button" onClick={downloadWordContract} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"><Download size={18} />Descargar Word</button>
            <button type="button" onClick={resetForm} className="col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Limpiar formulario</button>
          </div>
        </aside>

        {showPreview && (
          <section className="rounded-[2rem] bg-white p-4 shadow-xl print:rounded-none print:p-0 print:shadow-none">
            <article className="contract-document mx-auto max-w-[850px] bg-white p-8 text-[14px] leading-relaxed text-black print:max-w-none print:p-0">
              <h2 className="text-center text-lg font-bold uppercase">CONTRATO DE TRABAJO DOCENTE</h2>
              <p className="mt-8 text-justify">En {form.ciudad}, a {form.fechaContrato} comparece don <strong>{form.representante}</strong>, chileno, profesor, cédula nacional de identidad número {form.rutRepresentanteTexto}, en representación de la <strong>{form.fundacion}</strong>, del giro Educacional, Rol Único Tributario número {form.rutFundacion}, ambos con domicilio en {form.domicilioEmpleador}, en adelante el <strong>“COLEGIO”</strong>, en calidad de empleador y el trabajador don(a):</p>

              <div className="mt-6 grid grid-cols-[190px_1fr] gap-y-1">
                <strong>Nombre</strong><span>: {form.nombre || '____________________________'}</span>
                <strong>Cédula de Identidad</strong><span>: {form.rut || '____________________________'}</span>
                <strong>Domicilio</strong><span>: {form.domicilio || '____________________________'}</span>
                <strong>Nacionalidad</strong><span>: {form.nacionalidad || '____________________________'}</span>
                <strong>Estado civil</strong><span>: {form.estadoCivil || '____________________________'}</span>
                <strong>Fecha de nacimiento</strong><span>: {form.fechaNacimiento || '____________________________'}</span>
                <strong>Sistema Previsional</strong><span>: {form.sistemaPrevisional || '____________________________'}</span>
                <strong>Sistema de Salud</strong><span>: {form.sistemaSalud || '____________________________'}</span>
                <strong>Cargas</strong><span>: {form.cargas || '0'}</span>
                <strong>Profesión / oficio</strong><span>: {form.profesion || '____________________________'}</span>
                <strong>Teléfono</strong><span>: {form.telefono || '____________________________'}</span>
                <strong>Correo electrónico</strong><span>: {form.correo || '____________________________'}</span>
              </div>

              {showGeneral && (
                <Clause title="PRIMERO">
                  El Docente se obliga a desarrollar la función de <strong>{form.funcionPrincipal}</strong> y cualquier otra labor relacionada con la función docente propiamente tal que le encomiende el empleador. Además, consiente en ser cambiado de área de trabajo según las necesidades del servicio educativo, alguna labor afín para la que fue contratado, si fuere necesario y que la alteración no produzca menoscabo para el Docente.
                </Clause>
              )}

              {showSep && (
                <Clause title={tipo === 'mixto' ? 'PRIMERO BIS' : 'PRIMERO'}>
                  El Docente se obliga a desarrollar la labor de <strong>{form.laborSep || '____________________________'}</strong> en el proyecto educativo denominado <strong>“{form.proyectoSep || '____________________________'}”</strong>, en el marco del Plan de Mejoramiento Educativo inserto en la Ley de Subvención Escolar Preferencial, en virtud del Convenio de Igualdad de Oportunidades suscrito entre el empleador y el Ministerio de Educación. Estas labores se pactan y se regulan de acuerdo a lo dispuesto en el inciso 4° del artículo 79 de la Ley N° 19.070.
                </Clause>
              )}

              <Clause title="SEGUNDO">El Docente se obliga a desarrollar las siguientes funciones:<br /><br /><strong>a) DOCENCIA DE AULA:</strong> El docente realizará esta función como {form.funcionPrincipal}, además de las funciones que le sean solicitadas por la Dirección de acuerdo a lo dispuesto en el artículo 6 letra b de la Ley N° 19.070 y en el artículo 20 del Reglamento del Estatuto Docente:<ol className="mt-4 list-decimal space-y-1 pl-8">{funciones.filter((funcion) => funcion.trim() !== '').map((funcion, index) => <li key={index}>{funcion}</li>)}</ol></Clause>
              <Clause title="TERCERO">Los servicios del Trabajador(a) se deben prestar en el Establecimiento Educacional denominado <strong>{form.establecimiento}</strong>, R.B.D. {form.rbd}, ubicado en {form.direccionTrabajo}; sin perjuicio de la facultad del empleador para modificar, por causa justificada, sea con consulta a el Trabajador(a) y sin menoscabo de esta, el sitio o recinto en donde deban prestarse los servicios, con la limitación de que el nuevo sitio o recinto quede dentro de la misma localidad o ciudad.</Clause>
              <Clause title="CUARTO">La jornada de trabajo ordinaria será {form.diasTrabajo} y corresponde a <strong>{form.jornadaHoras || formatHours(totalHorasHorario)}</strong> horas cronológicas semanales. Tipo de financiamiento: <strong>{getFundingLabel(tipo)}</strong>.<br /><br /><FundingSummaryPreview form={form} totalHorasGeneral={totalHorasGeneral} totalHorasSep={totalHorasSep} totalHorasHorario={totalHorasHorario} />{showGeneral && <><br /><strong>Horario General</strong><SchedulePreview schedule={scheduleGeneral} /></>}{showSep && <><br /><strong>Horario SEP</strong><SchedulePreview schedule={scheduleSep} /></>}<br />Se deja expresa constancia que el tiempo destinado a colación o almuerzo, especialmente el comprendido entre las 13:00 y las 14:00 horas cuando corresponda, no forma parte de la jornada efectiva de trabajo y, por tanto, no se considera para el cálculo de las horas cronológicas semanales.<br /><br />El horario precedente forma parte integrante del presente contrato de trabajo, sin perjuicio de las modificaciones que puedan acordarse conforme a las necesidades de funcionamiento del establecimiento y dentro de los márgenes permitidos por la normativa laboral vigente.</Clause>
              <Clause title="QUINTO">El Docente percibirá una remuneración bruta mensual de <strong>{formatCurrency(totalRemuneracion)}</strong> que será liquidada y pagada el 5to día hábil de cada mes, que a solicitud del trabajador(a) será pagada mediante depósito o transferencia a su {form.tipoCuenta || 'cuenta'} N° {form.numeroCuenta || '________________'} del {form.banco || '________________'}.<br /><br />La remuneración está compuesta por los siguientes conceptos:<br /><br /><RemunerationPreview form={form} extraItems={extraItems} showGeneral={showGeneral} showSep={showSep} totalRemuneracion={totalRemuneracion} /><br />{form.brpTexto}<br /><br />El empleador pagará los bonos estatales, aguinaldos y cualquier otro beneficio remuneratorio que otorgue el Estado y que sean financiados a través de la subvención en la liquidación de sueldo del mes que se hubieren recibido los fondos por parte del Mineduc; toda vez que el empleador sólo es un intermediador de dicho pago.</Clause>
              <Clause title="SEXTO">De las obligaciones y prohibiciones. Son obligaciones y prohibiciones esenciales del presente contrato de trabajo, y cuya infracción se entenderá como infracción grave a las obligaciones que impone el contrato, sin perjuicio que esta causal sea calificada por los tribunales de justicia, las siguientes:<ol className="mt-4 list-decimal space-y-1 pl-8"><li>Cumplir íntegramente la jornada de trabajo y la distribución de la carga horaria establecida en el presente contrato y/o anexo horario.</li><li>Registrar asistencia en el sistema que el Colegio lleve para tal efecto.</li><li>Acatar las órdenes e instrucciones de la autoridad del empleador.</li><li>Respetar al empleador, representantes, jefes, compañeros de trabajo, apoderados y alumnos.</li><li>Mantener estricta reserva de los antecedentes que conozca en razón de su cargo.</li><li>Cumplir el Proyecto Educativo Institucional, Reglamento Interno, Reglamento de Evaluación, protocolos y demás instructivos internos.</li><li>Denunciar inmediatamente a la Dirección del Colegio cualquier situación que implique eventual vulneración de derechos de estudiantes.</li></ol></Clause>
              <Clause title="SÉPTIMO">Sin perjuicio de lo establecido en la cláusula precedente, son obligaciones esenciales del docente de aula llevar control de asistencia de los alumnos, mantener actualizados los registros pedagógicos, asistir a reuniones determinadas por Dirección, cumplir con las disposiciones del reglamento de evaluación, participar en actividades técnico-pedagógicas y desarrollar sus funciones conforme al Proyecto Educativo Institucional.</Clause>
              <Clause title="OCTAVO">Las partes convienen en elevar a la calidad de esencial de este contrato la obligación del trabajador de guardar secreto total respecto a las informaciones de que tome conocimiento en relación al proyecto educativo, su ejecución y cualquier otro antecedente cuya divulgación signifique o pueda significar perjuicio para el Colegio o su sostenedora educacional.</Clause>
              <Clause title="NOVENO">El Docente se obliga a realizar todas las labores propias e inherentes del cargo para que se le contrata, así como las funciones que están contenidas en la descripción de cargo y en el Reglamento Interno de Orden, Higiene y Seguridad del Colegio.</Clause>
              <Clause title="DÉCIMO">El trabajador se obliga a respetar el Reglamento Interno de Orden, Higiene y Seguridad, el Reglamento Interno del Colegio, sus protocolos y el respeto a todos los miembros de la comunidad escolar.</Clause>
              <Clause title="DÉCIMO PRIMERO">El Docente hará uso de su feriado anual de acuerdo a las normas establecidas en la Ley N° 19.070. Con todo, deberá participar de las actividades de capacitación y preparación del año escolar a que el empleador le cite en jornada laboral.</Clause>
              <Clause title="DÉCIMO SEGUNDO">En caso de renuncia voluntaria, se debe dar el aviso correspondiente con a lo menos 30 días de anticipación como mínimo y deberá presentar esta renuncia por escrito y firmarla ante Notario o en la Inspección del Trabajo.</Clause>
              <Clause title="DÉCIMO TERCERO">El presente contrato comenzará a regir el <strong>{form.fechaInicio}</strong> y tendrá una duración hasta el día <strong>{form.fechaTermino}</strong>, terminado ipso facto al vencimiento del tiempo estipulado en él.</Clause>
              <Clause title="DÉCIMO CUARTO">Para todos los efectos de comunicaciones y notificaciones, las partes establecen los siguientes correos electrónicos, obligándose a dar aviso en caso de que los cambien o presenten problemas.<br /><br />Correo electrónico empleador: <strong>{form.correoEmpleador}</strong><br />Correo electrónico personal del trabajador: <strong>{form.correo || '____________________________'}</strong></Clause>
              <Clause title="DÉCIMO QUINTO">Para todos los efectos derivados del presente contrato las partes fijan su domicilio en la ciudad de Quillota y se someten a la jurisdicción de sus tribunales.</Clause>
              <Clause title="DÉCIMO SEXTO">El presente contrato se extiende en dos ejemplares, quedando uno en poder del empleador y uno en poder del trabajador, quien declara recibirlo en este acto, en conjunto con una copia del reglamento interno.</Clause>

              <div className="mt-24 grid grid-cols-2 gap-12 text-center"><div><div className="mb-3 border-t border-black pt-3" /><p className="font-bold">EMPLEADOR</p><p>{form.fundacion}</p><p>RUT N° {form.rutFundacion}</p></div><div><div className="mb-3 border-t border-black pt-3" /><p className="font-bold">{form.nombre || 'TRABAJADOR(A)'}</p><p>{form.rut || 'RUT'}</p><p>TRABAJADOR(A)</p></div></div>
            </article>
          </section>
        )}
      </section>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .contract-document, .contract-document * { visibility: visible; }
          .contract-document { position: absolute; left: 0; top: 0; width: 100%; padding: 2cm !important; font-size: 12pt; line-height: 1.55; }
          @page { size: 8.5in 13in; margin: 1.5cm; }
        }
      `}</style>
    </main>
  );
}

function Panel({ title, icon, children }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">{icon}</div><h2 className="text-lg font-black">{title}</h2></div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function ScheduleEditor({ kind, schedule, totalHoras, onUpdate, onClearDay, onCopyMonday }) {
  return (
    <>
      <div className="rounded-2xl bg-blue-50 p-4 text-sm font-medium leading-relaxed text-blue-900">Ingresa la jornada de mañana y tarde para cada día. El sistema calculará automáticamente el total diario y semanal. La colación entre bloques no se suma como hora efectiva de trabajo.</div>
      <div className="rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Total semanal calculado</p><p className="mt-1 text-2xl font-black">{formatHours(totalHoras)} horas</p></div>
      <button type="button" onClick={() => onCopyMonday(kind)} className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Copiar horario del lunes a martes-viernes</button>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[95px_1fr_1fr_75px] bg-slate-100 text-[11px] font-black uppercase tracking-wide text-slate-600"><div className="border-r border-slate-200 px-3 py-3">Día</div><div className="border-r border-slate-200 px-3 py-3 text-center">Jornada mañana<div className="mt-1 text-[10px] font-semibold normal-case tracking-normal text-slate-400">Entrada / Salida</div></div><div className="border-r border-slate-200 px-3 py-3 text-center">Jornada tarde<div className="mt-1 text-[10px] font-semibold normal-case tracking-normal text-slate-400">Entrada / Salida</div></div><div className="px-3 py-3 text-center">Total</div></div>
        {schedule.map((dayItem) => {
          const dayHours = calculateDayHours(dayItem);
          return (
            <div key={dayItem.day} className="grid grid-cols-[95px_1fr_1fr_75px] border-t border-slate-200">
              <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black text-slate-800">{dayItem.day}</div>
              <div className="border-r border-slate-200 p-2"><div className="grid grid-cols-1 gap-2"><TimeInput value={dayItem.morningStart} placeholder="08:00" onChange={(value) => onUpdate(kind, dayItem.day, 'morningStart', value)} /><TimeInput value={dayItem.morningEnd} placeholder="13:00" onChange={(value) => onUpdate(kind, dayItem.day, 'morningEnd', value)} /></div></div>
              <div className="border-r border-slate-200 p-2"><div className="grid grid-cols-1 gap-2"><TimeInput value={dayItem.afternoonStart} placeholder="14:00" onChange={(value) => onUpdate(kind, dayItem.day, 'afternoonStart', value)} /><TimeInput value={dayItem.afternoonEnd} placeholder="19:00" onChange={(value) => onUpdate(kind, dayItem.day, 'afternoonEnd', value)} /></div></div>
              <div className="flex flex-col items-center justify-center gap-2 px-2 py-3"><span className="text-sm font-black text-slate-900">{formatHours(dayHours)}</span><button type="button" onClick={() => onClearDay(kind, dayItem.day)} className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 transition hover:bg-red-100">Limpiar</button></div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function TimeInput({ value, placeholder, onChange }) {
  return <input type="text" inputMode="numeric" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-black text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />;
}

function SchedulePreview({ schedule }) {
  const totalWeeklyHours = calculateScheduleHours(schedule);
  return (
    <table className="mt-2 w-full border-collapse text-sm">
      <thead><tr><th className="border border-black px-2 py-2 text-left">DÍA</th><th className="border border-black px-2 py-2 text-left">JORNADA MAÑANA</th><th className="border border-black px-2 py-2 text-left">JORNADA TARDE</th><th className="border border-black px-2 py-2 text-left">TOTAL HORAS EFECTIVAS</th></tr></thead>
      <tbody>
        {schedule.map((dayItem) => {
          const dayHours = calculateDayHours(dayItem);
          return <tr key={dayItem.day}><td className="border border-black px-2 py-2 font-semibold">{dayItem.day}</td><td className="border border-black px-2 py-2">{formatScheduleText(dayItem.morningStart, dayItem.morningEnd) || '—'}</td><td className="border border-black px-2 py-2">{formatScheduleText(dayItem.afternoonStart, dayItem.afternoonEnd) || '—'}</td><td className="border border-black px-2 py-2">{dayHours > 0 ? `${formatHours(dayHours)} horas` : '—'}</td></tr>;
        })}
        <tr><td colSpan="3" className="border border-black px-2 py-2 text-right font-bold">TOTAL HORAS SEMANALES EFECTIVAS</td><td className="border border-black px-2 py-2 font-bold">{formatHours(totalWeeklyHours)} horas</td></tr>
      </tbody>
    </table>
  );
}

function FundingSummaryPreview({ form, totalHorasGeneral, totalHorasSep, totalHorasHorario }) {
  const tipo = form.tipoFinanciamiento || 'general';
  return (
    <table className="mt-2 w-full border-collapse text-sm">
      <thead><tr><th className="border border-black px-2 py-2 text-left">FINANCIAMIENTO</th><th className="border border-black px-2 py-2 text-left">HORAS</th><th className="border border-black px-2 py-2 text-left">SUELDO BASE</th></tr></thead>
      <tbody>
        {usesGeneral(tipo) && <tr><td className="border border-black px-2 py-2">General</td><td className="border border-black px-2 py-2">{form.horasGeneral || formatHours(totalHorasGeneral)}</td><td className="border border-black px-2 py-2">{formatCurrency(form.sueldoBaseGeneral)}</td></tr>}
        {usesSep(tipo) && <tr><td className="border border-black px-2 py-2">SEP</td><td className="border border-black px-2 py-2">{form.horasSep || formatHours(totalHorasSep)}</td><td className="border border-black px-2 py-2">{formatCurrency(form.sueldoBaseSep)}</td></tr>}
        <tr><td className="border border-black px-2 py-2 font-bold">Total</td><td className="border border-black px-2 py-2 font-bold">{form.jornadaHoras || formatHours(totalHorasHorario)}</td><td className="border border-black px-2 py-2 font-bold">{formatCurrency(Number(form.sueldoBaseGeneral || 0) + Number(form.sueldoBaseSep || 0))}</td></tr>
      </tbody>
    </table>
  );
}

function RemunerationPreview({ form, extraItems, showGeneral, showSep, totalRemuneracion }) {
  return (
    <table className="mt-2 w-full border-collapse text-sm">
      <tbody>
        {showGeneral && <tr><td className="border border-black px-2 py-2">Sueldo Base General</td><td className="border border-black px-2 py-2 font-bold">{formatCurrency(form.sueldoBaseGeneral)}</td></tr>}
        {showSep && <tr><td className="border border-black px-2 py-2">Sueldo Base SEP</td><td className="border border-black px-2 py-2 font-bold">{formatCurrency(form.sueldoBaseSep)}</td></tr>}
        <tr><td className="border border-black px-2 py-2">Ley 19.410 + 19.933</td><td className="border border-black px-2 py-2 font-bold">{formatCurrency(form.leyes)}</td></tr>
        {extraItems.filter((item) => String(item.nombre || '').trim() || Number(item.monto || 0) > 0).map((item, index) => <tr key={index}><td className="border border-black px-2 py-2">{item.nombre || 'Ítem adicional'}{item.observacion ? <div className="text-xs text-slate-500">{item.observacion}</div> : null}</td><td className="border border-black px-2 py-2 font-bold">{formatCurrency(item.monto)}</td></tr>)}
        <tr><td className="border border-black px-2 py-2 font-bold">Total remuneración bruta mensual</td><td className="border border-black px-2 py-2 font-bold">{formatCurrency(totalRemuneracion)}</td></tr>
      </tbody>
    </table>
  );
}

function Clause({ title, children }) {
  return <div className="mt-6 text-justify"><strong>{title}:</strong> {children}</div>;
}
