export function generateKey():string{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_:.,;!?()[]{}<>+=*%&$£@#~';
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < 100; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}