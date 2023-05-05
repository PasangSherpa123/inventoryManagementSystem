import express, { Request, Response, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface ExpensePaymentObjectInterface{
    expense_id:string;
    amount:string;
    payment_method_id:string;
}

// @route    POST /api/v1/payment/expense
// @desc     Create a expense payment
// @access   Private
const createExpensePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const {expense_id, amount, payment_method_id}: ExpensePaymentObjectInterface = req.body;
    try {
        const {error} = validateCreateExpensePaymentData(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        try {
            const { rows } = await client.query("SELECT * FROM expenses WHERE expense_id=$1 AND user_id=$2", [
                expense_id,
                req.user.user_id
              ]);
              if (rows.length <= 0) {
                return res.status(404).send("Expense with this id does not exist!!!!");
              }
        } catch (error) {
            next(error);
        }
        try {
            const { rows } = await client.query("SELECT * FROM paymentMethod WHERE payment_method_id=$1 AND user_id=$2", [
                payment_method_id,
                req.user.user_id
              ]);
              if (rows.length <= 0) {
                return res.status(404).send("Payment method with this id does not exist!!!!");
              }
            try {
                const { rows } = await client.query(
                    "INSERT INTO expensePayment(expense_id,amount,payment_method_id) VALUES($1,$2,$3) RETURNING expense_payment_id",
                    [expense_id,amount,payment_method_id]
                  );
                  let expensePayment= rows[0];
                res.status(201).json({
                    success: true,
                    expensePayment: expensePayment
              });
    
            } catch (error) {
                next(error);
            }
            
        } catch (error) {
            next(error);
        }
        
        } catch (error) {
            next(error);
        }
};

const validateCreateExpensePaymentData = (data: ExpensePaymentObjectInterface): any => {
    const schema = Joi.object({
        expense_id:Joi.string().regex(
            /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/
          ).required(),
        amount:Joi.number().required(),
        payment_method_id:Joi.string().regex(
            /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/
          ).required(),
      });
    
      return schema.validate(data);
};

export { createExpensePayment };