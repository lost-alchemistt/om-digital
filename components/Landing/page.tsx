"use client";
import React from "react";
import AllServiceScrollers from "../Sections/AllServiceScrollers";
import WhatsAppFloat from "../ui/whatsapp-float";

const LandingPage = () => {
  return (
    <div>
      <AllServiceScrollers />

      <WhatsAppFloat
        phoneNumber="917600107620"
        message="Hi! I need help with a video invite"
        companyName="Omdigital"
        logoUrl="/images/logo.png"
      />
    </div>
  );
};

export default LandingPage;
