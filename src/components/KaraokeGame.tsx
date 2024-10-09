import React, { useState, useEffect, useRef } from 'react'
import { Mic, VolumeX, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface KaraokeGameProps {
  playlist: {
    id: string
    name: string
  }
  onGameEnd: (score: number) => void
}

const KaraokeGame: React.FC<KaraokeGameProps> = ({ playlist, onGameEnd }) => {
  const [currentSong, setCurrentSong] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [volume, setVolume] = useState(0)

  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null)

  useEffect(() => {
    // Simular la obtención de una canción de la playlist
    setCurrentSong('Canción de ejemplo')

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleStopRecording()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [playlist])

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContext.current = new AudioContext()
      analyser.current = audioContext.current.createAnalyser()
      microphone.current = audioContext.current.createMediaStreamSource(stream)
      microphone.current.connect(analyser.current)

      setIsRecording(true)
      analyseAudio()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    if (microphone.current) {
      microphone.current.disconnect()
    }
    if (audioContext.current) {
      audioContext.current.close()
    }
    onGameEnd(score)
  }

  const analyseAudio = () => {
    if (!analyser.current) return

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount)
    const updateScore = () => {
      analyser.current!.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      setVolume(average)

      // Simple scoring based on volume and difficulty
      const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2
      setScore((prevScore) => prevScore + Math.round(average * difficultyMultiplier / 100))

      if (isRecording) {
        requestAnimationFrame(updateScore)
      }
    }
    updateScore()
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-2xl font-bold mb-4">¡A cantar!</h2>
      <p className="text-xl mb-4">Canción actual: {currentSong}</p>
      <p className="text-lg mb-4">Tiempo restante: {timeLeft} segundos</p>
      <p className="text-lg mb-4">Puntuación: {score}</p>
      <div className="mb-4">
        <label htmlFor="difficulty" className="mr-2">Dificultad:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border rounded p-1"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Media</option>
          <option value="hard">Difícil</option>
        </select>
      </div>
      <button
        className={`bg-${isRecording ? 'red' : 'blue'}-500 hover:bg-${
          isRecording ? 'red' : 'blue'
        }-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        <Mic className="mr-2" />
        {isRecording ? 'Detener grabación' : 'Comenzar a cantar'}
      </button>
      <div className="flex items-center justify-center">
        <VolumeX className="mr-2" />
        <div className="w-64 h-4 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${volume / 2.55}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${volume / 2.55}%` }}
          />
        </div>
        <Volume2 className="ml-2" />
      </div>
    </motion.div>
  )
}

export default KaraokeGame