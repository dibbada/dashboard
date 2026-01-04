import { useState } from "react";
import { ShoppingCart, Plus, TrendingUp, TrendingDown, Minus, Trash2, ExternalLink, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PriceHistory {
  price: number;
  date: Date;
}

interface TrackedItem {
  id: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  url: string;
  store: string;
  priceHistory: PriceHistory[];
  addedAt: Date;
}

const sampleItems: TrackedItem[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Headphones",
    currentPrice: 349.99,
    targetPrice: 299.99,
    url: "https://amazon.com",
    store: "Amazon",
    priceHistory: [
      { price: 399.99, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { price: 379.99, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { price: 359.99, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { price: 349.99, date: new Date() },
    ],
    addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "MacBook Pro 14\" M3",
    currentPrice: 1999.00,
    targetPrice: 1799.00,
    url: "https://apple.com",
    store: "Apple Store",
    priceHistory: [
      { price: 1999.00, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { price: 1999.00, date: new Date() },
    ],
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Logitech MX Master 3S",
    currentPrice: 89.99,
    targetPrice: 79.99,
    url: "https://bestbuy.com",
    store: "Best Buy",
    priceHistory: [
      { price: 99.99, date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { price: 94.99, date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
      { price: 89.99, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { price: 89.99, date: new Date() },
    ],
    addedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
];

const ShoppingTracker = () => {
  const [items, setItems] = useState<TrackedItem[]>(sampleItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TrackedItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    currentPrice: "",
    targetPrice: "",
    url: "",
    store: "",
  });

  const addItem = () => {
    if (newItem.name && newItem.currentPrice) {
      const item: TrackedItem = {
        id: Date.now().toString(),
        name: newItem.name,
        currentPrice: parseFloat(newItem.currentPrice),
        targetPrice: parseFloat(newItem.targetPrice) || parseFloat(newItem.currentPrice) * 0.9,
        url: newItem.url,
        store: newItem.store || "Unknown",
        priceHistory: [{ price: parseFloat(newItem.currentPrice), date: new Date() }],
        addedAt: new Date(),
      };
      setItems([...items, item]);
      setNewItem({ name: "", currentPrice: "", targetPrice: "", url: "", store: "" });
      setIsAddDialogOpen(false);
    }
  };

  const updatePrice = (id: string, newPrice: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          currentPrice: newPrice,
          priceHistory: [...item.priceHistory, { price: newPrice, date: new Date() }],
        };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const getPriceChange = (item: TrackedItem) => {
    if (item.priceHistory.length < 2) return 0;
    const oldest = item.priceHistory[0].price;
    return ((item.currentPrice - oldest) / oldest) * 100;
  };

  const getLowestPrice = (item: TrackedItem) => {
    return Math.min(...item.priceHistory.map(h => h.price));
  };

  const getHighestPrice = (item: TrackedItem) => {
    return Math.max(...item.priceHistory.map(h => h.price));
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Shopping Tracker</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Track New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Item Name</label>
                <Input 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Current Price</label>
                  <Input 
                    type="number"
                    value={newItem.currentPrice}
                    onChange={(e) => setNewItem({...newItem, currentPrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Price</label>
                  <Input 
                    type="number"
                    value={newItem.targetPrice}
                    onChange={(e) => setNewItem({...newItem, targetPrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Store</label>
                <Input 
                  value={newItem.store}
                  onChange={(e) => setNewItem({...newItem, store: e.target.value})}
                  placeholder="Amazon, Best Buy, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Product URL</label>
                <Input 
                  value={newItem.url}
                  onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <Button onClick={addItem} className="w-full">Start Tracking</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const priceChange = getPriceChange(item);
            const isAtTarget = item.currentPrice <= item.targetPrice;

            return (
              <div 
                key={item.id} 
                className={`rounded-xl border p-4 transition-all cursor-pointer ${
                  selectedItem?.id === item.id 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/50 bg-card hover:bg-card-hover"
                } ${isAtTarget ? "ring-2 ring-green-500/30" : ""}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      {isAtTarget && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                          Target Reached!
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.store}</p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold">${item.currentPrice.toFixed(2)}</div>
                    <div className={`flex items-center justify-end gap-1 text-sm ${
                      priceChange < 0 ? "text-green-400" : priceChange > 0 ? "text-red-400" : "text-muted-foreground"
                    }`}>
                      {priceChange < 0 ? <TrendingDown className="w-3 h-3" /> : priceChange > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {Math.abs(priceChange).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground">
                    Target: <span className="text-foreground">${item.targetPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1">
                    {item.url && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank'); }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No items being tracked</p>
              <p className="text-sm">Add items to start tracking prices</p>
            </div>
          )}
        </div>

        {/* Price History Panel */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          {selectedItem ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Price History</h3>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm text-muted-foreground mb-1">{selectedItem.name}</h4>
                <div className="text-2xl font-bold">${selectedItem.currentPrice.toFixed(2)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Lowest</p>
                  <p className="font-semibold text-green-400">${getLowestPrice(selectedItem).toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Highest</p>
                  <p className="font-semibold text-red-400">${getHighestPrice(selectedItem).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedItem.priceHistory.slice().reverse().map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">
                      {entry.date.toLocaleDateString()}
                    </span>
                    <span className="font-medium">${entry.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/30">
                <label className="text-sm font-medium mb-2 block">Update Price</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="New price"
                    id={`price-${selectedItem.id}`}
                  />
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById(`price-${selectedItem.id}`) as HTMLInputElement;
                      if (input?.value) {
                        updatePrice(selectedItem.id, parseFloat(input.value));
                        input.value = "";
                      }
                    }}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select an item to view price history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingTracker;
