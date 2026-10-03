"use client";

import { useState, type ReactNode } from "react";
import { Button, cn } from "@/shared/ui";

const KEYWORDS = new Set([
  "fun", "val", "var", "class", "data", "sealed", "object", "companion", "interface",
  "when", "if", "else", "return", "suspend", "override", "private", "public", "internal",
  "import", "package", "null", "true", "false", "this", "super", "in", "is", "as", "by",
  "get", "set", "init", "constructor", "const", "for", "while", "try", "catch", "throw",
  "object", "inline", "value", "expect", "actual", "typealias", "it",
]);

const TOKEN = /(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

function highlight(source: string) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  for (const match of source.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(source.slice(last, start));
    const token = match[0];
    let className = "text-background";
    if (token.startsWith("//")) className = "text-background/55 italic";
    else if (token.startsWith('"') || token.startsWith("'")) className = "text-[#e7c9a4]";
    else if (KEYWORDS.has(token)) className = "text-[#f0b429]";
    nodes.push(
      <span key={index} className={className}>
        {token}
      </span>,
    );
    index += 1;
    last = start + token.length;
  }
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

export function CodeBlock({ source, caption }: { source: string; caption?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="my-6 overflow-hidden rounded-xl bg-foreground text-background">
      <div className="flex items-center justify-between gap-3 border-b border-background/15 px-4 py-2">
        <figcaption className="font-mono text-[11px] tracking-wide text-background/70 uppercase">
          {caption ?? "Kotlin"}
        </figcaption>
        <Button
          type="button"
          size="xs"
          variant="secondary"
          className="font-mono"
          onClick={copy}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className={cn("overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6")}>
        <code>{highlight(source)}</code>
      </pre>
    </figure>
  );
}
