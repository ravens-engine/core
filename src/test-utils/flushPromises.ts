export async function flushPromises(): Promise<void> {
    return new Promise(resolve => {
        setImmediate(resolve);
    });
}