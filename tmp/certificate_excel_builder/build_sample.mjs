import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/RIT certify/outputs/certificate_upload_sample";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Certificates");
sheet.showGridLines = false;

sheet.getRange("A1:E5").values = [
  ["eventName", "studentName", "studentRoll", "credential", "date"],
  ["Hack With Infosys", "Ashwani Raj", "239381", "CERT_INFY_11", "2026-08-06"],
  ["Hack With Infosys", "Priya Sharma", "239382", "CERT_INFY_12", "2026-08-06"],
  ["Hack With Infosys", "Rohan Kumar", "239383", "CERT_INFY_13", "2026-08-06"],
  ["Hack With Infosys", "Neha Singh", "239384", "CERT_INFY_14", "2026-08-06"],
];

sheet.getRange("A1:E1").format = {
  fill: "#4F46E5",
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sheet.getRange("A1:E5").format.borders = {
  preset: "all",
  style: "thin",
  color: "#D9E1F2",
};
sheet.getRange("A2:E5").format = {
  fill: "#F8FAFC",
  verticalAlignment: "center",
};
sheet.getRange("D2:D5").format = {
  fill: "#EEF2FF",
  font: { bold: true, color: "#312E81" },
};
sheet.getRange("A1:E1").format.rowHeight = 26;
sheet.getRange("A2:E5").format.rowHeight = 22;
sheet.getRange("A:A").format.columnWidth = 24;
sheet.getRange("B:B").format.columnWidth = 22;
sheet.getRange("C:C").format.columnWidth = 16;
sheet.getRange("D:D").format.columnWidth = 20;
sheet.getRange("E:E").format.columnWidth = 16;
sheet.getRange("A1:E5").format.wrapText = false;
sheet.freezePanes.freezeRows(1);
sheet.tables.add("A1:E5", true, "CertificateUploadTable");

const readme = workbook.worksheets.add("Read Me");
readme.showGridLines = false;
readme.getRange("A1:B1").values = [["Certificate Bulk Upload Template", ""]];
readme.getRange("A1:B1").format = {
  fill: "#111827",
  font: { bold: true, color: "#FFFFFF", size: 16 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
readme.getRange("A3:B8").values = [
  ["Column", "What to enter"],
  ["eventName", "Event or program name"],
  ["studentName", "Student full name"],
  ["studentRoll", "Student roll number"],
  ["credential", "Unique certificate ID, e.g. CERT_INFY_11"],
  ["date", "Certificate date in YYYY-MM-DD format"],
];
readme.getRange("A3:B3").format = {
  fill: "#4F46E5",
  font: { bold: true, color: "#FFFFFF" },
};
readme.getRange("A3:B8").format.borders = {
  preset: "all",
  style: "thin",
  color: "#D9E1F2",
};
readme.getRange("A10:B11").values = [
  ["Important", "Keep the first sheet named Certificates and do not change the header names."],
  ["Note", "Use a new credential for each row. Existing certificate IDs are skipped."],
];
readme.getRange("A10:A11").format = {
  fill: "#FEF3C7",
  font: { bold: true, color: "#92400E" },
};
readme.getRange("A10:B11").format.wrapText = true;
readme.getRange("A10:B11").format.borders = {
  preset: "outside",
  style: "thin",
  color: "#F59E0B",
};
readme.getRange("A:A").format.columnWidth = 18;
readme.getRange("B:B").format.columnWidth = 64;
readme.getRange("A1:B1").format.rowHeight = 30;
readme.getRange("A10:B11").format.rowHeight = 36;

const preview = await workbook.render({
  sheetName: "Certificates",
  range: "A1:E5",
  scale: 2,
  format: "png",
});
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));

const readmePreview = await workbook.render({
  sheetName: "Read Me",
  range: "A1:B11",
  scale: 2,
  format: "png",
});
await fs.writeFile(`${outputDir}/readme_preview.png`, new Uint8Array(await readmePreview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(`${outputDir}/sample_certificate_upload.xlsx`);

const inspection = await workbook.inspect({
  kind: "table",
  range: "Certificates!A1:E5",
  include: "values,formulas",
  tableMaxRows: 6,
  tableMaxCols: 5,
});
console.log(inspection.ndjson);
