import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {

  @Input() inputTurnos:any = "";

  constructor(public userService:UserService, private router:Router) 
  { }

  ngOnInit(): void {
  }

  CambiarEstado(turno:any, estado:string)
  {
    if(estado != 'Aceptado')
    {
      this.Calificar(turno).then((res)=>{
        
        if(estado != '')
        {
          res.estado = estado;
        }
        
        this.userService.EditarColeccion(turno.id, res, 'turnos').then(()=>{
          if(estado == 'Finalizado')
          {
            this.router.navigateByUrl('historiaClinica');
          }
        });
      });

    }
    else
    {
      Swal.fire({
        title: `¿Quiere aceptar este turno?`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      }).then((result) => {
        if(result.isConfirmed) 
        {
          this.userService.EditarColeccion(turno.id, {estado: estado}, 'turnos');

          Swal.fire({
            title: `Se aceptó el turno.`,
            icon: 'success',
            timer: 4000,
            toast: true,
            backdrop: false,
            position: 'bottom',
            grow: 'row',
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      })
    }
  }

  async Calificar(turno:any)
  {
    let datos:any;

    const { value: text } = await Swal.fire({
      title: 'Deja un comentario:',
      input: 'textarea',
      icon: 'warning',
      confirmButtonText: 'Continuar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })

    if(text != '')
    {
      if(!this.userService.EsPaciente())
      {
        datos = {comentario: text};
      }
      else
      {
        datos = {comentarioPaciente: text};
      }

      return datos;
    }
    else
    {
      Swal.fire(
        'Error',
        'Tiene que escribir un comentario.',
        'error'
      )

      return false;
    }
  }

  VerComentario(turno:any)
  {
    Swal.fire(
      'Reseña:',
      `${turno.comentarioPaciente}`
    )
  }
}

