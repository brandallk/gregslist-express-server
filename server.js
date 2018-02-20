var express = require('express')
var server = express()
var bodyParser = require('body-parser')
var cors = require('cors')

server.set('port', process.env.PORT || 3000)

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cors())

var autos = []
var autoID = 0
function Auto(obj) {
    this.id = ++autoID
    for(var key in obj) {
        this[key] = obj[key]
    }
    autos.push(this)
}

function getByID(arr, id) {
    return arr.find( elt => elt.id == id )
}

server.get('/api/autos', (req, res, next) => {
    res.send(autos)
})

server.get('/api/autos/:id', (req, res, next) => {
    // return res.send({ reqParamsId: req.params.id })
    var id = req.params.id
    var auto = getByID(autos, id)
    if (auto) {
        return res.send(autos)
    }
    return res.status(400).send({ error: 'Invalid ID' })
})

server.post('/api/autos', (req, res, next) => {
    var auto = new Auto(req.body)
    res.send({ message: 'Successfully posted auto', data: auto })
})

server.put('/api/autos/:id', (req, res, next) => {
    var id = req.params.id
    var auto = getByID(autos, id)
    if (auto) {
        for(var prop in auto) {
            if (auto[prop] && prop !== 'id') {
                auto[prop] = req.body[prop]
            }
        }
        return res.send({ message: 'Successfully updated auto', data: auto })
    }
    return res.status(400).send({ error: 'Invalid ID' })
})

server.delete('/api/autos/:id', (req, res, next) => {
    var id = req.params.id
    var auto = getByID(autos, id)
    if (auto) {
        autos.splice(autos.indexOf(auto), 1)
        return res.send({ message: 'Successfully removed auto' })
    }
    return res.status(400).send({ error: 'Invalid ID' })
})

server.get('*', (req, res, next) => {
    res.status(404).send(`<h1>404</h1>`)
})

server.listen(server.get('port'), () => {
    console.log('Server running on port ' + server.get('port'))
})