import { createContext, useMemo, useContext, useCallback, useState, useEffect } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import { useBoxChatContext } from './BoxChatContext';
import Call from './call';
import CONSTANTS from '../../utils/chatConstant';
import { getCookieChatToken } from '../../modules/Cookies/Auth/userLogin';

const ConversationContext = createContext();

const ConversationProvider = ({ children }) => {
    const {
        activeConversation, activeMessages, setActiveMessages, chatService, userLogin, updateConversationState
    } = useBoxChatContext();
    const conversationSocket = useMemo(() => {
        if ( !activeConversation ) return;
        return io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}/chat-${activeConversation.id}`, {
            transports: ['websocket'],
            auth: { token: getCookieChatToken() },
            autoConnect: true,
        });
    }, [activeConversation, userLogin]);

    const [ typingUserIds, setTypingUserIds ] = useState([]);

    const emitTypingOn = useCallback(() => {
        conversationSocket.emit(CONSTANTS.EVENT_NAMES.CONVERSATION.TYPING_ON);
    }, [conversationSocket]);
    const emitTypingOff = useCallback(() => {
        conversationSocket.emit(CONSTANTS.EVENT_NAMES.CONVERSATION.TYPING_OFF);
    }, [conversationSocket]);
    const sendMessage = useCallback( msgData => {
        if ( !conversationSocket || !activeConversation ) return;
        // TODO
        const msg = {
            ...msgData,
        }
        conversationSocket.emit(CONSTANTS.EVENT_NAMES.CONVERSATION.SEND_MESSAGE, msg);
    }, [conversationSocket, activeConversation]);

    const loadMoreMessage = useCallback( async () => {
        const msgs = await chatService.getConversationMessages( activeConversation.id, { limit: 50, offset: 0} )
        setActiveMessages(msgs);
    }, [chatService, activeConversation, setActiveMessages]);

    const audioCall = useCallback(() => {
        // TODO
    }, [conversationSocket]);
    const videoCall = useCallback(() => {
        if(activeConversation.type === 1) {
            const url = `/videocall/callaway`
            var link = window.open(
                url,"_blank",
                // spec
            )

        } else {
            // if(numOfMember > 10) {
            //     ErrorNotification("Bạn không thể gọi nhóm!")
            // }
            // else {
                const url = `/videocall/callawaygroup?conversationId=${activeConversation.id}&userId=${userLogin.id}`
                var link = window.open(
                    url,"_blank",
                    // spec
                )
            // }
        }
    }, [conversationSocket]);

    useEffect(() => {
        if ( !activeConversation ) return;

        const load = async () => {
            const msgs = await chatService.getConversationMessages(activeConversation.id); // TODO: pagination
            setActiveMessages([..._.reverse(msgs)] || []);
        };

        load();
    }, [chatService, activeConversation, setActiveMessages]);

    useEffect(() => {
        if ( !conversationSocket ) return;

        conversationSocket.on(CONSTANTS.EVENT_NAMES.CONVERSATION.SENDED, (msg) => {
            // After send succeed, append new msg to current msg list
            console.log(`=================== ${userLogin.username} receive msg: `, msg);
            setActiveMessages(prevState => [...prevState, msg]);
            updateConversationState( activeConversation.id, { latestMessage: msg } );
        });
        conversationSocket.on(CONSTANTS.EVENT_NAMES.CONVERSATION.SEND_FAIL, ({msg, reason}) => {
            console.warn('Send msg failed, reason: ', reason);
            const errorMsg = [ ...msg, reason];

            setActiveMessages(prevState => [...prevState, errorMsg]);
            updateConversationState( activeConversation.id, { latestMessage: msg } );
        });
        conversationSocket.on(CONSTANTS.EVENT_NAMES.CONVERSATION.TYPING_ON, ({ userId }) => {
            console.info(`${userId} is typing...`);
            setTypingUserIds(prevState => _.uniq([...prevState, userId]));
        });
        conversationSocket.on(CONSTANTS.EVENT_NAMES.CONVERSATION.TYPING_OFF, ({ userId }) => {
            console.info(`${userId} typing off.`);
            setTypingUserIds(prevState => _.uniq(_.remove( prevState, id => id === userId )));
        });
    }, [conversationSocket]);

    const value = useMemo(() => ({
        typingUserIds,
        sendMessage,
        emitTypingOn,
        emitTypingOff,
        loadMoreMessage,
        audioCall,
        videoCall,
    }), [
        sendMessage, loadMoreMessage,
        audioCall, videoCall, activeConversation
    ]);

    return (
        <>
            <ConversationContext.Provider value={value}>
                {children}
            </ConversationContext.Provider>
        </>
    );
};
const useConversationContext = () => {
	const contextValue = useContext(ConversationContext);

	if (!contextValue) {
		console.error('The useConversationContext hook was called outside of the ConversationProvider.');
	}
	return contextValue || {};
};

export { useConversationContext, ConversationProvider };
