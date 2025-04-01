
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Cuisines', href: '#cuisines' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container-custom flex justify-between items-center h-16 md:h-20">
        <a href="#" className="text-2xl md:text-3xl font-bold text-resty-primary">
          Resty
        </a>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-resty-text">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-resty-text hover:text-resty-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-resty-primary hover:bg-resty-primary/90 text-white">
            Start Chatting
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white p-4 shadow-md border-t z-50">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-resty-text py-2 hover:text-resty-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button 
              className="bg-resty-primary hover:bg-resty-primary/90 text-white w-full mt-2"
              onClick={() => setIsOpen(false)}
            >
              Start Chatting
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
