import type { Meta } from '@storybook/react';

import { Form } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Popover',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // decorators: [
  //   (Story) => (
  //     <div className="w-[700px]">
  //       <Story />
  //     </div>
  //   ),
  // ],
};

export default meta;
// type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayPopover',
  displayTitle: 'ArrayPopover',
};

const {
  Declarative,
  EmptyArray,
  Sortable,
  SortableDisabledInForm,
  SortableNested,
  SortableDisabledForArray,
  WithActions,
  WithComponentClassName,
  WithDescription,
  WithItemReactionTitle,
  WithJSONSchema,
  WithTruncatedLabels,
  AutoSave,
  ManualSave,
} = createStories(storyConfig);

export {
  AutoSave,
  Declarative,
  EmptyArray,
  ManualSave,
  Sortable,
  SortableDisabledForArray,
  SortableDisabledInForm,
  SortableNested,
  WithActions,
  WithComponentClassName,
  WithDescription,
  WithItemReactionTitle,
  WithJSONSchema,
  WithTruncatedLabels,
};
