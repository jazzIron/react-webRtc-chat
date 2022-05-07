import styled from '@emotion/styled';
import { Route, Routes } from 'react-router-dom';
import { RouteList } from './RouteList';
import { MainPage } from '@src/pages/main';
import { LoginPage } from '@src/pages/login/LoginPage';

export function NormalRouter() {
  return (
    <BodyStyled>
      <Routes>
        <Route path={RouteList.MAIN} element={<MainPage />} />
        <Route path={RouteList.LOGIN} element={<LoginPage />} />
      </Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
