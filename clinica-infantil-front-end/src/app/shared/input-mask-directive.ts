import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputMask]',
  standalone: true
})
export class InputMaskDirective {
  // A string da máscara (ex: '00.000.000-0' para RG)
  @Input('appInputMask') mask: string = '';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;
    // Remove todos os caracteres que não são dígitos
    const value = input.value.replace(/\D/g, '');
    let maskedValue = '';
    let maskIndex = 0;
    let valueIndex = 0;

    // Se não houver máscara, não faz nada
    if (!this.mask) {
      return;
    }

    // Loop para construir o valor com a máscara
    while (maskIndex < this.mask.length && valueIndex < value.length) {
      const maskChar = this.mask[maskIndex];
      const valueChar = value[valueIndex];

      // Se o caractere da máscara for '0', significa um espaço para um dígito
      if (maskChar === '0') {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        // Se não for '0', adiciona o caractere literal da máscara (ex: '.', '-')
        maskedValue += maskChar;
      }
      maskIndex++;
    }

    // Atribui o valor mascarado de volta ao input
    input.value = maskedValue;
  }
}