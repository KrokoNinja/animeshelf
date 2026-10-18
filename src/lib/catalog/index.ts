import type { Anime, Episode } from "../type";
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

export interface CatalogOptions {
  fetch: FetchLike;
}

export interface Catalog {
  search(text: string): Promise<Anime[]>;
  page(
    page: number,
    perPage: number,
  ): Promise<{ items: Anime[]; totalCount: number }>;
  byId(id: string): Promise<Anime | null>;
  bySlug(slug: string): Promise<Anime | null>;
  byIds(ids: string[]): Promise<Anime[]>;
  trending(limit?: number): Promise<Anime[]>;
  episodes(animeId: string): Promise<Episode[]>;
}

export function createCatalog({ fetch }: CatalogOptions): Catalog {
  const byIds = async (ids: string[]): Promise<Anime[]> => {
    if (ids.length === 0) {
      return [];
    }

    const uniqueIds = [...new Set(ids)];
    const url = `${BASE_URL}/anime?filter[id]=${uniqueIds.map(encodeURIComponent).join(",")}&include=genres&page[limit]=${uniqueIds.length}`;
    const payload = await fetchJson<KitsuListResponse<KitsuAnimeResource>>(
      fetch,
      url,
    );
    const included = payload.included ?? [];
    const resources = new Map(
      payload.data.map((resource) => [resource.id, resource]),
    );

    return ids.flatMap((id) => {
      const resource = resources.get(id);
      return resource ? [decodeAnime(resource, included)] : [];
    });
  };

  return {
    async search(text: string): Promise<Anime[]> {
      const query = text.trim();
      if (!query) {
        return [];
      }

      const url = `${BASE_URL}/anime?filter[text]=${encodeURIComponent(query)}&include=genres`;
      const payload = await fetchJson<KitsuListResponse<KitsuAnimeResource>>(
        fetch,
        url,
      );
      return decodeAnimeList(payload);
    },

    async page(
      page: number,
      perPage: number,
    ): Promise<{ items: Anime[]; totalCount: number }> {
      const safePage = Math.max(1, Math.floor(page));
      const safePerPage = Math.max(1, Math.floor(perPage));
      const offset = (safePage - 1) * safePerPage;
      const url = `${BASE_URL}/anime?page[limit]=${safePerPage}&page[offset]=${offset}&include=genres`;
      const payload = await fetchJson<KitsuListResponse<KitsuAnimeResource>>(
        fetch,
        url,
      );

      return {
        items: decodeAnimeList(payload),
        totalCount: payload.meta?.count ?? 0,
      };
    },

    async byId(id: string): Promise<Anime | null> {
      const url = `${BASE_URL}/anime/${encodeURIComponent(id)}?include=genres`;
      const response = await request(fetch, url);

      if (response.status === 404) {
        return null;
      }

      const payload = await readJson<KitsuSingleResponse<KitsuAnimeResource>>(
        response,
      );

      return decodeAnime(payload.data, payload.included ?? []);
    },

    async bySlug(slug: string): Promise<Anime | null> {
      const url = `${BASE_URL}/anime?filter[slug]=${encodeURIComponent(slug)}&include=genres`;
      const payload = await fetchJson<KitsuListResponse<KitsuAnimeResource>>(
        fetch,
        url,
      );
      const resource = payload.data[0];

      return resource
        ? decodeAnime(resource, payload.included ?? [])
        : null;
    },

    byIds,

    async trending(limit = 3): Promise<Anime[]> {
      const safeLimit = Math.max(1, Math.floor(limit));
      const payload = await fetchJson<{ data: { id: string }[] }>(
        fetch,
        `${BASE_URL}/trending/anime?limit=${safeLimit}`,
      );

      return byIds(payload.data.map((entry) => entry.id));
    },

    async episodes(animeId: string): Promise<Episode[]> {
      const episodes: Episode[] = [];
      const limit = 20;
      let offset = 0;

      while (true) {
        const url = `${BASE_URL}/anime/${encodeURIComponent(animeId)}/episodes?page[limit]=${limit}&page[offset]=${offset}`;
        const payload = await fetchJson<{
          data: KitsuEpisodeResource[];
          links?: { next?: string };
        }>(fetch, url);

        episodes.push(...payload.data.map(decodeEpisode));

        if (!payload.links?.next) {
          break;
        }

        offset += limit;
        if (offset >= 500) {
          break;
        }
      }

      return episodes;
    },
  };
}

export const catalog = createCatalog({
  fetch: (input, init) => globalThis.fetch(input, init),
});
