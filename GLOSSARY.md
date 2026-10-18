# AnimeShelf

A personal anime tracker built around a catalog of Anime and Episodes.

## Language

**Anime**:
A title in the catalog, identified by its slug.
_Avoid_: show, series

**Episode**:
A single installment of an Anime, identified by its season number and episode number.
_Avoid_: chapter, part

**Genre**:
A category describing an Anime. An Anime has zero or more Genres.
_Avoid_: category, tag

**Catalog**:
The app's read-only collection of Anime and Episodes, drawn from Kitsu.
_Avoid_: library, feed

**Rating**:
A score for an Anime on a 0–5 scale, kept to one decimal place.
_Avoid_: score, average, stars

**Kitsu**:
The third-party service the Catalog reads Anime and Episode data from.
_Avoid_: upstream
