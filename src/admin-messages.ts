export namespace AdminMessage{
  export const welcome=(username:string)=>{
    return `${username}, Добро пожаловать в чат движения "За прямую демократию"
    
    Подробнее о движении Вы можете узнать, клинкув по кнопке под этим сообщением.
    
    (В открывшемся окне чата с ботом, нажмите кнопку "Запустить" в нижней части окна.)
    `
  }

  export const botinfo=()=>{
    return `<b>Бот - руководство пользователя.</b>
    Чтобы открыть руководство, кликните кнопку под этим сообщением.
    В открывшемся окне чата с ботом, нажмите кнопку "Запустить" в нижней части окна.
    `
  }

  export const tagContentEmpty=(tag:string)=>{
    return `<b>Посты с тегом ${tag} отсутствуют.</b>
    `
  }

  export const viewPager=(total:number,current:number,pages:number)=>{
    return `${current} из ${pages} (${total})`
  }
}
