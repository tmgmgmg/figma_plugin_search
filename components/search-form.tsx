"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // 現在のURLから search パラメータを取得し、検索ボックスに初期値として設定
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchTerm(currentSearch);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    const query = new URLSearchParams(searchParams.toString());

    if (trimmedSearch) {
      query.set("search", trimmedSearch);
    } else {
      query.delete("search");
    }

    // 新しいURLにナビゲート（既存のフィルタを保持）
    router.push(`/?${query.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="プラグインを検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 focus-visible:ring-offset-0"
        />
      </div>
      <Button type="submit">検索</Button>
    </form>
  );
}
