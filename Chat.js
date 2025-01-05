import React, { useEffect, useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useParams } from "react-router-dom";
import { doc, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useStateValue } from "./StateProvider";

function Chat() {
    const [input, setInput] = useState('');
    const [seed, setSeed] = useState('');
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{ user }] = useStateValue();

    useEffect(() => {
        if (roomId) {
            const roomDocRef = doc(db, "rooms", roomId);

            // Subscribe to room data changes
            const unsubscribeRoom = onSnapshot(roomDocRef, (snapshot) => {
                if (snapshot.exists()) {
                    setRoomName(snapshot.data().chatName);
                }
            });

            // Subscribe to message collection changes
            const messagesCollectionRef = collection(db, "rooms", roomId, "messages");
            const messagesQuery = query(messagesCollectionRef, orderBy("timestamp", "asc"));
            const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });

            // Cleanup subscriptions on unmount
            return () => {
                unsubscribeRoom();
                unsubscribeMessages();
            };
        }
    }, [roomId]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        console.log('You typed >>>', input);

        try {
            await addDoc(collection(db, 'rooms', roomId, 'messages'), {
                message: input,
                userName: user.displayName,
                timestamp: serverTimestamp()
            });

            setInput("");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`} />
                <div className='chat__headerInfo'>
                    <h3>{roomName}</h3>
                    <p>
                        last seen {''}
                        {messages.length > 0 && messages[messages.length - 1].timestamp 
                            ? new Date(messages[messages.length - 1].timestamp.toDate()).toUTCString()
                            : "Loading..."}
                    </p>
                </div>
                <div className='chat__headerRight'>
                    <IconButton><SearchOutlinedIcon /></IconButton>
                    <IconButton><AttachFileOutlinedIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>

            <div className='chat__body'>
                {messages.map(message => (
                    <p className={`chat__message ${message.userName === user.displayName ? "chat__receiver" : ""}`} key={message.id}>
                        <span className="chat__name">{message.userName}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp ? new Date(message.timestamp.toDate()).toUTCString() : "Loading..."}
                        </span>
                    </p>
                ))}
            </div>
            <div className='chat__footer'>
                <IconButton><InsertEmoticonIcon /></IconButton>
                <form>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message"
                        type="text"
                    />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <IconButton><MicIcon /></IconButton>
            </div>
        </div>
    );
}

export default Chat;
