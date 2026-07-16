import { connect, mapProps } from '@formily/react';

import { mapFormItemProps } from '../form-item/map-form-item-props';
import { BasePopoverItem } from './BasePopoverItem';

/**
 * PopoverItem decorator connected to Formily field state.
 * Maps field label, description, and validation state onto the decorator the
 * same way FormItem does.
 */
export const PopoverItem = connect(BasePopoverItem, mapProps(mapFormItemProps));
