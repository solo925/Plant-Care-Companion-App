import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardContent from '../../componets/Dashboard/DashboardContent';
import DashboardHeader from '../../componets/Dashboard/Header';
import UserProfileCard from '../../componets/Dashboard/UserProfileCard';
import Sidebar from '../../componets/Home/Sidebar';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { userTypes } from '../../Types';

interface UserProps extends PlantCareContextProps {
    user: userTypes;
}

function DashboardPage() {
    const { user } = useContext<PlantCareContextProps | any>(PlantCareContext);
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="dashboard-main">
                <DashboardHeader />
                <DashboardContent />
            </div>
            <UserProfileCard user={user} />
        </div>
    );
}

export default DashboardPage;
