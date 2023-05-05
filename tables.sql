CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_name VARCHAR(160) NOT NULL ,
    email VARCHAR(250) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    password VARCHAR(300) NOT NULL,
    joined_at timestamp DEFAULT current_timestamp
);

CREATE TABLE company(
    company_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(250) NOT NULL,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE category(
    category_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(250) NOT NULL,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE item(
    item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    taxable BOOLEAN DEFAULT FALSE,
    item_name VARCHAR(250) NOT NULL,
    unit_id uuid,
    quantity INT DEFAULT 0,
    user_id uuid,
    category_id uuid,
    company_id uuid,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (company_id) REFERENCES company(company_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE unit(
    unit_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_type VARCHAR(250) NOT NULL,
    price INT NOT NULL,
    add_quantity INT NOT NULL,
    purchase_cost INT NOT NULL,
    discount INT DEFAULT 0,
    updateTable BOOLEAN,
    incoming_data INT NOT NULL,
    item_id uuid,
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);

CREATE TABLE supplier(
    supplier_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name VARCHAR(250) NOT NULL,
    supplier_phone varchar(12) UNIQUE NOT NULL,
    amount_to_be_paid INT DEFAULT 0,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE paymentMethod(
    payment_method_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_of_payment VARCHAR(150) NOT NULL,
    amount INT DEFAULT 0,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE purchaseInvoice(
    purchase_invoice_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_no VARCHAR(250) NOT NULL,
    supplier_id uuid,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE purchase(
    purchase_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id uuid,
    quantity INT DEFAULT 0,
    unit_id uuid,
    rate INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    tax_amount INT DEFAULT 0,
    created_at timestamp DEFAULT current_timestamp,
    purchase_invoice_id uuid,
    FOREIGN KEY (unit_id) REFERENCES unit(unit_id),
    FOREIGN KEY(purchase_invoice_id) REFERENCES purchaseInvoice(purchase_invoice_id)
);

CREATE TABLE purchasePayment(
    purchase_payment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(250) NOT NULL,
    amount INT DEFAULT 0,
    created_at timestamp DEFAULT current_timestamp,
    payment_method_id uuid,
    purchase_invoice_id uuid,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY(payment_method_id) REFERENCES paymentMethod(payment_method_id),
    FOREIGN KEY(purchase_invoice_id) REFERENCES purchaseInvoice(purchase_invoice_id)
);

CREATE TABLE customer(
    customer_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(250) NOT NULL,
    customer_phone VARCHAR(12) NOT NULL,
    amount_to_be_received INT NOT NULL,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE salesInvoice(
    sales_invoice_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_no VARCHAR(150) NOT NULL,
    customer_id uuid,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE sales(
    sales_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id uuid,
    quantity INT DEFAULT 0,
    unit_id uuid,
    rate INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    tax_amount INT DEFAULT 0,
    created_at timestamp DEFAULT current_timestamp,
    sales_invoice_id uuid,
    FOREIGN KEY(item_id) REFERENCES item(item_id),
    FOREIGN KEY(unit_id) REFERENCES unit(unit_id),
    FOREIGN KEY(sales_invoice_id) REFERENCES salesInvoice(sales_invoice_id)
);

CREATE TABLE salesPayment(
    sales_payment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_method_id uuid,
    reference VARCHAR(150) NOT NULL,
    amount INT NOT NULL,
    amount_return INT DEFAULT 0,
    created_at timestamp DEFAULT current_timestamp,
    sales_invoice_id uuid,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY(payment_method_id) REFERENCES paymentMethod(payment_method_id),
    FOREIGN KEY(sales_invoice_id) REFERENCES salesInvoice(sales_invoice_id)
); 

CREATE TABLE expenses(
    expense_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_of_expense VARCHAR(100) NOT NULL,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE expensePayment(
    expense_payment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id uuid,
    amount INT NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    payment_method_id uuid,
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id),
    FOREIGN KEY(payment_method_id) REFERENCES paymentMethod(payment_method_id)    
);

CREATE TABLE salesCredit(
    sales_credit_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INT NOT NULL,
    sales_invoice_id uuid,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (sales_invoice_id) REFERENCES salesInvoice(sales_invoice_id)
);

