import { useState } from "react";
import { StickyNote, Plus, Folder, Bold, Italic, List, ListOrdered, Code, Quote, Heading1, Heading2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultCategories = ["Personal", "Work", "Ideas", "Tasks"];

const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome Note",
      content: "# Welcome to Notes\n\nThis is your **markdown-enabled** note-taking area. You can:\n\n- Write in *markdown*\n- Organize by categories\n- Create quick notes\n\n> Start taking notes!",
      category: "Personal",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState(defaultCategories);
  const [isEditing, setIsEditing] = useState(false);

  const createNote = (category: string = "Personal") => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates, updatedAt: new Date() });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(notes.find(n => n.id !== id) || null);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    if (!selectedNote) return;
    const textarea = document.getElementById("note-content") as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = selectedNote.content.substring(start, end);
    const newContent = 
      selectedNote.content.substring(0, start) + 
      prefix + selectedText + suffix + 
      selectedNote.content.substring(end);
    
    updateNote(selectedNote.id, { content: newContent });
  };

  const filteredNotes = selectedCategory === "All" 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  const renderMarkdown = (content: string) => {
    let html = content
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 my-2 text-muted-foreground italic">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, '<br />');
    
    return html;
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StickyNote className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Folder className="w-4 h-4" />
                {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory("All")}>
                All Notes
              </DropdownMenuItem>
              {categories.map(cat => (
                <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => createNote()}>
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Notes List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => { setSelectedNote(note); setIsEditing(false); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedNote?.id === note.id 
                  ? "bg-primary/10 border-primary/50" 
                  : "bg-card border-border/50 hover:bg-card-hover"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {note.content.replace(/[#*>`-]/g, '').substring(0, 80)}...
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                  {note.category}
                </span>
              </div>
            </div>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notes yet</p>
            </div>
          )}
        </div>

        {/* Note Editor/Viewer */}
        <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card overflow-hidden">
          {selectedNote ? (
            <>
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between p-3 border-b border-border/50 bg-secondary/30">
                <div className="flex items-center gap-1">
                  {isEditing && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("**", "**")}>
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("*", "*")}>
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("# ")}>
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("## ")}>
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("- ")}>
                        <List className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("1. ")}>
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("`", "`")}>
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertMarkdown("> ")}>
                        <Quote className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={isEditing ? "hero" : "outline"} 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Preview" : "Edit"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteNote(selectedNote.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Note Content */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={selectedNote.title}
                      onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                      placeholder="Note title..."
                      className="text-lg font-semibold bg-transparent border-none p-0 focus-visible:ring-0"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Category:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            {selectedNote.category}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {categories.map(cat => (
                            <DropdownMenuItem 
                              key={cat} 
                              onClick={() => updateNote(selectedNote.id, { category: cat })}
                            >
                              {cat}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Textarea
                      id="note-content"
                      value={selectedNote.content}
                      onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                      placeholder="Start writing in markdown..."
                      className="min-h-[250px] bg-transparent border-none resize-none focus-visible:ring-0 font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-secondary">{selectedNote.category}</span>
                      <span>Updated {selectedNote.updatedAt.toLocaleDateString()}</span>
                    </div>
                    <div 
                      className="prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.content) }}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center">
                <StickyNote className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
