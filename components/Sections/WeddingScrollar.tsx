'use client'
import React, { useEffect, useState } from 'react';
import InvitationCard from '../Cards/ShowcaseCard';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface WeddingCard {
  id: number;
  card_id: string;
  title: string;
  image_url: string;
  video_url: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
}

const InvitationScroller: React.FC = () => {
  const [invitationData, setInvitationData] = useState<WeddingCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedCards() {
      try {
        // Fetch wedding cards marked as featured or just get the latest 4
        const { data, error } = await supabase
          .from('wedding_cards')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Error fetching wedding cards:', error);
          return;
        }

        if (data) {
          setInvitationData(data);
        }
      } catch (err) {
        console.error('Failed to fetch wedding cards:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedCards();
  }, []);

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
    <div className="w-full py-16 dark:bg-gray-950 bg-white">
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
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-black">
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
              href="services/wedding" 
              className="dark:text-white text-black hover:text-purple-300 transition-colors duration-300 flex items-center gap-2 group"
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
          {/* Scrollable Cards */}
          <div className="overflow-x-auto scrollbar-hide py-4">
            {loading ? (
              <div className="flex justify-center items-center h-64 w-full">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            ) : (
              <div className="xl:inline-grid xl:grid-cols-4 xl:px-20 xl:gap-6 flex space-x-6 px-1">
                {invitationData.map((invitation, index) => (
                  <motion.div
                    key={`${invitation.card_id}-${index}`}
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
                      id={invitation.card_id}
                      title={invitation.title}
                      imageUrl={invitation.image_url}
                      videoUrl={invitation.video_url}
                      originalPrice={invitation.original_price}
                      discountedPrice={invitation.discounted_price}
                      discountPercentage={invitation.discount_percentage}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
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