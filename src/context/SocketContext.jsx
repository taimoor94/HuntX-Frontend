import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import API_BASE_URL from "../config";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, userId } = useContext(AuthContext);
  const socket = io(API_BASE_URL, {
    auth: { token },
  });

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};