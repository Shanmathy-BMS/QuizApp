import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap, take } from 'rxjs';
import { Difficulty, Question } from './data.models';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root',
})
export class QuizAdapterService {
  questions$!: Observable<Question[]>;

  constructor(protected quizService: QuizService) {}

  createQuiz(
    cat: number,
    difficulty: string,
    questions?: Observable<Question[]>,
    index?: number
  ): Observable<Question[]> {
    return this.quizService.createQuiz(cat, difficulty as Difficulty);
  }
  updateQuiz(
    cat: number,
    difficulty: string,
    questions: Observable<Question[]>,
    index: number
  ): Observable<Question[]> {
    return questions.pipe(
      take(1),
      switchMap((exisingQns) => {
        return this.quizService
          .createQuiz(cat, difficulty as Difficulty, true)
          .pipe(
            map((item) => {
              exisingQns[index] = item[0];
              return exisingQns;
            })
          );
      })
    );
  }
}
