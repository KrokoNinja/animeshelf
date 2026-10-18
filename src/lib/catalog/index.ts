import type { Anime, Episode } from "../type";
import { CatalogError } from "./errors";
import {
  decodeAnime,
  decodeAnimeList,
  decodeEpisode,
  fetchJson,
  readJson,
  request,
  type FetchLike,
  type KitsuAnimeResource,
  type KitsuEpisodeResource,
  type KitsuListResponse,
  type KitsuSingleResponse,
} from "./kitsu";

export type { FetchLike } from "./kitsu";
export { CatalogError } from "./errors";
export type { CatalogErrorKind } from "./errors";

const BASE_URL = "https://kitsu.io/api/edge";
const BATCH_SIZE = 20;
const EPISODE_PAGE_SIZE = 20;
const EPISODE_CAP = 500;
const DECODE_ERROR_MESSAGE = "Kitsu returned an invalid response";

export interface CatalogOptions {
  fetch: FetchLike;
}

export interface CatalogPage {
  items: Anime[];
  totalCount: number;
}

export interface Catalog {
  search(text: string): Promise<Anime[]>;
  page(page: number, perPage: number): Promise<CatalogPage>;
  byId(id: string): Promise<Anime | null>;
  bySlug(slug: string): Promise<Anime | null>;
  byIds(ids: string[]): Promise<Anime[]>;
  trending(limit: number): Promise<Anime[]>;
  episodes(animeId: string): Promise<Episode[]>;
}

async function decodeRead<T>(read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (error instanceof CatalogError) {
      throw error;
    }

    throw new CatalogError("decode", DECODE_ERROR_MESSAGE, { cause: error });
  }
}

async function readListPage(
  fetcher: FetchLike,
  url: string,
): Promise<CatalogPage> {
  return decodeRead(async () => {
    const payload = await fetchJson<KitsuListResponse<KitsuAnimeResource>>(
      fetcher,
      url,
    );

    return {
      items: decodeAnimeList(payload),
      totalCount: payload.meta?.count ?? 0,
    };
  });
}

export function createCatalog({ fetch }: CatalogOptions): Catalog {
  const byIds = async (ids: string[]): Promise<Anime[]> => {
    if (ids.length === 0) {
      return [];
    }

    const uniqueIds = [...new Set(ids)];
    const animeById = new Map<string, Anime>();

    for (let start = 0; start < uniqueIds.length; start += BATCH_SIZE) {
      const chunk = uniqueIds.slice(start, start + BATCH_SIZE);
      const url = `${BASE_URL}/anime?filter[id]=${chunk.map(encodeURIComponent).join(",")}&include=genres&page[limit]=${chunk.length}`;
      const { items } = await readListPage(fetch, url);

      for (const entry of items) {
        animeById.set(entry.id, entry);
      }
    }

    return ids.flatMap((id) => {
      const entry = animeById.get(id);
      return entry ? [entry] : [];
    });
  };

  return {
    async search(text: string): Promise<Anime[]> {
      const query = text.trim();
      if (!query) {
        return [];
      }

      const url = `${BASE_URL}/anime?filter[text]=${encodeURIComponent(query)}&include=genres`;
      const { items } = await readListPage(fetch, url);
      return items;
    },

    async page(page: number, perPage: number): Promise<CatalogPage> {
      const safePage = Math.max(1, Math.floor(page));
      const safePerPage = Math.max(1, Math.floor(perPage));
      const offset = (safePage - 1) * safePerPage;
      const url = `${BASE_URL}/anime?page[limit]=${safePerPage}&page[offset]=${offset}&include=genres`;
      return readListPage(fetch, url);
    },

    async byId(id: string): Promise<Anime | null> {
      const url = `${BASE_URL}/anime/${encodeURIComponent(id)}?include=genres`;

      return decodeRead(async () => {
        const response = await request(fetch, url);

        if (response.status === 404) {
          return null;
        }

        const payload = await readJson<KitsuSingleResponse<KitsuAnimeResource>>(
          response,
        );

        return decodeAnime(payload.data, payload.included ?? []);
      });
    },

    async bySlug(slug: string): Promise<Anime | null> {
      const query = slug.trim();
      if (!query) {
        return null;
      }

      const url = `${BASE_URL}/anime?filter[slug]=${encodeURIComponent(query)}&include=genres`;
      const { items } = await readListPage(fetch, url);
      return items[0] ?? null;
    },

    byIds,

    async trending(limit: number): Promise<Anime[]> {
      const safeLimit = Math.max(1, Math.floor(limit));
      const ids = await decodeRead(async () => {
        const payload = await fetchJson<{ data: { id: string }[] }>(
          fetch,
          `${BASE_URL}/trending/anime?limit=${safeLimit}`,
        );

        return payload.data.map((entry) => entry.id);
      });

      return byIds(ids);
    },

    async episodes(animeId: string): Promise<Episode[]> {
      return decodeRead(async () => {
        const episodes: Episode[] = [];
        let offset = 0;

        while (true) {
          const url = `${BASE_URL}/anime/${encodeURIComponent(animeId)}/episodes?page[limit]=${EPISODE_PAGE_SIZE}&page[offset]=${offset}`;
          const payload = await fetchJson<{
            data: KitsuEpisodeResource[];
            links?: { next?: string };
          }>(fetch, url);

          episodes.push(...payload.data.map(decodeEpisode));

          if (!payload.links?.next) {
            break;
          }

          offset += EPISODE_PAGE_SIZE;
          if (offset >= EPISODE_CAP) {
            break;
          }
        }

        return episodes;
      });
    },
  };
}

export const catalog = createCatalog({
  fetch: (input, init) => globalThis.fetch(input, init),
});
