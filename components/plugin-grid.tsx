import { PluginCard } from "@/components/plugin-card";
import { Plugin } from "@/lib/kuroco";
import Image from "next/image";
import { PluginCardSkeleton } from "./plugin-card-skeleton";

interface PluginGridProps {
  plugins: Plugin[];
  isLoading?: boolean;
}

export function PluginGrid({ plugins, isLoading = false }: PluginGridProps) {
  if (isLoading) {
    return <PluginCardSkeleton />;
  }
  if (plugins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="bg-background dark:bg-card rounded-full w-48 h-48 flex items-center justify-center mb-8">
          <Image
            src="/images/empty-box.png"
            alt="空の箱"
            width={120}
            height={120}
            className="pr-4"
          />
        </div>
        <div className="text-center text-gray-500">
          プラグインが見つかりませんでした。
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {plugins.map((plugin) => (
        <PluginCard key={plugin.topics_id} plugin={plugin} />
      ))}
    </div>
  );
}
