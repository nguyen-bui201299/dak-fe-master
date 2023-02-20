import axios from 'axios';
import { getCookieChatToken, getCookieRefreshToken, getCookieXSRFToken, getTokenUserLogin } from './modules/Cookies/Auth/userLogin';
//const https = require('https');
//import fs from 'fs'

const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export default axios.create(
  {
    // Product
    baseURL: "https://beta.dakshow.com/api",
    
    // Dev
    // baseURL: "http://115.78.232.196:88/api"

  },
  { httpsAgent: agent }
);

export const endpoints = {
  'auth/login': language => `/auth/login?locale=${language}`,
  'auth/register': language => `/auth/register?locale=${language}`,
  'auth/logout': `/auth/logout`,
  'getPublicKey': usernameOrEmail => `/auth/login/${usernameOrEmail}`,
  'sendEmailVerifiAccount': '/auth/active-account/send-code',
  'sendCodeVerifiAccount': '/auth/active-account',
  'getAllPostIds': '/post/post_ids/',
  'getPostId': '/post/guest/new_feed?list_post_id',
  'getdetailpostbyid': '/post/new_feed/',
  'getpost': postid => `/post/${postid}`,
  'getRankPost': limit => `/post/rank-full?limit=${limit}`,
  'follow': '/user/friendship/follow',
  'unfollow': '/user/friendship/unfollow',
  'user/profile': id => `/user/profile/${id}`,
  'wallet': '/wallet/my-wallet',
  'getUserByWalletToken': id => `wallet/${id}/user`,
  'getTokenUpload' : `upload/token`,
  'sendEmailConfirmSending': '/wallet/sendMail',
  'closeSectionConfirmEmail': '/wallet/session',

  'finduser': (page, limit, keyword) =>
    `/user?limit=${page}&page=${limit}&keyword=${keyword}`,
  'findFriends': (limit, page, keyword) =>
    `/user/friend-each-other?limit=${limit}&page=${page}&keyword=${keyword}`,
  'findgroup': (limit, page, keyword) =>
    `/user/search-group?limit=${limit}&page=${page}&keyword=${keyword}`,
  'findAllPost': (limit, page, keyword) =>
    `/post/caption?keyword=${keyword}&page=${page}&limit=${limit}`,
  'walletTransfer': '/wallet/transfer',
  'walletRequest': '/wallet/request',
  'transferRequest': (type, limit) =>
    `/wallet/transfer/get-money-request/${type}?limit=${limit}`,
  'verifyTransferRequest': '/wallet/transfer/verify-money-request',
  'updateprofile': '/user/profile',
  'notiInviteGroup': id => `/group/${id}/invite-friends-to-group`,

  // CRUD cho bài viết
  'createPost': '/post',
  'deletePost': '/post',
  'updatePost': '/post',

  //chức năng xổ số
  'postlottery': '/lottery/buy-ticket',
  'getlotteryhistory': (limit, page, status) =>
    `/lottery/user-ticket?limit=${limit}&page=${page}&status=%5B${status}%5D`,
  'getlottery': '/lottery/ticket?page=1&limit=500',
  'claimReward': '/lottery/claim',

  'verifiForgetPassword': '/auth/forgot-password/send-code',
  'changePassword': 'auth/forgot-password/change-password',

  // Post interactive
  'likePost': '/post/interact/like',
  'getListLikes': postId => `/post/interact/like/${postId}`,
  'votePost': '/post/interact/vote',
  'getListVotes': postId => `/post/interact/vote/${postId}`,
  'sharePost': '/post/interact/share',
  'CreateAlbum': '/collection',
  'ListAlbum': (limit, page) => `/collection/list?page=${page}&limit=${limit}`,
  'DeleteAlbum': '/collection/',
  'commentPost': '/post/interact/comment',
  'likeComment': '/post/interact/like-comment',
  'findComment': (id, page, limit) =>
    `/post/comment/${id}?page=${page}&limit=${limit}`,
  'updateComment': '/post/comment',
  'updateReplyComment': '/post/update-reply-comment',
  'deleteComment': postCommentId => `/post/comment/${postCommentId}`,
  'getListPostProfile': (id, limit, page) =>
    `/user/profile/post/${id}?limit=${limit}&page=${page}`,

  'sharepost': '/post/interact/share',
  'PostReadToAlbum': '/collection/post',
  'findhastag': (keyword, limit, page) =>
    `/post/find/hashtag?keyword=${keyword}&limit=${limit}&page=${page}`,
  'getDetailProfile': id => `/user/profile/${id}`,
  'getPostInLib': collectionId => `/collection/post/${collectionId}`,
  'DelPostToLib': '/collection/post',
  'getUserFollower': (id, limit )=> `/user/profile/follower/${id}?limit=${limit}`,
  'getUserFollowing': (id, limit) => `/user/profile/following/${id}?limit=${limit}`,

  // Post group interactive
  'likePostGroup': '/group/interact/like',
  'getListLikesGroup': postId => `/group/interact/like/${postId}`,
  'votePostGroup': '/group/interact/vote',
  'getListVotesGroup': postId => `/group/interact/vote/${postId}`,
  'sharePostGroup': '/group/interact/share',
  'commentPostGroup': '/group/interact/comment',
  'likeCommentGroup': '/group/interact/like-comment',
  'replyCommentGroup': '/group/interact/reply_comment', 


  //đổi mật khẩu
  'alterPassword': '/auth/change-password',
  'getNotification': `/notification?page=1&limit=100`,
  'getDetailPost': id => `/post/${id}`,

  //liên kết tài khoản với các mạng xã hội
  'getUserLogin': '/auth',
  'getPostInLib': (collectionId, page, limit) =>
    `/collection/post/${collectionId}?page=${page}&limit=${limit}`,
  'getListTransaction':(limit) => `/wallet/transaction?limit=${limit}`,
  'getUserName': id => `/wallet/user-info/${id}`,
  'verifyProfile': '/auth/active-link-profile',
  'getEmailFacebook': '/email-bio/facebook',
  'getEmailTwitch': '/email-bio/twitch',
  'getEmailTiktok': '/email-bio/tiktok',
  'getEmailYoutube': '/email-bio/youtube',
  'getEmailTwitter': '/email-bio/twitter',
  'replyComment': '/post/interact/reply_comment',
  'FindReplyComment': (id, page, limit) =>
    `/post/reply-comment/${id}?page=${page}&limit=${limit}`,
  'deleteRepComment': (commentId, repCommentId) =>
    `/post/comment/reply-comment/${commentId}/${repCommentId}`,
  'getListHasTag': keyword => `/post/gethashtag?keyword=${keyword}`,
  'getLinkProfile': (page, limit) => `/user/verification/profile?page=${page}&limit=${limit}`,
  'deleteLinkProfile': id_link => `/user/link-profile/${id_link}`,
  //xác thực bài viết

  // CRUD tài khoản người dùng
  'DeleteAccount': id => `/auth/${id}`,
  'getUserLogin': '/auth',
  'verifyPost': '/post/verify-post',
  'refreshToken': '/auth/refresh-token?locale=en',

  'getPriceJackpot': '/lottery/price-jackpot',

  // Group manage API Sections
  'getDetailGroup': id => `/group/${id}`,
  'createGroup': '/group',
  'getGroupPost': id => `/group/${id}/post`,
  'getAllMember': id => `/group/${id}/members`,
  'createPostGroup': id => `/group/${id}/post`,
  'getListReqJoin': (idGroup, limit, page) =>
    `/group/${idGroup}/list-request?limit=${limit}&page=${page}`,
  'responseInviteGroup': (idGroup, req_id, action) =>
    `/group/${idGroup}/${req_id}/response-invite/${action}`,
  'getListPostReview': (idGroup, limit, page) =>
    `/group/${idGroup}/post-review?limit=${limit}&page=${page}`,
  'responsePostReview': (idGroup, post_id, action) =>
    `/group/${idGroup}/${post_id}/post-review/${action}`,
  'joinGroup': id => `/group/${id}/join`,
  'outGroup': group_id => `/group/${group_id}/out_group`,
  'findGroup': (limit, page, keyword) =>
    `/user/search-group?limit=${limit}&page=${page}&keyword=${keyword}`,
  'listJoinGroup': (limit, page) => `/group/get-list-group/joined?limit=${limit}&page=${page}`,
  'kickMember': (groupId, userId) => `/group/${groupId}/del-smember/${userId}`,
  'grantPermission': (group_id, user_id) => `/group/${group_id}/grant-role/${user_id}`,
  'grantPermissionAndOutGroup': (group_id, user_id) => `/group/${group_id}/out-group/${user_id}`,
  'deleteGroup': '/group',
  'banUserGroupAdmin' : group_id => `/group/${group_id}/members/ban`,
  'unbanUserGroupAdmin' : group_id => `/group/${group_id}/members/unban`,
  'listUsersBan': (group_id, limit, page) => `/group/${group_id}/members/ban?limit=${limit}&page=${page}`,

  // Statistics - Post, Viewers
  'getStatistics': (userId, listOfType, last6Month) => `/user/statistic/${userId}/time?type=${listOfType}&last6month=${last6Month}`
};

export let headers = {
  headers: {
    'Content-Type': 'application/json',
  },
  headers_token: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getTokenUserLogin()}`,

    // Token cho env dev
    'Refresh-Token': `${getCookieRefreshToken()}`,
    'Xsrf-Token': `${getCookieXSRFToken()}`,
    'Chat-Token': `${getCookieChatToken()}`
  },
};

