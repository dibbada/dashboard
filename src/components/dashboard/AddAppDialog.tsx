import { useState } from "react";
import { Plus, Upload, Link2, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveCustomApp, iconMap } from "@/lib/appStore";

const colorOptions = [
  { color: "text-primary", bgColor: "bg-primary/20", label: "Primary" },
  { color: "text-emerald-500", bgColor: "bg-emerald-900/30", label: "Green" },
  { color: "text-red-500", bgColor: "bg-red-900/30", label: "Red" },
  { color: "text-purple-500", bgColor: "bg-purple-900/30", label: "Purple" },
  { color: "text-amber-500", bgColor: "bg-amber-900/30", label: "Amber" },
  { color: "text-blue-500", bgColor: "bg-blue-900/30", label: "Blue" },
  { color: "text-pink-500", bgColor: "bg-pink-900/30", label: "Pink" },
  { color: "text-cyan-500", bgColor: "bg-cyan-900/30", label: "Cyan" },
];

interface AddAppDialogProps {
  onAppAdded?: () => void;
}

const AddAppDialog = ({ onAppAdded }: AddAppDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    iconUrl: "",
    iconName: "Globe",
    color: "text-primary",
    bgColor: "bg-primary/20",
    redirectUrl: "",
    subRoute: "",
  });

  const handleSubmit = () => {
    if (!formData.name) return;

    saveCustomApp({
      name: formData.name,
      status: formData.status || "Custom App",
      iconUrl: formData.iconUrl,
      iconName: formData.iconUrl ? undefined : formData.iconName,
      color: formData.color,
      bgColor: formData.bgColor,
      redirectUrl: formData.redirectUrl,
      subRoute: formData.subRoute || formData.name.toLowerCase().replace(/\s+/g, "-"),
    });

    setFormData({
      name: "",
      status: "",
      iconUrl: "",
      iconName: "Globe",
      color: "text-primary",
      bgColor: "bg-primary/20",
      redirectUrl: "",
      subRoute: "",
    });
    setIsOpen(false);
    onAppAdded?.();
  };

  const selectedColor = colorOptions.find(c => c.color === formData.color) || colorOptions[0];
  const IconComponent = formData.iconName ? iconMap[formData.iconName] : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="rounded-2xl border-2 border-dashed border-border/50 p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 cursor-pointer min-h-[140px]">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Add App</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New App
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Preview */}
          <div className="flex items-center justify-center p-6 bg-secondary/30 rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-xl ${selectedColor.bgColor} flex items-center justify-center`}>
                {formData.iconUrl ? (
                  <img src={formData.iconUrl} alt="" className="w-8 h-8 rounded object-cover" />
                ) : IconComponent ? (
                  <IconComponent className={`w-7 h-7 ${selectedColor.color}`} />
                ) : (
                  <Globe className={`w-7 h-7 ${selectedColor.color}`} />
                )}
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{formData.name || "App Name"}</p>
                <p className="text-xs text-muted-foreground">{formData.status || "Status"}</p>
              </div>
            </div>
          </div>

          {/* App Name */}
          <div className="space-y-2">
            <Label>App Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Custom App"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status / Description</Label>
            <Input
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              placeholder="Online, Streaming, etc."
            />
          </div>

          {/* Icon URL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Icon URL (optional)
            </Label>
            <Input
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              placeholder="https://example.com/icon.png"
            />
            <p className="text-xs text-muted-foreground">Paste a URL to an image, or leave empty to use a default icon</p>
          </div>

          {/* Icon Selection (if no URL) */}
          {!formData.iconUrl && (
            <div className="space-y-2">
              <Label>Choose Icon</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(iconMap).map((iconName) => {
                  const Icon = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName })}
                      className={`p-2 rounded-lg border transition-all ${
                        formData.iconName === iconName 
                          ? "border-primary bg-primary/20" 
                          : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Color Theme</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: option.color, bgColor: option.bgColor })}
                  className={`w-8 h-8 rounded-full ${option.bgColor} flex items-center justify-center border-2 transition-all ${
                    formData.color === option.color ? "border-foreground scale-110" : "border-transparent"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${option.color.replace("text-", "bg-")}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Redirect URL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Redirect URL
            </Label>
            <Input
              value={formData.redirectUrl}
              onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
              placeholder="https://example.com"
            />
            <p className="text-xs text-muted-foreground">Where to go when clicking the app</p>
          </div>

          {/* Sub Route */}
          <div className="space-y-2">
            <Label>Dashboard Sub-route</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/dashboard/</span>
              <Input
                value={formData.subRoute}
                onChange={(e) => setFormData({ ...formData, subRoute: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder={formData.name.toLowerCase().replace(/\s+/g, "-") || "my-app"}
                className="flex-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!formData.name}>
              Create App
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppDialog;
