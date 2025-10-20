'use client'
import React from 'react';
import ServiceCardScroller from './ServiceCardScroller';

const BirthdayScroller: React.FC = () => {
  return (
    <ServiceCardScroller 
      serviceSlug="birthday"
      serviceTitle="Birthday Designs"
      gradientColors="from-blue-500 to-cyan-500"
    />
  );
};

export default BirthdayScroller;
