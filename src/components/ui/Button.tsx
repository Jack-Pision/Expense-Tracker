import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
            secondary: "bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-200",
            outline: "border border-border bg-transparent hover:bg-surface-hover text-text-primary focus:ring-gray-200",
            ghost: "bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary focus:ring-gray-200",
            danger: "bg-danger text-white hover:bg-red-600 focus:ring-red-500",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs gap-1.5",
            md: "h-10 px-4 py-2 text-sm gap-2",
            lg: "h-12 px-6 text-base gap-2.5",
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && "w-full",
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";
