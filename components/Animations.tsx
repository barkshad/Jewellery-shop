import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// 1. Reveal on Scroll (Fade Up with spring)
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; width?: "fit-content" | "100%" }> = ({ 
    children, 
    delay = 0,
    width = "fit-content" 
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
    
    return (
        <div ref={ref} style={{ width, overflow: 'hidden' }}>
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
