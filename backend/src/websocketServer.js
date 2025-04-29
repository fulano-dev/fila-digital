const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

// WebSocket Server configurado para usar o servidor HTTP
const wss = new WebSocket.Server({ noServer: true });

// Quando uma conexão for estabelecida
wss.on('connection', function connection(ws) {
  console.log('Novo cliente conectado');
  
  // A cada mensagem recebida
  ws.on('message', function incoming(message) {
    console.log('Mensagem recebida: %s', message);
  });
});

// Requisito para fazer o upgrade de protocolo para WebSocket
server.on('upgrade', (request, socket, head) => {
  // Fazendo upgrade para o WebSocket
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

module.exports = { wss };

// Usando o servidor HTTP
server.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});