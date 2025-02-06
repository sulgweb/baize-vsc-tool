import { Routes, Route, Navigate } from 'react-router-dom';
import GitData from '../pages/GitData';
import Setting from '../pages/Setting';

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/git-data" element={<GitData />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="*" element={<Navigate to="/git-data" />} />
    </Routes>
  );
};

export default MainRouter;
