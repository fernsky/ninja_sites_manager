"use client";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";
import { useLayerStore } from "@/store/use-layer-store";
import { Button } from "@/components/ui/button";

export const FloatingLayerButton = () => {
  const setControlOpen = useLayerStore((state) => state.setControlOpen);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={() => setControlOpen(true)}
        size="lg"
        className="bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl
          transition-all duration-300 flex items-center gap-3"
      >
        <Layers className="w-4 h-4" />
        <span className="font-medium">Map Layers</span>
      </Button>
    </motion.div>
  );
};
