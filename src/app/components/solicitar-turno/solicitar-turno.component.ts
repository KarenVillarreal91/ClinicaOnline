import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  form !: FormGroup;
  especialidades:Array<any> = [];
  especialidadesMostrar:Array<any> = [];
  especialistaSeleccionado:any;
  especialistaNombre:string = "";
  dias:Array<string> = [];
  dia:string = "";
  horarios:Array<any> = [];
  pacienteActual:any;

  constructor(private fb:FormBuilder, public userService:UserService, private router:Router) 
  { 
    this.form = this.fb.group({
      'especialidad':['', Validators.required],
      'especialista':['', Validators.required],
      'fecha':['', Validators.required],
      'paciente':['', Validators.required],
      'estado':['Solicitado'],
      'encuesta':[false]
    });

    this.pacienteActual = this.userService.EsPaciente();

    if(this.pacienteActual)
    {
      this.form.controls['paciente'].setValue(this.pacienteActual.dni);
    }
  }

  ngOnInit(): void 
  {
    
  }

  Dias()
  {
    this.dias = [];
    let date:Date = new Date();
    let dia:Date;

    for(let i = 1; i < 16; i++)
    {
      dia = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);

      if(dia.toDateString().split(" ")[0] != "Sun")
      {
        let diaString = dia.toDateString().split(' ')[0];

        switch(diaString)
        {
          case 'Mon':
            diaString = 'Lunes';
          break;

          case 'Tue':
            diaString = 'Martes';
          break;
          
          case 'Wed':
            diaString = 'Miercoles';
          break;
          
          case 'Thu':
            diaString = 'Jueves';
          break;
          
          case 'Fri':
            diaString = 'Viernes';
          break;
          
          case 'Sat':
            diaString = 'Sábado';
          break;
        }

        for(let item of this.especialistaSeleccionado.horarios)
        {
          if(item.split(' ')[0] == diaString)
          {
            for(let i = 1; i < item.split(' ').length; i++)
            {
              this.dias.push(`${("0" + dia.getDate()).slice(-2)}-${("0" + (dia.getMonth() + 1)).slice(-2)} ${item.split(' ')[i]}`);
            }

            break;
          }
        }
      }
    }
  }

  FiltrarEspecialidad()
  {
    this.especialidadesMostrar = [];

    this.userService.GetColeccion('especialidades').subscribe((data)=>{
      for(let item of data)
      {
        for(let esp of this.especialidades)
        {
          if(item.nombre == esp)
          {
            this.especialidadesMostrar.push(item);
          }
        }
      }
    })
  }

  SeleccionarEspecialista(esp:any)
  {
    this.form.controls['especialidad'].setValue('');
    this.form.controls['fecha'].setValue('');

    this.especialistaSeleccionado = esp;
    this.especialidades = esp.especialidad;
    this.FiltrarEspecialidad();
    this.Dias();
    this.especialistaNombre = `${esp.nombre} ${esp.apellido}`;
    this.form.controls['especialista'].setValue(esp.dni);
  }
  
  SeleccionarEspecialidad(e:any)
  {
    this.form.controls['fecha'].setValue('');

    this.form.controls['especialidad'].setValue(e.nombre);
  }

  SeleccionarFecha(fecha:any)
  {
    this.dia = fecha;
    this.form.controls['fecha'].setValue(fecha); 
  }

  SeleccionarPaciente(paciente:any)
  {
    this.pacienteActual = paciente;
    console.log(paciente);
    this.form.controls['paciente'].setValue(paciente.dni);
  }

  Solicitar()
  {
    let turnos:Array<any> = this.pacienteActual.turnos;

    this.userService.SubirColeccion(this.form.value, 'turnos')
    .then((res:any)=>{
      turnos.push(res.id);
      this.userService.EditarColeccion(this.pacienteActual.id, {turnos: turnos}, 'pacientes')
      .then(()=>{
        Swal.fire({
          title: 'Turno solicitado correctamente.',
          icon: 'success',
          confirmButtonText: 'Continuar'
        });
        
        this.router.navigateByUrl('home');
      });
    });
  }
}
