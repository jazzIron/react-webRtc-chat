import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GlobalStyle from './themes/GlobalStyle';

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
