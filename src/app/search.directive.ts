import {
  Directive,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { BasicDetail, Category } from './data.models';
import { HighlightPipe } from './highlight.pipe';

@Directive({
  selector: '[search]',
})
export class SearchDirective implements OnChanges {
  @Input() inputElementId: string = '';
  @Input() listElementId: string = '';
  @Input() classToApply: string = '';
  @Input() data: Category[] | undefined | BasicDetail[] = [];
  @Output() selected = new EventEmitter<Category | BasicDetail>();
  searchInput: HTMLElement | null = null;
  searchResults: HTMLElement | null = null;
  query: string = '';
  highlight: HighlightPipe;

  constructor(private renderer: Renderer2, private injector: Injector) {
    this.highlight = this.injector.get(HighlightPipe);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.highlight = this.injector.get(HighlightPipe);
    this.searchInput = document.getElementById(this.inputElementId);
    this.searchResults = document.getElementById(this.listElementId);
    this.searchInput?.addEventListener('input', () => {
      this.query = (this.searchInput as HTMLInputElement).value;
      this.resetSearchValues();
    });
    this.searchInput?.addEventListener('focus', () => {
      this.resetSearchValues();
    });
    document.addEventListener('click', (event) => {
      let isInputFocused = event.target === this.searchInput;
      //let isListFocused = this.searchResults?.contains(event.target);
      if (!isInputFocused) {
        (this.searchResults as HTMLInputElement).innerHTML = '';
      }
    });
  }

  resetSearchValues() {
    this.displayResults(this.data);
    if (this.query !== '') {
      let results = this.filterResults(this.query);
      this.displayResults(results);
    }
  }

  displayResults(results: Category[] | BasicDetail[] | undefined) {
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
      results?.forEach((result: Category | BasicDetail) => {
        let li = document.createElement('li');
        li.innerHTML = this.highlight.transform(result, this.query);
        li.addEventListener('click', () => {
          result.name = result.name.replace(/(<strong>|<\/strong>)/gim, '');
          (this.searchInput as HTMLInputElement).value = result.name;
          (this.searchResults as HTMLInputElement).innerHTML = '';
          this.selected.emit(result);
        });
        (this.searchResults as HTMLInputElement).appendChild(li);
      });
    }
  }

  filterResults(query: string) {
    let searchResult: Category[] | BasicDetail[] = [];
    this.data?.forEach((item: Category | BasicDetail) => {
      item.name = item.name.replace(/(<strong>|<\/strong>)/gim, '');
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        searchResult.push(item);
      }
    });
    return searchResult;
  }
}
