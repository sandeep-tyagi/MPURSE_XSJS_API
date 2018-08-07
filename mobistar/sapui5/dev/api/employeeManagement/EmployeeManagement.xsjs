function getEmployee(){
    	var output = {
		results: []
	};
	var record={};
	try {
	var employeeCode = $.request.parameters.get('employeeCode');
	var connection = $.db.getConnection();
    var qryGetEmployee = 'select MSE.EMPLOYEE_ID,MSE.EMPLOYEE_CODE,MSE.EMPLOYEE_NAME,MSE.ADDRESS1,MSE.ADDRESS2,MSE.COUNTRY,MSE.STATE,MSE.DISTRICT ' +
			' ,MSE.PHONE_NUMBER,MSE.EMAIL,MSE.ROLE_POSITION_ID,MSE.POSITION_VALUE_ID,MSE.STATUS,MP.POSITION_NAME from "MDB_DEV"."MST_EMPLOYEE" as MSE inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on MSE.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID where EMPLOYEE_CODE = ? and MSE.SOFT_DEL=?'; 
    var pstmtGetEmployee = connection.prepareStatement(qryGetEmployee);
    pstmtGetEmployee.setString(1,employeeCode);
    pstmtGetEmployee.setString(2,'0');
    var rsGetEmployee = pstmtGetEmployee.executeQuery();
    if(rsGetEmployee.next()){
        record.EMPLOYEE_CODE= rsGetEmployee.getString(1);
        record.EMPLOYEE_NAME=rsGetEmployee.getString(2);
        record.EMPLOYEE_START_DATE= rsGetEmployee.getString(3);
        record.EMPLOYEE_CREATE_DATE =rsGetEmployee.getString(4);
    }else{
        record.message='Employee Not Found!!!';
    }
    output.results.push(record);
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
    connection.close();
	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
    
    
}





var aCmd = $.request.parameters.get('cmd');

switch (aCmd) {

	case "getEmployee":
		getEmployee();
		break;

	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}