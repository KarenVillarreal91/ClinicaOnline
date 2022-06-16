import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  formEspecialista !: FormGroup;
  formPaciente !: FormGroup;

  fotos:FormData = new FormData();
  especialidades:Array<any> = [];
  spinner:boolean = false;
  
  constructor(private fb:FormBuilder, private userService:UserService, private router:Router) 
  { 
    this.formEspecialista = this.fb.group({
      'nombre':['', Validators.required],
      'apellido':['', Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99)]],
      'dni':['',[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'especialidad':['',[Validators.required]],
      'email':['', [Validators.required, Validators.email]],
      'clave':['', Validators.required],
      'foto':['', Validators.required],
      'catpcha':['', Validators.required]
    });

    this.formPaciente = this.fb.group({
      'nombre':['', Validators.required],
      'apellido':['', Validators.required],
      'edad':['',[Validators.required, Validators.min(0), Validators.max(99)]],
      'dni':['',[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'obra':['', Validators.required],
      'email':['', [Validators.required, Validators.email]],
      'clave':['', Validators.required],
      'foto1':['', Validators.required],
      'foto2':['', Validators.required],
      'catpcha':['', Validators.required]
    });

    this.userService.GetColeccion('especialidades').subscribe((data)=>{
      this.especialidades = data;
    });
  }

  ngOnInit(): void {
    const signUpButton:any = document.getElementById('signUp');
    const signInButton:any = document.getElementById('signIn');
    const container:any = document.getElementById('container');
  
    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });
  
    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
  }

  SeleccionarEsp(e:any)
  {
    this.formEspecialista.controls['especialidad'].setValue(e.nombre);
  }

  SubirFoto1(e:any)
  {
    this.fotos.append('foto1', e.target.files[0]);
  }

  SubirFoto2(e:any)
  {
    this.fotos.append('foto2', e.target.files[0]);
  }

  CatpchaPac(captchaResponse: string) {
    if(captchaResponse)
    {
      this.formPaciente.controls['catpcha'].setValue(true);
    }
  }

  CatpchaEsp(captchaResponse: string) {
    if(captchaResponse)
    {
      this.formEspecialista.controls['catpcha'].setValue(true);
    }
  }

  async RegistroEspecialista()
  {
    let encontro = false;
    let datos = this.formEspecialista.value;

    this.userService.Registro(datos)
    .then((res:any)=>{
      
      for(let esp of this.especialidades)
      {
        if(esp.nombre == datos.especialidad)
        {
          encontro = true;
          break;
        }
      }

      if(!encontro)
      {
        this.userService.SubirColeccion({nombre: datos.especialidad, foto: 'https://cdn-icons-png.flaticon.com/512/1396/1396199.png'}, 'especialidades');
      }
      
      let user = {nombre: datos.nombre, apellido: datos.apellido, dni: datos.dni, edad: datos.edad, 
      especialidad: [datos.especialidad], horarios: ['Lunes 08:30', 'Martes 08:30', 'Miercoles 08:30', 'Jueves 08:30', 'Viernes 08:30', 'Sábado 08:30'],
      email: datos.email, habilitado: false};
      
      this.spinner = true;

      setTimeout(() => {
        this.spinner = false;  
        this.userService.SubirEspecialista(user, this.fotos);
        
        if(this.userService.logueado)
        {
          Swal.fire({
            title: 'Se registró el especialista correctamente.',
            icon: 'success',
            timer: 4000,
            toast: true,
            backdrop: false,
            position: 'bottom',
            grow: 'row',
            timerProgressBar: true,
            showConfirmButton: false
          });

          this.router.navigateByUrl('home');
        }
        else
        {
          this.userService.LogOut();

          Swal.fire({
            title: 'Registro exitoso',
            text: 'Verifique su correo para la habilitación de su cuenta.',
            icon: 'success',
            confirmButtonText: 'Continuar'
          });

          this.router.navigateByUrl('login');
        }
      }, 2000);

    }).catch((error)=>{
      this.Errores(error);
    });
  }

  async RegistroPaciente()
  {
    let datos = this.formPaciente.value;

    this.userService.Registro(datos)
    .then((res:any)=>{
        let user = {nombre: datos.nombre, apellido: datos.apellido, dni: datos.dni, edad: datos.edad, 
        obra: datos.obra, email: datos.email, turnos: [], historiaClinica: []};
        
        this.spinner = true;

          setTimeout(() => {
            this.spinner = false;  
            this.userService.SubirPaciente(user, this.fotos);
            
            if(this.userService.logueado)
            {
              Swal.fire({
                title: 'Se registró el paciente correctamente.',
                icon: 'success',
                timer: 4000,
                toast: true,
                backdrop: false,
                position: 'bottom',
                grow: 'row',
                timerProgressBar: true,
                showConfirmButton: false
              });

              this.router.navigateByUrl('home');
            }
            else
            {
              this.userService.LogOut();
              
              Swal.fire({
                title: 'Registro exitoso',
                text: 'Verifique su correo para la habilitación de su cuenta.',
                icon: 'success',
                confirmButtonText: 'Continuar'
              });

              this.router.navigateByUrl('login');
            }
          }, 2000);
        
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
