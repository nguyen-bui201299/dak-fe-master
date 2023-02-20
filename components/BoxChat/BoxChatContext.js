/* eslint-disable react-hooks/exhaustive-deps */
import io from 'socket.io-client';
import { useState, createContext, useEffect, useRef, useMemo, useContext, useCallback } from 'react';
import ChatService from '../../services/chat';
import { getCookieUserLogin, getCookieChatToken } from '../../modules/Cookies/Auth/userLogin';
import _ from 'lodash';
import CONSTANTS from '../../utils/chatConstant';

const BoxChatContext = createContext();
const BoxChatProvider = ({ children }) => {
    const [isNeedLogin, setIsNeedLogin] = useState(false);
    const [userLogin, setUserLogin] = useState(getCookieUserLogin());
    const [socket, setSocket] = useState();
    const [chatService, setChatService] = useState();
    const [language, setLanguage] = useState('en');
    const [allUserObj, setAllUserObj] = useState();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState();
    const [activeMessages, setActiveMessages] = useState();
    const [haveNewMessageCons, setHaveNewMessageCons] = useState([]);
    const [openBoxChat, setOpenBoxChat] = useState(false);
    const [boxchat, setBoxChat] = useState([]);
    const [change, setChange] = useState(false);
    const [listChatNoti, setListChatNoti] = useState([]);
    const [render, setRender] = useState(false);
    //show chấm đỏ mini chat
    const [showNewMessMiniChat, setShowNewMessMiniChat] = useState([]);
    const [addChatGroup, setAddChatGroup] = useState(false);

    useEffect(() => {
        const token = getCookieChatToken()

        if (!token) {
            setIsNeedLogin(true);
            return;
        }

        if (userLogin.language) setLanguage(userLogin.language);

        // Init socket
        const socket = io(process.env.NEXT_PUBLIC_CHAT_SERVER_URL, {
            transports: ['websocket'],
            auth: { token },
            autoConnect: true,
        });
        setSocket(socket);

        // Init service
        const chatService = new ChatService(token);
        setChatService(chatService);
    }, []);

    const [msg, setMsg] = useState();
    const onReceiveMessage = useCallback((msg) => {
        const { conversationId } = msg;

        updateConversationState(conversationId, { latestMessage: msg }, true);
        if (
            activeConversation
            && activeConversation.id === conversationId
            && activeMessages
        ) setActiveMessages((prevState) => [...prevState, msg]);

        // TODO: write to indexedDB
    }, [conversations, activeConversation]);
    useEffect(() => {
        if (!msg) return;
        onReceiveMessage(msg)
    }, [msg])

    useEffect(() => {
        if (!socket) return;
        socket.on(CONSTANTS.EVENT_NAMES.CONVERSATION.RECEIVE_MESSAGE, (msg) => {
            console.log('main receive msg: ', msg);
            setMsg(msg)
        });
        socket.on(CONSTANTS.EVENT_NAMES.CONVERSATION.REACTION, ({userId, icon, messageId, conversationId}) => {
            console.log(`user ${allUserObj[userId]} react to ${conversationId}, message ${messageId}`);
            // TODO: update here
        });
    }, [socket]);

        useEffect(() => {
        if (!chatService) return;
        const load = async () => {
            const allUsers = await chatService.getAllRelatedUsers();
            setAllUserObj(_.keyBy(allUsers, 'id'));
        };

        load();
    }, [chatService]);

    useEffect(() => {
        if (!chatService || !allUserObj) return;

        const load = async () => {
            const conversationInfos = await chatService.getConversationInfos({ isIncludeLTMsg: true });
            const conversations = conversationInfos.map((c) => {
                const conversationName =
                    c.type === CONSTANTS.CONVERSATION.TYPE.GROUP
                        ? c.name
                        : c.createdBy === userLogin.id
                        ? allUserObj[c.directUserId]?.username
                        : allUserObj[c.createdBy].username;
                return {
                    ...c,
                    name: conversationName,
                    unReadMsgCount: 0, // TODO: check here
                };
            });

            setConversations(conversations);
        };

        load();
    }, [chatService, userLogin, allUserObj, addChatGroup]);

    const updateConversationState = useCallback((conversationId, newData, isNewMessage = false) => {
        const targetConIndex = conversations.findIndex((c) => c.id === conversationId);

        if (targetConIndex < 0) return;
        const targetCon = conversations[targetConIndex];

        if (_.every(newData, ( v, k ) => _.isEqual(targetCon[k], v))) return;

        conversations[targetConIndex] = {
            ...conversations[targetConIndex],
            ...newData,
            ...(isNewMessage ? { unReadMsgCount: conversations[targetConIndex] && conversations[targetConIndex].unReadMsgCount + 1 } : {}),
        };
        setConversations([...conversations]);
    }, [conversations]);

    const loadMore = () => {
        // TODO
    };

    const toggleBoxChat = () => {
        setOpenBoxChat(true);
    };

    const deleteBoxChat = () => {
        setOpenBoxChat(false);
    };
    //Start Call/Video

    const myVideo = useRef();
    const userVideo = useRef();
    const haveCall = (idUser) => {
        var spec = 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=350,width=850,height=600';
        let url = `../../videocall/callaway?id=${idUser}`;

        window.open(url, '_blank', spec);
    };

    // Nhận cuộc gọi từ người khác, từ nhóm
    const haveIncomingCall = (messContent) => {
        var spec = 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=350,width=850,height=600';
        let url = `./../videocall/incomingcall?id=${messContent.from}`;

        window.open(url, '_blank', spec);
    };
    // useEffect(() => {
    //     socket.on("REQUEST_CALL" ,(data) =>{
    //         if (data.data.type == "start_request") {
    //             haveIncomingCall(data)
    //             console.log('Have Call',data);
    //         }
    //     })
    // }, []);
    const getMedia = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
        });
    };

    const answerCall = (userLogin) => {
        //
    };

    const callUser = (messContent, userLogin) => {
        haveCall(messContent.conversation.user.id);
        // socket.emit("REQUEST_CALL",
        // {
        //   from: userLogin.id,
        //   to: [...messContent.conversation.member],
        //   conversation_id: messContent.conversation.id,
        //   data: {
        //     type: "start_request",
        //   }
        // },
        // () => console.log('accept_call'))
    };
    const value = useMemo(
        () => ({
            allUserObj,
            userLogin,
            language,
            setLanguage,
            conversations,
            updateConversationState,
            activeConversation,
            setActiveConversation,
            activeMessages,
            setActiveMessages,
            haveNewMessageCons,
            setHaveNewMessageCons,
            socket,
            chatService,
            openBoxChat,
            toggleBoxChat,
            deleteBoxChat,
            setBoxChat,
            setOpenBoxChat,
            boxchat,
            change,
            setChange,
            listChatNoti,
            setListChatNoti,
            setShowNewMessMiniChat,
            showNewMessMiniChat,
            setRender,
            render,
            //call-video
            myVideo,
            userVideo,
            answerCall,
            getMedia,
            setAddChatGroup,
        }),
        [
            userLogin,
            language,
            setLanguage,
            socket,
            conversations,
            chatService,
            openBoxChat,
            toggleBoxChat,
            deleteBoxChat,
            setBoxChat,
            boxchat,
            change,
            setChange,
            listChatNoti,
            setListChatNoti,
            setShowNewMessMiniChat,
            showNewMessMiniChat,
            setRender,
            render,
            myVideo,
            userVideo,
            answerCall,
            getMedia,
            setAddChatGroup,
        ]
    );

    if (isNeedLogin) return <div>TODO: navigate to login</div>;

    return (
        <>
            <BoxChatContext.Provider value={value}>{children}</BoxChatContext.Provider>
        </>
    );
};

const useBoxChatContext = () => {
    const contextValue = useContext(BoxChatContext);

    if (!contextValue) {
        console.error('The useBoxChatContext hook was called outside of the BoxChatProvider.');
    }
    return contextValue || {};
};

export { useBoxChatContext, BoxChatProvider};
