import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {RegisterLoginPage} from './pages/registerLoginPage/RegisterLoginPage';
import { OthersProfileComponent } from './components/othersProfileComponent/OthersProfileComponent';
import { MainPage } from './pages/mainPage/mainPage';
import { CreateProfilePage } from './pages/createProfilePage/CreateProfilePage';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterLoginPage />} />
        <Route path="/main" element={<MainPage></MainPage>} />
        <Route path="/create-profile" element={<CreateProfilePage></CreateProfilePage>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
