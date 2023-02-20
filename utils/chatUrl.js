const isFacebook = /(?:http|https):\/\/(m.facebook|fb.watch|facebook.com).+/i;
const isTiktok = /^https:\/+www\.[tiktok]+\.com\/([\w@]+\/?)([a-z0-9]+\/?)*/i;
const isTwitter = /^https:\/+[twitter]+\.com\/([\w@]+\/?)([a-z0-9]+\/?)*/i;
const isYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i;
const isInstagram = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/g;
const isTwitch = /(https:)\/\/(www)(.)(twitch)(.)(tv)\/(.*)\/*.*/i;

function getUrlType(urlArr) {
    if ( !urlArr ) return;
    if (urlArr.length > 0) {
        if (isFacebook.test(urlArr)) {
            return 'facebook';
        }
        if (isTiktok.test(urlArr)) {
            return 'tiktok';
        }
        if (isTwitter.test(urlArr)) {
            return 'twitter';
        }
        if (isYoutube.test(urlArr)) {
            return 'youtube';
        }
        if (isInstagram.test(urlArr)) {
            return 'instagram';
        }
        if (isTwitch.test(urlArr)) {
            return 'twitch';
        }
    } else return;
}
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
// Xử lý gửi link
const linkify = (text) => {
    if (!text.includes('<img')) {
        return text.replace(urlRegex, function (url) {
            return '<a style="color: #087cce; text-decoration: underline" target="_blank" href="' + url + '">' + url + '</a>';
        });
    } else {
        return text;
    }
};

export { getUrlType, urlRegex, linkify };