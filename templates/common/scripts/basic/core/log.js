/* eslint no-console:0 */


postal.channel().subscribe("log", (data) => {

  if (data.message instanceof Error) {
    return console.error(data.message);
  }

  if (data.message) {
    console.log(data.message);
  }
});
