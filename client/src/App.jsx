import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {RegisterLoginPage} from './pages/registerLoginPage/RegisterLoginPage';
import { MainPage } from './pages/mainPage/MainPage';
import { CreateProfilePage } from './pages/createProfilePage/CreateProfilePage';
import { LoggedUserProfilePage } from './pages/loggedUserProfilePage/LoggedUserProfilePage';
import { SocketProvider } from './context/SocketContext';
import Cookies from 'js-cookie';
import { OtherProfilesPage } from './pages/otherProfiles/OtherProfilesPage';
import { useState, useEffect } from 'react';





function App() {
  



  return (
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterLoginPage />} />

          
          
          <Route path="/main/*" element={<SocketProvider><MainPage/></SocketProvider>} />
          
          <Route path="/create-profile" element={<SocketProvider><CreateProfilePage/></SocketProvider>} />
          <Route path='/main/profile/:id' element= {<SocketProvider><LoggedUserProfilePage/></SocketProvider>} />
          <Route path='/others-profile/:id' element= {<SocketProvider><OtherProfilesPage/></SocketProvider>} />
          



        </Routes>
      </BrowserRouter>
      
  )
}

export default App
