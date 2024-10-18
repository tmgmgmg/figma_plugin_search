const KUROCO_API_URL = process.env.NEXT_PUBLIC_KUROCO_API_URL || 'https://broccoli01417.g.kuroco.app';

export interface Thumbnail {
  id: string;
  url: string;
  desc: string;
  url_org: string;
}

export interface Link {
  url: string;
  label?: string;
}

export interface Plugin {
  topics_id: number;
  subject: string;
  description: string;
  usage: string;
  link: Link;
  contents_type_nm: string;
  tags: Tag[];
  thumbnail: Thumbnail;
  slug: string;
  inst_ymdhi: string;
  update_ymdhi: string;
}

export interface PageInfo {
  totalCnt: number;
  perPage: number;
  totalPageCnt: number;
  pageNo: number;
}

export interface Category {
  topics_category_id: string;
  category_nm: string;
  slug: string;
}

interface FetchPluginsParams {
  page?: number;
  limit?: number;
  search?: string;
  contents_type?: string;
  tags?: string[];
}

export interface Tag {
  key: string;
  label: string;
}

function buildFilterQuery({ search, tags }: { search?: string; tags?: string[] }) {
  const queries: string[] = [];

  if (search) {
    queries.push(`keyword contains "${search}"`);
  }

  if (tags && tags.length > 0) {
    // タグフィルタを OR で結合
    const tagsFilter = tags.map(tag => `tags.key contains "${tag}"`).join(" OR ");
    queries.push(`(${tagsFilter})`);
  }

  return queries.length > 0 ? queries.join(" AND ") : '';
}

// fetchPlugins 関数の修正
export async function fetchPlugins({
  page = 1,
  limit = 28,
  search,
  contents_type,
  tags
}: FetchPluginsParams = {}): Promise<{ plugins: Plugin[], pageInfo: PageInfo }> {
  const filter = buildFilterQuery({ search, tags });

  const params = new URLSearchParams({
    page: Math.max(1, page).toString(),
    limit: limit.toString(),
    include: 'tags' // タグの詳細情報を含める
  });

  // contents_type をフィルタ内ではなく別途追加
  if (contents_type) {
    params.append("contents_type", contents_type);
  }

  // filter を追加
  if (filter) {
    params.append("filter", filter);
  }

  const url = `${KUROCO_API_URL}/rcms-api/3/plugins?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    let errorMessage = 'Failed to fetch plugins';
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.errors.map((err: any) => err.message).join(", ") || errorMessage;
    } catch (e) {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    console.error('Failed to fetch plugins:', errorMessage);
    throw new Error(`Failed to fetch plugins: ${errorMessage}`);
  }

  const data = await response.json();

  // データの整形
  const plugins: Plugin[] = data.list.map((plugin: any) => ({
    topics_id: plugin.topics_id,
    subject: plugin.subject,
    description: plugin.description,
    usage: plugin.usage,
    link: plugin.link,
    contents_type_nm: plugin.contents_type_nm,
    tags: plugin.tags, // [{ key: "free", label: "無料" }, ...]
    thumbnail: plugin.thumbnail,
    slug: plugin.slug,
    inst_ymdhi: plugin.inst_ymdhi,
    update_ymdhi: plugin.update_ymdhi,
  }));

  const pageInfo: PageInfo = {
    totalCnt: data.pageInfo.totalCnt,
    perPage: data.pageInfo.perPage,
    totalPageCnt: data.pageInfo.totalPageCnt,
    pageNo: data.pageInfo.pageNo,
  };

  return {
    plugins,
    pageInfo
  };
}


export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${KUROCO_API_URL}/rcms-api/3/plugins/category`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    if (data.list && Array.isArray(data.list)) {
      return data.list.map((item: any) => ({
        topics_category_id: item.topics_category_id,
        category_nm: item.category_nm,
        slug: item.topics_category_id,
      }));
    }
    // console.error('Unexpected response structure:', data);
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await fetch(`${KUROCO_API_URL}/rcms-api/3/plugins/tags?data_format=json`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    const data = await response.json();

    // `ext_config` 配列から `ext_slug: "tags"` を持つ項目を検索
    const tagsConfig = data.ext_config.find((config: any) => config.ext_slug === "tags");
    if (tagsConfig && Array.isArray(tagsConfig.options)) {
      const tags: Tag[] = tagsConfig.options.map((option: any) => ({
        key: option.key,
        label: option.value, // `value` を `label` として使用
      }));
      // console.log('Fetched Tags:', tags); // サーバーサイドのログ
      return tags;
    }

    console.error('Tags configuration not found or invalid:', data);
    return [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export async function fetchTagsWithCount(): Promise<Tag[]> {
  try {
    const [tags, allPlugins] = await Promise.all([
      fetchTags(),
      fetchPlugins({ limit: 1000 }) // 全てのプラグインを取得
    ]);

    const tagCounts = allPlugins.plugins.reduce((acc, plugin) => {
      plugin.tags.forEach(tag => {
        acc[tag.key] = (acc[tag.key] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return tags.map(tag => ({
      ...tag,
      count: tagCounts[tag.key] || 0
    }));
  } catch (error) {
    console.error('Error fetching tags with count:', error);
    return [];
  }
}

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

export function saveFavorite(topicsId: number) {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (!favorites.includes(topicsId)) {
    favorites.push(topicsId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function removeFavorite(topicsId: number) {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(id => id !== topicsId);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
}

export function isFavorite(topicsId: number): boolean {
  const favorites = getFavorites();
  return favorites.includes(topicsId);
}

export async function fetchFavoritePlugins(): Promise<Plugin[]> {
  const favoriteIds = getFavorites();
  if (favoriteIds.length === 0) return [];

  const params = new URLSearchParams({
    limit: '1000',
    include: 'tags'
  });

  const url = `/api/3/plugins?${params.toString()}`;
  // console.log('Fetching Plugins from URL:', url); // デバッグ用ログ

  try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch plugins';
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.errors.map((err: any) => err.message).join(", ") || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      console.error('Failed to fetch plugins:', errorMessage);
      throw new Error(`Failed to fetch plugins: ${errorMessage}`);
    }

    const data = await response.json();
    // console.log('Fetched Plugins Data:', data); // デバッグ用ログ

    // ローカルのお気に入りIDでフィルタリング
    return data.list
      .filter((plugin: any) => favoriteIds.includes(plugin.topics_id))
      .map((plugin: any) => ({
        topics_id: plugin.topics_id,
        subject: plugin.subject,
        description: plugin.description,
        usage: plugin.usage,
        link: plugin.link,
        contents_type_nm: plugin.contents_type_nm,
        tags: plugin.tags,
        thumbnail: plugin.thumbnail,
        slug: plugin.slug,
        inst_ymdhi: plugin.inst_ymdhi,
        update_ymdhi: plugin.update_ymdhi,
      }));
  } catch (error) {
    console.error('Error fetching plugins:', error);
    throw error;
  }
}
