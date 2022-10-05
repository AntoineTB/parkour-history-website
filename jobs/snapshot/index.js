import dotenv from "dotenv";
dotenv.config();
import knex from "knex";
import { writeFile } from "fs/promises";

console.log(process.env.PG_CONNECTION_URL.slice(0,8));

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_URL,
  // searchPath: ['knex', 'public'],
  pool: { min: 0, max: 2 },
});

try {
  const rows = await db.raw(
    'SELECT sum(1) AS "archivedVideosCount" FROM video WHERE archived = TRUE'
  );
  const archivedVideosCount = rows.rows[0].archivedVideosCount;
  const content = JSON.stringify({
    archivedVideosCount,
  });
  await writeFile("../../docs/_data/snapshot.json", content);
} catch (error) {
  console.error(error);
} finally {
  db?.destroy();
}
