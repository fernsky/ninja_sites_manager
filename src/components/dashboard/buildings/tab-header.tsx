import { motion } from "framer-motion";
import { FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabHeaderProps {
  active: string;
  stats: {
    totalBuildings?: number;
    invalidBuildings?: number;
  };
  onChange: (value: string) => void;
}

export function TabHeader({ active, stats, onChange }: TabHeaderProps) {
  const tabs = [
    {
      id: "all",
      label: "All Buildings",
      icon: FileText,
      count: stats.totalBuildings || 0,
      countClass: "bg-primary/10 text-primary",
      iconClass: "text-primary",
      description: "View and manage all building records",
    },
    {
      id: "invalid",
      label: "Invalid Buildings",
      icon: AlertTriangle,
      count: stats.invalidBuildings || 0,
      countClass: "bg-destructive/10 text-destructive",
      iconClass: "text-destructive",
      description: "Records that need attention",
    },
  ];

  return (
    <div className="relative bg-muted/30">
      <div className="mx-auto">
        <div className="flex flex-row space-x-1 p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "group relative rounded-lg px-3 py-2 sm:px-4 sm:py-3 flex-1 sm:flex-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active === tab.id
                  ? "bg-background shadow-sm"
                  : "hover:bg-muted/50",
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg shrink-0",
                      active === tab.id ? tab.countClass : "bg-muted",
                    )}
                  >
                    <tab.icon
                      className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5",
                        active === tab.id
                          ? tab.iconClass
                          : "text-muted-foreground",
                      )}
                    />
                  </span>
                  <div className="text-left min-w-0 hidden sm:block">
                    <div
                      className={cn(
                        "text-sm font-semibold truncate",
                        active === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {tab.label}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {tab.description}
                    </div>
                  </div>
                  <div className="text-left min-w-0 sm:hidden">
                    <div
                      className={cn(
                        "text-xs font-semibold truncate",
                        active === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {tab.label}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold",
                    active === tab.id
                      ? tab.countClass
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </div>
              </div>
              {active === tab.id && (
                <motion.div
                  layoutId="activeTabBottom"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
