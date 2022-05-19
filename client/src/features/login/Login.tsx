import styled from '@emotion/styled';
import { UserData, User } from '@src/@types/User_types';
import { Button, Card, Form, Input, message } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { MutableRefObject, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface propTypes {
  socket?: MutableRefObject<Socket | undefined>;
  setUser?: (user: User) => void;
}

interface isUserCallback {
  user: {
    nickName: string;
    socketId: string;
  };
  isUser: boolean;
}

export function Login({ socket, setUser }: propTypes) {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<UserData>({
    nickName: `USER_${Math.floor(Math.random() * 1000) + 1}`,
    //nickName: ``,
    error: false,
  });

  const loginSuccess = (user: User) => {
    setUserData((prev) => {
      return {
        ...prev,
        error: true,
      };
    });
    setUser && setUser(user);
  };

  const loginFail = () => {
    setUserData((prev) => {
      return {
        ...prev,
        error: false,
      };
    });
    message.error('Already nickname');
    return console.error('Already nickname');
  };

  const isUserCallback = ({ user, isUser }: isUserCallback) => {
    return isUser ? loginFail() : loginSuccess(user);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserData((prev) => {
      return {
        ...prev,
        nickName: e.target.value,
      };
    });
  };

  const handleClickLoginSubmit = async () => {
    if (!socket) return false;
    if (!socket.current) return false;
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      socket.current.emit('LOGIN', userData.nickName, isUserCallback);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <LoginStyled>
      <Card
        style={{ width: 500, backgroundColor: '#fff' }}
        cover={
          <img
            alt="loginBanner"
            src="https://png.pngtree.com/png-vector/20190401/ourlarge/pngtree-paper-plane-icon-design--essential-icon-vector-design-png-image_902861.jpg"
          />
        }
      >
        <Meta title="Simple Chat" />
        <Form name="basic" form={form} autoComplete="off">
          <Form.Item
            label="닉네임"
            name="nickName"
            hasFeedback
            rules={[
              {
                required: true,
                message: '닉네임을 입력해주세요.',
              },
            ]}
          >
            <Input onChange={handleChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleClickLoginSubmit}>
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
