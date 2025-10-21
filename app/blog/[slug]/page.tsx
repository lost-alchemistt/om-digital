'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';

interface Blog {
  id: number;
  slug: string;
  title: string;
  description: string;
  featured_image: string;
  content: string;
  author_name: string;
  author_image: string;
  published_at: string;
  read_time: number;
  category: string;
  tags: string[];
  views: number;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        // Fetch the blog post
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('active', true)
          .single();

        if (blogError || !blogData) {
          notFound();
          return;
        }

        setBlog(blogData);

        // Increment view count
        await supabase
          .from('blogs')
          .update({ views: (blogData.views || 0) + 1 })
          .eq('id', blogData.id);

        // Fetch related blogs
        const { data: relatedData } = await supabase
          .from('blogs')
          .select('*')
          .eq('active', true)
          .eq('category', blogData.category)
          .neq('id', blogData.id)
          .limit(3);

        setRelatedBlogs(relatedData || []);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog?.title || '';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Blog not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src={blog.featured_image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/blog"
          className="absolute top-24 left-4 md:left-8 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="text-white" size={20} />
        </Link>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto max-w-4xl">
            {blog.category && (
              <span className="inline-block px-4 py-1 bg-purple-600 text-white rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>
            )}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              {blog.title}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
              <span className="flex items-center gap-2">
                <User size={16} />
                {blog.author_name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {formatDate(blog.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {blog.read_time} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Share Buttons */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Share2 size={18} />
            Share:
          </span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-sky-500 hover:text-white transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-blue-700 hover:text-white transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>

        {/* Blog Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-black dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:text-purple-600 dark:prose-a:text-purple-400
            prose-strong:text-black dark:prose-strong:text-white
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-48">
                      <Image
                        src={relatedBlog.featured_image}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-black dark:text-white mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {relatedBlog.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
