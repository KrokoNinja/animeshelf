
export default function NothingWatching() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-b from-slate-900/50 to-slate-900/20 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mb-6 border-2 border-pink-500/30">
                <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                No anime in progress
            </h2>

            <p className="text-lg text-slate-400 mb-8 max-w-md leading-relaxed">
                Your watchlist is looking a bit empty. Time to discover your next favorite anime adventure!
            </p>

            <a
                href="/discover"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-pink-500/25 active:scale-95"
            >
                Discover New Anime
            </a>
        </div>

    )
}
