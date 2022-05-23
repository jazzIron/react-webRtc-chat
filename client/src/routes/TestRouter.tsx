import styled from '@emotion/styled';
import { Route, Routes } from 'react-router-dom';

export function TestRouter() {
  return (
    <BodyStyled>
      <Routes></Routes>
    </BodyStyled>
  );
}

const BodyStyled = styled.div``;
