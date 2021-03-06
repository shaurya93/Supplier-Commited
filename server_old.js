
var express = require('express');
var app = express();
var path = require('path'); //Use the path to tell where find the .ejs files
var fs = require("fs");
var SQL = require('sql.js');
var https = require('https');
var settings = require('settings');
var search = require('netsuite-search')(settings);
var pg = require('pg');
var dbs = require('db_abstraction.js');
dbs.db('POSTGRESS');
var id=null;
var vendor_name=null;

app.set('port', (process.env.PORT || 5000));

app.use(require('body-parser').urlencoded({
    extended: true
}));
var formidable = require('formidable');

/* var RecordType = module.exports = {
    rec_type: ''
} */
//var rec_type= '';
//module.exports.rec_type = rec_type;

// view engine setup
app.set('views', __dirname + '/views'); // here the .ejs files is in views folders
app.set('view engine', 'ejs'); //tell the template engine


app.use( express.static(__dirname + '/public' ) );

var router = express.Router();

//var filebuffer = fs.readFileSync('supplier_master.db');


////var filebuffer = fs.readFileSync('https://github.com/shaurya93/Supplier-Portal/blob/master/node_modules/supplier_master.db');


//var db = new SQL.Database(filebuffer);
/* var data = db.export();
var buffer = new Buffer(data);
fs.writeFileSync("supplier_master.db", buffer); */

app.get('/', function(req,res,next){
	console.log('in index get ejs');
	
	res.render('index',{});
});

/*get home page*/
/*app.get('/index', function(req,res,next){
	console.log('in index get ejs');
	
	res.render('index',{});
});*/


/* GET home page. */
app.get('/dashboard', function(req, res, next) { // route for '/'

if(req.query.vendorid)
{

	console.log("Dashboard page ");
	//console.log("vendor_name  "+req.params.vendorid);
	console.log("vendor_name  "+req.query.vendorid);  
	id=req.query.vendorid;
	
	var po_all_count = 0;
	var po_pendingAck_count = 0;
	var po_Ack_count = 0;
	var po_pendingDelivery_count = 0;
	var po_pendingBill_count = 0;
	var po_fully_billed_count=0;
	
	var pl_readyToShip_count = 0;
	var pl_shipped_count = 0;
	var bill_all_count = 0;
	
	dbs.db('POSTGRESS');
	
	var fields_vendormaster_details= {key:"VENDOR_NS_ID::integer",operator:"=",value:id};
	dbs.query('vendor_master',fields_vendormaster_details);
	dbs.readData(function (result){
		console.log("result vendor details :: "+ result);
		
		first_name_val = result[0].first_name;
		last_name_val = result[0].last_name;

		console.log("first_name_val "+first_name_val);
		console.log("last_name_val "+last_name_val);		
	
		vendor_name= first_name_val+' '+last_name_val; 
		console.log("vendor_name "+vendor_name);
		
		//po_pendingAck_count = result;
	});
	
	/*
	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var contents = client.query("select * from vendor_master where VENDOR_NS_ID::integer="+id);
	contents.on("row", function(row,result)
        {
        	result.addRow(row);
        	//console.log('unstringified content : '+ result.rows[0].first_name);
        	contents = result.rows;
      		//console.log('contents in dashboard: ' + JSON.stringify(result.rows));
      		//console.log('first_name' + contents[0].first_name);
        */
        
        /*
	contents.on("end", function (result) {          
	console.log('Dashboard View' + ' first_name ' + contents[0].first_name);
	*/


	//console.log('Contents before error ::'+ contents);
	//var contents = db.exec("select * from vendor_master where VENDOR_NS_ID="+id);
	//console.log("contents length : "+contents[0]["values"].length);
		
	//first_name_val = contents[0]["values"][0][1];
	//last_name_val = contents[0]["values"][0][2];	
/*
	first_name_val = contents[0].first_name;
	last_name_val = contents[0].last_name;

	console.log("first_name_val "+first_name_val);
	console.log("last_name_val "+last_name_val);		
	
	vendor_name= first_name_val+' '+last_name_val; 
	console.log("vendor_name "+vendor_name);
        });
		
*/		
		

	
	//var contents_po_all_count = db.exec("select * from purchase_order");
	//var results = client.query("select * from purchase_order");
	//console.log('stringified result :'+ JSON.stringify(contents_po_all_count));
	
	
	//var contents_po_all_count= client.query("select * from purchase_order");
	
	var fields_po_pendingAck= {key:"order_status",operator:"=",value:"'Pending Acknowledge'"};
	dbs.query('purchase_order',fields_po_pendingAck);
	dbs.read(function (result){
		console.log("result po_pendingAck :: "+ result);
		po_pendingAck_count = result;
	});
	
	var fields_po_Ack= {key:"order_status",operator:"=",value:"'Acknowledged'"};
	dbs.query('purchase_order',fields_po_Ack);
	dbs.read(function (result){
		console.log("result po_Ack :: "+ result);
		po_Ack_count = result;
	});
	
	var fields_po_pendingDelivery= {key:"order_status",operator:"=",value:"'Pending Delivery'"};
	dbs.query('purchase_order',fields_po_pendingDelivery);
	dbs.read(function (result){
		console.log("result po_pendingDelivery_count :: "+ result);
		po_pendingDelivery_count = result;
	});
	
	var fields_po_pendingBill= {key:"order_status",operator:"=",value:"'Pending Billing'"};
	dbs.query('purchase_order',fields_po_pendingBill);
	dbs.read(function (result){
		console.log("result po_pendingBill_count :: "+ result);
		po_pendingBill_count = result;
	});
	
	var fields_po_fully_billed= {key:"order_status",operator:"=",value:"'Fully Billed'"};
	dbs.query('purchase_order',fields_po_fully_billed);
	var a = new dbs.field("order_status",'Fully Billed',"=");
	var b = new dbs.field("order_status",'Fully Billed',"=");
	dbs.read(function (result){
		console.log("result po_fully_billed_count :: "+ result);
		po_fully_billed_count = result;
	});
	
	var fields_pl_readyToShip= {key:"status",operator:"=",value:"'Ready to Ship'"};
	dbs.query('packing_list',fields_pl_readyToShip);
	dbs.read(function (result){
		console.log("result pl_readyToShip_count :: "+ result);
		pl_readyToShip_count = result;
	});
	
	var fields_pl_shipped= {key:"status",operator:"=",value:"'Shipped'"};
	dbs.query('packing_list',fields_pl_shipped);
	dbs.read(function (result){
		console.log("result pl_shipped_count :: "+ result);
		pl_shipped_count = result;
	});
	
	dbs.query('bill_list',null);
	dbs.read(function (result){
		console.log("result bill_all_count :: "+ result);
		bill_all_count = result;
	});
	
	dbs.query('purchase_order',null);
	dbs.read(function (result){
		console.log("result PO all :: "+ result);
		po_all_count = result;
	});
	
	//console.log('Outside value for last var : ' + po_all_count);
	setTimeout(function () {
	res.render('dashboard', { //render the index.ejs
	vendorname:vendor_name,
	v_id:id,
	
	po_all_count_rend:po_all_count,
	po_pendingAck_count_rend:po_pendingAck_count,
	po_Ack_count_rend:po_Ack_count,
	po_pendingDelivery_count_rend:po_pendingDelivery_count,
	po_pendingBill_count_rend:po_pendingBill_count,
	po_fully_billed_count_rend:po_fully_billed_count,
	
	pl_readyToShip_count_rend:pl_readyToShip_count,
	pl_shipped_count_rend:pl_shipped_count,
	bill_all_count_rend:bill_all_count
  
  }); 
		
	}, 5000);
	console.log("***** Get Index END ****** ");
	
	//client.end();
	//});
}
	
	//po_all_count = result.rowCount;

 
	/*  var rows = [];
    	contents_po_all_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_po_all_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 po_all_count = result.rowCount;
     }
     
    
    });  */

 //console.log(result.rowCount + ' rows were received');
    /*  if(result.rowCount)
     {
     	 po_all_count = result.rowCount;
     } */
     
	
	
/*	var contents_po_pendingAck_count = client.query("select * from purchase_order where order_status='Pending Acknowledge'");
	//var contents_po_pendingAck_count= db.exec("select * from purchase_order where order_status='Pending Acknowledge'");
	

	 var rows = [];
    	contents_po_pendingAck_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_po_pendingAck_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 po_pendingAck_count = result.rowCount;
     }
     
    
    });

	var contents_po_Ack_count = client.query("select * from purchase_order where order_status='Acknowledged'");
	//var contents_po_Ack_count = db.exec("select * from purchase_order where order_status='Acknowledged'");
	
	 var rows = [];
    	contents_po_Ack_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_po_Ack_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 po_Ack_count = result.rowCount;
     }
     
    
    });
    
	//var contents_po_pendingDelivery_count = db.exec("select * from purchase_order where order_status='Pending Delivery'");
	var contents_po_pendingDelivery_count = client.query("select * from purchase_order where order_status='Pending Delivery'");
	
	
	 var rows = [];
    	contents_po_pendingDelivery_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_po_pendingDelivery_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 po_pendingDelivery_count = result.rowCount;
     }
     
    
    });
	
	//var contents_po_pendingBill_count = db.exec("select * from purchase_order where order_status='Pending Billing'");
	var contents_po_pendingBill_count = client.query("select * from purchase_order where order_status='Pending Billing'");
	var rows = [];
    	contents_po_pendingBill_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_po_pendingBill_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 po_pendingBill_count = result.rowCount;
     }
     
    
    });
	
		
	//var contents_po_fully_billed_count = db.exec("select * from purchase_order where order_status='Fully Billed'");			
	var contents_po_fully_billed_count = client.query("select * from purchase_order where order_status='Fully Billed'");
	var rows = [];
    	contents_po_fully_billed_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_po_fully_billed_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 po_fully_billed_count = result.rowCount;
     }
     
    
    });
		
			
	//var contents_pl_readyToShip_count = db.exec("select * from packing_list where status='Ready to Ship'");
	var contents_pl_readyToShip_count = client.query("select * from packing_list where status='Ready to Ship'");

	var rows = [];
    	contents_pl_readyToShip_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_pl_readyToShip_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 pl_readyToShip_count = result.rowCount;
     }
     
    
    });
	
	
	//var contents_pl_shipped_count = db.exec("select * from packing_list where status='Shipped'");
	var contents_pl_shipped_count = client.query("select * from packing_list where status='Shipped'");
	
	var rows = [];
    	contents_pl_shipped_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_pl_shipped_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 pl_shipped_count = result.rowCount;
     }
     
    
    });
	
	//var contents_bill_all_count = db.exec("select * from bill_list");
	var contents_bill_all_count = client.query("select * from bill_list");
	
	var rows = [];
    	contents_bill_all_count.on("row", function(row) {
      //fired once for each row returned
      	rows.push(row);
    });
    contents_bill_all_count.on("end", function(result) {
      //fired once and only once, after the last row has been returned and after all 'row' events are emitted
      //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
      console.log(result.rowCount + ' rows were received');
     if(result.rowCount)
     {
     	 bill_all_count = result.rowCount;
     }
     
    
    });
	
	*/

else
{
	res.render('signout',{});
}


});

var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*
var server = app.listen(5000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
*/
app.get('/login', function(req,res,next){
	console.log('in login get ejs');
	
	var conString = process.env.DATABASE_URL ;
        var client = new pg.Client(conString);
        client.connect();
/*	var query1 = client.query("CREATE TABLE timestamp"+
									"("+
									"rec_type varchar(20),"+
									"timestamp varchar(20),"+
									"local_time varchar(20)"+
									")");
									
		query1.on("end", function (result) {          
				console.log('Table timestamp Created');  
			});							
		
						
		var query2 = client.query("CREATE TABLE purchase_order"+
									"("+
									"PO_NS_ID INTEGER,"+
									"TRAN_DATE DATE,"+
									"PO_NUMBER VARCHAR(20),"+
									"CURRENCY VARCHAR(20),"+
									"MEMO VARCHAR(255),"+
									"ACK_DATE DATE,"+
									"EX_FACTORY_DATE DATE,"+
									"WH_ARRIVAL_DATE DATE,"+
									"DATE_CREATED DATE,"+
									"DELIVERY_METHOD VARCHAR(20),"+
									"SHIPPING_POINT VARCHAR(20),"+
									"SHIPPING_TERMS VARCHAR(20),"+
									"SHIP_TO VARCHAR(20),"+
									"ORDER_STATUS VARCHAR(20),"+
									"RESPONSE_STATUS VARCHAR(20),"+
									"TIMESTAMP INTEGER,"+
									"total varchar,"+
									"tax_total integer"+
									")");
									
		query2.on("end", function (result) {          
				console.log('Table purchase order Created');
				});
		
		var query3 = client.query("CREATE TABLE packing_list_lines"+
									"("+
									"PACKING_LIST_NS_ID INTEGER,"+
									"ITEM_ID VARCHAR(20),"+
									"ITEM_NAME VARCHAR(20),"+
									"DESCRIPTION VARCHAR(20),"+
									"QTY_ORDERED INTEGER,"+
									"QTY_DISPATCHED INTEGER,"+
									"PO_NS_ID INTEGER,"+
									"NET_WT DECIMAL,"+
									"GROSS_WT DECIMAL,"+
									" packinglist_ref varchar(20),"+
									" REF_PO_NUM varchar(20)"+
									")");
									
		query3.on("end", function (result) {          
				console.log('Table packing list Created');
		});							
									
		var query4 = client.query("CREATE TABLE bill_list"+
									"("+
									"BILL_LIST_NS_ID INTEGER,"+
									"AMOUNT DECIMAL,"+
									"BILL_DATE DATE,"+
									"MEMO VARCHAR(20),"+
									" Status VARCHAR(25),"+
									" po_id varchar(20)"+
									")");
									
		query4.on("end", function (result) {          
				console.log('Table bill list Created');
			});							
		
		var query5 = client.query("CREATE TABLE bill_list_lines"+
									"("+
									"BILL_LIST_NS_ID INTEGER,"+
									"ITEM_ID VARCHAR(20),"+
									"ITEM_NAME VARCHAR(255),"+
									"DESCRIPTION VARCHAR(255),"+
									"QUANTITY INTEGER,"+
									"AMOUNT DECIMAL,"+
									"TAX_AMOUNT DECIMAL,"+
									"TOTAL_AMOUNT DECIMAL,"+
									"GROSS_WT DECIMAL,"+
									"PO_NS_ID INTEGER"+
									")");
		
		query5.on("end", function (result) {          
				console.log('Table bill list lines Created');
			});
		
		var query6 = client.query("CREATE TABLE po_lines"+
									"("+
									"ITEM_ID VARCHAR(20),"+
									"ITEM_NAME VARCHAR(255),"+
									"PO_NS_ID INTEGER,DESCRIPTION VARCHAR(255),"+
									"QTY INTEGER,RATE DECIMAL,"+
									"AMOUNT DECIMAL,"+
									"ITEM_STATUS VARCHAR(255),"+
									" TAX_CODE VARCHAR(255),"+
									"TAX_AMOUNT INTEGER"+
									")");
		
		query6.on("end", function (result) {          
				console.log('Table po lines Created');
			});
		
		var query7 = client.query("CREATE TABLE packing_list"+
									"("+
									"PACKING_LIST_NS_ID INTEGER,"+
									"SHIP_TO VARCHAR(20),"+
									"SHIP_DATE DATE,"+
									"DELIVERY_METHOD VARCHAR(20),"+
									"SHIPMENT_ORIGIN VARCHAR(20),"+
									"SHIPMENT_POINT VARCHAR(20),"+
									"STATUS VARCHAR(20),"+
									"TIMESTAMP varchar(20),"+
									" packing_list_num varchar(20),"+
									" po_num varchar(20),"+
									" DATE_CREATED date,"+
									" MEMO varchar(20),"+
									" po_ns_id integer,"+
									" id SERIAL PRIMARY KEY"+
									")");
		
		query7.on("end", function (result) {          
				console.log('Table packing list Created');
			});
		
		var query8 = client.query("CREATE TABLE vendor_master"+
									"("+
									"vendor_ns_id varchar(20),"+
									"first_name varchar(20),"+
									"last_name varchar(20),"+
									"email_id varchar(255),"+
									"phone varchar(20),"+
									"address varchar(255),"+
									"password varchar(20),"+
									"alt_phone varchar(20),"+
									"fax varchar(20)"+
									")");
		
		query8.on("end", function (result) {          
				console.log('Table vendor master Created');
			});
		
		var query9 = client.query("INSERT INTO \"timestamp\" VALUES('PurchaseOrder','06/01/2016 10:15 PM','06/02/2016 10:45:16')");
		
		query9.on("end", function (result) {          
				console.log('TIMESTAMP VALUE INSERTED 1');
			});
		
		var query10 = client.query("INSERT INTO \"timestamp\" VALUES('Bills','06/05/2016 10:34 PM','06/06/2016 11:04:22')");
		
		query10.on("end", function (result) {          
				console.log('TIMESTAMP VALUE INSERTED 2');
			});
	
		var query11 = client.query("INSERT INTO \"purchase_order\" VALUES(5179,'5/31/2016 7:40 am','2625','USA','',NULL,NULL,'4/29/2016',NULL,'',NULL,'CPT','','Pending Acknowledge',NULL,NULL,'3000.00',NULL)");
		
		query11.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 1');
			});
	
		var query12 = client.query("INSERT INTO \"purchase_order\" VALUES(5178,'5/31/2016 7:36 am','2624','USA','12-pack regular ball point pens, blue ink',NULL,NULL,'5/4/2016',NULL,'',NULL,'CIF','','Pending Acknowledge',NULL,NULL,'2484.75',NULL)");
		
		query12.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 2');
			});
		
		var query13 = client.query("INSERT INTO \"purchase_order\" VALUES(5166,'5/31/2016 6:32 am','2612','USA','Printer Ink Starter Pack',NULL,NULL,'5/5/2016',NULL,'',NULL,'FCA','','Fully Billed',NULL,NULL,'650.00',NULL)");
		
		query13.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 3');
			});
		
		var query14 = client.query("INSERT INTO \"purchase_order\" VALUES(5167,'5/31/2016 6:41 am','2613','USA','Apple iPad 2 GB RAM',NULL,NULL,'5/5/2016',NULL,'',NULL,'C&F','','Fully Billed',NULL,NULL,'1600.00',NULL)");
		
		query14.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 4');
			});
		
		var query15 = client.query("INSERT INTO \"purchase_order\" VALUES(5168,'5/31/2016 6:45 am','2614','USA','IFB AC 4 Tone',NULL,NULL,'5/5/2016',NULL,'',NULL,'C&F','','Fully Billed',NULL,NULL,'3240.00',NULL)");
		
		query15.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 5');
			});
		
		var query16 = client.query("INSERT INTO \"purchase_order\" VALUES(5169,'5/31/2016 7:02 am','2615','USA','',NULL,NULL,'5/11/2016',NULL,'',NULL,'CPT','','Fully Billed',NULL,NULL,'1750.00',NULL)");
		
		query16.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 6');
			});
		
		var query17 = client.query("INSERT INTO \"purchase_order\" VALUES(5170,'5/31/2016 7:07 am','2616','USA','',NULL,NULL,'5/16/2016',NULL,'',NULL,'CPT','','Acknowledged',NULL,NULL,'500.00',NULL)");
		
		query17.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 7');
			});
		
		var query18 = client.query("INSERT INTO \"purchase_order\" VALUES(5171,'5/31/2016 7:08 am','2617','USA','Printer Ink Starter Pack',NULL,NULL,'5/19/2016',NULL,'',NULL,'FCA','','Pending Acknowledge',NULL,NULL,'150.00',NULL)");
		
		query18.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 8');
			});
			
		var query19 = client.query("INSERT INTO \"purchase_order\" VALUES(5177,'5/31/2016 7:31 am','2623','USA','',NULL,NULL,'5/27/2016',NULL,'',NULL,'DDU','','Pending Acknowledge',NULL,NULL,'4000.00',NULL)");
		
		query19.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 12');
			});
		
		var query20 = client.query("INSERT INTO \"purchase_order\" VALUES(5172,'5/31/2016 7:10 am','2618','USA','',NULL,NULL,'5/21/2016',NULL,'',NULL,'CPT','','Pending Acknowledge',NULL,NULL,'100.00',NULL)");
		
		query20.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 9');
			});
		
		var query21 = client.query("INSERT INTO \"purchase_order\" VALUES(5173,'5/31/2016 7:14 am','2619','USA','',NULL,NULL,'5/19/2016',NULL,'',NULL,'C&F','','Pending Acknowledge',NULL,NULL,'13500.00',NULL)");
		
		query21.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 10');
			});
		
		var query22 = client.query("INSERT INTO \"purchase_order\" VALUES(5174,'5/31/2016 7:17 am','2620','USA','',NULL,NULL,'5/24/2016',NULL,'',NULL,'C&F','','Pending Acknowledge',NULL,NULL,'24000.00',NULL)");
		
		query22.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 11');
			});
			
		var query23 = client.query("INSERT INTO \"purchase_order\" VALUES(5176,'5/31/2016 7:27 am','2622','USA','',NULL,NULL,'5/30/2016',NULL,'',NULL,'CIF','','Pending Acknowledge',NULL,NULL,'12500.00',NULL)");
		
		query23.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 13');
			});
		
		var query24 = client.query("INSERT INTO \"purchase_order\" VALUES(5175,'5/31/2016 7:22 am','2621','USA','12-pack regular ball point pens, blue ink',NULL,NULL,'6/6/2016',NULL,'',NULL,'CIF','','Pending Acknowledge',NULL,NULL,'2484.75',NULL)");
		
		query24.on("end", function (result) {          
				console.log('PURCHASE ORDER VALUE INSERTED 14');
			});
				
		
		var query25 = client.query("INSERT INTO \"bill_list\" VALUES(5181,575,'6/1/2016 1:29 am','Bill Rest',NULL,'')");
		
		query25.on("end", function (result) {          
				console.log('BILL LIST VALUE INSERTED 1');
			});
		
		var query26 = client.query("INSERT INTO \"bill_list\" VALUES(5183,1600,'6/1/2016 1:41 am','',NULL,'')");
		
		query26.on("end", function (result) {          
				console.log('BILL LIST VALUE INSERTED 2');
			});
		
		var query27 = client.query("INSERT INTO \"bill_list\" VALUES(5185,3240,'6/1/2016 1:57 am','',NULL,'')");
		
		query27.on("end", function (result) {          
				console.log('BILL LIST VALUE INSERTED 3');
			});
			
		var query28 = client.query("INSERT INTO \"bill_list\" VALUES(5187,1750,'6/1/2016 2:20 am','',NULL,'')");
		
		query28.on("end", function (result) {          
				console.log('BILL LIST VALUE INSERTED 4');
			});
			
		var query29 = client.query("INSERT INTO \"bill_list\" VALUES(5189,200,'6/2/2016 11:06 pm','',NULL,'')");
		
		query29.on("end", function (result) {          
				console.log('BILL LIST VALUE INSERTED 5');
			});
		
		var query30 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5181,'117','Printer Ink Starter Pack','Printer Ink Starter Pack',5,75,NULL,NULL,NULL,NULL)");
		
		query30.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 1');
			});
		
		var query31 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5181,'116','HP LJ 1320 Printer','HP LJ 1320 Printer',2,500,NULL,NULL,NULL,NULL)");
		
		query31.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 2');
			});
		
		
		var query32 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5183,'87','Apple iPad','Apple iPad',4,1600,NULL,NULL,NULL,NULL)");
		
		query32.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 3');
			});
			
		
		var query33 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5185,'92','Air Compressor','Air Compressor',3,3600,NULL,NULL,NULL,NULL)");
		
		query33.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 4');
			});	
		
		
		var query34 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5185,'50','10% Discount','10% Discount',0,360,NULL,NULL,NULL,NULL)");
		
		query34.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 5');
			});
			
		
		var query35 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5187,'96','Packing Box 70X30','Packing Box 70X30',200,500,NULL,NULL,NULL,NULL)");
		
		query35.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 6');
			});	
		
		
		var query36 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5187,'85','Brother All-in-One Printer/Copier/Scanner/Fax','Brother All-in-One Printer/Copier/Scanner/Fax',1,1250,NULL,NULL,NULL,NULL)");
		
		query36.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 7');
			});
			
		
		var query37 = client.query("INSERT INTO \"bill_list_lines\" VALUES(5189,'93','Turbines','Turbines',2,200,NULL,NULL,NULL,NULL)");
		
		query37.on("end", function (result) {          
				console.log('BILL LIST LINES VALUE INSERTED 8');
			});	
		
		var query38 = client.query("INSERT INTO \"vendor_master\" VALUES('1413','WebStore','Solutions','Devendra_Girase@cognizant.com','800-792-7329','456,MG Road  Wakad Pune ',NULL,'(800) 792 7329','+9-8007927329')");
		
		query38.on("end", function (result) {          
				console.log('VENDOR MASTER VALUE INSERTED 1');
			});	
		
		var query39 = client.query("INSERT INTO \"po_lines\" VALUES('94','Pallets',5179,'Pallets',10,300,3000,NULL,NULL,NULL)");
		
		query39.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 1');
			});	
			
		var query40 = client.query("INSERT INTO \"po_lines\" VALUES('118','12-Pack Ball Point Pens',5178,'12-Pack Ball Point Pens',25,1.99,49.75,NULL,NULL,NULL)");
		
		query40.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 2');
			});
		
		var query41 = client.query("INSERT INTO \"po_lines\" VALUES('96','Packing Box 70X30',5178,'Packing Box 70X30',200,2.5,500,NULL,NULL,NULL)");
		
		query41.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 3');
			});
		
		var query42 = client.query("INSERT INTO \"po_lines\" VALUES('98','Spiral Stairs',5178,'Spiral Stairs',1,2000,2000,NULL,NULL,NULL)");
		
		query42.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 4');
			});
		
		var query43 = client.query("INSERT INTO \"po_lines\" VALUES('50','10% Discount',5178,'10% Discount',NULL,-10,200,NULL,NULL,NULL)");
		
		query43.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 5');
			});
		
		var query44 = client.query("INSERT INTO \"po_lines\" VALUES('117','Printer Ink Starter Pack',5178,'Printer Ink Starter Pack',10,15,150,NULL,NULL,NULL)");
		
		query44.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 6');
			});
		
		var query45 = client.query("INSERT INTO \"po_lines\" VALUES('50','10% Discount',5178,'10% Discount',NULL,-10,15,NULL,NULL,NULL)");
		
		query45.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 7');
			});
			
		var query46 = client.query("INSERT INTO \"po_lines\" VALUES('117','Printer Ink Starter Pack',5166,'Printer Ink Starter Pack',10,15,150,NULL,NULL,NULL)");
		
		query46.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 8');
			});
			
		var query47 = client.query("INSERT INTO \"po_lines\" VALUES('116','HP LJ 1320 Printer',5166,'HP LJ 1320 Printer',2,250,500,NULL,NULL,NULL)");
		
		query47.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 9');
			});

		var query48 = client.query("INSERT INTO \"po_lines\" VALUES('87','Apple iPad',5167,'Apple iPad',4,400,1600,NULL,NULL,NULL");
		
		query48.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 10');
			});
			
		var query49 = client.query("INSERT INTO \"po_lines\" VALUES('92','Air Compressor',5168,'Air Compressor',3,1200,3600,NULL,NULL,NULL)");
		
		query49.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 11');
			});
			
			
		var query50 = client.query("INSERT INTO \"po_lines\" VALUES('50','10% Discount',5168,'10% Discount',NULL,-10,360,NULL,NULL,NULL)");
		
		query50.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 12');
			});
			
		var query51 = client.query("INSERT INTO \"po_lines\" VALUES('96','Packing Box 70X30',5169,'Packing Box 70X30',200,2.5,500,NULL,NULL,NULL)");
		
		query51.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 13');
			});

		var query52 = client.query("INSERT INTO \"po_lines\" VALUES('85','Brother All-in-One Printer/Copier/Scanner/Fax',5169,'Brother All-in-One Printer/Copier/Scanner/Fax',1,1250,1250,NULL,NULL,NULL)");
		
		query52.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 14');
			});
			
		var query53 = client.query("INSERT INTO \"po_lines\" VALUES('117','Printer Ink Starter Pack',5171,'Printer Ink Starter Pack',10,15,150,NULL,NULL,NULL)");
		
		query53.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 15');
			});
		
		var query54 = client.query("INSERT INTO \"po_lines\" VALUES('90','Meal Pack',5172,'Meal Pack',20,5,100,NULL,NULL,NULL)");
		
		query54.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 16');
			});
			
		var query55 = client.query("INSERT INTO \"po_lines\" VALUES('94','Pallets',5173,'Pallets',45,300,13500,NULL,NULL,NULL)");
		
		query55.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 17');
			});

		var query56 = client.query("INSERT INTO \"po_lines\" VALUES('-3','Description',5173,'Description',NULL,NULL,0,NULL,NULL,NULL)");
		
		query56.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 18');
			});
		
		var query57 = client.query("INSERT INTO \"po_lines\" VALUES('93','Turbines',5174,'Turbines',3,8000,24000,NULL,NULL,NULL)");
		
		query57.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 19');
			});
		
		var query58 = client.query("INSERT INTO \"po_lines\" VALUES('95','Globes',5177,'Globes',5,800,4000,NULL,NULL,NULL)");
		
		query58.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 21');
			});
		
		var query59 = client.query("INSERT INTO \"po_lines\" VALUES('97','Premier Polyfilm',5176,'Premier Polyfilm',5,2500,12500,NULL,NULL,NULL)");
		
		query59.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 22');
			});
		
		var query60 = client.query("INSERT INTO \"po_lines\" VALUES('118','12-Pack Ball Point Pens',5175,'12-Pack Ball Point Pens',25,1.99,49.75,NULL,NULL,NULL)");
		
		query60.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 23');
			});
		
		
		var query61 = client.query("INSERT INTO \"po_lines\" VALUES('96','Packing Box 70X30',5175,'Packing Box 70X30',200,2.5,500,NULL,NULL,NULL)");
		
		query61.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 24');
			});
			
		
		var query62 = client.query("INSERT INTO \"po_lines\" VALUES('98','Spiral Stairs',5175,'Spiral Stairs',1,2000,2000,NULL,NULL,NULL)");
		
		query62.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 25');
			});

		
		var query63 = client.query("INSERT INTO \"po_lines\" VALUES('50','10% Discount',5175,'10% Discount',NULL,-10,200,NULL,NULL,NULL)");
		
		query63.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 26');
			});
			
		
		var query64 = client.query("INSERT INTO \"po_lines\" VALUES('117','Printer Ink Starter Pack',5175,'Printer Ink Starter Pack',10,15,150,NULL,NULL,NULL)");
		
		query64.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 27');
			});

		
		var query65 = client.query("INSERT INTO \"po_lines\" VALUES('50','10% Discount',5175,'10% Discount',NULL,-10,15,NULL,NULL,NULL)");
		
		query65.on("end", function (result) {          
				console.log('PO LINES VALUE INSERTED 28');
			});
*/
	client.end();	
	res.render('login',{});
});
app.post('/login', function(req,res,next){
	
	
	module.exports.rec_type = 'ProfileView';	
	
	console.log('in login post ejs');
	
	var email_val=req.body.your_email;
	var password_val=req.body.your_password;
	
	console.log('email_val:'+email_val);
	console.log('password_val:'+password_val);
	
	
	
	function onFailure(err) {
  process.stderr.write("Refresh Failed: " + err.message + "\n");
  process.exit(1);
	}

//var rest_params = {event:"edit",rec_id:req.body.ns_id,address:req.body.address,fax:req.body.fax,phone:req.body.phone,alt_phone:req.body.altphone,email:req.body.email};

var rest_params = {event:"login",email:req.body.your_email,password:req.body.your_password};


// This will try the cached version first, if not there will run and then cache 

var vendorid=null;
search.run(rest_params, function (err, results) {
  if (err) onFailure(err);
  console.log(JSON.stringify(results));
  //console.log('Results login st::'+results.status);
  console.log('Results login::'+results);
  console.log('Results login msg::'+results.message);
	//console.log('Results login msg::');	
  console.log('Results login st::'+results.status);
 	
  
 var contents='';		
 
			if(results.status=='Successful')
			{
				console.log("response vendor id::"+results.vendor_id);
				vendorid=results.vendor_id;
				var conString = process.env.DATABASE_URL ;
        			var client = new pg.Client(conString);
        			client.connect();
        			var contents = client.query("select * from vendor_master where vendor_ns_id::integer="+vendorid);
        			contents.on("row", function(row,result)
        			{
        				result.addRow(row);
      					console.log('row results : ' + JSON.stringify(result.rows));
        			});
				/*
        			contents.on("row", function (row, result) { 
            			result.addRow(row); 
        			});
        			*/
        			console.log('Contents ::: ' + contents);
        			contents.on("end", function (result) {          
				console.log('Vendor Master queried');
				client.end();
			});
			}
		  
		
		if(contents!='')
		{
			
			  if(vendorid)
			  {
				  res.redirect(303,'dashboard?vendorid='+vendorid);
			  }
			  else
			  {
				  res.redirect(303,'login');
			  }
		}
		else
		{
			res.redirect(303,'login');
		}
	
  
});

  //console.log("vendor id::"+vendorid);



	
});

app.get('/changepassword', function(req,res,next){
	console.log('in changepaswd get ejs');
	
	var vendorid_val;
	vendorid_val=req.query.vendorid;
		console.log('vendorid_val::'+vendorid_val);

		if(vendorid_val)
		{
		//console.log('vendorid_val present::'+vendorid_val);	
		res.render('changepassword',{v_id:req.query.vendorid});
		}
		else
		{
			//console.log('vendorid_val not present::'+vendorid_val);	
			res.render('changepassword',{v_id:null});
		}
	
	
});

app.post('/changepassword', function(req,res,next){
	
	
	module.exports.rec_type = 'ProfileView';	
	
	console.log('in changepaswd post ejs');
	
	var email_val=req.body.your_email;
	var new_password_val=req.body.new_password;
	var confirm_password_val=req.body.confirm_password;
	
	console.log('email_val:'+email_val);
	console.log('new_password_val:'+new_password_val);
	console.log('confirm_password_val:'+confirm_password_val);
	
	var conString = process.env.DATABASE_URL ;
    	var client = new pg.Client(conString);
        client.connect();
        var contents = client.query("select * from vendor_master where email_id='"+email_val+"'");
        contents.on("end", function (result) {          
	console.log('Vendor Master queried for password change');
	client.end();
        });
	
	//var contents = db.exec("select * from vendor_master where email_id='"+email_val+"'");

if(contents!='')
{
	
	function onFailure(err) {
  process.stderr.write("Refresh Failed: " + err.message + "\n");
  process.exit(1);
	}

//var rest_params = {event:"edit",rec_id:req.body.ns_id,address:req.body.address,fax:req.body.fax,phone:req.body.phone,alt_phone:req.body.altphone,email:req.body.email};

var rest_params = {event:"changepassword",email:email_val,password:confirm_password_val};


// This will try the cached version first, if not there will run and then cache 

var vendorid=null;
search.run(rest_params, function (err, results) {
  if (err) onFailure(err);
  console.log(JSON.stringify(results));
  
   console.log('Results login::'+results);
	console.log('Results login msg::'+results.message);
	console.log('Results login st::'+results.status);
  
	if(results.status=='Successful')
	{
	
				//alert("Password updated successfully! Please Login with new password.");
				//window.location.href("login.html");
				res.redirect(303,'login');
				
	}			
	else
	{
				//alert("Password update failed, Please try again!");
				//window.location.href("changepassword.html");
				res.redirect(303,'changepassword');
	}
		

});
}
else
{
	res.redirect(303,'changepassword');
}
		
  
  
});

 

/* GET profile view page. */
app.get('/profileview', function(req, res, next) { // route for '/'

if(id)
{
console.log("Profile view page ");

console.log("vendor_id  "+req.query.vendorid);

id=req.query.vendorid;  

	var conString = process.env.DATABASE_URL ;
    	var client = new pg.Client(conString);
        client.connect();
        var contents = client.query("select * from vendor_master where vendor_ns_id="+id);
        contents.on("end", function (result) {          
	console.log('Vendor Master queried for profile details');
	client.end();
        });
//var contents = db.exec("select * from vendor_master where vendor_ns_id="+id);
	console.log("contents length : "+contents[0]["values"].length);
	for (var i=0; i<contents[0]["values"].length; i++) 
	{
		 name_val = contents[0]["values"][i][1]; 
		 lastname_val = contents[0]["values"][i][2];
		 email_val = contents[0]["values"][i][3];
		 phone_val = contents[0]["values"][i][4];
		 address_val = contents[0]["values"][i][5];
		altphone_val = contents[0]["values"][i][7];
		fax_val = contents[0]["values"][i][8];
		 vendor_name= name_val+' '+lastname_val; 
		console.log("name_val "+name_val);
	}
	
  res.render('profileview', { //render the index.ejs
	 
	  v_id:id,
	  name:vendor_name,
	  email:email_val,
	  address:address_val,
	  phone:phone_val,
	  fax:fax_val,
	  altphone:altphone_val
	  
  });
  }
else
{
	res.render('signout',{});
}
});

/*GET profile edit page. */
app.get('/profileedit', function(req, res, next) { // route for '/'

if(id)
{
	console.log("Profile edit page ");

console.log("vendor_id  "+req.query.vendorid);

id=req.query.vendorid;  

var conString = process.env.DATABASE_URL ;
    	var client = new pg.Client(conString);
        client.connect();
        var contents = client.query("select * from vendor_master where vendor_ns_id="+id);
        contents.on("end", function (result) {          
	console.log('Vendor Master queried for editing profile details');
	client.end();
        	
        });

//var contents = db.exec("select * from vendor_master where vendor_ns_id="+id);
	console.log("contents length : "+contents[0]["values"].length);
	for (var i=0; i<contents[0]["values"].length; i++) 
	{
		vendor_id = contents[0]["values"][i][0]; 
		 name_val = contents[0]["values"][i][1]; 
		 lastname_val = contents[0]["values"][i][2];
		 email_val = contents[0]["values"][i][3];
		 phone_val = contents[0]["values"][i][4];
		 address_val = contents[0]["values"][i][5];
		altphone_val = contents[0]["values"][i][7];
		fax_val = contents[0]["values"][i][8];
		 vendor_name= name_val+' '+lastname_val; 
		console.log("address_val "+address_val);
	}
	
  res.render('profileedit', { //render the index.ejs
	 
	  name:vendor_name,
	  email:email_val,
	  address:address_val,
	  phone:phone_val,
	  fax:fax_val,
	  altphone:altphone_val,
	  ns_id:vendor_id,
	  v_id:vendor_id
	  
  });
}
else
{
	res.render('signout',{});
}


});

/*POST profile edit page. */
app.post('/profileedit',function(req,res){
	
if(id)
{
	module.exports.rec_type = 'ProfileView';	
		
	
	
	
	
function onFailure(err) {
  process.stderr.write("Refresh Failed: " + err.message + "\n");
  process.exit(1);
}

var rest_params = {event:"edit",rec_id:req.body.ns_id,address:req.body.address,fax:req.body.fax,phone:req.body.phone,alt_phone:req.body.altphone,email:req.body.email};


// This will try the cached version first, if not there will run and then cache 
search.run(rest_params, function (err, results) {
  if (err) onFailure(err);
  console.log(JSON.stringify(results));
  
   console.log('Results login::'+results);
	console.log('Results login msg::'+results.message);
	console.log('Results login st::'+results.status);
	
	//res.redirect(303,'/profileview?vendorid='+req.body.ns_id);
	
	 if(results.status=='Successful')
	{

		
		var conString = process.env.DATABASE_URL ;
    		var client = new pg.Client(conString);
        	client.connect();
        	var contents = client.query("update vendor_master set email_id='"+req.body.email+"', phone='"+req.body.phone+"',address='"+req.body.address+"',alt_phone='"+req.body.altphone+"',fax ='"+req.body.fax+"' where vendor_ns_id="+req.body.ns_id);
        	contents.on("end", function (result) {          
		console.log('Vendor Master queried for editing profile details');
		client.end();
        	});

		//db.run("update vendor_master set email_id='"+req.body.email+"', phone='"+req.body.phone+"',address='"+req.body.address+"',alt_phone='"+req.body.altphone+"',fax ='"+req.body.fax+"' where vendor_ns_id="+req.body.ns_id);
	

		/*
		var data = db.export();
		var buffer = new Buffer(data);
		console.log('fs::'+fs);
		fs.writeFileSync("supplier_master.db", buffer);
		*/
		
		
		//fs.writeFileSync("https://github.com/shaurya93/Supplier-Portal/blob/master/node_modules/supplier_master.db", buffer);		
		
/*var xhr = new XMLHttpRequest();
		xhr.open('GET', 'supplier_master.db', true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function(e) {
  		var uInt8Array = new Uint8Array(this.response);
  		var db = new SQL.Database(uInt8Array);
  		//var contents = db.exec("SELECT * FROM my_table");
  		db.run("update vendor_master set email_id='"+req.body.email+"', phone='"+req.body.phone+"',address='"+req.body.address+"',alt_phone='"+req.body.altphone+"',fax ='"+req.body.fax+"' where vendor_ns_id="+req.body.ns_id);
  		// contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
		};
		xhr.send();
	*/	
		
		
		res.redirect(303,'/profileview?vendorid='+req.body.ns_id);
	}
	else
	{
		res.redirect(303,'/dashboard');
	} 
  
});

//console.log('results:'+results);
	
}
else
{
	res.render('signout',{});
}
	
});

/* GET Purchase Order List Pages. */
app.get('/postatusview', function(req, res, next) { // route for '/'

if(id)
{
	console.log("Purchase Order status page ");
	//console.log("vendor_id  "+req.query.vendorid);
	console.log("status  "+req.query.po_status);
	console.log("id "+id);
	console.log("vendor_name "+vendor_name);
		
//var id=req.query.vendorid;  
	var postatus=req.query.po_status;  
//var postatus='Pending';
	var page_title='Purchase Order '+postatus;
	var po_number=new Array();
	var po_id=new Array();
	var po_status=new Array();
	var date_create=new Array();
	var amount=new Array();
	var time_stamp='';
/*var conString = process.env.DATABASE_URL ;
var client = new pg.Client(conString);
client.connect();
*/
	var fields_timestamp_details= {key:"rec_type",operator:"=",value:'PurchaseOrder'};
	dbs.query('timestamp',fields_timestamp_details);
	dbs.readData(function (result){
		console.log("result timestamp details :: "+ result);
		time_stamp = result[0].localtime;
		console.log("time_stamp "+time_stamp);
		});

/*var timestamp_contents = client.query("select localtime from timestamp where rec_type= 'PurchaseOrder'");
contents.on("end", function (result) {          
console.log('Purchase Order View');
});
//var timestamp_contents = db.exec("select timestamp from timestamp where rec_type= 'PurchaseOrder'");
//var timestamp_contents = db.exec("select localtime from timestamp where rec_type= 'PurchaseOrder'");
if(timestamp_contents!='')
{
time_stamp=timestamp_contents[0]["values"][0][0];
console.log("time_stamp  "+time_stamp);
}
*/
	//setTimeout(function () {
	if(postatus=='allorder')
	{
		console.log("status is all orders");
		
		dbs.query('purchase_order',null);
		dbs.readData(function (result){
		console.log("result purchase order details with status all orders :: "+ result);
		//time_stamp = result[0].localtime;
		
		if(result != null)
		{
			console.log("contents length : ");
		/*	for (var i=0; i<contents[0]["values"].length; i++) 
			{
				po_id[i] = contents[0]["values"][i][0]; 
				po_number[i] = contents[0]["values"][i][2]; 
				po_status[i] = contents[0]["values"][i][13]; 
				date_create[i] = contents[0]["values"][i][1];
				amount[i] = contents[0]["values"][i][16];
		
				console.log("po_number "+po_number);
				console.log("po_status "+po_status);
				console.log("date_create "+date_create);
				console.log("amount "+amount);
	
				console.log("*****************************");
			}
			*/
			 res.render('postatusview', { //render the index.ejs
	 
			 tran_no:po_number,
	  		 tran_id:po_id,
			 tran_status:po_status,
	  		 tran_date:date_create,
	  		 tran_amount:amount,
	   		 title:page_title,
	  		 vendorname:vendor_name,
	  		 v_id:id,
	  		 statuspo:postatus,
	  		 time_stamp_val:time_stamp,
	  		 contentlength:10
	  
  			});
		}
		else
		{
			res.render('postatusview',{
			 	 contentlength:0,
				 title:page_title,
				 statuspo:postatus,
				 vendorname:vendor_name,
			 	 time_stamp_val:time_stamp,
				 v_id:id
			});
		}	
		//},5000);
	});
	}
		/*	
			var contents = client.query("select * from purchase_order");
			contents.on("end", function (result) {          
			console.log('Purchase Order View');
				
			});

		*/	
			//var contents = db.exec("select * from purchase_order");
		

	else
	{
		var fields_postatus_details= {key:"order_status",operator:"=",value:postatus};
		dbs.query('purchase_order',fields_postatus_details);
		dbs.readData(function (result){
		console.log("result purchase order details :: "+ result);
		//time_stamp = result[0].localtime;
		//setTimeout(function () {
		if(result != null)
		{
			console.log("contents length : ");
		/*	for (var i=0; i<contents[0]["values"].length; i++) 
			{
				po_id[i] = contents[0]["values"][i][0]; 
				po_number[i] = contents[0]["values"][i][2]; 
				po_status[i] = contents[0]["values"][i][13]; 
				date_create[i] = contents[0]["values"][i][1];
				amount[i] = contents[0]["values"][i][16];
		
				console.log("po_number "+po_number);
				console.log("po_status "+po_status);
				console.log("date_create "+date_create);
				console.log("amount "+amount);
	
				console.log("*****************************");
			}
			*/
			 res.render('postatusview', { //render the index.ejs
	 
			 tran_no:po_number,
	  		 tran_id:po_id,
			 tran_status:po_status,
	  		 tran_date:date_create,
	  		 tran_amount:amount,
	   		 title:page_title,
	  		 vendorname:vendor_name,
	  		 v_id:id,
	  		 statuspo:postatus,
	  		 time_stamp_val:time_stamp,
	  		 contentlength:10
	  
  			});
		}
		else
		{
			res.render('postatusview',{
			 	 contentlength:0,
				 title:page_title,
				 statuspo:postatus,
				 vendorname:vendor_name,
			 	 time_stamp_val:time_stamp,
				 v_id:id
			});
		}	
		//},5000);	
		});
		
		/*
		var contents = client.query("select * from purchase_order where order_status='"+postatus+"'");
		contents.on("end", function (result) {          
		console.log('Purchase Order View');
				
			});
		*/
		//var contents = db.exec("select * from purchase_order where order_status='"+postatus+"'");

}
/*
console.log("contents  "+contents);

	if(contents != '')
	{
		console.log("contents length : "+contents[0]["values"].length);
	for (var i=0; i<contents[0]["values"].length; i++) 
	{
		po_id[i] = contents[0]["values"][i][0]; 
		po_number[i] = contents[0]["values"][i][2]; 
		po_status[i] = contents[0]["values"][i][13]; 
		date_create[i] = contents[0]["values"][i][1];
		amount[i] = contents[0]["values"][i][16];
		
		console.log("po_number "+po_number);
		console.log("po_status "+po_status);
		console.log("date_create "+date_create);
		console.log("amount "+amount);
	
		console.log("*****************************");
	}
	
  res.render('postatusview', { //render the index.ejs
	 
	  tran_no:po_number,
	  tran_id:po_id,
	  tran_status:po_status,
	  tran_date:date_create,
	  tran_amount:amount,
	  title:page_title,
	  vendorname:vendor_name,
	  v_id:id,
	  statuspo:postatus,
	  time_stamp_val:time_stamp,
	  contentlength:10
	  
  });
	}
	else
	{
		res.render('postatusview',{
			 contentlength:0,
			 title:page_title,
			 statuspo:postatus,
			 vendorname:vendor_name,
			 time_stamp_val:time_stamp,
			 v_id:id
		});
	}
	*/
}
else
{
	res.render('signout',{});
}

//client.end();
//

});


/* GET poview page*/
app.get('/poview', function(req, res, next) { // route for '/'

if(id)
{
	console.log("PO View page ");

		po_ns_id=req.query.po_ns_id;
		console.log("po_ns_id  "+po_ns_id);

		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		var contents = client.query("select * from purchase_order where PO_NS_ID = "+po_ns_id);
		contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var contents = db.exec("select * from purchase_order where PO_NS_ID = "+po_ns_id);
		console.log("contents length : "+contents[0]["values"].length);
	
		for (var i=0; i<contents[0]["values"].length; i++) 
		{
			po_ns_id_val= contents[0]["values"][i][0];
			trandate_val = contents[0]["values"][i][1]; 
			ponum_val = contents[0]["values"][i][2];
			curreny_val = contents[0]["values"][i][3];
			memo_val = contents[0]["values"][i][4];
			ack_date_val = contents[0]["values"][i][5];
			ex_fact_date_val = contents[0]["values"][i][6];
			wh_arriaval_date_val = contents[0]["values"][i][7];
			date_created_val = contents[0]["values"][i][8];
			delivery_method_val = contents[0]["values"][i][9];
			shipping_pt_val = contents[0]["values"][i][10];
			shipping_term_val = contents[0]["values"][i][11];
			ship_to_val = contents[0]["values"][i][12];
			order_status_val = contents[0]["values"][i][13];
			response_status_val = contents[0]["values"][i][14];
			timestamp_val = contents[0]["values"][i][15];
			total_val=contents[0]["values"][i][16];
			
		} 
		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		var po_line_contents = client.query("select * from po_lines where PO_NS_ID = "+po_ns_id);
		contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var po_line_contents = db.exec("select * from po_lines where PO_NS_ID = "+po_ns_id);
		
		if(po_line_contents!='')
		{
		console.log("po_line_contents length : "+po_line_contents[0]["values"].length);
		var items_data = new Array();
		
		for (var i=0; i<po_line_contents[0]["values"].length; i++) 
		{
			var item = new Object();
			
			item.item_id_val= po_line_contents[0]["values"][i][0];
			console.log("item.item_id_val  "+item.item_id_val);
			
			item.item_name_val = po_line_contents[0]["values"][i][1]; 
			item.po_ns_id_val = po_line_contents[0]["values"][i][2];
			item.description_val = po_line_contents[0]["values"][i][3];
			item.quantity_val = po_line_contents[0]["values"][i][4];
			item.rate_val = po_line_contents[0]["values"][i][5];
			item.amount_val = po_line_contents[0]["values"][i][6]; 
			item.tax_code_summ_val = po_line_contents[0]["values"][i][8];
			item.tax_amt_val = po_line_contents[0]["values"][i][9]; 
			items_data.push(item);
			
		}  
		
		console.log("items_data "+items_data);
		console.log("items_data "+JSON.stringify(items_data));
		
	res.render('poview', { //render the index.ejs
	 
	 v_id:id,
	 vendorname:vendor_name,
	 po_internal_id:po_ns_id,
	  po_num:ponum_val,
	  date_created:date_created_val,
	  ship_to:ship_to_val,
	  ex_fact_date:ex_fact_date_val,
	  wh_arriaval_date:wh_arriaval_date_val,
	  delivery_method:delivery_method_val,
	  shipping_pt:shipping_pt_val,
	  shipping_term:shipping_term_val,
	  items:items_data,
	  line_length:po_line_contents[0]["values"].length,
	  order_status:order_status_val
  });
}
else
{
		res.render('poview', { //render the index.ejs
	 
	  v_id:id,
	  vendorname:vendor_name,
	  po_internal_id:po_ns_id,
	  po_num:ponum_val,
	  date_created:date_created_val,
	  ship_to:ship_to_val,
	  ex_fact_date:ex_fact_date_val,
	  wh_arriaval_date:wh_arriaval_date_val,
	  delivery_method:delivery_method_val,
	  shipping_pt:shipping_pt_val,
	  shipping_term:shipping_term_val,
	  line_length:0,
	  order_status:order_status_val
	  
  });
}		
}
else
{
	res.render('signout',{});
}
	
});

/*GET refresh page for PO */
app.get('/refresh',function(req, res, next) {
	
	if(id)
{
		
	console.log("Purchase Order Refresh page ");
	
	//RecordType.rec_type=req.query.record_type;
	var rec_type=req.query.record_type;
	module.exports.rec_type = rec_type;

		console.log("rec_type  "+rec_type);
	var postatus=req.query.po_status;
		console.log("postatus  "+postatus);

	if(postatus!='none')	
	{
		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		var contents = client.query("select timestamp from timestamp where rec_type='"+rec_type+"'");
		contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var contents = db.exec("select timestamp from timestamp where rec_type='"+rec_type+"'");

			var time_stamp=contents[0]["values"][0][0];
					console.log("time_stamp  "+time_stamp);

			var rest_params = {"vendor_id":vendor_name,"event":"refresh","timestamp":time_stamp};
	}
	else
	{
		var poid=req.query.po_id;
		console.log("poid  "+poid);
		
		var rest_params = {"vendor_id":vendor_name,"event":"refresh","po_id_ns":poid};
	}
	

			
	
function onFailure(err) {
  process.stderr.write("Refresh Failed: " + err.message + "\n");
  process.exit(1);
}

// This will try the cached version first, if not there will run and then cache
// trigger the restlet
 
search.run(rest_params, function (err, results) {
  if (err) onFailure(err);
 
 if(results.status!='fail')		
{
   console.log('results:::'+results);
  var parsed_response=JSON.stringify(results);
	console.log('parsed_response:::'+parsed_response);
  var header=results.refreshstatus;
   
  var data_len=results.podetails.length;
		
	console.log('status::'+header);
	console.log('datalength::'+data_len);
	console.log('itemdatalength::'+results.podetails[0].itempush.length);
	console.log("tranID : "+results.podetails[0].tranID);
	console.log("item_id : "+results.podetails[0].itempush[0].itemID);
	console.log("timestamp : "+results.updatetimestamp);

	
// create an arry of existing POs	
	
	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var po_contents = client.query("select PO_NS_ID from purchase_order");
	contents.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
			
	});
	
	//var po_contents = db.exec("select PO_NS_ID from purchase_order");

	var po_list=new Array(); 
	
	if(po_contents!='')
	{
			for(var r=0;r<po_contents[0]["values"].length; r++) 
				{
					po_list[r]=po_contents[0]["values"][r][0];
				}
	
		console.log('po_list array::'+po_list);
	}
	

// create a arry of existing POs	
	
	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var po_line_contents = client.query("select PO_NS_ID,ITEM_ID from po_lines");
	contents.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
			
	});
	
	//var po_line_contents = db.exec("select PO_NS_ID,ITEM_ID from po_lines");
	

	var po_line_list=new Array(); 
	
		if(po_line_contents!='')
	{
	
			for(var r=0;r<po_line_contents[0]["values"].length; r++) 
			{
				po_line_list[r]=new Array();
				po_line_list[r][0]=po_line_contents[0]["values"][r][0];
				po_line_list[r][1]=po_line_contents[0]["values"][r][1];

			}
					console.log('po_line_list array::'+po_line_list);
	}
	
	
	function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}
	
		
// insert or update PO and PO lines
	 for(var i=0;i<results.podetails.length;i++)
	{
		console.log('in i loop::');
		
		var index=po_list.indexOf(parseInt(results.podetails[i].tranID));
		console.log('index::'+index);
		
		var order_status=results.podetails[i].ordstatus;
			console.log('order_status::'+order_status);
		var ack_check=results.podetails[i].ack_check;
			console.log('ack_check::'+ack_check);
		
			if(order_status=='pendingReceipt' && ack_check=='F' )
			{
				order_status='Pending Acknowledge';
			}
			else if(order_status=='pendingReceipt' && ack_check=='T' )
			{
				order_status='Acknowledged';
			}
			else if(order_status=='pendingBillPartReceived' || order_status=='pendingBilling' )
			{
				order_status='Pending Billing';
			}
			else if(order_status=='fullyBilled')
			{
				order_status='Fully Billed';
			}
			else if(order_status=='pendingReceipt' ||order_status=='pendingBillPartReceived'||order_status=='partiallyReceived')
			{
				order_status='Pending Delivery';
			}
			console.log('order_status::'+order_status);
	
			
		if(index<0)
		{
			var conString = process.env.DATABASE_URL ;
			var client = new pg.Client(conString);
			client.connect();
			client.query("insert into purchase_order('po_ns_id','tran_date','currency','memo','ex_factory_date','wh_arrival_date','delivery_method','ship_to','order_status','po_number','total','shipping_terms')values('"+results.podetails[i].tranID+"','"+results.podetails[i].tranDate+"','"+results.podetails[i].currency+"','"+results.podetails[i].memo+"','"+results.podetails[i].exfact+"','"+results.podetails[i].wharrival+"','"+results.podetails[i].delmethod+"','"+results.podetails[i].shipto+"','"+order_status+"','"+results.podetails[i].poNumber+"','"+results.podetails[i].total+"','"+results.podetails[i].shippoint+"')");			
			client.end();
			//db.run("insert into purchase_order('po_ns_id','tran_date','currency','memo','ex_factory_date','wh_arrival_date','delivery_method','ship_to','order_status','po_number','total','shipping_terms')values('"+results.podetails[i].tranID+"','"+results.podetails[i].tranDate+"','"+results.podetails[i].currency+"','"+results.podetails[i].memo+"','"+results.podetails[i].exfact+"','"+results.podetails[i].wharrival+"','"+results.podetails[i].delmethod+"','"+results.podetails[i].shipto+"','"+order_status+"','"+results.podetails[i].poNumber+"','"+results.podetails[i].total+"','"+results.podetails[i].shippoint+"')");
		}
		else
		{
			var conString = process.env.DATABASE_URL ;
			var client = new pg.Client(conString);
			client.connect();			
			client.query("update purchase_order set po_ns_id='"+results.podetails[i].tranID+"',tran_date='"+results.podetails[i].tranDate+"',currency='"+results.podetails[i].currency+"',memo='"+results.podetails[i].memo+"',ex_factory_date='"+results.podetails[i].exfact+"',wh_arrival_date='"+results.podetails[i].wharrival+"',delivery_method='"+results.podetails[i].delmethod+"',ship_to='"+results.podetails[i].shipto+"',order_status='"+order_status+"',po_number='"+results.podetails[i].poNumber+"',total='"+results.podetails[i].total+"',SHIPPING_TERMS='"+results.podetails[i].shippoint+"' where po_ns_id= '"+results.podetails[i].tranID+"'"); 
			client.end();
			//db.run("update purchase_order set po_ns_id='"+results.podetails[i].tranID+"',tran_date='"+results.podetails[i].tranDate+"',currency='"+results.podetails[i].currency+"',memo='"+results.podetails[i].memo+"',ex_factory_date='"+results.podetails[i].exfact+"',wh_arrival_date='"+results.podetails[i].wharrival+"',delivery_method='"+results.podetails[i].delmethod+"',ship_to='"+results.podetails[i].shipto+"',order_status='"+order_status+"',po_number='"+results.podetails[i].poNumber+"',total='"+results.podetails[i].total+"',SHIPPING_TERMS='"+results.podetails[i].shippoint+"' where po_ns_id= '"+results.podetails[i].tranID+"'"); 
		
		}
		 
		 
				 for(var j=0;j<results.podetails[i].itempush.length;j++)
			{
				console.log('in j loop::'+[results.podetails[i].tranID,results.podetails[i].itempush[j].itemID]);
				
				var is_exist=isItemInArray(po_line_list,[results.podetails[i].tranID,results.podetails[i].itempush[j].itemID]);
				
				console.log('is_exist::'+is_exist);
				
				if(!is_exist)
				{
						
						var conString = process.env.DATABASE_URL ;
						var client = new pg.Client(conString);
						client.connect();			
						client.query("insert into po_lines('po_ns_id','item_id','qty','rate','amount','item_name','description') values('"+results.podetails[i].tranID+"','"+results.podetails[i].itempush[j].itemID+"','"+results.podetails[i].itempush[j].itemQty+"','"+results.podetails[i].itempush[j].itemUnitPrice+"','"+results.podetails[i].itempush[j].amount+"','"+results.podetails[i].itempush[j].itemName+"','"+results.podetails[i].itempush[j].itemName+"')"); 
						client.end();
						
						//db.run("insert into po_lines('po_ns_id','item_id','qty','rate','amount','item_name','description') values('"+results.podetails[i].tranID+"','"+results.podetails[i].itempush[j].itemID+"','"+results.podetails[i].itempush[j].itemQty+"','"+results.podetails[i].itempush[j].itemUnitPrice+"','"+results.podetails[i].itempush[j].amount+"','"+results.podetails[i].itempush[j].itemName+"','"+results.podetails[i].itempush[j].itemName+"')"); 
				}
				else
				{
					var conString = process.env.DATABASE_URL ;
					var client = new pg.Client(conString);
					client.connect();			
					client.query("update po_lines set po_ns_id='"+results.podetails[i].tranID+"',item_id='"+results.podetails[i].itempush[j].itemID+"',qty='"+results.podetails[i].itempush[j].itemQty+"',rate='"+results.podetails[i].itempush[j].itemUnitPrice+"',amount='"+results.podetails[i].itempush[j].amount+"',item_name='"+results.podetails[i].itempush[j].itemName+"',description='"+results.podetails[i].itempush[j].itemName+"' where po_ns_id= '"+results.podetails[i].tranID+"' AND item_id='"+results.podetails[i].itempush[j].itemID+"'"); 
					client.end();
					//db.run("update po_lines set po_ns_id='"+results.podetails[i].tranID+"',item_id='"+results.podetails[i].itempush[j].itemID+"',qty='"+results.podetails[i].itempush[j].itemQty+"',rate='"+results.podetails[i].itempush[j].itemUnitPrice+"',amount='"+results.podetails[i].itempush[j].amount+"',item_name='"+results.podetails[i].itempush[j].itemName+"',description='"+results.podetails[i].itempush[j].itemName+"' where po_ns_id= '"+results.podetails[i].tranID+"' AND item_id='"+results.podetails[i].itempush[j].itemID+"'"); 
				}
			} 
		}
		
	
		var date_obj=new Date();
	Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

var date_obj = new Date,
    current_date = [(date_obj.getMonth()+1).padLeft(),
               date_obj.getDate().padLeft(),
               date_obj.getFullYear()].join('/') +' ' +
              [date_obj.getHours().padLeft(),
               date_obj.getMinutes().padLeft(),
               date_obj.getSeconds().padLeft()].join(':');

		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();			
		client.query("update timestamp set timestamp='"+results.updatetimestamp+"',localtime='"+current_date+"' where rec_type='"+rec_type+"'");
		client.end();
			
		//db.run("update timestamp set timestamp='"+results.updatetimestamp+"',localtime='"+current_date+"' where rec_type='"+rec_type+"'");
		
	/*var data = db.export();
	var buffer = new Buffer(data);
		console.log('fs::'+fs);
	fs.writeFileSync("supplier_master.db", buffer);
	 */
	 
 
}	
		

});
	
if(postatus!='none')
{
	setTimeout(function () {
           res.redirect(303,'/postatusview?po_status='+postatus);
        }, 5000);
	
	
}
else
{
	setTimeout(function () {
           res.redirect(303,'/poview?po_ns_id='+poid);
        }, 5000);
	
	
}
}
else
{
	res.render('signout',{});
}

});

//*************************************************************************************************

/*GET refresh page for bills. */
app.get('/refreshbills',function(req, res, next) {
	
if(id)
{
		console.log("Bills Refresh page ");
	
	//RecordType.rec_type=req.query.record_type;
	var rec_type='Bills';
	module.exports.rec_type = rec_type;

	console.log("rec_type  "+rec_type);
	
	var billstatus=req.query.bill_status;
		console.log("billstatus  "+billstatus);

	if(billstatus=='none')	
	{
		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		var contents = client.query("select timestamp from timestamp where rec_type='"+rec_type+"'");
		contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var contents = db.exec("select timestamp from timestamp where rec_type='"+rec_type+"'");

		var time_stamp=contents[0]["values"][0][0];
		console.log("time_stamp  "+time_stamp);

		var rest_params = {"vendor_id":vendor_name,"event":"refresh","timestamp":time_stamp};
	}
	else
	{
		var billid=req.query.bill_id;
		console.log("billid  "+billid);
		
		var rest_params = {"vendor_id":vendor_name,"event":"refresh","bill_id_ns":billid};
	}
	

			
	
function onFailure(err) {
  process.stderr.write("Refresh Failed: " + err.message + "\n");
  process.exit(1);
}

// This will try the cached version first, if not there will run and then cache
// trigger the restlet
 
search.run(rest_params, function (err, results) {
  if (err) onFailure(err);
 
 if(results.status=='Successful')
 {
	 
 
   console.log('results:::'+results);
  var parsed_response=JSON.stringify(results);
	console.log('parsed_response:::'+parsed_response);
  var header=results.refreshstatus;
  	

   
  var data_len=results.billdetails.length;
  console.log('data_len:::'+data_len);
		
	console.log('status::'+header);
	console.log('datalength::'+data_len);
	console.log('itemdatalength::'+results.billdetails[0].itempush.length);
	console.log("tranID : "+results.billdetails[0].tranID);
	console.log("item_id : "+results.billdetails[0].itempush[0].itemID);
	console.log("timestamp : "+results.updatetimestamp);

	
// create an arry of existing POs	
	
	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var bill_contents = client.query("select BILL_LIST_NS_ID from BILL_LIST");
	/*contents.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
		
	});
	*/
	//var bill_contents = db.exec("select BILL_LIST_NS_ID from BILL_LIST");

	var bill_list=new Array(); 
	
	if(bill_contents!='')
	{
			for(var r=0;r<bill_contents[0]["values"].length; r++) 
				{
					bill_list[r]=bill_contents[0]["values"][r][0];
				}
	
		console.log('bill_list array::'+bill_list);
	}
	

// create a arry of existing POs	
	var bill_line_contents = client.query("select BILL_LIST_NS_ID,ITEM_ID from BILL_LIST_LINES");
	

	var bill_line_list=new Array(); 
	
		if(bill_line_contents!='')
	{
	
			for(var r=0;r<bill_line_contents[0]["values"].length; r++) 
			{
				bill_line_list[r]=new Array();
				bill_line_list[r][0]=bill_line_contents[0]["values"][r][0];
				bill_line_list[r][1]=bill_line_contents[0]["values"][r][1];

			}
					console.log('bill_line_list array::'+bill_line_list);
	}
	
	
	function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}
	
		
// insert or update PO and PO lines
	 for(var i=0;i<results.billdetails.length;i++)
	{
		console.log('in i loop::');
		
		var index=bill_list.indexOf(parseInt(results.billdetails[i].tranID));
		console.log('index::'+index);
		
		
		
		if(index<0)
		{
			
			client.query("insert into bill_list('BILL_LIST_NS_ID','AMOUNT','BILL_DATE','po_id','MEMO')values('"+results.billdetails[i].tranID+"','"+results.billdetails[i].total+"','"+results.billdetails[i].tranDate+"','"+results.billdetails[i].poNumber+"','"+results.billdetails[i].memo+"')");
			//db.run("insert into bill_list('BILL_LIST_NS_ID','AMOUNT','BILL_DATE','po_id','MEMO')values('"+results.billdetails[i].tranID+"','"+results.billdetails[i].total+"','"+results.billdetails[i].tranDate+"','"+results.billdetails[i].poNumber+"','"+results.billdetails[i].memo+"')");
		}
		else
		{
			client.query("update bill_list set BILL_LIST_NS_ID='"+results.billdetails[i].tranID+"',BILL_DATE='"+results.billdetails[i].tranDate+"',po_id='"+results.billdetails[i].poNumber+"',AMOUNT='"+results.billdetails[i].total+"',memo='"+results.billdetails[i].memo+"' where BILL_LIST_NS_ID= '"+results.billdetails[i].tranID+"'"); 
			//db.run("update bill_list set BILL_LIST_NS_ID='"+results.billdetails[i].tranID+"',BILL_DATE='"+results.billdetails[i].tranDate+"',po_id='"+results.billdetails[i].poNumber+"',AMOUNT='"+results.billdetails[i].total+"',memo='"+results.billdetails[i].memo+"' where BILL_LIST_NS_ID= '"+results.billdetails[i].tranID+"'"); 
		
		}
		 
		 
			for(var j=0;j<results.billdetails[i].itempush.length;j++)
			{
				
				
				
				var neg_factor_qty=1;
					if(results.billdetails[i].itempush[j].itemQty<1)
					{
						neg_factor_qty=-1;
					}
							var neg_factor_amt=1;
					if(results.billdetails[i].itempush[j].amount<1)
					{
						neg_factor_amt=-1;
					}
				
				console.log('in j loop::'+[results.billdetails[i].tranID,results.billdetails[i].itempush[j].itemID]);
				
				var is_exist=isItemInArray(bill_line_list,[results.billdetails[i].tranID,results.billdetails[i].itempush[j].itemID]);
				
				console.log('is_exist::'+is_exist);
				
				if(!is_exist)
				{
						client.query("insert into BILL_LIST_LINES('BILL_LIST_NS_ID','ITEM_ID','ITEM_NAME','DESCRIPTION','QUANTITY','tax_amount','amount')  values('"+results.billdetails[i].tranID+"','"+results.billdetails[i].itempush[j].itemID+"','"+results.billdetails[i].itempush[j].itemName+"','"+results.billdetails[i].itempush[j].itemName+"','"+results.billdetails[i].itempush[j].itemQty*neg_factor_qty+"','"+results.billdetails[i].itempush[j].taxamount+"','"+results.billdetails[i].itempush[j].amount*neg_factor_amt+"')");
						//db.run("insert into BILL_LIST_LINES('BILL_LIST_NS_ID','ITEM_ID','ITEM_NAME','DESCRIPTION','QUANTITY','tax_amount','amount')  values('"+results.billdetails[i].tranID+"','"+results.billdetails[i].itempush[j].itemID+"','"+results.billdetails[i].itempush[j].itemName+"','"+results.billdetails[i].itempush[j].itemName+"','"+results.billdetails[i].itempush[j].itemQty*neg_factor_qty+"','"+results.billdetails[i].itempush[j].taxamount+"','"+results.billdetails[i].itempush[j].amount*neg_factor_amt+"')"); 
				}
				else
				{
					client.query("update BILL_LIST_LINES set BILL_LIST_NS_ID='"+results.billdetails[i].tranID+"',ITEM_ID='"+results.billdetails[i].itempush[j].itemID+"',QUANTITY='"+results.billdetails[i].itempush[j].itemQty*neg_factor_qty+"',ITEM_NAME='"+results.billdetails[i].itempush[j].itemName+"',DESCRIPTION='"+results.billdetails[i].itempush[j].itemName+"',amount='"+results.billdetails[i].itempush[j].amount*neg_factor_amt+"',tax_amount='"+results.billdetails[i].itempush[j].taxamount+"' where BILL_LIST_NS_ID= '"+results.billdetails[i].tranID+"' AND item_id='"+results.billdetails[i].itempush[j].itemID+"'"); 	
					 //db.run("update BILL_LIST_LINES set BILL_LIST_NS_ID='"+results.billdetails[i].tranID+"',ITEM_ID='"+results.billdetails[i].itempush[j].itemID+"',QUANTITY='"+results.billdetails[i].itempush[j].itemQty*neg_factor_qty+"',ITEM_NAME='"+results.billdetails[i].itempush[j].itemName+"',DESCRIPTION='"+results.billdetails[i].itempush[j].itemName+"',amount='"+results.billdetails[i].itempush[j].amount*neg_factor_amt+"',tax_amount='"+results.billdetails[i].itempush[j].taxamount+"' where BILL_LIST_NS_ID= '"+results.billdetails[i].tranID+"' AND item_id='"+results.billdetails[i].itempush[j].itemID+"'");  
				}
			} 
		}
		var date_obj=new Date();
	Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
	
		var date_obj = new Date,
    current_date = [(date_obj.getMonth()+1).padLeft(),
               date_obj.getDate().padLeft(),
               date_obj.getFullYear()].join('/') +' ' +
              [date_obj.getHours().padLeft(),
               date_obj.getMinutes().padLeft(),
               date_obj.getSeconds().padLeft()].join(':');

		client.query("update timestamp set timestamp='"+results.updatetimestamp+"',localtime='"+current_date+"' where rec_type='"+rec_type+"'");
		//db.run("update timestamp set timestamp='"+results.updatetimestamp+"',localtime='"+current_date+"' where rec_type='"+rec_type+"'");
		client.end();
	/*var data = db.export();
	var buffer = new Buffer(data);
		console.log('fs::'+fs);
	fs.writeFileSync("supplier_master.db", buffer);
	*/
	}
	});


	
if(billstatus=='none')
{
	setTimeout(function () {
           res.redirect(303,'/billlistview');
        }, 5000);

	
}
else
{
	setTimeout(function () {
           res.redirect(303,'/billview?bill_ns_id='+billid);
        }, 5000);
	
}
}
else
{
	res.render('signout',{});
}
	

});


/* GET Bill List Pages. */
app.get('/billlistview', function(req, res, next) { // route for '/'

if(id)
{
	console.log("Bill View page ");

//var id=req.query.vendorid;  
var page_title='Vednor Bill';
var bill_id=new Array();
var date_create=new Array();
var amount=new Array();
var poid = new Array();
var memo = new Array();
var time_stamp='';

//var timestamp_contents = db.exec("select timestamp from timestamp where rec_type= 'Bills'");
//var timestamp_contents = db.exec("select localtime from timestamp where rec_type= 'Bills'");

	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var timestamp_contents = client.query("select localtime from timestamp where rec_type= 'Bills'");
	timestamp_contents.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
			
	});

if(timestamp_contents!='')
{
time_stamp=timestamp_contents[0]["values"][0][0];
console.log("time_stamp  "+time_stamp);
}

	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var contents = client.query("select * from bill_list");
	contents.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
			
	});

//var contents = db.exec("select * from bill_list");

console.log("contents  "+contents);

	if(contents != '')
	{
		console.log("contents length : "+contents[0]["values"].length);
		
		for (var i=0; i<contents[0]["values"].length; i++) 
		{
			bill_id[i] = contents[0]["values"][i][0]; 
			date_create[i] = contents[0]["values"][i][2];
			amount[i] = contents[0]["values"][i][1];
			memo[i] = contents[0]["values"][i][3];
			
			
			console.log("bill_id "+bill_id);
			console.log("date_create "+date_create);
			console.log("amount "+amount);
			console.log("memo "+memo);
			

			console.log("*****************************");
		}
	
  res.render('billlistview', { //render the index.ejs
	 
	  tran_id:bill_id,
	  tran_date:date_create,
	  tran_amount:amount,
	  tran_memo:memo,
	  title:page_title,
	  vendorname:vendor_name,
	  v_id:id,
	  time_stamp_val:time_stamp,
	  contentlength:contents[0]["values"].length
	  
  });
	}
	else
	{
		res.render('billlistview',{
			 contentlength:0,
			 title:page_title,
			 vendorname:vendor_name,
			 time_stamp_val:time_stamp,
			 v_id:id
		});
	}
}
else
{
	res.render('signout',{});
}

	
});


/* GET billview page*/
app.get('/billview', function(req, res, next) {

if(id)
{
		console.log("Bill View page ");

		bill_ns_id=req.query.bill_ns_id;
		console.log("bill_ns_id  "+bill_ns_id);

		
		var client = new pg.Client(conString);
		var conString = process.env.DATABASE_URL ;
		client.connect();
		var contents = client.query("select * from bill_list where BILL_LIST_NS_ID = "+bill_ns_id);
		contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var contents = db.exec("select * from bill_list where BILL_LIST_NS_ID = "+bill_ns_id);
		
		
			console.log("contents length : "+contents[0]["values"].length);
			for (var i=0; i<contents[0]["values"].length; i++) 
			{
			bill_ns_id_val= contents[0]["values"][i][0];
			trandate_val = contents[0]["values"][i][2]; 
			memo_val = contents[0]["values"][i][3];
			total_val=contents[0]["values"][i][1];
			poid = contents[0]["values"][i][5];

			
			} 
		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		var bill_line_contents = client.query("select * from BILL_LIST_LINES where BILL_LIST_NS_ID = "+bill_ns_id);
		bill_line_contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var bill_line_contents = db.exec("select * from BILL_LIST_LINES where BILL_LIST_NS_ID = "+bill_ns_id);
		
		if(bill_line_contents!='')
		{
			console.log("bill_line_contents length : "+bill_line_contents[0]["values"].length);
			var items_data = new Array();
		
			for (var i=0; i<bill_line_contents[0]["values"].length; i++) 
			{
			var item = new Object();
			
			item.item_id_val= bill_line_contents[0]["values"][i][1];
			console.log("item.item_id_val  "+item.item_id_val);
			
			item.item_name_val = bill_line_contents[0]["values"][i][2]; 
			item.bill_ns_id_val = bill_line_contents[0]["values"][i][0];
			item.quantity_val = bill_line_contents[0]["values"][i][4];
			item.amount_val = bill_line_contents[0]["values"][i][5]; 
			item.tax_amt_val = bill_line_contents[0]["values"][i][6]; 
			items_data.push(item);
			
			}  
		
		
		
		console.log("items_data "+items_data);
		console.log("items_data "+JSON.stringify(items_data));
		
		res.render('billview', { //render the index.ejs
	 
	  v_id:id,
	  vendorname:vendor_name,
	  bill_internal_id:bill_ns_id,
	  trandate:trandate_val,
	  po_id:poid,
	  items:items_data,	
	  tran_amount:total_val,
	  tran_memo:memo_val,
	  line_length:bill_line_contents[0]["values"].length
		});
		}		
	else
	{
		res.render('billview', { //render the index.ejs
	 
	  v_id:id,
	  vendorname:vendor_name,
	  bill_internal_id:bill_ns_id,
	  trandate:trandate_val,
	  line_length:0
	
	  
  });
	}
		
}
else
{
	res.render('signout',{});
}	// route for '/'

	
	
});


/*GET packing list status view page. */
app.get('/packingliststatusview', function(req, res, next) { // route for '/'

if(id)
{
		console.log(" packinglist_statusview page ");

	pl_status=req.query.status;
	console.log("status  "+pl_status)
	title_val = "PackingList "+pl_status;
	
	var pl_line_contents;
	if(pl_status=='allPL')
	{
		console.log("status is all orders");
		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		pl_line_contents = client.query("select packing_list_num,DATE_CREATED,po_num,STATUS,MEMO from packing_list");
		pl_line_contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//pl_line_contents = db.exec("select packing_list_num,DATE_CREATED,po_num,STATUS,MEMO from packing_list");

	}
	else
	{
		
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		pl_line_contents = client.query("select packing_list_num,DATE_CREATED,po_num,STATUS,MEMO from packing_list where STATUS ='"+pl_status+"'");
		pl_line_contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//pl_line_contents = db.exec("select packing_list_num,DATE_CREATED,po_num,STATUS,MEMO from packing_list where STATUS ='"+pl_status+"'");

	}
	if(pl_line_contents!='')
	{
		console.log("contents length : "+pl_line_contents[0]["values"].length);
	
	var pl_list_array =new Array();
	
	for (var i=0; i<pl_line_contents[0]["values"].length; i++) 
	{
		 var pl_data = new Object();
		 pl_data.packing_list_num = pl_line_contents[0]["values"][i][0];
		 pl_data.date_created = pl_line_contents[0]["values"][i][1]; 
		 pl_data.po_num = pl_line_contents[0]["values"][i][2];
		 pl_data.status = pl_line_contents[0]["values"][i][3];
		 pl_data.memo = pl_line_contents[0]["values"][i][4];
		
		
		 pl_list_array.push(pl_data);
		// console.log("pl_list_array "+pl_list_array);
	} 
	
  res.render('packingliststatusview', { //render the index.ejs
	 v_id:id,
	 vendorname:vendor_name,
	 title:title_val,
	 pl_list:pl_list_array,
	 content_length:pl_line_contents[0]["values"].length
  });
	}
	else
	{
		
	res.render('packingliststatusview', { //render the index.ejs
	 v_id:id,
	 vendorname:vendor_name,
	 title:title_val,
	 content_length:0
  });
	}
}
else
{
	res.render('signout',{});
}


	
});


/*GET create PO Packing list page. */
app.get('/packinglistcreate', function(req, res, next) { // route for '/'

if(id)
{
		console.log("create PO_packing list ");

	po_ns_id=req.query.po_ns_id;
	console.log("po_ns_id  "+po_ns_id);
	
	
	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	var contents = client.query("select PO_NUMBER,SHIP_TO,DELIVERY_METHOD from purchase_order where PO_NS_ID = "+po_ns_id);
	contents.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
			
	});
	
	//var contents = db.exec("select PO_NUMBER,SHIP_TO,DELIVERY_METHOD from purchase_order where PO_NS_ID = "+po_ns_id);
	
		console.log("contents length : "+contents[0]["values"].length);
	
		for (var i=0; i<contents[0]["values"].length; i++) 
		{
			
			ponum_val = contents[0]["values"][i][0];
			ship_to_val = contents[0]["values"][i][1];
			delivery_method_val = contents[0]["values"][i][2];		
			
		} 
		
			
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		var po_line_contents = client.query("select ITEM_ID,ITEM_NAME,PO_NS_ID,DESCRIPTION,QTY from po_lines where PO_NS_ID = "+po_ns_id);
		po_line_contents.on("end", function (result) {          
		console.log('Purchase Order View');
		client.end();
			
		});
		
		//var po_line_contents = db.exec("select ITEM_ID,ITEM_NAME,PO_NS_ID,DESCRIPTION,QTY from po_lines where PO_NS_ID = "+po_ns_id);
		if(po_line_contents!='')
		{
		console.log("po_line_contents length : "+po_line_contents[0]["values"].length);
		
		var items_data = new Array();
		
		for (var i=0; i<po_line_contents[0]["values"].length; i++) 
		{
			var item = new Object();
			var qty_dispt=0;
			
			item.item_id_val= po_line_contents[0]["values"][i][0];
			console.log("item.item_id_val  "+item.item_id_val);
			
			
			var conString = process.env.DATABASE_URL ;
			var client = new pg.Client(conString);
			client.connect();
			var pl_lines = client.query("select QTY_DISPATCHED from packing_list_lines where PO_NS_ID = '"+po_ns_id+"' AND ITEM_ID='"+item.item_id_val+"'");
			pl_lines.on("end", function (result) {          
			console.log('Purchase Order View');
			client.end();
			
		});
			
			//var pl_lines = db.exec("select QTY_DISPATCHED from packing_list_lines where PO_NS_ID = '"+po_ns_id+"' AND ITEM_ID='"+item.item_id_val+"'");
			if(pl_lines!='')
			{
				console.log(" pl_lines length"+pl_lines[0]["values"].length);
				for (var j=0; j<pl_lines[0]["values"].length; j++) 
				{
					qty_dispt += pl_lines[0]["values"][j][0];
				}
				console.log(" item qty_dispt"+qty_dispt);
			}
			
			item.item_name_val = po_line_contents[0]["values"][i][1]; 
			item.po_ns_id_val = po_line_contents[0]["values"][i][2];
			item.description_val = po_line_contents[0]["values"][i][3];
			item.quantity_val = po_line_contents[0]["values"][i][4];
			console.log(" item.quantity_val"+item.quantity_val);
			if(qty_dispt < item.quantity_val)
			{
				item.disp_qty = qty_dispt;
				items_data.push(item);
				console.log(" data pushed in item list"+item.allowed_disp_qty);
			}
			
		}  
		
		console.log("items_data "+items_data);
		console.log("items_data "+JSON.stringify(items_data));
	
  res.render('packinglistcreate', { //render the index.ejs
	  v_id:id,
	  vendorname:vendor_name,
	  po_num:ponum_val,
	  po_nsid:po_ns_id,
	  ship_to:ship_to_val,
	  delivery_method:delivery_method_val,
	  items:items_data,
	  content_lenth:po_line_contents[0]["values"].length
  });
	}
	else	
	{
	  res.render('packinglistcreate', { //render the index.ejs
	  v_id:id,
	  vendorname:vendor_name,
	  po_num:ponum_val,
	  po_nsid:po_ns_id,
	  ship_to:ship_to_val,
	  delivery_method:delivery_method_val,
	  content_lenth:0
	   });
	}
	
}
else
{
	res.render('signout',{});
}

});


/*POST po packing list create page. */
app.post('/packinglistcreate',function(req,res){
	
if(id)
{
	
	console.log('post of po_packinglistcreate');
	var max_id;
	
		
	var conString = process.env.DATABASE_URL ;
	var client = new pg.Client(conString);
	client.connect();
	client.query("insert into packing_list('SHIP_TO','SHIP_DATE','DELIVERY_METHOD','SHIPMENT_ORIGIN','SHIPMENT_POINT','STATUS','packing_list_num','po_num','DATE_CREATED','MEMO','po_ns_id') values('"+req.body.shipto+"','"+req.body.shipdate+"','"+req.body.deliverymethod+"','"+req.body.shipmentorigin+"','"+req.body.shipmentpoint+"', 'Ready to Ship','PL"+req.body.po_num+"','"+req.body.po_num+"','"+req.body.date_created+"','"+req.body.memo+"','"+req.body.po_ns_idval+"')");
	/*
	pl_lines.on("end", function (result) {          
	console.log('Purchase Order View');
	client.end();
	});
	*/
	//db.run("insert into packing_list('SHIP_TO','SHIP_DATE','DELIVERY_METHOD','SHIPMENT_ORIGIN','SHIPMENT_POINT','STATUS','packing_list_num','po_num','DATE_CREATED','MEMO','po_ns_id') values('"+req.body.shipto+"','"+req.body.shipdate+"','"+req.body.deliverymethod+"','"+req.body.shipmentorigin+"','"+req.body.shipmentpoint+"', 'Ready to Ship','PL"+req.body.po_num+"','"+req.body.po_num+"','"+req.body.date_created+"','"+req.body.memo+"','"+req.body.po_ns_idval+"')");
	//var max_id_content = db.exec("SELECT MAX(id) FROM packing_list");
	var max_id_content = client.query("SELECT MAX(id) FROM packing_list");
	if(max_id_content!='')
	{
		max_id = max_id_content[0]["values"][0][0];
		console.log('max_id_content value::'+max_id);
		client.query("update packing_list set packing_list_num='PL0"+max_id+"' where id= "+max_id); 
		//db.run("update packing_list set packing_list_num='PL0"+max_id+"' where id= "+max_id); 		
	}
			
	for(var i=0;i<req.body.rowcount;i++)
	{
		itemName = req.body['itemname' + i];
		console.log('item name==>'+itemName);
		console.log('item ID==>'+req.body['itemid' + i]);
		console.log('desc==>'+req.body['description' + i]);
		console.log('qty==>'+req.body['quantity' + i]);
		console.log('dispatched==>'+req.body['quantitydispatched' + i]);
		console.log('po_num==>'+req.body['po_num' + i]);
		console.log('net wt==>'+req.body['netweight' + i]);
		console.log('gross wt==>'+req.body['grossweight' + i]);
		console.log('Checkbox value==>'+req.body['check_remove' + i]);
		
		if(req.body['check_remove' + i]=='on')
		client.query("insert into packing_list_lines('ITEM_ID','ITEM_NAME','DESCRIPTION','QTY_ORDERED','QTY_DISPATCHED','NET_WT','GROSS_WT','packinglist_ref','REF_PO_NUM','PO_NS_ID') values('"+req.body['itemid' + i]+"','"+req.body['itemname' + i]+"','"+req.body['description' + i]+"','"+req.body['quantity' + i]+"','"+req.body['quantitydispatched' + i]+"','"+req.body['netweight' + i]+"','"+req.body['grossweight' + i]+"','PL0"+max_id+"','"+req.body['po_num' + i]+"','"+req.body.po_ns_idval+"')");
		//db.run("insert into packing_list_lines('ITEM_ID','ITEM_NAME','DESCRIPTION','QTY_ORDERED','QTY_DISPATCHED','NET_WT','GROSS_WT','packinglist_ref','REF_PO_NUM','PO_NS_ID') values('"+req.body['itemid' + i]+"','"+req.body['itemname' + i]+"','"+req.body['description' + i]+"','"+req.body['quantity' + i]+"','"+req.body['quantitydispatched' + i]+"','"+req.body['netweight' + i]+"','"+req.body['grossweight' + i]+"','PL0"+max_id+"','"+req.body['po_num' + i]+"','"+req.body.po_ns_idval+"')");
	}
	client.end();
	/*
	var data = db.export();
	var buffer = new Buffer(data);
	console.log('fs::'+fs);
	fs.writeFileSync("supplier_master.db", buffer); 
	*/
	
	res.redirect(303,'/packinglistview?pl_number=PL0'+max_id)
}
else
{
	res.render('signout',{});
}
	
}); 

/*GET Packing list View page. */
app.get('/packinglistview', function(req, res, next) { 

if(id)
{
	console.log("Packing list View page ");
	console.log("packing list number  "+req.query.pl_number);
	
	var packinglist_num=req.query.pl_number; 
	
	var pl_contents = db.exec("select SHIP_TO,SHIP_DATE,DELIVERY_METHOD,SHIPMENT_ORIGIN,SHIPMENT_POINT,packing_list_num,MEMO, STATUS from packing_list where packing_list_num='"+packinglist_num+"'");
	console.log("pl_contents length : "+pl_contents[0]["values"].length);
	
	for (var i=0; i<pl_contents[0]["values"].length; i++) 
	{
		ship_to_val = pl_contents[0]["values"][i][0];
		ship_date_val = pl_contents[0]["values"][i][1]; 
		delivery_method_val = pl_contents[0]["values"][i][2];
		ship_origin_val = pl_contents[0]["values"][i][3];
		shipment_point_val = pl_contents[0]["values"][i][4];
		pl_num_val = pl_contents[0]["values"][i][5];
		memo_val = pl_contents[0]["values"][i][6];
		status_val = pl_contents[0]["values"][i][7];
		console.log("packing list status_val  "+status_val);
	} 
	var pl_line_contents = db.exec("select ITEM_NAME,DESCRIPTION,QTY_ORDERED,QTY_DISPATCHED,NET_WT,GROSS_WT,REF_PO_NUM from packing_list_lines where packinglist_ref ='"+packinglist_num+"'");
	if(pl_line_contents !='')
	{
		
		console.log("pl_line_contents length : "+pl_line_contents[0]["values"].length);
		var pl_items_data = new Array();
		
		for (var i=0; i<pl_line_contents[0]["values"].length; i++) 
		{
			var item = new Object();
				
			item.item_name= pl_line_contents[0]["values"][i][0];
			item.item_desc = pl_line_contents[0]["values"][i][1]; 
			item.quantity = pl_line_contents[0]["values"][i][2];
			item.dispatched_qty = pl_line_contents[0]["values"][i][3];
			item.net_wt = pl_line_contents[0]["values"][i][4];
			item.gross_wt = pl_line_contents[0]["values"][i][5];
			item.po_ref_num = pl_line_contents[0]["values"][i][6];
				
			pl_items_data.push(item);
			
		}  
		
		console.log("pl_items_data "+pl_items_data);
		//console.log("pl_items_data "+JSON.stringify(pl_items_data));
	
		res.render('packinglistview', { //render the index.ejs	 
		  v_id:id,
		  vendorname:vendor_name,
		  ship_to:ship_to_val,
		  ship_date:ship_date_val,
		  delivery_method:delivery_method_val,
		  ship_origin:ship_origin_val,
		  shipment_point:shipment_point_val,
		  pl_num:pl_num_val,
		  memo:memo_val,
		  pl_status:status_val,
		  pl_items:pl_items_data,
		  pl_items_length:pl_items_data.length
		  
		});
	}
	else
	{
		res.render('packinglistview', { //render the index.ejs	 
		  v_id:id,
		  vendorname:vendor_name,
		  ship_to:ship_to_val,
		  ship_date:ship_date_val,
		  delivery_method:delivery_method_val,
		  ship_origin:ship_origin_val,
		  shipment_point:shipment_point_val,
		  pl_num:pl_num_val,
		  memo:memo_val,
		  pl_status:status_val,
		  pl_items_length:0
		  
		});
	}
	
}
else
{
	res.render('signout',{});
}
	
});


/*GET edit PO Packing list page. */
app.get('/packinglistedit', function(req, res, next) { 

if(id)
{
	
	console.log("***** GET EDIT PACKING LIST START ****** ");
	
	packinglist_num = req.query.pl_num;
	console.log("packinglist_num  "+packinglist_num);
	
	var contents = db.exec("select ship_to,ship_date,delivery_method,shipment_origin,shipment_point,Memo from packing_list where packing_list_num = '"+packinglist_num+"'");
	console.log("contents length : "+contents[0]["values"].length);
	
	for (var i=0; i<contents[0]["values"].length; i++) 
	{
			
		ship_to_val = contents[0]["values"][i][0];
		ship_to_date_val = contents[0]["values"][i][1];
		delivery_method_val = contents[0]["values"][i][2];
		shipment_origin_val = contents[0]["values"][i][3];
		shipment_point_val = contents[0]["values"][i][4];		
		memo_val = contents[0]["values"][i][5];				
			
	} 
	
	var pl_line_contents = db.exec("select item_id,item_name,description,qty_ordered,qty_dispatched,net_wt,gross_wt,REF_PO_NUM from packing_list_lines where packinglist_ref='"+packinglist_num+"'");
	if(pl_line_contents!='')
	{
		console.log("po_line_contents length : "+pl_line_contents[0]["values"].length);
		
		var items_data = new Array();
			
		for (var i=0; i<pl_line_contents[0]["values"].length; i++) 
		{
			var item = new Object();
			var qty_dispt=0;
					
			item.item_id_val = pl_line_contents[0]["values"][i][0];
			item.item_name_val = pl_line_contents[0]["values"][i][1]; 
			item.description_val = pl_line_contents[0]["values"][i][2];
			item.qty_ordered_val = pl_line_contents[0]["values"][i][3];
			item.qty_dispatched_val = pl_line_contents[0]["values"][i][4];
			item.netwt_val = pl_line_contents[0]["values"][i][5];
			item.grosswt_val = pl_line_contents[0]["values"][i][6];
			item.po_ref = pl_line_contents[0]["values"][i][7];
			
			var pl_lines = db.exec("select QTY_DISPATCHED from packing_list_lines where REF_PO_NUM = '"+item.po_ref+"' AND ITEM_ID='"+item.item_id_val+"'");
            if(pl_lines!='')
            {
				console.log(" pl_lines length"+pl_lines[0]["values"].length);
				for (var j=0; j<pl_lines[0]["values"].length; j++) 
				{
					qty_dispt += pl_lines[0]["values"][j][0];
				}
				console.log(" item qty_dispt"+qty_dispt);
            }
            item.disp_qty = qty_dispt;
			
			items_data.push(item);
				
		}  
			
		//console.log("items_data "+items_data);
		//console.log("items_data "+JSON.stringify(items_data));
		
		res.render('packinglistedit', { //render the index.ejs
		v_id:id,
		vendorname:vendor_name,
		memo:memo_val,
		pl_number:packinglist_num,
		ship_to:ship_to_val,
		ship_to_date:ship_to_date_val,
		delivery_method:delivery_method_val,
		shipment_origin:shipment_origin_val,
		shipment_point:shipment_point_val,
		items:items_data,
		pl_item_count:items_data.length
	  });
  
	}
	else
	{
		res.render('packinglistedit', { //render the index.ejs
		v_id:id,
		vendorname:vendor_name,
		memo:memo_val,
		pl_number:packinglist_num,
		ship_to:ship_to_val,
		ship_to_date:ship_to_date_val,
		delivery_method:delivery_method_val,
		shipment_origin:shipment_origin_val,
		shipment_point:shipment_point_val,
		items:{},
		pl_item_count:0
			
	  });
	}
  console.log("***** GET EDIT PACKING LIST END ****** ");
}
else
{
	res.render('signout',{});
}

  
});

/*POST po packing list edit page. */
app.post('/packinglistedit',function(req,res)
{
	
if(id)
{
		console.log("***** POST EDIT PACKING LIST START ****** ");
	
	console.log('post of po_packinglist edit');
	console.log('PL number==>'+req.body.pl_number);
	console.log('shipdate==>'+req.body.shipdate);
	console.log('rowcount==>'+req.body.rowcount);

	db.run("update packing_list set SHIP_DATE ='"+req.body.shipdate+"' where packing_list_num='"+req.body.pl_number+"'");
	
	if(rowcount>0)
	{
		for(var i=0;i<req.body.rowcount;i++)
		{
		console.log('item ID==>'+req.body['itemid' + i]);
		console.log('dispatched==>'+req.body['quantitydispatched' + i]);
		console.log('net wt==>'+req.body['netweight' + i]);
		console.log('gross wt==>'+req.body['grossweight' + i]);
		
		db.run("update packing_list_lines set QTY_DISPATCHED ='"+req.body['quantitydispatched' + i]+"',NET_WT='"+req.body['netweight' + i]+"',GROSS_WT='"+req.body['grossweight' + i]+"' where packinglist_ref='"+req.body.pl_number+"' AND ITEM_ID='"+req.body['itemid' + i]+"'");
		//db.run("update packing_list_lines set('QTY_DISPATCHED','NET_WT','GROSS_WT') values('"+req.body['quantitydispatched' + i]+"','"+req.body['netwt' + i]+"','"+req.body['grosswt' + i]+"') where packinglist_ref='"+req.body.pl_number+"' AND ITEM_ID='"+req.body['itemid' + i]+"'");
		}
	}
	
	var data = db.export();
	var buffer = new Buffer(data);
	console.log('fs::'+fs);
	fs.writeFileSync("supplier_master.db", buffer); 
	res.redirect(303,'/packinglistview?pl_number='+req.body.pl_number);
	
	console.log("***** POST EDIT PACKING LIST END ****** ");
}
else
{
	res.render('signout',{});
}
	
}); 

/*GET PL Item remove page. */
app.get('/removeplitem', function(req, res, next) { // route for '/'

	console.log("Remove PL Item page ");

	console.log("pl_num  "+req.query.pl_name);
	console.log("item_id  "+req.query.item_id);

	var contents = db.exec("delete from packing_list_lines where packinglist_ref= '"+req.query.pl_name+"' AND item_id='"+req.query.item_id+"'");
	
   res.redirect(303,'/packinglistedit?pl_num='+req.query.pl_name);
});



/*GET PL publish page. */
app.get('/publishpl',function(req, res, next) {
	
if(id)
{
	
	console.log("Publishing of Packing list started......");
	
	var pl_num = req.query.pl_name;
	console.log("pl_num  "+pl_num);
	
	//var pl_po_id = req.query.po_ns_id;
	//console.log("pl_po_id  "+pl_po_id);
	
	//RecordType.rec_type=req.query.record_type;
	var rec_type = 'PackingList';//req.query.record_type;
	module.exports.rec_type = rec_type;

	console.log("rec_type  "+rec_type);

	var contents = db.exec("select ship_to,ship_date,delivery_method,shipment_origin,po_ns_id,status,packing_list_num,DATE_CREATED,memo,SHIPMENT_POINT from packing_list where packing_list_num = '"+pl_num+"'");
	for (var i=0; i<contents[0]["values"].length; i++) 
	{
			
		ship_to_val = contents[0]["values"][i][0];
		ship_date_val = contents[0]["values"][i][1];
		delivery_method_val = contents[0]["values"][i][2];
		shipment_origin_val = contents[0]["values"][i][3];
		pl_po_id = contents[0]["values"][i][4];	
		status_val = contents[0]["values"][i][5];	
		pl_num_val = contents[0]["values"][i][6];	
		pl_date_created_val = contents[0]["values"][i][7];	
		memo_val = contents[0]["values"][i][8];	
		shipment_pt_val = contents[0]["values"][i][9];	
						
		console.log("ship_to_val  "+ship_to_val);
		
	} 
	
	var packingList = new Object();
	
	packingList.event = 'create';
	//packingList.vendorid = vendor_name;
	packingList.poid = pl_po_id;
	packingList.shipto = ship_to_val;
	packingList.shipdate = ship_date_val;
	packingList.delmethod = delivery_method_val;
	packingList.shiporigin = shipment_origin_val;
	packingList.status = status_val;
	packingList.plnum = pl_num_val;
	packingList.datecreated = pl_date_created_val;
	packingList.memo = memo_val;
	packingList.shipment_pt = shipment_pt_val;
	
	packingList.itemdetails = [];
	
	var pl_line_contents = db.exec("select item_id,qty_ordered,qty_dispatched,net_wt,gross_wt,REF_PO_NUM,DESCRIPTION from packing_list_lines where packinglist_ref='"+pl_num+"'");
	
	for (var i=0; i<pl_line_contents[0]["values"].length; i++) 
	{
		var itemdetailsVal = new Object();
				
		itemdetailsVal.item = pl_line_contents[0]["values"][i][0];
		itemdetailsVal.orderedquantity = pl_line_contents[0]["values"][i][1]; 
		itemdetailsVal.dispatchedquantity = pl_line_contents[0]["values"][i][2];
		itemdetailsVal.netwt = pl_line_contents[0]["values"][i][3];
		itemdetailsVal.grosswt = pl_line_contents[0]["values"][i][4];
		itemdetailsVal.description = pl_line_contents[0]["values"][i][6];
		itemdetailsVal.poid = pl_po_id;
		
		packingList.itemdetails[i] = itemdetailsVal;
		console.log("itemdetailsVal.description  "+itemdetailsVal.description);	
	}  	
	
	console.log('results:::'+packingList);
	var rest_params = packingList; //{"vendorid":vendor_name,"event":"create","timestamp":time_stamp,"poid":po_id,"shipto":ship_to,"shipdate":ship_date,"delmethod":del_method,"shiporigin":ship_origin,"plstatus":pl_status};

	function onFailure(err) 
	{
	  process.stderr.write("Refresh Failed: " + err.message + "\n");
	  process.exit(1);
	}
	// This will try the cached version first, if not there will run and then cache 
	search.run(rest_params, function (err, results) 
	{
		if (err) onFailure(err);
		console.log('results:::'+results.length);
		var parsed_response=JSON.stringify(results);
		console.log('parsed_response:::'+parsed_response);
								
		var pl_status = results.publishstatus;
		console.log('pl_status ::'+pl_status);
		var pl_ID = results.ns_id;
		console.log('pl_ID::'+pl_ID);
		
		if(pl_status=="Successful")
		{
			db.run("update packing_list set STATUS ='Shipped' where packing_list_num='"+pl_num+"'");
			var data = db.export();
			var buffer = new Buffer(data);
			console.log('fs::'+fs);
			fs.writeFileSync("supplier_master.db", buffer); 
			//res.redirect(303,'/packinglistview?pl_number='+pl_num);
			console.log('****************Record status supdated succesfully******************');
		}
		
		
		//console.log("tranID : "+results.podetails[0].tranID);
		//console.log("tranID : "+results.podetails[0].tranID);

	});
	
	//res.redirect(303,'/packinglistview?pl_number='+pl_num);
	
	setTimeout(function () {
         res.redirect(303,'/packinglistview?pl_number='+pl_num);
        }, 5000);
}
else
{
	res.render('signout',{});
}
	

});

/*POST packing list and po search page. */
app.post('/dashboard',function(req,res)
{
	
if(id)
{
	//transactionsearch
	console.log("***** POST transactionsearch START ****** ");
	
	console.log('post of transactionsearch');
	console.log('Search key ==>'+req.body.your_searchid);
	console.log('purchase_order_tbl ==>'+req.body.tran);
	
	var recordType = req.body.tran;
	var searchKeyValue = req.body.your_searchid;
	
	if(recordType=='Purchase Order')
	{
	
		var po_numberSrch = new Array();
		var po_idSrch = new Array();
		var po_statusSrch = new Array();
		var po_date_createSrch = new Array();
		var po_amountSrch = new Array();
		//PO12350
		//var searchContents = db.run("select * from purchase_order where po_number="+searchKeyValue+"");
		var searchContents = db.exec("select * from purchase_order where po_number='"+searchKeyValue+"'");
		
		console.log('searchContents ==>'+searchContents);
		
		if(searchContents!='')
		{
		
		
		for (var i=0; i<searchContents[0]["values"].length; i++) 
		{
			po_idSrch[i] = searchContents[0]["values"][i][0]; 
			po_numberSrch[i] = searchContents[0]["values"][i][2]; 
			po_statusSrch[i] = searchContents[0]["values"][i][14]; 
			po_date_createSrch[i] = searchContents[0]["values"][i][1];
			po_amountSrch[i] = searchContents[0]["values"][i][3];
		}
	
		//res.redirect(303,'/searchedpoview');
		
		res.render('searchedpoview', { //render the index.ejs
		vendorname:vendor_name,
		v_id:id,
		poSrchCount:searchContents[0]["values"].length,
		tran_no_srch:po_numberSrch,
		tran_id_srch:po_idSrch,
		tran_status_srch:po_statusSrch,
		tran_date_srch:po_date_createSrch,
		tran_amount_srch:po_amountSrch
		
		});
		}
		else
		{
			res.render('searchedpoview', { //render the index.ejs
			vendorname:vendor_name,
			v_id:id,
			poSrchCount:0
		
		});
		}
		
		
	}
	else if(recordType=='Packing List')
	{
			console.log("I am in PL search ");
		
		
		var pl_numberSrch = new Array();
		var pl_idSrch = new Array();
		var pl_statusSrch = new Array();
		var pl_date_createSrch = new Array();
		var pl_amountSrch = new Array();
		var pl_poNumberSrch = new Array();
		var pl_memoSrch = new Array();
		var pl_numSrch = new Array();
		
		//9002
		var searchContents = db.exec("select * from packing_list where packing_list_num='"+searchKeyValue+"'");
		console.log('searchContents pl count ==>'+searchContents);
		if(searchContents !='')
		{
			console.log("searchContents length : "+searchContents[0]["values"].length);
		
			for (var i=0; i<searchContents[0]["values"].length; i++) 
			{
				pl_idSrch[i] = searchContents[0]["values"][i][0]; 
				console.log('PL ID ==>'+searchContents[0]["values"][i][0]);
				pl_numSrch[i] = searchContents[0]["values"][i][8]; 
				console.log('PL # ==>'+searchContents[0]["values"][i][8]);
				pl_statusSrch[i] = searchContents[0]["values"][i][6]; 
				pl_date_createSrch[i] = searchContents[0]["values"][i][10];
				pl_poNumberSrch[i] = searchContents[0]["values"][i][9];
				pl_memoSrch[i] = searchContents[0]["values"][i][11];
			}
			
			//res.redirect(303,'/searchedpackinglistview');
			res.render('searchedpackinglistview', { //render the index.ejs
			vendorname:vendor_name,
			v_id:id,
			plSrchCount:searchContents[0]["values"].length,
			tran_id_srch:pl_idSrch,
			tran_num_srch:pl_numSrch,
			tran_status_srch:pl_statusSrch,
			tran_date_srch:pl_date_createSrch,
			tran_po_num_srch:pl_poNumberSrch,
			tran_memo_srch:pl_memoSrch
			
			});
			
		}
		else
		{
			res.render('searchedpackinglistview', { //render the index.ejs
			v_id:id,
			vendorname:vendor_name,
			plSrchCount:0
				
			});
		}
		
	}
	else
	{
		
	}
	
	res.redirect(303,'/searchedpackinglistview');
	
	console.log("***** POST transactionsearch END ****** ");
}
else
{
	res.render('signout',{});
}
	
}); 

/*
Get acknowledge PO
*/
app.get('/acknowledgePO', function(req,res,next){
	
if(id)
{
		console.log("Acknowledge Purchase Order......");
	
	var rec_type='PurchaseOrder';
	module.exports.rec_type = rec_type;

	
	var po_id = req.query.po_ns_id;
	console.log("po_id  "+po_id);
	
	var rest_params = {"ack_check":"T","event":"acknowledge","po_id_ns":po_id};
	
	function onFailure(err) {
		process.stderr.write("Acknowledge Failed: " + err.message + "\n");
		process.exit(1);
	}

// This will try the cached version first, if not there will run and then cache
// trigger the restlet
 
search.run(rest_params, function (err, results) {
  if (err) onFailure(err);
 
 
   console.log('results:::'+results);
  var parsed_response=JSON.stringify(results);
	console.log('parsed_response:::'+parsed_response);
  var status_ack=results.ackstatus;
   	console.log('status::'+status_ack);
	
	if(status_ack=='Successful')
	{
		db.run("update purchase_order set order_status='Acknowledged' where po_ns_id="+po_id);
	
	var data = db.export();
	var buffer = new Buffer(data);
		console.log('fs::'+fs);
	fs.writeFileSync("supplier_master.db", buffer);
	
		
	}
	
	setTimeout(function () {
           res.redirect(303,'/poview?record_type=PurchaseOrder&po_ns_id='+po_id);
        }, 3000);
	
	
});
}
else
{
	res.render('signout',{});
}
	


});

/*
terminate server
*/
app.get('/signout',function(req, res, next) {

 console.log('Logout page loaded');
 
 id=null;
 
 /* res.writeHead(302, {
  'Location': 'C:/nodeapp/public/login.html'
  //add other headers here...
});
res.end();
 */
  
	  setTimeout(function () {
            
			 //server.close();
			//sockets[3000].destroy();
            // TypeError: Object function app(req, res){ app.handle(req, res); } has no method 'close'
        }, 5);

res.render('signout',{});
		//window.location.href("login.html");
 
});



