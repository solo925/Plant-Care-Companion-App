import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import './assets/styles/Dashboard.css'
import './assets/styles/Homepage.css'
import './assets/styles/LoginPage.css'
import Registration from './componets/Auth/Registration'
import LoginPage from './pages/Auth/Login'
import DashboardPage from './pages/Dashboard/dashboardPage'
import HomePage from './pages/Home'

function App() {


  return (
    <Fragment>

        <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route path ='/register' element={<Registration />} />
        <Route path='/' element={<HomePage />} />
        <Route path ='/dashboard' element={<DashboardPage />} />
    </Routes>
  

    
  
    </Fragment>
  )
}

export default App
