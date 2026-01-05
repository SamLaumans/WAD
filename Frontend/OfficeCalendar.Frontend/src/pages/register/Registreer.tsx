import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import './Registreer.css'

function Registreer() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");
    const [emailErrors, setEmailErrors] = useState<string[]>([]);

    const [createdMessage, setCreatedMessage] = useState("");

    const checkInputs = (): boolean => {
        if (username && password && name && email)
            return true;
        else return false;
    };

    const handleRegistration = async () => {
        if (!checkInputs() || passwordErrors.length > 0 || emailErrors.length > 0) {
            setCreatedMessage("Some fields are empty or incorrect");
            return;
        }

        try {
            const res = await fetch('http://localhost:5267/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password, email: email, nickname: name }),
            });
            
            console.log('Response status:', res.status, 'OK:', res.ok);
            const data = await res.json();
            console.log('Response data:', data);
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                console.log('Registration successful, redirecting...');
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } else {
                setCreatedMessage(data.message || "Registration failed");
            }
        } catch (error) {
            console.error('Error:', error);
            setCreatedMessage("Registration failed");
        }
    };


    const passRules = {
        minLength: 8,
        requireUpper: /[A-Z]/,
        requireLower: /[a-z]/,
        requireDigit: /\d/,
        requireSpecial: /[!@#$%^&*(),.?:{}|<>]/,
        hasSpaces: /^\S+$/
    };

    const emailRules = {
        emailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        hasSpaces: /^\S+$/
    };

    function checkPassword(value: string): string[] {

        const errors: string[] = [];

        if (value.length < passRules.minLength) {
            errors.push(`Uw wachtwoord moet minimaal ${passRules.minLength} karakters lang zijn.`);
        }
        if (!passRules.requireUpper.test(value)) {
            errors.push('Bevat hoofdletter ❌');
        }
        if (!passRules.requireLower.test(value)) {
            errors.push('Bevat kleine letter ❌');
        }
        if (!passRules.requireDigit.test(value)) {
            errors.push('Bevat getal ❌');
        }
        if (!passRules.requireSpecial.test(value)) {
            errors.push('Bevat een speciaal karakter ([!@#$%^&*(),.?:{}|<>]) ❌');
        }
        if (!passRules.hasSpaces.test(value)) {
            errors.push(`Geen spaties toegestaan`);
        }
        return errors;
    }

    function checkEmail(value: string): string[] {
        const errors = [];
        if (!emailRules.emailFormat.test(value)) {
            errors.push(`Voer een geldig e-mail adres in.`);
        }
        if (!emailRules.hasSpaces.test(value)) {
            errors.push(`Geen spaties toegestaan`);
        }

        return errors;
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setPassword(val);
        setPasswordErrors(checkPassword(val));
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setEmail(val);
        setEmailErrors(checkEmail(val));
    }

    return (
        <div className="register-wrapper">
            <div className='register-textboxes'>
                <h1>Goedemiddag</h1>
                <div className='textbox-wrapper'>
                    <input type="text" id="username" name="username" placeholder="Gebruikersnaam" onChange={(e) => setUsername(e.target.value)} />

                    <div className='password-wrapper'>
                        <input type="password" id="pass" name="pass" placeholder="Wachtwoord" value={password} onChange={handlePasswordChange} />
                        {password && passwordErrors.length > 0 && <div id="feedback">{passwordErrors.map((err, idx) => (<div key={idx}>{err}</div>))}</div>}
                    </div>

                    <input type="text" id="name" name="name" placeholder="Naam" onChange={(e) => setName(e.target.value)} />

                    <div className='email-wrapper'>
                        <input type="text" id="email" name="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                        {email && emailErrors.length > 0 && <div id="emailfeedback">{emailErrors.map((err, idx) => (<div key={idx}>{err}</div>))}</div>}
                    </div>

                </div>
                <button className='register-button' onClick={() => handleRegistration()}>Registreer</button>
                <button className="login-button" onClick={() => navigate("/login")}>Login</button>

                {createdMessage && <h2>{createdMessage}</h2>}

            </div>
        </div>
    )
}

export default Registreer
