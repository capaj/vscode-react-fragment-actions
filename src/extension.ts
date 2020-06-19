import vscode from "vscode"
import { subscribeToDocumentChanges } from "./diagnostics"

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ["typescriptreact", "javascriptreact"],
      new Fragmentizer(),
      {
        providedCodeActionKinds: Fragmentizer.providedCodeActionKinds,
      }
    )
  )

  const jsxElementsDiagnostics = vscode.languages.createDiagnosticCollection(
    "react-fragment"
  )
  context.subscriptions.push(jsxElementsDiagnostics)

  subscribeToDocumentChanges(context, jsxElementsDiagnostics)
}

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class Fragmentizer implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ]

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    if (!this.isInsideReturnedJSXStatement(document, range)) {
      return
    }

    const codeAction = this.createFix(document, range)
    // Marking a single fix as `preferred` means that users can apply it with a
    // single keyboard shortcut using the `Auto Fix` command.
    codeAction.isPreferred = true

    return [codeAction]
  }

  private isInsideReturnedJSXStatement(
    document: vscode.TextDocument,
    range: vscode.Range
  ) {
    const start = range.start
    const line = document.lineAt(start.line)
    return line.text.includes("return")
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      `Wrap in fragment`,
      vscode.CodeActionKind.QuickFix
    )
    fix.edit = new vscode.WorkspaceEdit()
    fix.edit.replace(
      // TODO implement actual replacement
      document.uri,
      new vscode.Range(range.start, range.start.translate(0, 2)),
      "<></>"
    )
    return fix
  }
}
