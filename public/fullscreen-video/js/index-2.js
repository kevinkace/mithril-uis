"use strict";

const id = "player",

    preload = true;

let ytApiReady;

// set a flag when YT API JS is loaded
function onYouTubeIframeAPIReady() {
    ytApiReady = true;
}

const fullscreenVideo = {
        // fullscreen getter/setter I'm not sure why...
        // todo: change to simple prop
        fullscreen : (vnode, state) => {
            if(typeof state !== "undefined") {
                vnode.state._fullscreen = state;
            }

            return vnode.state._fullscreen;
        },
        oninit : (vnode) => {
            // bind vnode to fullscreen getter/setter
            vnode.state.fullscreen = vnode.state.fullscreen.bind(null, vnode);

            vnode.state.id = "player";
            vnode.state.videoPlayer = m("div", { id : vnode.state.id });
            vnode.state.videoContainer = m("div", { key : "video" }, vnode.state.videoPlayer);

            vnode.state.tryInitYtPlayer = () => {
                if(ytApiReady) {
                    // had to wait to init player
                    if(vnode.state.interval) {
                        console.debug("init after wait");

                        clearInterval(vnode.state.interval);
                    }

                    vnode.state.initYtPlayer();

                    return true;
                }

                return false;
            }

            vnode.state.initYtPlayer = () => {
                if(vnode.state.player) {
                    console.error("Tried initing twice?");

                    return;
                }

                console.debug("Init player");

                vnode.state.player = new YT.Player(vnode.state.id, {
                        width   : vnode.state.width,
                        height  : vnode.state.height,
                        videoId : "WqgGIrGnhbo",
                        playerVars : {
                            listType : "playlist",
                            list : "PLWeAa_K_4zVE6ygTGf68oFpUw37ZdiyD_"
                        },
                        events : {
                            onReady : (e) => {
                                vnode.state.target = e.target;
                                // debugger;
                                vnode.state.videoPlayer = e;
                            },
                            onError : (e) => {
                                // debugger;
                            }
                        }
                    });
            }

        },
        oncreate : (vnode) => {
            if(!vnode.state.tryInitYtPlayer()) {
                vnode.state.interval = setInterval(vnode.state.tryInitYtPlayer, 200);
            }
            // get the YT player ready
            // if(ytApiReady) {
            //     vnode.state.initYtPlayer();
            // } else {
            //     // try again later
            //     vnode.state.interval = setInterval(() => {
            //         if(ytApiReady) {
            //             vnode.state.initYtPlayer();
            //         }
            //     }, 200);
            // }
            //  else {
            //     vnode.state.iframe = m("iframe", {
            //             oninit : () => console.log(vnode.state.player),
            //             id              : vnode.state.id,
            //             width           : vnode.state.width,
            //             height          : vnode.state.height,
            //             src             : "https://www.youtube.com/embed/WqgGIrGnhbo",
            //             frameborder     : 0,
            //             allowfullscreen : ""
            //         });
            // }
            m.redraw();
        },
        view : (vnode) =>
            m("span", { class : vnode.state.fullscreen() ? "fullscreen" : "" },
                m("button", {
                    class   : vnode.state.fullscreen() ? "play playFs" : "play",
                    onclick : (e) => {
                        vnode.state.width = window.innerWidth - 20;
                        vnode.state.height = window.innerHeight - 20;

                        vnode.state.fullscreen(true);
                    }
                }, "play"),
                vnode.state.fullscreen() ? null : vnode.state.videoContainer,
                vnode.state.fullscreen() ? [
                    m("button", { class : "close" }, "✕"),
                    m("div", {
                            class    : "video",
                            oncreate : () => {
                                if(vnode.state.target) {
                                    vnode.state.target.playVideo();

                                    return;
                                }

                                vnode.state.player = null;

                                m.redraw();
                            }
                        },
                        vnode.state.videoContainer
                    )
                ] : null
            )
    };

m.mount(document.body, fullscreenVideo);
