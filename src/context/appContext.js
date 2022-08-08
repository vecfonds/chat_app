import { io } from "socket.io-client";
import React from "react";
import config from "../../config";

export const socket = io.connect(config.SOCKET_URL);

export const AppContext = React.createContext();
