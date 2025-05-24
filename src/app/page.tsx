"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Star, Clock, CheckCircle, BookOpen, Users, TrendingUp, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function AnimeShelf() {
  const [searchQuery, setSearchQuery] = useState("")

  const currentlyWatching = [
    {
      id: 1,
      title: "Attack on Titan",
      episode: 15,
      totalEpisodes: 25,
      image: "/placeholder.svg?height=120&width=80",
      rating: 4.8,
      genre: "Action",
    },
    {
      id: 2,
      title: "Demon Slayer",
      episode: 8,
      totalEpisodes: 12,
      image: "/placeholder.svg?height=120&width=80",
      rating: 4.9,
      genre: "Supernatural",
    },
    {
      id: 3,
      title: "One Piece",
      episode: 1089,
      totalEpisodes: null,
      image: "/placeholder.svg?height=120&width=80",
      rating: 4.7,
      genre: "Adventure",
    },
  ]

  const recentlyCompleted = [
    {
      id: 4,
      title: "Jujutsu Kaisen",
      rating: 5,
      image: "/placeholder.svg?height=120&width=80",
      completedDate: "2 days ago",
      genre: "Supernatural",
    },
    {
      id: 5,
      title: "My Hero Academia",
      rating: 4,
      image: "/placeholder.svg?height=120&width=80",
      completedDate: "1 week ago",
      genre: "Superhero",
    },
  ]

  const planToWatch = [
    {
      id: 6,
      title: "Chainsaw Man",
      image: "/placeholder.svg?height=120&width=80",
      genre: "Action",
      episodes: 12,
    },
    {
      id: 7,
      title: "Spy x Family",
      image: "/placeholder.svg?height=120&width=80",
      genre: "Comedy",
      episodes: 25,
    },
    {
      id: 8,
      title: "Mob Psycho 100",
      image: "/placeholder.svg?height=120&width=80",
      genre: "Supernatural",
      episodes: 37,
    },
  ]

  const socialFeed = [
    {
      id: 1,
      user: "AnimeOtaku92",
      avatar: "/placeholder.svg?height=40&width=40",
      action: "completed",
      anime: "Death Note",
      rating: 5,
      comment: "Absolutely mind-blowing! The psychological warfare between Light and L was incredible.",
      time: "2 hours ago",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      user: "MangaReader",
      avatar: "/placeholder.svg?height=40&width=40",
      action: "started watching",
      anime: "Fullmetal Alchemist: Brotherhood",
      time: "4 hours ago",
      likes: 8,
      comments: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">AnimeShelf</h1>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Anime
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">127</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-xs text-muted-foreground">Watching</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-xs text-muted-foreground">Plan to Watch</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">4.6</p>
                      <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Currently Watching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Currently Watching</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentlyWatching.map((anime) => (
                    <div key={anime.id} className="space-y-3">
                      <div className="relative">
                        <Image
                          src={anime.image || "/placeholder.svg"}
                          alt={anime.title}
                          width={120}
                          height={160}
                          className="rounded-lg object-cover w-full aspect-[3/4]"
                        />
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {anime.genre}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{anime.rating}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Episode {anime.episode}</span>
                            <span>{anime.totalEpisodes ? `/ ${anime.totalEpisodes}` : "Ongoing"}</span>
                          </div>
                          <Progress
                            value={anime.totalEpisodes ? (anime.episode / anime.totalEpisodes) * 100 : 0}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different lists */}
            <Tabs defaultValue="completed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="completed">Recently Completed</TabsTrigger>
                <TabsTrigger value="plantowatch">Plan to Watch</TabsTrigger>
              </TabsList>

              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recentlyCompleted.map((anime) => (
                    <div key={anime.id} className="space-y-2">
                      <div className="relative">
                        <Image
                          src={anime.image || "/placeholder.svg"}
                          alt={anime.title}
                          width={120}
                          height={160}
                          className="rounded-lg object-cover w-full aspect-[3/4]"
                        />
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {anime.genre}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < anime.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{anime.completedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="plantowatch" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {planToWatch.map((anime) => (
                    <div key={anime.id} className="space-y-2">
                      <div className="relative">
                        <Image
                          src={anime.image || "/placeholder.svg"}
                          alt={anime.title}
                          width={120}
                          height={160}
                          className="rounded-lg object-cover w-full aspect-[3/4]"
                        />
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {anime.genre}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
                        <p className="text-xs text-muted-foreground">{anime.episodes} episodes</p>
                        <Button size="sm" className="w-full text-xs">
                          Start Watching
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Friend Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialFeed.map((activity) => (
                  <div key={activity.id} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.anime}</span>
                          {activity.rating && (
                            <span className="ml-1">
                              {[...Array(activity.rating)].map((_, i) => (
                                <Star key={i} className="inline h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </span>
                          )}
                        </p>
                        {activity.comment && <p className="text-xs text-muted-foreground">{activity.comment}</p>}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{activity.time}</span>
                          <button className="flex items-center space-x-1 hover:text-foreground">
                            <Heart className="h-3 w-3" />
                            <span>{activity.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-foreground">
                            <MessageCircle className="h-3 w-3" />
                            <span>{activity.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Trending This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Frieren: Beyond Journey's End", rating: 4.9 },
                  { title: "Solo Leveling", rating: 4.8 },
                  { title: "Dungeon Meshi", rating: 4.7 },
                ].map((anime, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{anime.title}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{anime.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
