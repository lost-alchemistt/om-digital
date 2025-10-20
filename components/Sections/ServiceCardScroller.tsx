'use client'
import React, { useEffect, useState } from 'react';
import InvitationCard from '../Cards/ShowcaseCard';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Card {
  id: number;
  card_id: string;
  title: string;
  image_url: string;
  video_url: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
}

interface ServiceCardScrollerProps {
  serviceSlug: string;
  serviceTitle: string;
  gradientColors?: string;
}

const ServiceCardScroller: React.FC<ServiceCardScrollerProps> = ({
  serviceSlug,
  serviceTitle,
  gradientColors = 'from-purple-500 to-pink-500'
}) => {
  const [cardData, setCardData] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedCards() {
      try {
        const tableName = `${serviceSlug}_cards`;
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error(`Error fetching ${serviceSlug} cards:`, error);
          return;
        }

        if (data) {
          setCardData(data);
        }
      } catch (err) {
        console.error(`Failed to fetch ${serviceSlug} cards:`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedCards();
  }, [serviceSlug]);

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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <motion.div variants={titleVariants} className="relative">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-black">
              {serviceTitle}
            </h2>
            <motion.div 
              className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r ${gradientColors} w-full`}
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
              href={`services/${serviceSlug}`}
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
        
        <motion.div 
          className="relative"
          variants={containerVariants}
        >
          <div className="overflow-x-auto scrollbar-hide py-4">
            {loading ? (
              <div className="flex justify-center items-center h-64 w-full">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            ) : (
              <div className="xl:inline-grid xl:grid-cols-4 xl:px-20 xl:gap-6 flex space-x-6 px-1">
                {cardData.map((card, index) => (
                  <motion.div
                    key={`${card.card_id}-${index}`}
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
                      id={card.card_id}
                      title={card.title}
                      imageUrl={card.image_url}
                      videoUrl={card.video_url}
                      originalPrice={card.original_price}
                      discountedPrice={card.discounted_price}
                      discountPercentage={card.discount_percentage}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
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

export default ServiceCardScroller;
