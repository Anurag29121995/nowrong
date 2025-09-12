'use client'

interface AvatarProps {
  avatar?: string
  gender?: string
  username?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showOnlineIndicator?: boolean
  isOnline?: boolean
  className?: string
}

export default function Avatar({ 
  avatar, 
  gender, 
  username, 
  size = 'md', 
  showOnlineIndicator = false,
  isOnline = false,
  className = '' 
}: AvatarProps) {
  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  }
  
  const onlineIndicatorSizes = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }

  // Determine what to display
  const getDisplayContent = () => {
    if (avatar) {
      return avatar
    }
    
    if (username) {
      return username.charAt(0).toUpperCase()
    }
    
    return gender === 'male' ? 'M' : 'W'
  }

  // Get background color based on avatar or gender
  const getBackgroundClass = () => {
    if (avatar) {
      return avatar.startsWith('M') 
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
        : 'bg-gradient-to-br from-pink-500 to-rose-600'
    }
    
    return gender === 'female'
      ? 'bg-gradient-to-br from-pink-500 to-rose-600'
      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }

  return (
    <div className="relative">
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        ${getBackgroundClass()}
        ${className}
      `}>
        {getDisplayContent()}
      </div>
      
      {showOnlineIndicator && isOnline && (
        <div className={`
          absolute 
          -bottom-1 
          -right-1 
          ${onlineIndicatorSizes[size]}
          bg-emerald-400 
          border-2 
          border-black 
          rounded-full 
          animate-pulse
        `}></div>
      )}
    </div>
  )
}