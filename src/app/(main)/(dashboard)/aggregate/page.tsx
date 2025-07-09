import { AggregateDataView } from "@/components/aggregate/AggregateDataView";
import { Metadata } from "next";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "समग्र डाटा | केराबारी नगरपालिका सर्वेक्षण",
  description:
    "केराबारी नगरपालिकाको समग्र सर्वेक्षण डाटा हेर्नुहोस् र विश्लेषण गर्नुहोस्",
};

export default function AggregatePage() {
  return (
    <ContentLayout
      title="समग्र डाटा"
      subtitle="केराबारी नगरपालिकाको सबै सर्वेक्षण डाटाको एकीकृत दृष्टिकोण"
      actions={
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ड्यासबोर्डमा फर्कनुहोस्
          </Link>
        </Button>
      }
    >
      <AggregateDataView />
    </ContentLayout>
  );
}
