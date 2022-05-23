import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NormalRouter } from './NormalRouter';
import { TestRouter } from './TestRouter';
import { UiRouter } from './UiRouter';

export function RouterManager() {
  return (
    <Router>
      <Routes>
        <Route path={'/*'} element={<NormalRouter />} />
        <Route path={'/ui/*'} element={<UiRouter />} />
        <Route path={'/test/*'} element={<TestRouter />} />
      </Routes>
    </Router>
  );
}
