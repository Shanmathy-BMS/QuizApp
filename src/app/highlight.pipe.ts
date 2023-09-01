import { Pipe, PipeTransform } from '@angular/core';
import { BasicDetail, Category } from './data.models';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(item: BasicDetail, searchText: string): string {
    if (!searchText) {
      return item.name;
    }
    item.name = this.getFormattedText(item.name, searchText);
    return item.name;
  }

  getFormattedText(item: string, query: string) {
    const re = new RegExp(`(${query})`, 'gi');
    return item.replace(re, `<strong>$1</strong>`);
  }
}
