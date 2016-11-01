"use strict";

var data = {
        srcsetO : {
            "500w"  : "img/500.jpg",
            "1000w" : "img/1000.jpg",
            "2000w" : "img/2000.jpg"
        },
        src : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wgARCAAPABQDAREAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwYHCP/EABgBAAMBAQAAAAAAAAAAAAAAAAIEBQED/9oADAMBAAIQAxAAAAAdORYpT09EMXJ0WhPFLmf/xAAjEAACAgEDBAMBAAAAAAAAAAABAgMEBQYRIQAHEjEIE0GB/9oACAEBAAE/ANOdqJrTLekq/dUikRbUKMBL9Z5Yqu+52Gx44G4J467idotJmbByYCLIy15w0rNZkBjrUgE8YI12PA3bkncnrPYyR8tYGLjt0qyEKkYtPyAOD+/mw9L64G2xOj/kv3b0FQqYzTWt8wlWp4GOrfaC4qEe0DvEZVQfiiQdWfm/38uY2tRt6qxweCcztOuDqSGw3gYyJI5kkiZefIARgBusj8oe9l601h+6eersfaUmSnD/ACKBY41/i9f/xAAfEQABAgcBAQAAAAAAAAAAAAACAAMBBAUSEyFBEcH/2gAIAQIBAT8AdqA22AW1IOvELmUtrEPTRgHtvUctCJb6o09rn1f/xAAgEQABAwIHAAAAAAAAAAAAAAABAAMxAhMEERIUIVJx/9oACAEDAQE/AGWiQLkLFEAjQOFed6rMVeIO1CIW4dX/2Q=="
    },
    supportSrcset = "srcset" in (new Image());

function imgOnload(vnode, e) {
    vnode.state.background = vnode.attrs.src;
    vnode.state.class = "fadeIn";

    if(!supportSrcset) {
        vnode.attrs.src = e.target.src;
    } else {
        vnode.attrs.srcset = e.target.srcset;
    }

    // remove span bg after animation?

    m.redraw();
}

function setSrc(domImg, srcsetO) {
    let sizes = Object.keys(srcsetO),
        unit  = sizes[0].match(/[a-zA-Z]+/)[0];

    if(!supportSrcset) {
        let size = sizes
            .map((size) => parseInt(size, 10))
            .sort((size1, size2) => size1 > size2 ? -1 : 1)
            .reduce((size, currSize) => !size || currSize > window.innerWidth ? currSize : size, 0);

        domImg.src = srcsetO[size + unit];

        return;
    }

    domImg.srcset = sizes
        .map((size) => `${srcsetO[size]} ${size}`)
        .join(", ");

    return;
}

let fader = {
        oninit : (vnode) => {
            var domImg = new Image();

            domImg.onload = imgOnload.bind(null, vnode);

            setSrc(domImg, vnode.attrs.srcsetO);
        },
        view : (vnode) =>
            m("span", { style : `background-image: url(${vnode.state.background || ""})` },
                m("img", {
                    src    : vnode.attrs.src,
                    srcset : vnode.attrs.srcset || "",
                    class  : vnode.state.class
                })
            )
    },
    imgs = {
        view : () => m("div", m(fader, data))
    };

m.mount(document.body, imgs);
