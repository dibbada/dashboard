import { Grid3X3, List, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import FileManagerDialog from "./FileManagerDialog";
import AddAppDialog from "./AddAppDialog";
import { getAllApps, deleteCustomApp, iconMap, CustomApp } from "@/lib/appStore";

const ApplicationsGrid = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [apps, setApps] = useState<CustomApp[]>([]);

  const loadApps = () => {
    setApps(getAllApps());
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleAppClick = (app: CustomApp) => {
    if (app.redirectUrl) {
      window.open(app.redirectUrl, "_blank");
    } else if (app.subRoute) {
      window.location.href = `/dashboard/${app.subRoute}`;
    }
  };

  const handleDeleteApp = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    deleteCustomApp(appId);
    loadApps();
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Grid3X3 className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Applications</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {apps.map((app) => {
          const IconComponent = app.iconName ? iconMap[app.iconName] : null;
          
          return (
            <div
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="relative rounded-2xl border border-border/50 bg-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-card-hover hover:border-primary/30 transition-all duration-300 cursor-pointer min-h-[140px] group"
            >
              {app.isCustom && (
                <button
                  onClick={(e) => handleDeleteApp(e, app.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              
              {app.isOnline && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
              )}
              
              <div className={`w-12 h-12 rounded-xl ${app.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {app.iconUrl ? (
                  <img src={app.iconUrl} alt={app.name} className="w-6 h-6 rounded object-cover" />
                ) : IconComponent ? (
                  <IconComponent className={`w-6 h-6 ${app.color}`} />
                ) : null}
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-sm">{app.name}</h3>
                <p className="text-xs text-muted-foreground">{app.status}</p>
              </div>
            </div>
          );
        })}

        {/* File Manager */}
        <FileManagerDialog />

        {/* Add App Button */}
        <AddAppDialog onAppAdded={loadApps} />
      </div>
    </div>
  );
};

export default ApplicationsGrid;
