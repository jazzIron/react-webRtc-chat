import styled from '@emotion/styled';
import { User, Users } from '@src/@types/User_types';
import { useState, useEffect } from 'react';
import { ChatContents } from './ChatContents';
import { ChatMessageInput } from './ChatMessageInput';
import { ChatRoomHeader } from './ChatRoomHeader';
import { useRecoilState } from 'recoil';
import { usersState } from '@src/store/userState';
import { activeRoomState, PrivateRoomsState } from '@src/store/chatState';
import { Message, PrivateRooms } from './Chat_types';

export function Chat({ socket, user, logout, updateUsers }: any) {
  const [typingUser, setTypingUser] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [users, setUsers] = useRecoilState(usersState);
  const [chats, setChats] = useRecoilState(activeRoomState);
  const [privateRooms, setPrivateRooms] = useRecoilState(PrivateRoomsState);
  const [activeRoom, setActiveRoom] = useRecoilState(activeRoomState);

  useEffect(() => {
    console.log(
      '==========================ChatPage2 useEffect====================================',
    );
    socket.current.on(
      'NEW_USER',
      ({
        newUser,
        users,
        message,
        privateRooms,
      }: {
        newUser: User;
        users: Users;
        message: Message;
        privateRooms: PrivateRooms;
      }) => {
        console.log('==================[INFO] NEW_USER================');
        console.log(newUser);
        console.log(users);
        console.log(message);
        console.log(privateRooms);
        updateUsers(users);
        setPrivateRooms(privateRooms);
        setUsers(users.users);
        setMessageList((prev) => {
          return [...prev, message];
        });
      },
    );
    socket.current.emit('INIT_ROOM', user);
    socket.current.on('TYPING', addTyping);
    socket.current.on('MESSAGE_SEND', addMessage);
    socket.current.emit('ROOM_LIST', (rooms: any) => {
      console.log(rooms);
    });
    socket.current.on('P_TYPING', addPrivateTyping);
    socket.current.on(
      'P_MESSAGE_SEND',
      ({ roomId, message }: { roomId: string; message: Message }) => {
        console.log('=======================addPrivateMessage============================');

        // privateRooms.rooms.map((room) => {
        //   if (room.user.socketId === roomId) {
        //     room.messages.push(message);
        //     if (activeRoom?.roomName !== `ROOM_${roomId}`) room.msgCount++;
        //   }
        //   return null;
        // });

        console.log(privateRooms);
        setPrivateRooms(privateRooms);
      },
    );
  }, [socket.current]);

  const addTyping = ({ isTyping, sender }: { isTyping: boolean; sender: string }) => {
    console.warn('=====================addTyping======================');
    if (sender === user.nickName) return;
    setTypingUser(isTyping);
  };

  const addPrivateTyping = ({ sender, isTyping }: { sender: string; isTyping: boolean }) => {
    console.log('[INFO] addPTyping**************************');
    privateRooms.rooms.map((rooms) => {
      if (rooms.user.socketId === sender) {
        rooms.isTyping = isTyping;
      }
      return null;
    });
    setPrivateRooms(privateRooms);
  };

  const sendMsg = (msg: string) => {
    console.log('========================== [INFO] sendMsg ==========');

    if (activeRoom?.type === 'Private') {
      socket.current.emit('P_MESSAGE_SEND', { activeRoom, type: 'BASIC', msg });
    } else {
      socket.current.emit('MESSAGE_SEND', { roomId: 'ROOM_COMMUNITY', type: 'BASIC', msg });
    }
  };

  const sendTyping = (isTyping: boolean) => {
    console.log('================== [INFO] sendTyping==================');
    console.log(chats);
    console.log(activeRoom);

    if (activeRoom?.type === 'Private') {
      socket.current.emit('P_TYPING', { activeRoom, isTyping });
    } else {
      socket.current.emit('TYPING', { roomId: 'ROOM_COMMUNITY', isTyping });
    }
  };

  const addMessage = ({ roomId, message }: { roomId: string; message: Message }) => {
    console.log('=====================addMessage======================');
    setMessageList((prev) => {
      return [...prev, message];
    });
  };

  const addPrivateMessage = ({ roomId, message }: { roomId: string; message: Message }) => {
    console.log('=======================addPrivateMessage============================');

    privateRooms.rooms.map((room) => {
      if (room.user.socketId === roomId) {
        room.messages.push(message);
        if (activeRoom?.roomName !== `ROOM_${roomId}`) room.msgCount++;
      }
      return null;
    });

    console.log(privateRooms);
    setPrivateRooms(privateRooms);
  };

  return (
    <>
      <ChatRoomHeader user={user} />
      <ChatStyled>
        {/* <ChatContents messages={activeRoom?.messages} typingUser={typingUser} /> */}
        <ChatContents messages={messageList} typingUser={typingUser} />
        <ChatMessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
      </ChatStyled>
    </>
  );
}

const ChatStyled = styled.div``;
