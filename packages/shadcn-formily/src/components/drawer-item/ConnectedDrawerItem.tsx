import { connect, mapProps } from '@formily/react';

import { mapFormItemProps } from '../form-item/map-form-item-props';
import { BaseDrawerItem } from './BaseDrawerItem';

/**
 * DrawerItem decorator connected to Formily field state.
 * Maps field label, description, and validation state onto the decorator the
 * same way FormItem does.
 */
export const DrawerItem = connect(BaseDrawerItem, mapProps(mapFormItemProps));
