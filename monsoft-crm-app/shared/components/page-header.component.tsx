import { ReactElement, ReactNode } from 'react';

import { Link } from '@tanstack/react-router';

import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export function PageHeader({
    title,
    description,
    actions,
    breadcrumbs,
}: PageHeaderProps): ReactElement {
    return (
        <div className="flex flex-col gap-1 pb-6">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="text-muted-foreground flex items-center gap-1 text-sm">
                    {breadcrumbs.map((crumb, i) => (
                        <span
                            key={crumb.label}
                            className="flex items-center gap-1"
                        >
                            {i > 0 && (
                                <ChevronRight className="size-3.5 shrink-0" />
                            )}
                            {crumb.href ? (
                                <Link
                                    to={crumb.href}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-foreground">
                                    {crumb.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-muted-foreground text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex shrink-0 items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
