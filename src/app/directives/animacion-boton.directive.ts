import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAnimacionBoton]'
})
export class AnimacionBotonDirective {

  constructor(private element : ElementRef) 
  { 
    element.nativeElement.classList.add("shake-bottom");
    element.nativeElement.classList.toggle("shake-bottom");
  }


  @HostListener('mouseenter') onMouseEnter() 
  {
    this.element.nativeElement.classList.toggle("shake-bottom");

  }
  
  @HostListener('mouseleave') onMouseLeave() 
  {
    this.element.nativeElement.classList.toggle("shake-bottom");
  }

}
