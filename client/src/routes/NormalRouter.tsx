import styled from '@emotion/styled';
import { Route, Routes } from 'react-router-dom';
import { RouteList } from './RouteList';
import { MainPage } from '@src/pages/main';
import { LoginPage } from '@src/pages/login/LoginPage';
import { TestPage } from '@src/pages/test/TestPage';

export function NormalRouter() {
  return (
    <BodyStyled>
      <Routes>
        <Route path={RouteList.MAIN} element={<MainPage />} />
        <Route path={RouteList.LOGIN} element={<LoginPage />} />
        <Route path={RouteList.TEST} element={<TestPage />} />
      </Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
