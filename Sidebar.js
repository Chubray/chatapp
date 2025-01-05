// src/Sidebar.js

import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import Avatar from '@mui/material/Avatar';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from "./SidebarChat";
import { db } from './firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useStateValue } from './StateProvider';

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rooms'), snapshot => {
      setRooms(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton><DonutLargeIcon /></IconButton>
          <IconButton><ChatIcon /></IconButton>
          <IconButton><MoreVertIcon /></IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map(room => (
          <SidebarChat key={room.id} id={room.id} chatName={room.data.chatName} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
