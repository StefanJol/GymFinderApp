import * as mysql from "mysql2";

// Force the pool into an 'any' type to completely silence the compiler
const pool: any = mysql.createPool({
  host: "db",       
  user: "studenti",            
  password: "S039C8R7",        
  database: "SISIII2026_89241335", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export interface UserLogin {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
}

export const authUser = async (username: string): Promise<UserLogin[]> => {
  const [rows] = await pool.promise().query(
    "SELECT * FROM user WHERE username = ?",
    [username]
  );
  return rows as UserLogin[];
};

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<any> => {
  const [result] = await pool.promise().query(
    "INSERT INTO user (username, email, password_hash, role) VALUES (?, ?, ?, 'regular')",
    [username, email, passwordHash]
  );
  return result;
};