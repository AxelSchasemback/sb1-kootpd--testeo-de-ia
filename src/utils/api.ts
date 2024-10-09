import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

export const saveScore = async (userId: string, score: number) => {
  try {
    const response = await axios.post(`${API_URL}/scores`, { userId, score })
    return response.data
  } catch (error) {
    console.error('Error saving score:', error)
  }
}

export const getTopScores = async () => {
  try {
    const response = await axios.get(`${API_URL}/scores/top`)
    return response.data
  } catch (error) {
    console.error('Error fetching top scores:', error)
  }
}