import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface SalesInvoiceObjectInterface {
  payment_method_id:string,
  customer_id:string,
  bill_no:string
}
// @route    POST /api/v1/purchaseInvoice
// @desc     Create a purchase invoice
// @access   Private
const createSalesInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const {
    customer_id,
    bill_no,
  }: SalesInvoiceObjectInterface = req.body;
  try{
    const { error } = validateSalesInvoiceData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
      console.log("customer begins");
      if(customer_id) {
        const { rows } = await client.query("SELECT * FROM customer WHERE customer_id=$1 AND user_id=$2", [
            customer_id,
            req.user.user_id
          ]);
          if (rows.length <= 0) {
            return res.status(404).send("Customer with this id doesnot exists!");
          }
          try {
            const { rows } = await client.query(
              "INSERT INTO salesInvoice(bill_no,customer_id,user_id) VALUES($1,$2,$3) RETURNING sales_invoice_id",
              [bill_no,customer_id,req.user.user_id]
            );
            let salesInvoice= rows[0];
            res.status(201).json({
                success: true,
                salesInvoice: salesInvoice
              });
          } catch (error) {
            next(error);
          }
        }
          try {
            const { rows } = await client.query(
              "INSERT INTO salesInvoice(bill_no,user_id) VALUES($1,$2) RETURNING sales_invoice_id",
              [bill_no,req.user.user_id]
            );
            let salesInvoice= rows[0];
            res.status(201).json({
                success: true,
                salesInvoice: salesInvoice
              });
          
          } catch (err) {
            next(err);
          }
    } catch (error) {
        next(error)
    }
    
  }
  catch (err) {
    next(err);
  }
};

const validateSalesInvoiceData = (data: SalesInvoiceObjectInterface): any => {
  const schema = Joi.object({
    bill_no:Joi.string()
    .min(0)
    .max(100)
    .required(),
    customer_id: Joi.string()
    .min(0)
    .max(150)
    .required(),
  });

  return schema.validate(data);
};

   

export {
  createSalesInvoice
}