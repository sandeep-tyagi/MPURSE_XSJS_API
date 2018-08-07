
 SELECT E.SERIAL_NUMBER,E.MODEL_CODE,E.MATERIAL_CODE,E.IMEI1,
    E.IMEI2,C.CUST_NAME, C.DMS_CUST_CODE,E.SECONDARYSALE_DATE,E.SECONDARY_PRICE,
    E.PRIMARYSALE_DATE, E.MANUFACTURING_DATE,E.MATERIAL_TYPE,E.PLANT_CODE,E.BATCH_NO,E.PRIMARYSALE_CUSTOMER,
    CD.CUST_NAME AS "DSTB_NAME" from "MDB_DEV"."MST_EQUIPMENT" as "E" 
    JOIN "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE=E.SECONDARYSALE_CUSTOMER 
    JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER
    
    --SALES REGISTER FOR DISTRIBUTOR(ADMIN)
    
    SELECT C.DMS_CUST_CODE,CD.CUST_NAME AS "DSTBNAME",C.CUST_NAME AS "RETLNAME",
    TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION,
    TEM.TRANSACTION_TYPE,COUNT(E.MATERIAL_CODE) AS QUANTITY,E.
    FROM "MDB_DEV"."TRN_EQUIPMENT_MASTER" AS "TEM"
    JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" ON E.SERIAL_NUMBER=TEM.SERIAL_NO
    JOIN "MDB_DEV"."MST_CUSTOMER" as "C" ON C.DMS_CUST_CODE=TEM.DMS_CUST_CODE
    JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER
    WHERE CD.DMS_CUST_CODE=COALESCE(?,CD.DMS_CUST_CODE)
    GROUP BY C.DMS_CUST_CODE,C.CUST_NAME,TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION,
    TEM.TRANSACTION_TYPE,CD.CUST_NAME 
    select * from "MDB_DEV"."MST_EMPLOYEE_EXTN"
    
     --SALES REGISTER FOR DISTRIBUTOR (PARTICULAR RETAILER)

    SELECT C.DMS_CUST_CODE,CD.CUST_NAME AS "DSTBNAME",C.CUST_NAME AS "RETLNAME",
    TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION,
    TEM.TRANSACTION_TYPE,COUNT(E.MATERIAL_CODE) AS QUANTITY
    FROM "MDB_DEV"."TRN_EQUIPMENT_MASTER" AS "TEM"
    JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" ON E.SERIAL_NUMBER=TEM.SERIAL_NO
    JOIN "MDB_DEV"."MST_CUSTOMER" as "C" ON C.DMS_CUST_CODE=TEM.DMS_CUST_CODE
    JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER
    WHERE C.DMS_CUST_CODE=COALESCE(?,C.DMS_CUST_CODE)
    GROUP BY C.DMS_CUST_CODE,C.CUST_NAME,TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION,
    TEM.TRANSACTION_TYPE,CD.CUST_NAME 
    
    
    
    select * FROM "MDB_DEV"."TRN_EQUIPMENT_MASTER"
    select *  FROM "MDB_DEV"."MST_EQUIPMENT" where SERIAL_NUMBER in ('911222751318186')