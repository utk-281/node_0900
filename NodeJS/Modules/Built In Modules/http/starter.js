//! http -> hyper text transform protocol
//? this is a built-in module, through which we can create servers
//! http defines a set of rules (methods)

//! fetch --> get()
//! data send to server -> post()
//! to update any data -> patch(), put()
//! to delete any data -> delete()
//? statusCodes
//? content-type...
//? .....

// ~ steps to create a http server
//? 1) import http
//? 2) create a server using createServer()
//? 3) inside createServer, pass a callback function
//? 4) assign a port number using listen(), inside this first argument is port number and second optional argument is callback function, which will run after the server has started
//? 5) inside createServer callback, pass two arguments 1) req 2) res

import http from "node:http";
// console.log("http: ", http);

http
  .createServer((req, res) => {
    //~ ================ req=====================
    //! req -> req readable stream object in majority contains properties (like url, cookies, body, query, params, etc...)
    // console.log("req url: ", req.url);
    // console.log("req method: ", req.method);

    //~ ================ res=====================
    //! res -> res writeable stream object in majority contains methods (like end, write, writeHeader etc...)
    // console.log("res: ", res);
    //? write() is used to display something on the UI.
    // res.write("this is from write()");
    // res.write("this another chunk");
    //? end() is used to close the req-res cycle.
    // res.end();
    // res.write("this is from write()"); //? this is wrong -> cannot write after ending the streams
    //! ================ res.end() ===================
    res.end("this from end()"); //? this will end the req- res cycle (this will denote that no more data is there to write on writeable stream)
    //? and end() will display the data in the UI
  })
  .listen(9000, (err) => {
    if (err) console.log("problem occurred while starting a server");
    console.log("server running at port 9000");
  });

//? open browser and type localhost:portNumber
//? after every modification, we need to restart the server to see the changes
//? to kill the server press ctrl + c on the terminal
