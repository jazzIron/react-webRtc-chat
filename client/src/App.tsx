import { ReactElement } from 'react';
import { ThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import 'antd/dist/antd.min.css';
import { RouterManager } from './routes/RouterManager';

import { theme } from './themes';

function App(): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <RouterManager />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
