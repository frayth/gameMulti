export interface QuestionModel {
  id: number;
  question: string;
  answers: {
    id: number;
    value: string;
  }[];
  category: string;
  difficulty: number;
  response: number;
  descriptionResponse: string;
}
