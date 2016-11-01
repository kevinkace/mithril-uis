"use strict";

let currStep = m.prop(0);

function bgp(currStep, steps, frames) {
    let div = 100 / (frames - 1),
        per = (currStep/steps) * 100 + div / 2,
        num = Math.floor(per / div) * div;

    return `${num}% 0`;
}

const frames = 10,
    steps    = 50,
    comp     = {
        view : (ctrl) => {
            return m("div", { class : "container" },
                m("div", {
                    class : "viewer",
                    style : {
                        backgroundImage : "url(img/1-0.png)",
                        backgroundPosition : bgp(currStep(), steps, frames)
                    }
                }),
                m("input", {
                    class   : "range",
                    type    : "range",
                    min     : 0,
                    max     : steps,
                    step    : 1,
                    oninput : m.withAttr("value", currStep),
                    value   : currStep()
                })
            );
        }
    };

m.mount(document.body, comp);
