import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HelpCard() {
  return (
    <Card className="border-blue-100 bg-blue-50/50">
      <CardContent className="flex items-start gap-4 p-6">
        <div className="rounded-full bg-blue-100 p-2">
          <Shield className="h-5 w-5 text-blue-700" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            If you need assistance with your account or have any questions,
            please contact your supervisor or the support team at{" "}
            <a
              href="mailto:intensivestudy.research@gmail.com"
              className="text-primary hover:underline"
            >
              intensivestudy.research@gmail.com
            </a>{" "}
            or call us at{" "}
            <a href="tel:+1234567890" className="text-primary hover:underline">
              9862768543
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
