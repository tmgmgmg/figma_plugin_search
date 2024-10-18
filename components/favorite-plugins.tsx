"use client";

import { useEffect, useState } from "react";
import { PluginGrid } from "@/components/plugin-grid";
import { fetchFavoritePlugins, Plugin } from "@/lib/kuroco";

export function FavoritePlugins() {
  const [favoritePlugins, setFavoritePlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const plugins = await fetchFavoritePlugins();
        setFavoritePlugins(plugins);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error loading favorites:", err);
        setError(
          `お気に入りの読み込み中にエラーが発生しました: ${err.message}`
        );
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  if (isLoading) {
    return <div>お気に入りを読み込んでいます...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (favoritePlugins.length === 0) {
    return <div>お気に入りのプラグインはありません。</div>;
  }

  return <PluginGrid plugins={favoritePlugins} />;
}
