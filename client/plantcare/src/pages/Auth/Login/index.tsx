import { useContext, useEffect, useState } from "react";
import Login from "../../../componets/Auth/Login";
import { PlantCareContext } from "../../../context";

function LoginPage() {
    const context = useContext(PlantCareContext);
    const [loading, setLoading] = useState(false);

    if (!context) {
        throw new Error("Context must be used inside a provider");
    }

    const { setUser: contextSetUser } = context;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                contextSetUser(data.user);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {loading && <h3>Please wait, loading login form...</h3>}
            {/* Passing setUser to Login Component */}
            <Login setLoading={setLoading} setUser={contextSetUser} />
        </div>
    );
}

export default LoginPage;
