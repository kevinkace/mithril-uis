"use strict";

const fullscreenVideo = {
        fullscreen : (vnode, state) => {
            if(typeof state !== "undefined") {
                vnode.state._fullscreen = state;
            }

            return vnode.state._fullscreen;
        },
        oninit : (vnode) => {
            vnode.state.fullscreen = vnode.state.fullscreen.bind(null, vnode);
        },
        view : (vnode) =>
            m("span", { class : vnode.state.fullscreen() ? "fullscreen" : "" },
                m("button", {
                    class : vnode.state.fullscreen() ? "play playFs" : "play",
                    onclick : (e) => {
                        vnode.state.fullscreen(true);
                    }
                }, "play"),
                vnode.state.fullscreen() ? [
                    m("button", { class : "close" }, "✕"),
                    m("div", { class : "video" },
                        m("iframe")
                    )
                ] : null
            )
    };

m.mount(document.body, fullscreenVideo);
