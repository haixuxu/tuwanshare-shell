const { session } = require('electron');
// 获取自定义会话分区
const customSession = session.fromPartition('persist:diandianuser');


const filter = {
    urls: ['*://*/*'], // 你可以指定要拦截的 URL
};
customSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    console.log('Request URL:', details.url);
    callback({});
});
// session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
//   console.log('Request URL:', details.url);
//   callback({});
// });
// 拦截请求，自动附加 Cookie
customSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const baseUrl = getBaseUrl(details.url);
    if (!/tuwan.com/.test(baseUrl)) {
        callback({ requestHeaders: details.requestHeaders });
        return;
    }

    customSession.cookies
        .get({ url: baseUrl })
        .then((cookies) => {
            const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
            if (cookieHeader) {
                details.requestHeaders['Cookie'] = cookieHeader; // 设置 Cookie 头
            }
            console.log('=====sendcookie==', baseUrl, ' \ncookie:', cookieHeader);

            callback({ requestHeaders: details.requestHeaders });
        })
        .catch((error) => {
            console.error('Error fetching cookies:', error);
            callback({ requestHeaders: details.requestHeaders });
        });
});

// 拦截响应，自动存储 Cookie
customSession.webRequest.onHeadersReceived((details, callback) => {
    const url = details.url;
    const baseUrl = getBaseUrl(details.url);
    if (!/tuwan.com/.test(baseUrl)) {
        callback({ responseHeaders: details.responseHeaders });
        return;
    }
    const setCookieHeaders = details.responseHeaders['Set-Cookie'] || details.responseHeaders['set-cookie'] || [];

    console.log("=====readcookie==", baseUrl, " \ncookie:", setCookieHeaders);

    setCookieHeaders.forEach((cookieString) => {
        const cookie = parseSetCookie(cookieString, baseUrl);
        // console.log('parsecookie=====',cookieString,baseUrl);
        if (cookie) {
            // console.log('1111111====',cookie);
            if (cookie.value === '') {
                // 如果 Cookie 没有值，删除 Cookie
                // console.log("remove cookie====",cookie.url,cookie.name);
                customSession.cookies.remove(cookie.url, cookie.name).catch((error) => console.error('Error removing cookie:', error));
            } else {
                // 设置新 Cookie
                customSession.cookies.set(cookie).catch((error) => console.error('Error setting cookie:', error));
            }
        }
    });

    callback({ responseHeaders: details.responseHeaders });
});

// Helper function: Parse Set-Cookie string into a Cookie object
function parseSetCookie(cookieString, url) {
    const parts = cookieString.split(';').map((part) => part.trim());
    const [name, value] = parts[0].split('=');

    if (!name) {
        return null;
    }

    const cookie = {
        url, // Default to the full URL if domain is not explicitly set
        name,
        value,
    };

    // Parse additional attributes
    parts.slice(1).forEach((part) => {
        const [key, val] = part.split('=').map((p) => p.trim().toLowerCase());
        if (key === 'domain') {
            cookie.domain = val.startsWith('.') ? val : `.${val}`; // Ensure domain starts with `.`
            //   cookie.url = `http${cookie.secure ? "s" : ""}://${cookie.domain}`;
        } else if (key === 'path') {
            cookie.path = val;
        } else if (key === 'secure') {
            cookie.secure = true;
        } else if (key === 'httponly') {
            cookie.httpOnly = true;
        } else if (key === 'expires') {
            cookie.expirationDate = new Date(val).getTime() / 1000;
        }
    });

    return cookie;
}

function getBaseUrl(url) {
    const { protocol, host, pathname } = new URL(url);
    return `${protocol}//${host}${pathname}`;
}