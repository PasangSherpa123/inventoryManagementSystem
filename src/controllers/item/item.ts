import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface ItemObjectInterface {
  taxable: boolean,
  item_name:string,
  quantity: number
}
// @route    POST /api/v1/item
// @desc     Create a item
// @access   Private
const createItem = async (req: Request, res: Response, next: NextFunction) => {
  const {
    taxable,
    item_name,
    quantity
  }: ItemObjectInterface = req.body;
  try{
    const { error } = validateItemData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { rows } = await client.query("SELECT * FROM item WHERE item_name=$1 AND user_id=$2", [
      item_name,
      req.user.user_id
    ]);
    
   
    if (rows.length > 0) {
      return res.status(400).send("Item with this name already exists!");
    }
    try {
      const { rows } = await client.query(
        "INSERT INTO item(taxable,item_name,quantity,user_id) VALUES($1,$2,$3,$4) RETURNING taxable,item_name,quantity",
        [taxable, item_name, quantity, req.user.user_id]
      );
      console.log(rows[0]);
      let item= rows[0];
      res.status(201).json({
          success: true,
          item: item
        });
    
    } catch (err) {
      next(err);
    }
  }
  catch (err) {
    next(err);
  }
};


const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { rows } = await client.query("SELECT item_id,taxable,item_name,quantity, category_id, company_id FROM item WHERE user_id=$1", [
      req.user.user_id
    ]);
    let item = rows;
    res.status(200).json({
      success: true,
      item: item
    });
  }
  catch (err) {
    next(err);
  }
};
const validateItemData = (data: ItemObjectInterface): any => {
  const schema = Joi.object({
    taxable: Joi.boolean().required().default(false),
    item_name: Joi.string()
      .min(3)
      .max(150)
      .regex(/^[a-zA-Z0-9]+$/)
      .required(),
    quantity: Joi.number().default(0),
  });

  return schema.validate(data);
};



export {
  createItem,
  getItems
}