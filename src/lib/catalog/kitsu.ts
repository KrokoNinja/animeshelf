import type { Anime, AnimeGenre, Episode } from "../type";
import { CatalogError } from "./errors";

export type FetchLike = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export interface KitsuGenreResource {
  id: string;
  type: "genres";
  attributes: {
    name: string;
    slug: string;
  };
}

export interface KitsuAnimeResource {
  id: string;
  type: "anime";
  attributes: {
    slug: string;
    synopsis: string | null;
    description: string | null;
    titles: {
      en?: string;
      en_jp?: string;
      ja_jp?: string;
    };
    canonicalTitle: string;
    abbreviatedTitles: string[];
    averageRating: string | null;
    userCount: number;
    favoritesCount: number;
    startDate: string | null;
    endDate: string | null;
    popularityRank: number;
    ratingRank: number | null;
    ageRating: string;
    ageRatingGuide: string | null;
    subtype: string;
    status: string;
    posterImage: {
      large: string;
      meta?: {
        dimensions?: {
          large?: { width: number; height: number };
        };
      };
    };
    coverImage: {
      large: string;
      meta?: {
        dimensions?: {
          large?: { width: number; height: number };
        };
      };
    } | null;
    episodeCount: number | null;
    episodeLength: number | null;
    youtubeVideoId: string | null;
    showType: string;
  };
  relationships?: {
    genres?: {
      data?: { id: string; type: string }[];
    };
  };
}

export interface KitsuListResponse<T> {
  data: T[];
  included?: KitsuGenreResource[];
  meta?: { count: number };
}

export interface KitsuSingleResponse<T> {
  data: T;
  included?: KitsuGenreResource[];
}

const DEFAULT_POSTER = { width: 550, height: 780 };

export function normalizeRating(averageRating: string | null): number {
  const rating = Number(averageRating);
  return Number.isFinite(rating)
    ? Number((rating / 20).toFixed(1))
    : 0;
}

function decodeGenres(
  resource: KitsuAnimeResource,
  included: KitsuGenreResource[],
): AnimeGenre[] {
  const ids = resource.relationships?.genres?.data?.map((genre) => genre.id) ?? [];
  return included
    .filter((genre) => ids.includes(genre.id))
    .map((genre) => ({
      id: genre.id,
      name: genre.attributes.name,
      slug: genre.attributes.slug,
    }));
}

export function decodeAnime(
  resource: KitsuAnimeResource,
  included: KitsuGenreResource[] = [],
): Anime {
  const attributes = resource.attributes;
  const poster = attributes.posterImage.meta?.dimensions?.large ?? DEFAULT_POSTER;
  const cover = attributes.coverImage?.meta?.dimensions?.large;

  return {
    id: resource.id,
    title: attributes.canonicalTitle,
    japaneseTitle:
      attributes.titles.ja_jp ??
      attributes.titles.en_jp ??
      attributes.titles.en ??
      "",
    slug: attributes.slug,
    status: attributes.status,
    description: attributes.description ?? "",
    synopsis: attributes.synopsis ?? "",
    totalEpisodes: attributes.episodeCount,
    episodeLength: attributes.episodeLength,
    image: {
      link: attributes.posterImage.large,
      width: poster.width,
      height: poster.height,
    },
    coverImage: {
      link: attributes.coverImage?.large ?? "",
      width: cover?.width ?? 0,
      height: cover?.height ?? 0,
    },
    genres: decodeGenres(resource, included),
    rating: normalizeRating(attributes.averageRating),
    userCount: attributes.userCount,
    favoritesCount: attributes.favoritesCount,
    startDate: attributes.startDate,
    endDate: attributes.endDate,
    ageRating: attributes.ageRating,
    ageRatingGuide: attributes.ageRatingGuide,
    subtype: attributes.subtype,
    showType: attributes.showType,
    popularityRank: attributes.popularityRank,
    ratingRank: attributes.ratingRank,
    youtubeVideoId: attributes.youtubeVideoId,
    abbreviatedTitles: attributes.abbreviatedTitles,
  };
}

export function decodeAnimeList(payload: KitsuListResponse<KitsuAnimeResource>): Anime[] {
  const included = payload.included ?? [];
  return payload.data.map((resource) => decodeAnime(resource, included));
}

export interface KitsuEpisodeResource {
  id: string;
  attributes: {
    canonicalTitle: string;
    number: number;
    seasonNumber: number;
    synopsis: string | null;
    airdate: string | null;
    thumbnail: {
      original: string;
    } | null;
  };
}

export function decodeEpisode(resource: KitsuEpisodeResource): Episode {
  return {
    id: resource.id,
    title: resource.attributes.canonicalTitle,
    episodeNumber: resource.attributes.number,
    seasonNumber: resource.attributes.seasonNumber,
    synopsis: resource.attributes.synopsis ?? "",
    airdate: resource.attributes.airdate ?? "",
    thumbnail: resource.attributes.thumbnail?.original ?? "",
  };
}

export async function request(
  fetcher: FetchLike,
  url: string,
): Promise<Response> {
  try {
    return await fetcher(url);
  } catch (error) {
    throw new CatalogError("network", "Could not reach Kitsu", {
      cause: error,
    });
  }
}

export async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `Kitsu request failed with status ${response.status}`;

    try {
      const body = (await response.json()) as {
        errors?: { detail?: string }[];
      };
      detail = body.errors?.[0]?.detail ?? detail;
    } catch {
      // Keep the status message when the error body is not JSON.
    }

    throw new CatalogError("upstream", detail, { status: response.status });
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new CatalogError(
      "decode",
      "Kitsu returned an invalid response",
      { cause: error },
    );
  }
}

export async function fetchJson<T>(
  fetcher: FetchLike,
  url: string,
): Promise<T> {
  return readJson<T>(await request(fetcher, url));
}
