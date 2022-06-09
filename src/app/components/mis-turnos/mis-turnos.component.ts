import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {

  @Output() turnosEmitter:EventEmitter<any> = new EventEmitter();

  turnos:Array<any> = [];

  constructor(public userService:UserService) 
  { 
    this.Turnos();
  }

  ngOnInit(): void {
  }

  Turnos()
  {
    
    let userDni = this.userService.userLogueado.dni;
    
    this.userService.GetColeccion('turnos').subscribe((data)=>{
      this.turnos = [];

      for(let turno of data)
      {
        if(turno.paciente == userDni || turno.especialista == userDni)
        {
          this.turnos.push(turno);
        }
      }

      if(this.userService.EsAdmin())
      {
        this.turnos = data;
      }
    });
  }
}
