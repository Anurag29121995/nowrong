'use client'

import { motion } from 'framer-motion'

interface ProfileData {
  username: string
  age: number
  gender: 'male' | 'female'
  secret?: string
  showSecret?: boolean
  bodyTypePreference?: string // Single body type selection
  location?: string
  bodyCount?: number
  moments?: string[] // URLs to uploaded images
}

interface ProfileViewerProps {
  profile: ProfileData
  onBack: () => void
}

export default function ProfileViewer({ profile, onBack }: ProfileViewerProps) {
  const getBodyTypeDisplay = (preference: string) => {
    const bodyTypeMap: { [key: string]: { name: string, description: string } } = {
      // Female body types (for male viewers)
      'petite': { name: 'Petite & Slim', description: 'Skinny, tight, small' },
      'curvy': { name: 'Thick & Curvy', description: 'Voluptuous hourglass' },
      'bbw': { name: 'BBW Goddess', description: 'Big, beautiful, soft' },
      'athletic': { name: 'Fit & Toned', description: 'Strong, defined' },
      'milf': { name: 'MILF Appeal', description: 'Mature, experienced' },
      'busty': { name: 'Big Boobs', description: 'Large breasts, sexy' },
      // Male body types (for female viewers)
      'muscular': { name: 'Muscular & Ripped', description: 'Strong, defined' },
      'tall_lean': { name: 'Tall & Lean', description: 'Height, slim' },
      'dad_bod': { name: 'Dad Bod', description: 'Soft, comfortable' },
      'bearded': { name: 'Bearded & Rugged', description: 'Masculine, facial hair' },
      'young_fit': { name: 'Young & Fit', description: 'Youthful, energetic' },
      'big_package': { name: 'Well Endowed', description: 'Impressive size' },
      // Legacy types
      'slim': { name: 'Thin & Tight', description: 'Skinny, lean' },
      'twink': { name: 'Twink Body', description: 'Young, smooth' }
    }
    return bodyTypeMap[preference] || { name: preference, description: 'Attractive' }
  }

  // Function to determine which gender figures to show based on user's interest
  const getPreferredGender = () => {
    const femaleTypes = ['petite', 'curvy', 'bbw', 'athletic', 'milf', 'busty']
    const maleTypes = ['muscular', 'tall_lean', 'dad_bod', 'bearded', 'young_fit', 'big_package']
    
    if (profile.bodyTypePreference && femaleTypes.includes(profile.bodyTypePreference)) {
      return 'female'
    } else if (profile.bodyTypePreference && maleTypes.includes(profile.bodyTypePreference)) {
      return 'male'
    }
    // Default fallback
    return profile.gender === 'female' ? 'male' : 'female'
  }

  // Generate body count figures
  const generateBodyCountFigures = () => {
    if (!profile.bodyCount) return []
    const count = profile.bodyCount > 12 ? 12 : profile.bodyCount
    const preferredGender = getPreferredGender()
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      gender: preferredGender
    }))
  }

  const bodyCountFigures = generateBodyCountFigures()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      <div className="relative z-10 min-h-screen p-4">
        {/* Header - Compact */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </motion.button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-pink-300 text-xs font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Main Profile Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-glass-medium backdrop-blur-xl border border-gray-600/50 rounded-2xl overflow-hidden"
        >
          
          {/* Profile Header - Compact */}
          <div className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-600/5 border-b border-gray-600/30">
            <div className="flex items-center space-x-4">
              
              {/* Avatar - Smaller */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 ${
                  profile.gender === 'female' 
                    ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400/50' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400/50'
                }`}>
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                {/* Online indicator - smaller */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full"></div>
              </div>
              
              {/* Basic Info - Compact */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white mb-1">{profile.username}</h1>
                
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-xs ${
                    profile.gender === 'female'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    <span>{profile.gender === 'female' ? '♀' : '♂'} {profile.age}y</span>
                  </div>
                </div>

                {profile.location && (
                  <div className="flex items-center text-gray-400">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content - Proper Layout */}
          <div className="p-4">
            <div className="space-y-5">
              
              {/* Body Count - Proper Structure */}
              {profile.bodyCount !== undefined && (
                <motion.div 
                  className="bg-glass-light border border-pink-500/30 rounded-xl p-5"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">Body Count</h3>
                      <p className="text-gray-400 text-sm">Sexual partners experienced</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-pink-400">
                      {profile.bodyCount === 20 ? '20+' : profile.bodyCount}
                    </div>
                    
                    {/* Large Figure display */}
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[60%]">
                      {bodyCountFigures.slice(0, 12).map((figure) => (
                        <div key={figure.id}>
                          {figure.gender === 'female' ? (
                            <svg className="w-6 h-8 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2c-1.5 0-2.5 1-2.5 2.5S11 7.5 12 7.5s2.5-1.5 2.5-2.5S13.5 2 12 2zM12 9c-1.8 0-3.2 1.2-3.2 3v6c0 1.8 1.4 3.2 3.2 3.2s3.2-1.4 3.2-3.2v-6c0-1.8-1.4-3-3.2-3z"/>
                              <ellipse cx="9" cy="14" rx="2" ry="3"/>
                              <ellipse cx="15" cy="14" rx="2" ry="3"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2c-1.5 0-2.5 1-2.5 2.5S11 7.5 12 7.5s2.5-1.5 2.5-2.5S13.5 2 12 2zM12 9c-1.8 0-3 1.2-3 3v6c0 1.8 1.2 3 3 3s3-1.2 3-3v-6c0-1.8-1.2-3-3-3z"/>
                            </svg>
                          )}
                        </div>
                      ))}
                      {profile.bodyCount > 12 && (
                        <div className="text-pink-400 font-bold text-sm ml-2">+{profile.bodyCount - 12}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Drooling Over - Proper Structure */}
              {profile.bodyTypePreference && (
                <motion.div 
                  className="bg-glass-light border border-pink-500/30 rounded-xl p-5"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">Drooling Over</h3>
                      <p className="text-gray-400 text-sm">What turns them on most</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Body type SVG icon */}
                      <div className="w-12 h-12">
                        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
                          <defs>
                            <linearGradient id="bodyTypeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899"/>
                              <stop offset="100%" stopColor="#be185d"/>
                            </linearGradient>
                          </defs>
                          {profile.bodyTypePreference === 'curvy' && (
                            <>
                              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="38" rx="14" ry="16" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="42" cy="35" rx="6" ry="7" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="58" cy="35" rx="6" ry="7" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="55" rx="8" ry="10" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="75" rx="16" ry="18" fill="url(#bodyTypeGrad)"/>
                            </>
                          )}
                          {profile.bodyTypePreference === 'petite' && (
                            <>
                              <ellipse cx="50" cy="18" rx="6" ry="8" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="35" rx="8" ry="12" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="45" cy="32" rx="3" ry="4" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="55" cy="32" rx="3" ry="4" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="50" rx="6" ry="8" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="68" rx="9" ry="15" fill="url(#bodyTypeGrad)"/>
                            </>
                          )}
                          {profile.bodyTypePreference === 'muscular' && (
                            <>
                              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#bodyTypeGrad)"/>
                              <rect x="40" y="28" width="20" height="18" rx="3" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="42" cy="32" rx="6" ry="4" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="58" cy="32" rx="6" ry="4" fill="url(#bodyTypeGrad)"/>
                              <rect x="44" y="50" width="12" height="16" rx="2" fill="url(#bodyTypeGrad)"/>
                              <rect x="40" y="70" width="20" height="20" rx="3" fill="url(#bodyTypeGrad)"/>
                            </>
                          )}
                          {(!['curvy', 'petite', 'muscular'].includes(profile.bodyTypePreference)) && (
                            <>
                              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="40" rx="12" ry="15" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="60" rx="8" ry="10" fill="url(#bodyTypeGrad)"/>
                              <ellipse cx="50" cy="80" rx="13" ry="16" fill="url(#bodyTypeGrad)"/>
                            </>
                          )}
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium text-lg">
                          {getBodyTypeDisplay(profile.bodyTypePreference).name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {getBodyTypeDisplay(profile.bodyTypePreference).description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg text-sm font-medium">
                      Preferred
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sneak Peek - Proper Structure */}
              <motion.div 
                className="bg-glass-light border border-pink-500/30 rounded-xl p-5"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Sneak Peek</h3>
                    <p className="text-gray-400 text-sm">
                      {profile.moments && profile.moments.length > 0 
                        ? `${profile.moments.length} intimate photo${profile.moments.length > 1 ? 's' : ''}`
                        : 'No photos shared yet'
                      }
                    </p>
                  </div>
                </div>
                
                {profile.moments && profile.moments.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {profile.moments.slice(0, 3).map((moment, index) => (
                      <motion.div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-rose-500/10"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={moment}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                    {Array.from({ length: 3 - (profile.moments?.length || 0) }).map((_, index) => (
                      <div 
                        key={`empty-${index}`}
                        className="aspect-square rounded-xl border-2 border-dashed border-pink-500/30 bg-pink-500/5 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-pink-500/40" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((index) => (
                      <div 
                        key={index}
                        className="aspect-square rounded-xl border-2 border-dashed border-pink-500/30 bg-pink-500/5 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-pink-500/40" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Secret Section - Compact Full Width */}
            {profile.secret && profile.showSecret && (
              <motion.div 
                className="bg-gradient-to-br from-rose-500/10 to-pink-600/5 border border-rose-500/30 rounded-xl p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold">Secret Confession</h3>
                  <span className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-medium border border-rose-500/30">
                    PRIVATE
                  </span>
                </div>
                <p className="text-gray-300 text-center italic leading-relaxed text-sm">
                  "{profile.secret}"
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer - Minimal */}
          <div className="px-4 pb-3 border-t border-gray-600/30">
            <div className="text-center p-2 bg-glass-light/30 rounded-lg mt-3">
              <p className="text-gray-400 text-xs flex items-center justify-center space-x-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Private & secure</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}