import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';

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
      data.sort((x,y)=>{
        return x.sort - y.sort;
      });

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
      this.graficoTurnoPorDia(); 
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

  doughnutChartTurnosEsp() 
  {
    let valoresPorPuntaje:Array<any> = [];
   
    for(let esp of this.especialidades)
    {
      valoresPorPuntaje.push({name: esp.nombre, y: 0});
    }
    
    this.turnos.forEach( (turno:any) => {

      for(let valor of valoresPorPuntaje)
      {
        if(turno.especialidad == valor.name)
        {
          valor.y++;
        }
      }
    });

    valoresPorPuntaje = valoresPorPuntaje.filter(e=> e.y != 0);

    const chart = Highcharts.chart('TurnoPorEsp', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      colors: ['rgb(46, 231, 108)',
      'rgb(255, 206, 86)',
      'rgb(247, 98, 98)',
      'rgb(58, 201, 255)',
      'rgb(202, 143, 255)',
      'rgb(255, 168, 188)']
      ,
      title: {
          text: 'Turnos por especialidad'
      },
      tooltip: {
          pointFormat: 'Porcentaje: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b><br>Turnos: {point.y}'
              }
          }
      },
      series: [{
          name: 'Brands',
          colorByPoint: true,
          data: valoresPorPuntaje
      }]
    } as any);
  }

  graficoTurnoPorDia()
  {
    let valoresPorPuntaje:Array<any> = [];
    let dia:any;
   
    for(let turno of this.turnos)
    {
      dia = turno.fecha.split(' ')[0];

      if(!valoresPorPuntaje.some(e=>e.name == dia))
      {
        valoresPorPuntaje.push({name: dia, y: 0});
      }
    }
    
    this.turnos.forEach( (turno:any) => {

      dia = turno.fecha.split(' ')[0];

      for(let valor of valoresPorPuntaje)
      {
        if(dia == valor.name)
        {
          valor.y++;
        }
      }
    });
    
    const chart = Highcharts.chart('TurnoPorDia', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      colors: ['rgb(46, 231, 108)',
      'rgb(255, 206, 86)',
      'rgb(247, 98, 98)',
      'rgb(58, 201, 255)',
      'rgb(202, 143, 255)',
      'rgb(255, 168, 188)']
      ,
      title: {
          text: 'Turnos por día'
      },
      tooltip: {
          pointFormat: 'Porcentaje: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>Día: {point.name}</b><br>Turnos: {point.y}'
              }
          }
      },
      series: [{
          name: 'Brands',
          colorByPoint: true,
          data: valoresPorPuntaje
      }]
    } as any);
  }
}
