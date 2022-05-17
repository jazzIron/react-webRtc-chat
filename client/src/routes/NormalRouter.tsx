import styled from '@emotion/styled';
import { Route, Routes } from 'react-router-dom';
import { RouteList } from './RouteList';
import { MainPage } from '@src/pages/main';
import { LoginPage } from '@src/pages/login/LoginPage';
import { TestPage } from '@src/pages/test/TestPage';
import { ChatPage, RoomPage } from '@src/pages/test';

export function NormalRouter() {
  return (
    <BodyStyled>
      <Routes>
        <Route path={RouteList.MAIN} element={<MainPage />} />
        <Route path={RouteList.LOGIN} element={<LoginPage />} />
        <Route path={RouteList.TEST} element={<TestPage />} />
        <Route path={RouteList.ROOM} element={<RoomPage />} />
        <Route path={RouteList.CHAT} element={<ChatPage />} />
      </Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
