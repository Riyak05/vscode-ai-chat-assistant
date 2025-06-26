// TypeScript declaration for VS Code webview API
declare interface VSCodeApi {
  postMessage: (message: any) => void;
  // You can add more methods if needed
}

declare interface Window {
  acquireVsCodeApi?: () => VSCodeApi;
}
