import React from 'react';
import logo from '../assets/logo.png';

interface PreloaderProps {
  isVisible: boolean;
}

/**
 * Preloader - Modern loading screen component
 * 
 * Displays an animated loading screen with logo, gradient text,
 * and modern spinner animations while the application initializes.
 */
const Preloader: React.FC<PreloaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="preloader">
      <div className="preloader-content">
        {/* Animated Logo */}
        <div className="preloader-logo">
          <img 
            src={logo} 
            alt="Tech Space Logo" 
            className="preloader-logo-image"
          />
        </div>

        {/* Gradient Title */}
        <h1 className="preloader-title">
          TECH SPACE
        </h1>

        {/* Subtitle */}
        <p className="preloader-subtitle">
          Loading your digital experience...
        </p>

        {/* Loading Dots */}
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;