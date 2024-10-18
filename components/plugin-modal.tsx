"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Plugin } from "@/lib/kuroco";
import Image from "next/image";

interface PluginModalProps {
  isOpen: boolean;
  onClose: () => void;
  plugin: Plugin;
}

export function PluginModal({ isOpen, onClose, plugin }: PluginModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal">
      <div className="bg-background p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{plugin.subject}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <Image
          src={plugin.thumbnail.url_org}
          alt={plugin.thumbnail.desc}
          width={300}
          height={200}
          className="w-full object-cover aspect-[2/1]"
        />
        <p className="mb-6 mt-6 text-muted-foreground">{plugin.description}</p>
        <h3 className="text-xl font-semibold mt-8 mb-4">使用方法</h3>
        <div dangerouslySetInnerHTML={{ __html: plugin.usage }} />
        <div className="mt-4 bg-accent pr-4 pl-4 pt-1 pb-1 rounded-md">
          <p className="mb-3">
            <span className="font-semibold">カテゴリー：</span>
            <span className="bg-background ml-2 pt-1 pb-1 pr-2 pl-2 rounded-sm text-sm">
              {plugin.contents_type_nm}
            </span>
          </p>
          <p>
            <span className="font-semibold">タグ：</span>
            <span className="bg-background ml-2 pt-1 pb-1 pr-2 pl-2 rounded-sm text-sm">
              {plugin.tags?.map((tag) => tag.label).join(", ")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
