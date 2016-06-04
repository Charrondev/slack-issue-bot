module.exports = (controller, bot) => {
  controller.hears(['create'], ['direct_message', 'direct_mention'], (bot, message) => {
    if (!message.text.startsWith('create')) {
      return;
    };

    const commandProps = processProps(message.text);
    checkDatabase(commandProps)
      .then(rows => {
        const reply = makePosts(rows);
        bot.reply(message, reply);
      })
  });
}

function processProps(input) {
  const options = {
    title: '',
    text: '',

  };

  const commands = input
                    .replace('list', '')
                    .trim()
                    .split('-');
  // deal with open / closed
  commands.forEach(item => {
    if (item.startsWith('closed')) options.showClosed = true;
    if (item.startsWith('open')) options.showOpen = true;
    if (item.startsWith('labels')) {
       options.labels = item.replace('labels', '')
                        .trim()
                        .split(',');
    }
    if(item.startsWith('contains')) {
      options.contains = item.replace('contains', '').trim();
    }
  });

  return options;
}
