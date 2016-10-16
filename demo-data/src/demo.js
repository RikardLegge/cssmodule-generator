import style1 from "./demo1.css";
import style2 from "./demo2.css";
import style3 from "./nested/demo3.css";
var style;

style = style1;
document.write(`

<div class="${style.modal}">
  <div class="${style.container}">
    <div class="${style.button}">Click me!</div>
  </div>
</div>

`);

style = style2;
document.write(`

<div class="${style.modal}">
  <div class="${style.container}">
    <div class="${style.button}">Click me!</div>
  </div>
</div>

`);


style = style3;
document.write(`

<div class="${style.modal}">
  <div class="${style.container}">
    <div class="${style.button}">Click me!</div>
  </div>
</div>

`);