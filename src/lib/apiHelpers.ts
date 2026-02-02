import { Genre } from "./apiTypes"
import { GenreData, Anime as AnimeResponse, AnimeData, ErrorResponse, EpisodeData, Episode as EpisodeResponse } from "./apiTypes"
import { Anime, AnimeGenre, Episode } from "./type"

export async function getAnime(animePerPage: number = 10, page: number = 1): Promise<{ data: Anime[], totalCount: number }> {
  const response = await fetch(`https://kitsu.io/api/edge/anime?page[limit]=${animePerPage}&page[offset]=${(page - 1) * animePerPage}`)

  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse
    throw new Error(errorData.errors[0]?.detail || 'Failed to fetch anime')
  }

  const data = await response.json() as AnimeData
  const processedAnime = await getAnimeData(data)

  return {
    data: processedAnime,
    totalCount: data.meta.count,
  }
}

export async function getAnimeByText(text: string, numberOfGenres: number = 1): Promise<Anime[]> {
  const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${text}`)

  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse
    throw new Error(errorData.errors[0]?.detail || 'Failed to search anime')
  }

  const data = await response.json() as AnimeData
  return await getAnimeData(data, numberOfGenres)
}

export async function getGenres(id: string): Promise<AnimeGenre[]> {
  const response = await fetch(`https://kitsu.io/api/edge/anime/${id}/genres`)

  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse
    throw new Error(errorData.errors[0]?.detail || 'Failed to fetch genres')
  }

  const data = await response.json() as GenreData
  return data.data.map((genre: Genre) => ({
    id: genre.id,
    name: genre.attributes.name,
    slug: genre.attributes.slug,
  }))
}

export async function getTrendingAnime(numberOfAnime: number = 3): Promise<Anime[]> {
  const response = await fetch(`https://kitsu.io/api/edge/trending/anime?limit=${numberOfAnime}`)

  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse
    throw new Error(errorData.errors[0]?.detail || 'Failed to fetch trending anime')
  }

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
      synopsis: anime.attributes.synopsis,
      totalEpisodes: anime.attributes.episodeCount || null,
      episodeLength: anime.attributes.episodeLength || null,
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
      userCount: anime.attributes.userCount,
      favoritesCount: anime.attributes.favoritesCount,
      startDate: anime.attributes.startDate,
      endDate: anime.attributes.endDate,
      ageRating: anime.attributes.ageRating,
      ageRatingGuide: anime.attributes.ageRatingGuide,
      subtype: anime.attributes.subtype,
      showType: anime.attributes.showType,
      popularityRank: anime.attributes.popularityRank,
      ratingRank: anime.attributes.ratingRank,
      youtubeVideoId: anime.attributes.youtubeVideoId,
      abbreviatedTitles: anime.attributes.abbreviatedTitles,
    }
  }))
}

export async function getEpisodes(animeId: string): Promise<Episode[]> {
  const allEpisodes: Episode[] = []
  let offset = 0
  const limit = 20 // Maximum allowed by the API
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=${limit}&page[offset]=${offset}`
    )

    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse
      throw new Error(errorData.errors[0]?.detail || 'Failed to fetch episodes')
    }

    const data = await response.json() as EpisodeData
    const episodes = data.data.map((episode: EpisodeResponse) => ({
      id: episode.id,
      title: episode.attributes.canonicalTitle,
      episodeNumber: episode.attributes.number,
      seasonNumber: episode.attributes.seasonNumber,
      synopsis: episode.attributes.synopsis,
      airdate: episode.attributes.airdate,
      thumbnail: episode.attributes.thumbnail.original,
    }))

    allEpisodes.push(...episodes)

    // Check if there are more episodes to fetch
    hasMore = data.data.length === limit && data.links.next !== undefined
    offset += limit

    // Safety limit to prevent infinite loops (max 500 episodes)
    if (offset >= 500) break
  }

  return allEpisodes
}