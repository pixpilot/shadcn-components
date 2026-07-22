import React from 'react';

/**
 * Inline styles for shake animation
 * Can be included in any component that needs shake effect
 */
export const ShakeStyles: React.FC = () => (
  <style>
    {`@keyframes pp-shake { 0% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } 100% { transform: translateX(0); } } .pp-shake { animation: pp-shake 220ms ease-in-out; }`}
  </style>
);
