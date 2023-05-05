import { RandomUUIDOptions } from "crypto";
import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface ItemObjectInterface {
  unit_type: string;
  price: number;
  purchase_cost: number;
  discount: number;
  small: boolean;
  currentData: number;
  incomingData: number;
}

// @route    POST /api/v1/unit/:item_id
// @desc     Create a item
// @access   Private
const createUnit = async (req: Request, res: Response, next: NextFunction) => {
  const {
    unit_type,
    price,
    purchase_cost,
    discount,
    currentData,
    incomingData,
  }: ItemObjectInterface = req.body;
  try {
    const { error } = validateItemData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { rows } = await client.query(
      "SELECT item_name FROM item WHERE item_id=$1",
      [req.params.item_id]
    );
    if (rows.length == 0) {
      return res.status(404).send("Item with this id doesnot exists!");
    }
    try {
      const { rows } = await client.query(
        "SELECT unit_type FROM unit WHERE item_id=$1 AND unit_type=$2",
        [req.params.item_id, unit_type]
      );
      if (rows.length > 0) {
        return res.status(400).send("Unit with this type already exists");
      }
      try {
        let updateOrNot: boolean = currentData > incomingData ? false : true;
        const { rows } = await client.query(
          "INSERT INTO unit(unit_type,price,add_quantity, incoming_data, purchase_cost, discount, item_id, updateTable) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
          [
            unit_type,
            price,
            currentData,
            incomingData,
            purchase_cost,
            discount,
            req.params.item_id,
            updateOrNot,
          ]
        );
        let unit = rows[0];
        res.status(201).json({
          success: true,
          data: unit,
        });
      } catch (err) {
        next(err);
      }
    } catch (error) {
      next(error);
    }
  } catch (err) {
    next(err);
  }
};
const validateItemData = (data: ItemObjectInterface): any => {
  const schema = Joi.object({
    unit_type: Joi.string()
      .min(3)
      .max(150)
      .regex(/^[a-zA-Z0-9]+$/)
      .required(),
    price: Joi.number().default(0),
    incomingData: Joi.number().default(0),
    currentData: Joi.number().default(0),
    purchase_cost: Joi.number().default(0),
    discount: Joi.number().default(0)
  });

  return schema.validate(data);
};

export { createUnit };
