const fs = require("fs");
const pathTool = require("path");
const fetchImport = import("node-fetch").then((it) => it.default);

const fetch = async (url, config) => {
  const f = await fetchImport;
  return f(url, config);
};

const transform = async (text) => {
  return fetch("https://helpfordev.com/api/htmlToJsx", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      componentType: "functionalComponent",
      text,
    }),
  });
};

const getFiles = (dirPath, depth = 0) => {
  // console.log(depth);
  // if (depth > 10) return [];
  return fs.readdirSync(dirPath).reduce((allMatches, fileName) => {
    if (fileName.endsWith(".js")) return allMatches;
    else if (fileName.endsWith(".html"))
      return [...allMatches, { fileName, path: dirPath + "/" + fileName }];
    else {
      return [...allMatches, ...getFiles(dirPath + "/" + fileName, depth + 1)];
    }
  }, []);
};

const fromDir = "oldSrc/js";

const result = getFiles(fromDir);
// console.log(result);

const run = async () => {
  for (const file of result) {
    const { path, fileName } = file;
    const newPath = path
      .replace(fromDir, "src/features")
      .replace(".html", ".tsx");
    const dir = pathTool.parse(newPath).dir;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const html = fs.readFileSync(path, {
      encoding: "utf-8",
    });
    const newHTML = await transform(html)
      .then((res) => res.json())
      .then((res) => res.result);
    fs.writeFileSync(newPath, newHTML);
  }
};

run();
