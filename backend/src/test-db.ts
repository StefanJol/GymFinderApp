import dotenv from "dotenv";
import path from "path";

// 1. Force the environment variables into memory FIRST
dotenv.config({ path: path.resolve("/workspace/GymFinderApp/backend/.env") });

async function testConnection() {
  console.log("🔄 Attempting to connect to MariaDB with loaded credentials...");
  console.log(`Checking DB_USER value: "${process.env.DB_USER}"`);
  
  try {
    // 2. Import the database module and cast it to 'any' to bypass strict TS type checking
    const databaseModule: any = await import("./db/database.js");
    const pool = databaseModule.default;

    // 3. Run a test query
    const [status] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ Database connection successful!");

    console.log("📥 Attempting to insert a test record...");
    const [insertResult]: any = await pool.query(
      "INSERT INTO user_login (user_name, user_email, user_password) VALUES (?, ?, ?)",
      ["db_test_user", "test@db.com", "mypassword123"]
    );

    if (insertResult.affectedRows === 1) {
      console.log("🎉 SUCCESS! Data was successfully written to MariaDB.");
    }
  } catch (error: any) {
    console.error("❌ DATABASE ERROR:", error.message);
  } finally {
    process.exit();
  }
}

// Execute the wrapper function
testConnection();