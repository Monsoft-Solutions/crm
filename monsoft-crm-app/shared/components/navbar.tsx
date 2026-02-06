import { Link, useNavigate } from '@tanstack/react-router';

import {
    Fingerprint,
    LucideIcon,
    Power,
    MessageCircle,
    Package,
    Bot,
    Zap,
} from 'lucide-react';

import { useIsMobile } from '../hooks/is-mobile';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@ui/sidebar.ui';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu.ui';

import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar.ui';

import { ThemeDropdown } from '@ui/theme-dropdown.ui';

import { HRef, router } from '@web/router';

import { authClient } from '@auth/providers/web';

import { cn } from '@css/utils';

function NavbarLink({
    item,
    setOpen,
}: {
    item: { title: string; url: HRef; icon: LucideIcon };
    setOpen: (open: boolean) => void;
}) {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const handleClick = (e: React.MouseEvent) => {
        if (isMobile) {
            e.preventDefault();
            setOpen(false);
            void navigate({ to: item.url });
        }
    };

    return (
        <Link to={item.url} onClick={handleClick}>
            {({ isActive }) => (
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={isActive}
                        className={cn(
                            'transition-all duration-150',
                            isActive &&
                                'border-primary bg-sidebar-accent text-sidebar-primary border-l-2 pl-[calc(0.5rem-2px)]',
                        )}
                    >
                        <item.icon className="size-[1.125rem]" />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )}
        </Link>
    );
}

export function Navbar() {
    const navigate = useNavigate();

    const { data: session } = authClient.useSession();

    const { setOpenMobile } = useSidebar();

    const user = session?.user;

    if (!user) return null;

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const nullableItems: ({
        title: string;
        url: HRef;
        icon: LucideIcon;
    } | null)[] = [
        {
            title: 'Chat',
            url: '/chat',
            icon: MessageCircle,
        },
        {
            title: 'Products',
            url: '/products',
            icon: Package,
        },
        {
            title: 'Assistants',
            url: '/assistant',
            icon: Bot,
        },
    ];

    const items = nullableItems.filter((item) => item !== null);

    return (
        <Sidebar variant="floating" collapsible="icon" side="left">
            <SidebarHeader className="flex flex-row items-center gap-2 p-3">
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl">
                    <Zap className="size-4.5" />
                </div>
                <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] group-data-[collapsible=icon]:hidden">
                    Monsoft CRM
                </span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <NavbarLink
                                    key={item.title}
                                    item={item}
                                    setOpen={setOpenMobile}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                        <div className="flex items-center justify-center px-2 py-1">
                            <ThemeDropdown size="sm" variant="ghost" />
                        </div>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <DropdownMenu>
                            <SidebarMenuButton asChild>
                                <DropdownMenuTrigger className="w-full">
                                    <Avatar className="size-5">
                                        <AvatarImage
                                            src={user.image ?? undefined}
                                        />
                                        <AvatarFallback className="text-[10px]">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate text-sm">
                                        {user.name}
                                    </span>
                                </DropdownMenuTrigger>
                            </SidebarMenuButton>

                            <DropdownMenuContent
                                side="top"
                                className="w-(--radix-popper-anchor-width)"
                            >
                                <DropdownMenuItem
                                    onClick={() => {
                                        void navigate({
                                            to: '/settings',
                                        });
                                    }}
                                >
                                    <Fingerprint className="mr-2 size-4" />
                                    Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="font-semibold"
                                    onClick={() => {
                                        void authClient.signOut();
                                        void router.invalidate();
                                    }}
                                >
                                    Log Out
                                    <DropdownMenuShortcut className="opacity-100">
                                        <Power className="stroke-destructive size-4 stroke-2" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
