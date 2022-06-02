import styled from '@emotion/styled';
import { UserData, User } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';
import { loginUserState } from '@src/store/userState';
import { Avatar, Button, Form, Input, message, Select, Typography, Image } from 'antd';
const { Title } = Typography;
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import loginBannerImg from '../../asset/images/Chat_Flatline_b.svg';
import { loginSubmit } from './../../pages/test/socket';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { RouteList } from '@src/routes/RouteList';

const { Option } = Select;

interface isUserCallback {
  user: {
    nickName: string;
    userAvatar: string;
    socketId: string;
  };
  isUser: boolean;
}

export function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<UserData>({
    nickName: `USER_${Math.floor(Math.random() * 1000) + 1}`,
    userAvatar: 'captainAmerica01',
    error: false,
  });
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);

  useEffect(() => {
    if (!isEmpty(loginUser.socketId)) navigate(RouteList.CHAT);
  }, [loginUser]);

  const loginSuccess = (user: User) => {
    console.log('[INFO] loginSuccess ');
    setUserData((prev) => {
      return {
        ...prev,
        error: true,
      };
    });
    setLoginUser(user);
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

  const handleChangeAvatar = () => {
    setUserData((prev) => {
      return {
        ...prev,
        userAvatar: form.getFieldValue('userAvatar'),
      };
    });
  };

  const handleClickLoginSubmit = async () => {
    const values = await form.validateFields();
    loginSubmit(values, isUserCallback);
  };

  return (
    <LoginWrapper>
      <ImageWrapper>
        <img alt="loginBanner" src={loginBannerImg} />
      </ImageWrapper>
      <LoginFormWrapper>
        <TitleWrapper>
          <Title level={2}>Simple Chat</Title>
        </TitleWrapper>

        <Form
          name="basic"
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            nickName: `USER_${Math.floor(Math.random() * 1000) + 1}`,
            userAvatar: userData.userAvatar,
          }}
        >
          <AvatarWrapper>
            <AvatarStyled>
              <Avatar
                size={64}
                src={
                  <Image
                    src={AVATAR_LIST[userData.userAvatar]}
                    style={{
                      width: '100%',
                    }}
                  />
                }
              />
            </AvatarStyled>

            <Form.Item
              name="userAvatar"
              label="아바타"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '아바타 선택해주세요.',
                },
              ]}
            >
              <Select placeholder="아바타" onChange={handleChangeAvatar} style={{ minWidth: 200 }}>
                <Option value="captainAmerica01">captain_america01</Option>
                <Option value="captainAmerica02">captain_america02</Option>
                <Option value="captainMarvel01">captain_marvel01</Option>
                <Option value="captainMarvel02">captain_marvel02</Option>
                <Option value="hulk01">hulk01</Option>
                <Option value="hulk02">hulk02</Option>
                <Option value="ironMan01">ironMan</Option>
                <Option value="spiderMan01">spiderMan</Option>
                <Option value="thanos01">thanos01</Option>
                <Option value="thor01">thor01</Option>
                <Option value="thor02">thor02</Option>
                <Option value="thor03">thor03</Option>
              </Select>
            </Form.Item>
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
          </AvatarWrapper>

          <Form.Item>
            <SubmitBtnWrapper>
              <Button type="primary" htmlType="submit" onClick={handleClickLoginSubmit}>
                로그인
              </Button>
            </SubmitBtnWrapper>
          </Form.Item>
        </Form>
      </LoginFormWrapper>
    </LoginWrapper>
  );
}

const LoginWrapper = styled.div`
  background-color: #fff;
  min-width: 950px;
  min-height: 400px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 30px 60px -5px #000;
`;

const ImageWrapper = styled.div``;

const LoginFormWrapper = styled.div`
  width: 50%;
`;

const TitleWrapper = styled.div`
  margin-bottom: 60px;
`;

const AvatarWrapper = styled.div`
  display: flex;
  gap: 16px;
  > div:last-of-type {
    width: 100%;
  }
`;

const AvatarStyled = styled.div``;

const SubmitBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
