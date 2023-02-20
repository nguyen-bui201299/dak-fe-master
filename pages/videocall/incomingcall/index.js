import React from 'react'
import { BoxChatProvider } from '../../../components/BoxChat/BoxChatContext'
import Incomingcall from './inComingCall'
const index = () => {
  return (
    <BoxChatProvider>
      <Incomingcall/>
    </BoxChatProvider>
  )
}

export default index