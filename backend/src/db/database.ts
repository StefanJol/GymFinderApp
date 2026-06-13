import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export interface UserLogin extends RowDataPacket {
  id: number;
  user_name: string;
  user_email: string;
  user_password: string;
}

//  Fetch user by username
export const authUser = async (username: string): Promise<UserLogin[]> => {
  const [rows] = await pool.query<UserLogin[]>(
    "SELECT * FROM user_login WHERE user_name = ?",
    [username]
  );
  return rows;
};

//  Insert new user
export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO user_login (user_name, user_email, user_password) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );
  return result;
};
// searching for gymmss
export async function searchGyms(city: string) {
  const [rows]: any = await pool.query(
    "SELECT * FROM gym WHERE city LIKE ? AND is_active = 1", 
    [`%${city}%`]
  );
  return rows;
}
// Favorite gyms functions
export async function addFavorite(userId: number, gymId: number) {
  await pool.query(
    "INSERT IGNORE INTO user_favorite_gyms (user_id, gym_id) VALUES (?, ?)",
    [userId, gymId]
  );
}

export async function getFavorites(userId: number) {
  const [rows]: any = await pool.query(
    "SELECT g.* FROM gym g JOIN user_favorite_gyms f ON g.id = f.gym_id WHERE f.user_id = ?",
    [userId]
  );
  return rows;
}
export default pool;