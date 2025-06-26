import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("aiChatAssistant.startChat", () => {
      const panel = vscode.window.createWebviewPanel(
        "aiChatAssistant",
        "AI Chat Assistant",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "dist")),
            vscode.Uri.file(path.join(context.extensionPath, "public")),
          ],
        }
      );

      const scriptPathOnDisk = vscode.Uri.file(
        path.join(context.extensionPath, "dist", "webview.js")
      );
      const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

      panel.webview.html = getWebviewContent(scriptUri);

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.type) {
          case "attach-file": {
            // Show file picker and return file metadata/content
            const uris = await vscode.window.showOpenDialog({
              canSelectMany: false,
              openLabel: "Attach",
              filters: {
                "All Files": ["*"],
              },
            });
            if (uris && uris[0]) {
              const fileUri = uris[0];
              const filePath = fileUri.fsPath;
              const ext = path.extname(filePath).toLowerCase();
              const name = path.basename(filePath);
              let type = "";
              let content = "";
              if (
                [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg"].includes(ext)
              ) {
                type = `image/${ext.replace(".", "")}`;
                const fileBuffer = fs.readFileSync(filePath);
                content = `data:${type};base64,${fileBuffer.toString("base64")}`;
              } else {
                type = "text/plain";
                content = fs.readFileSync(filePath, "utf8");
              }
              panel.webview.postMessage({
                type: "file-attachment-response",
                attachment: { name, type, content },
              });
            }
            break;
          }
          case "ai-request": {
            // Get OpenAI API key from settings
            const config = vscode.workspace.getConfiguration();
            const apiKey = config.get<string>("aiChatAssistant.openAIApiKey");
            if (!apiKey) {
              panel.webview.postMessage({
                type: "ai-response",
                content:
                  "❌ OpenAI API key not set. Please set it in VS Code settings (aiChatAssistant.openAIApiKey).",
              });
              break;
            }
            try {
              const { content, attachments, history } = message;
              // Prepare messages for OpenAI (system, history, user)
              const chatMessages = [
                ...(history || []).map((msg: any) => ({
                  role: msg.sender === "user" ? "user" : "assistant",
                  content: msg.content,
                })),
                { role: "user", content },
              ];
              // Optionally, include attachment info in the prompt
              if (attachments && attachments.length > 0) {
                chatMessages.push({
                  role: "user",
                  content: `Attached files: ${attachments.map((a: any) => a.name).join(", ")}`,
                });
              }
              // Call OpenAI API
              const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: chatMessages,
                    max_tokens: 1024,
                    temperature: 0.7,
                  }),
                }
              );
              if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
              }
              const data = await response.json();
              const aiContent =
                data.choices?.[0]?.message?.content || "No response from AI.";
              panel.webview.postMessage({
                type: "ai-response",
                content: aiContent,
              });
            } catch (err: any) {
              panel.webview.postMessage({
                type: "ai-response",
                content: `❌ Error: ${err.message}`,
              });
            }
            break;
          }
        }
      });
    })
  );
}

function getWebviewContent(scriptUri: vscode.Uri): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AI Chat Assistant</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="${scriptUri}"></script>
      </body>
    </html>
  `;
}

export function deactivate() {}
