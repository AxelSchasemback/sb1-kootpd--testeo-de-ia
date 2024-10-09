import React from 'react'

interface Playlist {
  id: string
  name: string
  images: { url: string }[]
}

interface PlaylistSelectorProps {
  playlists: Playlist[]
  onSelect: (playlist: Playlist) => void
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ playlists, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Selecciona una playlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onSelect(playlist)}
          >
            <img
              src={playlist.images[0]?.url || 'https://via.placeholder.com/64'}
              alt={playlist.name}
              className="w-16 h-16 mx-auto mb-2 rounded"
            />
            <p className="text-center font-semibold">{playlist.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaylistSelector