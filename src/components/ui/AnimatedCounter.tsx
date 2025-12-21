"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
    decimals?: number;
}

export function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    duration = 1.5,
    className = "",
    decimals = 2,
}: AnimatedCounterProps) {
    const prevValue = useRef(0);

    const spring = useSpring(prevValue.current, {
        mass: 1,
        stiffness: 75,
        damping: 15,
        duration: duration * 1000,
    });

    const display = useTransform(spring, (current) =>
        current.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })
    );

    useEffect(() => {
        spring.set(value);
        prevValue.current = value;
    }, [spring, value]);

    return (
        <motion.span
            className={`tabular-nums ${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {prefix}
            <motion.span>{display}</motion.span>
            {suffix}
        </motion.span>
    );
}
