/**
 * To get the Destination
 *
 */

function getDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.TestJobs", "HCI");
	var client = new $.net.http.Client();
	var req = new $.net.http.Request($.net.http.POST, "/customerdatafetch");
  //  var req = new $.web.WebRequest($.net.http.POST, "/customerdatafetch");
	req.contentType = "application/json";

	req.setBody(JSON.stringify(records));
	client.request(req, dest);
	var response = client.getResponse();
	records.data = response.body.asString();
	
	//	var body = JSON.stringify(data);
	//$.response.contentType = 'application/json';
	$.response.setBody(records.data);
	$.response.status = $.net.http.OK;
	//return data;
}

function putBankTransaction() {

	var request = {
		validate: {}
	};
	var validateArrData = {};
	validateArrData.customer_code = "MOBIIS";
	validateArrData.bene_account_no = "MOBIIS100001";
	validateArrData.bene_account_ifsc = "YESB0CMSNOC";
	validateArrData.bene_full_name = "HM Z P U P Sch Borda Zullurwar";
    validateArrData.transfer_type = "NEFT";
    validateArrData.transfer_unique_no = "SBIN117076782119";
    validateArrData.transfer_timestamp = "2018-06-22 10:53:53";
    validateArrData.transfer_ccy = "INR";
    validateArrData.transfer_amt = 1854;
    validateArrData.rmtr_account_no = "00000010640893115";
    validateArrData.rmtr_account_ifsc = "IBKL0NEFT01";
    validateArrData.rmtr_full_name = "EO PRY ZP";
    validateArrData.rmtr_address = "NEFT";
    validateArrData.rmtr_to_bene_note = "ATTNEO PRY ZP CHDBULK BRH";
    validateArrData.attempt_no = 5;

	request.validate = validateArrData;

   // getDestination(request); 
    var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.TestJobs", "HCI");
	var client = new $.net.http.Client();
	var req = new $.web.WebRequest($.net.http.POST, "");
	
	req.contentType = "application/json";
	req.setBody(JSON.stringify(request));
	client.request(req, dest);
	var response = client.getResponse();
	request.data = response;//.body.asString();
	$.response.setBody(request.data);
	$.response.status = $.net.http.OK;

}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "putBankTransaction":
		putBankTransaction();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}