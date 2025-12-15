import type { Field } from '@formily/core';
import type { RichTextEditorProps } from '@pixpilot/shadcn-ui';

import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { RichTextEditor as OrgRichTextEditor } from '@pixpilot/shadcn-ui';
import { useFormContext } from '../hooks';

const RichTextEditorBase: FC<RichTextEditorProps> = (props) => {
  const formContext = useFormContext();
  const configRichTextEditor = formContext?.settings?.richTextEditor;
  const mergedProps = { ...configRichTextEditor, ...props };
  return <OrgRichTextEditor {...mergedProps}>RichTextEditor</OrgRichTextEditor>;
};

export const RichTextEditor: FC = connect(
  RichTextEditorBase,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? '',
    };
  }),
);
