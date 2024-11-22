import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import './assets/styles/Dashboard.css'
import './assets/styles/LoginPage.css'
import './assets/styles/Rooms.css'
import './assets/styles/communityForum.css'
import Registration from './componets/Auth/Registration'
import CreateRoom from './componets/CommunicationForum/CreateRoom'
import MyPlantsPage from './componets/Plants/MyPlants'
import Plants from './componets/Plants/Plants'
import SinglePlantTile from './componets/Plants/singlePlantsTile'
import NewPost from './componets/blog/CreatePost'
import PostDetail from './componets/blog/PostDetail'
import LoginPage from './pages/Auth/Login'
import ChatPage from './pages/ChatPage'
import MyRemindersPage from './pages/Dashboard/MyRemindersPage'
import DashboardPage from './pages/Dashboard/dashboardPage'
import HealthHistoryPage from './pages/Health/HealthHistory'
import TrackHealthPage from './pages/Health/TrackHealthPage'
import HomePage from './pages/Home'
import CommunityForumPage from './pages/communityForum'
import PlantCareTipsPage from './pages/plantCaretips'
import CareReminderPage from './pages/plantCaretips/CareReminder'

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
        <Route path='/plants' element={<Plants/>} />
        <Route path='/plants/:id' element={<SinglePlantTile/>} />
        <Route path='/create-post' element={<NewPost />} />
        <Route path='/care-tips' element={<PlantCareTipsPage />} />
        <Route path='/post/:postId' element={<PostDetail/>} />
        <Route path='/care-reminder/:plantId' element={<CareReminderPage/>} />
        <Route path='/my-plants' element={<MyPlantsPage />} />
        <Route path="/reminders" element={<MyRemindersPage />} />
        <Route path="/track-health/:plantId" element={<TrackHealthPage />} />
        <Route path="/health-history/:plantId" element={<HealthHistoryPage />} />
    </Routes>
  

    
  
    </Fragment>
  )
}

export default App
