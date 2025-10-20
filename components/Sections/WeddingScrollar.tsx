'use client'
import React from 'react';
import ServiceCardScroller from './ServiceCardScroller';

const InvitationScroller: React.FC = () => {
  return (
    <ServiceCardScroller 
      serviceSlug="wedding"
      serviceTitle="Wedding Designs"
      gradientColors="from-purple-500 to-pink-500"
    />
  );
};

export default InvitationScroller;