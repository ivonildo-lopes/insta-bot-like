const ig = require('./instagram');

// this is a IFFE, Imedietely Invoked Function Expression
(async () => {

  await ig.initialize();

  await ig.login('xxxxx', 'xxxx');
  await ig.likeTagsProcess(['java','javascript','itau','brq']);

})();

