import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface PurchaseInvoiceObjectInterface {
  bill_no:string,
  supplier_id:string
}
// @route    POST /api/v1/purchaseInvoice
// @desc     Create a purchase invoice
// @access   Private
const createPurchaseInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const {
    bill_no,
    supplier_id
  }: PurchaseInvoiceObjectInterface = req.body;
  try{
    const { error } = validatePurchaseInvoiceData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const { rows } = await client.query("SELECT * FROM supplier WHERE supplier_id=$1 AND user_id=$2", [
            supplier_id,
            req.user.user_id
          ]);
          if (rows.length <= 0) {
            return res.status(404).send("Supplier with this id doesnot exists!");
          }
          try {
            const { rows } = await client.query(
              "INSERT INTO purchaseInvoice(bill_no,supplier_id, user_id) VALUES($1,$2,$3) RETURNING bill_no,purchase_invoice_id",
              [bill_no, supplier_id, req.user.user_id]
            );
            console.log(rows[0]);
            let purchaseInvoice= rows[0];
            res.status(201).json({
                success: true,
                purchaseInvoice: purchaseInvoice
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

const validatePurchaseInvoiceData = (data: PurchaseInvoiceObjectInterface): any => {
  const schema = Joi.object({
    bill_no: Joi.string().min(0).max(150).required(),
    supplier_id: Joi.string()
    .min(10)
    .max(150)
    .regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/)
    .required(),
  });

  return schema.validate(data);
};

   

export {
  createPurchaseInvoice
}