export default function Login() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Login</h1>
        <form>
          <div>
            <label>Username</label>
            <input type="text" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}