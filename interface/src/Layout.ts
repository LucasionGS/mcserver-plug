const header = document.querySelector("header");
const footer = document.querySelector("footer");
type HTMLChild = HTMLElement | string;
const make = <K extends keyof HTMLElementTagNameMap>(tag: K, children?: HTMLChild | HTMLChild[], options?: Partial<HTMLElementTagNameMap[K]>): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === "string") {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    } else {
      element.append(children);
    }
  }

  if (options) {
    Object.assign(element, options);
  }

  return element;
}
// Create header
if (header) {
  // const headerElement = document.createElement("h1");
  // // Add buttons: [ Home, Server list ]
  // const homeButton = make("button", "Home");
}
// Create footer
if (footer) {
  // const footerElement = document.createElement("h1");
}