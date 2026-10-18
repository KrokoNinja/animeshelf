import { describe, expect, it } from "vitest";
import { CatalogError, createCatalog } from "@/lib/catalog";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/vnd.api+json" },
  });

const anime = (overrides: Record<string, unknown> = {}, id = "1") => ({
  id,
  type: "anime",
  links: { self: "/anime/1" },
  attributes: {
    createdAt: "1998-04-03T00:00:00.000Z",
    updatedAt: "1998-04-03T00:00:00.000Z",
    slug: "cowboy-bebop",
    synopsis: "A ragtag crew of bounty hunters.",
    description: "A ragtag crew of bounty hunters.",
    coverImageTopOffset: 400,
    titles: {
      en: "Cowboy Bebop",
      en_jp: "Cowboy Bebop",
      ja_jp: "カウボーイビバップ",
    },
    canonicalTitle: "Cowboy Bebop",
    abbreviatedTitles: ["CB"],
    averageRating: "83.42",
    ratingFrequencies: {},
    userCount: 1000,
    favoritesCount: 500,
    startDate: "1998-04-03",
    endDate: "1999-04-24",
    nextRelease: null,
    popularityRank: 10,
    ratingRank: 5,
    ageRating: "R",
    ageRatingGuide: "17+",
    subtype: "TV",
    status: "finished",
    tba: null,
    posterImage: {
      tiny: "tiny.jpg",
      large: "https://media.kitsu.app/poster.jpg",
      small: "small.jpg",
      medium: "medium.jpg",
      original: "original.jpg",
      meta: {
        dimensions: {
          tiny: { width: 110, height: 156 },
          small: { width: 284, height: 402 },
          medium: { width: 390, height: 554 },
          large: { width: 550, height: 780 },
        },
      },
    },
    coverImage: {
      tiny: "tiny.jpg",
      large: "https://media.kitsu.app/cover.jpg",
      small: "small.jpg",
      medium: "medium.jpg",
      original: "original.jpg",
      meta: {
        dimensions: {
          tiny: { width: 110, height: 156 },
          small: { width: 284, height: 402 },
          medium: { width: 390, height: 554 },
          large: { width: 550, height: 780 },
        },
      },
    },
    episodeCount: 26,
    episodeLength: 24,
    totalLength: 624,
    youtubeVideoId: "abc123",
    showType: "TV",
    nsfw: false,
    ...overrides,
  },
  relationships: {
    genres: {
      links: {
        self: "/anime/1/relationships/genres",
        related: "/anime/1/genres",
      },
      data: [{ id: "1", type: "genres" }],
    },
  },
});

const genre = {
  id: "1",
  type: "genres",
  links: { self: "/genres/1" },
  attributes: {
    createdAt: "2013-02-14T00:00:00.000Z",
    updatedAt: "2013-02-14T00:00:00.000Z",
    name: "Action",
    slug: "action",
    description: null,
  },
};

const episode = (id: string, number: number) => ({
  id,
  type: "episodes",
  links: { self: `/episodes/${id}` },
  attributes: {
    canonicalTitle: `Episode ${number}`,
    number,
    seasonNumber: 1,
    synopsis: `Synopsis ${number}`,
    airdate: "1998-04-03",
    thumbnail: { original: `https://media.kitsu.app/episode-${number}.jpg` },
  },
});

describe("catalog.search", () => {
  it("returns decoded Anime with Genres and a 0–5 Rating", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({
          data: [anime()],
          included: [genre],
          meta: { count: 1 },
          links: { first: "/anime?page[number]=1", last: "/anime?page[number]=1" },
        });
      },
    });

    const results = await catalog.search("cowboy");

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "1",
      title: "Cowboy Bebop",
      slug: "cowboy-bebop",
      japaneseTitle: "カウボーイビバップ",
      rating: 4.2,
      totalEpisodes: 26,
      genres: [{ id: "1", name: "Action", slug: "action" }],
      image: {
        link: "https://media.kitsu.app/poster.jpg",
        width: 550,
        height: 780,
      },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain("filter[text]=cowboy");
    expect(calls[0]).toContain("include=genres");
  });

  it("trims and encodes the query, and skips the request for empty text", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({
          data: [anime()],
          included: [genre],
          meta: { count: 1 },
        });
      },
    });

    await catalog.search("  cowboy bebop  ");

    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain("filter[text]=cowboy%20bebop");

    calls.length = 0;
    const results = await catalog.search("   ");

    expect(results).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it("falls back to an English title when the Japanese title is missing", async () => {
    const catalog = createCatalog({
      fetch: async () =>
        jsonResponse({
          data: [
            anime({
              titles: { en: "Cowboy Bebop", en_jp: "Cowboy Bebop" },
            }),
          ],
          included: [genre],
          meta: { count: 1 },
        }),
    });

    const [result] = await catalog.search("cowboy");

    expect(result.japaneseTitle).toBe("Cowboy Bebop");
  });

  it("defaults the poster size when dimensions are missing", async () => {
    const catalog = createCatalog({
      fetch: async () =>
        jsonResponse({
          data: [
            anime({
              posterImage: {
                large: "https://media.kitsu.app/poster.jpg",
              },
            }),
          ],
          included: [genre],
          meta: { count: 1 },
        }),
    });

    const [result] = await catalog.search("cowboy");

    expect(result.image).toEqual({
      link: "https://media.kitsu.app/poster.jpg",
      width: 550,
      height: 780,
    });
  });
});

describe("catalog.page", () => {
  it("reads the requested page with its offset and total count", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({
          data: [anime()],
          included: [genre],
          meta: { count: 42 },
        });
      },
    });

    const result = await catalog.page(3, 16);

    expect(result.totalCount).toBe(42);
    expect(result.items).toHaveLength(1);
    expect(calls[0]).toContain("page[limit]=16");
    expect(calls[0]).toContain("page[offset]=32");
    expect(calls[0]).toContain("include=genres");
  });

  it("clamps a page below one to the first page", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({ data: [], meta: { count: 0 } });
      },
    });

    await catalog.page(0, 10);

    expect(calls[0]).toContain("page[offset]=0");
  });
});

describe("catalog.byId", () => {
  it("returns the decoded Anime with its Genres", async () => {
    const catalog = createCatalog({
      fetch: async () =>
        jsonResponse({ data: anime(), included: [genre] }),
    });

    const result = await catalog.byId("1");

    expect(result?.title).toBe("Cowboy Bebop");
    expect(result?.genres).toEqual([
      { id: "1", name: "Action", slug: "action" },
    ]);
  });

  it("returns null when the Anime does not exist", async () => {
    const catalog = createCatalog({
      fetch: async () =>
        jsonResponse(
          {
            errors: [
              {
                title: "Not Found",
                detail: "Not Found",
                code: "404",
                status: "404",
              },
            ],
          },
          404,
        ),
    });

    expect(await catalog.byId("missing")).toBeNull();
  });
});

describe("catalog.bySlug", () => {
  it("looks up the exact slug and returns the Anime", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({
          data: [anime()],
          included: [genre],
          meta: { count: 1 },
        });
      },
    });

    const result = await catalog.bySlug("cowboy-bebop");

    expect(result?.slug).toBe("cowboy-bebop");
    expect(calls[0]).toContain("filter[slug]=cowboy-bebop");
    expect(calls[0]).not.toContain("filter[text]");
  });

  it("returns null when no Anime has that slug", async () => {
    const catalog = createCatalog({
      fetch: async () => jsonResponse({ data: [], meta: { count: 0 } }),
    });

    expect(await catalog.bySlug("missing")).toBeNull();
  });
});

describe("catalog.byIds", () => {
  it("preserves caller order and omits missing ids", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({
          data: [
            anime(),
            anime(
              {
                canonicalTitle: "Trigun",
                slug: "trigun",
                titles: {
                  en: "Trigun",
                  en_jp: "Trigun",
                  ja_jp: "トライガン",
                },
              },
              "2",
            ),
          ],
          included: [genre],
          meta: { count: 2 },
        });
      },
    });

    const results = await catalog.byIds(["2", "1", "3"]);

    expect(results.map((entry) => entry.id)).toEqual(["2", "1"]);
    expect(calls[0]).toContain("filter[id]=2,1,3");
    expect(calls[0]).toContain("include=genres");
  });

  it("skips the request for an empty id list", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({ data: [] });
      },
    });

    expect(await catalog.byIds([])).toEqual([]);
    expect(calls).toHaveLength(0);
  });
});

describe("catalog.trending", () => {
  it("returns complete Anime in trending order through the batch read", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        if (calls.length === 1) {
          return jsonResponse({ data: [{ id: "2" }, { id: "1" }] });
        }
        return jsonResponse({
          data: [
            anime(),
            anime(
              {
                canonicalTitle: "Trigun",
                slug: "trigun",
                titles: {
                  en: "Trigun",
                  en_jp: "Trigun",
                  ja_jp: "トライガン",
                },
              },
              "2",
            ),
          ],
          included: [genre],
          meta: { count: 2 },
        });
      },
    });

    const results = await catalog.trending(2);

    expect(results.map((entry) => entry.id)).toEqual(["2", "1"]);
    expect(results[0].genres).toEqual([
      { id: "1", name: "Action", slug: "action" },
    ]);
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain("trending/anime");
    expect(calls[1]).toContain("filter[id]=2,1");
  });
});

describe("catalog.episodes", () => {
  it("follows pagination and decodes every Episode", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        if (calls.length === 1) {
          return jsonResponse({
            data: [episode("1", 1), episode("2", 2)],
            meta: { count: 3 },
            links: { next: "/anime/1/episodes?page[offset]=20" },
          });
        }
        return jsonResponse({
          data: [episode("3", 3)],
          meta: { count: 3 },
          links: {},
        });
      },
    });

    const results = await catalog.episodes("1");

    expect(results.map((entry) => entry.id)).toEqual(["1", "2", "3"]);
    expect(results[2]).toMatchObject({
      title: "Episode 3",
      episodeNumber: 3,
      seasonNumber: 1,
    });
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain("page[offset]=0");
    expect(calls[1]).toContain("page[offset]=20");
  });

  it("stops at the 500 Episode cap", async () => {
    const calls: string[] = [];
    const catalog = createCatalog({
      fetch: async (url) => {
        calls.push(String(url));
        return jsonResponse({
          data: Array.from({ length: 20 }, (_, index) =>
            episode(String(calls.length * 100 + index), index + 1),
          ),
          links: { next: "/anime/1/episodes?page[offset]=next" },
        });
      },
    });

    const results = await catalog.episodes("1");

    expect(results).toHaveLength(500);
    expect(calls).toHaveLength(25);
  });
});

describe("catalog errors", () => {
  it("wraps a transport failure as a network Catalog error", async () => {
    const catalog = createCatalog({
      fetch: async () => {
        throw new TypeError("connection refused");
      },
    });

    await expect(catalog.search("cowboy")).rejects.toMatchObject({
      name: "CatalogError",
      kind: "network",
    });
  });

  it("wraps an upstream failure with its status and detail", async () => {
    const catalog = createCatalog({
      fetch: async () =>
        jsonResponse(
          {
            errors: [
              {
                title: "Server Error",
                detail: "boom",
                code: "500",
                status: "500",
              },
            ],
          },
          500,
        ),
    });

    const error = await catalog
      .search("cowboy")
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(CatalogError);
    expect(error).toMatchObject({
      kind: "upstream",
      status: 500,
      message: "boom",
    });
  });

  it("wraps an invalid body as a decode Catalog error", async () => {
    const catalog = createCatalog({
      fetch: async () => new Response("not json", { status: 200 }),
    });

    await expect(catalog.byId("1")).rejects.toMatchObject({
      kind: "decode",
    });
  });
});
