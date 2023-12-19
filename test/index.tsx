import { createElement } from "../jsx-runtime/src";

let a = createElement("a");
let c = createElement("label");
let b = document.createElement("label");

a.href = "";
a.htmlFor = "";
c.href = "";
c.htmlFor = "";
b.htmlFor = "";

let n = <></>;
let m = <label htmlFor="" href="" ></label>;
m.innerHTML = "";
m.href = "";
m.htmlFor = "";
