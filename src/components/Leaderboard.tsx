import React from 'react'
import { Trophy } from 'lucide-react'

interface LeaderboardProps {
  scores: number[]
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const sortedScores = [...scores].sort((a, b) => b - a)

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Trophy className="mr-2" />
        Tabla de puntuaciones
      </h2>
      <ul>
        {sortedScores.map((score, index) => (
          <li key={index} className="mb-2">
            <span className="font-bold">{index + 1}.</span> {score} puntos
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Leaderboard