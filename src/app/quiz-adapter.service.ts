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
    // .pipe(
    // map((response) => response).mergeMap(question  => questions))
  }
  updateQuiz(
    cat: number,
    difficulty: string,
    questions: Observable<Question[]>,
    index: number
  ): Observable<Question[]> {
    // return forkJoin({
    //   existing: questions,
    //   update: this.quizService.createQuiz(cat, difficulty as Difficulty, true),
    // }).pipe(
    //   map((data: { existing: Question[]; update: Question[] }) => {
    //     const updatedData = { ...data.existing };
    //     updatedData[index] = data.update[0];
    //     return updatedData;
    //   })
    // );

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
