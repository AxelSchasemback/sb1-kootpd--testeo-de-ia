import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import { Mic, Music, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import PlaylistSelector from './components/PlaylistSelector'
import KaraokeGame from './components/KaraokeGame'
import Leaderboard from './components/Leaderboard'
import UserProfile from './components/UserProfile'
import { saveScore } from './utils/api'

const spotifyApi = new SpotifyWebApi()

function App() {
  const [token, setToken] = useState('')
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [scores, setScores] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split('=')
          initial[parts[0]] = decodeURIComponent(parts[1])
        }
        return initial
      }, {})

    if (hash.access_token) {
      setToken(hash.access_token)
      spotifyApi.setAccessToken(hash.access_token)
      fetchUserData()
      fetchPlaylists()
    }
  }, [])

  const fetchUserData = async () => {
    const userData = await spotifyApi.getMe()
    setUser(userData)
  }

  const fetchPlaylists = async () => {
    const data = await spotifyApi.getUserPlaylists()
    setPlaylists(data.items)
  }

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist)
    setGameStarted(true)
  }

  const handleGameEnd = async (score) => {
    const newScores = [...scores, score]
    setScores(newScores)
    setGameStarted(false)
    if (user) {
      await saveScore(user.id, score)
    }
  }

  if (!token) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Bienvenido al Juego de Karaoke</h1>
          <p className="mb-6">Inicia sesión con Spotify para comenzar</p>
          <a
            href={`https://accounts.spotify.com/authorize?client_id=590a910e4b6e495f9094613a4f6014ad&redirect_uri=${encodeURIComponent(
              window.location.origin
            )}&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&show_dialog=true`}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Iniciar sesión con Spotify
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-8"
    >
      <h1 className="text-4xl font-bold text-white mb-8">Juego de Karaoke</h1>
      {user && <UserProfile user={user} />}
      {!gameStarted ? (
        <>
          <PlaylistSelector playlists={playlists} onSelect={handlePlaylistSelect} />
          <Leaderboard scores={scores} />
        </>
      ) : (
        <KaraokeGame playlist={selectedPlaylist} onGameEnd={handleGameEnd} />
      )}
      <motion.div 
        className="mt-8 flex space-x-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center text-white">
          <Mic className="mr-2" />
          <span>Canta</span>
        </div>
        <div className="flex items-center text-white">
          <Music className="mr-2" />
          <span>Disfruta</span>
        </div>
        <div className="flex items-center text-white">
          <Trophy className="mr-2" />
          <span>Gana</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default App