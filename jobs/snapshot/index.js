import dotenv from "dotenv";
dotenv.config();
import knex from "knex";
import { writeFile } from "fs/promises";

const ARCHIVED_VIDEOS_COUNT =
  "SELECT sum(1) AS n FROM video WHERE archived = TRUE";
const WAITING_VIDEOS_COUNT =
  "SELECT sum(1) AS n FROM video WHERE archived = FALSE and attempts < 25 ";
const STUCK_VIDEOS =
  "SELECT sum(1) as n from video where archived = false and attempts > 25";
const TOTAL_RUNTIME = `
  SELECT
    ROUND(cast(SUM(duration::float) / 3600 as numeric ),2) as hours,
    ROUND(cast(SUM(duration::float) / (24*3600) as numeric ),2) as days
  FROM (
    SELECT json_extract_path_text(metadata, 'duration') as duration from video where archived = true
  ) d
  WHERE duration ~ E'^\\\\d+$'
`;
const LAST_ARCHIVED = `
    SELECT url, "lockExpiry" from video where archived = true ORDER BY "lockExpiry" DESC;
`;
const WORKERS_HEALTHCHECK = `
  select worker, last_seen from worker_healthcheck;
`;

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_URL,
  pool: { min: 0, max: 2 },
});

try {
  const archivedVideosCount = (await db.raw(ARCHIVED_VIDEOS_COUNT)).rows[0].n;
  const waitingVideosCount = (await db.raw(WAITING_VIDEOS_COUNT)).rows[0].n;
  const stuckVideos = (await db.raw(STUCK_VIDEOS)).rows[0].n;
  const totalRuntime = (await db.raw(TOTAL_RUNTIME)).rows[0];
  const lastArchived = (await db.raw(LAST_ARCHIVED)).rows[0];
  const workersHealthCheck = (await db.raw(WORKERS_HEALTHCHECK)).rows;
  const content = JSON.stringify({
    updated: new Date(),
    archivedVideosCount,
    waitingVideosCount,
    stuckVideos,
    totalRuntime,
    lastArchived,
    workersHealthCheck,
  });
  console.log(content);
  await writeFile("../../docs/_data/snapshot.json", content);
} catch (error) {
  console.error(error);
} finally {
  db?.destroy();
}
