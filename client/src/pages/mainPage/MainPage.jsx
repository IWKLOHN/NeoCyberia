import { HeaderComponent } from "../../components/headerComponent/HeaderComponent";
import { ParentComponent } from "../../components/mainComponent/parentComponent/ParentComponent";
import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { ChatComponent } from "../../components/chatComponent/ChatComponent";
import { SocketContext } from "../../context/SocketContext";
import { ParentChatComp } from "../../components/chatComponent/ParentChatComp";












export const MainPage = () => {
    
    useEffect(() => {
        // This function will be called when the component is unmounted
        return () => {
            console.log('MainPage unmounted');
        };
    }, []);
    
    return (
        <div>
            <ParentChatComp/>

        </div>
    )
};