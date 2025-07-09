import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function FormCard({
  title,
  description,
  children,
  icon,
  className,
}: FormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "group hover:shadow-md transition-all duration-300",
          className,
        )}
      >
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
