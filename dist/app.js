"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./res/server");
var app = new server_1.default(8000);
app.init().listen();
