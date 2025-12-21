"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "INR" | "CAD" | "AUD" | "BDT" | "CNY" | "KRW" | "BRL" | "RUB" | "ZAR" | "MXN" | "SGD" | "NZD" | "CHF";

interface Currency {
    code: CurrencyCode;
    symbol: string;
    locale: string;
    name: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
    USD: { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
    EUR: { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
    GBP: { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
    JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", name: "Japanese Yen" },
    INR: { code: "INR", symbol: "₹", locale: "en-IN", name: "Indian Rupee" },
    BDT: { code: "BDT", symbol: "৳", locale: "bn-BD", name: "Bangladeshi Taka" },
    CNY: { code: "CNY", symbol: "¥", locale: "zh-CN", name: "Chinese Yuan" },
    KRW: { code: "KRW", symbol: "₩", locale: "ko-KR", name: "South Korean Won" },
    BRL: { code: "BRL", symbol: "R$", locale: "pt-BR", name: "Brazilian Real" },
    RUB: { code: "RUB", symbol: "₽", locale: "ru-RU", name: "Russian Ruble" },
    ZAR: { code: "ZAR", symbol: "R", locale: "en-ZA", name: "South African Rand" },
    MXN: { code: "MXN", symbol: "$", locale: "es-MX", name: "Mexican Peso" },
    SGD: { code: "SGD", symbol: "S$", locale: "en-SG", name: "Singapore Dollar" },
    NZD: { code: "NZD", symbol: "NZ$", locale: "en-NZ", name: "New Zealand Dollar" },
    CHF: { code: "CHF", symbol: "Fr", locale: "de-CH", name: "Swiss Franc" },
    CAD: { code: "CAD", symbol: "C$", locale: "en-CA", name: "Canadian Dollar" },
    AUD: { code: "AUD", symbol: "A$", locale: "en-AU", name: "Australian Dollar" },
};

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (code: CurrencyCode) => void;
    formatMoney: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load preference from localStorage on mount
        const saved = localStorage.getItem("currency_preference") as CurrencyCode;
        if (saved && CURRENCIES[saved]) {
            setCurrencyCode(saved);
        }
        setIsLoaded(true);
    }, []);

    const setCurrency = (code: CurrencyCode) => {
        setCurrencyCode(code);
        localStorage.setItem("currency_preference", code);
    };

    const currency = CURRENCIES[currencyCode];

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat(currency.locale, {
            style: "currency",
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Avoid hydration mismatch by rendering nothing or a loader until client stats are known
    // Or just render children but be aware of potential flash. 
    // For a simple app, rendering children immediately with default is fine, 
    // but useEffect causing a re-render is standard.

    // Standard pattern: Render with default (USD) for SSR, then update on client
    // We remove the conditional return to ensure Context is always available

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
