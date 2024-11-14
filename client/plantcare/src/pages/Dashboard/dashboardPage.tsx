import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardContent from '../../componets/Dashboard/DashboardContent';
import DashboardHeader from '../../componets/Dashboard/Header';
import { PlantCareContext, PlantCareContextProps } from '../../context';

interface us extends PlantCareContextProps{
    user: any;
}

function DashboardPage() {

    const { user } = useContext<PlantCareContextProps | any>(PlantCareContext)
    
    const navigate = useNavigate();
    // useEffect(() => {
    //     if (!user) {
    //         navigate('/login')
            
    //     }
    // },[user,navigate])
  return (
      <div className='dashboard'>
          <DashboardHeader />
          <DashboardContent/>
          
    </div>
  )
}

export default DashboardPage