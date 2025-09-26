
const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => (
    <form onSubmit={handleLogin}>
    <div>
        <label>
          username
          <input
            value={username}
            onChange={({target}) => setUsername(target.value)}
          />
        </label>
    </div>
    <div>
      <label>
        password
        <input
          type='password'
          value={password}
          onChange={({target}) => setPassword(target.value)}
        />
      </label>
    </div>
    <button type='submit'>Login</button>
    </form>
  )

  export default LoginForm