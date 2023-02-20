export const encodeStringStech = (jwt) => {
    var encodedString = "";
    const key = "stechvn";
    for (var i = 0; i < jwt.length; i++) {
        var encode_char = jwt[i].charCodeAt(0) + key[i%key.length].charCodeAt(0);
        encodedString += String.fromCharCode(encode_char);
    }
    return encodedString
}

export const decodeStringStech = (jwt) => {
    var parsedString = "";
    const key = "stechvn";
    for (var i = 0; i < jwt.length; i++) {
        var encode_char = jwt[i].charCodeAt(0) - key[i%key.length].charCodeAt(0);
        parsedString += String.fromCharCode(encode_char);
    }
    return parsedString;
}