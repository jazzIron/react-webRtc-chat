import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NormalRouter } from './NormalRouter';
import { UiRouter } from './UiRouter';

export function RouterManager() {
  return (
    <Router>
      <Routes>
        <Route path={'/*'} element={<NormalRouter />} />
        <Route path={'/ui/*'} element={<UiRouter />} />
      </Routes>
    </Router>
  );
}
