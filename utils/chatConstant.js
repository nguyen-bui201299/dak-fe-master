// User
const USER = {
    NAME_LENGTH: {
        MIN: 1,
        MAX: 64,
    },
    STATUS: {
        OFFLINE: 0,
        ONLINE: 1,
    },
};
const USER_DEFAULT = {
    STATUS: USER.STATUS.OFFLINE,
    IS_ACTIVE_MEMBER: false,
    IS_BLOCK_STRANGER: false,
};

// Conversation
const CONVERSATION = {
    TYPE: {
        INDIVIDUAL: 1,
        GROUP: 2,
    },
    NAME_LENGTH: {
        MIN: 1,
        MAX: 255,
    },
    ROLE_TYPE: {
        OWNER: 1,
        ADMIN: 2,
        MEMBER: 3,
    },
};

// Message
const MESSAGE = {
    MESSAGE_DATA_TYPE: {
        TEXT: 1,
        FILE: 2,
        IMAGE: 3,
        MEDIA: 4,
    },
    LIMIT: 50,
    // MESSAGE_STATUS: {
    // 	SENDING: 1,
    // 	SENDED: 2,
    // 	SEEN: 3,
    // 	SEND_FAIL: 4
    // }
};

// const MESSAGE_DATA_PAGE_LIMIT = 50;

// const REQUEST_VIDEO_CALL_EVENT = {
// 	READY: 'ready',
// 	OFFER: 'offer',
// 	ANSWER: 'answer',
// 	CANDIDATE: 'candidate'
// };

// export enum EnumVideoCallType {
// 	ready = 'ready',
// 	offer = 'offer',
// 	answer = 'answer',
// 	candidate = 'candidate',
// 	start_request = 'start_request',
// 	end_request = 'end_request',
// 	request_call_accept = 'request_call_accept',
// 	request_call_denied = 'request_call_denied'
// }

const EVENT_NAMES = {
    CONVERSATION: {
        SEND_MESSAGE: 'SEND_MESSAGE',
        SENDED: 'SENDED',
        ACTIVE: 'ACTIVE',
        SEND_FAIL: 'SEND_FAIL',
        TYPING_ON: 'TYPING_ON',
        TYPING_OFF: 'TYPING_OFF',
        REACTION: 'REACTION',
        RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
    },
};

const CONSTANTS = {
    USER,
    USER_DEFAULT,

    CONVERSATION,

    MESSAGE,
    EVENT_NAMES,
};

export default CONSTANTS;
