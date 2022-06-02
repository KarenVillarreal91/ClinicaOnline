import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form !: FormGroup;
  spinner:boolean = false;

  constructor(private userService: UserService, private router: Router, private fb:FormBuilder) {
    this.userService.logueado = false;
    console.log(this.userService.logueado);

    this.form = this.fb.group({
      'email':['', [Validators.required, Validators.email]],
      'clave':['', Validators.required]
    });
  }

  ngOnInit(): void {}

  async Login()
  {
    this.userService.Login({email: this.form.value.email, clave: this.form.value.clave})
    .then((res:any)=>{

        // if(!this.userService.userLogueado?.emailVerified)
        // {
        //   Swal.fire({
        //     title: 'Error',
        //     text: 'Verifique su correo para la habilitación de su cuenta.',
        //     icon: 'error',
        //     timer: 5000,
        //     toast: true,
        //     backdrop: false,
        //     position: 'bottom',
        //     grow: 'row',
        //     timerProgressBar: true,
        //     showConfirmButton: false
        //   });
        // }
        // else
        // {
          this.spinner = true;

          setTimeout(() => {
            this.spinner = false;  
            this.userService.logueado = true;
            this.router.navigateByUrl('home');
          }, 2000);
        // }

    }).catch((error)=>{
      if(error.code == 'auth/wrong-password' || error.code == 'auth/user-not-found')
      {
        Swal.fire({
          title: 'Error',
          text: 'Correo o contraseña son incorrectos.',
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
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error' || this.form.value.email == "" || this.form.value.clave == "")
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
      else if(error.code == 'auth/invalid-email')
      {
        Swal.fire({
          title: 'Error',
          text: 'Correo no válido.',
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
      else if(error.code == 'auth/too-many-requests')
      {
        Swal.fire({
          title: 'Error',
          text: 'Demasiados intentos fallidos. Reintente más tarde.',
          icon: 'warning',
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
          text: 'Credenciales incorrectas.',
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
    });
  }

  InicioAutomatico(email:any, clave:any)
  {
    this.form.value.email = email;
    this.form.value.clave = clave;
    
    this.Login();
  } 
}
