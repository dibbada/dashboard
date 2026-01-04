import { motion } from "framer-motion";
import { Image, FolderOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MediaService {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  url: string;
}

const MediaCards = () => {
  const [activeService, setActiveService] = useState<string | null>(null);

  const services: MediaService[] = [
    {
      id: "immich",
      name: "Immich",
      description: "Photo Gallery",
      icon: Image,
      color: "from-pink-500/20 to-rose-500/20",
      url: "" // User will configure via settings
    },
    {
      id: "filebrowser",
      name: "FileBrowser",
      description: "File Manager",
      icon: FolderOpen,
      color: "from-blue-500/20 to-cyan-500/20",
      url: "" // User will configure via settings
    }
  ];

  const handleOpen = (service: MediaService) => {
    if (service.url) {
      window.open(service.url, "_blank");
    } else {
      setActiveService(service.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bento-item h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">NAS & Media</h3>
      </div>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="grid grid-cols-1 gap-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleOpen(service)}
                className={`
                  relative p-4 rounded-xl cursor-pointer
                  bg-gradient-to-br ${service.color}
                  border border-border/30 hover:border-primary/30
                  transition-all duration-300
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/50">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{service.name}</h4>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {!service.url && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Configure URL in Settings
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default MediaCards;
