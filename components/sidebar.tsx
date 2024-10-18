"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  CodeXml,
  Heart,
  MessageSquareText,
  Package,
  PackageOpen,
  Palette,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Category } from "@/lib/kuroco";
import { Separator } from "./ui/separator";

interface SidebarProps {
  categories: Category[];
  tags: { key: string; label: string; count: number }[];
}

export function Sidebar({ categories, tags }: SidebarProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const contents_type = searchParams.get("contents_type");

  useEffect(() => {
    const tagsParam = searchParams.get("tags");
    if (tagsParam) {
      setSelectedTags(tagsParam.split(","));
    } else {
      setSelectedTags([]);
    }

    const type = searchParams.get("contents_type");
    if (type) {
      setSelectedCategory(type);
    } else {
      setSelectedCategory(null);
    }
    const favorites = searchParams.get("favorites");
    setShowFavorites(favorites === "true");
  }, [searchParams]);

  const handleCategoryClick = (slug: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete("search"); // カテゴリを検索した際に検索パラメータも削除
    if (slug) {
      setSelectedCategory(slug);
      query.set("contents_type", slug);
    } else {
      setSelectedCategory(null);
      query.delete("contents_type");
    }

    // 検索キーワードを保持
    const search = query.get("search");
    if (search) {
      query.set("search", search);
    }
    // タグを保持
    if (selectedTags.length > 0) {
      query.delete("tags");
      selectedTags.forEach((tag) => query.append("tags", tag));
    }
    query.delete("favorites");
    setShowFavorites(false);
    router.push(`/?${query.toString()}`);
  };

  const handleTagClick = (tagKey: string) => {
    let newTags: string[];
    if (selectedTags.includes(tagKey)) {
      newTags = selectedTags.filter((tag) => tag !== tagKey);
    } else {
      newTags = [...selectedTags, tagKey];
    }

    const query = new URLSearchParams();
    if (contents_type) {
      query.append("contents_type", contents_type);
    }
    if (newTags.length > 0) {
      newTags.forEach((tag) => query.append("tags", tag));
    }
    query.delete("favorites");
    setShowFavorites(false);
    router.push(`/?${query.toString()}`);
    setSelectedTags(newTags);
  };

  const handleFavoritesClick = () => {
    const query = new URLSearchParams(searchParams.toString());
    if (!showFavorites) {
      query.set("favorites", "true");
      setShowFavorites(true);
    } else {
      query.delete("favorites");
      setShowFavorites(false);
    }
    router.push(`/?${query.toString()}`);
  };

  return (
    <aside className="w-64 bg-gradient border-r p-4 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center tracking-widest">
          <PackageOpen size={32} className="mr-1" />
          FigToolBox.
        </h1>
      </div>
      <nav className="mb-6">
        <h2 className="mb-2 font-semibold">カテゴリー</h2>
        <ul className="space-y-1">
          <li>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground`}
              onClick={() => handleCategoryClick("")} // "All" を選択
            >
              <Package className="mr-2 w-5 h-5" />
              すべて
            </Button>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  category.slug === selectedCategory
                    ? "bg-accent text-custom hover:text-custom"
                    : "text-muted-foreground"
                }`}
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.slug == "16" && <Palette className="mr-2 w-5 h-5" />}
                {category.slug == "17" && <CodeXml className="mr-2 w-5 h-5" />}
                {category.slug == "18" && (
                  <MessageSquareText className="mr-2 w-5 h-5" />
                )}
                {category.category_nm}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <Separator className="mb-6" />
      <Button
        variant="ghost"
        className={`w-full justify-start flex" ${
          showFavorites
            ? "bg-accent text-custom hover:text-custom"
            : "text-muted-foreground"
        }`}
        onClick={handleFavoritesClick}
      >
        <Heart className="mr-2 w-5 h-5" />
        お気に入り
      </Button>
      <Separator className="mb-6 mt-6" />
      <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            タグ
            {isTagsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-3 pb-2">
            {tags.map((tag) => (
              <Button
                key={tag.key}
                variant={selectedTags.includes(tag.key) ? "default" : "outline"}
                size="sm"
                className="mr-1 mb-1"
                onClick={() => handleTagClick(tag.key)}
              >
                {tag.label} ({tag.count})
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </aside>
  );
}
