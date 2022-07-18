const exp = require("constants");
const getAttributes = (node) =>
  node.value.openingElement.attributes
    .map((attribute) => ({
      name: attribute.name.name,
      value: attribute.value?.value,
    }))
    .filter(
      ({ name, value }) =>
        name.startsWith("data-") && value && value.includes("cmstekst")
    );

module.exports = function (fileInfo, { jscodeshift: j }, options) {
  // transform `fileInfo.source` here
  // ...
  // return changed source
  /*
  *  jsxIdentifierStatement: [Function],
      jsxExpressionContainerStatement: [Function],
      jsxElementStatement: [Function],
      jsxFragmentStatement: [Function],
      jsxMemberStatement: [Function],
      jsxTextStatement: [Function],
  * */
  const source = j(fileInfo.source);
  /*
  source
    .find(j.JSXElement)
    .filter((node) => {
      const attributes = getAttributes(node);
      return attributes.length !== 0;
    })
    .forEach((node) => {
      const attributes = getAttributes(node);
      const translationTextName = attributes[0].value
        .split(" | ")[0]
        .replaceAll('"', "")
        .replaceAll("'", "");

      const newNode = j.jsxElement(
        j.jsxOpeningElement(node.node.openingElement.name, [
          ...node.node.openingElement.attributes.filter(
            (attribute) =>
              !attributes.map((it) => it.name).includes(attribute.name.name)
          ),
        ]),
        j.jsxClosingElement(node.node.openingElement.name),
        [
          j.jsxExpressionContainer(
            j.jsxTextStatement(`t("${translationTextName}")`).expression
          ),
        ]
      );
      j(node).replaceWith(newNode);
    });*/

  const arrowFunctions = source
    .find(j.ArrowFunctionExpression)
    .filter((expression) => {
      const parent = expression.parentPath.value;
      const varName = parent.id.name;
      const body = parent.init.body?.type;
      return varName === "HelpForDev" && body === "JSXElement";
    })
    .replaceWith((expression) => {
      console.log(expression);
      const child = expression.value.body;
      const useI18nblock = j.variableDeclaration("const", [
        j.variableDeclarator(
          j.identifier("t"),
          j.callExpression(j.identifier("useI18n"), [])
        ),
      ]);
      const block = j.blockStatement([useI18nblock, j.returnStatement(child)]);
      return j.arrowFunctionExpression([], block, false);
    });
  console.log(arrowFunctions.length);

  return source.toSource();
};
