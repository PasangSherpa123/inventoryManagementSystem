import express, { Request, Response, NextFunction } from "express";


import Joi from "joi";
import client from "../../database";

interface SalesPaymentObjectInterface {
  payment_method_id: string;
  amount: string;
  reference: string;
  sales_invoice_id: string;
  amountReturn:string;
}
interface SalesPaymentInterface{
  salesPayment: SalesPaymentObjectInterface[];
}
// @route    POST /api/v1/payment/sales
// @desc     Create a sales payment
// @access   Private
const createSalesPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {salesPayment }: SalesPaymentInterface = req.body;
 
  try {
    const { error } = validateSalesPaymentData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    for(let i:number = 0; i< salesPayment.length; i++){
      const {
        payment_method_id,
        amount,
        reference,
        sales_invoice_id,
        amountReturn
      } = salesPayment[i];
      try {
        const { rows } = await client.query(
          "SELECT * FROM paymentMethod WHERE payment_method_id=$1 AND user_id=$2",
          [payment_method_id, req.user.user_id]
        );
        if (rows.length <= 0) {
          return res.status(404).send("Payment with this id doesnot exists!");
        }
      } catch (error) {
        next(error);
      }
      try {
        const { rows } = await client.query(
          "SELECT * FROM salesInvoice WHERE sales_invoice_id=$1 AND user_id=$2",
          [sales_invoice_id, req.user.user_id]
        );
        if (rows.length <= 0) {
          return res.status(404).send("Sales Invoice with this id doesnot exists!");
        }
    } catch (error) {
        next(error);
      }
      try {
        const { rows } = await client.query(
          "INSERT INTO salesPayment(reference,amount,payment_method_id, sales_invoice_id, amount_return) VALUES($1,$2,$3,$4, $5) RETURNING payment_method_id,sales_payment_id",
          [reference, amount, payment_method_id, sales_invoice_id, amountReturn]
        );
        console.log(rows[0]);
        let salesPayment = rows[0];
        res.status(201).json({
          success: true,
          salesPayment: salesPayment
        });
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

const validateSalesPaymentData = (data: SalesPaymentObjectInterface): any => {
  let salesPayment = Joi.object().keys({
    amount:Joi.number()
    .required(),
    amountReturn:Joi.number(),
    reference:Joi.string()
    .min(0)
    .max(150)
    .required(),
    sales_invoice_id:Joi.string()
    .min(10)
    .max(150)
    .regex(
      /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/
    )
    .required(),
    payment_method_id: Joi.string()
      .min(10)
      .max(150)
      .regex(
        /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/
      )
      .required(),
  });
  const schema = Joi.object({
    salesPayment: Joi.array().items(salesPayment)
  })

  return schema.validate(data);
};

export { createSalesPayment };