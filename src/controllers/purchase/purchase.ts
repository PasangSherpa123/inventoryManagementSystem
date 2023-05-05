import { RandomUUIDOptions } from "crypto";
import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface PurchaseObjectInterface {
  item_id: string;
  quantity: number;
  unit_id: string;
  rate: number;
  discount_amount: number;
  tax_amount: number;
}
interface PurchaseInterface{
    purchase_invoice_id:string,
    purchases:PurchaseObjectInterface[],
}
// @route    POST /api/v1/purchase
// @desc     Create a purchase
// @access   Private
const createPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
      purchase_invoice_id,
      purchases
  }: PurchaseInterface = req.body;
  try {
    const { error } = validatePurchaseObjectData(req.body);
    if (error) {
        console.log(error);
        return res.status(400).send(error.details[0].message);
    }
    const { rows } = await client.query("SELECT purchase_invoice_id FROM purchaseInvoice WHERE purchase_invoice_id= $1",[purchase_invoice_id]);
    console.log(rows[0]);
    if(rows.length == 0){
      return res.status(404).send("Purchase Invoice is not created yet!!!!");
    }
    let datas = [];
    for(let i:number = 0;i<purchases.length; i++){
      const {
        item_id,
        quantity,
        unit_id,
        rate,
        discount_amount,
        tax_amount
      } = purchases[i];
      try {
        const {rows} = await client.query("SELECT item_id FROM item WHERE item_id = $1",[ item_id]);
        if(rows.length == 0){
          return res.status(404).send("This item is not created yet!!!!");
        }
        
      } catch (error) {
        next(error)
      }
      try {
        const {rows} = await client.query("SELECT unit_id FROM unit WHERE unit_id = $1",[unit_id]);
        if(rows.length == 0){
          return res.status(404).send("This unit is not created yet!!!!");
        } 
      } catch (error) {
        next(error)
      }
      const {rows} = await client.query("INSERT INTO purchase(quantity,rate,discount_amount,tax_amount,purchase_invoice_id, item_id, unit_id) VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING quantity, rate,discount_amount, tax_amount, purchase_invoice_id",[quantity, rate, discount_amount, tax_amount,purchase_invoice_id, item_id, unit_id]);
      console.log(rows[0]);
      if(rows.length > 0){
        datas.push(rows[0]);
      }
    }
    res.status(200).json({
      success:true,
      data:datas
    })
   
  } catch (err) {
    next(err);
  }
};


const validatePurchaseObjectData = (data: PurchaseInterface): any => {
    let purchase = Joi.object().keys({
        item_id: Joi.string().required(),
        quantity:Joi.number().required().default(0),
        unit_id:Joi.string().required(),
        rate:Joi.number().required(),
        discount_amount:Joi.number().required(),
        tax_amount: Joi.number().required()
      });
    const schema = Joi.object({
      purchase_invoice_id: Joi.string().min(4).max(150).required(),
      purchases:Joi.array().items(purchase)
    });
  
    return schema.validate(data);
  };

export { createPurchase };
