import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Category,
  Difficulty,
  ApiQuestion,
  Question,
  Results,
} from './data.models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private API_URL = 'https://opentdb.com/';
  private latestResults!: Results;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http
      .get<{ trivia_categories: Category[] }>(this.API_URL + 'api_category.php')
      .pipe(map((res) => this.adapterModifyCategory(res.trivia_categories)));
  }

  adapterModifyCategory(categories: Category[]): Category[] {
    const uniqueCategory: Record<string, Category> = {};
    categories.map((category) => {
      category.isSubExists = category.name.includes(':') ? true : false;
      let uniqueCategoryTitle = category.name,
        uniqueSubCategoryTitle = '';
      if (category.isSubExists) {
        uniqueCategoryTitle = category.name.split(':')[0];
        uniqueSubCategoryTitle = category.name.split(':')[1];
      }
      uniqueCategory[uniqueCategoryTitle] = {
        ...uniqueCategory[uniqueCategoryTitle],
        ...category,
        name: uniqueCategoryTitle,
      };
      if (
        uniqueCategory[uniqueCategoryTitle].isSubExists &&
        !uniqueCategory[uniqueCategoryTitle].subCategory
      ) {
        uniqueCategory[uniqueCategoryTitle].subCategory = [];
      }
      uniqueCategory[uniqueCategoryTitle].subCategory?.push({
        id: category.id,
        name: uniqueSubCategoryTitle.trim(),
      });
    });
    return Object.values(uniqueCategory);
  }

  createQuiz(
    categoryId: number,
    difficulty: Difficulty,
    updateOneQuiz = false
  ): Observable<Question[]> {
    return this.http
      .get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=${
          updateOneQuiz ? 1 : 5
        }&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`
      )
      .pipe(
        map((res) => {
          const quiz: Question[] = res.results.map((q) => ({
            ...q,
            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() =>
              Math.random() > 0.5 ? 1 : -1
            ),
          }));
          return quiz;
        })
      );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index]) score++;
    });
    this.latestResults = { questions, answers, score };
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
}
