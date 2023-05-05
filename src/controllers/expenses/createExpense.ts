import express, { Request, Response, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface ExpenseObjectInterface{
    type_of_expense:string;
}

// @route    POST /api/v1/payment/purchase
// @desc     Create a purchase payment
// @access   Private
const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const {type_of_expense}: ExpenseObjectInterface = req.body;
    try {
        const {error} = validateCreateExpenseData(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        try {
            const { rows } = await client.query("SELECT * FROM expenses WHERE type_of_expense=$1 AND user_id=$2", [
                type_of_expense,
                req.user.user_id
              ]);
              if (rows.length > 0) {
                return res.status(404).send("Expense with this name already exists!");
              }
        } catch (error) {
            next(error);
        }
        try {
            const { rows } = await client.query(
                "INSERT INTO expenses(type_of_expense,user_id) VALUES($1,$2) RETURNING type_of_expense",
                [type_of_expense, req.user.user_id]
              );
              let expense= rows[0];
            res.status(201).json({
                success: true,
                expense: expense
          });

        } catch (error) {
            next(error);
        }
        } catch (error) {
            next(error);
        }
};

const validateCreateExpenseData = (data: ExpenseObjectInterface): any => {
    const schema = Joi.object({
        type_of_expense: Joi.string()
        .min(3)
        .max(150)
        .required(),
      });
    
      return schema.validate(data);
};

export { createExpense };