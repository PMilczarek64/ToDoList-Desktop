import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

export const db = new PouchDB('todolist-db');

export async function ensureIndexes() {
  await db.createIndex({ index: { fields: ['type'] } });
  await db.createIndex({ index: { fields: ['type', 'listId'] } });
  await db.createIndex({ index: { fields: ['type', 'categoryId'] } });
  await db.createIndex({ index: { fields: ['type', 'title'] } });
  await db.createIndex({ index: { fields: ['type', 'isFavorite'] } });
}
