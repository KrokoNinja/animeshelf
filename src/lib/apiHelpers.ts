import { Genre } from "./apiTypes"
import { GenreData, Anime as AnimeResponse, AnimeData } from "./apiTypes"
import { Anime, AnimeGenre } from "./type"

export async function getAnime(animePerPage: number = 10, page: number = 1): Promise<{ data: Anime[], totalCount: number }> {
  const response = await fetch(`https://kitsu.io/api/edge/anime?page[limit]=${animePerPage}&page[offset]=${(page - 1) * animePerPage}`)
  const data = await response.json() as AnimeData
  const processedAnime = await Promise.all(data.data.map(async (anime: AnimeResponse) => {
    const genres = await getGenres(anime.id)
    return {
    id: anime.id,
    title: anime.attributes.canonicalTitle,
    slug: anime.attributes.slug,
    totalEpisodes: anime.attributes.episodeCount,
    image: {
      link: anime.attributes.posterImage.large,
      width: anime.attributes.posterImage.meta.dimensions.large.width,
      height: anime.attributes.posterImage.meta.dimensions.large.height,
    },
    genre: genres.slice(0, 1),
    rating: Number((Number(anime.attributes.averageRating) / 10 / 2).toFixed(1)),
    }
  }))

  return {
    data: processedAnime,
    totalCount: data.meta.count,
  }
}

export async function getAnimeByName(name: string, numberOfGenres: number = 1): Promise<Anime[]> {
  const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${name}`)
  const data = await response.json() as AnimeData
  return Promise.all(data.data.map(async (anime: AnimeResponse) => {
    const genres = await getGenres(anime.id)
    return {
    id: anime.id,
    title: anime.attributes.canonicalTitle,
    slug: anime.attributes.slug,
    totalEpisodes: anime.attributes.episodeCount,
    image: {
      link: anime.attributes.posterImage.large,
      width: anime.attributes.posterImage.meta.dimensions.large.width,
      height: anime.attributes.posterImage.meta.dimensions.large.height,
    },
    genre: genres.slice(0, numberOfGenres),
    rating: Number((Number(anime.attributes.averageRating) / 10 / 2).toFixed(1)),
    }
  }))
}


export async function getGenres(id: string): Promise<AnimeGenre[]> {
  const response = await fetch(`https://kitsu.io/api/edge/anime/${id}/genres`)
  const data = await response.json() as GenreData
  return data.data.map((genre: Genre) => ({
    id: genre.id,
    name: genre.attributes.name,
    slug: genre.attributes.slug,
  }))
}

export async function getTrendingAnime(numberOfAnime: number = 3): Promise<Anime[]> {
  const response = await fetch(`https://kitsu.io/api/edge/trending/anime?limit=${numberOfAnime}`)
  const data = await response.json() as AnimeData
  return Promise.all(data.data.map(async (anime: AnimeResponse) => {
    const genres = await getGenres(anime.id)
    return {
    id: anime.id,
    title: anime.attributes.canonicalTitle,
    slug: anime.attributes.slug,
    totalEpisodes: anime.attributes.episodeCount,
    image: {
      link: anime.attributes.posterImage.large,
      width: anime.attributes.posterImage.meta.dimensions.large.width,
      height: anime.attributes.posterImage.meta.dimensions.large.height,
    },
    genre: genres.slice(0, 1),
    rating: Number((Number(anime.attributes.averageRating) / 10 / 2).toFixed(1)),
    }
  }))
}