export interface Anime {
  id: string;
  title: string;
  japaneseTitle: string;
  slug: string;
  status: string;
  description: string;
  totalEpisodes: number | null;
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
}

export interface AnimeGenre {
  id: string;
  name: string;
  slug: string;
}

