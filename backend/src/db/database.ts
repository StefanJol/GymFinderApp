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

export async function removeFavorite(userId: number, gymId: number) {
  await pool.query(
    "DELETE FROM user_favorite_gyms WHERE user_id = ? AND gym_id = ?",
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
// Adding and Reading reviews of gyms
export async function addReview(userId: number, gymId: number, rating: number, comment: string) {
  const [result] = await pool.query(
    "INSERT INTO review (user_id, gym_id, rating, comment) VALUES (?, ?, ?, ?)",
    [userId, gymId, rating, comment]
  );
  return result;
}

export async function getGymReviews(gymId: number) {
  const [rows]: any = await pool.query(
    "SELECT r.*, u.user_name FROM review r JOIN user_login u ON r.user_id = u.id WHERE r.gym_id = ? ORDER BY r.created_at DESC",
    [gymId]
  );
  return rows;
}

// Admin insert new gym function
export async function addGym(name: string, city: string) {
  const [result] = await pool.query(
    "INSERT INTO gym (name, city, is_active) VALUES (?, ?, 1)",
    [name, city]
  );
  return result;
}

// Fetch all members except the logged-in user
// Fetch all members with their connection status relative to the current user
export async function getAllMembers(currentUserId: number) {
  const [rows]: any = await pool.query(
    `SELECT 
      u.id, 
      u.user_name, 
      u.user_email,
      CASE 
        WHEN (c.sender_id = ? OR c.receiver_id = ?) AND c.status = 'accepted' THEN 'accepted'
        WHEN c.sender_id = ? AND c.status = 'pending' THEN 'pending'
        WHEN c.receiver_id = ? AND c.status = 'pending' THEN 'incoming'
        ELSE 'none'
      END AS connection_status
     FROM user_login u
     LEFT JOIN user_connection c ON 
       (c.sender_id = ? AND c.receiver_id = u.id) OR 
       (c.receiver_id = ? AND c.sender_id = u.id)
     WHERE u.id != ?`,
    [
      currentUserId, currentUserId, // checking accepted status - yeah i needed help here. did not know what to do
      currentUserId,                 // checking if current user sent a pending request
      currentUserId,                 // checking if current user received a pending request
      currentUserId, currentUserId, // LEFT JOIN matching rules
      currentUserId                  // exclude the logged-in user themselves
    ]
  );
  return rows;
}

// Create a pending connection request
export async function sendConnectionRequest(senderId: number, receiverId: number) {
  await pool.query(
    "INSERT INTO user_connection (sender_id, receiver_id, status) VALUES (?, ?, 'pending')",
    [senderId, receiverId]
  );
}

// Fetch pending requests received by a specific user
export async function getPendingRequests(receiverId: number) {
  const [rows]: any = await pool.query(
    "SELECT c.id AS connection_id, u.user_name FROM user_connection c JOIN user_login u ON c.sender_id = u.id WHERE c.receiver_id = ? AND c.status = 'pending'",
    [receiverId]
  );
  return rows;
}

// Accept a request and change status to 'accepted'
export async function acceptConnectionRequest(connectionId: number) {
  await pool.query(
    "UPDATE user_connection SET status = 'accepted' WHERE id = ?",
    [connectionId]
  );
}

// Delete the connection between two users
export async function removeWorkoutPartner(userId: number, partnerId: number) {
  await pool.query(
    `DELETE FROM user_connection 
     WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)`,
    [userId, partnerId, partnerId, userId]
  );
}
export default pool;