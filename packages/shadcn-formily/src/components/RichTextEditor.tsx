import type { Field } from '@formily/core';
import type { RichTextEditorProps } from '@pixpilot/shadcn-ui';

import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { RichTextEditor as OrgRichTextEditor } from '@pixpilot/shadcn-ui';
import { useCallback, useMemo } from 'react';
import { useFormContext } from '../hooks';

const RichTextEditorBase: FC<RichTextEditorProps> = (props) => {
  const formContext = useFormContext();
  const configRichTextEditor = formContext?.settings?.richTextEditor;
  const mergedProps = useMemo(
    () => ({ ...configRichTextEditor, ...props }),
    [configRichTextEditor, props],
  );
  return <OrgRichTextEditor {...mergedProps}>RichTextEditor</OrgRichTextEditor>;
};

export const RichTextEditor: FC = connect(
  RichTextEditorBase,
  mapProps((props, field) => {
    const { onChange } = props;

    const handleChange = useCallback(
      (nextHtml: string) => {
        (field as Field).onInput(nextHtml).catch(() => {});
        onChange?.(nextHtml);
      },
      [field, onChange],
    );

    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? '',
      onChange: handleChange,
    };
  }),
);
