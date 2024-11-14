const amqp = require('amqplib')

let channel, connection;

async function connectRabbitMQ(){
    try{

        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('messages');
        console.log("Conectado ao RabbitMQ(consumer)");


        channel.consume('messages', (msg)=>{
            if(msg !== null){
                console.log(`Mensagem Recebida: ${msg.content.toString()}`);

                channel.ack(msg);
            }
        });

    }catch(e){
        console.error("Erro ao conectar RabbitMQ(consumer): ", e);
    }
}


connectRabbitMQ();