import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-admin',
  templateUrl: './alta-admin.component.html',
  styleUrls: ['./alta-admin.component.scss']
})
export class AltaAdminComponent implements OnInit {
  
  form !: FormGroup;

  foto:FormData = new FormData();
  spinner:boolean = false;

  constructor(private fb:FormBuilder, private userService:UserService, private router:Router) 
  { 
    this.form = this.fb.group({
      'nombre':['', Validators.required],
      'apellido':['', Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99)]],
      'dni':['',[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'email':['', [Validators.required, Validators.email]],
      'clave':['', Validators.required],
      'foto':['', Validators.required]
    }); 
  }

  ngOnInit(): void {
  }

  SubirFoto(e:any)
  {
    this.foto.append('foto', e.target.files[0]);
  }

  async Registro()
  {
    let datos = this.form.value;

    this.userService.Registro(datos)
    .then((res:any)=>{
      let user = {nombre: datos.nombre, apellido: datos.apellido, dni: datos.dni, edad: datos.edad, 
      email: datos.email};
      
      this.spinner = true;
      
      setTimeout(() => {
        this.spinner = false;  
        this.userService.logueado = true;
        this.userService.SubirAdmin(user, this.foto);
      }, 2000);
      
      Swal.fire({
        title: 'Se registró el administrador correctamente.',
        icon: 'success',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
    }).catch((error)=>{
      this.Errores(error);
    });
  }

  Errores(error:any)
  {
    if(error.code == 'auth/email-already-in-use')
      {
        Swal.fire({
          title: 'Error',
          text: 'El correo ya está en uso.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error')
      {
        Swal.fire({
          title: 'Error',
          text: 'No pueden quedar campos vacíos.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      else if(error.code == 'auth/weak-password')
      {
        Swal.fire({
          title: 'Error',
          text: 'La contraseña debe contener al menos 6 caracteres.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      else
      {
        Swal.fire({
          title: 'Error',
          text: 'El mail o la contraseña no son válidos.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      
      console.log(error.code);
  }
}
