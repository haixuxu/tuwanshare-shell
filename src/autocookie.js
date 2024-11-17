const { session } = require('electron');

// 获取自定义会话分区
const customSession = session.fromPartition('persist:diandianuser');

// 拦截请求，自动附加 Cookie
customSession.webRequest.onBeforeSendHeaders((details, callback) => {
  // 获取当前请求的域名
  const url = new URL(details.url);
  const domain = url.origin;

  // 获取存储的 Cookie
  customSession.cookies.get({ url: domain })
    .then((cookies) => {
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      if (cookieHeader) {
        details.requestHeaders['Cookie'] = cookieHeader; // 设置请求头中的 Cookie
      }
      callback({ requestHeaders: details.requestHeaders });
    })
    .catch((error) => {
      console.error('Error fetching cookies:', error);
      callback({ requestHeaders: details.requestHeaders });
    });
});

// 拦截响应，自动存储 Cookie
customSession.webRequest.onHeadersReceived((details, callback) => {
  const setCookieHeaders = details.responseHeaders['Set-Cookie'] || [];
  const url = details.url;

  // 解析并存储 Cookie
  setCookieHeaders.forEach((cookieString) => {
    customSession.cookies.set({
      url,
      name: extractCookieName(cookieString),
      value: extractCookieValue(cookieString),
      // 解析其他属性（如 Secure、HttpOnly 等）
    }).catch((error) => console.error('Error setting cookie:', error));
  });

  callback({ responseHeaders: details.responseHeaders });
});

// Helper functions for parsing Cookie strings
function extractCookieName(cookieString) {
  return cookieString.split('=')[0].trim();
}

function extractCookieValue(cookieString) {
  return cookieString.split('=')[1].split(';')[0].trim();
}
