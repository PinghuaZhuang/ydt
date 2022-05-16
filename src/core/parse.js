import fs from "fs";
import path from "path";
import partial from "lodash/partial";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
// import t from "@babel/types";
import Callbacks from "../utils/Callbacks";
import Token from "../utils/Token";

const rnothtmlwhite = /[\x20\t\r\n\f]+/;

function createVisitors(visitors, handle, ...args) {
  const ret = {};
  visitors
    .trim()
    .split(rnothtmlwhite)
    .forEach((visitor) => {
      ret[visitor] = partial(handle, ...args);
    });
  return ret;
}

function findZhCNString(tokens, { node }) {
  const reg = /(?<content>[\u4e00-\u9fa5]+)/g;
  let t;
  while ((t = reg.exec(node.value))) {
    tokens.add(() => console.count());
  }
}

function findFunction(tokens, path) {
  path.traverse(
    createVisitors(`
      TemplateLiteral
      JSXText
      Literal`,
      findZhCNString,
      tokens
    )
  );
  path.skip();
}

function parse(filePath) {
  const tokens = Callbacks("memory once"); // callbacks
  tokens.fire();
  const content = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");

  const ast = parser.parse(content, {
    plugins: ["jsx"],
    allowImportExportEverywhere: true,
  });

  traverse(
    ast,
    createVisitors(
      `ArrowFunctionExpression FunctionExpression`,
      findFunction,
      tokens
    )
  );

  console.log(tokens, "tokens");
}

parse("src/mock/index.jsx");
