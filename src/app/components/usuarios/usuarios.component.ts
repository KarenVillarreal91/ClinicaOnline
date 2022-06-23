import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';
import { Workbook } from 'exceljs';
const ExcelJS = require('exceljs');

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  historia:any;
  pacientes:Array<any> = [];
  turnos:Array<any> = [];
  turnosExcel:Array<any> = [];

  constructor(public userService:UserService) 
  { 
    if(this.userService.EsAdmin())
    {
      this.pacientes = this.userService.pacientes;
    }
    else
    {
      for(let pac of this.userService.pacientes)
      {
        for(let hist of pac.historiaClinica)
        {
          if(hist.especialista == this.userService.userLogueado.dni)
          {
            this.pacientes.push(pac);
            break;
          }
        }
      }
    }
  }

  ngOnInit(): void {}

  SeleccionarPaciente(e:any)
  {
    this.historia = e;

    let turnosSub = this.userService.GetColeccion('turnos').subscribe((data)=>{
      this.turnos = [];

      for(let turno of data)
      {
        for(let turnoId of e.turnos)
        {
          if(turnoId == turno.id)
          {
            this.turnosExcel.push(turno);

            if(turno.estado == 'Finalizado')
            {
              this.turnos.push(turno);
              break;
            }
          } 
        }
      }

      if(!this.userService.userLogueado.especialidad)
      {
        this.ExcelTurnos(e.nombre + '-' + e.apellido);
      }

      turnosSub.unsubscribe();
    });
  }

  ExcelTurnos(paciente:string)
  {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Turnos');
    let header = ["Fecha", "DNI Paciente", "Especialidad", "DNI Especialista", "Estado", "Comentario Esp", "Comentario Pac"];
    
    sheet.addRow(header);

    for(let turno of this.turnosExcel)
    {
      let fila = [turno.fecha, turno.paciente, turno.especialidad, turno.especialista, turno.estado, turno.comentario, turno.comentarioPaciente];      

      sheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data : any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fileSaver.saveAs(blob, `Turnos-${paciente}.xlsx`);
    });
  }

  ExcelUsuarios()
  {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Usuarios');
    let header = ["Tipo", "Nombre", "Apellido", "DNI", "Edad", "Correo", "Obra social", "Especialidad"];
    
    sheet.addRow(header);

    let usuarios = this.userService.pacientes.concat(this.userService.especialistas);

    for(let usuario of usuarios)
    {
      let fila;

      if(usuario.especialidad)
      {
        let especialidad = usuario.especialidad[0];

        for(let i = 1; i < usuario.especialidad.length; i++)
        {
          especialidad += `, ${usuario.especialidad[i]}`;
        }

        fila = ['Especialista', usuario.nombre, usuario.apellido, usuario.dni, usuario.edad, usuario.email, ' ', especialidad];
      }
      else
      {
        fila = ['Paciente', usuario.nombre, usuario.apellido, usuario.dni, usuario.edad, usuario.email, usuario.obra, ' '];
      }
      

      sheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data : any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fileSaver.saveAs(blob, 'Clinica Online-Usuarios.xlsx');
    });
  }
}
