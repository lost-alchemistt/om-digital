'use client'
import React from 'react'
import { DraggableCardDemo } from './draggable-card-demo'
import { HeroParallax } from '../ui/hero-parallax'

const LandingPage = () => {
  const products = [
    // Folder 1 - 4 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/1/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/1/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/1/3.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/1/4.jpg"
    },
    // Folder 2 - 4 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/2/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/2/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/2/3.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/2/4.jpg"
    },
    // Folder 3 - 2 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/3/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/3/2.jpg"
    },
    // Folder 4 - 3 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/4/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/4/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/4/3.jpg"
    },
    // Folder 5 - 3 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/5/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/5/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/5/3.jpg"
    },
    // Folder 6 - 3 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/6/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/6/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/6/3.jpg"
    },
    // Folder 7 - 2 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/7/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/7/2.jpg"
    },
    // Folder 8 - 2 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/8/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/8/2.jpg"
    },
    // Folder 9 - 3 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/9/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/9/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/9/3.jpg"
    },
    // Folder 10 - 3 images
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/10/1.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/10/2.jpg"
    },
    {
      title: "",
      link: "/services",
      thumbnail: "/pdf/10/3.jpg"
    }
  ];

  return (
    <div>
      <HeroParallax products={products} />
      <DraggableCardDemo />
    </div>
  );
};

export default LandingPage;
