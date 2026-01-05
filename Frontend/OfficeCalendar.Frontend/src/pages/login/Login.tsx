import { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")

    const [password, setPassword] = useState("")

    const [loginMessage, setLoginMessage] = useState("");

    const checkFields = async (user: string, pass: string): Promise<void> => {
        if (!username || !password) {
            setLoginMessage("Please enter username and password");
            return;
        }

        try {
            const res = await fetch('http://localhost:5267/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass }),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate("/main-page");
            } else {
                setLoginMessage("Invalid credentials");
            }
        } catch (error) {
            setLoginMessage("Login failed");
        }
    };

    return (
        <div className="register-textboxes">
            <h1>Goedemiddag</h1>

            <input type="text" id="username" name="username" placeholder="Gebruikersnaam" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" id="pass" name="pass" placeholder="Wachtwoord" onChange={(e) => setPassword(e.target.value)} />
            <div className="login-wrapper">
                <button type="button" onClick={() => checkFields(username, password)}>Login</button>
            </div>

            {loginMessage && <h2 className='login-login-message'>{loginMessage}</h2>}

            <button className="textbutton" onClick={() => navigate("/registreer")}>Registreer</button>
            <button className="textbutton" onClick={() => navigate("/forgot-pw")}>Wachtwoord vergeten</button>
        </div>
    )
}

export default Login
