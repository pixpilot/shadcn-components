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
import { meta as AbsoluteFillMeta0 } from '../absolute-fill/mcp';
import { meta as AlertMeta1 } from '../alert/mcp';
import { meta as AvatarUploadMeta2 } from '../avatar-upload/mcp';
import { meta as ButtonMeta3 } from '../button/mcp';
import { meta as ButtonExtendedMeta4 } from '../button-extended/mcp';
import { meta as ButtonGroupMeta5 } from '../button-group/mcp';
import { meta as CardMeta6 } from '../card/mcp';
import { meta as CircleLoaderMeta7 } from '../circle-loader/mcp';
import { meta as CloseButtonAbsoluteMeta8 } from '../close-button-absolute/mcp';
import { meta as CloseButtonRoundedMeta9 } from '../close-button-rounded/mcp';
import { meta as ColorPickerMeta10 } from '../ColorPicker/mcp';
import { meta as ColorPickerBaseMeta11 } from '../ColorPickerBase/mcp';
import { meta as ColorSelectMeta12 } from '../color-select/mcp';
import { meta as ComboboxMeta13 } from '../combobox/mcp';
import { meta as ConfirmationDialogMeta14 } from '../confirmation-dialog/mcp';
import { meta as ContentCardMeta15 } from '../content-card/mcp';
import { meta as DatePickerMeta16 } from '../date-picker/mcp';
import { meta as DialogMeta17 } from '../dialog/mcp';
import { meta as DrawerMeta18 } from '../drawer/mcp';
import { meta as FileUploadMeta19 } from '../file-upload/mcp';
import { meta as FileUploadInlineMeta20 } from '../file-upload-inline/mcp';
import { meta as FileUploadRootMeta21 } from '../file-upload-root/mcp';
import { meta as IconPickerMeta22 } from '../icon-selector/mcp';
import { meta as IconToggleMeta23 } from '../icon-toggle/mcp';
import { meta as InputMeta24 } from '../input/mcp';
import { meta as LayoutMeta25 } from '../layout/mcp';
import { meta as LoadingOverlayMeta26 } from '../loading-overlay/mcp';
import { meta as OverlayProviderMeta27 } from '../overlay-provider/mcp';
import { meta as PaginationMeta28 } from '../pagination/mcp';
import { meta as PopoverMeta29 } from '../popover/mcp';
import { meta as RatingMeta30 } from '../rating/mcp';
import { meta as registerDialogMeta31 } from '../dialog-registry/mcp';
import { meta as registerDrawerMeta32 } from '../drawer-registry/mcp';
import { meta as RichTextEditorMeta33 } from '../rich-text-editor/mcp';
import { meta as ScaledPreviewMeta34 } from '../scaled-preview/mcp';
import { meta as SelectMeta35 } from '../select/mcp';
import { meta as SliderMeta36 } from '../slider/mcp';
import { meta as TabsMeta37 } from '../tabs/mcp';
import { meta as TagsInputMeta38 } from '../tags-input/mcp';
import { meta as ThemeModeToggleButtonMeta39 } from '../theme-toggle/mcp';
import { meta as ThemeProviderMeta40 } from '../theme-provider/mcp';
import { meta as ToastMeta41 } from '../toast/mcp';
import { meta as ToggleButtonMeta42 } from '../toggle-button/mcp';
import { meta as ToggleGroupMeta43 } from '../toggle-group/mcp';
import { meta as TooltipMeta44 } from '../tooltip/mcp';

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
  "AbsoluteFill": withHtmlElementNote(AbsoluteFillMeta0),
  "Alert": withHtmlElementNote(AlertMeta1),
  "AvatarUpload": withHtmlElementNote(AvatarUploadMeta2),
  "Button": withHtmlElementNote(ButtonMeta3),
  "ButtonExtended": withHtmlElementNote(ButtonExtendedMeta4),
  "ButtonGroup": withHtmlElementNote(ButtonGroupMeta5),
  "Card": withHtmlElementNote(CardMeta6),
  "CircleLoader": withHtmlElementNote(CircleLoaderMeta7),
  "CloseButtonAbsolute": withHtmlElementNote(CloseButtonAbsoluteMeta8),
  "CloseButtonRounded": withHtmlElementNote(CloseButtonRoundedMeta9),
  "ColorPicker": withHtmlElementNote(ColorPickerMeta10),
  "ColorPickerBase": withHtmlElementNote(ColorPickerBaseMeta11),
  "ColorSelect": withHtmlElementNote(ColorSelectMeta12),
  "Combobox": withHtmlElementNote(ComboboxMeta13),
  "ConfirmationDialog": withHtmlElementNote(ConfirmationDialogMeta14),
  "ContentCard": withHtmlElementNote(ContentCardMeta15),
  "DatePicker": withHtmlElementNote(DatePickerMeta16),
  "Dialog": withHtmlElementNote(DialogMeta17),
  "Drawer": withHtmlElementNote(DrawerMeta18),
  "FileUpload": withHtmlElementNote(FileUploadMeta19),
  "FileUploadInline": withHtmlElementNote(FileUploadInlineMeta20),
  "FileUploadRoot": withHtmlElementNote(FileUploadRootMeta21),
  "IconPicker": withHtmlElementNote(IconPickerMeta22),
  "IconToggle": withHtmlElementNote(IconToggleMeta23),
  "Input": withHtmlElementNote(InputMeta24),
  "Layout": withHtmlElementNote(LayoutMeta25),
  "LoadingOverlay": withHtmlElementNote(LoadingOverlayMeta26),
  "OverlayProvider": withHtmlElementNote(OverlayProviderMeta27),
  "Pagination": withHtmlElementNote(PaginationMeta28),
  "Popover": withHtmlElementNote(PopoverMeta29),
  "Rating": withHtmlElementNote(RatingMeta30),
  "registerDialog": withHtmlElementNote(registerDialogMeta31),
  "registerDrawer": withHtmlElementNote(registerDrawerMeta32),
  "RichTextEditor": withHtmlElementNote(RichTextEditorMeta33),
  "ScaledPreview": withHtmlElementNote(ScaledPreviewMeta34),
  "Select": withHtmlElementNote(SelectMeta35),
  "Slider": withHtmlElementNote(SliderMeta36),
  "Tabs": withHtmlElementNote(TabsMeta37),
  "TagsInput": withHtmlElementNote(TagsInputMeta38),
  "ThemeModeToggleButton": withHtmlElementNote(ThemeModeToggleButtonMeta39),
  "ThemeProvider": withHtmlElementNote(ThemeProviderMeta40),
  "Toast": withHtmlElementNote(ToastMeta41),
  "ToggleButton": withHtmlElementNote(ToggleButtonMeta42),
  "ToggleGroup": withHtmlElementNote(ToggleGroupMeta43),
  "Tooltip": withHtmlElementNote(TooltipMeta44),
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
