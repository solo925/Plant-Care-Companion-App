import { useContext, useState } from "react";
import Login from "../../../componets/Auth/Login";
import { PlantCareContext } from "../../../context";
import { userTypes } from "../../../Types";

function LoginPage() {
    const context = useContext(PlantCareContext);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    if (!context) {
        throw new Error("Context must be used inside a provider");
    }

    const { setUser: contextSetUser } = context;
    interface ust extends userTypes{
        (prevState: null): null;
    }
    

    const handleSetUser = (user: ust) => {
        contextSetUser(user);
        setUser(user);
    };

    return (
        <div>
            <h2>Login</h2>
            {loading && <h3>Please wait, loading login form...</h3>}
            <Login setLoading={setLoading} setUser={handleSetUser} />
        </div>
    );
}

export default LoginPage;
