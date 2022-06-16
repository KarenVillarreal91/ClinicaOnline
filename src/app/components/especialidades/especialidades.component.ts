import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.scss']
})
export class EspecialidadesComponent implements OnInit {

  @Output() especialidadSeleccionadaEmitter:EventEmitter<any> = new EventEmitter();

  @Input() especialidades:any;

  constructor(public userService:UserService) 
  { 
  }

  ngOnInit(): void {}

  SeleccionarEspecialidad(seleccion:any)
  {
    this.especialidadSeleccionadaEmitter.emit(seleccion);
  }

}
