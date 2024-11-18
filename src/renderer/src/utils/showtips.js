let timer = null;
let ready = false;
export default function showTips(text) {
    if (!ready) {
        ready = true;
        const styleText = `position: fixed; opacity: 0; z-index: 100014; 
        background: rgba(0, 0, 0, 0.8); line-height: 30px; 
        padding: 0 20px; left: 50%; top: 50%; color: #fff; 
        font-size: 14px; border-radius: 6px; 
        text-align: center; transform: translate(-50%, -50%)`;
        $(document.body).append($(`<div id="chat-tips" style="${styleText}"></div>`));
    }
    if (text && text.length) {
        window.clearTimeout(timer)

        var tips = window.$("#chat-tips");
        tips.html(text);
        tips.show();
        tips.animate({
            opacity: 1
        }, 300, function() {
            timer = setTimeout(function() {
                tips.animate({
                    opacity: 0
                }, 300, function() {
                    tips.hide();
                })
            }, 3000)
        })
    }
}
