"use strict";

let ytApiReady;

// set a flag when YT API JS is loaded
function onYouTubeIframeAPIReady() {
    ytApiReady = true;
}

const fullscreenVideo = {
        // fullscreen getter/setter I'm not sure why...
        // todo: change to simple prop
        fullscreen : false,
        id         : "player",

        view : (vnode) =>
            m("span", { class : vnode.state.fullscreen ? "fullscreen" : "" },
                m("button", {
                    class   : vnode.state.fullscreen ? "play playFs" : "play",
                    onclick : (e) => {
                        vnode.state.width = window.innerWidth - 20;
                        vnode.state.height = window.innerHeight - 20;

                        vnode.state.fullscreen = true;

                        vnode.state.playerType = ytApiReady ? "api" : "iframe";
                    }
                }, "play"),
                vnode.state.fullscreen ? [
                    m("button", { class : "close" }, "✕"),
                    m("div", {
                            class    : "video",
                            oncreate : () => {
                                if(vnode.state.playerType === "api") {
                                    console.log("api");
                                    vnode.state.player = new YT.Player(vnode.state.id, {
                                        width   : vnode.state.width,
                                        height  : vnode.state.height,
                                        videoId : "WqgGIrGnhbo",

                                        playerVars : {
                                            listType : "playlist",
                                            list : "PLWeAa_K_4zVE6ygTGf68oFpUw37ZdiyD_",
                                            autoplay : 1
                                        },

                                        events : {
                                            onReady : (e) => {
                                                vnode.state.target = e.target;
                                                // debugger;
                                                vnode.state.videoPlayer = e;
                                                // vnode.state.target.playVideo()
                                            },
                                            onError : (e) => {
                                                // debugger;
                                            }
                                        }
                                    });
                                } else {
                                    console.log("iframe");
                                    vnode.state.player = m("iframe", {
                                        oninit : () => console.log(vnode.state.player),

                                        id              : vnode.state.id,
                                        width           : vnode.state.width,
                                        height          : vnode.state.height,
                                        src             : "https://www.youtube.com/embed/WqgGIrGnhbo?enablejsapi=1&autoplay=1",
                                        frameborder     : 0,
                                        allowfullscreen : ""
                                    });
                                }

                                if(vnode.state.player && vnode.state.target) {
                                    vnode.state.target.playVideo();

                                    return;
                                }
                                m.redraw();
                            }
                        },
                    vnode.state.playerType === "api" ?
                        // this div will get replaced by the YT iframe
                        m("div", { id : vnode.state.id }) :
                        // or just the iframe
                        vnode.state.player
                    )
                ] : null
            )
    };

m.mount(document.body, fullscreenVideo);
