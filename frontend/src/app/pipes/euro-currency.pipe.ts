import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroCurrency',
  standalone: true
})
export class EuroCurrencyPipe implements PipeTransform {

    transform(value: number): string {
      return value.toFixed(2) + ' €';
    }

}