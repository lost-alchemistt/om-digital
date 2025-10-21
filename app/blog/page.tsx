'use client'

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: number;
  slug: string;
  title: string;
  description: string;
  featured_image: string;
  author_name: string;
  author_image: string;
  published_at: string;
  read_time: number;
  category: string;
  tags: string[];
  featured: boolean;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('active', true)
          .order('published_at', { ascending: false });

        if (error) {
          throw new Error('Failed to fetch blogs');
        }

        setBlogs(data || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const categories = ['All', ...Array.from(new Set(blogs.map(blog => blog.category).filter(Boolean)))];
  
  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const featuredBlog = blogs.find(blog => blog.featured);

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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen mt-12 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tips, trends, and inspiration for your special moments
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-black dark:text-white">Loading blogs...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Featured Blog */}
            {featuredBlog && selectedCategory === 'All' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <Link href={`/blog/${featuredBlog.slug}`}>
                  <div className="group relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 h-[500px]">
                    <Image
                      src={featuredBlog.featured_image}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <span className="inline-block px-4 py-1 bg-purple-600 rounded-full text-sm font-medium mb-4">
                        Featured
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-gray-200 mb-4 line-clamp-2">
                        {featuredBlog.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-2">
                          <User size={16} />
                          {featuredBlog.author_name}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={16} />
                          {formatDate(featuredBlog.published_at)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock size={16} />
                          {featuredBlog.read_time} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Blog Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs.filter(blog => !blog.featured || selectedCategory !== 'All').map((blog) => (
                <motion.div key={blog.id} variants={cardVariants}>
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.featured_image}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {blog.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                            {blog.category}
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                          {blog.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="flex items-center gap-2">
                            <Clock size={14} />
                            {blog.read_time} min
                          </span>
                          <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all">
                            Read More
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="text-xl text-black dark:text-white mb-2">No blogs found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  There are currently no blogs in this category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
