import { useState } from "react";
import { userTypes } from "../../Types";

interface LoginProps {
    setLoading: (loading: boolean) => void;
    setUser: React.Dispatch<React.SetStateAction<userTypes | null | undefined>>;
}

function Login({ setLoading, setUser }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // Added error state

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null); // Reset error on new attempt
            const token = sessionStorage.getItem('token'); 
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || '',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                sessionStorage.setItem('token', data.token); 
                window.location.href = 'http://localhost:5173/home'; 
            } else {
                setError(data.message || 'Failed to log in'); 
            }
        } catch (error) {
            setError('An unexpected error occurred'); 
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="loginform">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <input className="login-input"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="login-button">
                    <button type="submit">Login</button>
                </div>
                <p>Don't have an account? <a href="./register">Register</a></p>
            </div>
        </form>
    );
}

export default Login;
