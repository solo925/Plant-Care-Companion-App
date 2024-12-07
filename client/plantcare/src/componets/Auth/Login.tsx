import { useState } from "react";
import { userTypes } from "../../Types";

interface LoginProps {
    setLoading: (loading: boolean) => void;
    setUser: React.Dispatch<React.SetStateAction<userTypes | null | undefined>>;
}

function Login({ setLoading, setUser }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
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
                window.location.href = 'http://localhost:5173'; 
            } else {
                console.log(data.message); 
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="loginform">
                <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="login-button">
                <button type="submit">Login</button>
            </div>
        </form>
    );
}

export default Login;
