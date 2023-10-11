export function getOrCreate<T>(key: string, map: Map<string, T>, makeDefault: () => T): T {
    const extantValue = map.get(key);
    if (extantValue === undefined) {
        const defaultValue = makeDefault();
        map.set(key, defaultValue);
        return defaultValue;
    } else {
        return extantValue;
    }
}

export function makeMapUseFirst<TObj, TKey, TValue>(
    array: TObj[],
    keySelector: (x: TObj) => TKey,
    valueSelector: (x: TObj) => TValue,
): Map<TKey, TValue> {
    const map = new Map();
    for (const elem of array) {
        const key = keySelector(elem);
        if (map.has(key)) {
            continue;
        }
        const value = valueSelector(elem);
        map.set(key, value);
    }
    return map;
}

export async function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function checkSafeInteger(value: number, name: string): void {
    if (!Number.isSafeInteger(value)) {
        throw new Error(`${name} ${value} must be a safe JavaScript integer`);
    }
}
