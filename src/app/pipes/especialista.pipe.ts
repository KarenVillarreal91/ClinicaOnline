import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Pipe({
  name: 'especialista'
})
export class EspecialistaPipe implements PipeTransform {

  constructor(private userService:UserService)
  {}

  transform(dni: number): string 
  {
    for(let esp of this.userService.especialistas)
    {
      if(esp.dni == dni)
      {
        return esp.nombre + ' ' + esp.apellido;
      }
    }

    return '';
  }
}
