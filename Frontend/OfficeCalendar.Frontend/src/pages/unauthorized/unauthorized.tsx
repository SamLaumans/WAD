import { useNavigate } from 'react-router-dom'
import './unauthorized.css'

function Unauthorized() {
    const navigate = useNavigate()

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <h1>403</h1>
                <h2>Unauthorized</h2>
                <p>You do not have permission to access this page.</p>
                <button onClick={() => navigate("/main-page")}>Go to Home</button>
                <button className="secondary-btn" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </div>
    )
}

export default Unauthorized
