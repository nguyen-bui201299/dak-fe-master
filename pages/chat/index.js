import React from 'react'
import { BoxChatProvider } from '../../components/BoxChat/BoxChatContext'
import { ConversationProvider } from '../../components/BoxChat/ConversationContext'
import Chat from './chat'
const index = () => {
  return (
    <BoxChatProvider>
        <ConversationProvider>
            <Chat/>
        </ConversationProvider>
    </BoxChatProvider>
  )
}

export default index