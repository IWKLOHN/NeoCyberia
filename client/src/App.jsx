import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {RegisterLoginPage} from './pages/registerLoginPage/RegisterLoginPage';
import { OthersProfileComponent } from './components/othersProfileComponent/OthersProfileComponent';
import { MainPage } from './pages/mainPage/mainPage';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterLoginPage />} />
        <Route path="/main" element={<MainPage></MainPage>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
