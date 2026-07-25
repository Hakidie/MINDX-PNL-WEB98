import { writeFile, readFile } from 'fs/promises';

// Read and parse the JSON file manually (safer/more portable than import assertions)
const raw = await readFile('./database.json', 'utf-8');
const { customers, orders, products } = JSON.parse(raw);

const db = { customers, orders, products };

await writeFile('./db.json', JSON.stringify(db, null, 2));

console.log('✅ db.json created successfully');
