const express = require("express")
const app = express();
const { Server } = require('socket.io');
const connectToDatabase = require("./database");
const Book = require("./model/bookModel");

connectToDatabase();
const port = 4000;
const server = app.listen(4000, () => {
    console.log("listening on port " + port)
});

const io = new Server(server)


io.on("connection", (socket) => {
    console.log(`socket is connected to id: ${socket.id} `);

    //Add Books
    socket.on('addBook', async (data) => {
        try {
            if (data) {
                const { bookName, bookPrice } = data;
                const bookData = await Book.create({
                    bookName,
                    bookPrice
                })
                // socket.emit('addBook', bookData)
                socket.emit('response', {
                    status: 200,
                    message: "Book added successfully",
                    data: bookData
                })
                // console.log(bookData)
            }
        } catch (error) {
            socket.emit('error', {
                status: 500,
                message: "something went wrong"
            })
        }
    })


    // Get Books
    socket.on('getBooks', async () => {
        try {
            const allBooks = await Book.find()
            // console.log(allBooks)
            io.to(socket.id).emit("response", {
                status: 200,
                message: "Books Found successfully",
                data: allBooks
            })
        } catch (error) {
            socket.emit('error', {
                status: 500,
                message: "something went wrong"
            })
        }
    })

    //Update Books
    socket.on('updateBooks', async (data) => {
        try {
            if (data) {
                const { bookName, bookPrice, bookId } = data;
                const updateBookData = await Book.findByIdAndUpdate(bookId, {
                    bookName,
                    bookPrice,
                }, {
                    new: true
                })
                socket.emit('response', {
                    status: 200,
                    message: "Book Updated successfully",
                    data: updateBookData
                })
            }
        } catch (error) {
            socket.emit('error', {
                status: 500,
                message: "something went wrong"
            })
        }
    })

    //Delete Book
    socket.on("deleteBooks", async (data) => {
        try {
            if (data) {
                const { bookId } = data;
                await Book.findByIdAndDelete(bookId)
                socket.emit('response', {
                    status: 200,
                    message: "Book deleted successfully",
                    data: deletedBook
                })
            }
        } catch (error) {
            socket.emit('error', {
                status: 500,
                message: "something went wrong"
            })
        }
    })


    // socket.on('sendData', (data) => {
    //     if (data) {
    //         socket.emit("response", {
    //             Message: "Thanks for sending data"
    //         })
    //     }
    // })

    // socket.on('sendData', (data) => {
    //     if (data) {
    //         io.to(socket.id).emit("response", {
    //             Message: "Thanks for sending data"
    //         })
    //     }
    // })

    // socket.on("message", (data) => {
    //     if (data) {
    //         io.to(socket.id).emit("response", `${data}`)
    //     }
    // })
});




