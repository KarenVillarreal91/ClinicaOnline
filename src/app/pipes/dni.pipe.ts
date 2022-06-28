import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dni'
})
export class DniPipe implements PipeTransform {

  transform(value: string): string 
  {
    let dni = value.toString();
    return `${dni.substring(0, 2)}.${dni.substring(2, 5)}.${dni.substring(5, 8)}`;
  }

}
