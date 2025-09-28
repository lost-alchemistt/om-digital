'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface WhatsAppFloatProps {
  phoneNumber: string;
  message?: string;
  companyName?: string;
  logoUrl?: string;
}

export default function WhatsAppFloat({ 
  phoneNumber, 
  message = "Hi! I need help with a video invite",
  companyName = "OM Digital",
  logoUrl = "/images/logo2.png" // Updated default path for the logo
}: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
      setCurrentTime(`${hours}:${minutesStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {/* WhatsApp Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src={logoUrl} 
                alt={companyName} 
                width={50}
                height={40}
                className="h-10 w-auto object-contain" // Adjusted for better logo display
              />
              <div className="ml-3 font-semibold">{companyName}</div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-gray-800 text-sm mb-2">
                👋 Hi there! We are available 24/7 to assist you. How can we help you today?
              </p>
              <div className="text-right text-xs text-gray-600 font-bold">
                {currentTime}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <MessageCircle className="mr-2" size={18} />
              Start Chat
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}
    </>
  );
}