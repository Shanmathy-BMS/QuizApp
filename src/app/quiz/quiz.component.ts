import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnChanges {
  @Input()
  questions: Question[] | null = [];

  @Output()
  changeQuestion = new EventEmitter<number>();
  isChangeQuestionAllowed = true;

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions']?.currentValue?.length === 5) {
      this.isChangeQuestionAllowed = true;
    }
  }
  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl('/result');
  }

  changeButtonClicked(index: number) {
    this.isChangeQuestionAllowed = false;
    this.changeQuestion.emit(index);
  }
}
