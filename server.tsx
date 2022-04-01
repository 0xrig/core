/**
 * Copyright (c) 2022 0xrig by Organik, Inc.
 * Private Crypto Phone built on Polygon.
 * 0xrig Server runs on the port 3000.
 */
 var core0x = require("./0xrig/core.tsx");
 // core0x = (0xrig Core Module)
 const Fastify = require("fastify");
 const fastify = Fastify();
 fastify.register(require('fastify-cors'), {
    origin: true
})  
fastify.register(require('fastify-formbody'));
fastify.post('/', async function(req, reply){
    reply.send({
        method: "POST",
        data: req.body,
        message: 'Unsupported method. POST',
        userAgent: req.headers["user-agent"]
    })
})
fastify.get('/', async function(req, reply){
    reply.send(core0x.defaultRequest(req));
})
/**
 * Core Features.
 */
 fastify.get('/api/:endpoint', async function(req, reply){
    reply.send(core0x.apiRequest(req));
    // All API logic is inside this function on core0x.
 })
 fastify.get('/0xrig/:endpoint', async function(req, reply){
    reply.send(core0x.rigRequest(req));
    // All API logic is inside this function on core0x.
 })
/**
 * Create server on PORT.
 */
fastify.listen(core0x.PORT(), (err) => {
    if(err) throw err;
    console.log(`🟢 0xrig: Server is online and listening on ${fastify.server.address().port}`)
})