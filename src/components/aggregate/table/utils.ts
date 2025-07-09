/**
 * Flattens a nested object for CSV export
 */
export const flattenObject = (obj: any, prefix = "") => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const pre = prefix.length ? `${prefix}.` : "";

      // Skip arrays and nulls when flattening
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
      } else if (!Array.isArray(obj[key])) {
        acc[`${pre}${key}`] = obj[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};

/**
 * Downloads data as CSV file
 */
export const downloadAsCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const flatData = data.map((item) => flattenObject(item));

  // Get all unique headers
  const headers = Array.from(
    new Set(flatData.flatMap((obj) => Object.keys(obj))),
  );

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...flatData.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? "";
          // Handle strings with commas by wrapping in quotes
          return typeof val === "string" && val.includes(",")
            ? `"${val}"`
            : val;
        })
        .join(","),
    ),
  ].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
