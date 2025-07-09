import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aggregate Data",
  description: "View and analyze aggregated survey data",
};

export default function AggregateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
