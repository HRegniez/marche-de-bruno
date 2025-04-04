'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    const target = document.querySelector(id) as HTMLElement;
    if (!target) return;

    const offset = 120; 
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-2xl text-emerald-700">
            Le petit marché de Bruno
          </Link>
          
          {/* Burger menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { href: '#products', label: 'Produits' },
              { href: '#about', label: 'À propos' },
              { href: '#contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleScroll(e, href)}
                className="text-gray-700 hover:text-emerald-600 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { href: '#products', label: 'Produits' },
              { href: '#about', label: 'À propos' },
              { href: '#contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  handleScroll(e, href);
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}