
import React from 'react';
import { Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="bg-resty-text text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <a href="#" className="text-2xl font-bold text-white mb-4 inline-block">Resty</a>
            <p className="text-gray-300 mb-4 max-w-md">
              Your personal AI restaurant concierge that helps you discover and book the perfect dining experience every time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-resty-accent">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-resty-accent">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-resty-accent">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-white">How It Works</a></li>
              <li><a href="#cuisines" className="text-gray-300 hover:text-white">Cuisines</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white">Testimonials</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest restaurant updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email"
                className="bg-white/10 text-white px-3 py-2 rounded-l-md focus:outline-none flex-1"
              />
              <Button className="bg-resty-primary hover:bg-resty-primary/90 rounded-l-none">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Resty. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm mr-4">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
