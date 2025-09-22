'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <motion.div 
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-xl font-bold">OM Digital</h3>
            <p className="text-gray-400">Transforming ideas into digital reality with innovative solutions.</p>
            <motion.div variants={staggerChildren} className="flex space-x-4">
              <motion.a variants={fadeInUp} href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={20} />
              </motion.a>
              <motion.a variants={fadeInUp} href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </motion.a>
              <motion.a variants={fadeInUp} href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </motion.a>
              <motion.a variants={fadeInUp} href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin size={20} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <motion.li variants={fadeInUp}>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <motion.li variants={fadeInUp}>
                <Link href="/services/web-development" className="text-gray-400 hover:text-white transition-colors">Web Development</Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/services/mobile-apps" className="text-gray-400 hover:text-white transition-colors">Mobile Applications</Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/services/ui-ux" className="text-gray-400 hover:text-white transition-colors">UI/UX Design</Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/services/consulting" className="text-gray-400 hover:text-white transition-colors">Digital Consulting</Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p>123 Innovation Street</p>
              <p>Tech Valley, CA 92123</p>
              <p className="mt-3">Email: info@omdigital.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </motion.div>
        </div>
        
        {/* Copyright */}
        <motion.div 
          variants={fadeInUp}
          className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400"
        >
          <p>© {new Date().getFullYear()} OM Digital. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer
