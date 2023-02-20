import axios from 'axios';
import _ from 'lodash';
const http = require('http');

const ChatPaths = {
    conversations: '/conversations',
    users: '/users',
};
const METHODS = {
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
};
const DEFAULT_PAGINATION_LIMIT = 50;

function getQueryString(query = {}) {
    if (!_.keys(query).length) return '';

    const pairs = _.reduce(
        query,
        (memo, value, key) => {
            if (value) memo.push(key + '=' + encodeURIComponent(value));
            return memo;
        },
        []
    );

    return pairs.length ? '?' + _.join(pairs, '&') : '';
}

class ChatService {
    /**
     * @private
     * @param {string} token
     */
    constructor(token) {
        this.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_CHAT_SERVER_URL,
            httpsAgent: new http.Agent({ rejectUnauthorized: false }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async createConversation(conversationCreateData) {
        const basicConversationInfo = await this._base(METHODS.POST, ChatPaths.conversations, {body: conversationCreateData});

        return basicConversationInfo;
    }

    async getConversationInfos(query = {}) {
        try {
            const { limit = DEFAULT_PAGINATION_LIMIT, offset = 0 } = query;
            const queryParams = { ...query, limit, offset };
            const basicConversationInfos = await this._base(METHODS.GET, ChatPaths.conversations, { queryParams });

            return basicConversationInfos;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     *
     * @param {string} conversationId
     */
    async getConversationDetail(conversationId) {
        const data = await this._base(METHODS.GET, ChatPaths.conversations, { queryPath: conversationId });

        return data;
    }

    async getConversationMessages(conversationId, query = {}) {
        try {
            const msgs = await this._base(
                METHODS.GET, ChatPaths.conversations,
                {
                    queryPath: `${conversationId}/messages`,
                    queryParams: {sort: 'desc', ...query}
                }
            );

            return msgs;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async deleteConversation(conversationId) {
        await this._base(METHODS.DELETE, `${ChatPaths.conversations}/${conversationId}`);
    }

    async addConversationMembers(conversationId, userIds) {
        await this._base(METHODS.POST, `${ChatPaths.conversations}/add`, {
            queryPath: conversationId,
            body: { ids: userIds },
        });
    }

    async removeConversationMembers(conversationId, userIds) {
        await this._base(METHODS.POST, `${ChatPaths.conversations}/remove`, {
            queryPath: conversationId,
            body: { ids: userIds },
        });
    }

    async getAllRelatedUsers() {
        const users = await this._base(METHODS.GET, ChatPaths.users); // TODO: get related only
        return users;
    }

    async _base(method, endPointPath, options = {}) {
        try {
            const { queryPath, queryParams, body } = options;
            const baseURI = queryPath ? `${endPointPath}/${queryPath}` : endPointPath;
            const uri = baseURI + getQueryString(queryParams);
            const axiosPromise = this.axiosInstance[method](uri, body);
            const response = await axiosPromise;
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ChatService;
