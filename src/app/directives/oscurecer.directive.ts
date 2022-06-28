import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOscurecer]'
})
export class OscurecerDirective {

  constructor(private element : ElementRef) 
  { 
    element.nativeElement.style.backgroundColor="#FFFFFF";
  }

  cambiarColor(color:string)
  {
    this.element.nativeElement.style.backgroundColor = color;
  }

  @HostListener('mouseenter') onMouseEnter() 
  {
    this.cambiarColor('#DDDDDD');
  }
  
  @HostListener('mouseleave') onMouseLeave() 
  {
    this.cambiarColor("#FFFFFF");
  }
}
