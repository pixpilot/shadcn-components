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
import { meta as BrandLogoMeta3 } from '../logo/mcp';
import { meta as ButtonMeta4 } from '../button/mcp';
import { meta as ButtonExtendedMeta5 } from '../button-extended/mcp';
import { meta as ButtonGroupMeta6 } from '../button-group/mcp';
import { meta as CardMeta7 } from '../card/mcp';
import { meta as CircleLoaderMeta8 } from '../circle-loader/mcp';
import { meta as CloseButtonAbsoluteMeta9 } from '../close-button-absolute/mcp';
import { meta as CloseButtonRoundedMeta10 } from '../close-button-rounded/mcp';
import { meta as ColorPickerMeta11 } from '../ColorPicker/mcp';
import { meta as ColorPickerBaseMeta12 } from '../ColorPickerBase/mcp';
import { meta as ColorSelectMeta13 } from '../color-select/mcp';
import { meta as ComboboxMeta14 } from '../combobox/mcp';
import { meta as ConfirmationDialogMeta15 } from '../confirmation-dialog/mcp';
import { meta as ContentCardMeta16 } from '../content-card/mcp';
import { meta as DatePickerMeta17 } from '../date-picker/mcp';
import { meta as DialogMeta18 } from '../dialog/mcp';
import { meta as DrawerMeta19 } from '../drawer/mcp';
import { meta as FileUploadMeta20 } from '../file-upload/mcp';
import { meta as FileUploadInlineMeta21 } from '../file-upload-inline/mcp';
import { meta as FileUploadRootMeta22 } from '../file-upload-root/mcp';
import { meta as IconPickerMeta23 } from '../icon-selector/mcp';
import { meta as IconToggleMeta24 } from '../icon-toggle/mcp';
import { meta as InputMeta25 } from '../input/mcp';
import { meta as LayoutMeta26 } from '../layout/mcp';
import { meta as LoadingOverlayMeta27 } from '../loading-overlay/mcp';
import { meta as OverlayProviderMeta28 } from '../overlay-provider/mcp';
import { meta as PaginationMeta29 } from '../pagination/mcp';
import { meta as PopoverMeta30 } from '../popover/mcp';
import { meta as RatingMeta31 } from '../rating/mcp';
import { meta as registerDialogMeta32 } from '../dialog-registry/mcp';
import { meta as registerDrawerMeta33 } from '../drawer-registry/mcp';
import { meta as RichTextEditorMeta34 } from '../rich-text-editor/mcp';
import { meta as ScaledPreviewMeta35 } from '../scaled-preview/mcp';
import { meta as SelectMeta36 } from '../select/mcp';
import { meta as ShakeStylesMeta37 } from '../shake-styles/mcp';
import { meta as SliderMeta38 } from '../slider/mcp';
import { meta as TabsMeta39 } from '../tabs/mcp';
import { meta as TagsInputMeta40 } from '../tags-input/mcp';
import { meta as ThemeModeToggleButtonMeta41 } from '../theme-toggle/mcp';
import { meta as ThemeProviderMeta42 } from '../theme-provider/mcp';
import { meta as ToastMeta43 } from '../toast/mcp';
import { meta as ToggleButtonMeta44 } from '../toggle-button/mcp';
import { meta as ToggleGroupMeta45 } from '../toggle-group/mcp';
import { meta as TooltipMeta46 } from '../tooltip/mcp';
import { meta as TypeToConfirmDialogMeta47 } from '../type-to-confirm-dialog/mcp';

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
  "BrandLogo": withHtmlElementNote(BrandLogoMeta3),
  "Button": withHtmlElementNote(ButtonMeta4),
  "ButtonExtended": withHtmlElementNote(ButtonExtendedMeta5),
  "ButtonGroup": withHtmlElementNote(ButtonGroupMeta6),
  "Card": withHtmlElementNote(CardMeta7),
  "CircleLoader": withHtmlElementNote(CircleLoaderMeta8),
  "CloseButtonAbsolute": withHtmlElementNote(CloseButtonAbsoluteMeta9),
  "CloseButtonRounded": withHtmlElementNote(CloseButtonRoundedMeta10),
  "ColorPicker": withHtmlElementNote(ColorPickerMeta11),
  "ColorPickerBase": withHtmlElementNote(ColorPickerBaseMeta12),
  "ColorSelect": withHtmlElementNote(ColorSelectMeta13),
  "Combobox": withHtmlElementNote(ComboboxMeta14),
  "ConfirmationDialog": withHtmlElementNote(ConfirmationDialogMeta15),
  "ContentCard": withHtmlElementNote(ContentCardMeta16),
  "DatePicker": withHtmlElementNote(DatePickerMeta17),
  "Dialog": withHtmlElementNote(DialogMeta18),
  "Drawer": withHtmlElementNote(DrawerMeta19),
  "FileUpload": withHtmlElementNote(FileUploadMeta20),
  "FileUploadInline": withHtmlElementNote(FileUploadInlineMeta21),
  "FileUploadRoot": withHtmlElementNote(FileUploadRootMeta22),
  "IconPicker": withHtmlElementNote(IconPickerMeta23),
  "IconToggle": withHtmlElementNote(IconToggleMeta24),
  "Input": withHtmlElementNote(InputMeta25),
  "Layout": withHtmlElementNote(LayoutMeta26),
  "LoadingOverlay": withHtmlElementNote(LoadingOverlayMeta27),
  "OverlayProvider": withHtmlElementNote(OverlayProviderMeta28),
  "Pagination": withHtmlElementNote(PaginationMeta29),
  "Popover": withHtmlElementNote(PopoverMeta30),
  "Rating": withHtmlElementNote(RatingMeta31),
  "registerDialog": withHtmlElementNote(registerDialogMeta32),
  "registerDrawer": withHtmlElementNote(registerDrawerMeta33),
  "RichTextEditor": withHtmlElementNote(RichTextEditorMeta34),
  "ScaledPreview": withHtmlElementNote(ScaledPreviewMeta35),
  "Select": withHtmlElementNote(SelectMeta36),
  "ShakeStyles": withHtmlElementNote(ShakeStylesMeta37),
  "Slider": withHtmlElementNote(SliderMeta38),
  "Tabs": withHtmlElementNote(TabsMeta39),
  "TagsInput": withHtmlElementNote(TagsInputMeta40),
  "ThemeModeToggleButton": withHtmlElementNote(ThemeModeToggleButtonMeta41),
  "ThemeProvider": withHtmlElementNote(ThemeProviderMeta42),
  "Toast": withHtmlElementNote(ToastMeta43),
  "ToggleButton": withHtmlElementNote(ToggleButtonMeta44),
  "ToggleGroup": withHtmlElementNote(ToggleGroupMeta45),
  "Tooltip": withHtmlElementNote(TooltipMeta46),
  "TypeToConfirmDialog": withHtmlElementNote(TypeToConfirmDialogMeta47),
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
