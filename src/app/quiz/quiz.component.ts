import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  @Input()
  questions: Question[] = [];

  @Output()
  changeQuestion = new EventEmitter<number>();

  @Input()
  isChangeQuestionAllowed: boolean = true;

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  showSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl('/result');
  }

  changeButtonClicked(index: number) {
    this.userAnswers[index] = '';
    this.showSubmit$.next(false);
    this.changeQuestion.emit(index);
  }

  handleAnswerSelection(answer: string, index: number) {
    this.userAnswers[index] = answer;
    if (this.userAnswers.filter((data) => data).length === 5) {
      this.showSubmit$.next(true);
    }
  }
}
