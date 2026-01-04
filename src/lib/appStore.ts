// Shared store for custom apps and settings
import { LucideIcon, User, Music, Film, PlayCircle, Gamepad2, Folder, Terminal, TrendingUp, StickyNote, ShoppingCart, FileCode, Globe } from "lucide-react";

export interface CustomApp {
  id: string;
  name: string;
  status: string;
  iconUrl?: string;
  iconName?: string;
  color: string;
  bgColor: string;
  isOnline?: boolean;
  redirectUrl?: string;
  subRoute?: string;
  isCustom: boolean;
}

export interface AppLink {
  appId: string;
  appName: string;
  redirectUrl: string;
}

export interface WidgetConfig {
  id: string;
  name: string;
  enabled: boolean;
  position: number;
}

// Icon mapping for built-in apps
export const iconMap: Record<string, LucideIcon> = {
  User,
  Music,
  Film,
  PlayCircle,
  Gamepad2,
  Folder,
  Terminal,
  TrendingUp,
  StickyNote,
  ShoppingCart,
  FileCode,
  Globe,
};

// Default apps
export const defaultApps: CustomApp[] = [
  { id: "plex", name: "Plex", status: "Server Online", iconName: "User", color: "text-app-plex", bgColor: "bg-amber-900/30", isOnline: true, redirectUrl: "https://app.plex.tv", isCustom: false },
  { id: "spotify", name: "Spotify", status: "Music", iconName: "Music", color: "text-app-spotify", bgColor: "bg-emerald-900/30", redirectUrl: "https://open.spotify.com", isCustom: false },
  { id: "netflix", name: "Netflix", status: "Streaming", iconName: "Film", color: "text-app-netflix", bgColor: "bg-red-900/30", redirectUrl: "https://netflix.com", isCustom: false },
  { id: "youtube", name: "YouTube", status: "Video", iconName: "PlayCircle", color: "text-app-youtube", bgColor: "bg-red-900/30", redirectUrl: "https://youtube.com", isCustom: false },
  { id: "twitch", name: "Twitch", status: "Live", iconName: "Gamepad2", color: "text-app-twitch", bgColor: "bg-purple-900/30", redirectUrl: "https://twitch.tv", isCustom: false },
];

// Storage keys
const CUSTOM_APPS_KEY = "r3ge_custom_apps";
const APP_LINKS_KEY = "r3ge_app_links";
const WIDGETS_KEY = "r3ge_widgets";

// Get all apps (default + custom)
export const getAllApps = (): CustomApp[] => {
  const customApps = getCustomApps();
  const appLinks = getAppLinks();
  
  // Merge redirect URLs from settings
  const mergedDefaults = defaultApps.map(app => {
    const link = appLinks.find(l => l.appId === app.id);
    return link ? { ...app, redirectUrl: link.redirectUrl } : app;
  });
  
  return [...mergedDefaults, ...customApps];
};

// Custom apps CRUD
export const getCustomApps = (): CustomApp[] => {
  const stored = localStorage.getItem(CUSTOM_APPS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCustomApp = (app: Omit<CustomApp, "id" | "isCustom">): CustomApp => {
  const customApps = getCustomApps();
  const newApp: CustomApp = {
    ...app,
    id: `custom_${Date.now()}`,
    isCustom: true,
  };
  customApps.push(newApp);
  localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(customApps));
  return newApp;
};

export const updateCustomApp = (id: string, updates: Partial<CustomApp>) => {
  const customApps = getCustomApps();
  const index = customApps.findIndex(app => app.id === id);
  if (index !== -1) {
    customApps[index] = { ...customApps[index], ...updates };
    localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(customApps));
  }
};

export const deleteCustomApp = (id: string) => {
  const customApps = getCustomApps().filter(app => app.id !== id);
  localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(customApps));
};

// App links management
export const getAppLinks = (): AppLink[] => {
  const stored = localStorage.getItem(APP_LINKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAppLink = (appId: string, appName: string, redirectUrl: string) => {
  const links = getAppLinks();
  const index = links.findIndex(l => l.appId === appId);
  if (index !== -1) {
    links[index] = { appId, appName, redirectUrl };
  } else {
    links.push({ appId, appName, redirectUrl });
  }
  localStorage.setItem(APP_LINKS_KEY, JSON.stringify(links));
};

export const deleteAppLink = (appId: string) => {
  const links = getAppLinks().filter(l => l.appId !== appId);
  localStorage.setItem(APP_LINKS_KEY, JSON.stringify(links));
};

// Widget config
export const getWidgetConfig = (): WidgetConfig[] => {
  const stored = localStorage.getItem(WIDGETS_KEY);
  if (stored) return JSON.parse(stored);
  
  return [
    { id: "hero", name: "Hero Card", enabled: true, position: 0 },
    { id: "nowPlaying", name: "Now Playing", enabled: true, position: 1 },
    { id: "applications", name: "Applications Grid", enabled: true, position: 2 },
    { id: "notes", name: "Notes", enabled: true, position: 3 },
    { id: "videoPlayer", name: "Video Player", enabled: true, position: 4 },
    { id: "shellScripts", name: "Shell Scripts", enabled: true, position: 5 },
    { id: "shoppingTracker", name: "Shopping Tracker", enabled: true, position: 6 },
  ];
};

export const saveWidgetConfig = (widgets: WidgetConfig[]) => {
  localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgets));
};
