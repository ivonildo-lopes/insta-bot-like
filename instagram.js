const puppeteer = require('puppeteer');

const BASE_URL = 'https://instagram.com/';
const TAG_URL = 'https://www.instagram.com/p/CNn3rhUrvWC/';
const URL = 'https://www.instagram.com/p/B_h2VSApuBQ/';

const instagram = {
  
  browser: null,
  page: null,

  initialize: async () => {

    instagram.browser = await puppeteer.launch({
      headless: false,
      args: ['--lang=en-US']
    });

    instagram.page = await instagram.browser.newPage();

  },

  login: async (username, password) => {

    // entra na pagina e espera ela ser totalmente carregada
    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // espera 1s
    await instagram.page.waitFor(1000);

    // vamos selecionar o botao login do instagram
    let loginButton = await instagram.page.$x('//a[contains(text(), "Log In")]');

    // // TRY TO CLICK AT THE LOGIN BUTTON

    // wait 4sec
    await instagram.page.waitFor(4000);

    // TYPE LOGIN
    try {
      // passando o username
      await instagram.page.type('input[name="username"]', username, { delay: 50 });
    } catch(err) {
      // second attempt error
      console.log('[1]could not type username. Error: ', err);
      // try again
      try {
        // pessando o username
        await instagram.page.type('input[name="username"]', username, { delay: 50 });
      } catch(err) {
        // second attempt error
        console.log('[2]could not type username. Error: ', err);
      }
    }

    // TYPE PASSWORD
    try {
      // passando a senha
      await instagram.page.type('input[name="password"]', password, { delay: 50 });
    } catch(err) {
      // second attempt error
      console.log('[1]could not type password. Error: ', err);
      // caso de erro tente novamente
      try {
        // passando a senha
        await instagram.page.type('input[name="password"]', password, { delay: 50 });
      } catch(err) {
        // second attempt error
        console.log('[2]could not type password. Error: ', err);
      }
    }

    // clicando no botao login depois de passar o usuario e senha
    loginButton = await instagram.page.$x('//div[contains(text(), "Log In")]');
    try {
      // first attempt
      await loginButton[0].click();
    } catch(err) {
      // second attempt error
      console.log('[1]could not click to login (after username and password inserted). Error: ', err);
      // try again
      try {
        // clicando novamente caso de algum erro
        await loginButton[0].click();
      } catch(err) {
        // second attempt error
        console.log('[1]could not click to login (after username and password inserted). Error: ', err);
      }
    }

    // verifica se entrou na pagina inicial do insta procurando a casinha = icon home
    await instagram.page.waitFor(5000);
    await instagram.page.waitFor('a > svg[aria-label="Home"]');
  },

  amigos: async (tags = []) => {
     
    while(true){
      for(let tag of tags) {

        // Go to the tag page
        await instagram.page.goto(TAG_URL, { waitUntil: 'networkidle2' });
        //await instagram.page.waitFor(15000);
        await instagram.page.waitFor(5000);
  
        console.log('chegou aqui ' + tag)
        // recuperado os posts mais recentes, vai ser um array
        // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageselector-1
        
        await instagram.page.type('textarea', tag, { delay: 50 });
        let loginButton = await instagram.page.$x('//button[contains(text(), "Post")]');

        await loginButton[0].click();
        await instagram.page.waitFor(5000);
  
        
      }

    }
     // node index
  }

};

module.exports = instagram;