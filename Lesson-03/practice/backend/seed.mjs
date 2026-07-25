import { writeFile } from 'fs';
import { customers, orders, products } from './database.json';


const db = { customers, orders, products }

await writeFile('./db.json', JSON.stringify(db, null, 2));

console.log('✅ db.json created successfully');
