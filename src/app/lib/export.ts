import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { downloadBlob } from './download';

export type ReportRow = Record<string, string>;

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCSV(rows: ReportRow[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCSV(row[h] ?? '')).join(',')),
  ].join('\n');
  downloadBlob(csv, filename, 'text/csv;charset=utf-8');
}

export function exportExcel(rows: ReportRow[], filename: string) {
  if (rows.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function exportPDF(rows: ReportRow[], title: string, filename: string) {
  if (rows.length === 0) return;
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.setTextColor(49, 45, 196);
  doc.text('University Project Portal', 14, 16);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(title, 14, 24);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((h) => row[h] ?? ''));

  autoTable(doc, {
    head: [headers],
    body,
    startY: 36,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [49, 45, 196], textColor: 255 },
    alternateRowStyles: { fillColor: [238, 237, 251] },
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
