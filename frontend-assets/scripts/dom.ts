export interface QueryResult<T extends Element> extends NodeListOf<T> {
    first(): T | undefined;
}

export const $ = <T extends Element>(selector: string, scope: ParentNode = document): QueryResult<T> => {
    const found = scope.querySelectorAll<T>(selector);
    const qr = found as QueryResult<T>;
    if (!qr.first) {
        qr.first = function () {
            return this.length > 0 ? this.item(0) : undefined;
        }
    }
    return qr;
};
