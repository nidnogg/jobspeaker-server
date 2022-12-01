const http = require('http')
const httpProxy = require('http-proxy')
const { URL }  = require('url')
// const net = require('net')
// const util = require('util')
const proxy = httpProxy.createServer()

const jobspeakerUrl = 'http://localhost:8000'
const eventsUrl = 'http://localhost:4200'
const jobspeakerPrefix = '/#'
const port = 5000

http.createServer((req, res) => {
    let target = eventsUrl
    const parsedUrl = new URL(req.url, `http://${req.headers.host}/`)
    if (parsedUrl.pathname.includes('#')) {
        console.log('beep')
    }
    if (parsedUrl.pathname.startsWith(jobspeakerPrefix)) {
        // req.url = req.url.replace('/#', '/')
        target = jobspeakerUrl
    }
    proxy.web(req, res, { target })
}).listen(port)

proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    })

    console.log(err)
    res.end(`Error on proxy ${err}`)
})

proxy.on('proxyReq', (proxyReq, req, res) => {
    // console.log(proxyReq)
    // console.log(req)
})


console.log(`Proxy running on port ${port}`)


// First try, not exactly working
// const proxy = httpProxy.createServer();

// const server = httpProxy
//   .createServer((req, res) => {
//     console.log(`Receiving reverse proxy request for: ${req.url}...`)
//     const parsedUrl = url.parse(req.url)
//     const target = parsedUrl.protocol + '//' + parsedUrl.hostname
//     proxy.web(reqr, res, { target: target, secure: false })
//   })
//   .listen(8001)

// server.on('connect', function (req, socket) {
//   util.puts('Receiving reverse proxy request for:' + req.url)

//   const serverUrl = url.parse('https://' + req.url)

//   const srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function () {
//     socket.write(
//       'HTTP/1.1 200 Connection Established\r\n' +
//         'Proxy-agent: Node-Proxy\r\n' +
//         '\r\n'
//     )
//     srvSocket.pipe(socket)
//     socket.pipe(srvSocket)
//   })
// })
