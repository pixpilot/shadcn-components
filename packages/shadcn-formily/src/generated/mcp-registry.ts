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
import { meta as FileUploadMeta14 } from '../components/file-upload/mcp';
import { meta as FormMeta15 } from '../components/form/mcp';
import { meta as FormGridMeta16 } from '../components/form-grid/mcp';
import { meta as FormItemMeta17 } from '../components/form-item/mcp';
import { meta as FormItemContainerMeta18 } from '../components/form-item-container/mcp';
import { meta as HiddenMeta19 } from '../components/hidden/mcp';
import { meta as IconPickerMeta20 } from '../components/icon-picker/mcp';
import { meta as IconToggleMeta21 } from '../components/icon-toggle/mcp';
import { meta as InputMeta22 } from '../components/input/mcp';
import { meta as JsonSchemaFieldMeta23 } from '../components/schema-field/mcp';
import { meta as JsonSchemaFormRendererMeta24 } from '../components/json-schema-form-renderer/mcp';
import { meta as NumberInputMeta25 } from '../components/number/mcp';
import { meta as ObjectContainerMeta26 } from '../components/object-container/mcp';
import { meta as RadioMeta27 } from '../components/radio/mcp';
import { meta as RatingMeta28 } from '../components/rating/mcp';
import { meta as RichTextEditorMeta29 } from '../components/rich-text-editor/mcp';
import { meta as RowMeta30 } from '../components/row/mcp';
import { meta as SelectMeta31 } from '../components/select/mcp';
import { meta as SeparatorMeta32 } from '../components/separator/mcp';
import { meta as SliderMeta33 } from '../components/slider/mcp';
import { meta as SortableContainerMeta34 } from '../components/array-sortable/mcp';
import { meta as SwitchMeta35 } from '../components/switch/mcp';
import { meta as TagsInputInLineMeta36 } from '../components/tags-input-inline/mcp';
import { meta as TextareaMeta37 } from '../components/textarea/mcp';
import { meta as ToggleButtonMeta38 } from '../components/toggle-button/mcp';
import { meta as ToggleGroupMeta39 } from '../components/toggle-group/mcp';

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
  "FileUpload": withHtmlElementNote(FileUploadMeta14),
  "Form": withHtmlElementNote(FormMeta15),
  "FormGrid": withHtmlElementNote(FormGridMeta16),
  "FormItem": withHtmlElementNote(FormItemMeta17),
  "FormItemContainer": withHtmlElementNote(FormItemContainerMeta18),
  "Hidden": withHtmlElementNote(HiddenMeta19),
  "IconPicker": withHtmlElementNote(IconPickerMeta20),
  "IconToggle": withHtmlElementNote(IconToggleMeta21),
  "Input": withHtmlElementNote(InputMeta22),
  "JsonSchemaField": withHtmlElementNote(JsonSchemaFieldMeta23),
  "JsonSchemaFormRenderer": withHtmlElementNote(JsonSchemaFormRendererMeta24),
  "NumberInput": withHtmlElementNote(NumberInputMeta25),
  "ObjectContainer": withHtmlElementNote(ObjectContainerMeta26),
  "Radio": withHtmlElementNote(RadioMeta27),
  "Rating": withHtmlElementNote(RatingMeta28),
  "RichTextEditor": withHtmlElementNote(RichTextEditorMeta29),
  "Row": withHtmlElementNote(RowMeta30),
  "Select": withHtmlElementNote(SelectMeta31),
  "Separator": withHtmlElementNote(SeparatorMeta32),
  "Slider": withHtmlElementNote(SliderMeta33),
  "SortableContainer": withHtmlElementNote(SortableContainerMeta34),
  "Switch": withHtmlElementNote(SwitchMeta35),
  "TagsInputInLine": withHtmlElementNote(TagsInputInLineMeta36),
  "Textarea": withHtmlElementNote(TextareaMeta37),
  "ToggleButton": withHtmlElementNote(ToggleButtonMeta38),
  "ToggleGroup": withHtmlElementNote(ToggleGroupMeta39),
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
