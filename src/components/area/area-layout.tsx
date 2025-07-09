"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, ClipboardCheck, List, Plus } from "lucide-react";
import { AreaTabs } from "./area-tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const tabs = [
  {
    name: "Areas List",
    icon: <List className="h-4 w-4" />,
    description: "View all areas and their current status",
    value: "areas",
  },
  {
    name: "Requests",
    icon: <MapPin className="h-4 w-4" />,
    description: "View and manage area access requests",
    value: "requests",
  },
  {
    name: "Actions",
    icon: <ClipboardCheck className="h-4 w-4" />,
    description: "Process area completion and withdrawal requests",
    value: "actions",
  },
];

export const AreaLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Areas</h2>
          <p className="text-muted-foreground">Manage and create new areas</p>
        </div>
        <Button
          onClick={() => router.push("/area/create")}
          className="flex items-center gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Area</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <Button
            key={tab.value}
            variant={activeTab === index ? "default" : "ghost"}
            className="flex items-center gap-2"
            onClick={() => setActiveTab(index)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </Button>
        ))}
      </div>

      <Card className="min-h-[calc(100vh-12rem)]">
        <AreaTabs activeTab={activeTab} />
      </Card>
    </div>
  );
};
