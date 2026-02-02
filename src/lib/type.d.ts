export interface Anime {
  id: string;
  title: string;
  japaneseTitle: string;
  slug: string;
  status: string;
  description: string;
  synopsis: string;
  totalEpisodes: number | null;
  episodeLength: number | null;
  image: {
    link: string;
    width: number;
    height: number;
  };
  coverImage: {
    link: string;
    width: number;
    height: number;
  };
  genre: AnimeGenre[];
  rating: number;
  userCount: number;
  favoritesCount: number;
  startDate: string | null;
  endDate: string | null;
  ageRating: string;
  ageRatingGuide: string | null;
  subtype: string;
  showType: string;
  popularityRank: number;
  ratingRank: number | null;
  youtubeVideoId: string | null;
  abbreviatedTitles: string[];
}

export interface AnimeGenre {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  synopsis: string;
  airdate: string;
  thumbnail: string;
}
