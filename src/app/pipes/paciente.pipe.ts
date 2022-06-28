import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'paciente'
})
export class PacientePipe implements PipeTransform {

  constructor(private userService:UserService)
  {}

  transform(dni: number): string 
  {
    for(let pac of this.userService.pacientes)
    {
      if(pac.dni == dni)
      {
        return pac.nombre + ' ' + pac.apellido;
      }
    }

    return '';
  }
}
