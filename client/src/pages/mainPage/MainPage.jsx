import { ChatComponent } from "../../components/chatComponent/ChatComponent";
import { OthersProfileComponent } from "../../components/othersProfileComponent/OthersProfileComponent";




export const MainPage = () => {
    return (
        <div>
            <OthersProfileComponent></OthersProfileComponent>
            <ChatComponent></ChatComponent>
        </div>
    )
};