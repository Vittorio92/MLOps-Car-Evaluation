import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bytesToReadable' })
export class BytesToReadablePipe implements PipeTransform {
    transform(value: string | number, decimals: number = 2): string {
        let bytes = Number(value);
        if (isNaN(bytes) || bytes < 0) return '0 B';

        const units = ['B', 'kB', 'MB', 'GB', 'TB'];
        let unitIndex = 0;

        while (bytes >= 1024 && unitIndex < units.length - 1) {
            bytes /= 1024;
            unitIndex++;
        }

        return `${bytes.toFixed(decimals)} ${units[unitIndex]}`;
    }
}
