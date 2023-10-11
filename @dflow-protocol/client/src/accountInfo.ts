export abstract class AccountInfo<T> {
    protected readonly data: T;

    constructor(data: T) {
        this.data = data;
    }
}
