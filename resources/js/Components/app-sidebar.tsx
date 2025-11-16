import { BookOpenCheck, Calendar, Home, Inbox, LayoutDashboardIcon, Search, Settings, User, User2, UserCogIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar"
import ResponsiveNavLink from "./ResponsiveNavLink"
import { usePage } from '@inertiajs/react';

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Manajemen Reservasi",
    url: "/reservasi",
    icon: BookOpenCheck,
  },
  {
    title: "Manajemen Presensi",
    url: "/presensi",
    icon: Calendar,
  },
  {
    title: "Manajemen User",
    url: "/users",
    icon: User,
  },
  {
    title: "Manajemen Pelanggan",
    url: "/pelanggan",
    icon: UserCogIcon,
  },
]

export function AppSidebar() {
  const { url } = usePage();

  return (
    <Sidebar variant="floating">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>Dcutz Barber Management App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = url.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-black text-white hover:bg-primary/90"
                          : "hover:bg-muted"
                      }
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon
                          className={isActive ? "text-white" : "text-muted-foreground"}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuItem>
                  <ResponsiveNavLink
                    method="post"
                    href={route("logout")}
                    as="button"
                    className="w-full p-4 py-2 text-white bg-black rounded-md flex items-center gap-2 hover:bg-red-800"
                  >
                    <User2 className="h-4 w-4" />
                    <span>Log Out</span>
                  </ResponsiveNavLink>
                </SidebarMenuItem>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}

