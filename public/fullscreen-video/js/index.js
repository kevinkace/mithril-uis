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
            m("button", {
                onclick : (e) => {
                    vnode.state.fullscreen(true);
                },
                class : vnode.state.fullscreen() ? "fullscreen" : ""
            }, "play")
    };

m.mount(document.body, fullscreenVideo);
