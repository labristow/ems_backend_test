const router = require('express').Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');

const dbConfig = require("../database");
const db = dbConfig.dbConfig();

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the DataBase');
})

router.get("/get-users", (req, res) => {
    let sql = `SELECT * FROM users`;
    db.query(sql, (err, users) => {
        if (err) {
            res.send({
                error: err,
                status: 500,
                message: "Server error. Kindly try again"
            })
        } else {
            res.send({
                success: users,
                status: 200,
                message: "Users fetched successfully"
            });
        }
    })
});

router.get("/get-expenses/:id", (req, res) => {
    let sql = `SELECT * FROM transactions WHERE user_id=${req.params.id}`;
    let categories_and_frequency = [];
    let monthly_total_expenses = [];
    db.query(sql, (err, expenses) => {
        if (err) {
            res.send({
                error: err,
                status: 500,
                message: "Server error. Kindly try again"
            })
        } else {
            // Filter unique categories
            let filtered_categories = [];
            let expenses_freq = 0;
            expenses.forEach(expense => {
                let present = false;
                filtered_categories.forEach(filtered_category => {
                    if (expense.category == filtered_category.category) {
                        present = true
                    };
                });
                if (!present) {
                    filtered_categories.push(expense);
                }
            });

            filtered_categories.forEach(categ => {
                let user_category;
                for (let index = 0; index < expenses.length; index++) {
                    const expense = expenses[index];
                    user_category = categ.category;
                    if (expense.category == user_category) {
                        expenses_freq = expenses_freq + 1;
                    }
                }
                const data = {
                    category: user_category,
                    freq: expenses_freq
                }
                categories_and_frequency.push(data)
            });

            filtered_categories.forEach(categ => {
                let user_category;

                for (let index = 0; index < expenses.length; index++) {
                    const expense = expenses[index];
                    user_category = categ.category;
                    const month_index = JSON.stringify(expenses[index].datetime).split("T")[0].split("-")[1];
                    const year_index = JSON.stringify(expenses[index].datetime).split("T")[0].split("-")[0].replace('"', "");
                    for (let index2 = 0; index2 < expenses.length; index2++) {
                        let month = JSON.stringify(expenses[index2].datetime).split("T")[0].split("-")[1];
                        let year = JSON.stringify(expenses[index2].datetime).split("T")[0].split("-")[0].replace('"', "");

                        if (month_index == (month + 1) && year_index == year) {
                            monthly_expenses.push(expenses[index2]);
                        }
                    }

                    const data = {
                        month: month_index,
                        year: year_index,
                        res: expense
                    }
                    monthly_total_expenses.push(data)
                }
                const data = {
                    category: user_category,
                    freq: expenses_freq
                }
                categories_and_frequency.push(data)
            });
        }
        let trend = [];
        categories_and_frequency.forEach(element => {
            if (element.freq > 7) {
                trend.push(element)
            }
        });
        res.send({
            "user_expenses_categories": categories_and_frequency,
            "overall_expenses_trend": trend,
            "monthly_total_expenses": monthly_total_expenses
        })
    });
});



router.get("/get-trend", (req, res) => {
    let sql = `SELECT * FROM transactions`;
    db.query(sql, (err, expenses) => {
        if (err) {
            res.send({
                error: err,
                status: 500,
                message: "Server error. Kindly try again"
            });
        } else {
            // Filter unique categories for each user
            let sql = `SELECT * FROM users`;
            let overall = [];
            let user_current;
            db.query(sql, (err, users) => {
                for (let i = 0; i < users.length; i++) {
                    let categories_and_frequency = [];
                    let user_expenses = [];
                    for (let index = 0; index < expenses.length; index++) {
                        if (expenses[index].user_id == users[i].id) {
                            user_expenses.push(expenses[index]);
                        }
                    }

                    let filtered_categories = [];
                    let expenses_freq = 0;
                    user_expenses.forEach(expense => {
                        let present = false;
                        filtered_categories.forEach(filtered_category => {
                            if (expense.category == filtered_category.category) {
                                present = true
                            };
                        });
                        if (!present) {
                            filtered_categories.push(expense);
                        }
                    });

                    filtered_categories.forEach(categ => {
                        let user_category;
                        for (let index = 0; index < user_expenses.length; index++) {
                            const expense = user_expenses[index];
                            user_category = categ.category;
                            if (expense.category == user_category) {
                                expenses_freq = expenses_freq + 1;
                            }
                        }
                        const data = {
                            category: user_category,
                            freq: expenses_freq
                        }
                        categories_and_frequency.push(data);
                    });
                    let trend = [];
                    categories_and_frequency.forEach(element => {
                        if (element.freq > 0) {
                            trend.push(element)
                        }
                    });

                    overall.push({
                        "user": user_current,
                        expenses: categories_and_frequency
                    });
                }
                
                res.send({
                    "users": users,
                    "data": overall
                });
            });
        }
    });
});

module.exports = router;