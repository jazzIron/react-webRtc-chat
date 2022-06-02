import styled from '@emotion/styled';
import { RtcPage } from '@src/pages/test/RtcPage';
import { Route, Routes } from 'react-router-dom';
import { ServerPage } from '@src/pages/test/ServerPage';
import { CallerPage } from '../pages/test/CallerPage';
import { SocketPage } from '@src/pages/test/SocketPage';

export function TestRouter() {
  return (
    <BodyStyled>
      <Routes>
        <Route path={'s'} element={<SocketPage />} />
        <Route path={'/rtc'} element={<RtcPage />} />
        <Route path={'/1'} element={<ServerPage />} />
        <Route path={'/2'} element={<CallerPage />} />
      </Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
