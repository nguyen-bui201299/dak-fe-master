import React from 'react'
import { BoxChatProvider } from '../../components/BoxChat/BoxChatContext'
import { ConversationProvider } from '../../components/BoxChat/ConversationContext'
import HomeCall from './HomeCall'

const index = () => {
  return (
    <BoxChatProvider>
      <ConversationProvider>
        <HomeCall/>
      </ConversationProvider>
    </BoxChatProvider>
  )
}

export default index