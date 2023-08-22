import React, { useContext, useEffect } from "react";
import { SocketContext } from "./SocketProvider";

export default function Socket({ on, callback }) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.on(on, callback);
    }

    return () => {
      socket.off(on);
    };
  }, [socket]);

  return null;
}
