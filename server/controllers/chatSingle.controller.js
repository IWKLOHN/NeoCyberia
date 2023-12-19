import ChatSingle from '../models/chatSingle.model.js';



export const savePrivateMessage = async ({body: text, from: senderId, to, roomId: roomId}) => {
    const messageDocument = new ChatSingle({
        text,
        sender: senderId,
        recipient: to,
        roomId: roomId
    });
    try {
        await messageDocument.save();
        console.log('Message saved to DB');
    } catch (error) {
        console.log(error);
    }
};

    

export const fetchPrivateMessages = async (roomId) => {
    try {
        const messages = await ChatSingle
            .find({roomId: roomId})
            .populate('sender', 'username')
            .sort({createdAt: 'asc'});

        return messages;
    } catch (error) {
        console.error("Unable to retrieve messages", error);
        throw error;
    }
};


export const getPrivateMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await fetchPrivateMessages(roomId);
        res.status(200).json(messages);
    } catch (error) {
        console.error("Unable to retrieve messages", error);
        res.status(500).json({ error: error.message });
    }
}

