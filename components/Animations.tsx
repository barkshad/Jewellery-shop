import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from 'framer-motion';

// 1. Reveal on Scroll (Fade Up with spring)
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; width?: "fit-content" | "100%" }> = ({ 
    children, 
    delay = 0,
    width = "fit-content" 
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
    
    return (
        <div ref={ref} style={{ width, overflow: 'visible' }}>
            <motion.div
                initial={{ opacity: 0, y: 75, rotateX: 10 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{
                    duration: 0.8,
                    delay: delay,
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

// 2. Parallax Image (Moves slower than scroll)
export const ParallaxImage: React.FC<{ src: string; alt: string; className?: string; speed?: number }> = ({ 
    src, 
    alt, 
    className,
    speed = 0.5 
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    // Create a smooth spring-based value for the parallax
    const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 });
    const y = useTransform(smoothProgress, [0, 1], ["-15%", "15%"]);

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.img 
                src={src} 
                alt={alt}
                style={{ y, scale: 1.15 }} // Scale up slightly so edges don't show
                className="w-full h-full object-cover"
            />
        </div>
    );
};

// 3. Magnetic Button (Sticks to cursor)
export const MagneticButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({ 
    children, 
    onClick,
    className = "" 
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
        const x = (clientX - (left + width / 2)) * 0.35; // Magnet strength
        const y = (clientY - (top + height / 2)) * 0.35;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

// 4. Stagger Container for lists
export const StaggerContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.2
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)",
                    transition: { type: "spring", damping: 20 }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// 5. 3D Tilt Card with Light Glare
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]); // Reduced rotation for subtlety
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ 
                rotateX, 
                rotateY, 
                perspective: 1000,
                transformStyle: "preserve-3d" 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={`relative ${className}`}
        >
            {children}
            {/* Glossy Overlay controlled by mouse */}
            <motion.div 
                style={{ 
                    x: useTransform(x, [-100, 100], [-50, 50]),
                    y: useTransform(y, [-100, 100], [-50, 50]),
                    opacity: useTransform(x, [-100, 0, 100], [0, 0.3, 0]),
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)'
                }}
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
            />
        </motion.div>
    );
};

// 6. Floating Particles (Gold Dust)
export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 20 }) => {
    const particles = Array.from({ length: count });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        y: [null, Math.random() * -100 + "%"],
                        opacity: [0, 0.8, 0],
                        scale: [0, Math.random() * 1.5 + 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                    className="absolute w-1 h-1 rounded-full bg-champagne-300 blur-[1px] shadow-[0_0_8px_rgba(191,149,63,0.8)]"
                />
            ))}
        </div>
    );
};