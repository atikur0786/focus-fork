"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"

interface ScrollHeaderProps {
    children?: React.ReactNode
    className?: string
}

export function ScrollHeader({ children, className }: ScrollHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, "change", (latest) => {
        const scrolled = latest > 50
        if (scrolled !== isScrolled) {
            setIsScrolled(scrolled)
        }
    })

    return (
        <motion.header
            className={cn(
                "fixed z-50 flex items-center justify-center transition-all duration-300",
                className
            )}
            initial={{ y: 0, width: "100%", top: 0 }}
            animate={{
                y: isScrolled ? 12 : 0, // Float down slightly
                width: isScrolled ? "90%" : "100%", // Shrink width
                maxWidth: isScrolled ? "1200px" : "100%",
                left: isScrolled ? "50%" : "0%",
                x: isScrolled ? "-50%" : "0%",
                borderRadius: isScrolled ? "9999px" : "0px", // Fully rounded pill
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {/* Inner Container for Glass Effect */}
            <motion.div
                className={cn(
                    "w-full h-16 flex items-center justify-between px-6 md:px-8",
                    isScrolled
                        ? "bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg"
                        : "bg-transparent border-transparent"
                )}
                animate={{
                    borderRadius: isScrolled ? "9999px" : "0px",
                }}
            >
                {/* Content Container */}
                <div className="w-full flex items-center justify-between">
                    {children}
                </div>
            </motion.div>
        </motion.header>
    )
}
