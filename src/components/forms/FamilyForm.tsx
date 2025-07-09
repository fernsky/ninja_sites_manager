import React from "react";
import { setupPDFHeader, configureFamilyPDFTable } from "@/utils/pdf";
import { Printer } from "lucide-react";
import { PrintButton } from "./PrintButton";
import { api } from "@/trpc/react";
import { jsPDF } from "jspdf";

interface FamilyFormProps {
  areaId: string;
}

const FamilyForm = ({ areaId }: FamilyFormProps) => {
  const { data: areaDetails, isLoading } = api.area.getAreaDetails.useQuery({
    areaId,
  });

  const generatePDF = async () => {
    try {
      if (!areaDetails || !areaDetails.enumerator) return;

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
        formTitle: "Household Survey Form",
        formSubtitle: "Family Registration and Demographics Data Collection",
      });

      const tableColumn = [
        "SN",
        "Building Token",
        "Family Head Name",
        "Family Head Phone",
        "Address",
        "Survey Date",
        "Remarks",
      ];

      // Hardcoded symbol numbers from 1 to 100
      const tableRows = Array.from({ length: 200 }, (_, index) => [
        (index + 1).toString().padStart(3, "0"), // Symbol numbers like 001, 002, etc.
        "", // Building Token
        "", // Name
        "", // Phone
        "", // Address
        "", // Survey Date
        "", // Remarks
      ]);

      //@ts-ignore
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY,
        ...configureFamilyPDFTable(doc),
      });

      doc.save(`family_survey_${areaDetails.code}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      throw new Error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <PrintButton
      icon={Printer}
      label="Print Family Survey"
      onPrint={generatePDF}
      disabled={isLoading || !areaDetails?.enumerator}
    />
  );
};

export default FamilyForm;
