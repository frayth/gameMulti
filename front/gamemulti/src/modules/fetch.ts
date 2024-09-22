import { userStore } from "@store/user";

export default async function useFecth (url: string, options: any) {
  const user=userStore();
  if(url.startsWith('/')){
    url = url.slice(1);
  }
  console.log('retrive data from',url)
  const urlApi= `http://109.24.163.36:5003/${url}`;
        //http://109.24.163.36:5003
      //https://quizz.api.laurisceresoli.fr
  const response = await fetch(urlApi, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: user.token || ''
    }
  });
  const data = await response.json();
  return data;
}