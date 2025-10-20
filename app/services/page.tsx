'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string;
  slug: string;
}

const AllServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('id', { ascending: true });

        if (error) {
          throw new Error('Failed to fetch services');
        }

        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Gradient colors for different services
  const gradientColors: Record<string, string> = {
    wedding: 'from-purple-500 to-pink-500',
    birthday: 'from-blue-500 to-cyan-500',
    anniversary: 'from-rose-500 to-red-500',
    baby: 'from-yellow-500 to-orange-500',
    corporate: 'from-gray-600 to-slate-700',
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen mt-12 py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our complete collection of digital invitation designs. Choose a category below to view all available designs.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-black dark:text-white">Loading services...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
              >
                <Link href={`/services/${service.slug}`}>
                  <motion.div
                    className="group relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 h-64 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[service.slug] || 'from-purple-500 to-pink-500'} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl" />
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between">
                      <div>
                        <motion.div
                          className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${gradientColors[service.slug] || 'from-purple-500 to-pink-500'} text-white text-sm font-medium mb-4`}
                        >
                          {service.slug.toUpperCase()}
                        </motion.div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                          {service.name}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {service.description || 'Beautiful and customizable invitation designs'}
                        </p>
                      </div>
                      
                      {/* View Button */}
                      <div className="flex items-center text-black dark:text-white group-hover:text-purple-500 transition-colors duration-300">
                        <span className="font-medium mr-2">View Designs</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ArrowRight size={20} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <motion.div
                      className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-2xl transition-all duration-300"
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-xl text-black dark:text-white mb-2">No services available</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are currently no services available. Please check back later.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AllServicesPage;
