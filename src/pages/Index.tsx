
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import CuisineShowcase from '@/components/CuisineShowcase';
import Testimonials from '@/components/Testimonials';
import ChatPreview from '@/components/ChatPreview';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CuisineShowcase />
        <Testimonials />
        <ChatPreview />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
