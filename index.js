const ig = require('./instagram');

// this is a IFFE, Imedietely Invoked Function Expression
(async () => {

  await ig.initialize();

  await ig.login('@insta', 'senha');
  await ig.amigos([ 'mas isso nao tira o merito do PSG' ]);
  // await ig.likeTagsProcess([ '@eduardlopes116 @kassiaramosnutri ', '@niltonlima16 @debora_victor','@ronnys_personal_trainer @jaquelinee.lima ','@michelxavier_28 @sol_xavier1993 ','@nattalialuz @kassiamramos',
  // '@paty.maciels @brunio.santiago', '@kamilalima2125 @juliana_rodrigues258 ', '@neide.maria.90038882 @israel.lopes00']);                          


})();

