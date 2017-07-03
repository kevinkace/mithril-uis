"use strict";

const details = [{
        title: "detail 0"
    }, {
        title: "detail 1"
    }, {
        title: "detail 2"
    }, {
        title: "detail 3"
    }];

m.mount(document.getElementById("mount"), {
    oninit: (vnode) => {
        vnode.state.paras = stream([]);

        m.request("https://baconipsum.com/api/?type=meat-and-filler&paras=10", {
                method : "GET"
            })
            .then(vnode.state.paras)
            .then(m.redraw.bind(null))
            .catch((err) => {
                console.log("failed");
                console.log(err);
            });
    },
    view: (vnode) => [
        m("a", {
            href  : "#acc",
            class : "jump"
        }, "Jump to Accordion"),
        m("div", {
                class : "section"
            },
            vnode.state.paras().map((p) => m("p", p))
        ),

        m("div", {
                id: "acc"
            },
            details.map((det, idx) =>
                m("div", {
                        class : "item"
                    },

                    m("a", {
                            class : "cta noZensmooth",
                            id    : `detail${idx}`,
                            href  : `#detail${idx}`,

                            onclick: (e) => {
                                e.preventDefault();
                                vnode.state.dom = e.currentTarget;

                                vnode.state.detail = vnode.state.detail === idx ? false : idx;
                            }
                        },
                        det.title
                    ),

                    vnode.state.detail === idx ?
                        m("div", {
                                class : "show",

                                ontransitionend : (e) => {
                                    let detailsRect,
                                        headerRect;

                                    if (vnode.state.detail !== idx) {
                                        return;
                                    }

                                    detailsRect = e.currentTarget.getBoundingClientRect();
                                    headerRect = vnode.state.dom.getBoundingClientRect();

                                    if (headerRect.top < 0 || detailsRect.bottom > window.innerHeight) {
                                        zenscroll.to(vnode.state.dom, 200);
                                    }
                                },

                                oncreate : (dVnode) => {
                                    dVnode.dom.style.maxHeight = `${dVnode.dom.scrollHeight}px`;
                                    m.redraw();
                                },
                                onbeforeremove : (dVnode) => {
                                    dVnode.dom.style.maxHeight = 0;

                                    return new Promise((resolve, reject) => {
                                        dVnode.dom.addEventListener("transitionend", (e) => {
                                            resolve();
                                        });
                                    });
                                }
                            },
                            m("div", { class : "cont" }, vnode.state.paras()[idx])
                        ) :

                        null
                )
            )
        ),
        m("div", {
                class : "section"
            },
            vnode.state.paras().map((p) => m("p", p))
        )
    ]
});
