import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NormalRouter } from './NormalRouter';

export function RouterManager() {
  return (
    <Router>
      <Routes>
        <Route path={'/*'} element={<NormalRouter />} />
      </Routes>
    </Router>
  );
}
