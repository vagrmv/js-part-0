// Test utils

const testBlock = (name: string): void => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a: unknown, b: unknown): boolean => {
    if (a instanceof Array && b instanceof Array) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] instanceof Array && b[i] instanceof Array) {
                areEqual(a[i], b[i]);
            } else if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    return a === b;
};

const test = (whatWeTest: string, actualResult: unknown, expectedResult: unknown): void => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value: unknown): string => {
    return typeof value;
};

const getTypesOfItems = (arr: unknown[]): string[] => {
    return arr.map((item) => {
        return typeof item;
    });
};

const allItemsHaveTheSameType = (arr: unknown[]) => {
    const typesArr: string[] = getTypesOfItems(arr);
    return typesArr.every((item) => item === typesArr[0]);
};

const getRealType = (value: unknown): string => {
    if (value === null) {
        return 'null';
    }
    if (value === undefined) {
        return 'undefined';
    }
    if (typeof value === 'number' && isNaN(value)) {
        return 'NaN';
    }
    if (typeof value === 'number' && !isFinite(value)) {
        return 'Infinity';
    }
    return value.constructor.name.toLowerCase();
};

const getRealTypesOfItems = (arr: unknown[]): string[] => {
    const result: string[] = [];
    for (const item of arr) {
        result.push(getRealType(item));
    }
    return result;
};

const everyItemHasAUniqueRealType = (arr: unknown[]): boolean => {
    const arrTypes: string[] = getRealTypesOfItems(arr);
    const setTypes: Set<string> = new Set(arrTypes);
    return setTypes.size === arrTypes.length;
};

const countRealTypes = (arr: unknown[]) => {
    const result: {[key_wtf_how_it_works: string]: number} = {};
    for (const item of arr) {
        const type: string = getRealType(item);
        result[type] = (result[type] || 0) + 1;
    }
    return Object.entries(result).sort(([s1], [s2]) => s1.localeCompare(s2));
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);
// @ts-expect-error
test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    // Add values of different types like boolean, object, date, NaN and so on
    true,
    42,
    'hello',
    [1, 2, 3, 4, 5],
    {},
    (value: string) => {
        console.log(value);
    },
    undefined,
    null,
    // @ts-expect-error
    1 / 'a',
    1 / 0,
    new Date(),
    /\w+/,
    new Set(),
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'date',
    'regexp',
    'set',
    // What else?
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);
// @ts-expect-error
test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

// Add several positive and negative tests
