import React, { useEffect, useState } from 'react';
import { socketService } from '../../socket/socketService';
import { useUser } from '../../hooks/useUser';
import useUsers from '../../hooks/useUsersPaginated';

const Chat: React.FC = () => {
  const [myId, setMyId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<
    { from: string; text: string; timestamp?: string }[]
  >([]);
  const { data: user } = useUser();
  const { data: users } = useUsers();

  // useEffect(() => {
  //   if (myId) socket.emit('register', myId);

  //   socket.on('privateMessage', (data) => {
  //     setChat((prev) => [
  //       ...prev,
  //       { from: data.from, text: data.message, timestamp: data.timestamp },
  //     ]);
  //   });

  //   socket.on('chatHistory', (history) => {
  //     const formatted = history.map((msg: any) => ({
  //       from: msg.from,
  //       text: msg.message,
  //       timestamp: msg.timestamp,
  //     }));
  //     setChat(formatted);
  //   });

  //   socket.on('errorMessage', (msg) => alert(msg));

  //   return () => {
  //     socket.off('privateMessage');
  //     socket.off('chatHistory');
  //     socket.off('errorMessage');
  //   };
  // }, [myId]);

  // const sendPrivate = () => {
  //   if (!targetId || !message) return;
  //   socket.emit('privateMessage', { to: targetId, message });
  //   setMessage('');
  // };

  // const loadHistory = () => {
  //   if (!targetId) return;
  //   socket.emit('getHistory', { withUser: targetId });
  // };

  return (
    <div style={{ padding: 20 }} className="bg-white">
      <h2>Private Chat 💬</h2>

      {!myId ? (
        <div>
          <input
            placeholder="Enter your user ID"
            value={myId}
            onChange={(e) => setMyId(e.target.value)}
          />
          {/* <button onClick={() => socket.emit('register', myId)}>
            Register
          </button> */}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <input
              placeholder="Recipient user ID"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            />
            {/* <button onClick={loadHistory}>Load history</button> */}
          </div>

          <div
            style={{
              border: '1px solid #ccc',
              height: 250,
              overflowY: 'auto',
              marginBottom: 10,
              padding: 10,
            }}
          >
            {chat.map((c, i) => (
              <div key={i}>
                <b>{c.from}:</b> {c.text}{' '}
                <small style={{ color: '#888' }}>
                  {new Date(c.timestamp || '').toLocaleTimeString()}
                </small>
              </div>
            ))}
          </div>

          <input
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {/* <button onClick={sendPrivate}>Send</button> */}
        </>
      )}
    </div>
  );
};

export default Chat;
