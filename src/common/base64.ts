export class Base64 {
  static to(data: string[]): string {
    const buf = Buffer.from(data.join(':'), 'utf8');
    return buf.toString('base64');
  }

  static from(base64: string): any[] {
    return Buffer.from(base64, 'base64').toString('ascii').split(':');
  }
}
