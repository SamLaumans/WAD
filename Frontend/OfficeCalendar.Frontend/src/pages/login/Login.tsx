import { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import userData from '../../assets/users.json';

interface User {
    userName: string;
    name: string;
    password: string;
}

const users: User[] = userData.users;

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")

    const [password, setPassword] = useState("")

    const [loginMessage, setLoginMessage] = useState("");

    const checkPassword = (user: string, pass: string): boolean => {
        if (users[0].userName == user && users[0].password == pass) {
            return true;
        }
        else return false;
    }

    const checkFields = (user: string, pass: string): void => {

        if (username && password && checkPassword(user, pass))
            navigate("/main-page")
        else setLoginMessage("Invalid credentials")
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
