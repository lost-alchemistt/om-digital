'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react';
import InvitationCard from '../Cards/ShowcaseCard';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAttemptedFetchRef = useRef(false);

  const fetchFeaturedCards = useCallback(async () => {
    if (hasAttemptedFetchRef.current) return;
    
    hasAttemptedFetchRef.current = true;
    const startTime = Date.now();
    
    try {
      const tableName = `${serviceSlug}_cards`;
      
      console.log(`[${serviceSlug}] Starting fetch at ${new Date().toISOString()}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      const duration = Date.now() - startTime;
      console.log(`[${serviceSlug}] Fetch completed in ${duration}ms`);

      if (error) {
        console.error(`[${serviceSlug}] Error:`, error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log(`[${serviceSlug}] Loaded ${data?.length || 0} cards`, data);

      if (data && data.length > 0) {
        setCardData(data);
        setLoading(false);
      } else {
        setError('No cards found');
        setLoading(false);
      }
    } catch (err) {
      console.error(`[${serviceSlug}] Failed:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cards';
      setError(errorMessage);
      setLoading(false);
    }
  }, [serviceSlug]);

  useEffect(() => {
    fetchFeaturedCards();
  }, [fetchFeaturedCards]);

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

  // Show error state with message
  if (!loading && error) {
    return (
      <div className="w-full py-8 dark:bg-gray-950 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-amber-500 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Unable to load {serviceTitle}. Table may not exist yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render at all if error or no cards AFTER loading completes
  if (!loading && (error || cardData.length === 0)) {
    console.log(`[${serviceSlug}] Not rendering - error: ${error}, cards: ${cardData.length}`);
    return null;
  }

  return (
    <div ref={sectionRef} className="w-full py-16 dark:bg-gray-950 bg-white">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
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
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>
          
          <motion.div
            variants={titleVariants}
            className="view-all mt-4 sm:mt-0"
          >
            <Link 
              href={`/services/${serviceSlug}`}
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
        
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 w-full gap-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading {serviceTitle}...
              </p>
            </div>
          ) : cardData.length > 0 ? (
            <motion.div 
              className="flex overflow-x-auto lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {cardData.map((card, index) => (
                <motion.div
                  key={card.card_id}
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
                  className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-center"
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
            </motion.div>
          ) : null}
        </div>
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
