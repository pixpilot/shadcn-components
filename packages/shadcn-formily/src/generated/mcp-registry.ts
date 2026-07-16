/* eslint-disable perfectionist/sort-imports */
/**
 * AUTO-GENERATED FILE — DO NOT EDIT.
 *
 * This registry is produced by @internal/mcp from the `mcp.ts` files that live
 * next to each component. To change it, edit those `mcp.ts` files (or add a new
 * one when you add a component) and re-run the generator:
 *
 *   pnpm run mcp:generate
 */
import { meta as ArrayBaseMeta0 } from '../components/array-base/mcp';
import { meta as ArrayCardsMeta1 } from '../components/array-cards/mcp';
import { meta as ArrayCollapseMeta2 } from '../components/array-collapse/mcp';
import { meta as ArrayDialogMeta3 } from '../components/array-dialog/mcp';
import { meta as ArrayInlineMeta4 } from '../components/array-inline/mcp';
import { meta as ArrayPopoverMeta5 } from '../components/array-popover/mcp';
import { meta as ArrayTagsMeta6 } from '../components/array-tags/mcp';
import { meta as ArrayToggleGroupMeta7 } from '../components/array-toggle-group/mcp';
import { meta as CheckboxMeta8 } from '../components/checkbox/mcp';
import { meta as ColorPickerMeta9 } from '../components/color-picker/mcp';
import { meta as ColorSelectMeta10 } from '../components/color-select/mcp';
import { meta as ColumnMeta11 } from '../components/column/mcp';
import { meta as ComboboxMeta12 } from '../components/combobox/mcp';
import { meta as DatePickerMeta13 } from '../components/date-picker/mcp';
import { meta as DialogItemMeta14 } from '../components/dialog-item/mcp';
import { meta as FileUploadMeta15 } from '../components/file-upload/mcp';
import { meta as FormMeta16 } from '../components/form/mcp';
import { meta as FormGridMeta17 } from '../components/form-grid/mcp';
import { meta as FormItemMeta18 } from '../components/form-item/mcp';
import { meta as FormItemContainerMeta19 } from '../components/form-item-container/mcp';
import { meta as HiddenMeta20 } from '../components/hidden/mcp';
import { meta as IconPickerMeta21 } from '../components/icon-picker/mcp';
import { meta as IconToggleMeta22 } from '../components/icon-toggle/mcp';
import { meta as InputMeta23 } from '../components/input/mcp';
import { meta as JsonSchemaFieldMeta24 } from '../components/schema-field/mcp';
import { meta as JsonSchemaFormRendererMeta25 } from '../components/json-schema-form-renderer/mcp';
import { meta as NumberInputMeta26 } from '../components/number/mcp';
import { meta as ObjectContainerMeta27 } from '../components/object-container/mcp';
import { meta as PopoverItemMeta28 } from '../components/popover-item/mcp';
import { meta as RadioMeta29 } from '../components/radio/mcp';
import { meta as RatingMeta30 } from '../components/rating/mcp';
import { meta as RichTextEditorMeta31 } from '../components/rich-text-editor/mcp';
import { meta as RowMeta32 } from '../components/row/mcp';
import { meta as SelectMeta33 } from '../components/select/mcp';
import { meta as SeparatorMeta34 } from '../components/separator/mcp';
import { meta as SliderMeta35 } from '../components/slider/mcp';
import { meta as SortableContainerMeta36 } from '../components/array-sortable/mcp';
import { meta as SwitchMeta37 } from '../components/switch/mcp';
import { meta as TagsInputInLineMeta38 } from '../components/tags-input-inline/mcp';
import { meta as TextareaMeta39 } from '../components/textarea/mcp';
import { meta as ToggleButtonMeta40 } from '../components/toggle-button/mcp';
import { meta as ToggleGroupMeta41 } from '../components/toggle-group/mcp';

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
  "ArrayBase": withHtmlElementNote(ArrayBaseMeta0),
  "ArrayCards": withHtmlElementNote(ArrayCardsMeta1),
  "ArrayCollapse": withHtmlElementNote(ArrayCollapseMeta2),
  "ArrayDialog": withHtmlElementNote(ArrayDialogMeta3),
  "ArrayInline": withHtmlElementNote(ArrayInlineMeta4),
  "ArrayPopover": withHtmlElementNote(ArrayPopoverMeta5),
  "ArrayTags": withHtmlElementNote(ArrayTagsMeta6),
  "ArrayToggleGroup": withHtmlElementNote(ArrayToggleGroupMeta7),
  "Checkbox": withHtmlElementNote(CheckboxMeta8),
  "ColorPicker": withHtmlElementNote(ColorPickerMeta9),
  "ColorSelect": withHtmlElementNote(ColorSelectMeta10),
  "Column": withHtmlElementNote(ColumnMeta11),
  "Combobox": withHtmlElementNote(ComboboxMeta12),
  "DatePicker": withHtmlElementNote(DatePickerMeta13),
  "DialogItem": withHtmlElementNote(DialogItemMeta14),
  "FileUpload": withHtmlElementNote(FileUploadMeta15),
  "Form": withHtmlElementNote(FormMeta16),
  "FormGrid": withHtmlElementNote(FormGridMeta17),
  "FormItem": withHtmlElementNote(FormItemMeta18),
  "FormItemContainer": withHtmlElementNote(FormItemContainerMeta19),
  "Hidden": withHtmlElementNote(HiddenMeta20),
  "IconPicker": withHtmlElementNote(IconPickerMeta21),
  "IconToggle": withHtmlElementNote(IconToggleMeta22),
  "Input": withHtmlElementNote(InputMeta23),
  "JsonSchemaField": withHtmlElementNote(JsonSchemaFieldMeta24),
  "JsonSchemaFormRenderer": withHtmlElementNote(JsonSchemaFormRendererMeta25),
  "NumberInput": withHtmlElementNote(NumberInputMeta26),
  "ObjectContainer": withHtmlElementNote(ObjectContainerMeta27),
  "PopoverItem": withHtmlElementNote(PopoverItemMeta28),
  "Radio": withHtmlElementNote(RadioMeta29),
  "Rating": withHtmlElementNote(RatingMeta30),
  "RichTextEditor": withHtmlElementNote(RichTextEditorMeta31),
  "Row": withHtmlElementNote(RowMeta32),
  "Select": withHtmlElementNote(SelectMeta33),
  "Separator": withHtmlElementNote(SeparatorMeta34),
  "Slider": withHtmlElementNote(SliderMeta35),
  "SortableContainer": withHtmlElementNote(SortableContainerMeta36),
  "Switch": withHtmlElementNote(SwitchMeta37),
  "TagsInputInLine": withHtmlElementNote(TagsInputInLineMeta38),
  "Textarea": withHtmlElementNote(TextareaMeta39),
  "ToggleButton": withHtmlElementNote(ToggleButtonMeta40),
  "ToggleGroup": withHtmlElementNote(ToggleGroupMeta41),
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
