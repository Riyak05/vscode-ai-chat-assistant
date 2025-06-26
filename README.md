# AI Chat Assistant for VS Code

A Visual Studio Code extension that integrates a React-based AI chat assistant panel. The assistant supports contextual code workspace awareness, file/image attachments via `@filename` mentions, and AI-powered code generation using OpenAI's GPT models.

---

## Features

- **Modern React Chat UI**: Clean, minimal, and responsive chat interface rendered in a VS Code WebView.
- **Markdown & Code Highlighting**: Supports markdown, syntax-highlighted code blocks, and chat history.
- **File & Image Attachments**: Attach files or images from your workspace using `@` mentions in the chat input.
- **AI Code Generation**: Generate, review, or manipulate code using OpenAI GPT models.
- **Context Awareness**: Reference files and code from your current workspace for more relevant AI responses.

---

## Installation

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Build the extension**
   ```sh
   npm run build
   ```

---

## Usage

1. **Open the project in VS Code.**
2. **Start the Extension Development Host**
   - Press `F5` or select `Run > Start Debugging`.
3. **Set your OpenAI API key**
   - Open Command Palette (`Ctrl+Shift+P`), type `Preferences: Open Settings (UI)`.
   - Search for `aiChatAssistant` and enter your OpenAI API key in the `OpenAIApiKey` field.
4. **Start the Chat Panel**
   - Open Command Palette (`Ctrl+Shift+P`), type `AI Chat Assistant: Start Chat`.
   - The chat panel will open. Type messages, use `@` to attach files, and interact with the AI.

---

## Configuration

- **OpenAI API Key**: Required for AI features. Set via VS Code settings: `aiChatAssistant.openAIApiKey`.
- **File Attachments**: Type `@` in the chat input to trigger the file picker and attach files or images from your workspace.

---

## Development

- **Source Code**: Located in `src/` (extension logic) and `src/webview/` (React app).
- **Build**: Bundles the React app and compiles TypeScript to JavaScript in the `out/` directory.
- **Watch Mode**: Use `npm run watch` for automatic rebuilds during development.
- **Linting & Formatting**: Use `npm run lint` and `npm run format` to maintain code quality.

---

## Troubleshooting

- **Command Not Found**: Ensure you have built the extension (`npm run build`) and are running the Extension Development Host (`F5`).
- **API Key Errors**: Make sure your OpenAI API key is set in VS Code settings and is valid.
- **Rate Limits**: If you see `Too Many Requests`, you have hit OpenAI's rate limit. Wait and try again, or upgrade your OpenAI plan.
- **Build Issues**: Delete the `out/` directory and rebuild with `npx tsc` or `npm run build`.
- **Extension Not Updating**: Always rebuild and relaunch the Extension Host after code changes.

---

## Security & Best Practices

- **Never commit your OpenAI API key** to version control or share it publicly.
- **Handle sensitive data carefully** when attaching files or images.
- **Follow VS Code extension guidelines** for publishing and updates.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Visual Studio Code Extension API](https://code.visualstudio.com/api)
- [OpenAI GPT API](https://platform.openai.com/docs/api-reference)
- [React](https://react.dev/)
