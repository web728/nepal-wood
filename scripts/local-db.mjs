// Starts a local MongoDB for development on mongodb://127.0.0.1:27017, with data kept in ./.data/db.
// The first run downloads the official mongod binary (~70 MB) from fastdl.mongodb.org.
// Production uses MongoDB Atlas instead (set MONGODB_URI).
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dbPath = fileURLToPath(new URL('../.data/db', import.meta.url));
fs.mkdirSync(dbPath, { recursive: true });

const server = await MongoMemoryServer.create({
  instance: { port: 27017, ip: '127.0.0.1', dbPath, storageEngine: 'wiredTiger' },
});
console.log(`Local MongoDB ready at ${server.getUri()} (data: ${dbPath})`);

const stop = async () => { await server.stop({ doCleanup: false }); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
setInterval(() => {}, 1 << 30);
