"use strict";

const data = [
         "1.jpg",  "2.jpg",  "3.jpg",  "4.jpg",  "5.jpg",
         "6.jpg",  "7.jpg",  "8.jpg",  "9.jpg", "10.jpg",
        "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
        "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg",
        "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg",
        "26.jpg", "27.jpg", "28.jpg", "29.jpg", "30.jpg"
    ],
    win = {
        isInside : (vnode) => {
            let bleed = 200,
                rect;

            if(!vnode.dom || !window.innerHeight) {
                return;
            }

            rect = vnode.dom.getBoundingClientRect();

            // bottom is not more than $bleed above top
            // top is not more than $bleed below bottom
            return rect.bottom + bleed > 0 && rect.top - window.innerHeight <= bleed;
        }
    };

function show(vnode) {
    let inside = win.isInside(vnode);

    if(!vnode.state.show && inside) {
        vnode.state.show = true;
        return;
    }
    m.redraw();
}

let lazy = {
        oninit : (vnode) => {
            if(vnode.attrs.show) {
                vnode.state.show = true;
            }
        },
        oncreate : show,
        onupdate : show,
        view : (vnode) => {
            return m("img", {
                src    : vnode.state.show ? vnode.attrs.src : "",
                id     : vnode.attrs.id,
                width  : vnode.attrs.width,
                height : vnode.attrs.height
            })
        }
    },
    imgs = {
        view : () => m("div",
            data.map((path, idx) => m(lazy, {
                src    : `img/${path}`,
                id     : idx,
                show   : idx < 5,
                width  : 200,
                height : 200
            }))
        )
    };

m.mount(document.body, imgs);

window.addEventListener("scroll", m.redraw.bind(m, null));
