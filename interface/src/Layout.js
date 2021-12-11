"use strict";
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const make = (tag, children, options) => {
    const element = document.createElement(tag);
    if (children) {
        if (Array.isArray(children)) {
            children.forEach((child) => {
                if (typeof child === "string") {
                    element.appendChild(document.createTextNode(child));
                }
                else {
                    element.appendChild(child);
                }
            });
        }
        else {
            element.append(children);
        }
    }
    if (options) {
        Object.assign(element, options);
    }
    return element;
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFaEQsTUFBTSxJQUFJLEdBQUcsQ0FBd0MsR0FBTSxFQUFFLFFBQWtDLEVBQUUsT0FBMkMsRUFBNEIsRUFBRTtJQUN4SyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQUksUUFBUSxFQUFFO1FBQ1osSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDekIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7b0JBQzdCLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNyRDtxQkFBTTtvQkFDTCxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM1QjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDMUI7S0FDRjtJQUVELElBQUksT0FBTyxFQUFFO1FBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDakM7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUE7QUFDRCxnQkFBZ0I7QUFDaEIsSUFBSSxNQUFNLEVBQUU7SUFDVixzREFBc0Q7SUFDdEQsd0NBQXdDO0lBQ3hDLDZDQUE2QztDQUM5QztBQUNELGdCQUFnQjtBQUNoQixJQUFJLE1BQU0sRUFBRTtJQUNWLHNEQUFzRDtDQUN2RCJ9