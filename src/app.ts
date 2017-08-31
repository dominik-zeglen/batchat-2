import Server from './res/server';

let app = new Server(8000);
app.init().listen();
