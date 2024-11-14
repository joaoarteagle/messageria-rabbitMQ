const express = require('express');
const amqp = require('amqplib');
const e = require('express');


const app = express();
app.use(express.json());


let channel, connection;



async function connectRabbitMQ(){
    try{
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('messages');
    console.log("Conectado ao RabitMQ (Produtor)");
}catch(e){
    console.error("Erro ao conectar: ", e);

}
}



app.post('/send', async(req, res) =>{
    const {message} = req.body;

    if(!message){
        return res.status(404).send("Mensagem é Obrigatória");
    }

    try{
        channel.sendToQueue('messages', Buffer.from(message));
        console.log(`Mensagem enviada: ${message}`);
        return res.status(200).send("Mensagem enviada com sucesso");

    }catch(e){
        console.log(`Erro ao enviar mensagem:`, e);
        return res.status(500).send("Erro ao enviar mensagem");
    }
});


connectRabbitMQ().then(()=>{
    app.listen(3000, ()=>{
        console.log("Producer rodando na PORTA 3000");
    });
}).catch((error) =>{
    console.log(`Error ao iniciar Servidor:`, error);
});