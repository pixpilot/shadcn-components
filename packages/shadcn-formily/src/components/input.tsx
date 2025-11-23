import { connect } from '@formily/react';
import { Input as ShadcnInput } from '@internal/shadcn';

/**
 * Formily-connected Input component
 * Automatically connects shadcn Input to Formily field state
 */
export const Input = connect(ShadcnInput);
