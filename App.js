import React, { useState } from "react";
import './App.css';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">

      {!user ? (
        <Login />
      ):(
      <div className="app__body">
        <Router>
          <Sidebar /> 
          <Routes>
            {/* Use inline components directly within <Route> */}
            <Route path="/rooms/:roomId" element={<>
              <Chat />
            </>} />

            <Route path="/" element={<>
              <Chat />
            </>} />
          </Routes>
        </Router>
      </div>
       )} 
    </div>
  );
}

export default App;
