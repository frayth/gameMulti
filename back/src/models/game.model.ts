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

export interface historyModel{
  id:number,
  historyUser:{
    id:number,
    response:number|null,
    timer:number|null,
    bonus:{
      type: "faster" | "correct" | "incorrect" | "streak" |"fasterBad";
      value: number;
  }[]
  }[]
}