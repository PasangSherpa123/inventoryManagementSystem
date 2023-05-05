
--Trigger to update item when inserting on purchase
CREATE OR REPLACE FUNCTION purchase_after_insert_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE item SET quantity = quantity + (SELECT add_quantity FROM unit WHERE unit_id = new.unit_id) * new.quantity 
       WHERE item_id = new.item_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER purchase_after_insert
     AFTER INSERT ON purchase
     FOR EACH ROW
     EXECUTE PROCEDURE purchase_after_insert_function();


--Trigger to update item table after insert in sales table 

CREATE OR REPLACE FUNCTION sales_after_insert_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE item SET quantity = quantity - (SELECT add_quantity FROM unit WHERE unit_id = new.unit_id) * new.quantity 
       WHERE item_id = new.item_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER sales_after_insert
     AFTER INSERT ON sales
     FOR EACH ROW
     EXECUTE PROCEDURE sales_after_insert_function();



--Trigger to update supplier table after insert in purchase table
CREATE OR REPLACE FUNCTION supplier_after_insert_purchase_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE supplier SET amount_to_be_paid = amount_to_be_paid + new.quantity * new.rate 
       WHERE supplier_id = (SELECT supplier_id FROM purchaseinvoice WHERE purchase_invoice_id = (SELECT purchase_invoice_id FROM purchase WHERE purchase_id = new.purchase_id));
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER supplier_after_insert_purchase
     AFTER INSERT ON purchase
     FOR EACH ROW
     EXECUTE PROCEDURE supplier_after_insert_purchase_function();



--Trigger to update customer table after insert in sales table
CREATE OR REPLACE FUNCTION customer_after_insert_sales_function() RETURNS TRIGGER AS
$BODY$
BEGIN
IF (SELECT customer_id FROM salesinvoice WHERE sales_invoice_id = (SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id)) IS NOT NULL THEN
    UPDATE customer SET amount_to_be_received = amount_to_be_received + new.quantity * new.rate 
       WHERE customer_id = (SELECT customer_id FROM salesinvoice WHERE sales_invoice_id = (SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id));
           RETURN new; 
     ELSE RETURN new;
     END IF;

END;
$BODY$
language plpgsql;

CREATE TRIGGER customer_after_insert_sales
     AFTER INSERT ON sales
     FOR EACH ROW
     EXECUTE PROCEDURE customer_after_insert_sales_function();



--Trigger to update salesCredit table after insert in sales table if the sales_invoice_id has no customer id 
CREATE OR REPLACE FUNCTION sales_credit_after_insert_sales_function() RETURNS TRIGGER AS
$BODY$
BEGIN
IF (SELECT customer_id FROM salesInvoice WHERE sales_invoice_id = (SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id)) IS NULL THEN
     IF(SELECT sales_credit_id FROM salesCredit WHERE sales_invoice_id = (SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id)) IS NOT NULL THEN
    UPDATE salesCredit SET amount = amount + new.quantity * new.rate 
       WHERE sales_invoice_id = (SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id);
           RETURN new; 
     ELSE INSERT INTO salesCredit(amount,sales_invoice_id,user_id) VALUES(new.quantity * new.rate,(SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id),(SELECT user_id FROM salesInvoice WHERE sales_invoice_id = (SELECT sales_invoice_id FROM sales WHERE sales_id = new.sales_id)));
     RETURN new;
     END IF;
     ELSE RETURN new;
     END IF;
END;
$BODY$
language plpgsql;

CREATE TRIGGER sales_credit_after_insert_sales
     AFTER INSERT ON sales
     FOR EACH ROW
     EXECUTE PROCEDURE sales_credit_after_insert_sales_function();

--Trigger to update unit table after insert in purchase table
CREATE OR REPLACE FUNCTION unit_after_insert_purchase_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE unit SET purchase_cost = new.rate
       WHERE unit_id = new.unit_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER unit_after_insert_purchase
     AFTER INSERT ON purchase
     FOR EACH ROW
     EXECUTE PROCEDURE unit_after_insert_purchase_function();

--Trigger to update unit table after insert in sales table
CREATE OR REPLACE FUNCTION unit_after_insert_sales_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE unit SET price = new.rate
       WHERE unit_id = new.unit_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER unit_after_insert_sales
     AFTER INSERT ON sales
     FOR EACH ROW
     EXECUTE PROCEDURE unit_after_insert_sales_function();

--Trigger to update item table after insert in unit table
CREATE OR REPLACE FUNCTION item_after_insert_unit_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF new.updateTable THEN
    UPDATE item SET unit_id = new.unit_id, quantity =quantity * new.incoming_data WHERE item_id = new.item_id;
    END IF;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER item_after_insert_unit
     AFTER INSERT ON unit
     FOR EACH ROW
     EXECUTE PROCEDURE item_after_insert_unit_function();

--Trigger to update unit table after insert in unit table
CREATE OR REPLACE FUNCTION unit_after_insert_unit_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF new.updateTable THEN
    UPDATE unit SET add_quantity = add_quantity * new.incoming_data WHERE item_id = new.item_id AND unit_id != new.unit_id;
    END IF;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER unit_after_insert_unit
     AFTER INSERT ON unit
     FOR EACH ROW
     EXECUTE PROCEDURE unit_after_insert_unit_function();



--Trigger to update supplier table after insert in purchase payment table
CREATE OR REPLACE FUNCTION supplier_after_insert_purchase_payment_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE supplier SET amount_to_be_paid = amount_to_be_paid - new.amount
       WHERE supplier_id = (SELECT supplier_id FROM purchaseinvoice WHERE purchase_invoice_id = new.purchase_invoice_id);
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER supplier_after_insert_purchase_payment
     AFTER INSERT ON purchasePayment
     FOR EACH ROW
     EXECUTE PROCEDURE supplier_after_insert_purchase_payment_function();


--Trigger to update paymentMethod table after insert in purchase payment table
CREATE OR REPLACE FUNCTION paymentMethod_after_insert_purchase_payment_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE paymentMethod SET amount = amount - new.amount
       WHERE payment_method_id = new.payment_method_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER paymentMethod_after_insert_purchase_payment
     AFTER INSERT ON purchasePayment
     FOR EACH ROW
     EXECUTE PROCEDURE paymentMethod_after_insert_purchase_payment_function();


--Trigger to update customer table after insert in sales payment table
CREATE OR REPLACE FUNCTION customer_after_insert_sales_payment_function() RETURNS TRIGGER AS
$BODY$
BEGIN
IF (SELECT customer_id FROM salesinvoice WHERE sales_invoice_id = new.sales_invoice_id) IS NOT NULL THEN
    UPDATE customer SET amount_to_be_received = amount_to_be_received - new.amount
       WHERE customer_id = (SELECT customer_id FROM salesinvoice WHERE sales_invoice_id = new.sales_invoice_id);
     END IF;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER customer_after_insert_sales_payment
     AFTER INSERT ON salesPayment
     FOR EACH ROW
     EXECUTE PROCEDURE customer_after_insert_sales_payment_function();


--Trigger to update salesCredit table after insert in sales payment table if customer id is null
CREATE OR REPLACE FUNCTION salescredit_after_insert_sales_payment_function() RETURNS TRIGGER AS
$BODY$
BEGIN
  IF (SELECT customer_id FROM salesinvoice WHERE sales_invoice_id = new.sales_invoice_id) IS NULL THEN   
    UPDATE salesCredit SET amount = amount - new.amount
       WHERE sales_invoice_id = new.sales_invoice_id;
       END IF;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER salescredit_after_insert_sales_payment
     AFTER INSERT ON salesPayment
     FOR EACH ROW
     EXECUTE PROCEDURE salescredit_after_insert_sales_payment_function();


--Trigger to update paymentMethod table after insert in sales payment table
CREATE OR REPLACE FUNCTION paymentMethod_after_insert_sales_payment_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE paymentMethod SET amount = amount + new.amount
       WHERE payment_method_id = new.payment_method_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER paymentMethod_after_insert_sales_payment
     AFTER INSERT ON salesPayment
     FOR EACH ROW
     EXECUTE PROCEDURE paymentMethod_after_insert_sales_payment_function();

--Trigger to update paymentMethod table after insert in sales payment table with amount return 
CREATE OR REPLACE FUNCTION paymentMethod_after_insert_sales_payment_with_amount_return_function() RETURNS TRIGGER AS
$BODY$
BEGIN
     IF new.amount_return IS NOT NULL THEN
    UPDATE paymentMethod SET amount = amount - new.amount_return
       WHERE payment_method_id = new.payment_method_id;
       END IF;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER paymentMethod_after_insert_sales_payment_with_amount_return
     AFTER INSERT ON salesPayment
     FOR EACH ROW
     EXECUTE PROCEDURE paymentMethod_after_insert_sales_payment_with_amount_return_function();



--Trigger to update paymentMethod table after insert in expense payment table
CREATE OR REPLACE FUNCTION paymentMethod_after_insert_expense_payment_function() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE paymentMethod SET amount = amount - new.amount
       WHERE payment_method_id = new.payment_method_id;
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER paymentMethod_after_insert_expense_payment
     AFTER INSERT ON expensePayment
     FOR EACH ROW
     EXECUTE PROCEDURE paymentMethod_after_insert_expense_payment_function();



