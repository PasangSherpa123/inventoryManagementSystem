import express, { Request, Response, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface PurchasePaymentObjectInterface {
  payment_method_id: string;
  amount: string;
  reference: string;
  purchase_invoice_id: string;
}

interface PurchasePaymentInterface{
  purchasePayment: PurchasePaymentObjectInterface[];
}
// @route    POST /api/v1/payment/purchase
// @desc     Create a purchase payment
// @access   Private
const createPurchasePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    purchasePayment
  }: PurchasePaymentInterface = req.body;
  try {
    const { error } = validatePurchasePaymentData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    for(let i:number = 0;i< purchasePayment.length; i++){
      const {
        payment_method_id,
        amount,
        reference,
        purchase_invoice_id
      } = purchasePayment[i];
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
        "SELECT * FROM purchaseInvoice WHERE purchase_invoice_id=$1 AND bill_no=$2",
        [purchase_invoice_id, reference]
      );
      if (rows.length <= 0) {
        return res.status(404).send("Purchase invoice with this id doesnot exists!");
      }
    } catch (error) {
      next(error);
    }
    try {
      const { rows } = await client.query(
        "INSERT INTO purchasePayment(reference,amount,payment_method_id, purchase_invoice_id, user_id) VALUES($1,$2, $3,$4,$5) RETURNING payment_method_id,purchase_payment_id",
        [reference, amount, payment_method_id, purchase_invoice_id, req.user.user_id]
      );
      console.log(rows[0]);
      let purchasePayment = rows[0];
      res.status(201).json({
        success: true,
        purchasePayment: purchasePayment
      });
    } catch (err) {
      next(err);
    }
  }
  } catch (err) {
    next(err);
  }

};

const validatePurchasePaymentData = (data: PurchasePaymentInterface): any => {
  let purchasePayment = Joi.object().keys({
    amount:Joi.number()
    .required(),
    reference:Joi.string()
    .min(0)
    .max(150)
    .required(),
    purchase_invoice_id:Joi.string()
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
    purchasePayment:Joi.array().items(purchasePayment)
  });
  return schema.validate(data);
};

export { createPurchasePayment };
