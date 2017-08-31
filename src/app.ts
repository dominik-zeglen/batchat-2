import Server from './server';

let app = new Server(8000);
app.init().listen();