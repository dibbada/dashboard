import { Search, Bell, Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SettingsPage from "./SettingsPage";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-lg">MediaOS</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps, movies, or music..."
            className="w-80 h-10 pl-10 pr-12 rounded-lg bg-secondary border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
            <Command className="w-3 h-3" />
            <span className="text-xs">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Button variant="nav" size="sm" className="bg-primary text-primary-foreground">
            Dashboard
          </Button>
          <Button variant="nav" size="sm">
            Library
          </Button>
          <Button variant="nav" size="sm">
            Activity
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
          </button>
          <SettingsPage />
          <Avatar className="w-9 h-9 border-2 border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-800 text-primary-foreground">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
