import { useNavigate } from 'react-router-dom';
import '../../assets//styles/Landing.css';
import mira from '../../assets/mira.jpg';
import li from '../../assets/pla4.jpg';
function Landing() {
    const navigate = useNavigate();
  return (
      <div className='landing-container'> 

          <div className="left">
              <div className="pl-img">
                  <img src={li} alt="" />
              </div>
          </div>

          <div className="right">
            <div className="left-content">
                <div className='landimg'>
                    <img src={mira} alt="" />
                </div>
              <h1>PlantCareComp</h1>
                <p>plantcare assistance</p>
                </div>
            <div className="land-button">
                  <button onClick={()=>navigate('/login')} className='button-text'>Explore</button>
              </div>
          </div>
    </div>
  )
}

export default Landing;