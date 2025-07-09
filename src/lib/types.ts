export type UserRole = "admin" | "editor" | "viewer";
export type DomainType = "municipality" | "ward";

export interface User {
  id: string;
  userName: string;
  role: UserRole;
  domain: DomainType;
  wardNumber?: string | null;
  // ...other user properties
}
