import { useContext } from "react";
import { PlantCareContext } from "../../context";


const DashboardHeader = () => {
    const context = useContext(PlantCareContext);
    const { user } = context || {};

    return (
        <header className='dashboard-header'>
            <h1>{`Welcome ${user?.name|| 'User'} to your dashboard`}</h1>
        </header>
    );
};

export default DashboardHeader;
