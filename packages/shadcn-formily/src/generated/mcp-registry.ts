import { meta as ArrayCardsMeta0 } from '../components/array-cards/mcp';
import { meta as ArrayCollapseMeta1 } from '../components/array-collapse/mcp';
import { meta as ArrayDialogMeta2 } from '../components/array-dialog/mcp';
import { meta as ArrayInlineMeta3 } from '../components/array-inline/mcp';
import { meta as ArrayPopoverMeta4 } from '../components/array-popover/mcp';
import { meta as ArrayTagsMeta5 } from '../components/array-tags/mcp';
import { meta as ArrayToggleGroupMeta6 } from '../components/array-toggle-group/mcp';
import { meta as FormMeta7 } from '../components/form/mcp';

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
/** Generated component metadata map keyed by public component name. */
export const mcpRegistry = {
  "ArrayCards": withHtmlElementNote(ArrayCardsMeta0),
  "ArrayCollapse": withHtmlElementNote(ArrayCollapseMeta1),
  "ArrayDialog": withHtmlElementNote(ArrayDialogMeta2),
  "ArrayInline": withHtmlElementNote(ArrayInlineMeta3),
  "ArrayPopover": withHtmlElementNote(ArrayPopoverMeta4),
  "ArrayTags": withHtmlElementNote(ArrayTagsMeta5),
  "ArrayToggleGroup": withHtmlElementNote(ArrayToggleGroupMeta6),
  "Form": withHtmlElementNote(FormMeta7),
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
