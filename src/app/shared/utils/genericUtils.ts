export class GenericUtils {
    static getObject<T extends keyof any>(obj: any, key: T): any[T] {
        return obj[key];
    }
}
