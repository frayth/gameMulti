import questions from "../assets/question.json";
import { QuestionModel } from "../models/game.model";
class QuestionList {
  questions: QuestionModel[];
  themes: string[];
  constructor() {
    this.questions = questions;
    this.themes=this.getAllThemes();
  }

  getAllThemes(): string[] {
    return questions.map((question)=>{
      return question.category
    }).reduce((acc,el)=>{
      if(!acc.includes(el)){
        acc.push(el)
      }
      return acc
    },[] as string[])
  }

}



export default new QuestionList();
