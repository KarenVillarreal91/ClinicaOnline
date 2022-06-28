import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPresionar]'
})
export class PresionarDirective {

  constructor(private element : ElementRef) 
  { 
    element.nativeElement.style.transform = ("none");
  }

  cambiarEscala(escala:string)
  {
    this.element.nativeElement.style.transform = (escala);
  }

  @HostListener('click') onClick() 
  {
    this.cambiarEscala("scale(0.95)");

    setTimeout(() => {
      this.cambiarEscala("none"); 
    }, 200);
  }
}
