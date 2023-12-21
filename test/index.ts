// @ts-ignore
import { CreateElement } from "../jsx-runtime/src";

const a = CreateElement("a", {});
const c = CreateElement("label", {});
const b = document.createElement("label", {});

a.href = "";
a.htmlFor = "";
c.href = "";
c.htmlFor = "";
b.htmlFor = "";

document.body.appendChild(a);

/* let n = <></>;
let m = <label htmlFor="" href="" ></label>;
m.innerHTML = "";
m.href = "";
m.htmlFor = ""; */
