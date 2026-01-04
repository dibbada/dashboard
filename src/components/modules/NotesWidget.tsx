import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Search, 
  Bold, 
  Italic, 
  List, 
  Heading, 
  Code,
  Trash2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesWidget = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Server Setup Notes",
      content: "# Oracle Cloud Setup\n\n- Configured **Dokploy** for container management\n- Set up **Prowler** for security audits\n- Tailscale for secure access",
      category: "tech",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      title: "Project Ideas",
      content: "## Dashboard Features\n\n1. Add weather widget\n2. Integrate with Notion API\n3. Create mobile app version",
      category: "ideas",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editContent, setEditContent] = useState("");

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      category: "general",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setEditContent("");
    setIsEditing(true);
  };

  const updateNote = () => {
    if (!selectedNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id 
        ? { ...note, content: editContent, updatedAt: new Date() }
        : note
    ));
    setSelectedNote(prev => prev ? { ...prev, content: editContent } : null);
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(notes.find(n => n.id !== id) || null);
    }
  };

  const insertMarkdown = (syntax: string) => {
    setEditContent(prev => prev + syntax);
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-secondary text-xs font-mono">$1</code>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bento-item h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-semibold">Notes</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={createNote}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-1 gap-3 min-h-0">
        {/* Notes list */}
        <div className="w-1/3 flex flex-col">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-7 pl-7 text-xs"
            />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 pr-2">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedNote(note);
                    setEditContent(note.content);
                    setIsEditing(false);
                  }}
                  className={`
                    p-2 rounded-lg cursor-pointer transition-colors group
                    ${selectedNote?.id === note.id 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'hover:bg-secondary/50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-medium truncate flex-1">{note.title}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {note.content.replace(/[#*`\-]/g, '').slice(0, 40)}...
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Note editor/viewer */}
        <div className="flex-1 flex flex-col min-h-0 rounded-lg bg-secondary/30 p-3">
          {selectedNote ? (
            <>
              {/* Toolbar */}
              {isEditing && (
                <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border/30">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertMarkdown("**bold**")}>
                    <Bold className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertMarkdown("*italic*")}>
                    <Italic className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertMarkdown("# ")}>
                    <Heading className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertMarkdown("- ")}>
                    <List className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => insertMarkdown("`code`")}>
                    <Code className="w-3 h-3" />
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={updateNote}>
                    Save
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Content area */}
              <ScrollArea className="flex-1">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full min-h-[150px] bg-transparent text-xs resize-none focus:outline-none font-mono"
                    placeholder="Write your note in Markdown..."
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => {
                      setEditContent(selectedNote.content);
                      setIsEditing(true);
                    }}
                    className="text-xs cursor-text prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.content) }}
                  />
                )}
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
              Select or create a note
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotesWidget;
