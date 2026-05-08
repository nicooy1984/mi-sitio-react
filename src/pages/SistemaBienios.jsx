import React, { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Calculator,
  FileText,
  Printer,
  Users,
  CalendarDays,
  Download,
  Copy,
  CheckCircle2,
  BriefcaseBusiness,
  FileDown,
} from 'lucide-react';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  HeadingLevel,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FECHA_CORTE = '2026-04-01';
const FECHA_CORTE_VISIBLE = '01-04-2026';
const DIAS_POR_MES_ADMINISTRATIVO = 30;

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateToChile(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function diasDelMes(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function limitarFechaTermino(fechaTermino) {
  if (!fechaTermino) return FECHA_CORTE;

  const termino = parseLocalDate(fechaTermino);
  const corte = parseLocalDate(FECHA_CORTE);

  if (!termino || termino > corte) return FECHA_CORTE;

  return fechaTermino;
}

function calcularDiferenciaAniosMesesDias(fechaInicio, fechaTermino) {
  const inicio = parseLocalDate(fechaInicio);
  const termino = parseLocalDate(fechaTermino);

  if (!inicio || !termino) return null;
  if (inicio > termino) return null;

  let anios = termino.getFullYear() - inicio.getFullYear();
  let meses = termino.getMonth() - inicio.getMonth();
  let dias = termino.getDate() - inicio.getDate();

  if (dias < 0) {
    meses -= 1;

    const mesAnterior = termino.getMonth() - 1;
    const yearMesAnterior = mesAnterior < 0 ? termino.getFullYear() - 1 : termino.getFullYear();
    const monthIndexAjustado = mesAnterior < 0 ? 11 : mesAnterior;

    dias += diasDelMes(yearMesAnterior, monthIndexAjustado);
  }

  if (meses < 0) {
    anios -= 1;
    meses += 12;
  }

  return {
    anios: Math.max(anios, 0),
    meses: Math.max(meses, 0),
    dias: Math.max(dias, 0),
  };
}

function calcularPeriodoDetallado(periodo) {
  if (!periodo.fechaInicio) return null;

  const fechaTerminoUsada = limitarFechaTermino(periodo.fechaTermino || FECHA_CORTE);
  const diferencia = calcularDiferenciaAniosMesesDias(periodo.fechaInicio, fechaTerminoUsada);

  if (!diferencia) return null;

  const mesesBase = diferencia.anios * 12 + diferencia.meses;

  return {
    ...diferencia,
    mesesBase,
    fechaTerminoUsada,
  };
}

function calcularMesesPeriodo(periodo) {
  const detalle = calcularPeriodoDetallado(periodo);
  return detalle ? detalle.mesesBase : null;
}

function calcularBieniosDesdePeriodos(periodos) {
  const periodosCalculados = periodos.map((periodo) => {
    const detalle = calcularPeriodoDetallado(periodo);

    return {
      ...periodo,
      fechaTerminoUsada: detalle?.fechaTerminoUsada || '',
      aniosPeriodo: detalle?.anios || 0,
      mesesPeriodo: detalle?.meses || 0,
      diasPeriodo: detalle?.dias || 0,
      meses: detalle?.mesesBase ?? null,
      valido: detalle !== null,
    };
  });

  const mesesBaseTotales = periodosCalculados.reduce((acc, periodo) => {
    return acc + (periodo.valido ? periodo.meses : 0);
  }, 0);

  const diasAcumulados = periodosCalculados.reduce((acc, periodo) => {
    return acc + (periodo.valido ? periodo.diasPeriodo : 0);
  }, 0);

  const mesesConvertidosDesdeDias = Math.floor(diasAcumulados / DIAS_POR_MES_ADMINISTRATIVO);
  const diasRemanentes = diasAcumulados % DIAS_POR_MES_ADMINISTRATIVO;
  const mesesTotales = mesesBaseTotales + mesesConvertidosDesdeDias;

  const bienios = Math.floor(mesesTotales / 24);
  const mesesSobreBienios = mesesTotales - bienios * 24;
  const anios = Math.floor(mesesTotales / 12);
  const meses = mesesTotales % 12;

  return {
    valido: periodosCalculados.some((periodo) => periodo.valido),
    periodosCalculados,
    mesesBaseTotales,
    diasAcumulados,
    mesesConvertidosDesdeDias,
    diasRemanentes,
    mesesTotales,
    anios,
    meses,
    bienios,
    mesesSobreBienios,
  };
}

function textoTiempoPeriodo(periodo) {
  if (!periodo?.valido) return '-';
  return `${periodo.aniosPeriodo} años, ${periodo.mesesPeriodo} meses y ${periodo.diasPeriodo} días`;
}

let contadorIds = 1;

function generarId(prefijo = 'id') {
  contadorIds += 1;
  return `${prefijo}-${Date.now()}-${contadorIds}`;
}

function crearPeriodoInicial() {
  return {
    id: generarId('periodo'),
    lugar: '',
    fechaInicio: '',
    fechaTermino: '',
    observacion: '',
  };
}

function crearDocenteInicial() {
  return {
    id: generarId('docente'),
    nombre: '',
    rut: '',
    periodos: [crearPeriodoInicial()],
  };
}

export default function SistemaBienios() {
  const [docentes, setDocentes] = useState([
    {
      id: generarId('docente'),
      nombre: 'Gabriela Tejos',
      rut: '',
      periodos: [
        {
          id: generarId('periodo'),
          lugar: 'Colegio Italiano San Pedro',
          fechaInicio: '2007-03-01',
          fechaTermino: '',
          observacion:
            'Contrato vigente. Si no se indica término, se calcula hasta la fecha de corte.',
        },
      ],
    },
  ]);

  const [copiado, setCopiado] = useState(false);

  const resultados = useMemo(() => {
    return docentes.map((docente) => ({
      ...docente,
      calculo: calcularBieniosDesdePeriodos(docente.periodos),
    }));
  }, [docentes]);

  const resumen = useMemo(() => {
    const validos = resultados.filter((item) => item.calculo.valido);

    const totalBienios = validos.reduce((acc, item) => {
      return acc + item.calculo.bienios;
    }, 0);

    return {
      totalDocentes: docentes.length,
      totalValidos: validos.length,
      totalBienios,
    };
  }, [docentes.length, resultados]);

  function agregarDocente() {
    setDocentes((prev) => [...prev, crearDocenteInicial()]);
  }

  function actualizarDocente(id, campo, valor) {
    setDocentes((prev) =>
      prev.map((docente) =>
        docente.id === id ? { ...docente, [campo]: valor } : docente
      )
    );
  }

  function eliminarDocente(id) {
    setDocentes((prev) => prev.filter((docente) => docente.id !== id));
  }

  function agregarPeriodo(docenteId) {
    setDocentes((prev) =>
      prev.map((docente) =>
        docente.id === docenteId
          ? {
              ...docente,
              periodos: [...docente.periodos, crearPeriodoInicial()],
            }
          : docente
      )
    );
  }

  function actualizarPeriodo(docenteId, periodoId, campo, valor) {
    setDocentes((prev) =>
      prev.map((docente) => {
        if (docente.id !== docenteId) return docente;

        return {
          ...docente,
          periodos: docente.periodos.map((periodo) =>
            periodo.id === periodoId
              ? { ...periodo, [campo]: valor }
              : periodo
          ),
        };
      })
    );
  }

  function eliminarPeriodo(docenteId, periodoId) {
    setDocentes((prev) =>
      prev.map((docente) => {
        if (docente.id !== docenteId) return docente;
        if (docente.periodos.length === 1) return docente;

        return {
          ...docente,
          periodos: docente.periodos.filter(
            (periodo) => periodo.id !== periodoId
          ),
        };
      })
    );
  }

  function limpiarSistema() {
    setDocentes([crearDocenteInicial()]);
  }

  function crearTextoInforme() {
    const lineas = [];

    lineas.push('INFORME DE CÁLCULO DE BIENIOS - CARRERA DOCENTE');
    lineas.push(`Fecha de corte utilizada: ${FECHA_CORTE_VISIBLE}`);
    lineas.push('');
    lineas.push('Parámetros utilizados:');
    lineas.push(`1. N° de bienios cumplidos al ${FECHA_CORTE_VISIBLE}.`);
    lineas.push(
      `2. N° de meses por sobre los bienios cumplidos al ${FECHA_CORTE_VISIBLE}.`
    );
    lineas.push('3. Días remanentes no convertidos, cuando existan.');
    lineas.push('');
    lineas.push('Criterio aplicado para experiencias discontinuas:');
    lineas.push('Se suman únicamente los períodos efectivamente trabajados y reconocidos.');
    lineas.push('Los espacios sin contrato o sin reconocimiento docente no se suman al total.');
    lineas.push('Los días sobrantes de cada período se acumulan y cada 30 días se convierten en 1 mes adicional.');
    lineas.push('Si un período no tiene fecha de término, se entiende vigente y se calcula hasta la fecha de corte.');
    lineas.push('');
    lineas.push('Fórmula aplicada:');
    lineas.push('Meses totales reconocidos = meses base acumulados + meses convertidos desde días acumulados.');
    lineas.push('Bienios cumplidos = meses totales reconocidos / 24, considerando solo bienios completos.');
    lineas.push('Meses por sobre bienios = meses totales reconocidos - (bienios cumplidos x 24).');
    lineas.push('');
    lineas.push('Detalle por docente:');

    resultados.forEach((item, index) => {
      if (!item.calculo.valido) return;

      lineas.push('');
      lineas.push(`${index + 1}. ${item.nombre || 'Sin nombre registrado'}`);

      if (item.rut) {
        lineas.push(`RUT: ${item.rut}`);
      }

      lineas.push('Períodos reconocidos:');

      item.calculo.periodosCalculados.forEach((periodo, periodoIndex) => {
        if (!periodo.valido) return;

        lineas.push(
          `   ${periodoIndex + 1}) ${periodo.lugar || 'Sin establecimiento'}: ${formatDateToChile(
            periodo.fechaInicio
          )} al ${formatDateToChile(periodo.fechaTerminoUsada)} = ${periodo.aniosPeriodo} años, ${periodo.mesesPeriodo} meses y ${periodo.diasPeriodo} días. Meses base: ${periodo.meses}.`
        );

        if (periodo.observacion) {
          lineas.push(`      Observación: ${periodo.observacion}`);
        }
      });

      lineas.push(`Meses base acumulados: ${item.calculo.mesesBaseTotales} meses.`);
      lineas.push(`Días acumulados entre períodos: ${item.calculo.diasAcumulados} días.`);
      lineas.push(`Meses convertidos desde días acumulados: ${item.calculo.mesesConvertidosDesdeDias} meses.`);
      lineas.push(`Días remanentes no convertidos: ${item.calculo.diasRemanentes} días.`);
      lineas.push(
        `Tiempo total reconocido al ${FECHA_CORTE_VISIBLE}: ${item.calculo.anios} años y ${item.calculo.meses} meses.`
      );
      lineas.push(`Meses totales reconocidos: ${item.calculo.mesesTotales} meses.`);
      lineas.push(`N° de bienios cumplidos al ${FECHA_CORTE_VISIBLE}: ${item.calculo.bienios}.`);
      lineas.push(
        `N° de meses por sobre los bienios cumplidos al ${FECHA_CORTE_VISIBLE}: ${item.calculo.mesesSobreBienios}.`
      );
    });

    return lineas.join('\n');
  }

  function cell(text, options = {}) {
    return new TableCell({
      width: {
        size: options.width || 20,
        type: WidthType.PERCENTAGE,
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: String(text ?? ''),
              bold: options.bold || false,
              size: options.size || 20,
            }),
          ],
        }),
      ],
    });
  }

  function crearTablaResumenWord() {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            cell('Docente', { bold: true, width: 22 }),
            cell('Meses base', { bold: true, width: 13 }),
            cell('Días acumulados', { bold: true, width: 13 }),
            cell('Meses convertidos', { bold: true, width: 13 }),
            cell('Meses totales', { bold: true, width: 13 }),
            cell('Bienios', { bold: true, width: 13 }),
            cell('Meses sobre bienios', { bold: true, width: 13 }),
          ],
        }),
        ...resultados.map(
          (item) =>
            new TableRow({
              children: [
                cell(item.nombre || 'Sin nombre', { width: 22 }),
                cell(item.calculo.valido ? item.calculo.mesesBaseTotales : '-', { width: 13 }),
                cell(item.calculo.valido ? item.calculo.diasAcumulados : '-', { width: 13 }),
                cell(item.calculo.valido ? item.calculo.mesesConvertidosDesdeDias : '-', { width: 13 }),
                cell(item.calculo.valido ? item.calculo.mesesTotales : '-', { width: 13 }),
                cell(item.calculo.valido ? item.calculo.bienios : '-', { width: 13 }),
                cell(item.calculo.valido ? item.calculo.mesesSobreBienios : '-', { width: 13 }),
              ],
            })
        ),
      ],
    });
  }

  function crearTablaPeriodosWord(item) {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            cell('Lugar / establecimiento', { bold: true, width: 28 }),
            cell('Desde', { bold: true, width: 14 }),
            cell('Hasta', { bold: true, width: 14 }),
            cell('Tiempo reconocido', { bold: true, width: 24 }),
            cell('Meses base', { bold: true, width: 10 }),
            cell('Observación', { bold: true, width: 10 }),
          ],
        }),
        ...item.calculo.periodosCalculados.map(
          (periodo) =>
            new TableRow({
              children: [
                cell(periodo.lugar || 'Sin establecimiento', { width: 28 }),
                cell(
                  periodo.fechaInicio ? formatDateToChile(periodo.fechaInicio) : '-',
                  { width: 14 }
                ),
                cell(
                  periodo.valido ? formatDateToChile(periodo.fechaTerminoUsada) : '-',
                  { width: 14 }
                ),
                cell(periodo.valido ? textoTiempoPeriodo(periodo) : '-', { width: 24 }),
                cell(periodo.valido ? periodo.meses : '-', { width: 10 }),
                cell(periodo.observacion || '', { width: 10 }),
              ],
            })
        ),
      ],
    });
  }


  function crearFichaDocenteWord(item) {
    const periodosValidos = item.calculo.periodosCalculados.filter((periodo) => periodo.valido).length;

    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            cell('Nombre del docente', { bold: true, width: 30 }),
            cell(item.nombre || 'Sin nombre registrado', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('RUT', { bold: true, width: 30 }),
            cell(item.rut || 'No informado', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Fecha de corte utilizada', { bold: true, width: 30 }),
            cell(FECHA_CORTE_VISIBLE, { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Períodos válidos reconocidos', { bold: true, width: 30 }),
            cell(item.calculo.valido ? periodosValidos : 'No calculable', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Tiempo total reconocido', { bold: true, width: 30 }),
            cell(item.calculo.valido ? `${item.calculo.anios} años y ${item.calculo.meses} meses` : 'No calculable', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Meses base acumulados', { bold: true, width: 30 }),
            cell(item.calculo.valido ? `${item.calculo.mesesBaseTotales} meses` : '-', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Días acumulados', { bold: true, width: 30 }),
            cell(item.calculo.valido ? `${item.calculo.diasAcumulados} días` : '-', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Meses convertidos desde días', { bold: true, width: 30 }),
            cell(item.calculo.valido ? `${item.calculo.mesesConvertidosDesdeDias} meses` : '-', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Meses totales reconocidos', { bold: true, width: 30 }),
            cell(item.calculo.valido ? `${item.calculo.mesesTotales} meses` : '-', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell(`N° de bienios cumplidos al ${FECHA_CORTE_VISIBLE}`, { bold: true, width: 30 }),
            cell(item.calculo.valido ? item.calculo.bienios : '-', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell(`N° de meses por sobre los bienios cumplidos al ${FECHA_CORTE_VISIBLE}`, { bold: true, width: 30 }),
            cell(item.calculo.valido ? item.calculo.mesesSobreBienios : '-', { width: 70 }),
          ],
        }),
        new TableRow({
          children: [
            cell('Días remanentes no convertidos', { bold: true, width: 30 }),
            cell(item.calculo.valido ? `${item.calculo.diasRemanentes} días` : '-', { width: 70 }),
          ],
        }),
      ],
    });
  }

  async function descargarWord() {
    const children = [
      new Paragraph({
        text: 'Informe de cálculo de bienios - Carrera Docente',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Fecha de corte utilizada: ${FECHA_CORTE_VISIBLE}`,
            bold: true,
          }),
        ],
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '1. Parámetros utilizados',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph(`• N° de bienios cumplidos al ${FECHA_CORTE_VISIBLE}.`),
      new Paragraph(
        `• N° de meses por sobre los bienios cumplidos al ${FECHA_CORTE_VISIBLE}.`
      ),
      new Paragraph('• Días remanentes no convertidos, cuando existan.'),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '2. Criterio aplicado para experiencias discontinuas',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph(
        'Cuando un docente presenta más de un período de trabajo, se suman únicamente los períodos efectivamente reconocidos. Los espacios sin contrato, sin servicio o sin reconocimiento docente no se consideran dentro del total.'
      ),
      new Paragraph(
        'Los días sobrantes de cada período se acumulan y cada 30 días se convierten en 1 mes adicional. Los días que no alcanzan a formar un mes quedan informados como remanente.'
      ),
      new Paragraph(
        'Si un período no tiene fecha de término, el sistema lo considera vigente y calcula hasta la fecha de corte.'
      ),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '3. Fórmula aplicada',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph(
        'Meses totales reconocidos = meses base acumulados + meses convertidos desde días acumulados.'
      ),
      new Paragraph(
        'Bienios cumplidos = meses totales reconocidos acumulados ÷ 24, considerando solo la parte entera.'
      ),
      new Paragraph(
        'Meses por sobre bienios = meses totales reconocidos acumulados − (bienios cumplidos × 24).'
      ),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '4. Resultado general',
        heading: HeadingLevel.HEADING_1,
      }),
      crearTablaResumenWord(),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '5. Detalle por docente',
        heading: HeadingLevel.HEADING_1,
      }),
    ];

    resultados.forEach((item, index) => {
      children.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `${index + 1}. ${item.nombre || 'Sin nombre registrado'}`,
          heading: HeadingLevel.HEADING_2,
        })
      );

      if (item.rut) {
        children.push(new Paragraph(`RUT: ${item.rut}`));
      }

      if (!item.calculo.valido) {
        children.push(
          new Paragraph(
            'No es posible calcular este registro porque no existe al menos un período válido.'
          )
        );
        return;
      }

      children.push(
        new Paragraph({
          text: 'Ficha de identificación y resultado individual',
          heading: HeadingLevel.HEADING_3,
        }),
        crearFichaDocenteWord(item),
        new Paragraph({ text: '' }),
        new Paragraph('Períodos reconocidos:'),
        crearTablaPeriodosWord(item),
        new Paragraph({ text: '' }),
        new Paragraph(`Meses base acumulados: ${item.calculo.mesesBaseTotales} meses.`),
        new Paragraph(`Días acumulados entre períodos: ${item.calculo.diasAcumulados} días.`),
        new Paragraph(`Meses convertidos desde días acumulados: ${item.calculo.mesesConvertidosDesdeDias} meses.`),
        new Paragraph(`Días remanentes no convertidos: ${item.calculo.diasRemanentes} días.`),
        new Paragraph(
          `Tiempo total reconocido al ${FECHA_CORTE_VISIBLE}: ${item.calculo.anios} años y ${item.calculo.meses} meses.`
        ),
        new Paragraph(`Meses totales reconocidos: ${item.calculo.mesesTotales} meses.`),
        new Paragraph({
          children: [
            new TextRun({
              text: `N° de bienios cumplidos al ${FECHA_CORTE_VISIBLE}: ${item.calculo.bienios}.`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `N° de meses por sobre los bienios cumplidos al ${FECHA_CORTE_VISIBLE}: ${item.calculo.mesesSobreBienios}.`,
              bold: true,
            }),
          ],
        }),
        new Paragraph(
          `Desarrollo: ${item.calculo.mesesBaseTotales} meses base + ${item.calculo.mesesConvertidosDesdeDias} meses convertidos desde días = ${item.calculo.mesesTotales} meses totales. Luego, ${item.calculo.mesesTotales} ÷ 24 = ${item.calculo.bienios} bienios completos, quedando ${item.calculo.mesesSobreBienios} meses por sobre los bienios cumplidos y ${item.calculo.diasRemanentes} días remanentes.`
        )
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'informe-bienios-carrera-docente.docx');
  }

  async function descargarPdf() {
    const elemento = document.querySelector('.print-area');

    if (!elemento) {
      alert('No se encontró el informe para generar el PDF.');
      return;
    }

    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;

    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight + margin;
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save('informe-bienios-carrera-docente.pdf');
  }

  async function copiarInforme() {
    const texto = crearTextoInforme();
    await navigator.clipboard.writeText(texto);

    setCopiado(true);

    setTimeout(() => {
      setCopiado(false);
    }, 1800);
  }

  function imprimirInforme() {
    window.print();
  }

  function descargarTxt() {
    const texto = crearTextoInforme();
    const blob = new Blob([texto], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'informe-bienios-carrera-docente.txt';
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8 text-white shadow-2xl print:hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Calculator className="h-4 w-4" />
                Sistema de cálculo por períodos reconocidos
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Bienios de Carrera Docente
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-50">
                Ingresa uno o varios períodos de experiencia por docente. El sistema suma meses y días reconocidos, convierte cada 30 días acumulados en 1 mes adicional y calcula los bienios al <strong>{FECHA_CORTE_VISIBLE}</strong>.
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
                <span className="text-sm text-blue-100">Fecha de corte</span>
                <strong className="text-xl">{FECHA_CORTE_VISIBLE}</strong>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
                <span className="text-sm text-blue-100">Personal ingresado</span>
                <strong className="text-xl">{resumen.totalDocentes}</strong>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
                <span className="text-sm text-blue-100">Bienios acumulados</span>
                <strong className="text-xl">{resumen.totalBienios}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(520px,0.9fr)_minmax(760px,1.1fr)] print:block">
          <div className="min-w-0 rounded-[2rem] bg-white p-6 lg:p-7 shadow-xl ring-1 ring-slate-200 print:hidden">
            <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                  <Users className="h-5 w-5 text-blue-700" />
                  Ingreso de datos
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Cada docente puede tener varios períodos reconocidos. Los días sobrantes se acumulan al final.
                </p>
              </div>

              <button
                type="button"
                onClick={agregarDocente}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                <Plus className="h-4 w-4" />
                Agregar docente
              </button>
            </div>

            <div className="space-y-5">
              {docentes.map((docente, index) => (
                <div
                  key={docente.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                      Docente {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => eliminarDocente(docente.id)}
                      disabled={docentes.length === 1}
                      className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar docente
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1.5fr_0.8fr]">
                    <div>
                      <label className="block text-sm font-bold text-slate-700">Nombre del docente</label>
                      <input
                        type="text"
                        value={docente.nombre}
                        onChange={(event) => actualizarDocente(docente.id, 'nombre', event.target.value)}
                        placeholder="Ej: Gabriela Tejos"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700">RUT opcional</label>
                      <input
                        type="text"
                        value={docente.rut}
                        onChange={(event) => actualizarDocente(docente.id, 'rut', event.target.value)}
                        placeholder="Ej: 12.345.678-9"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-700">
                        <BriefcaseBusiness className="h-4 w-4 text-blue-700" />
                        Períodos de experiencia reconocida
                      </h3>

                      <button
                        type="button"
                        onClick={() => agregarPeriodo(docente.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar período
                      </button>
                    </div>

                    <div className="space-y-4">
                      {docente.periodos.map((periodo, periodoIndex) => {
                        const detallePeriodo = calcularPeriodoDetallado(periodo);

                        return (
                          <div key={periodo.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                                Período {periodoIndex + 1}
                              </span>

                              <button
                                type="button"
                                onClick={() => eliminarPeriodo(docente.id, periodo.id)}
                                disabled={docente.periodos.length === 1}
                                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 className="h-4 w-4" />
                                Quitar
                              </button>
                            </div>

                            <label className="block text-sm font-bold text-slate-700">Establecimiento / lugar</label>
                            <input
                              type="text"
                              value={periodo.lugar}
                              onChange={(event) => actualizarPeriodo(docente.id, periodo.id, 'lugar', event.target.value)}
                              placeholder="Ej: Escuela X, Colegio Y, Corporación Z"
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <div>
                                <label className="block text-sm font-bold text-slate-700">Desde</label>
                                <input
                                  type="date"
                                  value={periodo.fechaInicio}
                                  onChange={(event) => actualizarPeriodo(docente.id, periodo.id, 'fechaInicio', event.target.value)}
                                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-slate-700">Hasta</label>
                                <input
                                  type="date"
                                  value={periodo.fechaTermino}
                                  onChange={(event) => actualizarPeriodo(docente.id, periodo.id, 'fechaTermino', event.target.value)}
                                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                                <p className="mt-1 text-xs text-slate-500">
                                  Déjalo vacío si el contrato sigue vigente hasta {FECHA_CORTE_VISIBLE}.
                                </p>
                              </div>
                            </div>

                            <label className="mt-4 block text-sm font-bold text-slate-700">Observación opcional</label>
                            <textarea
                              value={periodo.observacion}
                              onChange={(event) => actualizarPeriodo(docente.id, periodo.id, 'observacion', event.target.value)}
                              placeholder="Ej: Reconocimiento por certificado, contrato antiguo, antecedente interno, etc."
                              rows={2}
                              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            <div className="mt-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">
                              {detallePeriodo
                                ? `Tiempo reconocido en este período: ${detallePeriodo.anios} años, ${detallePeriodo.meses} meses y ${detallePeriodo.dias} días. Meses base: ${calcularMesesPeriodo(periodo)}`
                                : 'Período no calculable'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={limpiarSistema}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Limpiar datos
              </button>
            </div>
          </div>

          <div className="min-w-0 rounded-[2rem] bg-white p-6 lg:p-7 shadow-xl ring-1 ring-slate-200 print:shadow-none print:ring-0">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4 print:hidden">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                  <FileText className="h-5 w-5 text-blue-700" />
                  Informe generado
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  El informe suma períodos reconocidos, acumula días sobrantes y convierte cada 30 días en un mes adicional.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copiarInforme}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  {copiado ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiado ? 'Copiado' : 'Copiar'}
                </button>

                <button
                  type="button"
                  onClick={descargarWord}
                  className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-100"
                >
                  <FileText className="h-4 w-4" />
                  Word
                </button>

                <button
                  type="button"
                  onClick={descargarPdf}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 transition hover:bg-red-100"
                >
                  <FileDown className="h-4 w-4" />
                  PDF
                </button>

                <button
                  type="button"
                  onClick={descargarTxt}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <Download className="h-4 w-4" />
                  TXT
                </button>

                <button
                  type="button"
                  onClick={imprimirInforme}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir
                </button>
              </div>
            </div>

            <article className="print-area rounded-3xl border border-slate-200 bg-white p-6 print:border-0 print:p-0">
              <header className="border-b border-slate-200 pb-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">Informe de cálculo</p>

                <h1 className="mt-2 text-3xl font-black text-slate-950">Bienios de Carrera Docente</h1>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">Fecha de corte</p>
                    <p className="mt-1 text-lg font-black">{FECHA_CORTE_VISIBLE}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">Registros válidos</p>
                    <p className="mt-1 text-lg font-black">{resumen.totalValidos}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">Total bienios</p>
                    <p className="mt-1 text-lg font-black">{resumen.totalBienios}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">Criterio días</p>
                    <p className="mt-1 text-lg font-black">30 días = 1 mes</p>
                  </div>
                </div>
              </header>

              <section className="mt-6">
                <h2 className="text-lg font-black text-slate-900">Criterio para experiencias discontinuas</h2>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Cuando un docente presenta más de un período de trabajo, el sistema suma solamente los períodos efectivamente reconocidos. Los espacios sin contrato, sin servicio o sin reconocimiento docente no se consideran dentro del total. Los días sobrantes de cada período se acumulan y cada 30 días se convierten en 1 mes adicional.
                </p>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-black text-slate-900">Parámetros considerados</h2>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <li>
                    <strong>N° de bienios cumplidos al {FECHA_CORTE_VISIBLE}:</strong>{' '}
                    cantidad de períodos completos de 24 meses acumulados entre todos los períodos reconocidos.
                  </li>

                  <li>
                    <strong>N° de meses por sobre los bienios cumplidos al {FECHA_CORTE_VISIBLE}:</strong>{' '}
                    meses restantes después del último bienio completo, incorporando los meses convertidos desde días acumulados.
                  </li>

                  <li>
                    <strong>Días remanentes:</strong>{' '}
                    días acumulados que no alcanzan a completar un nuevo mes bajo el criterio de 30 días = 1 mes.
                  </li>
                </ul>
              </section>

              <section className="mt-6 rounded-3xl bg-slate-50 p-5">
                <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                  <CalendarDays className="h-5 w-5 text-blue-700" />
                  Fórmula aplicada
                </h2>

                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <p>
                    Primero se calcula cada período en años, meses y días. Luego se suman los meses base y se acumulan los días sobrantes. Cada 30 días acumulados se convierten en 1 mes adicional.
                  </p>

                  <p>
                    <strong>Meses totales reconocidos =</strong> meses base acumulados + meses convertidos desde días acumulados.
                  </p>

                  <p>
                    <strong>Bienios cumplidos =</strong> meses totales reconocidos, incluyendo meses convertidos desde días acumulados, ÷ 24, considerando solo la parte entera.
                  </p>

                  <p>
                    <strong>Meses por sobre bienios =</strong> meses totales reconocidos − bienios cumplidos × 24. Los días remanentes quedan informados aparte.
                  </p>
                </div>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-black text-slate-900">Resultado general</h2>

                <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="px-4 py-3">Docente</th>
                        <th className="px-4 py-3">Períodos válidos</th>
                        <th className="px-4 py-3">Tiempo total</th>
                        <th className="px-4 py-3">Meses base</th>
                        <th className="px-4 py-3">Días acumulados</th>
                        <th className="px-4 py-3">Meses convertidos</th>
                        <th className="px-4 py-3">Meses totales</th>
                        <th className="px-4 py-3">Bienios cumplidos</th>
                        <th className="px-4 py-3">Meses sobre bienios</th>
                        <th className="px-4 py-3">Días remanentes</th>
                      </tr>
                    </thead>

                    <tbody>
                      {resultados.map((item) => (
                        <tr key={item.id} className="border-t border-slate-200 align-top">
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {item.nombre || 'Sin nombre'}
                            {item.rut && <span className="block text-xs font-semibold text-slate-500">RUT: {item.rut}</span>}
                          </td>

                          <td className="px-4 py-3">
                            {item.calculo.periodosCalculados.filter((periodo) => periodo.valido).length}
                          </td>

                          <td className="px-4 py-3">
                            {item.calculo.valido ? `${item.calculo.anios} años y ${item.calculo.meses} meses` : 'No calculable'}
                          </td>

                          <td className="px-4 py-3">{item.calculo.valido ? item.calculo.mesesBaseTotales : '-'}</td>
                          <td className="px-4 py-3">{item.calculo.valido ? item.calculo.diasAcumulados : '-'}</td>
                          <td className="px-4 py-3">{item.calculo.valido ? item.calculo.mesesConvertidosDesdeDias : '-'}</td>
                          <td className="px-4 py-3">{item.calculo.valido ? item.calculo.mesesTotales : '-'}</td>

                          <td className="px-4 py-3 text-center text-lg font-black text-blue-800">
                            {item.calculo.valido ? item.calculo.bienios : '-'}
                          </td>

                          <td className="px-4 py-3 text-center text-lg font-black text-emerald-700">
                            {item.calculo.valido ? item.calculo.mesesSobreBienios : '-'}
                          </td>

                          <td className="px-4 py-3 text-center font-black text-slate-700">
                            {item.calculo.valido ? item.calculo.diasRemanentes : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mt-6 space-y-4">
                <h2 className="text-lg font-black text-slate-900">Detalle paso a paso</h2>

                {resultados.map((item, index) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-base font-black text-slate-950">
                      {index + 1}. {item.nombre || 'Sin nombre registrado'}
                    </h3>

                    {item.rut && <p className="mt-1 text-sm text-slate-500">RUT: {item.rut}</p>}

                    {!item.calculo.valido ? (
                      <p className="mt-3 text-sm text-red-600">
                        No es posible calcular este registro. Revisa que exista al menos un período válido.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-4 text-sm leading-6 text-slate-700">
                        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                            Ficha de identificación y resultado individual
                          </h4>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Docente</p>
                              <p className="mt-1 text-base font-black text-slate-950">{item.nombre || 'Sin nombre registrado'}</p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">RUT</p>
                              <p className="mt-1 text-base font-black text-slate-950">{item.rut || 'No informado'}</p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Fecha de corte</p>
                              <p className="mt-1 text-base font-black text-slate-950">{FECHA_CORTE_VISIBLE}</p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Períodos válidos</p>
                              <p className="mt-1 text-base font-black text-slate-950">
                                {item.calculo.periodosCalculados.filter((periodo) => periodo.valido).length}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Tiempo total</p>
                              <p className="mt-1 text-base font-black text-slate-950">{item.calculo.anios} años y {item.calculo.meses} meses</p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Meses totales</p>
                              <p className="mt-1 text-base font-black text-slate-950">{item.calculo.mesesTotales}</p>
                            </div>

                            <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                              <p className="text-[11px] font-black uppercase tracking-wide text-blue-700">Bienios cumplidos</p>
                              <p className="mt-1 text-xl font-black text-blue-900">{item.calculo.bienios}</p>
                            </div>

                            <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                              <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">Meses sobre bienios</p>
                              <p className="mt-1 text-xl font-black text-emerald-900">{item.calculo.mesesSobreBienios}</p>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Meses base</p>
                              <p className="mt-1 font-black text-slate-950">{item.calculo.mesesBaseTotales}</p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Días acumulados / convertidos</p>
                              <p className="mt-1 font-black text-slate-950">
                                {item.calculo.diasAcumulados} días / {item.calculo.mesesConvertidosDesdeDias} mes(es)
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Días remanentes</p>
                              <p className="mt-1 font-black text-slate-950">{item.calculo.diasRemanentes}</p>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-200">
                          <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                              <tr>
                                <th className="px-3 py-2">Lugar</th>
                                <th className="px-3 py-2">Desde</th>
                                <th className="px-3 py-2">Hasta</th>
                                <th className="px-3 py-2">Tiempo</th>
                                <th className="px-3 py-2">Meses base</th>
                              </tr>
                            </thead>

                            <tbody>
                              {item.calculo.periodosCalculados.map((periodo) => (
                                <tr key={periodo.id} className="border-t border-slate-200">
                                  <td className="px-3 py-2 font-semibold">{periodo.lugar || 'Sin establecimiento'}</td>
                                  <td className="px-3 py-2">{periodo.fechaInicio ? formatDateToChile(periodo.fechaInicio) : '-'}</td>
                                  <td className="px-3 py-2">{periodo.valido ? formatDateToChile(periodo.fechaTerminoUsada) : '-'}</td>
                                  <td className="px-3 py-2">{periodo.valido ? textoTiempoPeriodo(periodo) : '-'}</td>
                                  <td className="px-3 py-2 font-black">{periodo.valido ? periodo.meses : '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <p>
                          La suma de los períodos reconocidos corresponde a <strong>{item.calculo.mesesBaseTotales} meses base</strong>. Además, se acumulan <strong>{item.calculo.diasAcumulados} días</strong>, de los cuales se convierten <strong>{item.calculo.mesesConvertidosDesdeDias} meses adicionales</strong> usando el criterio de 30 días = 1 mes.
                        </p>

                        <p>
                          El total final reconocido corresponde a <strong>{item.calculo.mesesTotales} meses totales</strong>, equivalentes a <strong>{item.calculo.anios} años y {item.calculo.meses} meses</strong>, quedando <strong>{item.calculo.diasRemanentes} días remanentes</strong> no convertidos.
                        </p>

                        <p>
                          Como cada bienio equivale a 24 meses, se calcula: {item.calculo.mesesTotales} ÷ 24 = <strong>{item.calculo.bienios} bienios completos</strong>.
                        </p>

                        <p>
                          Los {item.calculo.bienios} bienios equivalen a {item.calculo.bienios * 24} meses. Luego: {item.calculo.mesesTotales} − {item.calculo.bienios * 24} = <strong>{item.calculo.mesesSobreBienios} meses por sobre los bienios cumplidos</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
