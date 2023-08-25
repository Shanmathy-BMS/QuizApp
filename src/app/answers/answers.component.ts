import { Component, Input } from '@angular/core';
import { Question, Results } from '../data.models';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css'],
})
export class AnswersComponent {
  @Input()
  data!: Results;

  trackByQuestionId(questions: Question) {
    return questions.question;
  }
}
