import { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")

    const [password, setPassword] = useState("")

    const [loginMessage, setLoginMessage] = useState("")

    const [loading, setLoading] = useState(false)

    const handleLogin = async (user: string, pass: string): Promise<void> => {
        if (!user || !pass) {
            setLoginMessage("Please enter both username and password")
            return
        }

        setLoading(true)
        setLoginMessage("")

        try {
            const response = await fetch("http://localhost:5267/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: user,
                    password: pass
                })
            })

            const data = await response.json()

            if (response.ok && data.token) {
                // Store token in localStorage
                localStorage.setItem("authToken", data.token)
                localStorage.setItem("username", data.username)
                navigate("/main-page")
            } else {
                setLoginMessage(data.message || "Invalid credentials")
            }
        } catch (error) {
            console.error("Login error:", error)
            setLoginMessage("Connection error. Please try again.")
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="register-textboxes">
            <h1>Goedemiddag</h1>

            <input type="text" id="username" name="username" placeholder="Gebruikersnaam" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" id="pass" name="pass" placeholder="Wachtwoord" onChange={(e) => setPassword(e.target.value)} />
            <div className="login-wrapper">
                <button type="button" onClick={() => handleLogin(username, password)}>Login</button>
            </div>

            {loginMessage && <h2 className='login-login-message'>{loginMessage}</h2>}

            <button className="textbutton" onClick={() => navigate("/registreer")}>Registreer</button>
            <button className="textbutton" onClick={() => navigate("/forgot-pw")}>Wachtwoord vergeten</button>
        </div>
    )
}

export default Login
