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
  filtro:string = "";

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
      this.filtro = '';

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

  Filtro()
  {
    let filtro = this.filtro.toLowerCase();

    this.turnos = this.turnos.filter((turno)=>{
      let ret = false;

      if(turno.especialidad.toLowerCase() == filtro || turno.fecha == filtro || turno.paciente.toString() == filtro || 
      turno.especialista.toString() == filtro || turno.estado.toLowerCase() == filtro)
      {
        ret = true;
      }
      else
      {
        for(let pac of this.userService.pacientes)
        {
          if(pac.dni == turno.paciente)
          {
            for(let hist of pac.historiaClinica)
            {
              if(hist.altura == filtro || hist.peso == filtro || hist.presion == filtro || hist.temperatura == filtro)
              {
                ret = true;
              }
              else
              {
                for(let dato of hist.datos)
                {
                  if(dato.clave.toLowerCase() == filtro || dato.valor.toLowerCase() == filtro)
                  {
                    ret = true;
                  }
                }
              }
              
            }
          }
        }
      }
      
      return ret;
    });
  }
}
