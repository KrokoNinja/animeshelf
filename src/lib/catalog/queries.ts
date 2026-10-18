import { queryOptions } from "@tanstack/react-query";
import { catalog } from "./index";

const CATALOG_STALE_TIME = 5 * 60 * 1000;

const defaults = {
  staleTime: CATALOG_STALE_TIME,
  retry: 1,
} as const;

export const catalogQueries = {
  search: (text: string) => {
    const query = text.trim();

    return queryOptions({
      queryKey: ["catalog", "search", query] as const,
      queryFn: () => catalog.search(query),
      ...defaults,
    });
  },

  page: (page: number, perPage: number) =>
    queryOptions({
      queryKey: ["catalog", "page", page, perPage] as const,
      queryFn: () => catalog.page(page, perPage),
      ...defaults,
    }),

  byId: (id: string) =>
    queryOptions({
      queryKey: ["catalog", "anime", "id", id] as const,
      queryFn: () => catalog.byId(id),
      ...defaults,
    }),

  bySlug: (slug: string) =>
    queryOptions({
      queryKey: ["catalog", "anime", "slug", slug] as const,
      queryFn: () => catalog.bySlug(slug),
      ...defaults,
    }),

  byIds: (ids: string[]) =>
    queryOptions({
      queryKey: ["catalog", "anime", "ids", ...ids] as const,
      queryFn: () => catalog.byIds(ids),
      ...defaults,
    }),

  trending: (limit = 3) =>
    queryOptions({
      queryKey: ["catalog", "trending", limit] as const,
      queryFn: () => catalog.trending(limit),
      ...defaults,
    }),

  episodes: (animeId: string) =>
    queryOptions({
      queryKey: ["catalog", "episodes", animeId] as const,
      queryFn: () => catalog.episodes(animeId),
      ...defaults,
    }),
};
