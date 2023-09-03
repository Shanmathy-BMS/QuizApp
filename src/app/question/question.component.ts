import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../data.models';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent {
  @Input({ required: true })
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;
  displayChangeOption = true;

  getButtonClass(answer: string): string {
    let colorCode = 'primary';
    if (!this.userAnswer) {
      if (this.currentSelection == answer) colorCode = 'tertiary';
    } else {
      colorCode = this.showQuizResultAnswers(answer);
    }
    return colorCode;
  }

  private showQuizResultAnswers(answer: string): string {
    debugger;
    if (this.correctAnswer == answer) {
      return 'tertiary';
    }
    if (this.userAnswer != this.correctAnswer && this.userAnswer == answer) {
      return 'secondary';
    }
    return 'primary';
  }

  @Output()
  change = new EventEmitter<string>();

  currentSelection!: string;

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }
}
