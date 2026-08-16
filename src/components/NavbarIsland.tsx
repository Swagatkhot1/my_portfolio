import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";

export default function NavbarIsland() {
  return (
    // Dark is the default; the inline script in Layout.astro applies the same
    // rule before first paint, so the two must stay in sync.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider delayDuration={0}>
        <Sidebar />
      </TooltipProvider>
    </ThemeProvider>
  );
}
