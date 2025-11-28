// import { describe, expect, it, vi } from 'vitest';

// // Mock the array components to avoid import issues
// vi.mock('../../../../src/components/array-base/components', () => ({
//   ArrayAddition: () => 'MockArrayAddition',
//   ArrayEmpty: () => 'MockArrayEmpty',
//   ArrayIndex: () => 'MockArrayIndex',
//   ArrayMoveDown: () => 'MockArrayMoveDown',
//   ArrayMoveUp: () => 'MockArrayMoveUp',
//   ArrayRemove: () => 'MockArrayRemove',
// }));

// // eslint-disable-next-line import/first
// import { getArrayDefaultComponents } from '../../../../src/components/array-base/utils/collect-array-filed-schemas';

// describe('getArrayDefaultComponents', () => {
//   it('should return all default components when no custom components are present', () => {
//     const schema = {
//       type: 'array',
//       items: {
//         type: 'object',
//         properties: {
//           name: { type: 'string' },
//         },
//       },
//     } as any;

//     const result = getArrayDefaultComponents(schema);

//     expect(result.size).toBe(6);
//     expect(result.has('Addition')).toBe(true);
//     expect(result.has('Remove')).toBe(true);
//     expect(result.has('Empty')).toBe(true);
//     expect(result.has('Index')).toBe(true);
//     expect(result.has('MoveUp')).toBe(true);
//     expect(result.has('MoveDown')).toBe(true);
//   });

//   it('should remove default components when custom ones are present', () => {
//     const schema = {
//       type: 'array',
//       items: {
//         type: 'object',
//         properties: {
//           name: { type: 'string' },
//           customRemove: {
//             type: 'void',
//             'x-component': 'ArrayItems.Remove',
//           },
//         },
//       },
//     } as any;

//     const result = getArrayDefaultComponents(schema);

//     expect(result.size).toBe(5);
//     expect(result.has('Remove')).toBe(false);
//     expect(result.has('Addition')).toBe(true);
//     expect(result.has('Empty')).toBe(true);
//     expect(result.has('Index')).toBe(true);
//     expect(result.has('MoveUp')).toBe(true);
//     expect(result.has('MoveDown')).toBe(true);
//   });

//   it('should skip nested arrays', () => {
//     const schema = {
//       type: 'array',
//       items: {
//         type: 'object',
//         properties: {
//           name: { type: 'string' },
//           tags: {
//             type: 'array',
//             items: { type: 'string' },
//             'x-component': 'ArrayItems.Remove', // This should not affect the root array since nested arrays are skipped
//           },
//         },
//       },
//     } as any;

//     const result = getArrayDefaultComponents(schema);

//     // Nested arrays are skipped, so the custom Remove in the nested array should not be detected
//     // Therefore all defaults should remain
//     expect(result.size).toBe(6);
//   });

//   it('should process root array custom components but skip nested arrays', () => {
//     const schema = {
//       type: 'array',
//       'x-component': 'ArrayItems.Remove', // Custom Remove on root array
//       items: {
//         type: 'object',
//         properties: {
//           name: { type: 'string' },
//           nestedArray: {
//             type: 'array',
//             items: { type: 'string' },
//             'x-component': 'ArrayItems.Addition', // This should not be processed since nested arrays are skipped
//           },
//         },
//       },
//     } as any;

//     const result = getArrayDefaultComponents(schema);

//     // Root custom Remove should remove the default Remove
//     // But nested array custom Addition should not be processed (since nested arrays are skipped)
//     // So only Remove should be missing, Addition should still be present
//     expect(result.size).toBe(5);
//     expect(result.has('Remove')).toBe(false);
//     expect(result.has('Addition')).toBe(true);
//     expect(result.has('Empty')).toBe(true);
//     expect(result.has('Index')).toBe(true);
//     expect(result.has('MoveUp')).toBe(true);
//     expect(result.has('MoveDown')).toBe(true);
//   });
// });
