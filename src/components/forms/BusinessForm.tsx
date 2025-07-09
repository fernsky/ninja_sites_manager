import React from "react";
import { jsPDF } from "jspdf";
import { setupPDFHeader, configureBuildingPDFTable } from "@/utils/pdf";
import { Printer } from "lucide-react";
import { PrintButton } from "./PrintButton";
import { api } from "@/trpc/react";

interface BusinessFormProps {
  areaId: string;
}

const BusinessForm = ({ areaId }: BusinessFormProps) => {
  const { data: areaDetails, isLoading: isAreaLoading } =
    api.area.getAreaDetails.useQuery({
      areaId,
    });

  // Fetch all unallocated tokens directly
  const { data: tokensData, isLoading: isTokensLoading } =
    api.area.getAreaTokens.useQuery(
      {
        areaId,
        status: "unallocated",
        // Remove pagination to get all tokens
        limit: undefined,
        offset: undefined,
      },
      {
        select: (data) => data.tokens.map((t) => t.token),
      },
    );

  const generatePDF = async () => {
    try {
      if (!areaDetails?.enumerator || !tokensData) return;

      const doc = new jsPDF({
        format: "a4",
        unit: "mm",
      });

      const startY = await setupPDFHeader(doc, {
        enumeratorName: areaDetails.enumerator.name ?? "N/A",
        enumeratorId: areaDetails.enumerator.id ?? "N/A",
        phoneNumber: areaDetails.enumerator.phoneNumber ?? "N/A",
        wardNumber: areaDetails.wardNumber,
        areaCode: areaDetails.code,
        formTitle: "Building Survey Form",
        formSubtitle: "Physical Infrastructure and Business Assessment",
      });

      const tableColumns = [
        { header: "SN", dataKey: "sn" },
        { header: "Token", dataKey: "token" },
        { header: "Business Name", dataKey: "businessName" },
        { header: "Location", dataKey: "location" },
        { header: "Survey Date", dataKey: "date" },
        { header: "Remarks", dataKey: "remarks" },
      ];

      const tableRows = tokensData.map((token, index) => ({
        sn: (index + 1).toString(),
        token: token,
        businessName: "",
        location: "",
        date: "",
        remarks: "",
      }));

      //@ts-ignore
      doc.autoTable({
        columns: tableColumns,
        body: tableRows,
        startY,
        ...configureBuildingPDFTable(doc),
        // Add these options to handle pagination better
        pageBreak: "auto",
        showHead: "everyPage",
        //@ts-ignore
        didDrawPage: function (data) {
          // Add page number at the bottom
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10,
          );
        },
        styles: {
          cellPadding: 3,
          fontSize: 9,
          lineColor: 40,
          lineWidth: 0.1,
          overflow: "linebreak",
          cellWidth: "wrap",
        },
        headStyles: {
          fillColor: [241, 241, 241],
          textColor: 40,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: 40,
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          sn: { cellWidth: 10, halign: "center" },
          token: { cellWidth: 25, halign: "center" },
          families: { cellWidth: 35 },
          businesses: { cellWidth: 35 },
          location: { cellWidth: 50 },
          date: { cellWidth: 35, halign: "center" },
        },
      });

      doc.save(`business_form_${areaDetails.code}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      throw new Error("Failed to generate PDF. Please try again.");
    }
  };

  const isLoading = isAreaLoading || isTokensLoading;
  const tokenCount = tokensData?.length ?? 0;

  return (
    <PrintButton
      icon={Printer}
      label={`Business Form (${tokenCount})`}
      onPrint={generatePDF}
      disabled={isLoading || !areaDetails?.enumerator || tokenCount === 0}
      size="sm"
      variant="outline"
      className="h-8 px-3 text-xs"
    />
  );
};

export default BusinessForm;
