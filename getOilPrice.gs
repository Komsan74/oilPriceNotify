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
    
  var currentOilPriceResponse = responseSOAP.getChild("Body", soapNamespace).getChildren()[0];
  var currentOilPriceResult = currentOilPriceResponse.getChildren()[0];
  var pttor_ds_xml = currentOilPriceResult.getText();
  
  var pttor_ds = XmlService.parse(pttor_ds_xml).getRootElement();

  var oilPrice = function (element, item, tag) {
    return pttor_ds.getChildren(element)[item].getChild(tag).getText();
  }

  var fuel = "FUEL";
  var price_date = "PRICE_DATE";
  var product = "PRODUCT";
  var price = "PRICE";

  var date = oilPrice(fuel, 0, price_date);
  // var diesel_premium = oilPrice(fuel, 0, product); // "ดีเซลพรีเมี่ยม" tag="PRODUCT" แสดงชื่อชนิดน้ำมัน ถ้าใช้ก็เปิดคอมเมนต์
  var diesel_premium_price = oilPrice(fuel, 0, price);

  // var diesel = oilPrice(fuel, 1, product);
  var diesel_price = oilPrice(fuel, 1, price);

  // var diesel_b20 = oilPrice(fuel, 2, product);
  var diesel_b20_price = oilPrice(fuel, 2, price);

  // var gasoline = oilPrice(fuel, 3, product);
  var gasoline_price = oilPrice(fuel, 3, price);

  // var gasohol_95 = oilPrice(fuel, 4, product);
  var gasohol_95_price = oilPrice(fuel, 4, price);

  // var gasohol_91 = oilPrice(fuel, 5, product);
  var gasohol_91_price = oilPrice(fuel, 5, price);

  // var gasohol_e20 = oilPrice(fuel, 6, product);
  var gasohol_e20_price = oilPrice(fuel, 6, price);

  // var gasohol_e85 = oilPrice(fuel, 7, product);
  var gasohol_e85_price = oilPrice(fuel, 7, price);

  // var diesel_b7 = oilPrice(fuel, 8, product);
  var diesel_b7_price = oilPrice(fuel, 8, price);

  // var gasohol_95_super = oilPrice(fuel, 9, product);
  var gasohol_95_super_price = oilPrice(fuel, 9, price);
 
  // ตัวอย่าง message to send notify 
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
  let result = XmlService.parse(soapContent).getRootElement();

  return result;
}
