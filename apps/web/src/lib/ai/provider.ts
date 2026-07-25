export type AiMessage = { role: "system" | "user" | "assistant"; content: string };
export type AiCompletion = { content: string };
/** Provider implementations intentionally live outside the UI and can be added without changing consumers. */
export interface AiProvider { readonly name: "openai" | "gemini" | "claude"; complete(messages: AiMessage[]): Promise<AiCompletion>; }
export type AiProviderFactory = () => AiProvider;
