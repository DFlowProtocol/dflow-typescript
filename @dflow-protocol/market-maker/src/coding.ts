export async function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function isSafeInteger(value: number): boolean {
    return Number.isSafeInteger(value);
}
