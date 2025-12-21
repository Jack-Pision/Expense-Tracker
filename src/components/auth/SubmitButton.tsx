"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/Button";

interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function SubmitButton({ children, className, fullWidth }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            isLoading={pending}
            className={className}
            fullWidth={fullWidth}
            size="lg"
        >
            {children}
        </Button>
    );
}
