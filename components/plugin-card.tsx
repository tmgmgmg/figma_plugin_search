"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { PluginModalWrapper } from "@/components/plugin-modal-wrapper";
import { Plugin, saveFavorite, removeFavorite, isFavorite } from "@/lib/kuroco";
import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface PluginCardProps {
  plugin: Plugin;
}

export function PluginCard({ plugin }: PluginCardProps) {
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    setFavorite(isFavorite(plugin.topics_id));
  }, [plugin.topics_id]);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(plugin.topics_id);
    } else {
      saveFavorite(plugin.topics_id);
    }
    setFavorite(!favorite);
  };
  return (
    <Card className="overflow-hidden flex flex-col h-full dark:bg-card">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={plugin.thumbnail.url}
            alt={plugin.thumbnail.desc}
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 flex items-center">
          {plugin.subject}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {plugin.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 w-full mt-auto">
        <PluginModalWrapper plugin={plugin} />
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            className="w-10 h-10 mr-2 p-0"
            onClick={() => window.open(plugin.link.url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={`w-10 h-10 p-0`}
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-4 w-4 ${favorite ? "fill-custom text-custom" : ""}`}
            />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
