import { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const AnimatedBackground = () => {
  // Use MotionValues instead of React state to avoid re-rendering the component on every mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Optional: add a spring for smooth trailing effect
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Memoize random particles so they don't regenerate on re-renders
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#1a1a1a]">
      {/* Dynamic Animated Gradient Background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, #1e1b4b 0%, #1a1a1a 60%)',
            'radial-gradient(circle at 100% 100%, #31102f 0%, #1a1a1a 60%)',
            'radial-gradient(circle at 0% 100%, #172554 0%, #1a1a1a 60%)',
            'radial-gradient(circle at 100% 0%, #431407 0%, #1a1a1a 60%)',
            'radial-gradient(circle at 0% 0%, #1e1b4b 0%, #1a1a1a 60%)',
          ],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-80"
      />

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
            opacity: 0.1 + Math.random() * 0.2
          }}
          animate={{
            y: ['0vh', '-100vh'],
            x: ['0vw', `${(Math.random() - 0.5) * 50}vw`],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Dynamic Mouse Follower */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,161,22,0.3) 0%, rgba(255,255,255,0) 80%)',
        }}
      />
      
      {/* Floating Glowing Orbs (Framer Motion) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 150, 0],
          y: [0, -100, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" 
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          rotate: [0, -90, 0],
          x: [0, -150, 0],
          y: [0, 150, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[10%] right-[-15%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-orange-500/15 rounded-full blur-[130px] mix-blend-screen pointer-events-none" 
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-10%] left-[25%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none" 
      />
      
      {/* Premium Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
