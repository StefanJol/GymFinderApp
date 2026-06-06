export default function Register() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Register</h1>
        <form>
          <div>
            <label>Username</label>
            <input type="text" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </section>
    </main>
  );
}