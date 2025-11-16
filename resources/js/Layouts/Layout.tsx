import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar"
import { AppSidebar } from "@/Components/app-sidebar"
import { ThemeProvider } from "@/Components/ui/theme-provider"
import { ModeToggle } from "@/Components/ui/mode-toggle"
import { Toaster } from "@/Components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {/* <ModeToggle /> */}
          {children}
          <Toaster position="top-center" richColors />
        </main>
      </SidebarProvider>
    </ThemeProvider >
  )
}