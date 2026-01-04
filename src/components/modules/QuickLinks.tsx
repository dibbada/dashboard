import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

const QuickLinks = () => {
  const links: QuickLink[] = [
    {
      id: "twitch",
      name: "Twitch",
      url: "https://twitch.tv",
      icon: "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png",
      color: "bg-purple-600/20 hover:bg-purple-600/30"
    },
    {
      id: "ytmusic",
      name: "YT Music",
      url: "https://music.youtube.com",
      icon: "https://music.youtube.com/img/favicon_144.png",
      color: "bg-red-600/20 hover:bg-red-600/30"
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://youtube.com",
      icon: "https://www.youtube.com/s/desktop/c01a5f9e/img/favicon_144x144.png",
      color: "bg-red-500/20 hover:bg-red-500/30"
    },
    {
      id: "netmirror",
      name: "Netmirror",
      url: "https://netmirror.app",
      icon: "🪞",
      color: "bg-blue-600/20 hover:bg-blue-600/30"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bento-item h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Quick Links</h3>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </div>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="grid grid-cols-2 gap-3">
          {links.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-xl
                transition-all duration-200 ${link.color}
              `}
            >
              {link.icon.startsWith('http') ? (
                <img src={link.icon} alt={link.name} className="w-8 h-8 rounded-lg" />
              ) : (
                <span className="text-2xl">{link.icon}</span>
              )}
              <span className="text-xs font-medium text-foreground">{link.name}</span>
            </motion.a>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default QuickLinks;
