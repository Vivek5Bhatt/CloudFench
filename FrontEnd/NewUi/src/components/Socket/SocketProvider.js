import React, { createContext, useEffect, useState, Component } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext({
  on: () => {},
  off: () => {},
});

export default class SocketProvider extends Component {
  constructor(props) {
    super(props);
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}
