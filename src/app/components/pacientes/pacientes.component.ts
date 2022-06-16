import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {

  @Output() pacienteSeleccionadoEmitter:EventEmitter<any> = new EventEmitter();

  @Input() pacientes:any;

  constructor(public userService:UserService) 
  { 
  }

  ngOnInit(): void {}

  SeleccionarPaciente(seleccion:any)
  {
    this.pacienteSeleccionadoEmitter.emit(seleccion);
  }
}
