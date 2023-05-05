import { RandomUUIDOptions } from "crypto";
import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface SalesObjectInterface {
  item_id: string;
  quantity: number;
  unit_id: string;
  rate: number;
  discount_amount: number;
  tax_amount: number;
}
interface SalesInterface{
    sales_invoice_id:string,
    sales:SalesObjectInterface[],
}
// @route    POST /api/v1/sales
// @desc     Create a Sales
// @access   Private
const createSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
      sales_invoice_id,
      sales
  }:SalesInterface = req.body;
  try {
    const { error } = validateSalesObjectData(req.body);
    
    if (error) {
        console.log(error);
        return res.status(400).send(error.details[0].message);
    }
    const { rows } = await client.query("SELECT sales_invoice_id FROM salesInvoice WHERE sales_invoice_id= $1",[sales_invoice_id]);
    console.log(rows[0]);
    if(rows.length == 0){
      return res.status(404).send("Sales Invoice is not created yet!!!!");
    }
    let datas = [];
    for(let i:number = 0;i<sales.length; i++){
      const {
        item_id,
        quantity,
        unit_id,
        rate,
        discount_amount,
        tax_amount
      } = sales[i];
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
      const {rows} = await client.query("INSERT INTO sales(quantity,rate,discount_amount,tax_amount,sales_invoice_id, item_id, unit_id) VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING quantity, rate,discount_amount, tax_amount, sales_invoice_id",[quantity, rate, discount_amount, tax_amount,sales_invoice_id, item_id, unit_id]);
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


const validateSalesObjectData = (data: SalesInterface): any => {
    let sale = Joi.object().keys({
        item_id: Joi.string().required(),
        quantity:Joi.number().required().default(0),
        unit_id:Joi.string().required(),
        rate:Joi.number().required(),
        discount_amount:Joi.number().required(),
        tax_amount: Joi.number().required()
      });
    const schema = Joi.object({
      sales_invoice_id: Joi.string().min(4).max(150).required(),
      sales:Joi.array().items(sale)
    });
  
    return schema.validate(data);
  };

export { createSales };
