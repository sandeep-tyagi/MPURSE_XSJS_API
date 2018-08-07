function uploadImei() {

	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "ImeiPost");
	var client = new $.net.http.Client();
/*	var req = new $.web.WebRequest($.net.http.GET, "");
	client.request(req, dest);
	var response = client.getResponse();
	var st1 = JSON.stringify(response.body.asString());
	$.response.contentType = 'application/json';
	$.response.charset = 'UTF-8';
	$.response.setBody(JSON.parse(st1));*/
	var oSapBackPack = JSON.stringify({"param1": "1","param2": "2", "param3": "1"});
	

		var req = new $.web.WebRequest($.net.http.POST,"");
		//new $.web.WebRequest($.net.http.POST, oSapBackPack);
		//req.contentType = "application/json";
  req.setBody(JSON.stringify(oSapBackPack));
  req.headers.set("Content-Type","application/json");
  req.headers.set("X-Requested-With","XMLHttpRequest");
  client.request(req, dest);
//	client.request(req, dest);
	var response = client.getResponse();
	
//	var st1 = JSON.stringify(response.body.asString());
//	$.response.contentType = 'application/json';
	$.response.setBody(response);
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "uploadImei":
		uploadImei();
		break;
	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}