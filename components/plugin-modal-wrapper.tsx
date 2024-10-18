"use client";

import { useState } from "react";
import { PluginModal } from "@/components/plugin-modal";
import { Button } from "./ui/button";
import { Plugin } from "@/lib/kuroco";

export function PluginModalWrapper({ plugin }: { plugin: Plugin }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        onClick={openModal}
        className="font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full text-muted-foreground mr-2"
      >
        View Details
      </Button>
      <PluginModal isOpen={isOpen} onClose={closeModal} plugin={plugin} />
    </>
  );
}
