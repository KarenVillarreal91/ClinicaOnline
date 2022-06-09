import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.scss']
})
export class MisHorariosComponent implements OnInit {

  @Output() horarioSeleccionadoEmitter:EventEmitter<any> = new EventEmitter();

  horas:Array<any> = [];
  dias:Array<string> = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  seleccion:any = {index: 0, datos: ""};

  dia:string = '';
  hora:string = '';

  constructor(public userService:UserService) 
  { }

  ngOnInit(): void 
  {
  }

  Horarios()
  {
    this.horas = [];
    let date:Date = new Date(2022, 6, 2, 8);
    let horaLim = 19;

    if(this.dia == "Sábado")
    {
      horaLim = 14;
    }

    for(let i = 0; date.getHours() < horaLim; i++)
    {
      date = new Date(2022, 6, 2, date.getHours(), date.getMinutes()+30);

      if(date.getHours() != horaLim)
      {
        this.horas.push(date.toTimeString().split(":")[0]+':'+date.toTimeString().split(":")[1]);
      }
    }
  }

  SeleccionarDia(dia:string)
  {
    this.horarioSeleccionadoEmitter.emit('');
    this.Reiniciar();
    document.getElementById(this.dia)?.style.setProperty('background-color', '#ffffff');
    this.dia = dia;
    this.seleccion.datos = dia;
    this.seleccion.index = this.dias.indexOf(dia);
    this.Horarios();
    document.getElementById(this.dia)?.style.setProperty('background-color', '#c3c3c3');
  }

  SeleccionarHora(hora:string)
  {
    let el:any = document.getElementById(hora);
    el.style.display = 'none';
    document.getElementById(this.hora)?.style.setProperty('background-color', '#ffffff');
    document.getElementById(this.hora)?.style.setProperty('background-color', '#c3c3c3');

    this.seleccion.datos += ' ' + hora;
    this.horarioSeleccionadoEmitter.emit(this.seleccion);
  }

  Reiniciar()
  {
    let el:any;

    for(let hora of this.horas)
    {
      el = document.getElementById(hora);
      el.style.display = 'inline-flex';
    }
  }
}
