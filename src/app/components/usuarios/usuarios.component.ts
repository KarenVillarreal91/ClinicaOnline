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
  }

  Excel()
  {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Usuarios');
    let header = ["Tipo", "Nombre", "Apellido", "DNI", "Edad", "Correo", "Obra social", "Especialidad"];
    
    sheet.addRow(header);

    let usuarios = this.userService.pacientes.concat(this.userService.especialistas);

    usuarios = usuarios.map((usuario:any)=>{
        

        return usuario;
    });

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
