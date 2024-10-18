import { Suspense } from "react";
import { PluginGrid } from "@/components/plugin-grid";
import { Pagination } from "@/components/pagination";
import { Sidebar } from "@/components/sidebar";
import { SearchForm } from "@/components/search-form";
import { MobileMenu } from "@/components/mobile-menu";
import { FavoritePlugins } from "@/components/favorite-plugins";
import {
  fetchPlugins,
  fetchCategories,
  fetchTagsWithCount,
  Plugin,
  PageInfo,
} from "@/lib/kuroco";
import { PluginCardSkeleton } from "@/components/plugin-card-skeleton";

export const revalidate = 3600; // revalidate every hour

interface HomeProps {
  searchParams: {
    page?: string;
    search?: string;
    contents_type?: string;
    tags?: string | string[];
    favorites?: string;
  };
}

async function fetchPageData(searchParams: HomeProps["searchParams"]) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const { search, contents_type, tags } = searchParams;
  const tagsArray = Array.isArray(tags) ? tags : tags ? tags.split(",") : [];

  try {
    const [pluginsResult, categories, tagsWithCount] = await Promise.all([
      fetchPlugins({
        page,
        search,
        contents_type,
        tags: tagsArray,
      }),
      fetchCategories(),
      fetchTagsWithCount(),
    ]);

    return {
      plugins: pluginsResult.plugins,
      pageInfo: pluginsResult.pageInfo,
      categories,
      tagsWithCount,
    };
  } catch (err: any) {
    console.error(err);
    return {
      plugins: [],
      pageInfo: { totalCnt: 0, perPage: 28, totalPageCnt: 1, pageNo: 1 },
      categories: [],
      tagsWithCount: [],
    };
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const { plugins, pageInfo, categories, tagsWithCount } = await fetchPageData(
    searchParams
  );

  return (
    <div className="flex flex-col lg:flex-row w-screen">
      <div className="lg:hidden">
        <MobileMenu categories={categories} tags={tagsWithCount} />
      </div>
      <div className="hidden lg:block">
        <Sidebar categories={categories} tags={tagsWithCount} />
      </div>
      <div className="flex flex-col flex-1">
        <header className="h-16 bg-header shadow-md flex items-center px-4 justify-end border-b">
          <div className="lg:hidden">
            <MobileMenu categories={categories} tags={tagsWithCount} />
          </div>
          <SearchForm />
        </header>
        <main className="flex-1 min-w-0 flex flex-col overflow-y-auto p-6 bg-card dark:bg-background">
          {searchParams.search && (
            <p className="mb-4">
              検索結果：<strong>{searchParams.search}</strong>
            </p>
          )}
          {searchParams.favorites === "true" ? (
            <>
              <Suspense fallback={<div>Loading favorites...</div>}>
                <FavoritePlugins />
              </Suspense>
            </>
          ) : (
            <>
              <Suspense fallback={<PluginCardSkeleton />}>
                <PluginGrid plugins={plugins} />
              </Suspense>
              {pageInfo.totalPageCnt >= 2 && (
                <Pagination
                  currentPage={pageInfo.pageNo}
                  totalPages={pageInfo.totalPageCnt}
                  searchParams={searchParams}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
