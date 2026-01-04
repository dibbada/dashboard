import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Plus, Trash2, ExternalLink, Link as LinkIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Product {
    id: string;
    name: string;
    brand?: string;
    image?: string;
    nutrition?: string;
    currentPrice?: string;
    productUrl?: string;
}

const ShoppingWidget = () => {
    const [items, setItems] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const [selectedItemForUrl, setSelectedItemForUrl] = useState<Product | null>(null);
    const [urlInput, setUrlInput] = useState("");

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/shopping/list');
            if (res.ok) setItems(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const res = await fetch(`/api/shopping/search?query=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                setSearchResults(await res.json());
            }
        } catch (e) {
            console.error(e);
        }
        setIsSearching(false);
    };

    const addItem = async (item: Product) => {
        try {
            await fetch('/api/shopping/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            fetchItems();
            setSearchQuery("");
            setSearchResults([]);
        } catch (e) {
            console.error(e);
        }
    };

    const removeItem = async (id: string) => {
        try {
            await fetch(`/api/shopping/${id}`, { method: 'DELETE' });
            fetchItems();
        } catch (e) {
            console.error(e);
        }
    };

    const saveUrl = async () => {
        if (!selectedItemForUrl) return;
        try {
            await fetch(`/api/shopping/${selectedItemForUrl.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productUrl: urlInput })
            });
            fetchItems();
            setIsUrlDialogOpen(false);
            setUrlInput("");
        } catch (e) {
            console.error(e);
        }
    };

    const openUrlDialog = (item: Product) => {
        setSelectedItemForUrl(item);
        setUrlInput(item.productUrl || "");
        setIsUrlDialogOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bento-item h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-semibold">Smart Shopping</h3>
                </div>
            </div>

            <div className="relative mb-4">
                <div className="flex gap-2">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="h-8 text-xs"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button size="icon" className="h-8 w-8" onClick={handleSearch} disabled={isSearching}>
                        <Search className="w-4 h-4" />
                    </Button>
                </div>

                {searchResults.length > 0 && (
                    <div className="absolute top-9 left-0 right-0 z-50 bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
                        {searchResults.map(result => (
                            <div
                                key={result.id}
                                className="flex items-center gap-3 p-2 hover:bg-secondary cursor-pointer"
                                onClick={() => addItem(result)}
                            >
                                {result.image ? (
                                    <img src={result.image} alt={result.name} className="w-8 h-8 object-contain rounded bg-white" />
                                ) : (
                                    <div className="w-8 h-8 bg-secondary rounded" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{result.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{result.brand}</p>
                                </div>
                                <Plus className="w-4 h-4 text-primary" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1 -mr-2 pr-2">
                <div className="space-y-2">
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 rounded-xl bg-secondary/30 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded bg-white" />
                                ) : (
                                    <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <div className="flex items-center gap-2">
                                        {item.currentPrice && (
                                            <span className="text-xs font-bold text-success">
                                                {item.currentPrice}
                                            </span>
                                        )}
                                        {item.nutrition && (
                                            <span className="text-[10px] px-1 rounded bg-secondary text-muted-foreground uppercase">
                                                Score: {item.nutrition}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => openUrlDialog(item)}
                                >
                                    <LinkIcon className={`w-3 h-3 ${item.productUrl ? 'text-primary' : 'text-muted-foreground'}`} />
                                </Button>
                                {item.productUrl && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                        <a href={item.productUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">List is empty</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Track Price</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">
                            Paste a URL from a supported store to track the price for <strong>{selectedItemForUrl?.name}</strong>.
                        </p>
                        <Input
                            placeholder="https://..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <Button onClick={saveUrl} className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Save & Check Price
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default ShoppingWidget;
