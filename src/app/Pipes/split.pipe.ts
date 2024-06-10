import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(text: string, delimiter: string): Array<string> {
    return text.split(delimiter);
  }

}
