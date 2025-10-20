'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import InvitationCard from '@/components/Cards/ShowcaseCard';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Card {
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

interface Service {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServiceAndCards() {
      try {
        // First, fetch the service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('slug', params.slug)
          .eq('active', true)
          .single();

        if (serviceError || !serviceData) {
          notFound();
          return;
        }

        setService(serviceData);

        // Then fetch all cards for this service
        const tableName = `${params.slug}_cards`;
        const { data: cardsData, error: cardsError } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (cardsError) {
          throw new Error(`Failed to fetch ${params.slug} cards`);
        }

        setCards(cardsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchServiceAndCards();
  }, [params.slug]);

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            {service?.name || 'Loading...'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {service?.description || 'Browse our complete collection of beautiful and customizable designs.'}
          </p>
        </motion.div>

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
            {cards.map((card) => (
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

        {!loading && !error && cards.length === 0 && (
          <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-xl text-black dark:text-white mb-2">No cards available</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are currently no cards in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
