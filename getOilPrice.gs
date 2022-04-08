function getOilPrice() { 

  var xml = `<?xml version="1.0" encoding="utf-8"?>
            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
              <soap12:Body>
                <CurrentOilPrice xmlns="http://www.pttor.com">
                  <Language>th</Language>
                </CurrentOilPrice>
              </soap12:Body>
            </soap12:Envelope>`

  var webURL = "https://orapiweb.pttor.com/oilservice/OilPrice.asmx?WSDL";

  var responseSOAP = getSoapContent(webURL, xml);  
 
  var soapNamespace = responseSOAP.getNamespace("soap");
  //console.log(soapNamespace.toString())
    
  var currentOilPriceResponse = responseSOAP.getChild("Body", soapNamespace).getChildren()[0];
  var currentOilPriceResult = currentOilPriceResponse.getChildren()[0];
  var pttor_ds_xml = currentOilPriceResult.getText();
  
  var pttor_ds = XmlService.parse(pttor_ds_xml).getRootElement();
  
  function fuel_details(elem, item) {
    return pttor_ds.getChildren()[elem].getChildren()[item].getText();
  }

  var date = fuel_details(0, 0);
  var diesel_premium = fuel_details(0, 1);
  var diesel_premium_price = fuel_details(0, 2);

  var diesel = fuel_details(1 , 1);
  var diesel_price = fuel_details(1, 2);

  var diesel_b20 = fuel_details(2, 1);
  var diesel_b20_price = fuel_details(2, 2);

  var gasoline = fuel_details(3, 1);
  var gasoline_price = fuel_details(3, 2);

  var gasohol_95 = fuel_details(4, 1);
  var gasohol_95_price = fuel_details(4, 2);

  var gasohol_91 = fuel_details(5, 1);
  var gasohol_91_price = fuel_details(5, 2);

  var gasohol_e20 = fuel_details(6, 1);
  var gasohol_e20_price = fuel_details(6, 2);

  var gasohol_e85 = fuel_details(7, 1);
  var gasohol_e85_price = fuel_details(7, 2);

  var diesel_b7 = fuel_details(8, 1);
  var diesel_b7_price = fuel_details(8, 2);

  var gasohol_95_super = fuel_details(9, 1);
  var gasohol_95_super_price = fuel_details(9, 2);
 
  // message to send notify
  var message = "แจ้งราคาน้ำมัน" + "\n"
        + date + "\n"
        + "ดีเซลหมุนเร็ว → " + diesel_price + "\n"
        + "ดีเซล B7 → " + diesel_b7_price + "\n"
        + "ดีเซล B20 → " + diesel_b20_price + "\n"
        + "ดีเซลพรีเมี่ยม → " + diesel_premium_price + "\n"
        + "เบนซิน → " + gasoline_price + "\n"
        + "แก๊สโซฮอล์ 95s → " + gasohol_95_super_price + "\n"
        + "แก๊สโซฮอล์ 95 → " + gasohol_95_price + "\n"
        + "แก๊สโซฮอล์ 91 → " + gasohol_91_price + "\n"
        + "แก๊สโซฮอล์ E20 → " + gasohol_e20_price + "\n"
        + "แก๊สโซฮอล์ E85 → " + gasohol_e85_price + "\n";
        
  Logger.log(message);
}

function getSoapContent(url, bodyXML) {
  var xml = bodyXML;
  
  var options = {
    method: "post",
    contentType: "text/xml",
    charset: "utf-8",
    payload: xml,
    muteHttpExceptions: true,
  }
  
  var soapContent = UrlFetchApp.fetch(url, options);
  var result = XmlService.parse(soapContent).getRootElement();

  return result;
}
