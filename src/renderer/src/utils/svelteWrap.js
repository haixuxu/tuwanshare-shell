const deferred = function () {
    const defer = {};
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
};

let modalWrapEl = null;

export function createSvelte(_Class, props, target = document.body) {
    let modal = new _Class({ target, props: { destorySvelte, ...props } });

    function destorySvelte() {
        modal?.$destroy();
        modal = null;
    }

    return { modal, destorySvelte };
}

export function createModal(_Class, props) {
    console.log('createModal===',props);
    let defer = deferred();
    const el = document.createElement("div");
    el.setAttribute("class", "shadow_container");
    // el.setAttribute("style", elStyleText); //
    document.body.appendChild(el);
    const modalWrapEl = el;

    let modal = new _Class({ target: modalWrapEl, props: { closeModal, ...props } });

    function closeModal(err, result) {
        modalWrapEl.remove();
        modal?.$destroy();
        modal = null;
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
    }

    return { modal, closeModal, promise: defer.promise };
}

export function secureCloseModal(closeModal, err, ret) {
    if (closeModal) {
        // 当前页面上的modal
        closeModal(err, ret);
    } else {
        // modal in webview route page
        try {
            JsBridge.callCloseWebView();
        } catch (error) {
            
        }
    }
}
