import { meta as ButtonMeta0 } from '../button/mcp';
import { meta as CardMeta1 } from '../card/mcp';
import { meta as FileUploadMeta2 } from '../file-upload/mcp';

function withHtmlElementNote<
  TComponent extends { htmlElement?: string; notes?: readonly string[] },
>(comp: TComponent): TComponent & { notes: readonly string[] } {
  const htmlNote =
    comp.htmlElement != null && comp.htmlElement.length > 0
      ? `Also supports all standard props of a native <${comp.htmlElement}> element (onClick, disabled, className, style, type, aria-*, data-*, etc.).`
      : '';

  return {
    ...comp,
    notes:
      htmlNote.length > 0 ? [...(comp.notes ?? []), htmlNote] : [...(comp.notes ?? [])],
  };
}

// prettier-ignore
export const mcpRegistry = {
  "Button": withHtmlElementNote(ButtonMeta0),
  "Card": withHtmlElementNote(CardMeta1),
  "FileUpload": withHtmlElementNote(FileUploadMeta2),
} as const;

export type McpRegistry = typeof mcpRegistry;
