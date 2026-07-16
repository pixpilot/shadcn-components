import { connect, mapProps } from '@formily/react';

import { mapFormItemProps } from '../form-item/map-form-item-props';
import { BaseDialogItem } from './BaseDialogItem';

/**
 * DialogItem decorator connected to Formily field state.
 * Maps field label, description, and validation state onto the decorator the
 * same way FormItem does.
 */
export const DialogItem = connect(BaseDialogItem, mapProps(mapFormItemProps));
