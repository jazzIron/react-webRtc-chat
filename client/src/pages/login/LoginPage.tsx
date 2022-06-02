import styled from '@emotion/styled';
import { Login } from '@src/features/login/Login';

export function LoginPage() {
  return (
    <LoginPageStyled>
      <Login />
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div`
  background-color: #0051b8;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
