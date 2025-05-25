export interface Anime {
  id: string;
  title: string;
  slug: string;
  totalEpisodes: number | null;
  image: {
    link: string;
    width: number;
    height: number;
  };
  genre: AnimeGenre[];
  rating: number;
}

export interface AnimeGenre {
  id: string;
  name: string;
  slug: string;
}

