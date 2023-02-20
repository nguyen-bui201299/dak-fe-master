import React, { useMemo } from 'react';
import Styles from '../../styles/Chat.module.css';
import { useBoxChatContext } from '../../components/BoxChat/BoxChatContext';
import ConversationItem from './ConversationItem';

const ConversationList = ({ type, toggleState }) => {
    const { conversations } = useBoxChatContext();
    const typeConversations = useMemo(() => {
        if (!conversations) return [];
        return type === toggleState
            ? conversations.filter(c => c.type === type)
            : [];
    }, [type, toggleState, conversations]);

    return (
        <div className={`${Styles["chat__list"]} ${type === toggleState ? Styles["active"] : ''}`}>
            {
                typeConversations.length > 0 && typeConversations.map((conversation, index) => {
                    return (
                            <div key={index}>
                            <ConversationItem
                                conversation={conversation}
                                toggleState={toggleState}
                            />
                        </div>
                    )
                })
            }
        </div>
    );

}

export default ConversationList;
