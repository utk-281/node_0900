//! streams --> it is a process of sending data in continuous chunks from source to destination
//? streams uses buffer internally

//~ buffer : it is an array like structure which holds the data in binary format
//? we cannot change the size of buffer once defined (but we can define the size at start)
//? buffer will be destroyed once the operation in completed
//? buffer is a space inside memory(RAM) used by nodeJS to perform some operation
//? in case of streams, buffer size is fixed that is 16KB

//! types of streams (4)
//? 1) readable stream -> it is used to read the data in continuous chunks
//~ fs.createReadStream()

//? 2) writable stream -> it is used to write the data in continuous chunks
//~ fs.createWriteStream()

//? 3) duplex stream -> used to perform both operations simultaneously(http server)

//? 4) transform stream -> same as duplex but data can be modified (encryption, file compression, etc..)
