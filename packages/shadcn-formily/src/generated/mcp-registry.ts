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
import { meta as ArrayDrawerMeta4 } from '../components/array-drawer/mcp';
import { meta as ArrayInlineMeta5 } from '../components/array-inline/mcp';
import { meta as ArrayPopoverMeta6 } from '../components/array-popover/mcp';
import { meta as ArrayTagsMeta7 } from '../components/array-tags/mcp';
import { meta as ArrayToggleGroupMeta8 } from '../components/array-toggle-group/mcp';
import { meta as CheckboxMeta9 } from '../components/checkbox/mcp';
import { meta as ColorPickerMeta10 } from '../components/color-picker/mcp';
import { meta as ColorSelectMeta11 } from '../components/color-select/mcp';
import { meta as ColumnMeta12 } from '../components/column/mcp';
import { meta as ComboboxMeta13 } from '../components/combobox/mcp';
import { meta as DatePickerMeta14 } from '../components/date-picker/mcp';
import { meta as DialogItemMeta15 } from '../components/dialog-item/mcp';
import { meta as DrawerItemMeta16 } from '../components/drawer-item/mcp';
import { meta as FileUploadMeta17 } from '../components/file-upload/mcp';
import { meta as FormMeta18 } from '../components/form/mcp';
import { meta as FormGridMeta19 } from '../components/form-grid/mcp';
import { meta as FormItemMeta20 } from '../components/form-item/mcp';
import { meta as FormItemContainerMeta21 } from '../components/form-item-container/mcp';
import { meta as HiddenMeta22 } from '../components/hidden/mcp';
import { meta as IconPickerMeta23 } from '../components/icon-picker/mcp';
import { meta as IconToggleMeta24 } from '../components/icon-toggle/mcp';
import { meta as InputMeta25 } from '../components/input/mcp';
import { meta as JsonSchemaFieldMeta26 } from '../components/schema-field/mcp';
import { meta as JsonSchemaFormRendererMeta27 } from '../components/json-schema-form-renderer/mcp';
import { meta as NumberInputMeta28 } from '../components/number/mcp';
import { meta as ObjectContainerMeta29 } from '../components/object-container/mcp';
import { meta as PopoverItemMeta30 } from '../components/popover-item/mcp';
import { meta as RadioMeta31 } from '../components/radio/mcp';
import { meta as RatingMeta32 } from '../components/rating/mcp';
import { meta as RichTextEditorMeta33 } from '../components/rich-text-editor/mcp';
import { meta as RowMeta34 } from '../components/row/mcp';
import { meta as SelectMeta35 } from '../components/select/mcp';
import { meta as SeparatorMeta36 } from '../components/separator/mcp';
import { meta as SliderMeta37 } from '../components/slider/mcp';
import { meta as SortableContainerMeta38 } from '../components/array-sortable/mcp';
import { meta as SwitchMeta39 } from '../components/switch/mcp';
import { meta as TagsInputInLineMeta40 } from '../components/tags-input-inline/mcp';
import { meta as TextareaMeta41 } from '../components/textarea/mcp';
import { meta as ToggleButtonMeta42 } from '../components/toggle-button/mcp';
import { meta as ToggleGroupMeta43 } from '../components/toggle-group/mcp';

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
  "ArrayDrawer": withHtmlElementNote(ArrayDrawerMeta4),
  "ArrayInline": withHtmlElementNote(ArrayInlineMeta5),
  "ArrayPopover": withHtmlElementNote(ArrayPopoverMeta6),
  "ArrayTags": withHtmlElementNote(ArrayTagsMeta7),
  "ArrayToggleGroup": withHtmlElementNote(ArrayToggleGroupMeta8),
  "Checkbox": withHtmlElementNote(CheckboxMeta9),
  "ColorPicker": withHtmlElementNote(ColorPickerMeta10),
  "ColorSelect": withHtmlElementNote(ColorSelectMeta11),
  "Column": withHtmlElementNote(ColumnMeta12),
  "Combobox": withHtmlElementNote(ComboboxMeta13),
  "DatePicker": withHtmlElementNote(DatePickerMeta14),
  "DialogItem": withHtmlElementNote(DialogItemMeta15),
  "DrawerItem": withHtmlElementNote(DrawerItemMeta16),
  "FileUpload": withHtmlElementNote(FileUploadMeta17),
  "Form": withHtmlElementNote(FormMeta18),
  "FormGrid": withHtmlElementNote(FormGridMeta19),
  "FormItem": withHtmlElementNote(FormItemMeta20),
  "FormItemContainer": withHtmlElementNote(FormItemContainerMeta21),
  "Hidden": withHtmlElementNote(HiddenMeta22),
  "IconPicker": withHtmlElementNote(IconPickerMeta23),
  "IconToggle": withHtmlElementNote(IconToggleMeta24),
  "Input": withHtmlElementNote(InputMeta25),
  "JsonSchemaField": withHtmlElementNote(JsonSchemaFieldMeta26),
  "JsonSchemaFormRenderer": withHtmlElementNote(JsonSchemaFormRendererMeta27),
  "NumberInput": withHtmlElementNote(NumberInputMeta28),
  "ObjectContainer": withHtmlElementNote(ObjectContainerMeta29),
  "PopoverItem": withHtmlElementNote(PopoverItemMeta30),
  "Radio": withHtmlElementNote(RadioMeta31),
  "Rating": withHtmlElementNote(RatingMeta32),
  "RichTextEditor": withHtmlElementNote(RichTextEditorMeta33),
  "Row": withHtmlElementNote(RowMeta34),
  "Select": withHtmlElementNote(SelectMeta35),
  "Separator": withHtmlElementNote(SeparatorMeta36),
  "Slider": withHtmlElementNote(SliderMeta37),
  "SortableContainer": withHtmlElementNote(SortableContainerMeta38),
  "Switch": withHtmlElementNote(SwitchMeta39),
  "TagsInputInLine": withHtmlElementNote(TagsInputInLineMeta40),
  "Textarea": withHtmlElementNote(TextareaMeta41),
  "ToggleButton": withHtmlElementNote(ToggleButtonMeta42),
  "ToggleGroup": withHtmlElementNote(ToggleGroupMeta43),
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
