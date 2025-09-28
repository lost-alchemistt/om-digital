'use client'
import React, { useState } from 'react';
import { Facebook, Instagram, MessageCircle, Share } from 'lucide-react';
import { motion } from 'framer-motion';

interface InvitationCardProps {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  id,
  title,
  imageUrl,
  videoUrl,
  originalPrice,
  discountedPrice,
  discountPercentage
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Extract YouTube ID for embedding
  const getYouTubeId = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regex = /(?:embed\/|v=|youtu\.btext-black dark:text-whitee\/|\/v\/|\/e\/|watch\?v=|shorts\/)([^#\&\?\s]*)/;
      const match = url.match(regex);
      return match && match[1] ? match[1] : '';
    }
    return url;
  };
  
  // Create YouTube embed URL with parameters
  const embedUrl = videoUrl ? 
    `${videoUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(videoUrl)}` : 
    '';
  
  // Fallback image in case the Supabase storage URL fails
  const fallbackImage = '/pdf/1/1.jpg';
  
  return (
    <motion.div 
      className="dark:bg-gray-800 bg-zinc-100 rounded-lg shadow-lg p-4 w-72 sm:w-80  flex-shrink-0 border border-gray-800/30"
      whileHover={{ 
        y: -5,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)"
      }}
    >
      {/* Header with ID */}
      <div className="bg-gray-800/50 text-black dark:text-white rounded-md px-3 py-1 text-xs font-medium mb-3 inline-block">
        {id}
      </div>
      
      {/* Title */}
      <h3 className="text-center text-sm font-medium text-black dark:text-white mb-3 uppercase tracking-wide">
        {title}
      </h3>
      
      {/* Phone mockup with invitation */}
      <motion.div 
        className="relative mx-auto mb-4"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div 
          className="bg-black rounded-2xl p-2 w-36 h-64 mx-auto shadow-lg"
          initial={{ rotateY: 0 }}
          whileHover={{ rotateY: 10 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="bg-white rounded-xl w-full h-full overflow-hidden relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered && videoUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full object-cover"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <motion.img 
                src={imageError ? fallbackImage : imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                onError={() => setImageError(true)}
              />
            )}
            
            {/* Overlay with play button when not hovered */}
            {!isHovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-black dark:text-white fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Social sharing section */}
      <div className="bg-yellow-100/10 rounded-md p-2 mb-4 backdrop-blur-sm">
        <p className="text-xs text-center text-black dark:text-white mb-2">Easily Send Via</p>
        <div className="flex justify-center space-x-4">
          <motion.div whileHover={{ scale: 1.2, color: "#1877F2" }}>
            <Facebook className="w-5 h-5 text-black dark:text-white dark:hover:text-blue-500 cursor-pointer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2, color: "#E4405F" }}>
            <Instagram className="w-5 h-5 text-black dark:text-white dark:hover:text-pink-500 cursor-pointer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2, color: "#25D366" }}>
            <MessageCircle className="w-5 h-5 text-black dark:text-white dark:hover:text-green-500 cursor-pointer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }}>
            <Share className="w-5 h-5 text-black dark:text-white dark:hover:text-black cursor-pointer" />
          </motion.div>
        </div>
      </div>
      
      {/* Pricing */}
      <div className="flex justify-center items-center space-x-2 mb-4">
        <span className="text-gray-400 line-through text-sm">₹{originalPrice}</span>
        <span className="text-green-400 font-bold text-lg">₹{discountedPrice}</span>
        <span className="text-green-500 text-xs bg-green-900/20 px-2 py-1 rounded-full">{discountPercentage}% off</span>
      </div>
      
      {/* Order button */}
      <motion.a 
        href={`https://wa.me/917600107620?text=Hi! I'm interested in ordering ${title} (${id})`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black dark:text-white font-medium py-2 px-4 rounded-full text-center transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex items-center justify-center gap-2 ">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          Order On WhatsApp
        </div>
      </motion.a>
    </motion.div>
  );
};

export default InvitationCard;