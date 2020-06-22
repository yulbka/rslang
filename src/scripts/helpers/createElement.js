export function createElement(tag, node, classes, text, attributeName, attributeValue) {
  const element = document.createElement(tag);
  if (classes && classes.length) {
    element.classList.add(...classes);
  }
  if (text && text.length) {
    element.textContent = text;
  }
  if (attributeName && attributeValue) {
    element.setAttribute(attributeName, attributeValue);
  }
  node.append(element);
  return element;
}
