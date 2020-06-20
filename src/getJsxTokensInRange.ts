import { TextDocument, Range } from "vscode"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"

export const getJsxTokensInRange = (document: TextDocument, range: Range) => {
  const babelTree = parse(document.getText(), {
    sourceType: "module",
    plugins: ["jsx", "typescript", "flow", "decorators"]
  })

  traverse(babelTree, {
    JSXElement: (path, node) => {
      console.log(node.loc?.start)
      console.log(node.loc?.start)
    }
  })
}
