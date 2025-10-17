import './Forgot-Password.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Forgot_Password() {

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleClick = () => {
        if (email)
            setMessage("If the email exists an email to reset your password has been sent");
        else setMessage("Please enter an email");
    };

    return (
        <div className="forgot-password">

            <div className='input-email'>
                <input type="text" id="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button className='forgot-pw-button' onClick={handleClick}>
                Reset wachtwoord
            </button>

            {message && <h1>{message}</h1>}

            <button className="login-button" onClick={() => navigate("/login")}>Login</button>
        </div>
    );
}

export default Forgot_Password;
