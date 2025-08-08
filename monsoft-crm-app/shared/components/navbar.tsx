import { Link, useNavigate } from '@tanstack/react-router';

import {
    ChevronDown,
    ChevronUp,
    Fingerprint,
    LucideIcon,
    Power,
    Settings,
    MessageCircle,
    Package,
    Bot,
} from 'lucide-react';

import { useIsMobile } from '../hooks/is-mobile';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@ui/sidebar.ui';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@ui/collapsible.ui';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu.ui';

import { HRef, router } from '@web/router';

import { authClient } from '@auth/providers/web';

// NavbarLink component that closes the sidebar on mobile when clicked
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
        // Only take special action on mobile devices
        if (isMobile) {
            // Prevent default Link behavior
            e.preventDefault();

            // Close the sidebar
            setOpen(false);

            void navigate({ to: item.url });
        }
        // On desktop, let the Link component handle navigation normally
    };

    return (
        <Link to={item.url} onClick={handleClick}>
            {({ isActive }) => (
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={isActive}>
                        <item.icon />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )}
        </Link>
    );
}

// Menu items.

export function Navbar() {
    const { data: session } = authClient.useSession();

    const { setOpenMobile } = useSidebar();

    const user = session?.user;

    if (!user) return null;

    // Menu items.
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
            <SidebarHeader className="h-8"></SidebarHeader>

            <SidebarContent>
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Dashboard
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
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
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <SidebarMenuButton asChild>
                                <DropdownMenuTrigger className="w-full">
                                    <Settings /> Settings
                                    <ChevronUp className="ml-auto" />
                                </DropdownMenuTrigger>
                            </SidebarMenuButton>

                            <DropdownMenuContent
                                side="top"
                                className="w-(--radix-popper-anchor-width)"
                            >
                                <DropdownMenuItem>
                                    Account
                                    <DropdownMenuShortcut>
                                        <Fingerprint className="size-4" />
                                    </DropdownMenuShortcut>
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
