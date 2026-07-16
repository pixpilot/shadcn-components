import { connect, mapProps } from '@formily/react';

import { BaseFormItem } from './BaseFormItem';
import { mapFormItemProps } from './map-form-item-props';

/**
 * FormItem component connected to Formily field state.
 * Automatically maps field validation state to component props.
 */
export const FormItem = connect(BaseFormItem, mapProps(mapFormItemProps));
