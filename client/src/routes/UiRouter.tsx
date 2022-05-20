import styled from '@emotion/styled';
import { ChatUi } from '@src/pages/ui/ChatUi';
import { Route, Routes } from 'react-router-dom';
import { UiRouterList } from './UiRouterList';

export function UiRouter() {
  return (
    <BodyStyled>
      <Routes>
        <Route path={UiRouterList.CHAT} element={<ChatUi />} />
      </Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
