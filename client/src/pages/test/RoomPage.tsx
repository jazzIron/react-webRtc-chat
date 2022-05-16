import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { SocketMsgType } from '@src/utils/Constant';
import { useEffect, useState } from 'react';

export function RoomPage() {
  const { socketRef, socket } = useSocketIo();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any>([]);

  const initSocket = () => {
    if (!socketRef.current) return false;
    socketRef.current.on('connect', () => console.log('Connected'));
  };

  useEffect(() => {
    initSocket();
  }, []);

  const createRoomCallback = ({ status, rooms }: any) => {
    console.log('[INFO]============createRoomCallback===================');
    console.log(status);
    console.log(rooms);

    if (!status) alert('방 이름이 중복되었습니다.');

    // 방접속하기
  };

  const handleClickCreatRoom = () => {
    if (!socketRef.current) return false;
    const roomData = {
      roomName: 'TEST_ROOM',
      roomPwd: 0,
      roomMax: 5,
    };
    socketRef.current.emit('CREATE_ROOM', roomData, createRoomCallback);
  };

  const handleClickRoomList = () => {
    if (!socketRef.current) return false;
    socketRef.current.emit('ROOM_LIST');
  };

  const handleClickJoinRoom = () => {
    if (!socketRef.current) return false;
    const roomData = {
      roomId: rooms[0].roomId,
      userId: 'USER_1231241',
    };
    socketRef.current.emit('JOIN_ROOM', roomData);
  };

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('ROOM_LIST', (rooms: any) => {
      setRooms((prev: any) => [rooms, ...prev]);
    });
    socketRef.current.on('NOTI_ROOM_USER', (rooms: any) => {
      console.log(rooms);
    });
  }, []);

  return (
    <RoomPageStyled>
      <div onClick={handleClickCreatRoom}>방생성</div>
      <div onClick={handleClickRoomList}>방리스트</div>
      <div onClick={handleClickJoinRoom}>방 입장</div>
    </RoomPageStyled>
  );
}

const RoomPageStyled = styled.div``;
