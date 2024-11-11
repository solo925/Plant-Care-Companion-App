import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './componets/Auth/Login'
import Registration from './componets/Auth/Registration'
import HomePage from './pages/Home'

function App() {


  return (
    <Fragment>

        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path ='/register' element={<Registration />} />
          <Route path ='/home' element={<HomePage/>} />
    </Routes>
  

    
  
    </Fragment>
  )
}

export default App
