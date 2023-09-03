import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { BasicDetail, Category } from './data.models';
import { HighlightPipe } from './highlight.pipe';

@Directive({
  selector: '[search]',
})
export class SearchDirective {
  @Input() inputElementId: string = '';
  @Input() listElementId: string = '';
  @Input() classToApply: string = '';
  @Input() data: Category[] | undefined | BasicDetail[] = [];
  @Output() selected = new EventEmitter<Category | BasicDetail>();

  query: string = '';
  private dropdownList: HTMLUListElement;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private highlight: HighlightPipe
  ) {
    this.dropdownList = this.renderer.createElement('ul');
    this.renderer.addClass(this.dropdownList, 'dropdown-list');
    this.renderer.appendChild(
      this.elementRef.nativeElement.parentNode,
      this.dropdownList
    );
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this.query = value;
    this.resetSearchValues();
  }

  @HostListener('focus')
  onFocus(): void {
    this.resetSearchValues();
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.clearSearchResults();
    }
  }

  resetSearchValues(): void {
    this.displayResults(this.filterResults(this.query));
  }

  displayResults(results: Category[] | BasicDetail[] | undefined): void {
    this.clearSearchResults();
    results?.forEach((result: Category | BasicDetail) => {
      const li = this.renderer.createElement('li');
      this.renderer.addClass(li, 'list-style-none');
      this.renderer.setProperty(
        li,
        'innerHTML',
        this.highlight.transform(result, this.query)
      );
      this.renderer.listen(li, 'click', () => {
        result.name = result.name.replace(/(<strong>|<\/strong>)/gim, '');
        this.query = result.name;
        this.clearSearchResults();
        this.selected.emit(result);
        this.renderer.setProperty(
          this.elementRef.nativeElement,
          'value',
          this.query
        );
      });
      this.renderer.appendChild(this.dropdownList, li);
    });
  }

  filterResults(query: string): (Category | BasicDetail)[] {
    return (this.data || []).filter((item: Category | BasicDetail) => {
      item.name = item.name.replace(/(<strong>|<\/strong>)/gim, '');
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  clearSearchResults(): void {
    this.dropdownList.replaceChildren('');
  }
}
