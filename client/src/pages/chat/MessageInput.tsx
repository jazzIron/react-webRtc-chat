import styled from '@emotion/styled';
import { useState } from 'react';

interface propTypes {
  sendMsg: (msg: string) => void;
  sendTyping: (isTyping: boolean) => void;
}

export function MessageInput({ sendMsg, sendTyping }: propTypes) {
  const [msg, setMsg] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value);
  const handleSubmit = () => {
    if (msg.length <= 0) return false;
    sendMsg(msg);
    setMsg('');
  };

  const handleFocused = () => sendTyping(true);
  const handleBlur = () => sendTyping(false);
  return (
    <MessageInputStyled>
      <input
        value={msg}
        placeholder="메세지를 입력해주세요."
        onFocus={handleFocused}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>전송</button>
    </MessageInputStyled>
  );
}

const MessageInputStyled = styled.div``;
