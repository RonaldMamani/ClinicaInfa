// src/app/shared/directives/input-mask.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputMask]',
  standalone: true
})
export class InputMaskDirective {
  @Input('appInputMask') mask: string = '';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    let maskedValue = '';
    let maskIndex = 0;
    let valueIndex = 0;

    if (!this.mask) {
      return;
    }

    while (maskIndex < this.mask.length && valueIndex < value.length) {
      const maskChar = this.mask[maskIndex];
      const valueChar = value[valueIndex];

      if (maskChar === '0') {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        maskedValue += maskChar;
      }
      maskIndex++;
    }

    input.value = maskedValue;
  }
}