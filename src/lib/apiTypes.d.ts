export interface GenreAttributes {
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface GenreLinks {
  self: string;
}

export interface Genre {
  id: string;
  type: "genres";
  links: GenreLinks;
  attributes: GenreAttributes;
}

export interface Meta {
  count: number;
}

export interface Links {
  first: string;
  last: string;
}

export interface GenreData {
  data: Genre[];
  meta: Meta;
  links: Links;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMeta {
  dimensions: {
    tiny: ImageDimensions;
    large: ImageDimensions;
    small: ImageDimensions;
    medium?: ImageDimensions;
  };
}

export interface Image {
  tiny: string;
  large: string;
  small: string;
  medium?: string;
  original: string;
  meta: ImageMeta;
}

export interface Titles {
  en?: string;
  en_jp?: string;
  ja_jp?: string;
  en_us?: string;
}

export interface RatingFrequencies {
  [key: string]: string;
}

export interface AnimeLinks {
  self: string;
}

export interface RelationshipLinks {
  self: string;
  related: string;
}

export interface Relationships {
  genres: {
    links: RelationshipLinks;
  };
  categories: {
    links: RelationshipLinks;
  };
  castings: {
    links: RelationshipLinks;
  };
  installments: {
    links: RelationshipLinks;
  };
  mappings: {
    links: RelationshipLinks;
  };
  reviews: {
    links: RelationshipLinks;
  };
  mediaRelationships: {
    links: RelationshipLinks;
  };
  characters: {
    links: RelationshipLinks;
  };
  staff: {
    links: RelationshipLinks;
  };
  productions: {
    links: RelationshipLinks;
  };
  quotes: {
    links: RelationshipLinks;
  };
  episodes: {
    links: RelationshipLinks;
  };
  streamingLinks: {
    links: RelationshipLinks;
  };
  animeProductions: {
    links: RelationshipLinks;
  };
  animeCharacters: {
    links: RelationshipLinks;
  };
  animeStaff: {
    links: RelationshipLinks;
  };
}

export interface AnimeAttributes {
  createdAt: string;
  updatedAt: string;
  slug: string;
  synopsis: string;
  description: string;
  coverImageTopOffset: number;
  titles: Titles;
  canonicalTitle: string;
  abbreviatedTitles: string[];
  averageRating: string | null;
  ratingFrequencies: RatingFrequencies;
  userCount: number;
  favoritesCount: number;
  startDate: string | null;
  endDate: string | null;
  nextRelease: string | null;
  popularityRank: number;
  ratingRank: number | null;
  ageRating: string;
  ageRatingGuide: string | null;
  subtype: string;
  status: string;
  tba: string | null;
  posterImage: Image;
  coverImage: Image | null;
  episodeCount: number | null;
  episodeLength: number | null;
  totalLength: number;
  youtubeVideoId: string | null;
  showType: string;
  nsfw: boolean;
}

export interface Anime {
  id: string;
  type: "anime";
  links: AnimeLinks;
  attributes: AnimeAttributes;
  relationships: Relationships;
}

export interface AnimeMeta {
  count: number;
}

export interface AnimeDataLinks {
  first: string;
  next?: string;
  last: string;
}

export interface AnimeData {
  data: Anime[];
  meta: AnimeMeta;
  links: AnimeDataLinks;
}

export interface EpisodeTitles {
  en_jp?: string;
  en?: string;
  ja_jp?: string;
}

export interface EpisodeThumbnail {
  original: string;
  meta: {
    dimensions: Record<string, unknown>;
  };
}

export interface EpisodeAttributes {
  createdAt: string;
  updatedAt: string;
  titles: EpisodeTitles;
  canonicalTitle: string;
  seasonNumber: number;
  number: number;
  relativeNumber: number;
  synopsis: string;
  airdate: string;
  length: number | null;
  thumbnail: EpisodeThumbnail;
}

export interface EpisodeLinks {
  self: string;
}

export interface EpisodeRelationships {
  media: {
    links: RelationshipLinks;
  };
  videos: {
    links: RelationshipLinks;
  };
}

export interface Episode {
  id: string;
  type: "episodes";
  links: EpisodeLinks;
  attributes: EpisodeAttributes;
  relationships: EpisodeRelationships;
}

export interface EpisodeMeta {
  count: number;
}

export interface EpisodeDataLinks {
  first: string;
  prev?: string;
  next?: string;
  last: string;
}

export interface EpisodeData {
  data: Episode[];
  meta: EpisodeMeta;
  links: EpisodeDataLinks;
}

export interface ErrorSource {
  pointer?: string;
  parameter?: string;
}

export interface ApiError {
  title: string;
  detail: string;
  code: string;
  status: string;
  source?: ErrorSource;
}

export interface ErrorResponse {
  errors: ApiError[];
}
