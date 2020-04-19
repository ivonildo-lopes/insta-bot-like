const puppeteer = require('puppeteer');

const BASE_URL = 'https://instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

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
    let loginButton = await instagram.page.$x('//a[contains(text(), "Log in")]');

    // TRY TO CLICK AT THE LOGIN BUTTON
    try {
      // first attempt
      await loginButton[0].click();
    } catch(err) {
      // first attempt error
      console.log('[1]could not click at login button. Error: ', err);
      // try again
      try {
        // second attempt
        await instagram.page.waitFor(1000);
      } catch(err) {
        // second attempt error
        console.log('[2]could not click at login button. Error: ', err);
      }
    } 

    // wait for the navigation
    //await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });

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

  likeTagsProcess: async (tags = []) => {

    for (let i = 0; i < 3; i++) {
     
      for(let tag of tags) {

        // Go to the tag page
        await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2' });
        await instagram.page.waitFor(1000);
  
        // recuperado os posts mais recentes, vai ser um array
        // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageselector-1
        let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');
  
        //console.log(posts);
  
        // queremos pegar os 3 primeiros apenas
        for(let i = 0; i < 3; i++) {
  
          // cada post vai ser um element handler
          let post = posts[i];
  
          // clicar no post
          await post.click();
  
          // espera o modal abrir
          await instagram.page.waitFor('body[style="overflow: hidden;"]');

          /*let test = await instagram.page.$('body[style="overflow: hidden;"]');
          console.log(test);*/

          await instagram.page.waitFor(2000);
  
          // pegando o botao de like 
          let isLikable = await instagram.page.$('svg[aria-label="Like"]');
          //console.log('isLikable outside if', isLikable);
          
          // verifica se ja foi ou nao curtino
          if(isLikable) {
            console.log('isLikable inside if', isLikable);

            // ATTEMPT TO LIKE POST
            try {
              // clicar no botao curtir
              await instagram.page.click('svg[aria-label="Like"]');
            } catch(err) {
              // first attempt error
              console.log('[1]could not like post. Error: ', err);
              // try again
              try {
                // clicar no botao curtir caso de erro
                await instagram.page.click('svg[aria-label="Like"]');
              } catch(err) {
                // second attempt error
                console.log('[2]could not like post. Error: ', err);
              }
            }
          }
  
          // wait 3 segs
          await instagram.page.waitFor(3000);
  
          // CLOSE MODAL
          // let closeModalButton = await instagram.page.$x('//button[contains(text(), "Close")]');
          //console.log('closeModalButton', closeModalButton);
          try {
             await instagram.page.click('svg[aria-label="Close"]');
            // await closeModalButton[0].click();
          } catch(err) {
            // first attempt error
            console.log('[1]could not close post modal. Error: ', err);
            // try again
            try {
              // second attempt
              await closeModalButton[0].click();
            } catch(err) {
              // second attempt error
              console.log('[2]could not close post modal. Error: ', err);
            }
          }
  
          // after close modal, wait for 2 seconds, and then the next post will be clicked
          await instagram.page.waitFor(2000);
        }
  
        // wait 15 segs
        await instagram.page.waitFor(15000);
      }

    }

  }

};

module.exports = instagram;