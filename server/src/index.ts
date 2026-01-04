import express from 'express';
import cors from 'cors';
import si from 'systeminformation';
import { exec } from 'child_process';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for shopping list (in a real app, use a DB)
let shoppingList: any[] = [];

// System Stats Endpoint
app.get('/api/system', async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const osInfo = await si.osInfo();

        res.json({
            cpu: cpu.currentLoad,
            mem: {
                total: mem.total,
                used: mem.used,
                active: mem.active,
                available: mem.available
            },
            os: {
                platform: osInfo.platform,
                distro: osInfo.distro,
                release: osInfo.release
            },
            uptime: osInfo.uptime // This wasn't in osInfo type by default in older versions but often is available, or use si.time().uptime
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch system stats' });
    }
});

// Terminal Execute Endpoint (Simple)
app.post('/api/terminal/exec', (req, res) => {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: 'No command provided' });

    // SECURITY WARNING: This allows executing arbitrary commands on the host. 
    // For a personal dashboard this is the point, but be careful.

    exec(command, { cwd: process.env.HOME }, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr || error.message, isError: true });
        }
        res.json({ output: stdout, isError: false });
    });
});

// --- Shopping List Endpoints ---

// Search OpenFoodFacts
app.get('/api/shopping/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });

    try {
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`);
        const products = response.data.products.map((p: any) => ({
            id: p.code,
            name: p.product_name,
            brand: p.brands,
            image: p.image_front_small_url || p.image_front_url,
            nutrition: p.nutriscore_grade
        })).slice(0, 5);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search products' });
    }
});

// Get List
app.get('/api/shopping/list', (req, res) => {
    res.json(shoppingList);
});

// Add Item
app.post('/api/shopping/add', (req, res) => {
    const item = req.body;
    if (!item.id || !item.name) return res.status(400).json({ error: 'Invalid item' });

    if (!shoppingList.find(i => i.id === item.id)) {
        shoppingList.push({
            ...item,
            addedAt: new Date(),
            targetPrice: null,
            currentPrice: null,
            productUrl: null
        });
    }
    res.json(shoppingList);
});

// Remove Item
app.delete('/api/shopping/:id', (req, res) => {
    shoppingList = shoppingList.filter(i => i.id !== req.params.id);
    res.json(shoppingList);
});

// Update Item (e.g. set URL for tracking)
app.patch('/api/shopping/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const idx = shoppingList.findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Item not found' });

    // If URL is being updated, try to fetch price (Simple Scraper Logic)
    if (updates.productUrl && updates.productUrl !== shoppingList[idx].productUrl) {
        try {
            // Basic scraping attempt (Generic)
            const response = await axios.get(updates.productUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DailyHubbot/1.0)' }
            });
            const $ = cheerio.load(response.data);

            // Heuristic to find price: verify common price classes or meta tags
            // This is highly experimental and specific to sites
            let price = null;

            // Meta property check
            const metaPrice = $('meta[property="product:price:amount"]').attr('content');
            if (metaPrice) price = metaPrice;

            updates.currentPrice = price || "Check Site";
        } catch (e) {
            console.error("Scraping failed", e);
            updates.currentPrice = "Error";
        }
    }

    shoppingList[idx] = { ...shoppingList[idx], ...updates };
    res.json(shoppingList[idx]);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
