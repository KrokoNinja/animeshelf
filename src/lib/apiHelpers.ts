import { Genre } from "./apiTypes"
import { GenreData, Anime as AnimeResponse, AnimeData } from "./apiTypes"
import { Anime, AnimeGenre } from "./type"

export async function getAnime(animePerPage: number = 10, page: number = 1): Promise<{ data: Anime[], totalCount: number }> {
  const response = await fetch(`https://kitsu.io/api/edge/anime?page[limit]=${animePerPage}&page[offset]=${(page - 1) * animePerPage}`)
  const data = await response.json() as AnimeData
  const processedAnime = await getAnimeData(data)

  return {
    data: processedAnime,
    totalCount: data.meta.count,
  }
}

export async function getAnimeByText(text: string, numberOfGenres: number = 1): Promise<Anime[]> {
  const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${text}`)
  const data = await response.json() as AnimeData
  return await getAnimeData(data, numberOfGenres)
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
  return await getAnimeData(data)
}

function getAnimeData(data: AnimeData, numberOfGenres: number = 1): Promise<Anime[]> {
  return Promise.all(data.data.map(async (anime: AnimeResponse) => {
    const genres = await getGenres(anime.id)
    return {
    id: anime.id,
    title: anime.attributes.canonicalTitle,
    japaneseTitle: anime.attributes.titles.ja_jp || "",
    slug: anime.attributes.slug,
    status: anime.attributes.status,
    description: anime.attributes.description,
    totalEpisodes: anime.attributes.episodeCount || null,
    image: {
      link: anime.attributes.posterImage.large,
      width: anime.attributes.posterImage.meta.dimensions.large.width,
      height: anime.attributes.posterImage.meta.dimensions.large.height,
    },
    coverImage: {
      link: anime.attributes.coverImage?.large || "",
      width: anime.attributes.coverImage?.meta.dimensions.large.width || 0,
      height: anime.attributes.coverImage?.meta.dimensions.large.height || 0,
    },
    genre: genres.slice(0, numberOfGenres),
    rating: Number((Number(anime.attributes.averageRating) / 10 / 2).toFixed(1)),
    }
  }))
}