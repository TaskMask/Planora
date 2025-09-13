import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  colors?: string[];
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  particleCount = 20, 
  colors = ['#60A5FA', '#A78BFA', '#F472B6', '#34D399', '#FBBF24'],
  className = ''
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 2 + 0.5,
          direction: Math.random() * 360,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [particleCount, colors]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            x: [
              0, 
              Math.cos(particle.direction * Math.PI / 180) * 100,
              Math.cos((particle.direction + 180) * Math.PI / 180) * 100,
              0
            ],
            y: [
              0,
              Math.sin(particle.direction * Math.PI / 180) * 100,
              Math.sin((particle.direction + 180) * Math.PI / 180) * 100,
              0
            ],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export const FloatingBubbles: React.FC<{ count?: number; className?: string }> = ({ 
  count = 8, 
  className = '' 
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export const GeometricShapes: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shapes = ['circle', 'square', 'triangle'];
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(6)].map((_, i) => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 30 + 20;
        
        return (
          <motion.div
            key={i}
            className={`absolute ${
              shape === 'circle' ? 'rounded-full' : 
              shape === 'square' ? 'rounded-lg' : ''
            } bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10`}
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 3,
            }}
          />
        );
      })}
    </div>
  );
};

export const LightBeams: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{
            left: `${20 + i * 30}%`,
            transformOrigin: 'top',
          }}
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.6, 0],
            skewX: [0, 15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1,
          }}
        />
      ))}
    </div>
  );
};
