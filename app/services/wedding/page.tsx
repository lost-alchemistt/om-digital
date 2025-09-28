'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import InvitationCard from '@/components/Cards/ShowcaseCard';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface WeddingCard {
  id: number;
  card_id: string;
  title: string;
  image_url: string;
  video_url: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  created_at: string;
}

const WeddingCardsPage = () => {
  const [weddingCards, setWeddingCards] = useState<WeddingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeddingCards() {
      try {
        // Fetch all wedding cards from the database
        const { data, error } = await supabase
          .from('wedding_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error('Failed to fetch wedding cards');
        }

        setWeddingCards(data || []);
      } catch (err) {
        console.error('Error fetching wedding cards:', err);
        setError('Failed to load wedding cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchWeddingCards();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen mt-12 py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Wedding Invitation Cards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our complete collection of beautiful and customizable wedding invitation cards.
            Each design can be personalized for your special day.
          </p>
        </motion.div>

        {/* Cards Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-black dark:text-white">Loading cards...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {weddingCards.map((card) => (
              <motion.div key={card.id} variants={cardVariants}>
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
        )}

        {/* Empty state */}
        {!loading && !error && weddingCards.length === 0 && (
          <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-xl text-black dark:text-white mb-2">No cards available</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are currently no wedding invitation cards in the database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingCardsPage;
