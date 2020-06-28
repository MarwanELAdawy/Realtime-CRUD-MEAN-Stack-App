var express = require("express");
var router = express.Router;
var app = express();
var server = require("http").createServer(app);
var io = require("socketio")(server);
var Sales = require("../models/Sales.js");

// socket io
io.on("connection",(socket)=>{
    socket.on('newData',(data)=>{
        io.emit('new-data', { data: data });
    });
    socket.on('updatedata', function (data) {
        io.emit('update-data', { data: data });
    });
});

//list data 
router.get('/', (req, res)=>{
    Sales.find((err, sales)=>{
        if (err) 
            return next(err);
        res.json(sales);
    });
});

router.get('/itemsales',(req, res, next)=>{
    Sales.aggregate([
        {
            $group: { 
                _id: { itemId: '$itemId', itemName: '$itemName' }, 
                totalPrice: {
                    $sum: '$totalPrice'
                }
            }
        },
        { $sort: {totalPrice: 1} }
    ],(err, sales)=>{
        if (err) 
            return next(err);
        res.json(sales);
    });
});

// get data by id
router.get('/:id',(req, res, next)=>{
    Sales.findById(req.params.id,(err, sales)=>{
        if (err) 
            return next(err);
        res.json(sales);
    });
});
  
// post data
router.post('/',(req, res, next)=>{
    Sales.create(req.body,(err, sales)=>{
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    });
});
  
// put data
router.put('/:id',(req, res, next)=>{
    Sales.findByIdAndUpdate(req.params.id, req.body,(err, sales)=>{
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    });
});
  
// delete data by id
router.delete('/:id',(req, res, next)=>{
    Sales.findByIdAndRemove(req.params.id, req.body,(err, sales)=>{
        if (err) 
            return next(err);
        res.json(sales);
    });
});

server.listen(4000);