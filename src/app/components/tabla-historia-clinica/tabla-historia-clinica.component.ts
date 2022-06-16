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
  // @ViewChild('tabla', {static: true}) element!: ElementRef<HTMLImageElement>;

  constructor(public userService:UserService) 
  { 
  }

  ngOnInit(): void {
  }

  // generatePDF() {  
  //   html2canvas(this.element.nativeElement).then((canvas)=>{
  //     const imgData = canvas.toDataURL('image/jpeg');
  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //     });
  //     const imageProps = pdf.getImageProperties(imgData);
  //     const pdfw = pdf.internal.pageSize.getWidth();
  //     const pdfh = (imageProps.height* pdfw)/ imageProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);
  //     pdf.output('dataurlnewwindow');
  //   })
  // } 
}
