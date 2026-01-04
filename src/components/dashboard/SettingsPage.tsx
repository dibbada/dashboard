import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  FolderOpen,
  Save,
  Layout,
  GripVertical,
  Eye,
  EyeOff,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAllApps,
  saveAppLink,
  getAppLinks,
  getWidgetConfig,
  saveWidgetConfig,
  WidgetConfig,
  AppLink
} from "@/lib/appStore";

interface QuickLink {
  id: string;
  name: string;
  url: string;
  type: "url" | "path";
}

interface UserSettings {
  displayName: string;
  email: string;
  avatar: string;
  quickLinks: QuickLink[];
}

const defaultSettings: UserSettings = {
  displayName: "User",
  email: "user@example.com",
  avatar: "",
  quickLinks: [
    { id: "1", name: "GitHub", url: "https://github.com", type: "url" },
    { id: "2", name: "Documents", url: "/home/user/Documents", type: "path" },
    { id: "3", name: "Projects", url: "/home/user/Projects", type: "path" },
  ],
};

interface SettingsPageProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsPage = ({ open: externalOpen, onOpenChange: externalOnOpenChange }: SettingsPageProps = {}) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;
  const [newLink, setNewLink] = useState({ name: "", url: "", type: "url" as "url" | "path" });
  const [isSaved, setIsSaved] = useState(false);

  // App links state
  const [appLinks, setAppLinks] = useState<Record<string, string>>({});
  const [apps, setApps] = useState(getAllApps());

  // Widget config state
  const [widgets, setWidgets] = useState<WidgetConfig[]>(getWidgetConfig());

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load app links
    const links = getAppLinks();
    const linksMap: Record<string, string> = {};
    links.forEach(link => {
      linksMap[link.appId] = link.redirectUrl;
    });
    setAppLinks(linksMap);

    // Load apps
    setApps(getAllApps());
  }, [isOpen]);

  const addQuickLink = () => {
    if (newLink.name && newLink.url) {
      setSettings({
        ...settings,
        quickLinks: [
          ...settings.quickLinks,
          { ...newLink, id: Date.now().toString() }
        ],
      });
      setNewLink({ name: "", url: "", type: "url" });
    }
  };

  const removeQuickLink = (id: string) => {
    setSettings({
      ...settings,
      quickLinks: settings.quickLinks.filter(link => link.id !== id),
    });
  };

  const openLink = (link: QuickLink) => {
    if (link.type === "url") {
      window.open(link.url, "_blank");
    } else {
      navigator.clipboard.writeText(link.url);
    }
  };

  const handleAppLinkChange = (appId: string, url: string) => {
    setAppLinks({ ...appLinks, [appId]: url });
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(w =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const saveSettings = () => {
    // Save user settings
    localStorage.setItem("userSettings", JSON.stringify(settings));

    // Save app links
    apps.forEach(app => {
      if (appLinks[app.id]) {
        saveAppLink(app.id, app.name, appLinks[app.id]);
      }
    });

    // Save widget config
    saveWidgetConfig(widgets);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="applinks">App Links</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="quicklinks">Quick Links</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={settings.avatar} />
                <AvatarFallback className="text-2xl bg-primary/20">
                  {settings.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={settings.avatar}
                  onChange={(e) => setSettings({ ...settings, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
          </TabsContent>

          {/* App Links Tab */}
          <TabsContent value="applinks" className="space-y-6 mt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure where each app redirects when clicked. Leave empty to use the default.
              </p>

              <div className="space-y-3">
                {apps.map(app => (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card"
                  >
                    <div className={`p-2 rounded-lg ${app.bgColor}`}>
                      <Globe className={`w-4 h-4 ${app.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{app.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.isCustom ? "Custom App" : "Default App"}
                      </p>
                    </div>
                    <Input
                      value={appLinks[app.id] || app.redirectUrl || ""}
                      onChange={(e) => handleAppLinkChange(app.id, e.target.value)}
                      placeholder="https://..."
                      className="w-64"
                    />
                    {(appLinks[app.id] || app.redirectUrl) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(appLinks[app.id] || app.redirectUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-6 mt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enable or disable dashboard widgets. Drag to reorder.
              </p>

              <div className="space-y-2">
                {widgets.map(widget => (
                  <div
                    key={widget.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className="p-2 rounded-lg bg-secondary">
                      <Layout className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{widget.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {widget.enabled ? (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={() => toggleWidget(widget.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Quick Links Tab */}
          <TabsContent value="quicklinks" className="space-y-6 mt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add URLs or file paths for quick access. URLs will open in a new tab, paths will be copied to clipboard.
              </p>

              {/* Add New Link */}
              <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 space-y-3">
                <h4 className="font-medium text-sm">Add New Link</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="linkName" className="text-xs">Name</Label>
                    <Input
                      id="linkName"
                      value={newLink.name}
                      onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                      placeholder="Link name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkType" className="text-xs">Type</Label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        variant={newLink.type === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewLink({ ...newLink, type: "url" })}
                        className="flex-1"
                      >
                        <Link2 className="w-3 h-3 mr-1" /> URL
                      </Button>
                      <Button
                        variant={newLink.type === "path" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewLink({ ...newLink, type: "path" })}
                        className="flex-1"
                      >
                        <FolderOpen className="w-3 h-3 mr-1" /> Path
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="linkUrl" className="text-xs">
                    {newLink.type === "url" ? "URL" : "File Path"}
                  </Label>
                  <Input
                    id="linkUrl"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder={newLink.type === "url" ? "https://..." : "/home/user/..."}
                    className="mt-1"
                  />
                </div>
                <Button onClick={addQuickLink} size="sm" className="w-full gap-2">
                  <Plus className="w-4 h-4" /> Add Link
                </Button>
              </div>

              {/* Existing Links */}
              <div className="space-y-2">
                {settings.quickLinks.map(link => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card"
                  >
                    <div className="p-2 rounded-lg bg-secondary">
                      {link.type === "url" ? (
                        <Link2 className="w-4 h-4 text-primary" />
                      ) : (
                        <FolderOpen className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{link.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openLink(link)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeQuickLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {settings.quickLinks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No quick links yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveSettings} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPage;
