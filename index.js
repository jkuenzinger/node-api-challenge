

const server = require('./server.js')

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`listening to port ${port}`)
})