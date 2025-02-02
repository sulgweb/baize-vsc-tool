import { HashRouter, Routes, Route } from 'react-router-dom';
import GitData from '../pages/GitData';


const MainRouter = () =>{
  return <HashRouter>
    <Routes>
      <Route path='/' element={<GitData />}></Route>
    </Routes>
  </HashRouter>
}

export default MainRouter