"use client";

import { useState } from "react";
import { AreaTabs } from "./area-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AreaNavigation() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Areas</h2>
          <p className="text-muted-foreground">Manage and create new areas</p>
        </div>
        <Button
          onClick={() => router.push("/area/create")}
          size="lg"
          className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/25 active:scale-95 gap-2 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
          <span className="font-medium">Create New Area</span>
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list" onClick={() => setActiveTab(0)}>
            Area List
          </TabsTrigger>
          <TabsTrigger value="requests" onClick={() => setActiveTab(1)}>
            Area Requests
          </TabsTrigger>
          <TabsTrigger value="actions" onClick={() => setActiveTab(2)}>
            Quick Actions
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <AreaTabs activeTab={activeTab} />
    </div>
  );
}
