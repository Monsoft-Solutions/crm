import { useState, useEffect } from 'react';
import { InfoIcon } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './tooltip.ui';
import { Popover, PopoverContent, PopoverTrigger } from './popover.ui';

type InfoTooltipProps = {
    text: string;
    iconClassName?: string;
};

export function InfoTooltip({
    text,
    iconClassName = 'h-3 w-3',
}: InfoTooltipProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // Consider mobile if width < 768px
        };

        // Check on mount
        checkIfMobile();

        // Add listener for window resize
        window.addEventListener('resize', checkIfMobile);

        // Clean up
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    if (isMobile) {
        return (
            <Popover>
                <PopoverTrigger>
                    <InfoIcon className={iconClassName} />
                </PopoverTrigger>
                <PopoverContent>{text}</PopoverContent>
            </Popover>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <InfoIcon className={iconClassName} />
                </TooltipTrigger>
                <TooltipContent>{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
