"use client";
import React from "react";
import AllServiceScrollers from "../Sections/AllServiceScrollers";
import WhatsAppFloat from "../ui/whatsapp-float";
import Orb from "./Orb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="h-full">
      <div className="md:h-[60px]"></div>
      <div className="w-full min-h-[600px] relative flex items-center justify-center">
        {/* Orb Background */}
        <div className="absolute inset-0 z-0">
          <Orb
            hoverIntensity={6}
            rotateOnHover={true}
            hue={360}
            forceHoverState={false}
          />
        </div>

        {/* Text Content Overlay - pointer-events-none allows mouse events to pass through */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 pointer-events-none">
          <div className="md:h-[60px] h-[80px]"></div>
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
            Om
            <br />
            Digital
            <br />
          </h1>

          {/* Buttons - re-enable pointer events for interactive elements */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 pointer-events-auto">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-white/95 text-black hover:bg-white font-semibold px-10 py-6 text-base rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                Explore Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-10 py-6 text-base rounded-full backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <AllServiceScrollers />
      <WhatsAppFloat
        phoneNumber="917600107620"
        message="Hi! I need help with a video invite"
        companyName="Omdigital"
        logoUrl="/images/logo2.png"
      />
    </div>
  );
};

export default LandingPage;
