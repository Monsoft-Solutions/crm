import * as React from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1400,
};

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined,
    );

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${(BREAKPOINTS.md - 1).toString()}px)`,
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < BREAKPOINTS.md);
        };
        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < BREAKPOINTS.md);
        return () => {
            mql.removeEventListener('change', onChange);
        };
    }, []);

    return !!isMobile;
}

export function useBreakpoint(breakpoint: Breakpoint) {
    const [isAboveBreakpoint, setIsAboveBreakpoint] = React.useState<
        boolean | undefined
    >(undefined);

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(min-width: ${BREAKPOINTS[breakpoint].toString()}px)`,
        );
        const onChange = () => {
            setIsAboveBreakpoint(window.innerWidth >= BREAKPOINTS[breakpoint]);
        };
        mql.addEventListener('change', onChange);
        setIsAboveBreakpoint(window.innerWidth >= BREAKPOINTS[breakpoint]);
        return () => {
            mql.removeEventListener('change', onChange);
        };
    }, [breakpoint]);

    return !!isAboveBreakpoint;
}

export function useCurrentBreakpoint() {
    const [currentBreakpoint, setCurrentBreakpoint] =
        React.useState<Breakpoint>('xs');

    React.useEffect(() => {
        const checkBreakpoint = () => {
            const width = window.innerWidth;
            if (width >= BREAKPOINTS['2xl']) return '2xl';
            if (width >= BREAKPOINTS.xl) return 'xl';
            if (width >= BREAKPOINTS.lg) return 'lg';
            if (width >= BREAKPOINTS.md) return 'md';
            if (width >= BREAKPOINTS.sm) return 'sm';
            return 'xs';
        };

        const handleResize = () => {
            setCurrentBreakpoint(checkBreakpoint());
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return currentBreakpoint;
}

export { BREAKPOINTS };
