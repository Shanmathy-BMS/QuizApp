import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasicDetail, Category, Difficulty, Question } from '../data.models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { QuizService } from '../quiz.service';
import { QuizAdapterService } from '../quiz-adapter.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizMakerComponent {
  categories$: Observable<Category[]>;
  questions$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  isQuestionChangeAllowed: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  categorySelected: Category | null = null;
  subCategorySelected: BasicDetail = {} as BasicDetail;
  searchText: string = '';
  selectedCategoryId: number = 0;

  constructor(
    protected quizService: QuizService,
    protected quizAdapterService: QuizAdapterService
  ) {
    this.categories$ = quizService.getAllCategories();
  }

  createQuiz(difficulty: string): void {
    let catId = this.getCategoryId();
    this.quizAdapterService
      .createQuiz(catId as number, difficulty as Difficulty)
      .subscribe((data) => {
        this.isQuestionChangeAllowed.next(true);
        this.questions$.next(data);
      });
  }

  changeQuestion(index: number, difficulty: string) {
    let catId = this.getCategoryId();
    this.quizAdapterService
      .updateQuiz(
        catId as number,
        difficulty as Difficulty,
        this.questions$,
        index
      )
      .subscribe((data) => {
        this.isQuestionChangeAllowed.next(false);
        this.questions$.next(data);
      });
  }

  getCategoryId() {
    return this.categorySelected?.isSubExists
      ? this.subCategorySelected.id
      : this.categorySelected?.id;
  }

  getSelectedCategory($event: Category) {
    this.categorySelected = $event;
  }

  getSelectedSubCategory($event: Category) {
    this.subCategorySelected = $event;
  }

  trackByCategoryId(category: Category) {
    return category.id;
  }
}
