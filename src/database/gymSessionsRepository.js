import { dbGet, dbPut, dbGetAll } from './db.js';

export async function addGymSession(session) {
  // session: { date, exercises: [{ name, sets, reps, weight }], notes }
  const id = crypto.randomUUID();
  const newSession = {
    id,
    ...session
  };
  await dbPut('gymSessions', newSession);
  return id;
}

export async function getGymSession(id) {
  return await dbGet('gymSessions', id);
}

export async function getAllGymSessions() {
  return await dbGetAll('gymSessions');
}
