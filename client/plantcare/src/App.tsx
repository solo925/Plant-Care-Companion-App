import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import './assets/styles/Dashboard.css'
import './assets/styles/Homepage.css'
import './assets/styles/LoginPage.css'
import './assets/styles/Rooms.css'
import './assets/styles/communityForum.css'
import Registration from './componets/Auth/Registration'
import CreateRoom from './componets/CommunicationForum/CreateRoom'
import LoginPage from './pages/Auth/Login'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/Dashboard/dashboardPage'
import HomePage from './pages/Home'
import CommunityForumPage from './pages/communityForum'

function App() {


  return (
    <Fragment>

        <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route path ='/register' element={<Registration />} />
        <Route path='/' element={<HomePage />} />
        <Route path ='/dashboard' element={<DashboardPage />} />
        <Route path='/community' element={<CommunityForumPage />} />
        <Route path='/create-room' element={ <CreateRoom/>} />
        <Route path='/chat' element={<ChatPage/>} />

        
     
        
    </Routes>
  

    
  
    </Fragment>
  )
}

export default App
