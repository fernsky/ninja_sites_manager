import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExceptionType = (error: unknown) => {
  const UnknownException = {
    type: "UnknownException",
    status: 500,
    message: "An unknown error occurred",
  };

  if (!error) return UnknownException;

  if ((error as Record<string, unknown>).name === "DatabaseError") {
    return {
      type: "DatabaseException",
      status: 400,
      message: "Duplicate key entry",
    };
  }

  return UnknownException;
};

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date));
}

export function formatPrice(
  price: number | string,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options.currency ?? "USD",
    notation: options.notation ?? "compact",
    ...options,
  }).format(Number(price));
}

export function absoluteUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).href;
}

interface TableData {
  [key: string]: any;
}

/**
 * Converts a JavaScript object into a PostgreSQL INSERT statement with UPSERT functionality
 *
 * @param table - The name of the target PostgreSQL table
 * @param data - Object containing key-value pairs representing table columns and their values
 *
 * @returns A SQL string containing the INSERT statement with ON CONFLICT handling
 *
 * @remarks
 * - Handles special case for POINT geometry data by using ST_GeomFromText
 * - Escapes single quotes in string values
 * - Converts null values to 'NULL'
 * - Creates UPSERT statement using ON CONFLICT DO UPDATE
 * - Uses 'id' as the conflict target column
 *
 * @example
 * ```typescript
 * const data = {
 *   id: 1,
 *   name: "John's Data",
 *   location: "POINT(10 20)",
 *   age: 25
 * };
 * const sql = jsonToPostgres("users", data);
 * // Returns: INSERT INTO users (id,name,location,age)
 * //          VALUES (1,'John''s Data',ST_GeomFromText('POINT(10 20)', 4326),25)
 * //          ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id, ...
 * ```
 */
export const jsonToPostgres = (
  table: string,
  data: TableData,
  conflictClause: string = "ON CONFLICT(id)",
): string => {
  const keys = Object.keys(data);

  const values = Object.values(data).map((val) => {
    if (val === null || val === undefined) return "NULL";

    if (Array.isArray(val)) {
      const escapedValues = val
        .filter((item) => item !== undefined && item !== null)
        .map((item) =>
          typeof item === "string" ? `'${item.replace(/'/g, "''")}'` : item,
        );
      return `ARRAY[${escapedValues.join(",")}]`;
    }

    if (typeof val === "string") {
      if (val.startsWith("POINT")) {
        return `ST_GeomFromText('${val}', 4326)`;
      }
      /*
      if (val.startsWith("uuid:")) {
        return `'${val.substring(5)}'::UUID`;
      }
        */
      return `'${val.replace(/'/g, "''")}'`;
    }

    return val;
  });

  const conflictUpdateClause = keys
    .map((key) => `${key} = EXCLUDED.${key}`)
    .join(", ");

  return `
        INSERT INTO ${table} (${keys.join(",")}) 
        VALUES (${values.join(",")})
        ${conflictClause}
        DO UPDATE SET ${conflictUpdateClause}
    `;
};

export const isValidGeoJSON = (geojson: any): boolean => {
  if (!geojson || typeof geojson !== "object") return false;

  // Check if it's a proper GeoJSON object
  if (!geojson.type || !geojson.coordinates) return false;

  // Basic coordinate validation
  const validateCoords = (coords: any[]): boolean => {
    if (!Array.isArray(coords)) return false;

    for (const coord of coords) {
      if (Array.isArray(coord)) {
        if (!validateCoords(coord)) return false;
      } else {
        if (typeof coord !== "number" || isNaN(coord)) return false;
      }
    }
    return true;
  };

  return validateCoords(geojson.coordinates);
};
