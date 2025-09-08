'use client'
import React from 'react'
import { DraggableCardDemo } from './draggable-card-demo'
import { HeroParallax } from '../ui/hero-parallax'

const LandingPage = () => {
  const products = [
    {
      title: "Moonbeam",
      link: "/projects/moonbeam",
      thumbnail: "/images/projects/moonbeam.jpg"
    },
    {
      title: "Horizon",
      link: "/projects/horizon",
      thumbnail: "/images/projects/horizon.jpg"
    },
    {
      title: "Genesis",
      link: "/projects/genesis",
      thumbnail: "/images/projects/genesis.jpg"
    },
    {
      title: "Quantum",
      link: "/projects/quantum",
      thumbnail: "/images/projects/quantum.jpg"
    },
    {
      title: "Nebula",
      link: "/projects/nebula",
      thumbnail: "/images/projects/nebula.jpg"
    },
    {
      title: "Cosmos",
      link: "/projects/cosmos",
      thumbnail: "/images/projects/cosmos.jpg"
    },
    {
      title: "Infinity",
      link: "/projects/infinity",
      thumbnail: "/images/projects/infinity.jpg"
    },
    {
      title: "Matrix",
      link: "/projects/matrix",
      thumbnail: "/images/projects/matrix.jpg"
    },
    {
      title: "Prism",
      link: "/projects/prism",
      thumbnail: "/images/projects/prism.jpg"
    },
    {
      title: "Eclipse",
      link: "/projects/eclipse",
      thumbnail: "/images/projects/eclipse.jpg"
    },
    {
      title: "Stellar",
      link: "/projects/stellar",
      thumbnail: "/images/projects/stellar.jpg"
    },
    {
      title: "Nexus",
      link: "/projects/nexus",
      thumbnail: "/images/projects/nexus.jpg"
    },
    {
      title: "Zenith",
      link: "/projects/zenith",
      thumbnail: "/images/projects/zenith.jpg"
    },
    {
      title: "Spectrum",
      link: "/projects/spectrum",
      thumbnail: "/images/projects/spectrum.jpg"
    },
    {
      title: "Catalyst",
      link: "/projects/catalyst",
      thumbnail: "/images/projects/catalyst.jpg"
    },
    {
      title: "Aurora",
      link: "/projects/aurora",
      thumbnail: "/images/projects/aurora.jpg"
    },
    {
      title: "Pulse",
      link: "/projects/pulse",
      thumbnail: "/images/projects/pulse.jpg"
    },
    {
      title: "Fusion",
      link: "/projects/fusion",
      thumbnail: "/images/projects/fusion.jpg"
    },
    {
      title: "Vertex",
      link: "/projects/vertex",
      thumbnail: "/images/projects/vertex.jpg"
    },
    {
      title: "Nova",
      link: "/projects/nova",
      thumbnail: "/images/projects/nova.jpg"
    },
    {
      title: "Synthesis",
      link: "/projects/synthesis",
      thumbnail: "/images/projects/synthesis.jpg"
    },
    {
      title: "Parallel",
      link: "/projects/parallel",
      thumbnail: "/images/projects/parallel.jpg"
    },
    {
      title: "Element",
      link: "/projects/element",
      thumbnail: "/images/projects/element.jpg"
    },
    {
      title: "Circuit",
      link: "/projects/circuit",
      thumbnail: "/images/projects/circuit.jpg"
    }
    ,
    {
      title: "Nova",
      link: "/projects/nova",
      thumbnail: "/images/projects/nova.jpg"
    },
    {
      title: "Synthesis",
      link: "/projects/synthesis",
      thumbnail: "/images/projects/synthesis.jpg"
    },
    {
      title: "Parallel",
      link: "/projects/parallel",
      thumbnail: "/images/projects/parallel.jpg"
    },
    {
      title: "Element",
      link: "/projects/element",
      thumbnail: "/images/projects/element.jpg"
    },
    {
      title: "Circuit",
      link: "/projects/circuit",
      thumbnail: "/images/projects/circuit.jpg"
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
