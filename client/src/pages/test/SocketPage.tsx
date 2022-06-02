import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { LoginPage } from '../login/LoginPage';
import { socket, initSocket, disconnectSocket } from './socket';

export function SocketPage() {
  useEffect(() => {
    initSocket();
    return () => {
      console.log('disconnectSocket');
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected!');
    });

    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        console.error('connect_error');
      }
    });

    socket.on('disconnect', () => {
      console.error('disconnect');
      console.log(socket.id); // undefined
    });

    socket.on('user_connected', (user) => {
      console.log('[INFO] socket on : user_connected');
    });
  }, [socket]);

  return (
    <SocketPageStyled>
      <LoginPage />
    </SocketPageStyled>
  );
}

const SocketPageStyled = styled.div``;
