import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {

  horario:any = {datos: ''};
  duracion:number = 30;

  constructor(public userService:UserService) 
  { 
    this.horario.datos = "";
  }

  ngOnInit(): void {
  }

  SeleccionarHorario(e:any)
  {  
    if(e.datos)
    {
      this.horario = e;
    }
    else
    {
      this.horario.datos = '';
    }
  }

  GuardarHorario()
  {
    let horarios:Array<any> = this.userService.userLogueado.horarios;

    horarios[this.horario.index] = this.horario.datos;
    this.userService.EditarColeccion(this.userService.userLogueado.id, {horarios: horarios}, 'especialistas')
    .then(()=>{
      Swal.fire({
        title: 'Se guardó el horario correctamente.',
        icon: 'success',
        timer: 3000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
    });
  }
}
