export class Logger {
    readonly prefix?: string

    constructor(prefix?: string) {
        this.prefix = prefix;
    }

    private getLogPrefix(level: string): string {
        const timestamp = new Date().toISOString();
        const prefix = this.prefix ? `${this.prefix}|` : "";
        return `${prefix}${timestamp}|${level}`.padEnd(48);
    }

    debug(...data: any[]): void {
        const timestamp = this.getLogPrefix("DEBUG");
        console.debug(timestamp, ...data);
    }

    info(...data: any[]): void {
        const timestamp = this.getLogPrefix("INFO");
        console.info(timestamp, ...data);
    }

    warn(...data: any[]): void {
        const timestamp = this.getLogPrefix("WARN");
        console.warn(timestamp, ...data);
    }

    error(...data: any[]): void {
        const timestamp = this.getLogPrefix("ERROR");
        console.error(timestamp, ...data);
    }
}
