import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit {

  form !: FormGroup;
  datosCant:number = 0;
  pacienteActual:any;

  constructor(private fb:FormBuilder, public userService:UserService, private router:Router) { 
    this.form = this.fb.group({
      'paciente':['', Validators.required],
      'altura':['', Validators.required],
      'peso':['', Validators.required],
      'temperatura':['', Validators.required],
      'presion':['', Validators.required],
      'datos':['']
    });
  }

  ngOnInit(): void {
  }

  SeleccionarPaciente(paciente:any)
  {
    this.pacienteActual = paciente;
    this.form.controls['paciente'].setValue(paciente.dni);
  }

  Enviar()
  {
    this.form.controls['datos'].setValue('');
    let datos:Array<any> = [];
    let dato:any;
    let historal:Array<any> = this.pacienteActual.historiaClinica;

    for(let i = 1; i <= this.datosCant; i++)
    {

      dato = {clave: (<HTMLInputElement>document.getElementById('clave-'+i)).value,
      valor: (<HTMLInputElement>document.getElementById('valor-'+i)).value};

      if(dato.clave && dato.valor)
      {
        datos.push(dato);
      }
    }

    if(datos.length > 0)
    {
      this.form.controls['datos'].setValue(datos);
    }
    
    let especialista:any = this.userService.EsEspecialista();
    this.form.value.especialista = especialista.dni;
    historal.push(this.form.value);

    this.userService.EditarColeccion(this.pacienteActual.id, {historiaClinica: historal}, 'pacientes');

    Swal.fire({
      title: 'Se subió el historial del paciente.',
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

  AgregarDato()
  { 
    if(this.datosCant < 3)
    {
      this.datosCant++;
    }
  }
}
