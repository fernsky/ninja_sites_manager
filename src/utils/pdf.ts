import { jsPDF } from "jspdf";
import "jspdf-autotable";
import MUNICIPALITY_LOGO from "@/lib/assets/nepal-logo.png";

interface HeaderDetails {
  enumeratorName: string;
  enumeratorId: string;
  phoneNumber: string;
  wardNumber: number;
  areaCode: number;
  formTitle?: string;
  formSubtitle?: string;
}

const loadSvgSafely = async (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  try {
    await doc.addImage(MUNICIPALITY_LOGO.src, "PNG", x, y, width, height);
  } catch (error) {
    console.error("Failed to load municipality logo:", error);
    // Fallback: Draw a placeholder rectangle
    doc.setDrawColor(200);
    doc.rect(x, y, width, height);
    doc.setFontSize(8);
    doc.text("Logo", x + width / 2, y + height / 2, { align: "center" });
  }
};

export const setupPDFHeader = async (doc: jsPDF, details: HeaderDetails) => {
  // Initialize A4 in portrait
  doc.setProperties({
    title: `Survey Form - Area ${details.areaCode}`,
    creator: "Kerabari Municipality",
  });

  // Set title and main header - slightly smaller font sizes
  doc.setFontSize(14);
  doc.text("Kerabari Sites Management", doc.internal.pageSize.width / 2, 15, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.text("Biratnagar, Koshi Province", doc.internal.pageSize.width / 2, 22, {
    align: "center",
  });

  // Add form specific titles
  if (details.formTitle) {
    doc.setFontSize(12);
    doc.text(details.formTitle, doc.internal.pageSize.width / 2, 29, {
      align: "center",
    });
  }

  if (details.formSubtitle) {
    doc.setFontSize(10);
    doc.text(details.formSubtitle, doc.internal.pageSize.width / 2, 35, {
      align: "center",
    });
  }

  // Add logo with error handling
  await loadSvgSafely(doc, 15, 10, 21, 21);

  // Add enumerator details in a more compact box
  doc.setDrawColor(150);
  doc.setLineWidth(0.1);
  doc.rect(10, 40, doc.internal.pageSize.width - 20, 20);

  // Left side details - slightly smaller text
  doc.setFontSize(9);
  doc.text(`Enumerator: ${details.enumeratorName}`, 15, 46);
  doc.text(`ID: ${details.enumeratorId.slice(0, 8)}`, 15, 52);
  doc.text(`Phone: ${details.phoneNumber}`, 15, 58);

  // Right side details
  const rightCol = doc.internal.pageSize.width - 70;
  doc.text(`Ward No: ${details.wardNumber}`, rightCol, 46);
  doc.text(`Area Code: ${details.areaCode}`, rightCol, 52);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, rightCol, 58);

  return 65; // Adjusted starting Y position for table
};

export const configurePDFTable = (doc: jsPDF) => {
  return {
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: [100, 100, 100],
      minCellHeight: 8, // Add minimum height
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center", // Center align headers
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" }, // SN
      1: { cellWidth: 30, halign: "center" }, // Token
      2: { cellWidth: 45 }, // Name/Families
      3: { cellWidth: 30 }, // Phone/Business
      4: { cellWidth: "auto" }, // Location
    },
    margin: { left: 10, right: 10, top: 10, bottom: 15 }, // Added bottom margin for page number
    theme: "grid",
  };
};

export const configureBuildingPDFTable = (doc: any) => ({
  margin: { top: 10, right: 10, bottom: 15, left: 10 },
  tableWidth: "auto",
  theme: "grid",
  tableLineColor: [200, 200, 200],
  tableLineWidth: 0.1,
});

export const configureFamilyPDFTable = (doc: jsPDF) => {
  return {
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: [100, 100, 100],
      minCellHeight: 8,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" }, // SN
      1: { cellWidth: 25, halign: "center" }, // Building Token
      2: { cellWidth: 45 }, // Name
      3: { cellWidth: 25 }, // Phone
      4: { cellWidth: 35 }, // Address
      5: { cellWidth: 25 }, // Survey Date
      6: { cellWidth: "auto" }, // Remarks
    },
    margin: { left: 10, right: 10, top: 10, bottom: 15 },
    theme: "grid",
  };
};
