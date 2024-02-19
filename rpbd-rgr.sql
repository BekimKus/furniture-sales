CREATE TABLE model (
  model_id INT PRIMARY KEY,
  name varchar(64),
  cost integer,
  color varchar(64),
  weight integer
);

CREATE TABLE customer (
  customer_id integer PRIMARY KEY,
  name varchar(64),
  phone varchar(64),
  city varchar(64),
  street varchar(64),
  build varchar(64)
);

CREATE TABLE contract (
  contract_id integer PRIMARY KEY,
  customer_id integer,
  model_id integer,
  model_num integer,
  reg_date varchar(64),
  done_date varchar(64)
);

CREATE TABLE sale (
  sale_id integer PRIMARY KEY,
  contract_id integer,
  amount integer,
  total_cost integer
);

ALTER TABLE contract ADD FOREIGN KEY (customer_id) REFERENCES customer (customer_id);
ALTER TABLE contract ADD FOREIGN KEY (model_id) REFERENCES model (model_id);
ALTER TABLE sale ADD FOREIGN KEY (contract_id) REFERENCES contract (contract_id);

INSERT INTO model(model_id, name, cost, color, weight) VALUES
    (1, 'Кровать Венеция', 10000, 'Дуб', 10),
    (2, 'Кровать Спарта', 20000, 'Ольха', 12);

INSERT INTO customer(customer_id, name, phone, city, street, build) VALUES
    (1, 'Баранович Максим Сергеевич', '+7(800)000-00-01', 'Новосибирск', 'ул. Красина', '62'),
    (2, 'Бекетов Дмитрий Андреевич', '+7(800)000-00-02', 'Новосибирск', 'ул. Дуси Ковальчук', '103'),
    (3, 'Третьяков Егор Владимирович', '+7(800)000-00-03', 'Новосибирск', 'пр-т. Карла Маркса', '13');

INSERT INTO contract(contract_id, customer_id, model_id, model_num, reg_date, done_date) VALUES
    (1, 1, 1, 1, '01.02.2024', '19.02.2024'),
    (1, 1, 2, 2, '01.02.2024', '19.02.2024'),
    (2, 3, 2, 4, '11.01.2024', '12.02.2024');

INSERT INTO sale(sale_id, contract_id, amount, total_cost) VALUES
    (1, 1, 2, 10),
    (2, 2, 20000, 12);
