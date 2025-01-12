import { ReactNode } from "react";

interface ListItemProps {
    children: ReactNode;
    className?: string;
}

export function ListItem({ children, className = "" }: ListItemProps) {
    return (
        <li className={`flex items-center gap-2 text-zinc-300 ${className}`}>
            <svg
                viewBox="0 0 3 6"
                className="w-[3px] h-[6px] text-zinc-500"
                fill="none"
                stroke="currentColor"
            >
                <path
                    d="M0 0L3 3L0 6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {children}
        </li>
    );
} 