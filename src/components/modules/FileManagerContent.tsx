import { useState } from "react";
import { 
  Folder, 
  ChevronRight,
  ChevronDown,
  Trash2,
  FolderPlus,
  Search,
  Grid,
  List,
  Home,
  HardDrive,
  File,
  FileText,
  Image,
  Music,
  Film,
  Code,
  Archive,
  Copy,
  Move
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  extension?: string;
  size?: number;
  modified: Date;
  children?: FileItem[];
}

const getFileIcon = (item: FileItem) => {
  if (item.type === "folder") return Folder;
  const ext = item.extension?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) return Image;
  if (["mp3", "wav", "flac", "ogg"].includes(ext || "")) return Music;
  if (["mp4", "mkv", "avi", "mov", "webm"].includes(ext || "")) return Film;
  if (["js", "ts", "tsx", "jsx", "py", "java", "cpp", "c", "h", "css", "html"].includes(ext || "")) return Code;
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext || "")) return Archive;
  if (["txt", "md", "doc", "docx", "pdf"].includes(ext || "")) return FileText;
  return File;
};

const defaultShellScripts = [
  { id: "ss-1", name: "system-update.sh", extension: "sh", size: 156 },
  { id: "ss-2", name: "clear-cache.sh", extension: "sh", size: 98 },
  { id: "ss-3", name: "disk-space.sh", extension: "sh", size: 45 },
  { id: "ss-4", name: "list-processes.sh", extension: "sh", size: 78 },
  { id: "ss-5", name: "network-status.sh", extension: "sh", size: 89 },
  { id: "ss-6", name: "docker-cleanup.sh", extension: "sh", size: 67 },
];

const initialFileSystem: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modified: new Date(),
    children: [
      { id: "1-1", name: "report.pdf", type: "file", extension: "pdf", size: 2400000, modified: new Date() },
      { id: "1-2", name: "notes.txt", type: "file", extension: "txt", size: 1200, modified: new Date() },
    ],
  },
  {
    id: "2",
    name: "Pictures",
    type: "folder",
    modified: new Date(),
    children: [
      { id: "2-1", name: "vacation.jpg", type: "file", extension: "jpg", size: 4500000, modified: new Date() },
    ],
  },
  {
    id: "3",
    name: "Music",
    type: "folder",
    modified: new Date(),
    children: [],
  },
  {
    id: "4",
    name: "Downloads",
    type: "folder",
    modified: new Date(),
    children: [
      { id: "4-1", name: "archive.zip", type: "file", extension: "zip", size: 125000000, modified: new Date() },
    ],
  },
  {
    id: "5",
    name: "Shell Scripts",
    type: "folder",
    modified: new Date(),
    children: defaultShellScripts.map(script => ({
      id: script.id,
      name: script.name,
      type: "file" as const,
      extension: script.extension,
      size: script.size,
      modified: new Date(),
    })),
  },
  { id: "6", name: "readme.md", type: "file", extension: "md", size: 2500, modified: new Date() },
];

const formatSize = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileManagerContent = () => {
  const [fileSystem, setFileSystem] = useState<FileItem[]>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["1"]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const getCurrentFolder = (): FileItem[] => {
    let current = fileSystem;
    for (const pathPart of currentPath) {
      const folder = current.find(f => f.id === pathPart);
      if (folder?.children) {
        current = folder.children;
      }
    }
    return current;
  };

  const getPathNames = (): { id: string; name: string }[] => {
    const names: { id: string; name: string }[] = [{ id: "", name: "Home" }];
    let current = fileSystem;
    for (const pathPart of currentPath) {
      const folder = current.find(f => f.id === pathPart);
      if (folder) {
        names.push({ id: folder.id, name: folder.name });
        if (folder.children) current = folder.children;
      }
    }
    return names;
  };

  const navigateTo = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item.id]);
      setSelectedItems([]);
    }
  };

  const navigateToPath = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
    setSelectedItems([]);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedFolders(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    const deleteFromTree = (items: FileItem[]): FileItem[] => {
      return items
        .filter(item => !selectedItems.includes(item.id))
        .map(item => ({
          ...item,
          children: item.children ? deleteFromTree(item.children) : undefined,
        }));
    };
    setFileSystem(deleteFromTree(fileSystem));
    setSelectedItems([]);
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName,
      type: "folder",
      modified: new Date(),
      children: [],
    };

    if (currentPath.length === 0) {
      setFileSystem([...fileSystem, newFolder]);
    } else {
      const addToPath = (items: FileItem[], pathIndex: number): FileItem[] => {
        return items.map(item => {
          if (item.id === currentPath[pathIndex]) {
            if (pathIndex === currentPath.length - 1) {
              return { ...item, children: [...(item.children || []), newFolder] };
            }
            return { ...item, children: addToPath(item.children || [], pathIndex + 1) };
          }
          return item;
        });
      };
      setFileSystem(addToPath(fileSystem, 0));
    }

    setNewFolderName("");
    setIsNewFolderDialogOpen(false);
  };

  const currentItems = getCurrentFolder().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSidebar = (items: FileItem[], level = 0) => {
    return items
      .filter(item => item.type === "folder")
      .map(item => {
        const isExpanded = expandedFolders.includes(item.id);
        const isInPath = currentPath.includes(item.id);
        const hasChildren = item.children?.some(c => c.type === "folder");

        return (
          <div key={item.id}>
            <div
              className={`flex items-center gap-1 py-1.5 px-2 rounded-lg cursor-pointer text-sm ${
                isInPath ? "bg-primary/20 text-primary" : "hover:bg-secondary"
              }`}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => {
                const pathIndex = currentPath.indexOf(item.id);
                if (pathIndex >= 0) {
                  setCurrentPath(currentPath.slice(0, pathIndex + 1));
                } else if (level === 0) {
                  setCurrentPath([item.id]);
                }
              }}
            >
              {hasChildren && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                  className="p-0.5 hover:bg-secondary rounded"
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              )}
              {!hasChildren && <span className="w-4" />}
              <Folder className={`w-4 h-4 ${isInPath ? "text-primary" : "text-amber-500"}`} />
              <span className="truncate">{item.name}</span>
            </div>
            {isExpanded && item.children && renderSidebar(item.children, level + 1)}
          </div>
        );
      });
  };

  return (
    <div className="flex h-[calc(100%-60px)]">
      {/* Sidebar */}
      <div className="w-56 border-r border-border/30 p-3 overflow-y-auto bg-secondary/10 scrollbar-thin">
        <div className="space-y-1">
          <div
            className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer text-sm ${
              currentPath.length === 0 ? "bg-primary/20 text-primary" : "hover:bg-secondary"
            }`}
            onClick={() => setCurrentPath([])}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer text-sm hover:bg-secondary text-muted-foreground">
            <HardDrive className="w-4 h-4" />
            <span>Disk</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-2 px-2">Folders</p>
          {renderSidebar(fileSystem)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-border/30">
          <div className="flex items-center gap-1">
            {getPathNames().map((path, idx) => (
              <div key={path.id} className="flex items-center">
                {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />}
                <button
                  onClick={() => navigateToPath(idx)}
                  className={`px-2 py-1 rounded text-sm ${
                    idx === getPathNames().length - 1 ? "font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {path.name}
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 h-8 w-40"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <Grid className={`w-4 h-4 ${viewMode === "grid" ? "text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className={`w-4 h-4 ${viewMode === "list" ? "text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsNewFolderDialogOpen(true)}>
              <FolderPlus className="w-4 h-4" />
            </Button>
            {selectedItems.length > 0 && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={deleteSelected}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {viewMode === "list" ? (
            <div className="space-y-1">
              {currentItems.map(item => {
                const Icon = getFileIcon(item);
                const isSelected = selectedItems.includes(item.id);

                return (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <div
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                          isSelected ? "bg-primary/20" : "hover:bg-secondary"
                        }`}
                        onClick={(e) => toggleSelect(item.id, e)}
                        onDoubleClick={() => navigateTo(item)}
                      >
                        <Icon className={`w-5 h-5 ${item.type === "folder" ? "text-amber-500" : "text-muted-foreground"}`} />
                        <span className="flex-1 truncate text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground w-20">{formatSize(item.size)}</span>
                        <span className="text-xs text-muted-foreground w-24">{item.modified.toLocaleDateString()}</span>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      {item.type === "folder" && (
                        <ContextMenuItem onClick={() => navigateTo(item)}>Open</ContextMenuItem>
                      )}
                      <ContextMenuItem><Copy className="w-4 h-4 mr-2" /> Copy</ContextMenuItem>
                      <ContextMenuItem><Move className="w-4 h-4 mr-2" /> Move</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="text-destructive" onClick={() => { setSelectedItems([item.id]); deleteSelected(); }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-3">
              {currentItems.map(item => {
                const Icon = getFileIcon(item);
                const isSelected = selectedItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer ${
                      isSelected ? "bg-primary/20" : "hover:bg-secondary"
                    }`}
                    onClick={(e) => toggleSelect(item.id, e)}
                    onDoubleClick={() => navigateTo(item)}
                  >
                    <Icon className={`w-10 h-10 ${item.type === "folder" ? "text-amber-500" : "text-muted-foreground"}`} />
                    <span className="text-xs text-center truncate w-full">{item.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {currentItems.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Folder is empty</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/30 text-xs text-muted-foreground">
          <span>{currentItems.length} items</span>
          {selectedItems.length > 0 && (
            <span>{selectedItems.length} selected</span>
          )}
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => e.key === "Enter" && createNewFolder()}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createNewFolder}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileManagerContent;
