const master = require('../config/default.json');
const db = require('../models');
const fs = require("fs");
const csv = require("fast-csv");
const pathtest = require("path");
const Op = require('sequelize').Op


exports.create = async(req, res) => {

    if (req.file == undefined) {
        res.send("Please upload a CSV file!");
    } else {
        try {

            if (req.file) {
                var path = req.file.destination + "/" + req.file.filename;
                var fileLink = path.replace("./", "");
            }

            console.log(fileLink)

            let tutorials = [];
            const directoryPath = pathtest.join(__dirname, "../public/document/" + req.file.filename);
            fs.createReadStream(directoryPath).pipe(csv.parse({ headers: true }))
                .on("error", (error) => {
                    res.send(error.message)
                }).on("data", async(row) => {
                    console.log(row)
                    tutorials.push(row);
                }).on("end", async() => {
                    if (tutorials.length > 0) {

                        tutorials.forEach(async(element, key) => {
                            if (element.productname != '') {
                                var productName = await db.products.findAll({
                                    where: {
                                        name: element.productname,
                                        status: {
                                            [Op.notIn]: [master.status.delete]
                                        }
                                    }
                                })

                                if (productName.length == 0) {
                                    await db.products.create({ name: element.productname, amount: element.amount, discount: element.discount, status: master.status.active })
                                }
                                if (tutorials.length == key + 1) {
                                    res.send({
                                        note: "Records Inserted"
                                    })
                                }

                            }
                        });
                    } else {

                        res.send('No datas present in Csv')
                    }

                });
        } catch (error) {


            console.log(error);
            res.send({
                message: "Could not upload the file: " + req.file.originalname,
            });
        }
    }

}

exports.get = async(req, res) => {
    db.products.findAll({
        where: {
            status: {
                [Op.notIn]: [master.status.delete]
            }
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(data => res.send(data))
}