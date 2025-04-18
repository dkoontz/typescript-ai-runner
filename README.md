This is a learning project, nothing more.

Looking at the kinds of tooling around LLM (langchain, etc.) they are all:

- Opaque
- Framework'ish
- Did I mention OPAQUE

I wanted to understand what is actually going on at the base level of interaction with a LLM system (OpenAI, Anthropic, Grok, Ollama, vLLM, etc). In most AI toolkits it is very difficult to figure out what is actually happening below your API calls. Just determining what is or is not being added to the system prompt is suprisingly difficult.

So I created this as a learning project during a hackathon. It doesn't depend on any existing AI tooling, just a HTTP interface to whatever service you want to use.

It exposes some limited tools to an agent based runner for planning and execution. Today the tool integration would probably be better served by utilizing a
MCP library but that didn't exist at the time.

### Setup

Install Deno, then `npm intsall`.

### Running the app

```
deno run --allow-net --allow-env --allow-read --allow-run --allow-sys main.ts
```
