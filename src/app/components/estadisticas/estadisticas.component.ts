import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {

  @ViewChild('turnosPorEsp') private turnosPorEsp !: ElementRef;
  // @ViewChild('turnosPorDia') private turnosPorDia: ElementRef;
  // @ViewChild('turnosSolicitado') private turnosSolicitado: ElementRef;
  // @ViewChild('turnosFinalizado') private turnosFinalizado: ElementRef;

  @ViewChild('informe', {static: true}) element!: ElementRef<HTMLImageElement>;

  barChart: any;
  doughnutChart: any;
  turnos:Array<any> = [];
  especialidades:Array<any> = [];
  logs:Array<any> = [];

  constructor(private userService:UserService) 
  { 
    Chart.register(...registerables);

    let sub = userService.GetColeccion('especialidades').subscribe((data)=>{
      this.especialidades = data;
      this.MostrarGraficos();
      sub.unsubscribe();
    })

    userService.GetColeccion('logs').subscribe((data)=>{
      this.logs = data;
    })
  }

  ngOnInit(): void {
  }

  MostrarGraficos()
  {
    let sub = this.userService.GetColeccion('turnos').subscribe((data)=>{
      this.turnos = data; 
      this.doughnutChartTurnosEsp();   
      sub.unsubscribe();
    });
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

  doughnutChartTurnosEsp() {

    let valoresPorPuntaje:Array<any> = [];
   
    for(let esp of this.especialidades)
    {
      valoresPorPuntaje.push({especialidad: esp.nombre, cantidad: 0});
    }
    
    this.turnos.forEach( (turno:any) => {

      for(let valor of valoresPorPuntaje)
      {
        if(turno.especialidad == valor.especialidad)
        {
          valor.cantidad++;
        }
      }
    });
    
    let labels = [];
    let data = [];

    for(let valor of valoresPorPuntaje)
    {
      labels.push(valor.especialidad);
      data.push(valor.cantidad);
    }

    this.doughnutChart = new Chart(this.turnosPorEsp.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Turnos por especialidad',
          data: data,
          backgroundColor: [
            'rgb(46, 231, 108)',
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)',
            'rgb(58, 201, 255)',
            'rgb(202, 143, 255)',
            'rgb(255, 168, 188)'
          ],
          hoverBackgroundColor: [
            'rgb(46, 231, 108, 0.5)',
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)',
            'rgb(58, 201, 255, 0.5)',
            'rgb(202, 143, 255, 0.5)',
            'rgb(255, 168, 188, 0.5)'
          ]
        }]
      }
    });
  }
}
