import React, { useState, useEffect } from 'react';
import './SidebarChat.css';
import Avatar from '@mui/material/Avatar';
import { getFirestore, doc, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore'; // Importing Firestore methods from firebase.js
import { Link } from "react-router-dom";
import { db } from './firebase'; // Assuming your firebase.js exports the db instance

function SidebarChat({ id, chatName, addNewChat }) {
    const [seed] = useState(Math.floor(Math.random() * 5000));
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (id) {
            const messagesCollectionRef = collection(doc(collection(db, 'rooms'), id), 'messages');
            const messagesQuery = query(messagesCollectionRef, orderBy('timestamp', 'desc'));

            const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                const latestMessage = snapshot.docs[0]?.data();
                setMessage(latestMessage ? latestMessage.message : "");
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        }
    }, [id]);

    const createChat = () => {
        const roomName = prompt("Please enter name for chat room");

        if (roomName) {
            addDoc(collection(db, 'rooms'), {
                chatName: roomName
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className='sidebarChat'>
                <Avatar src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`} />
                <div className='sidebarChat__info'>
                    <h2>{chatName}</h2>
                    <p>{message || "No messages yet"}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add New Chat</h2>
        </div>
    );
}

export default SidebarChat;
