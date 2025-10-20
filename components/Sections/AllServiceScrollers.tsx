'use client'
import React, { useEffect, useState } from 'react';
import ServiceCardScroller from './ServiceCardScroller';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  slug: string;
  active: boolean;
}

// Gradient color mapping for different services
const gradientColors: Record<string, string> = {
  wedding: 'from-purple-500 to-pink-500',
  birthday: 'from-blue-500 to-cyan-500',
  anniversary: 'from-rose-500 to-red-500',
  baby: 'from-yellow-500 to-orange-500',
  corporate: 'from-gray-600 to-slate-700',
  // Add more service-specific gradients as needed
};

const AllServiceScrollers: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, slug, active')
          .eq('active', true)
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        if (data) {
          setServices(data);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {services.map((service) => (
        <ServiceCardScroller
          key={service.id}
          serviceSlug={service.slug}
          serviceTitle={service.name}
          gradientColors={gradientColors[service.slug] || 'from-purple-500 to-pink-500'}
        />
      ))}
    </div>
  );
};

export default AllServiceScrollers;
