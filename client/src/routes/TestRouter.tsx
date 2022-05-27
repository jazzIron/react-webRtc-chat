import styled from '@emotion/styled';
import { RtcPage } from '@src/pages/test/RtcPage';
import { Route, Routes } from 'react-router-dom';

export function TestRouter() {
  return (
    <BodyStyled>
      <Routes>
        <Route path={'/rtc'} element={<RtcPage />} />
      </Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
