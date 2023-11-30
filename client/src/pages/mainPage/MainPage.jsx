import { ChatComponent } from "../../components/chatComponent/ChatComponent";
import { HeaderComponent } from "../../components/headerComponent/HeaderComponent";
import { OthersProfileComponent } from "../../components/othersProfileComponent/OthersProfileComponent";





export const MainPage = () => {
    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <OthersProfileComponent></OthersProfileComponent>
            <ChatComponent></ChatComponent>
        </div>
    )
};