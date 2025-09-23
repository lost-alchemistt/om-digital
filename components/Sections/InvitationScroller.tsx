'use client'
import React from 'react';
import InvitationCard from '../Cards/InvitationCard';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const InvitationScroller: React.FC = () => {
  // Real YouTube short IDs from provided links
  const youtubeShorts = [
    'qn6QaXzvFcQ',
    'knmzNWlzGg8',
    '0IUFkh5saF4',
    'n2DLaZVhb2o',
    'KMb9ReBrgIc'
  ];

  // Sample data for the cards using your PDF folder images
  const invitationData = [
    {
      id: 'AI-1372',
      title: 'MAYRA CEREMONY ',
      imageUrl: '/pdf/1/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[0]}`,
      originalPrice: 799,
      discountedPrice: 399,
      discountPercentage: 50
    },
    {
      id: 'AI-1373',
      title: 'WEDDING CEREMONY ',
      imageUrl: '/pdf/2/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[1]}`,
      originalPrice: 799,
      discountedPrice: 399,
      discountPercentage: 50
    },
    {
      id: 'AI-1374',
      title: 'ENGAGEMENT CEREMONY ',
      imageUrl: '/pdf/3/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[2]}`,
      originalPrice: 799,
      discountedPrice: 399,
      discountPercentage: 50
    },
    {
      id: 'AI-1375',
      title: 'RECEPTION CEREMONY ',
      imageUrl: '/pdf/4/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[3]}`,
      originalPrice: 799,
      discountedPrice: 399,
      discountPercentage: 50
    },
    {
      id: 'AI-1376',
      title: 'HALDI CEREMONY ',
      imageUrl: '/pdf/5/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[4]}`,
      originalPrice: 899,
      discountedPrice: 449,
      discountPercentage: 50
    },
    {
      id: 'AI-1377',
      title: 'MEHENDI CEREMONY ',
      imageUrl: '/pdf/6/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[0]}`, // Using first YouTube short again
      originalPrice: 699,
      discountedPrice: 349,
      discountPercentage: 50
    },
    {
      id: 'AI-1378',
      title: 'SANGAM CEREMONY ',
      imageUrl: '/pdf/7/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[1]}`, // Using second YouTube short again
      originalPrice: 799,
      discountedPrice: 399,
      discountPercentage: 50
    },
    {
      id: 'AI-1379',
      title: 'RING CEREMONY ',
      imageUrl: '/pdf/8/1.jpg',
      videoUrl: `https://www.youtube.com/embed/${youtubeShorts[2]}`, // Using third YouTube short again
      originalPrice: 849,
      discountedPrice: 424,
      discountPercentage: 50
    }
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" as const
      } 
    }
  };

  return (
    <div className="w-full py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <motion.div variants={titleVariants} className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Wedding Invitation Cards
            </h2>
            <motion.div 
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 w-full"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>
          
          <motion.div
            variants={titleVariants}
            className="view-all mt-4 sm:mt-0"
          >
            <Link 
              href="/wedding" 
              className="text-white hover:text-purple-300 transition-colors duration-300 flex items-center gap-2 group"
            >
              <span>View All</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
        
        {/* Cards Scroller */}
        <motion.div 
          className="relative"
          variants={containerVariants}
        >
          {/* Gradient Overlays for scroll indication */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
          
          {/* Scrollable Cards */}
          <div className="overflow-x-auto scrollbar-hide py-4">
            <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
              {invitationData.map((invitation, index) => (
                <motion.div
                  key={`${invitation.id}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.5,
                        delay: index * 0.1
                      }
                    }
                  }}
                >
                  <InvitationCard
                    id={invitation.id}
                    title={invitation.title}
                    imageUrl={invitation.imageUrl}
                    videoUrl={invitation.videoUrl}
                    originalPrice={invitation.originalPrice}
                    discountedPrice={invitation.discountedPrice}
                    discountPercentage={invitation.discountPercentage}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          className="mt-10 text-center"
          variants={titleVariants}
        >
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Explore our stunning collection of digital invitations for all occasions. Customize your perfect invitation today!
          </p>
          <Link href="/contact" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-6 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105">
            Create Your Custom Invitation
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default InvitationScroller;