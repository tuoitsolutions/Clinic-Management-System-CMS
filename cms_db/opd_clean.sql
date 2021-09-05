TRUNCATE TABLE `opd`.`administrator`;
TRUNCATE TABLE `opd`.`bill_paymongo`;
TRUNCATE TABLE `opd`.`consult_req_allergy`;
TRUNCATE TABLE `opd`.`consult_req_chat`;
TRUNCATE TABLE `opd`.`consult_req_dept_tran_log`;
TRUNCATE TABLE `opd`.`consult_req_immune`;
TRUNCATE TABLE `opd`.`consult_req_med`;
TRUNCATE TABLE `opd`.`consult_req_med_prob`;
TRUNCATE TABLE `opd`.`consult_req_proc`;
TRUNCATE TABLE `opd`.`consult_req_vital_sign`;
TRUNCATE TABLE `opd`.`consult_request`;
TRUNCATE TABLE `opd`.`consult_request_file`;
TRUNCATE TABLE `opd`.`dept_resident`;
TRUNCATE TABLE `opd`.`hosp_patient`;
TRUNCATE TABLE `opd`.`hosp_resident`;
TRUNCATE TABLE `opd`.`logs`;
TRUNCATE TABLE `opd`.`messageout`;
TRUNCATE TABLE `opd`.`otp`;
TRUNCATE TABLE `opd`.`users`;

INSERT INTO `users` 
SET 
full_name='primero, opd',
username = 'pgh',
user_type = 'admin',
pass = AES_ENCRYPT('tuo','pgh'),
sts_pk = 'o',
encoder_pk ='pgh';
