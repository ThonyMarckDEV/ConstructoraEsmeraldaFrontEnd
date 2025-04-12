import React, { useState, useEffect } from 'react';
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Projects from '../components/Home/Projects';
import Platform from '../components/Home/Platform';
import Contact from '../components/Home/Contact';
import Footer from '../components/Home/Footer';

const Landing = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    about: false,
    projects: false,
    features: false,
    contact: false
  });

  useEffect(() => {
    // Trigger animations sequentially
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, about: true })), 800);
    setTimeout(() => setIsVisible(prev => ({ ...prev, projects: true })), 1300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, features: true })), 1800);
    setTimeout(() => setIsVisible(prev => ({ ...prev, contact: true })), 2300);
  }, []);

  // Animation classes
  const fadeInUp = (isActive) => 
    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero 
        isVisible={isVisible.hero} 
        fadeInUp={fadeInUp} 
      />
      
      <About 
        isVisible={isVisible.about} 
        fadeInUp={fadeInUp} 
      />
      
      <Projects 
        isVisible={isVisible.projects} 
        fadeInUp={fadeInUp} 
      />
      
      <Platform 
        isVisible={isVisible.features} 
        fadeInUp={fadeInUp} 
      />
      
      <Contact 
        isVisible={isVisible.contact} 
        fadeInUp={fadeInUp} 
      />
      
      <Footer />
    </div>
  );
};

export default Landing;
