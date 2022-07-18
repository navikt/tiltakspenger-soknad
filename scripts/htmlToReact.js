const React = require("react");
const fs = require("fs");
const ReactDOMServer = require("react-dom/server");
const HtmlToReact = require("html-to-react");
const HtmlToReactParser = require("html-to-react").Parser;

const html = fs.readFileSync("oldSrc/js/opprett/opprettTemplate.html", {
  encoding: "utf-8",
});

const htmlInput = html;
const htmlExpected =
  "<div><h1>TITLE</h1><p>Paragraph</p><h1>ANOTHER TITLE</h1></div>";

const isValidNode = function () {
  return true;
};

const isTextAttribute = ([key, value]) =>
  key.startsWith("data-") && value.endsWith("| cmstekst");
const getTextAttributes = (attribs) =>
  Object.entries(attribs).filter(isTextAttribute);
const getTextAttrib = (attribs) => {
  const value = getTextAttributes(attribs)[0][1];
  return value.split("|")[0].replaceAll("'", "").trim();
};
const hasTextAttributes = (attribs) => getTextAttributes(attribs).length > 0;

// Order matters. Instructions are processed in the order they're defined
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const processingInstructions = [
  {
    replaceChildren: true,
    // Custom <h1> processing
    shouldProcessNode: (node) => {
      if (!node.attribs) return false;
      console.log(node.attribs);
      console.log(hasTextAttributes(node.attribs));
      return hasTextAttributes(node.attribs);
    },
    processNode: (node, children) => {
      const textName = getTextAttrib(node.attribs);
      return `{ ${textName} }`;
    },
  },
  {
    shouldProcessNode: function (node) {
      if (!node.attribs) return false;
      console.log(node.attribs);
      console.log(hasTextAttributes(node.attribs));
      return hasTextAttributes(node.attribs);
    },
    processNode: function (node, children) {
      const newAttribs = Object.entries(node.attribs)
        .filter(isTextAttribute)
        .reduce((acc, next) => ({ ...acc, [next[0]]: [next[1]] }), {});
      console.log(newAttribs);
      return {
        ...node,
        attribs: newAttribs,
      };
    },
  },
  {
    // Anything else
    shouldProcessNode: function (node) {
      console.log("NODE");
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode,
  },
];
const htmlToReactParser = new HtmlToReactParser();
const reactComponent = htmlToReactParser.parseWithInstructions(
  htmlInput,
  isValidNode,
  processingInstructions
);
const reactHtml = ReactDOMServer.renderToString(reactComponent);
console.log("===========");
console.log(reactHtml);
// assert.equal(reactHtml, htmlExpected);
