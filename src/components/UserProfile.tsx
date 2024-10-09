import React from 'react'
import { User } from 'lucide-react'

interface UserProfileProps {
  user: {
    display_name: string
    images: { url: string }[]
  }
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex items-center bg-white rounded-full px-4 py-2 mb-4">
      {user.images && user.images[0] ? (
        <img src={user.images[0].url} alt={user.display_name} className="w-8 h-8 rounded-full mr-2" />
      ) : (
        <User className="w-8 h-8 mr-2" />
      )}
      <span className="font-semibold">{user.display_name}</span>
    </div>
  )
}

export default UserProfile