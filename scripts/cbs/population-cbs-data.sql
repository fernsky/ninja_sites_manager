-- Create the population_gender_wise_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS population_gender_wise_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_population INTEGER,
  total_male INTEGER,
  total_female INTEGER
);

-- Clear existing data (optional)
-- TRUNCATE TABLE population_gender_wise_cbs;


-- Insert ward-wise population data
INSERT INTO population_gender_wise_cbs (id, ward_no, total_population, total_male, total_female)
VALUES 
  ('pop_ward_1', 1, 10387, 5006, 5381),
  ('pop_ward_2', 2, 9149, 4349, 4800),
  ('pop_ward_3', 3, 12240, 5738, 6502),
  ('pop_ward_4', 4, 11692, 5585, 6107),
  ('pop_ward_5', 5, 4027, 1956, 2071),
  ('pop_ward_6', 6, 3250, 1580, 1670),
  ('pop_ward_7', 7, 2265, 1046, 1219);
