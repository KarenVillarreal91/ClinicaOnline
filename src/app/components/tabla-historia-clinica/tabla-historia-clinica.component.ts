import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tabla-historia-clinica',
  templateUrl: './tabla-historia-clinica.component.html',
  styleUrls: ['./tabla-historia-clinica.component.scss']
})
export class TablaHistoriaClinicaComponent implements OnInit {

  @Input() inputPaciente:any;
  @ViewChild('historiaC', {static: true}) element!: ElementRef<HTMLImageElement>;

  especialistas:Array<any> = [];
  historial:Array<any> = [];

  constructor(public userService:UserService) 
  { 
  }

  ngOnInit(): void {
    for(let esp of this.userService.especialistas)
    {
      for(let historia of this.inputPaciente.historiaClinica)
      {
        if(esp.dni == historia.especialista)
        {
          if(!this.especialistas.includes(esp))
          {
            this.especialistas.push(esp);
          }
        }
      }
    }

    this.historial = this.inputPaciente.historiaClinica;
  }

  SeleccionarEsp(esp:any)
  {
    this.historial = [];

    for(let historia of this.inputPaciente.historiaClinica)
    {
      if(esp.dni == historia.especialista)
      {
        this.historial.push(historia);
      }
    }
  }

  generatePDF() {  
    html2canvas(this.element.nativeElement).then((canvas)=>{
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF({
        orientation: 'portrait',
      });
      const imageProps = pdf.getImageProperties(imgData);
      const pdfw = pdf.internal.pageSize.getWidth();
      const pdfh = (imageProps.height* pdfw)/ imageProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);
      pdf.output('dataurlnewwindow');
    })
  } 
}
