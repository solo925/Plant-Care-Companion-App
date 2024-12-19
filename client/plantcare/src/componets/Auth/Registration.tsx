import { useContext, useState } from "react";
import '../../assets/styles/registration.css';
import { PlantCareContext } from "../../context";

function Register() {
    const context = useContext(PlantCareContext);

    if (!context) throw new Error('useContext must be inside a Provider');

    const { loading, setLoading, error, setError, user, setUser } = context;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const HandleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (loading) return; 
            setLoading(true);
            setError(null); 

            const response = await fetch('http://localhost:3000/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmpassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed'); 
            } else {
                const data = await response.json();
                setUser(data.user);
                localStorage.setItem('token', data.token);
                window.location.href = 'http://localhost:5173/login';
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register">
            <form onSubmit={HandleRegistration}>
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <div className="input">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button className="Register-button" type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;
