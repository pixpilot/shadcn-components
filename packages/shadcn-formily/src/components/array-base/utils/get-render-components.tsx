import type { Schema } from '@formily/react';
import { forEachSchema } from '../../../utils';
import {
  ArrayAddition,
  ArrayEmpty,
  ArrayIndex,
  ArrayMoveDown,
  ArrayMoveUp,
  ArrayRemove,
} from '../components';
import {
  isAdditionComponent,
  isEmptyComponent,
  isIndexComponent,
  isMoveDownComponent,
  isMoveUpComponent,
  isRemoveComponent,
} from './is-array-component';

type ComponentTypes = 'Remove' | 'Addition' | 'Empty' | 'Index' | 'MoveDown' | 'MoveUp';

export function getRenderComponents(rootSchema: Schema) {
  const componentsMap = new Map<ComponentTypes, React.ReactNode>();

  forEachSchema(rootSchema, (schema, path) => {
    // Skip nested arrays (path.length > 0 means it's not root)
    if (path.length > 0 && schema.type === 'array') {
      return false; // Don't traverse this branch
    }

    if (isRemoveComponent(schema)) {
      componentsMap.set('Remove', <ArrayRemove {...schema['x-component-props']} />);
    }
    if (isAdditionComponent(schema)) {
      componentsMap.set('Addition', <ArrayAddition {...schema['x-component-props']} />);
    }
    if (isEmptyComponent(schema)) {
      componentsMap.set('Empty', <ArrayEmpty {...schema['x-component-props']} />);
    }
    if (isIndexComponent(schema)) {
      componentsMap.set('Index', <ArrayIndex {...schema['x-component-props']} />);
    }
    if (isMoveDownComponent(schema)) {
      componentsMap.set('MoveDown', <ArrayMoveDown {...schema['x-component-props']} />);
    }
    if (isMoveUpComponent(schema)) {
      componentsMap.set('MoveUp', <ArrayMoveUp {...schema['x-component-props']} />);
    }

    return true;
  });

  return componentsMap;
}
