-- #1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

-- #2
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- #3
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- #4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';

-- #5
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM inventory AS inv
INNER JOIN classification AS cls
ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- #6
UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');