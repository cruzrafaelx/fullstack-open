const Login = ({ username, setUsername, password, setPassword, handleLogin }) => {

    return (
        <div >
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                <label>
                    username
                    <input
                    type="text"
                    value={username}
                    onChange={({target}) => setUsername(target.value)} //explain this line
                    />
                </label>
                </div>

                <div>
                <label>
                    password
                    <input
                    type="password"
                    value={password}
                    onChange={({target}) => setPassword(target.value)} //explain this line
                    />
                </label>
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    )
  }

  export default Login