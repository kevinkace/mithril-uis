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

            vnode.state.width = window.innerWidth - 20;
            vnode.state.height = window.innerHeight - 20;
        },
        view : (vnode) =>
            m("span", { class : vnode.state.fullscreen() ? "fullscreen" : "" },
                m("button", {
                    class : vnode.state.fullscreen() ? "play playFs" : "play",
                    onclick : (e) => {
                        vnode.state.width = window.innerWidth - 20;
                        vnode.state.height = window.innerHeight - 20;

                        vnode.state.fullscreen(true);
                    }
                }, "play"),
                vnode.state.fullscreen() ? [
                    m("button", { class : "close" }, "✕"),
                    m("div", {
                            class : "video",
                            oncreate : (vnode) => {
                                setTimeout(() => {
                                    vnode.dom.webkitRequestFullscreen();
                                }, 300);
                            }
                        },
                        m.trust(`<iframe width="${vnode.state.width}" height="${vnode.state.height}" src="https://www.youtube.com/embed/WqgGIrGnhbo?autoplay=1" frameborder="0" allowfullscreen></iframe>`)
                    )
                ] : null
            )
    };

m.mount(document.body, fullscreenVideo);
