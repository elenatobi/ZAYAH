const EWRakuten = {
    data: {
        ranMID: null,
        ranEAID: null,
        ranSiteID: null,
    },
    getVar: function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        const maybeDecode = results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        var value = maybeDecode;
//        console.log(`getVar Before`, name, value);
        switch (name) {
            case 'Email':
            case 'inf_field_Email':
            case 'orderId':
                try {
                    value = atob(maybeDecode);
                } catch (e) {
                    value = maybeDecode;
                }
                break;
            default:
                break;
        }
//        console.log(`getVar After`, name, value);
        return value;
    },
    setCookie: function (cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    deleteCookie: function (cname) {
        const d = new Date(1970, 1, 1, 0, 0, 0, 0);
        const expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=;" + expires + ";path=/";
    },
    getCookie: function (cname) {
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    },
    generateId: function (n) {
        const a = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
            'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
            'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_'
        ];
        const o = [];
        n = n || 16;
        for (let i = 0; i < n; i++) {
            o.push(a[Math.ceil(Math.random() * a.length)]);
        }
        return o.join('').replace(/\"/g, '');
    },
    store: function (name, str) {
        this.setCookie(name, str, 60);
    },
    remove: function (name, str) {
        this.deleteCookie(name);
    },
    uuid: function () {
        let uuid = this.getCookie('uuid');
        if (uuid === null) {
            uuid = this.generateId(12);
        }
        this.store('uuid', uuid);
        return uuid.replace(/\"/g, '');
    },
    init: function () {
        this.uuid();
        Object.entries(this.data).forEach(item => {
            const name = item[0];
            this.data[name] = this.getVar(name);
        });
    }
};

EWRakuten.init();

try {
    jQuery(function ($) {

        $(document).on('update.Rakuten', function (e, uuid, obj) {
            let email = EWRakuten.getVar('Email');
            if (!email) {
                email = EWRakuten.getVar('inf_field_Email');
            }
            const data = {
                action: 'rakuten_update',
                uuid: EWRakuten.uuid(),
                data: EWRakuten.data,
                email: email.replace(/ /g, '+')
            };
            let send = false;
            if (data.uuid || data.email || data.data.ranMID || data.data.ranEAID || data.data.ranSiteID) {
                send = true;
            }
            if (send) {
                $.post(`${EWRT.ajaxurl}?${new Date()}`, data, function (json) {
//                    console.log(json);
                }, 'json').fail(function () {
                    console.warn(`${e.type} encountered a server error.`);
                });
            }
        });

        $(document).trigger('update.Rakuten', [EWRakuten.uuid(), EWRakuten.data]);
    });
} catch (e) {
    console.warn('jQuery not loaded, or not loaded properly!');
}



///*Do not edit any information beneath this line*/
//!function(a,b,c){
//    var d=a.rakutenDataLayerName||"DataLayer";a[d]=a[d]||{},a[d].events=a[d].events||{},a[d].events.SPIVersion="3.4.1",a[d].Sale=a[d].Sale||{},a[d].Sale.Basket=a[d].Sale.Basket||{},c.Ready=a[d].Sale.Basket.Ready&&a[d].Sale.Basket.Ready+1||1,a[d].Sale.Basket=c;
//    var e=function(a){for(var c,d=a+"=",e=b.cookie.split(";"),f=0;f<e.length;f++){for(c=e[f];" "==c.charAt(0);)c=c.substring(1,c.length);if(0==c.indexOf(d))return c.substring(d.length,c.length)}return""},f=function(a){var b=a||"",c={};if(a||(b=e("rmStore")),b){for(;b!==decodeURIComponent(b);)b=decodeURIComponent(b);for(var d=b.split("|"),f=0;f<d.length;f++)c[d[f].split(":")[0]]=d[f].split(":")[1]}return c},g={};g=f();var h=function(a,b,c,d){c=c||"",d=d||{};var e=g[a||""],f=d[b||""],h=d.ignoreCookie||!1;e=h?0:e;var i=e||f||c;return i=("string"!=typeof i||"false"!==i.toLowerCase())&&i,i},k=function(a,c,d,e,f){var g=b.createElement(a),h=-1<b.location.protocol.indexOf("s")?"https:":"http:";for(var i in c=c.replace("https:",h),g.src=c,e=e||{},"script"==a?e.type=e.type||"text/javascript":(e.style="display:none;","img"==a&&(e.alt="",e.height="1",e.width="1")),e)e.hasOwnProperty(i)&&g.setAttribute(i,e[i]);var j=b.getElementsByTagName(d);j=j.length?j[0]:b.getElementsByTagName("script")[0].parentElement,f&&(g.onload=f,g.onreadystatechange=function(){("complete"==this.readyState||"loaded"==this.readyState)&&f()}),j.appendChild(g)},l=function(a){var b=new Date,c=b.getUTCFullYear()+("0"+(b.getUTCMonth()+1)).slice(-2)+("0"+b.getUTCDate()).slice(-2)+("0"+b.getUTCHours()).slice(-2)+("0"+b.getUTCMinutes()).slice(-2);return"NoOID_"+(a?a+"_":"")+Math.round(1e5*Math.random())+"_"+c},m=function(){var b=a[d]&&a[d].Sale&&a[d].Sale.Basket?a[d].Sale.Basket:{},c=c||b.affiliateConfig||{},f=h("amid","ranMID","",c)||b.ranMID;if(!f)return!1;var g="undefined"==typeof c.allowCommission||"false"!==c.allowCommission;if(!g)return!1;if(!b.orderid&&!(b.lineitems&&b.lineitems.length))return!1;var m=h("adn","domain","track.linksynergy.com",c),o=h("atm","tagType","pixel",c),p=h("adr","discountType","order",c),q=h("acs","includeStatus","false",c),r=h("arto","removeOrderTax","false",c),s=h("artp","removeTaxFromProducts","false",c),t=h("artd","removeTaxFromDiscount","false",c),u=h("atr","taxRate",b.taxRate||0,c),v=h("ald","land",!1,{})||(c.land&&!0===c.land?e("ranLandDateTime"):c.land)||!1,w=h("atrv","tr",!1,{})||(c.tr&&!0===c.tr?e("ranSiteID"):c.tr)||!1,x=h("acv","centValues","true",c),y=h("ancc","nonCentCurrencies","JPY",c);u=Math.abs(+u);var z=(100+u)/100,A=b.orderid||l(f);A=encodeURIComponent(A);var B=b.currency||"";B=encodeURIComponent(B.toUpperCase());var C=!1;if(B&&y){y=(y+"").split(",");for(var D=0;D<y.length;D++)y[D]==B&&(C=!0)}var F=function(a){return C&&(a=Math.round(a)),x&&"false"!==x?(a*=100,a=Math.round(a)):a=Math.round(100*a)/100,a+""},G=b.taxAmount?Math.abs(+b.taxAmount):0,H=b.discountAmount?Math.abs(+b.discountAmount):0,I=b.discountAmountLessTax?Math.abs(+b.discountAmountLessTax):0;!I&&H&&t&&u&&(I=H/z),I=I||H;var J="ep";"mop"===o&&(J="eventnvppixel");var K=(b.customerStatus||"")+"",L="";K&&(q&&"EXISTING"==K.toUpperCase()||q&&"RETURNING"==K.toUpperCase())&&(L="R_");for(var M=[],N=0,O=0;O<(b.lineitems?b.lineitems.length:0);O++)if(b.lineitems[O]){var P=!1,Q=a.JSON?JSON.parse(JSON.stringify(b.lineitems[O])):b.lineitems[O],R=+Q.quantity||0,S=+Q.unitPrice||0,T=+Q.unitPriceLessTax,U=T||S||0;s&&u&&!T&&(U/=z);for(var V,W=R*U,X=0;X<M.length;X++)V=M[X],V.SKU===Q.SKU&&(P=!0,V.quantity+=R,V.totalValue+=W);P||(Q.quantity=R,Q.totalValue=W,M.push(Q)),N+=W}for(var Y="",Z="",$="",_="",aa={},O=0;O<M.length;O++){var Q=M[O],ba=encodeURIComponent(Q.SKU),ca=Q.totalValue,R=Q.quantity,da=encodeURIComponent(Q.productName)||"";"item"===p.toLowerCase()&&I&&(ca-=I*ca/N);var ea=Q.optionalData;for(var fa in ea)ea.hasOwnProperty(fa)&&(aa[fa]=aa[fa]||"",aa[fa]+=encodeURIComponent(ea[fa])+"|");Y+=L+ba+"|",Z+=R+"|",$+=F(ca)+"|",_+=L+da+"|"}Y=Y.slice(0,-1),Z=Z.slice(0,-1),$=$.slice(0,-1),_=_.slice(0,-1),I&&(I=F(I)),G&&(G=F(G)),I&&"order"===p.toLowerCase()&&(Y+="|"+L+"DISCOUNT",_+="|"+L+"DISCOUNT",Z+="|0",$+="|-"+I),r&&G&&(Y+="|"+L+"ORDERTAX",Z+="|0",$+="|-"+G,_+="|"+L+"ORDERTAX");var ga="https://"+m+"/"+J+"?mid="+f;ga+="&ord="+A,ga+=v?"&land="+v:"",ga+=w?"&tr="+w:"",ga+="&cur="+B,ga+="&skulist="+Y,ga+="&qlist="+Z,ga+="&amtlist="+$,ga+="&img=1",ga+="&spi="+a[d].events.SPIVersion,I&&"item"===p.toLowerCase()&&(ga+="&discount="+I);var ea=b.optionalData||{};for(var fa in b.discountCode&&(ea.coupon=b.discountCode),b.customerStatus&&(ea.custstatus=b.customerStatus),b.customerID&&(ea.custid=b.customerID),I&&(ea.disamt=I),ea)ea.hasOwnProperty(fa)&&(ga+="&"+encodeURIComponent(fa)+"="+encodeURIComponent(ea[fa]));for(var fa in aa)aa.hasOwnProperty(fa)&&(ga+="&"+encodeURIComponent(fa)+"list="+aa[fa].slice(0,-1),I&&"order"===p.toLowerCase()&&(ga+="|"),G&&r&&(ga+="|"));ga+="&namelist="+_;if(8000<ga.length){for(var ha=8000;0<ha;)if("&"==ga.charAt(ha)){ga=ga.slice(0,ha);break}else ha--;ga+="&trunc=true"}k("img",ga,"body")},n=function(){var b=a[d]&&a[d].Sale&&a[d].Sale.Basket?a[d].Sale.Basket:{},c=c||b.displayConfig||{},e=h("dmid","rdMID","",c);if(!e)return!1;if(!b.orderid&&!b.conversionType)return!1;var f=h("dtm","tagType","js",c),g=h("ddn","domain","tags.rd.linksynergy.com",c),j=h("dis","includeStatus","false",c),m=h("dcomm","allowCommission","notset",c),n=h("duup","useUnitPrice","false",c),o=h("drtp","removeTaxFromProducts","false",c),p=h("drtd","removeTaxFromDiscount","false",c),q=h("dtr","taxRate",b.taxRate||0,c),r="";"true"===m||!0===m||"1"===m||1===m?r="1":("false"===m||!1===m||"0"===m||0===m)&&(r="0"),f="js"===f||"if"===f||"img"===f?f:"js";var s="script";"if"===f?s="iframe":"img"===f&&(s="img"),("true"===n||!0===n||"1"===n||1===n)&&(n=!0);var t=(b.customerStatus||"")+"",u="";t&&j&&("EXISTING"==t.toUpperCase()||"RETURNING"==t.toUpperCase())&&(u="R_");var v=b.orderid;v||(v=l((b.conversionType+"").toLowerCase()+"_"+e)),v=encodeURIComponent(u+v);var w=encodeURIComponent(b.currency||""),x=0,y="";q=Math.abs(+q);var z=(100+q)/100,A=b.discountAmount?Math.abs(+b.discountAmount):0,B=b.discountAmountLessTax?Math.abs(+b.discountAmountLessTax):0;!B&&A&&p&&q&&(B=A/z),B=B||A,B=isNaN(B)?0:B;for(var C=0;C<(b.lineitems?b.lineitems.length:0);C++)if(b.lineitems[C]){var D=+b.lineitems[C].quantity,E=+b.lineitems[C].unitPriceLessTax*D;(!E||n)&&(o&&q?E=+b.lineitems[C].unitPrice/z*D:E=+b.lineitems[C].unitPrice*D),E=isNaN(E)?0:E,x+=E,y+=encodeURIComponent(b.lineitems[C].SKU)+","}x=Math.round(100*(x-B))/100,y=y.slice(0,-1);var F="https://"+g+"/"+f+"/"+e;F+="/?pt="+"conv",F+="&orderNumber="+v,F+="&spi="+a[d].events.SPIVersion,x&&(F+="&price="+x),w&&(F+="&cur="+w),r&&(F+="&tvalid="+r),y&&(F+="&prodID="+y),k(s,F,"body")},o=function(){var b=a[d]&&a[d].Sale&&a[d].Sale.Basket?a[d].Sale.Basket:{},c=b.searchConfig||{},e=1024,f=encodeURIComponent("...TRUNCATED"),g=h("smid","rsMID","",c);if(!g)return!1;var j=h("said","accountID","113",c),m=h("sclid","clickID","",c),n=encodeURIComponent(h("sct","conversionType",b.conversionType&&"sale"!==(b.conversionType+"").toLowerCase()?b.conversionType:"conv",c));k("script","https://services.xg4ken.com/js/kenshoo.js?cid="+g,"body",null,function(){var a={};if(a.conversionType=n,a.revenue=0,a.currency=encodeURIComponent(b.currency||"USD"),a.orderId=encodeURIComponent(b.orderid||l(n)),a.promoCode=encodeURIComponent(b.discountCode||""),m&&(a.ken_gclid=encodeURIComponent(m)),a.discountAmount=+(b.discountAmount||0),a.discountAmount=isNaN(a.discountAmount)?0:Math.abs(a.discountAmount),a.customerStatus=encodeURIComponent(b.customerStatus||""),a.productIDList="",a.productNameList="",b.lineitems&&b.lineitems.length){for(var c=0;c<b.lineitems.length;c++)b.lineitems[c]&&(a.revenue+=+(b.lineitems[c].unitPrice||0)*+b.lineitems[c].quantity,a.productIDList+=(b.lineitems[c].SKU||"NA")+",",a.productNameList+=(b.lineitems[c].productName||"NA")+",");a.revenue=Math.round(100*(a.revenue-a.discountAmount))/100,a.productIDList=encodeURIComponent(a.productIDList.slice(0,-1)),a.productNameList=encodeURIComponent(a.productNameList.slice(0,-1)),a.productIDList.length>e&&(a.productIDList=a.productIDList.substring(0,e-f.length)+f),a.productNameList.length>e&&(a.productNameList=a.productNameList.substring(0,e-f.length)+f)}kenshoo.trackConversion(j,g,a)})};a[d].SPI={readRMCookie:e,processRMStoreCookie:f,readRMStoreValue:h,sRAN:m,sDisplay:n,sSearch:o,addElement:k,rmStore:g},m(),n(),o()
//}(window,document,rm_trans);