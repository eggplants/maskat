/* ************************************************************************************************

Copyright (c) 2005-2006, IGR
All Rights Reserved.
Licensed under the Apache License version 2.0 or above.
For more information on licensing, see:
http://www.apache.org/licenses/


Objet type Single file Rialto.js
VERSION:0.85
DATE:23/04/2007
************************************************************************************************/

var rialto = {};
ria = rialto;
ria.utils = {};
rialto.widget = {};
rialto.widgetBehavior = {};
rialto.lang = {};
rialto.collection = {};
rialto.session = {count:0, objects:{}, reccord:function (obj, id) {
    this.objects[id] = obj;
    this.count += 1;
}, removeAll:function () {
    for (obj in this.objects) {
        if (this.objects[obj] && this.objects[obj].remove) {
            try {
                this.objects[obj].remove();
            }
            catch (e) {
            }
        }
        this.objects[obj] = null;
    }
    this.cleanDiv(document.body);
    if (document.removeEventListener) {
        document.removeEventListener("mousemove", rialto.widgetBehavior.DragAndDropMouseMoveHandler, false);
        document.removeEventListener("mouseup", rialto.widgetBehavior.DragAndDropMouseUpHandler, false);
        document.removeEventListener("mousedown", rialto.widgetBehavior.StopSelectDef, false);
        document.removeEventListener("mousedown", rialto.widgetBehavior.DragAndDropMouseDownHandler, false);
    }
    _rum = null;
    _r = null;
    _ru = null;
    _riu = null;
    _ria = null;
    ria = null;
    child = null;
    newPos = null;
    rialtoConfig = null;
    _DDMgr = null;
    rialto = null;
}, cleanDiv:function (obj, bInclude) {
    var arrDiv = obj.getElementsByTagName("DIV");
    for (var i = 0; i < arrDiv.length; i++) {
        this.cleanOneDiv(arrDiv[i]);
    }
    var arrImg = obj.getElementsByTagName("IMG");
    for (var i = 0; i < arrImg.length; i++) {
        this.cleanDiv(arrImg[i]);
    }
    if (bInclude) {
        this.cleanOneDiv(obj);
    }
}, cleanOneDiv:function (oHtml) {
    var i = 0;
    for (prop in oHtml) {
        if (typeof oHtml[prop] == "object" || typeof oHtml[prop] == "function") {
            try {
                oHtml[prop] = null;
                i++;
            }
            catch (e) {
            }
        }
    }
}, cleanObj:function (obj) {
    for (prop in obj) {
        try {
            obj[prop] = null;
        }
        catch (e) {
        }
    }
}, oParameters:{}};
rialto.config = rialtoConfig;
rialtoConfig.buildImageURL = function (imageName) {
    return rialtoConfig.pathRialtoE + imageName;
};
rialto.composer = {mode:"design"};
rialto.composer.toogleMode = function (e) {
    var newMode = (rialto.composer.mode == rialtoConfig.extIdCssComposerTryMode) ? rialtoConfig.extIdCssComposerDesignMode : rialtoConfig.extIdCssComposerTryMode;
    var linkCssDesign = document.getElementById(rialtoConfig.baseIdCssComposer + "_mode_" + rialto.config.extIdCssComposerDesignMode);
    var linkCssTry = document.getElementById(rialto.config.baseIdCssComposer + "_mode_" + rialto.config.extIdCssComposerTryMode);
    linkCssDesign.disabled = (newMode != rialto.config.extIdCssComposerDesignMode);
    linkCssTry.disabled = (newMode != rialto.config.extIdCssComposerTryMode);
    rialto.composer.mode = newMode;
    traceExec("composer mode : " + rialto.composer.mode, 73);
};
var obj = document.getElementById(rialto.config.baseIdCssComposer + "_mode_" + rialto.config.extIdCssComposerTryMode);
if (obj) {
    obj.disabled = true;
}
window.__styleDeco = "3D";
rialto.deprecated = function (object, oldMethod, newMethod) {
    alert(object + "." + oldMethod + " deprecated; use " + object + "." + newMethod);
};
traceExec = function (mssg, trace) {
    if (trace == rialto.config.traceLevel) {
        console.log("Message from traceExec (level " + trace + ") :" + mssg);
    }
};
rialto.lang = {link:function (obj, method) {
    return function () {
        return method.apply(obj, arguments);
    };
}, addMethods:function (proto, methodList) {
    for (var m in methodList) {
        proto[m] = methodList[m];
    }
    return proto;
}, extendObject:function (proto, methodList) {
    this.addMethods(proto.prototype, methodList);
}, extend:function (proto, methodList) {
    this.extendObject(proto, methodList);
}, isFunction:function (ob) {
    return (ob instanceof Function || typeof ob == "function");
}, isString:function (ob, bNotEmpty) {
    if (bNotEmpty) {
        return ((ob instanceof String || typeof ob == "string") && ob != "");
    } else {
        return (ob instanceof String || typeof ob == "string");
    }
}, isStringIn:function (ob, arr) {
    if (this.isString(ob)) {
        return rialto.array.indexOf(arr, ob) != -1;
    }
}, isArray:function (ob) {
    return (ob instanceof Array || typeof ob == "array");
}, isDate:function (ob) {
    return (ob instanceof Date);
}, isBoolean:function (ob) {
    return (ob instanceof Boolean || typeof ob == "boolean");
}, isNumber:function (ob) {
    var firstTest = (ob instanceof Number || typeof ob == "number");
    if (!firstTest) {
        var stI = "" + ob;
        if (stI.length == 0) {
            return false;
        }
        for (var i = 0; i < stI.length; i++) {
            var ch = stI.charAt(i);
            if ("0123456789.-%".indexOf(ch) == -1) {
                return false;
            }
        }
        return true;
    } else {
        return true;
    }
}};
rialto.Dom = {isDescendantOf:function (nd1, nd2, orSelf) {
    if (orSelf && (nd1 == nd2)) {
        return true;
    }
    var n1 = nd1, n2 = nd2;
    n1 = n1.parentNode;
    while (n1) {
        if (n1 == n2) {
            return true;
        }
        n1 = n1.parentNode;
    }
    return false;
}, isCoveredBy:function (nd1, nd2) {
    var n1 = nd1, n2 = nd2;
    if (n1.parentNode == n2.parentNode) {
        var styleN1 = _rum.$getStyle(n1, "z-index");
        var styleN2 = _rum.$getStyle(n2, "z-index");
        if (styleN1 && styleN2) {
            return (styleN1 > styleN2);
        } else {
            if (styleN1) {
                return true;
            } else {
                if (styleN2) {
                    return false;
                } else {
                    n1 = n1.nextSibling;
                    while (n1) {
                        if (n1 == n2) {
                            return true;
                        }
                        n1 = n1.nextSibling;
                    }
                    return false;
                }
            }
        }
    } else {
        var childN1AscList = {};
        var n1p = n1.parentNode;
        var pn1p = n1;
        while (n1p) {
            if (!n1p.id) {
                n1p.id = "domElt_" + rialto.Dom.nbInstances++;
            }
            childN1AscList[n1p.id] = pn1p;
            pn1p = n1p;
            n1p = n1p.parentNode;
        }
        var pn2p = n2p;
        var n2p = n2.parentNode;
        while (n2p) {
            if (n2p.id && childN1AscList[n2p.id]) {
                var siblAscN1 = childN1AscList[n2p.id].nextSibling;
                while (siblAscN1) {
                    if (siblAscN1 == pn2p) {
                        return true;
                    }
                    siblAscN1 = siblAscN1.nextSibling;
                }
                return false;
            } else {
                pn2p = n2p;
                n2p = n2p.parentNode;
            }
        }
    }
}};
rialto.Dom.nbInstances = 0;
rialto.string = {trim:function (str) {
//maskat start
    //return str.replace(/^\s*(\b.*\b|)\s*$/, "$1");
    return str.replace(/^\s+|\s+$/g,"");
//maskat end
}, replace:function (str, strFind, strRemp) {
    var tab = str.split(strFind);
    return new String(tab.join(strRemp));
}, formatHTTP:function (str) {
    if (rialto.lang.isString(str)) {
        return escape(str);
    }
}};
rialto.array = {copy:function (arr) {
    var copArr = new Array;
    copArr = (copArr.concat(arr));
    return copArr;
}, add:function (arr, obj) {
    if (rialto.array.indexOf(arr, obj) == -1) {
        arr.push(obj);
    }
}, remove:function (arr, obj) {
    if (arr) {
        if (arr.length > 0 && arr[arr.length - 1] == obj) {
            arr.pop();
        } else {
            var pos = rialto.array.indexOf(arr, obj);
            if (pos != -1) {
                arr.splice(pos, 1)[0];
            }
        }
        return arr.length;
    }
}, indexOf:function (arr, obj) {
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == obj) {
            return i;
        }
    }
    return -1;
}, insert:function (arr, ind, obj) {
    arr.splice(ind, 0, obj);
}, sort:function (arr, col) {
    arr.sort(function (a, b) {
        return (a < b) ? -1 : 1;
    });
}, arrayToString:function (arr) {
    var str = "[";
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (rialto.lang.isArray(item)) {
            str += this.arrayToString(item) + ",";
        } else {
            if (item == "true" || item == "false" || rialto.lang.isNumber(item)) {
                str += item + ",";
            } else {
                str += "'" + rialto.string.replace(item, "'", "\\'") + "',";
            }
        }
    }
    if (str != "[") {
        str = str.substr(0, str.length - 1);
    }
    str += "]";
    return str;
}};
rialto.date = {_DayLong:new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"), toDay:function () {
    return new Date();
}, getWeekNumber:function (date) {
    var jour = date.getDate();
    var mois = date.getMonth() + 1;
    var annee = date.getFullYear();
    var a = Math.floor((14 - (mois)) / 12);
    var y = annee + 4800 - a;
    var m = (mois) + (12 * a) - 3;
    var jd = jour + Math.floor(((153 * m) + 2) / 5) + (365 * y) + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    var d4 = (jd + 31741 - (jd % 7)) % 146097 % 36524 % 1461;
    var L = Math.floor(d4 / 1460);
    var d1 = ((d4 - L) % 365) + L;
    numSem = Math.floor(d1 / 7) + 1;
    return numSem;
}, getBornes:function (numSem) {
    var sem53 = false;
    var dateJour = this.toDay();
    var datePremJanv = new Date(dateJour.getFullYear(), 0, 1);
    var jourSem1 = datePremJanv.getDay() - 1;
    if (jourSem1 < 0) {
        jourSem1 = 6;
    }
    if (jourSem1 > 3) {
        sem53 = true;
        numSem += 1;
    }
    if (numSem == 1 && !sem53) {
        var date1 = datePremJanv;
        var date2 = new Date(datePremJanv.getFullYear(), 0, 1 + 6 - jourSem1);
    } else {
        if (numSem == 53 && sem53) {
            var date1 = new Date(datePremJanv.getFullYear() - 1, 11, 31 - jourSem1 + 1);
            var date2 = new Date(datePremJanv.getFullYear(), 0, 1 + 6 - jourSem1);
        } else {
            var jour = 1 + (numSem - 1) * 7;
            var date = new Date(dateJour.getFullYear(), 0, jour);
            var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate() - jourSem1);
            var date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() - jourSem1 + 6);
        }
    }
    return [date1, date2];
}, getDDMMYYYY:function (date) {
    var jour = date.getDate();
    if (jour < 10) {
        (jour = "0" + jour);
    }
    var mois = date.getMonth() + 1;
    if (mois < 10) {
        (mois = "0" + mois);
    }
    var annee = date.getFullYear();
    return jour + "/" + mois + "/" + annee;
}, getYYYYMMDD:function (date) {
    var jour = date.getDate();
    if (jour < 10) {
        (jour = "0" + jour);
    }
    var mois = date.getMonth() + 1;
    if (mois < 10) {
        (mois = "0" + mois);
    }
    var annee = date.getFullYear();
    return annee + "" + mois + "" + jour;
}, getLibJour:function (date) {
    return this._DayLong[date.getDay()];
}, DDMMYYYYfromYYYYMMDD:function (wdate) {
    jour = wdate.substr(6, 2);
    mois = wdate.substr(4, 2);
    annee = wdate.substr(0, 4);
    if (jour.length == 1) {
        jour = "0" + jour;
    }
    if (mois.length == 1) {
        mois = "0" + mois;
    }
    return jour + "/" + mois + "/" + annee;
}, YYYYMMDDfromDDMMYYYY:function (wdate) {
    jour = wdate.substr(0, 2);
    mois = wdate.substr(3, 2);
    if (jour.length == 1) {
        jour = "0" + jour;
    }
    if (mois.length == 1) {
        mois = "0" + mois;
    }
    annee = wdate.substr(6, 4);
    return annee + "" + mois + "" + jour;
}, setDateFromYYYYMMDD:function (wdate) {
    jour = wdate.substr(6, 2);
    mois = wdate.substr(4, 2);
    annee = wdate.substr(0, 4);
    return new Date(annee, parseInt(mois, 10) - 1, jour);
}, equals:function (date1, date2) {
    return (this.getYYYYMMDD(date1) == this.getYYYYMMDD(date2));
}, isDate:function (sDate) {
    var e = new RegExp("^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$");
    if (!e.test(sDate)) {
        return false;
    }
    var arrDate = sDate.split("/");
    var d = parseInt(arrDate[0], 10);
    var m = parseInt(arrDate[1], 10);
    var y = parseInt(arrDate[2]);
    var feb = 28;
    if (this.isBissextile(y)) {
        feb = 29;
    }
    var nbJours = new Array(31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    return (m >= 1 && m <= 12 && d >= 1 && d <= nbJours[m - 1]);
}, isBissextile:function (an) {
    return (((an % 4 == 0) && (an % 100 != 0 || an % 400 == 0)) ? true : false);
}, add:function (field, date, delta) {
    var newDate = null;
    switch (field) {
      case "year":
        newDate = new Date(parseInt(date.getFullYear()) + 1, date.getMonth(), date.getDate());
        break;
      case "month":
        newDate = new Date(date.getFullYear(), date.getMonth() + delta, date.getDate());
        break;
      case "day":
        newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
        break;
    }
    return newDate;
}};
rialto.url = {getUrl:function () {
    return window.location;
}, getSearch:function () {
    return window.location.search;
}, getObjectParameter:function () {
    var sPar = this.getSearch();
    var arrPar = {};
    if (sPar.length > 1) {
        sPar = sPar.substring(1, sPar.length);
        var arrTemp = sPar.split("&");
        for (var i = 0; i < arrTemp.length; i++) {
            var arrPair = arrTemp[i].split("=");
            arrPar[arrPair[0]] = arrPair[1];
        }
    }
    return arrPar;
}, getArrayParameter:function () {
    var sPar = this.getSearch();
    var arrPar = new Array;
    if (sPar.length > 1) {
        sPar = sPar.substring(1, sPar.length);
        var arrTemp = sPar.split("&");
        for (var i = 0; i < arrTemp.length; i++) {
            var arrPair = arrTemp[i].split("=");
            arrPar.push(arrPair);
        }
    }
    return arrPar;
}};
function loadLayout(lName, vJS) {
    var objLayout;
    if (lName) {
        objLayout = eval("new " + lName + "();");
    }
    if (vJS) {
        vJS = objLayout;
    } else {
        return objLayout;
    }
}


rialto.I18N = {rialtoLanguage:rialto.config.language, lanInvalidCode:{en:"Invalid code", fr:"Code inexistant", de:"ung\xfcltiger Code"}, lanCloseWindow:{en:"Close the window", fr:"Fermer la fen\xeatre", de:"Fenster schliessen"}, lanCloseTab:{en:"Close actual tab", fr:"Fermer l'onglet courant", de:"Aktuellen Reiter schliessen"}, lanCloseFrame:{en:"Close the frame", fr:"Fermer le cadre", de:"Schliessen"}, lanOpenFrame:{en:"Open the frame", fr:"Ouvrir le cadre", de:"\xd6ffnen"}, lanCalendarMonths:{en:new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"), fr:new Array("Janvier", "Fevrier ", "Mars", "Avril ", "Mai", "Juin", "Juillet", "Ao\xfbt", "Septembre", "Octobre", "Novembre", "D\xe9cembre"), de:new Array("Januar", "Februar", "M\xe4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember")}, lanCalendarDays:{en:new Array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"), fr:new Array("Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"), de:new Array("Mo", "Di", "Mi", "Do", "Fr", "Sa", "So")}, lanCalenderButton:{en:"Open calendar", fr:"Afficher le calendrier", de:"Kalender \xf6ffnen"}, lanPreviousYear:{en:"previous Year", fr:"ann\xe9e precedente", de:"Voriges Jahr"}, lanPreviousMonth:{en:"previous Month", fr:"mois precedent", de:"Vorige Monat"}, lanNextYear:{en:"Next Year", fr:"ann\xe9e suivante", de:"N\xe4chstes Jahr"}, lanNextMonth:{en:"Next Month", fr:"mois prochain", de:"N\xe4chstes Monat"}, lanFindButton:{en:"Find", fr:"Rechercher", de:"Finden"}, lanHelpButton:{en:"Help", fr:"Aide", de:"Hilfe"}, lanCodeHeader:{en:"Code", fr:"Code", de:"Code"}, lanLabelHeader:{en:"Label", fr:"Libell\xe9", de:"Bezeichnung"}, lanPrintTableHeadline:{en:"TABLE OF RESULTS", fr:"TABLEAU DE RESULTAT", de:"ERGEBNISTABELLE"}, lanGridSwitchButton:{en:"Change view", fr:"Changer le type d'affichage", de:"Ansicht wechseln"}, lanGridButtonFirst:{en:" First", fr:" Premier", de:" Zum Anfang"}, lanGridButtonPrevious:{en:" Previous", fr:" Pr\xe9c\xe9dent", de:" Vorherige"}, lanGridButtonNext:{en:" Next", fr:" Suivant", de:" Weitere"}, lanGridButtonLast:{en:" Last", fr:" Dernier", de:" Zum Ende"}, lanWaitWindowDefaultText:{en:"WAIT PLEASE", fr:"VEUILLEZ PATIENTER", de:"BITTE WARTEN"}, lanCancelButton:{en:"CANCEL", fr:"ANNULER", de:"ABBRUCH"}, lanCloseButtonText:{en:"Close", fr:"Fermer", de:"Schliessen"}, lanSelectButtonText:{en:"Select", fr:"Selectionner", de:""}, lanPrintButtonText:{en:"Print", fr:"Imprimmer", de:"Druck"}, lanOpenButtonText:{en:"Open", fr:"Ouvrir", de:"\xd6ffnen"}, lanBrookenImageAlert:{en:"ERROR WHILE LOADING FOLLOWING IMAGE:", fr:"Une erreur est survenue au chargement de l'image", de:"Fehler beim Laden des folgenden Bildes:"}, lanAnotherTab:{en:"choose another tab", fr:"choisissez un autre onglet", de:""}, lanCodeFind:{en:"code/label wanted", fr:"code/label d\xe9sir\xe9", de:"Code/Bezeichnung"}, lanNoCodeFind:{en:"No code match", fr:"Aucun code ne correspond", de:""}, addKey:function (key, objLanguage) {
    this[key] = objLanguage;
}, getLabel:function (key) {
    if (this[key][this.rialtoLanguage]) {
        return this[key][this.rialtoLanguage];
    } else {
        return this[key]["en"];
    }
}, setLanguage:function (lang) {
    this.rialtoLanguage = lang;
}};
//maskat start
rialto.I18N.lanCalendarMonths["jp"]=new Array("1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月");
rialto.I18N.lanCalendarDays["jp"]=new Array("月", "火", "水", "木", "金", "土", "日");
rialto.I18N.lanCalenderButton["jp"]="カレンダーを開く";
//maskat end

rialto.widget.AbstractComponent = function (objPar) {
    this.bRiaComp = true;
    this.type = "rialto.widget.AbstractComponent";
    this.name = "kindOf" + this.type;
    this.position = "absolute";
    this.top = 0;
    this.left = 0;
    this.width = "100%";
    this.height = "100%";
    this.visible = true;
    this.enable = true;
    this.draggable = false;
    this.resizable = true;
    this.autoResizableH = false;
    this.autoResizableW = false;
    this.bWithoutPlaceIn = false;
    if (objPar != null) {
        if (objPar.bWithoutPlaceIn) {
            this.bWithoutPlaceIn = true;
        }
        if (objPar.type) {
            this.type = objPar.type;
            this.name = "kindOf" + this.type;
        }
        if (objPar.name) {
            this.name = objPar.name;
        }
        if (rialto.lang.isNumber(objPar.top)) {
            this.top = objPar.top;
        }
        if (rialto.lang.isNumber(objPar.left)) {
            this.left = objPar.left;
        }
        if (rialto.lang.isNumber(objPar.width)) {
            this.width = objPar.width;
        }
        if (rialto.lang.isNumber(objPar.height)) {
            this.height = objPar.height;
        }
        if (rialto.lang.isStringIn(objPar.position, ["static", "absolute", "relative"])) {
            this.position = objPar.position;
        }
        if (rialto.lang.isBoolean(objPar.enable)) {
            this.enable = objPar.enable;
        }
        if (rialto.lang.isBoolean(objPar.draggable)) {
            this.draggable = objPar.draggable;
        }
        if (rialto.lang.isBoolean(objPar.resizable)) {
            this.resizable = objPar.resizable;
        }
        if (rialto.lang.isBoolean(objPar.autoResizableH)) {
            this.autoResizableH = objPar.autoResizableH;
        }
        if (rialto.lang.isBoolean(objPar.autoResizableW)) {
            this.autoResizableW = objPar.autoResizableW;
        }
        this.id = this.name + "_" + this.type + "_" + (rialto.widget.AbstractComponent.prototype.nbreInstance++);
        rialto.session.reccord(this, this.id);
        this.divExt = document.createElement("DIV");
        this.divExt.id = this.id + "_divExt";
    }
};
rialto.widget.AbstractComponent.prototype.nbreInstance = 0;
rialto.widget.AbstractComponent.prototype.getId = function () {
    return this.id;
};
rialto.widget.AbstractComponent.prototype.setName = function (name) {
    this.name = name;
};
rialto.widget.AbstractComponent.prototype.moveTo = function (top, left) {
    this.setTop(top);
    this.setLeft(left);
};
rialto.widget.AbstractComponent.prototype.moveBy = function (deltaTop, deltaLeft) {
    this.setTop(parseInt(this.top) + deltaTop);
    this.setLeft(parseInt(this.left) + deltaLeft);
};
rialto.widget.AbstractComponent.prototype.setLeft = function (left) {
    var oHtml = this.getHtmlExt();
    if ((left == null) && (this.left != null)) {
        oHtml.style.left = this.left;
    } else {
        if (typeof left != "undefined") {
            this.left = left;
            oHtml.style.left = this.left;
        }
    }
};
rialto.widget.AbstractComponent.prototype.setTop = function (top) {
    var oHtml = this.getHtmlExt();
    if ((top == null) && (this.top != null)) {
        oHtml.style.top = this.top;
    } else {
        if (typeof top != "undefined") {
            this.top = top;
            oHtml.style.top = this.top;
        }
    }
};
rialto.widget.AbstractComponent.prototype.setWidth = function (width) {
    var oHtml = this.getHtmlExt();
    if ((width == null) && (this.width != null)) {
        oHtml.style.width = this.width;
    } else {
        if (typeof width != "undefined") {
            this.width = width;
            oHtml.style.width = this.width;
        }
    }
};
rialto.widget.AbstractComponent.prototype.modWidth = function (deltaWidth) {
    var oHtml = this.getHtmlExt();
    var newWidth = parseInt(oHtml.style.width) + parseInt(deltaWidth);
    this.setWidth(newWidth);
    if (this.adaptAfterSizeChange) {
        this.adaptAfterSizeChange();
    }
};
rialto.widget.AbstractComponent.prototype.setHeight = function (height) {
    var oHtml = this.getHtmlExt();
    if ((height == null) && (this.height != null)) {
        oHtml.style.height = this.height;
    } else {
        if (typeof height != "undefined") {
            this.height = height;
            oHtml.style.height = this.height;
        }
    }
};
rialto.widget.AbstractComponent.prototype.modHeight = function (deltaHeight) {
    var oHtml = this.getHtmlExt();
    var newHeight = parseInt(oHtml.style.height) + parseInt(deltaHeight);
    this.setHeight(newHeight);
    if (this.adaptAfterSizeChange) {
        this.adaptAfterSizeChange();
    }
};
rialto.widget.AbstractComponent.prototype.setVisible = function (visible) {
    var oHtml = this.getHtmlExt();
    if (visible) {
        oHtml.style.display = "block";
    } else {
        oHtml.style.display = "none";
    }
    this.visible = visible;
};
rialto.widget.AbstractComponent.prototype.isVisible = function () {
    return this.visible;
};
rialto.widget.AbstractComponent.prototype.getVisible = function () {
    rialto.deprecated("AbstractComponent", "getVisible", "isVisible()");
    return this.isVisible();
};
rialto.widget.AbstractComponent.prototype.setEnable = function (enable) {
    this.enable = enable;
};
rialto.widget.AbstractComponent.prototype.isEnable = function () {
    return this.enable;
};
rialto.widget.AbstractComponent.prototype.getEnable = function () {
    rialto.deprecated("AbstractComponent", "getEnable", "isEnable()");
    return this.isEnable();
};
rialto.widget.AbstractComponent.prototype.setDraggable = function (draggable) {
    this.draggable = draggable;
    var objDD = this.getHtmlDD();
    objDD.dragAndDrop = this.draggable;
};
rialto.widget.AbstractComponent.prototype.setPosition = function (position) {
    this.position = position;
    var oHtml = this.getHtmlExt();
    oHtml.style.position = this.position;
};
rialto.widget.AbstractComponent.prototype.setStyle = function (obStyle) {
    var oHtml = this.getHtmlExt();
    for (prop in obStyle) {
        oHtml.style[prop] = obStyle[prop];
    }
};
rialto.widget.AbstractComponent.prototype.getStyle = function (obStyle) {
    var oHtml = this.getHtmlExt();
    try {
        if (rialto.lang.isString(obStyle)) {
            obStyle = getComputStyle(oHtml, obStyle);
        } else {
            for (prop in obStyle) {
                obStyle[prop] = getComputStyle(oHtml, prop);
            }
        }
    }
    catch (erreur) {
    }
    return obStyle;
};
rialto.widget.AbstractComponent.prototype.replaceInOriginalParent = function () {
    if (!rialto.session.objects) {
        rialto.session.objects = new Array;
    }
    if (rialto.session.objects["uicInTop"]) {
        var elt = rialto.session.objects["uicInTop"].uic;
        rialto.session.objects["uicInTop"].parent.appendChild(elt);
        elt.style.zIndex = rialto.session.objects["uicInTop"].zIndex;
        rialto.session.objects["uicInTop"] = null;
    }
};
rialto.widget.AbstractComponent.prototype.placeIn = function (parent) {
    if (!parent && !this.parent) {
        return;
    }
    if (parent == this.inParent) {
        return;
    }
    if (!parent) {
        parent = this.parent;
    }
    if (this.inParent) {
        var oldParent = this.inParent;
    }
    if (oldParent && oldParent.removeContents) {
        oldParent.removeContents(this);
    }
    var oHtml = this.getHtmlExt();
    oHtml.oCiu = this;
    oHtml.oRia = this;
    if (parent.add) {
        parent.add(this, true);
    } else {
        parent.appendChild(oHtml);
        this.addInRialtoContainer(parent);
    }
    this.afterPlaceIn();
    this.inParent = parent;
};
rialto.widget.AbstractComponent.prototype.addInRialtoContainer = function (objHTML) {
    if (!objHTML) {
        return;
    }
    if (objHTML.oRia) {
        if (objHTML.oRia.isContainer) {
            objHTML.oRia.record(this);
        } else {
            this.addInRialtoContainer(objHTML.parentNode);
        }
    } else {
        this.addInRialtoContainer(objHTML.parentNode);
    }
};
rialto.widget.AbstractComponent.prototype.afterPlaceIn = function () {
    if (this.alreadyAfterPlaceIn) {
        return;
    }
    var oHtml = this.getHtmlExt();
    this.parent = oHtml.parentNode;
    this.adaptToContext();
    this.initDD();
    this.alreadyAfterPlaceIn = true;
};
rialto.widget.AbstractComponent.prototype.placeInTop = function () {
    this.replaceInOriginalParent();
    if (!rialto.session.objects) {
        rialto.session.objects = new Array;
    }
    var elt = this.getHtmlExt();
    rialto.session.objects["uicInTop"] = {uic:this, parent:this.parent, zIndex:elt.style.zIndex};
    elt.style.zIndex = 1000002;
    window.document.body.appendChild(elt);
};
rialto.widget.AbstractComponent.prototype.remove = function (bFromContainer) {
    this.release();
    var oHtml = this.getHtmlExt();
    if (oHtml.parentNode) {
        oHtml.parentNode.removeChild(oHtml);
    }
    if (!bFromContainer) {
        if (this.inContainer && this.inContainer.removeContents) {
            this.inContainer.removeContents(this);
        }
    }
    if (this.draggable) {
        rialto.widgetBehavior.desaffect(this, "DragAndDrop");
    }
    rialto.session.objects[this.id] = null;
    this.parent = null;
    this.inParent = null;
    oHtml.oCiu = null;
    oHtml.oRia = null;
    this.onremove();
    for (prop in this) {
        this[prop] = null;
    }
};
rialto.widget.AbstractComponent.prototype.onremove = function () {
};
rialto.widget.AbstractComponent.prototype.adaptToContext = function () {
};
rialto.widget.AbstractComponent.prototype.adaptAfterContainerChange = function () {
};
rialto.widget.AbstractComponent.prototype.release = function () {
};
rialto.widget.AbstractComponent.prototype.initDD = function () {
    if (this.draggable) {
        var oHtml = this.getHtmlExt();
        var objDD = this.getHtmlDD();
        rialto.widgetBehavior.affect(this, "DragAndDrop", {oHtmlToMove:oHtml, oHtmlEvtTarget:objDD, isWithLimitsDisplayed:false});
        this.afterDD = function (deltop, delLeft) {
            this.moveBy(deltop, delLeft);
            this.onDD(deltop, delLeft);
        };
    }
};
rialto.widget.AbstractComponent.prototype.onDD = function (deltop, delLeft) {
};
rialto.widget.AbstractComponent.prototype.initRZ = function () {
};
rialto.widget.AbstractComponent.prototype.getHtmlExt = function () {
    return this.divExt;
};
rialto.widget.AbstractComponent.prototype.getHtmlImp = function () {
    return this.divExt;
};
rialto.widget.AbstractComponent.prototype.getHtmlDD = function () {
    return this.divExt;
};
rialto.widget.AbstractComponent.prototype.getHtmlRZ = function () {
    return this.divExt;
};
rialto.widget.AbstractComponent.prototype.onclick = function (e) {
};
rialto.widget.AbstractComponent.prototype.ondbleclick = function (e) {
};
rialto.widget.AbstractComponent.prototype.onmouseover = function (e) {
};
rialto.widget.AbstractComponent.prototype.onmouseout = function (e) {
};
rialto.widget.AbstractComponent.prototype.onblur = function (e) {
};
rialto.widget.AbstractComponent.prototype.onfocus = function (e) {
};
rialto.widget.AbstractComponent.prototype.onmousemove = function (e) {
};
rialto.widget.AbstractComponent.prototype.onmousedown = function (e) {
};
rialto.widget.AbstractComponent.prototype.onmouseup = function (e) {
};
rialto.widget.AbstractComponent.prototype.getNewParentHeight = function () {
    var obj = this.getHtmlExt();
    var heightCalc = ria.utils.measures.$getHeight(obj.parentNode, true);
//maskat start
    if (isNaN(heightCalc)) {
        heightCalc = document.body.clientHeight;
    }
//maskat end
    return heightCalc;
};
rialto.widget.AbstractComponent.prototype.getNewParentWidth = function () {
    var obj = this.getHtmlExt();
    var widthCalc = ria.utils.measures.$getWidth(obj.parentNode, true);
    return widthCalc;
};


rialto.widget.AbstractContainer = function (objPar) {
    this.base = rialto.widget.AbstractComponent;
    this.base(objPar);
    this.arrChild = new Array;
    this.isContainer = true;
};
rialto.widget.AbstractContainer.prototype = new rialto.widget.AbstractComponent;
rialto.widget.AbstractContainer.prototype.add = function (elt, callByElt) {
    if (!elt) {
        return;
    }
    var comp, oHtml;
    if (elt.bRiaComp) {
        comp = elt;
        oHtml = elt.getHtmlExt();
    } else {
        if (elt.oRia || elt.oCiu) {
            comp = elt.oRia || elt.oCiu;
            oHtml = elt;
        } else {
            comp = oHtml = elt;
        }
    }
    this.getHtmlCont().appendChild(oHtml);
    this.record(comp);
    if (!callByElt && comp.afterPlaceIn) {
        comp.afterPlaceIn();
    }
};
rialto.widget.AbstractContainer.prototype.record = function (oRia) {
    if (!this.arrChild) {
        this.arrChild = new Array;
    }
    this.arrChild.push(oRia);
    oRia.inContainer = this;
};
rialto.widget.AbstractContainer.prototype.removeContents = function (elt) {
    var comp;
    if (elt.bRiaComp) {
        comp = elt;
    } else {
        if (elt.oRia) {
            comp = elt.oRia;
        } else {
            comp = elt;
        }
    }
    rialto.array.remove(this.arrChild, comp);
    this.updateToContent();
};
rialto.widget.AbstractContainer.prototype.removeAllContents = function () {
    for (var i = 0; i < this.arrChild.length; i++) {
        if (this.arrChild[i].remove) {
            this.arrChild[i].remove(true);
        }
    }
    this.arrChild = null;
    var htmlCont = this.getHtmlCont();
    htmlCont.innerHTML = "";
};
rialto.widget.AbstractContainer.prototype.baseSetVisible = rialto.widget.AbstractComponent.prototype.setVisible;
rialto.widget.AbstractContainer.prototype.setVisible = function (visible) {
    this.baseSetVisible(visible);
    if (visible) {
        this.$$activeContent();
    }
};
rialto.widget.AbstractContainer.prototype.updateToContent = function () {
};
rialto.widget.AbstractContainer.prototype.$$activeContent = function () {
    if (!this.arrChild) {
        return;
    }
    for (var i = 0; i < this.arrChild.length; i++) {
        child = this.arrChild[i];
        if (this.arrChild[i].adaptAfterContainerChange) {
            this.arrChild[i].adaptAfterContainerChange();
        }
    }
};
rialto.widget.AbstractContainer.prototype.adaptAfterContainerChange = function () {
    this.$$activeContent();
};
rialto.widget.AbstractContainer.prototype.getHtmlCont = function () {
    return this.divExt;
};
rialto.widget.AbstractContainer.prototype.remove = function (bFromContainer) {
    this.release();
    for (var i = 0; i < this.arrChild.length; i++) {
        if (this.arrChild[i].remove) {
            this.arrChild[i].remove(true);
        }
    }
    this.arrChild = null;
    var oHtml = this.getHtmlExt();
    if (oHtml.parentNode) {
        oHtml.parentNode.removeChild(oHtml);
    }
    if (this.draggable) {
        rialto.widgetBehavior.desaffect(this, "DragAndDrop");
    }
    if (!bFromContainer) {
        if (this.inContainer && this.inContainer.removeContents) {
            this.inContainer.removeContents(this);
        }
    }
    rialto.session.objects[this.id] = null;
    this.inParent = null;
    oHtml.oCiu = null;
    oHtml.oRia = null;
    this.onremove();
    for (prop in this) {
        this[prop] = null;
    }
};
rialto.widget.AbstractContainer.prototype.resizeChilds = function (autoW, autoH) {
    for (var i = 0; i < this.arrChild.length; i++) {
        if (!autoW && !autoH) {
            if ((this.arrChild[i].autoResizableW || this.arrChild[i].autoResizableH) && this.arrChild[i].updateSize) {
                this.arrChild[i].updateSize();
            }
        } else {
            if (autoW && this.arrChild[i].autoResizableW && this.arrChild[i].updateWidth) {
                this.arrChild[i].updateWidth();
            }
            if (autoH && this.arrChild[i].autoResizableH && this.arrChild[i].updateHeight) {
                this.arrChild[i].updateHeight();
            }
        }
    }
};


function Container(oHtml, mode) {
    this.defMode = "masque";
    this.mode = this.mode || this.defMode;
    this.bPseudoTailleMax = true;
    this.idContainer = ++Container.prototype.nbInstances;
    this.setContainerHtml(oHtml, oHtml ? "nonFen" : mode);
    this.managementMode = "win";
    this.barreOnglets = null;
    this.bOptMSheetMode = true;
    this.ctrlFenFi = null;
}
Container.prototype.nbInstances = 0;
Container.prototype = {heightMinContainer:function () {
    if (this.mode == "AutoScroll") {
        return this.oScroll.heightMin();
    }
}, setContainerHtml:function (oHtml, mode, optionsMode) {
    if (!oHtml) {
        this.containerHtml = document.createElement("DIV");
    } else {
        if (mode == "AutoScroll") {
            var w = oHtml.offsetWidth;
            var h = oHtml.offsetHeight;
            this.oScroll = new ContainerAutoScroll(oHtml, null, w, h, optionsMode);
        }
        this.containerHtml = oHtml;
    }
    this.containerHtml.oContainer = this;
    traceExec("mode= " + mode, 76);
    if (mode != "nonFen") {
        this.mode = mode || this.defMode;
        traceExec("setContainerHtml this.mode= " + this.mode, 76);
        this.setModeDisplayContains();
        traceExec("setContainerHtml 1 this.containerHtml.className= " + this.containerHtml.className, 76);
    }
    traceExec("setContainerHtml2 this.containerHtml.className= " + this.containerHtml.className, 76);
}, setModeDisplayContains:function (mode) {
    if (mode) {
        this.mode = mode;
    }
    var etat = this.containerHtml.className.replace(/^[^\s]*/g, "");
    this.containerHtml.className = "container_" + this.mode + etat;
    traceExec("->" + this.containerHtml.className + "]", 25);
    traceExec("setModeDisplayContains  this.containerHtml.className=  " + this.containerHtml.className, 76);
}, setMSheetMode:function (posTabs) {
    if (this.managementMode == "sheet") {
        return;
    }
    this.managementMode = "sheet";
    this.ctrlFenFi.setManagtMode("sheet");
}, setMWinMode:function () {
    if (this.managementMode == "win") {
        return;
    }
    this.managementMode = "win";
    this.ctrlFenFi.setManagtMode("win");
}, setDimContainer:function (height, width) {
    if (this.mode == "AutoScroll") {
        this.oScroll.setDim(width, height);
    } else {
        this.containerHtml.style.height = height;
    }
}, modDimContainer:function (deltaH, deltaW) {
    if (this.mode == "AutoScroll") {
        this.oScroll.modDim(deltaW, deltaH);
    } else {
        this.containerHtml.style.height = parseInt(this.containerHtml.style.height) + deltaH;
    }
}, fill:function (eltHtml, bSaveOldContains, bClone) {
    if (bSaveOldContains && (!this.isEmpty())) {
        this.saveContains(bClear = true);
    } else {
        this.clear(bConserveEltsScroll = true);
    }
    if (eltHtml) {
        this.add(eltHtml, bClone);
    }
    return eltHtml;
}, isEmpty:function () {
    if (this.mode == "AutoScroll") {
        return this.oScroll.isEmpty();
    } else {
        return !this.firstChild;
    }
}, saveContains:function (bClear) {
    if (this.mode == "AutoScroll") {
        this.oScroll.saveCurrentBuffer(bClear);
    }
}, restoreContains:function (idContains, bSave) {
    if (this.mode == "AutoScroll") {
        this.oScroll.restoreBuffer(idContains, bSave);
    }
}, nextBuff:function () {
    if (this.mode == "AutoScroll") {
        this.oScroll.nextBuff();
    }
}, prevBuff:function () {
    if (this.mode == "AutoScroll") {
        this.oScroll.prevBuff();
    }
}, getHtmlCont:function () {
    return this.containerHtml;
}, add:function (elt, bClone) {
    if (!elt) {
        return -1;
    }
    if (this.mode == "AutoScroll") {
        this.oScroll.add(elt, bClone);
    } else {
        if (this.filleTailleMax) {
            this.svgZoneCentrale.appendChild(elt);
        } else {
            var comp, oHtml;
            if (elt.bRiaComp) {
                comp = elt;
                oHtml = elt.getHtmlExt();
            } else {
                if (elt.oRia || elt.oCiu) {
                    comp = elt.oRia || elt.oCiu;
                    oHtml = elt;
                } else {
                    comp = oHtml = elt;
                }
            }
            if (comp != oHtml) {
                this.record(comp);
            }
            this.getHtmlCont().appendChild(oHtml);
        }
    }
    if (comp.afterPlaceIn) {
        comp.afterPlaceIn();
    }
}, record:function (oRia) {
    if (!this.arrChild) {
        this.arrChild = new Array;
    }
    this.arrChild.push(oRia);
    oRia.inContainer = this;
}, clear:function (bConserveEltsIU) {
    if (!this.isEmpty()) {
        if (this.mode == "AutoScroll") {
            this.oScroll.clear(bConserveEltsIU);
        }
    }
}, addTabsPane:function (tabsPane, posTabs) {
    this.barreOnglets = tabsPane;
    this.containerHtml.insertBefore(tabsPane.html, this.containerHtml.firstChild);
}, delTabsPane:function () {
    this.containerHtml.removeChild(this.barreOnglets.html);
    this.barreOnglets = null;
}, replaceContainsBy:function (nvContenu) {
    this.containerHtml.firstChild.nodeValue = nvContenu;
}, nbElts:function () {
    return this.ctrlFenFi.length();
}, eltActif:function () {
    return this.ctrlFenFi.top();
}, abandonModePPEtRes:function (sansActivation) {
    traceExec("abandonModePPEtRes vers Container  entree container= " + this.titreFenetre, 31);
    traceExec("abandonModePPEtMin fillePseudoTailleMax -> svgFenFille.suppAjustDimDynExt()", 31);
    this.svgFenFille.suppAjustDimDynExt();
    this.svgFenFille.restoreSize(sansActivation);
    traceExec("abandonModePPEtRes vers Container sortie", 31);
}};


if (!rialto.widgetBehavior) {
    rialto.widgetBehavior = {};
}
rialto.widgetBehavior.createBehavior = function (behavior, baseFunction, extendedBehavior) {
    rialto.widgetBehavior[behavior] = function (setup) {
        if (!rialto.widgetBehavior.$$coreAffect.apply(this, [behavior, setup])) {
            return;
        }
        baseFunction.apply(this, [setup]);
        if (baseFunction.prototype) {
            for (var proto in baseFunction.prototype) {
                if (typeof baseFunction.prototype[proto] == "function") {
                    this[proto] = baseFunction.prototype[proto];
                }
            }
        }
    };
    if (baseFunction.prototype) {
        rialto.widgetBehavior[behavior].prototype = {};
    }
    for (var proto in baseFunction.prototype) {
        if (typeof baseFunction.prototype[proto] != "function") {
            rialto.widgetBehavior[behavior].prototype[proto] = baseFunction.prototype[proto];
        }
    }
    if (extendedBehavior) {
        rialto.widgetBehavior[behavior].superClass = rialto.widgetBehavior[extendedBehavior];
    }
};
rialto.widgetBehavior.$$coreAffect = function (behavior, setup) {
    if (!this.withBehavior) {
        this.withBehavior = {};
    }
    if (typeof this.withBehavior[behavior] != "undefined") {
        return false;
    } else {
        if (rialto.widgetBehavior[behavior].superClass) {
            this.base = rialto.widgetBehavior[behavior].superClass;
            this.base(setup);
        }
        this.withBehavior[behavior] = true;
        return true;
    }
};
rialto.widgetBehavior.affect = function (widget, behavior, setup) {
    if (!setup) {
        setup = {};
    }
    if ((!widget.withBehavior) || widget.withBehavior[behavior] == undefined) {
        widget[behavior] = rialto.widgetBehavior[behavior];
        widget[behavior](setup);
    } else {
        rialto.widgetBehavior.modify(widget, behavior, setup);
    }
};
rialto.widgetBehavior.desaffect = function (widget, behavior) {
    var oHtml;
    switch (behavior) {
      case "DragAndDrop":
        oHtml = widget.specs.oHtmlEvtTarget[0];
        break;
      case "Missile":
        oHtml = widget.specs.oHtmlEvtTarget[0];
        break;
      case "Target":
        oHtml = widget.oHtml;
        _DDMgr.removeTarget(widget);
        break;
      case "ReSize":
        oHtml = widget.specsRS.cibleEvt[0];
        break;
    }
    rialto.session.cleanOneDiv(oHtml);
};
rialto.widgetBehavior.modify = function (widget, behavior, setup) {
    alert(behavior);
    alert("a implementer : doit realiser une modification de comportement");
    if (!setup) {
        setup = {};
    }
    if ((!widget.withBehavior) || widget.withBehavior[behavior] == undefined) {
        alert("the widget " + widget.id + " hasn't " + behavior + " behavior : it cannot be modfied");
    } else {
        rialto.widgetBehavior.modify(widget, behavior, setup);
    }
};


var ENREG_DD = 99;
var oDeplact = null;
var _ECN_ICONE_DD_DEF = "icone_DD_def";
rialto.widgetBehavior.DD_SENSITIVEEDGEWIDTH_DEFAULT = 0;
var WICHMOUSEBUTTONFORDD_DEFAULT = "left";
var WICHMOUSEBUTTONFORDD_AUTHORIZEDVALUES = "left#right#both#";
rialto.widgetBehavior.DDStdtLoadLimitsMoving = function () {
    if (this.movingLimits.bRectLim) {
        this.movingLimits.rectLim.bottom = eval(this.movingLimits.rectLim.bottomSpecs);
        this.movingLimits.rectLim.right = eval(this.movingLimits.rectLim.rightSpecs);
        this.movingLimits.rectLim.top = eval(this.movingLimits.rectLim.topSpecs);
        this.movingLimits.rectLim.left = eval(this.movingLimits.rectLim.leftSpecs);
    }
    if (this.specs.ghost) {
        this.specs.ghost.top = eval(this.specs.ghost.topSpec);
        this.specs.ghost.height = eval(this.specs.ghost.heightSpec);
    }
    traceExec("=====================", 77);
    traceExec("=====================", 77);
    traceExec("=====================", 77);
    traceExec("loadDyn Specs  top= " + this.movingLimits.rectLim.topSpecs + " left= " + this.movingLimits.rectLim.leftSpecs + " right= " + this.movingLimits.rectLim.rightSpecs + " bottom= " + this.movingLimits.rectLim.bottomSpecs, 77);
    traceExec("loadDyn top= " + this.movingLimits.rectLim.top + " left= " + this.movingLimits.rectLim.left + " right= " + this.movingLimits.rectLim.right + " bottom= " + this.movingLimits.rectLim.bottom, 77);
};
rialto.widgetBehavior.DDStdtLoadParameters = function (specs) {
    if (!specs) {
        specs = new Object;
    }
    this.specs = new Object;
    if (!specs.oHtmlEvtTarget) {
        this.specs.oHtmlEvtTarget = new Array;
        this.specs.oHtmlEvtTarget[0] = this;
    } else {
        if (!(specs.oHtmlEvtTarget instanceof Array)) {
            var woHtmlEvtTarget = specs.oHtmlEvtTarget;
            this.specs.oHtmlEvtTarget = new Array;
            this.specs.oHtmlEvtTarget[0] = woHtmlEvtTarget;
        } else {
            if (specs.oHtmlEvtTarget instanceof Array) {
                this.specs.oHtmlEvtTarget = specs.oHtmlEvtTarget;
            } else {
            }
        }
    }
    this.specs.oHtmlToMove = specs.oHtmlToMove ? specs.oHtmlToMove : this;
    this.specs.dragMood = (specs.dragMood != null) ? specs.dragMood : specs.ghost ? "ghostMove" : "directMove";
    this.specs.bSelectMark = (specs.bSelectMark != null) ? specs.bSelectMark : true;
    this.specs.bDynamicsMovingLimits = (specs.bDynamicsMovingLimits != null) ? specs.bDynamicsMovingLimits : true;
    this.specs.ghost = new Object;
    if (this.specs.dragMood == "ghostMove") {
        if (specs.ghost) {
            traceExec("avant this.specs.oHtmlToMove" + _rum.$getHeight(this.specs.oHtmlToMove), 2);
            this.specs.ghost.height = specs.ghost.height ? specs.ghost.height : "_rum.$getHeight(this.specs.oHtmlToMove)";
            this.specs.ghost.top = specs.ghost.top ? specs.ghost.top : 0;
            this.specs.ghost.asChild = specs.ghost.asChild ? specs.ghost.asChild : false;
            this.specs.ghost.aspect = specs.ghost.aspect || "cadre";
            if ((this.specs.ghost.aspect != "frame") && (this.specs.ghost.aspect != "rect")) {
                this.specs.ghost.bIcone = true;
                if (this.specs.ghost.aspect == "icon") {
                    this.specs.ghost.aspect = _ECN_ICONE_DD_DEF;
                }
            }
            if (specs.ghost.bOnePixel) {
                this.specs.ghost.bOnePixel = specs.ghost.bOnePixel;
            } else {
                this.specs.ghost.bOnePixel = this.specs.ghost.bIcone ? true : false;
            }
        } else {
            this.specs.ghost.aspect = "frame";
            this.specs.ghost.top = 0;
            this.specs.ghost.height = "_rum.$getHeight(this.specs.oHtmlToMove)";
            this.specs.ghost.bOnePixel = false;
        }
    } else {
        this.specs.ghost = false;
        this.specs.bSelectMark = false;
    }
    if (this.specs.bDynamicsMovingLimits) {
        this.specs.ghost.heightSpec = this.specs.ghost.height;
        this.specs.ghost.topSpec = this.specs.ghost.top;
    } else {
        this.specs.ghost.height = eval(this.specs.ghost.height);
        this.specs.ghost.top = eval(this.specs.ghost.top);
    }
    this.specs.bMUpAction = (specs.bMUpAction != null) ? specs.bMUpAction : true;
    this.specs.posRelI = new Object;
    if (specs.posRelI) {
        this.specs.posRelI.top = specs.posRelI.top;
        this.specs.posRelI.left = specs.posRelI.left;
    }
    this.specs.modCurs = new Object;
    if (specs.modCursor) {
        this.specs.modCurs.avantDD = (specs.modCursor.avantDD != "undefined") ? specs.modCursor.avantDD : true;
        this.specs.modCurs.auClic = (specs.modCursor.auClic != "undefined") ? specs.modCursor.auClic : true;
    } else {
        this.specs.modCurs.avantDD = true;
        this.specs.modCurs.auClic = true;
    }
    if (specs.magneticsGrid) {
        this.specs.magneticsGrid = new Object;
        this.specs.magneticsGrid.widthCol = specs.magneticsGrid.widthCol || 10;
        this.specs.magneticsGrid.heightRow = specs.magneticsGrid.heightRow || 10;
    }
    this.complementProp = specs.complementProp;
    if (!specs.movingLimits) {
        specs.movingLimits = {};
    }
    this.movingLimits = new Object;
    this.movingLimits.bCircular = specs.movingLimits.bCircular || false;
    this.movingLimits.orientation = specs.movingLimits.orientation ? specs.movingLimits.orientation : "2D";
    traceExec("specs.bRectLim avant affact de this.movingLimits.bRectLim = " + specs.bRectLim, 73);
    this.movingLimits.bRectLim = (specs.bRectLim != null) ? specs.bRectLim : true;
    this.movingLimits.rectLim = new Object;
    var flagModSpecsMovingLimitsRectLim = false;
    if (!specs.movingLimits.rectLim) {
        specs.movingLimits.rectLim = {};
        flagModSpecsMovingLimitsRectLim = true;
    } else {
        for (var i in specs.movingLimits.rectLim) {
        }
        this.movingLimits.bRectLim = true;
    }
    this.movingLimits.oHtmlRef = specs.movingLimits.oHtmlRef || this.specs.oHtmlToMove.parentNode;
    if (this.movingLimits.bRectLim) {
        this.movingLimits.isWithLimitsDisplayed = true;
    } else {
        this.movingLimits.isWithLimitsDisplayed = false;
    }
    if (specs.magneticsGrid) {
        this.movingLimits.isWithLimitsDisplayed = true;
        this.specs.magneticsGrid.bDisplayed = true;
    }
    if (specs.isWithLimitsDisplayed != undefined) {
        this.movingLimits.isWithLimitsDisplayed = specs.isWithLimitsDisplayed;
    }
    if (!this.specs.bDynamicsMovingLimits) {
        this.movingLimits.rectLim.right = eval(specs.movingLimits.rectLim.right) || _rum.$getWidth(this.movingLimits.oHtmlRef, borderLess = true);
        this.movingLimits.rectLim.left = eval(specs.movingLimits.rectLim.left) || 0;
        traceExec("this.movingLimits.rectLim.left= " + this.movingLimits.rectLim.left, 77);
    } else {
        this.movingLimits.rectLim.rightSpecs = specs.movingLimits.rectLim.right || "_rum.$getWidth ( this.movingLimits.oHtmlRef,borderLess=true)";
    }
    if (!this.specs.bDynamicsMovingLimits) {
        this.movingLimits.rectLim.bottom = eval(specs.movingLimits.rectLim.bottom) || _rum.$getHeight(this.movingLimits.oHtmlRef, borderLess = true);
        this.movingLimits.rectLim.top = eval(specs.movingLimits.rectLim.top) || 0;
    } else {
        this.movingLimits.rectLim.bottomSpecs = specs.movingLimits.rectLim.bottom || "_rum.$getHeight(this.movingLimits.oHtmlRef,borderLess=true)";
        this.movingLimits.rectLim.leftSpecs = specs.movingLimits.rectLim.left || 0;
        this.movingLimits.rectLim.topSpecs = specs.movingLimits.rectLim.top || 0;
        traceExec("this.movingLimits.rectLim.leftSpecs= " + this.movingLimits.rectLim.leftSpecs, 77);
    }
    this.isWithMovingInfo = (specs.isWithMovingInfo != undefined) ? specs.isWithMovingInfo : false;
    this.isWithMovingInParentInfo = (specs.isWithMovingInParentInfo != undefined) ? specs.isWithMovingInParentInfo : false;
    if (specs.isWithMovingInParentInfo != undefined) {
        this.isWithMovingInfo = true;
    }
    if (this.movingLimits) {
        if (this.movingLimits.rectLim) {
        }
    }
    if (this.movingLimits.orientation == "h") {
        this.movingLimits.rectLim.topSpecs = this.movingLimits.rectLim.top = (specs.posRelI ? eval(specs.posRelI.top) : 0);
        this.movingLimits.rectLim.bottomSpecs = this.movingLimits.rectLim.bottom = _rum.$getHeight(this.specs.oHtmlToMove) + this.movingLimits.rectLim.top;
    } else {
        if (this.movingLimits.orientation == "v") {
            this.movingLimits.rectLim.leftSpecs = this.movingLimits.rectLim.left = (specs.posRelI ? eval(specs.posRelI.left) : 0);
            this.movingLimits.rectLim.rightSpecs = this.movingLimits.rectLim.right = _rum.$getWidth(this.specs.oHtmlToMove);
            +this.movingLimits.rectLim.left;
        }
    }
    this.specs.sensitiveEdgeWidth = specs.sensitiveEdgeWidth || rialto.widgetBehavior.DD_SENSITIVEEDGEWIDTH_DEFAULT;
    if (this.specs.posRelI.top != null) {
        this.specs.oHtmlToMove.style.top = this.specs.posRelI.top;
    }
    if (this.specs.posRelI.left != null) {
        this.specs.oHtmlToMove.style.left = this.specs.posRelI.left;
    }
    this.specs.whichMouseButtonForDD = specs.whichMouseButtonForDD || WICHMOUSEBUTTONFORDD_DEFAULT;
    if (WICHMOUSEBUTTONFORDD_AUTHORIZEDVALUES.indexOf(this.specs.whichMouseButtonForDD + "#") == -1) {
        this.specs.whichMouseButtonForDD = WICHMOUSEBUTTONFORDD_DEFAULT;
    }
    if (flagModSpecsMovingLimitsRectLim) {
        specs.movingLimits.rectLim = null;
    }
};
rialto.widgetBehavior.constructorDragAndDrop = function (specs) {
    if (!this.oCiu) {
        this.oCiu = new Array();
    }
    this.oCiu["DragAndDrop"] = this;
    if (!this.oCiu["DragAndDrop"].loadSpecs) {
        this.oCiu["DragAndDrop"].loadSpecs = rialto.widgetBehavior.DDStdtLoadParameters;
    }
    this.oCiu["DragAndDrop"].loadSpecs(specs);
    if (this.oCiu["DragAndDrop"].specs.bDynamicsMovingLimits) {
        if (!this.oCiu["DragAndDrop"].loadLimitsDyn) {
            this.oCiu["DragAndDrop"].loadLimitsDyn = rialto.widgetBehavior.DDStdtLoadLimitsMoving;
        }
        traceExec("before call loadLimitsDyn this.movingLimits.bRectLim = " + this.movingLimits.bRectLim, 73);
        this.oCiu["DragAndDrop"].loadLimitsDyn();
    }
    var oCiu = this.oCiu["DragAndDrop"];
    for (var i = 0; i < oCiu.specs.oHtmlEvtTarget.length; i++) {
        oCiu.specs.oHtmlEvtTarget[i].dragAndDrop = true;
        oCiu.specs.oHtmlEvtTarget[i].refObjSpecs = this;
        if (!oCiu.specs.oHtmlEvtTarget[i].behavior) {
            oCiu.specs.oHtmlEvtTarget[i].behavior = {};
        }
        if (!oCiu.specs.oHtmlEvtTarget[i].behavior["DD"]) {
            oCiu.specs.oHtmlEvtTarget[i].behavior["DD"] = {};
        }
        oCiu.specs.oHtmlEvtTarget[i].behavior["DD"].running = false;
    }
    if (typeof document.addEventListener == "undefined") {
        var tOCible = oCiu.specs.oHtmlEvtTarget;
        if (rialto.widgetBehavior.DragAndDrop_attachEventToDocument) {
            document.body.addHandler = ria.utils.event.addHandler;
            document.body.methodMouseDown = rialto.widgetBehavior.DragAndDropMouseDownHandler;
            document.body.addHandler(document.body, "onmousedown", "methodMouseDown");
            document.body.methodMouseMove = rialto.widgetBehavior.DragAndDropMouseMoveHandler;
            document.body.methodMouseUp = rialto.widgetBehavior.DragAndDropMouseUpHandler;
            document.body.addHandler(document.body, "onmousemove", "methodMouseMove");
            document.body.addHandler(document.body, "onmouseup", "methodMouseUp");
        } else {
            for (var i = 0; i < tOCible.length; i++) {
                tOCible[i].addHandler = ria.utils.event.addHandler;
                tOCible[i].methodMouseDown = rialto.widgetBehavior.DragAndDropMouseDownHandler;
                tOCible[i].addHandler(tOCible[i], "onmousedown", "methodMouseDown");
                tOCible[i].methodMouseMove = rialto.widgetBehavior.DragAndDropMouseMoveHandler;
                tOCible[i].methodMouseUp = rialto.widgetBehavior.DragAndDropMouseUpHandler;
                tOCible[i].addHandler(tOCible[i], "onmousemove", "methodMouseMove");
                tOCible[i].addHandler(tOCible[i], "onmouseup", "methodMouseUp");
            }
        }
    } else {
        if (!document.rialtoEnregtDragAndDrop) {
            document.rialtoEnregtDragAndDrop = true;
            document.addEventListener("mousemove", rialto.widgetBehavior.DragAndDropMouseMoveHandler, false);
            document.addEventListener("mouseup", rialto.widgetBehavior.DragAndDropMouseUpHandler, false);
            document.addEventListener("mousedown", rialto.widgetBehavior.StopSelectDef, false);
            document.addEventListener("mousedown", rialto.widgetBehavior.DragAndDropMouseDownHandler, false);
        }
    }
    if (this.specs.ghost) {
        var ghostFrame = rialto.session.objects ? rialto.session.objects["singleGhostFrame"] : null;
        if (ghostFrame == null) {
            rialto.session.objects["singleGhostFrame"] = ghostFrame = document.createElement("DIV");
            ghostFrame.id = "singleGhostFrame";
//maskat start
            rialto.effect.opacity(ghostFrame,rialto.widgetBehavior.DragAndDrop_defaults.ghost_opacity);
//maskat end
            ghostFrame.className = "ghostDD_" + this.specs.ghost.aspect;
            document.body.appendChild(ghostFrame);
        }
    }
    this.extendToMissile = function (specs) {
        this.$$bh_Missile = Missile;
        this.$$bh_Missile(specs);
    };
};
rialto.widgetBehavior.createBehavior("DragAndDrop", rialto.widgetBehavior.constructorDragAndDrop);
rialto.widgetBehavior.DDtargetOrTargetChild = function (oHtml) {
    var div = oHtml;
    while (div && !div.dragAndDrop) {
        div = div.parentNode;
    }
    if (div && div.dragAndDrop) {
        return div;
    } else {
        return null;
    }
};
rialto.widgetBehavior.DDmodCursor = function (oHtml, direction, orientation, cible) {
    if (cible) {
        oHtml.style.cursor = "move";
        return;
    }
    if (direction == "") {
    } else {
        if (orientation == "v") {
            oHtml.style.cursor = direction + "-resize";
        } else {
            if (orientation == "h") {
                oHtml.style.cursor = direction + "-resize";
            } else {
                oHtml.style.cursor = "move";
            }
        }
    }
};
rialto.widgetBehavior.StopSelectDef = function (e) {
    stopDefault(e);
};
rialto.widgetBehavior.Missile = function (specs) {
    var domain = specs.domainTargets;
    var targets = specs.targets;
    var domainUnauthorizedTarget = specs.unauthorizedTargets;
    this.specs.targetChoice = specs.targetChoice || "";
    this.specs.circularDropAuthorized = specs.circularDropAuthorized || false;
    this.specs.dropTargets = true;
    this.specs.domain = domain;
    this.specs.targets = targets;
    if (targets != undefined) {
        if (!this.specs.domain) {
            alert("missile constructeur avec cible mais sans domain defini");
            this.specs.domain = "__domProv" + rialto.widgetBehavior.Missile.prototype.idDomainProv++;
            alert("domain construit = " + this.specs.domain);
        }
        for (var i = 0; i < targets.length; i++) {
            rialto.widgetBehavior.affect(targets[i], "Target", {domain:this.specs.domain});
        }
    }
    if (typeof domainUnauthorizedTarget == "string") {
        this.specs.domainUnauthorizedTarget = domainUnauthorizedTarget;
    } else {
        if (domainUnauthorizedTarget instanceof Array) {
            this.specs.domainUnauthorizedTarget = "__domProv" + Missile.prototype.idDomainProv++;
            var c;
            for (var i = 0; i < domainUnauthorizedTarget.length; i++) {
                c = domainUnauthorizedTarget[i];
                rialto.widgetBehavior.affect(c, "Target", {domain:this.specs.domainUnauthorizedTarget});
            }
        }
    }
};
rialto.widgetBehavior.Missile.prototype.idDomainProv = 0;
rialto.widgetBehavior.createBehavior("Missile", rialto.widgetBehavior.Missile, "DragAndDrop");
rialto.widgetBehavior.baseTarget = function (specs) {
    if (specs == undefined) {
        specs = {};
    }
    var oHtml = specs.oHtml;
    var domain = specs.domain;
    this.oHtml = oHtml || this;
    this.oHtml.oRia = this;
    this.oHtml.onmouseover = function (e) {
        traceExec(e, 9);
    };
    if (!this.oHtml.id || ((typeof this.oHtml.id) == "undefined")) {
        this.oHtml.id = rialto.widgetBehavior.baseTarget.prototype.nbInstances++;
    }
    this.id = this.oHtml.id;
    this.domain = domain || "undef";
    var oSpecs;
    if (!specs) {
        oSpecs = new Object;
    } else {
        oSpecs = specs;
    }
    this.specsTarg = new Object;
    this.specsTarg.missileAsOnePixel = (oSpecs.missileAsOnePixel != undefined) ? oSpecs.missileAsOnePixel : true;
    this.specsTarg.borderIsTarget = (oSpecs.borderIsTarget != undefined) ? oSpecs.borderIsTarget : true;
    this.witnessOfDragHover = rialto.widgetBehavior.baseTarget.witnessOfDragHover;
    this.removeWitnessOfDragHover = rialto.widgetBehavior.baseTarget.removeWitnessOfDragHover;
    if (rialto.widgetBehavior.DragAndDrop_withMouseOverMood) {
        this.onmouseover = function (e) {
            if (!_DDMgr) {
                return;
            }
            if (!_DDMgr.currDrag) {
                return;
            }
            if (!_DDMgr.flyOverOneTarget(this)) {
                _DDMgr.flyOverOneTarget(this, unauthorized = true);
            }
            stopEvent(e);
        };
    }
    _DDMgr.addTarget(this.oHtml, this.domain);
};
rialto.widgetBehavior.baseTarget.prototype.nbInstances = 0;
rialto.widgetBehavior.baseTarget.witnessOfDragHover = function (display, isTargetsUnAuthorized) {
    if (this.witnessDragHover) {
        return;
    }
    var iTopLeftBoundDivToMoveInVP = _rum.$divInternalTopLeftInViewPort(this.oHtml);
    var iTopBoundDivToMoveInVP = iTopLeftBoundDivToMoveInVP.top;
    var iLeftBoundDivToMoveInVP = iTopLeftBoundDivToMoveInVP.left;
    this.witnessDragHover = document.createElement("DIV");
    this.ws = this.witnessDragHover.style;
    if (isTargetsUnAuthorized) {
        this.witnessDragHover.className = "dashed line redBorder";
    } else {
        this.witnessDragHover.className = "dashed line greenBorder";
    }
    document.body.appendChild(this.witnessDragHover);
    if (this.oHtml.nodeName == "BODY") {
        _rum.$setSizeConformW3C(this.witnessDragHover, document.body);
        this.ws.top = this.ws.left = 0;
    } else {
        if (this.specsTarg.borderIsTarget) {
            this.ws.width = _rum.$getWidth(this.oHtml, borderLess = false);
            this.ws.height = _rum.$getHeight(this.oHtml, borderLess = false);
            _rum.$setSizeConformW3C(this.witnessDragHover);
            this.ws.top = iTopBoundDivToMoveInVP - _rum.$$getBorderTopWidth(this.oHtml) - _rum.$$getBorderTopWidth(this.witnessDragHover);
            this.ws.left = iLeftBoundDivToMoveInVP - _rum.$$getBorderLeftWidth(this.oHtml) - _rum.$$getBorderLeftWidth(this.witnessDragHover);
        } else {
            this.ws.width = _rum.$getWidth(this.oHtml, borderLess = true);
            this.ws.height = _rum.$getHeight(this.oHtml, borderLess = true);
            this.ws.top = iTopBoundDivToMoveInVP - _rum.$$getBorderTopWidth(this.witnessDragHover);
            this.ws.left = iLeftBoundDivToMoveInVP - _rum.$$getBorderLeftWidth(this.witnessDragHover);
        }
    }
    if (display) {
        this.witnessDragHover.style.display = "block";
    } else {
        this.witnessDragHover.style.display = "none";
    }
};
rialto.widgetBehavior.baseTarget.removeWitnessOfDragHover = function () {
    document.body.removeChild(this.witnessDragHover);
    this.witnessDragHover = null;
};
rialto.widgetBehavior.baseTarget.prototype.DDHover = function (missile, isTargetsUnAuthorized) {
    traceExec("hover------ this.id= " + this.id, 78);
    this.witnessOfDragHover(display = true, isTargetsUnAuthorized);
};
rialto.widgetBehavior.baseTarget.prototype.DDOuter = function (missile) {
    traceExec("outer------ this.id= " + this.id, 78);
    this.removeWitnessOfDragHover();
};
rialto.widgetBehavior.createBehavior("Target", rialto.widgetBehavior.baseTarget);


rialto.widgetBehavior.DragAndDrop_withMouseOverMood = false;
rialto.widgetBehavior.DragAndDrop_attachEventToDocument = false;
if (rialto.widgetBehavior.DragAndDrop_withMouseOverMood) {
    rialto.widgetBehavior.DragAndDrop_attachEventToDocument = true;
}
rialto.widgetBehavior.DragAndDrop_cstes = {zIndexMovingOHtml:1000000, zIndexInfoFrame:1000001};
rialto.widgetBehavior.DragAndDrop_defaults = {ghost_opacity:0.5, markSelect_opacity:0.5};
rialto.widgetBehavior.DragAndDropMouseDownHandler = function (e) {
    if (!e) {
        var e = window.event;
    }
    var oSourceEvt = e.target ? e.target : e.srcElement;
    var cibl = rialto.widgetBehavior.DDtargetOrTargetChild(oSourceEvt);
    if (!cibl) {
        return;
    } else {
        oSourceEvt = cibl;
    }
    var oHtml = oSourceEvt;
    if (oHtml.widgetLink) {
        traceExec("****************DragAndDropMouseDownHandler" + oHtml.widgetLink.componentName, 1);
    }
    var oSpecs = oHtml.refObjSpecs;
    switch (oSpecs.specs.whichMouseButtonForDD) {
      case "left":
        if (!ria.utils.event.isLeftClick(e)) {
            return true;
        }
        break;
      case "right":
        if (!ria.utils.event.isRightClick(e)) {
            return true;
        }
        break;
      case "both":
        if ((!ria.utils.event.isLeftClick(e)) && (!ria.utils.event.isRightClick(e))) {
            return true;
        }
        break;
      default:
        break;
    }
    var direction = DirDeplact(oHtml, e, _rum.$getHeight(oHtml), _rum.$getWidth(oHtml), oSpecs.specs.sensitiveEdgeWidth, true, oSpecs.movingLimits.orientation);
    if (!direction) {
        return;
    }
    if ((oHtml.behavior["RS"]) && (oHtml.behavior["RS"].isRunning)) {
        return;
    } else {
        oHtml.behavior["DD"].isRunning = true;
    }
    if (oSpecs.specs.bDynamicsMovingLimits) {
        oSpecs.loadLimitsDyn();
    }
    var oHtmlToMove = oSpecs.specs.oHtmlToMove;
    var oHtmlParentRef = oHtmlToMove.parentNode;
    var boundOHtmlRef = oSpecs.movingLimits.oHtmlRef;
    if (oSpecs.specs.bSelectMark) {
        var maskSelect = document.createElement("DIV");
        traceExec("****************CREATION D'UN MASQUE", 1);
        maskSelect.id = "maskSelectDD_unique";
        maskSelect.className = "maskSelectDD";
        maskSelect.style.top = -_rum.$$getBorderTopWidth(oHtmlToMove);
        maskSelect.style.left = -_rum.$$getBorderLeftWidth(oHtmlToMove);
        maskSelect.style.width = oHtmlToMove.offsetWidth;
        maskSelect.style.height = oHtmlToMove.offsetHeight;
        rialto.effect.opacity(maskSelect, 0.5);
        oHtmlToMove.appendChild(maskSelect);
    }
    var parentOHtmlToMove;
    var nextSiblOHtmlToMove;
    var isMovingOHtmlInDoct = true;
    var topLeftDivToMoveInVP = _rum.$divTopLeftInViewPort(oHtmlToMove);
    var topDivToMoveInVP = topLeftDivToMoveInVP.top;
    var leftDivToMoveInVP = topLeftDivToMoveInVP.left;
    var topLeftEvtInVP = _rum.$eventTopLeftInViewPort(e);
    var topEvtInVP = topLeftEvtInVP.top;
    var leftEvtInVP = topLeftEvtInVP.left;
    shiftTopForIcon = 0;
    shiftLeftForIcon = 0;
    if ((oSpecs.specs.ghost.bIcone) && (!oSpecs.specs.magneticsGrid)) {
        shiftTopForIcon = (oSpecs.movingLimits.orientation == "h") ? 0 : topEvtInVP - topDivToMoveInVP;
        shiftLeftForIcon = (oSpecs.movingLimits.orientation == "v") ? 0 : leftEvtInVP - leftDivToMoveInVP;
        topDivToMoveInVP = topEvtInVP;
        leftDivToMoveInVP = leftEvtInVP;
    }
    var iTopLeftBoundDivToMoveInVP = _rum.$divInternalTopLeftInViewPort(boundOHtmlRef);
    var iTopBoundDivToMoveInVP = iTopLeftBoundDivToMoveInVP.top;
    var iLeftBoundDivToMoveInVP = iTopLeftBoundDivToMoveInVP.left;
    var iTopLeftParDivToMoveInVP = _rum.$divInternalTopLeftInViewPort(oHtmlParentRef);
    var iTopParDivToMoveInVP = iTopLeftParDivToMoveInVP.top;
    var iLeftParDivToMoveInVP = iTopLeftParDivToMoveInVP.left;
    var deltaTopCursOHtmlToMove = topEvtInVP - topDivToMoveInVP;
    var deltaLeftCursOHtmlToMove = leftEvtInVP - leftDivToMoveInVP;
    topMovingDiv = topDivToMoveInVP;
    leftMovingDiv = leftDivToMoveInVP;
    var isMovingOHtmlRelPos = false;
    var initTopInRel;
    var initLeftInRel;
    var topInNaturalFlow, leftInNaturalFlow;
    if (oSpecs.specs.ghost && !oSpecs.specs.ghost.asChild) {
        var ghostFrame = document.getElementById("singleGhostFrame");
        if (ghostFrame == null) {
            ghostFrame = document.createElement("DIV");
            ghostFrame.id = "singleGhostFrame";
        }
        ghostFrame.style.width = "";
        ghostFrame.style.height = "";
        ghostFrame.className = "ghostDD_" + oSpecs.specs.ghost.aspect;
        rialto.effect.opacity(ghostFrame, rialto.widgetBehavior.DragAndDrop_defaults.ghost_opacity);
        document.body.appendChild(ghostFrame);
        ghostFrame.style.top = topMovingDiv;
        ghostFrame.style.left = leftMovingDiv;
        if (!oSpecs.specs.ghost.bIcone) {
            _rum.$setSizeConformW3C(ghostFrame, oHtmlToMove);
            if (oSpecs.specs.ghost.height) {
                ghostFrame.style.height = eval(oSpecs.specs.ghost.height);
            }
        }
        if (oSpecs.specs.ghost.top) {
            ghostFrame.style.top = eval(oSpecs.specs.ghost.top);
        }
        ghostFrame.style.display = "block";
        var movingOHtml = ghostFrame;
        movingOHtml.refObjSpecs = oSpecs;
    } else {
        if (oSpecs.specs.ghost && oSpecs.specs.ghost.asChild) {
            var ghostFrame = document.getElementById("singleGhostFrame");
            if (ghostFrame == null) {
                ghostFrame = document.createElement("DIV");
                ghostFrame.id = "singleGhostFrame";
            }
            ghostFrame.style.top = _rum.$offsetTop(oHtmlToMove);
            ghostFrame.style.left = _rum.$offsetLeft(oHtmlToMove);
            ghostFrame.style.width = "";
            ghostFrame.style.height = "";
            ghostFrame.className = "ghostDD_" + oSpecs.specs.ghost.aspect;
            rialto.effect.opacity(ghostFrame, rialto.widgetBehavior.DragAndDrop_defaults.ghost_opacity);
            oHtmlToMove.parentNode.appendChild(ghostFrame);
            if (!oSpecs.specs.ghost.bIcone) {
                _rum.$setSizeConformW3C(ghostFrame, oHtmlToMove);
                if (oSpecs.specs.ghost.height) {
                    ghostFrame.style.height = eval(oSpecs.specs.ghost.height);
                }
            }
            ghostFrame.style.zIndex = rialto.widgetBehavior.DragAndDrop_cstes.zIndexMovingOHtml;
            ghostFrame.style.display = "block";
            var movingOHtml = ghostFrame;
            movingOHtml.refObjSpecs = oSpecs;
            isMovingOHtmlInDoct = false;
            isMovingOHtmlRelPos = (movingOHtml.style.position == "relative");
            initTopInRel = parseInt(_rum.$getStyle(movingOHtml, "top"));
            initLeftInRel = parseInt(_rum.$getStyle(movingOHtml, "left"));
            topInNaturalFlow = _rum.$offsetTop(movingOHtml) - initTopInRel;
            leftInNaturalFlow = _rum.$offsetLeft(movingOHtml) - initLeftInRel;
            topMovingDiv = (movingOHtml.style.position == "relative") ? initTopInRel : _rum.$offsetTop(movingOHtml);
            leftMovingDiv = (movingOHtml.style.position == "relative") ? initLeftInRel : _rum.$offsetLeft(movingOHtml);
        } else {
            var movingOHtml, top, left;
            movingOHtml = oHtmlToMove;
            isMovingOHtmlInDoct = false;
            isMovingOHtmlRelPos = (movingOHtml.style.position == "relative");
            initTopInRel = parseInt(_rum.$getStyle(movingOHtml, "top"));
            initLeftInRel = parseInt(_rum.$getStyle(movingOHtml, "left"));
            topInNaturalFlow = _rum.$offsetTop(movingOHtml) - initTopInRel;
            leftInNaturalFlow = _rum.$offsetLeft(movingOHtml) - initLeftInRel;
            topMovingDiv = (movingOHtml.style.position == "relative") ? initTopInRel : _rum.$offsetTop(movingOHtml);
            leftMovingDiv = (movingOHtml.style.position == "relative") ? initLeftInRel : _rum.$offsetLeft(movingOHtml);
        }
    }
    var shiftRelToAbsTop = (isMovingOHtmlInDoct) ? 0 : iTopLeftParDivToMoveInVP.top;
    var shiftRelToAbsLeft = (isMovingOHtmlInDoct) ? 0 : iTopLeftParDivToMoveInVP.left;
    var shiftAbsToRelTop = (isMovingOHtmlInDoct) ? -iTopLeftParDivToMoveInVP.top : 0;
    var shiftAbsToRelLeft = (isMovingOHtmlInDoct) ? -iTopLeftParDivToMoveInVP.left : 0;
    if (oSpecs.movingLimits.bRectLim) {
        var dLimLeft = dLimTop = dLimRight = dLimBottom = 0;
        if (oSpecs.movingLimits.orientation == "h") {
            dLimTop = iTopParDivToMoveInVP - iTopBoundDivToMoveInVP + _rum.$offsetTop(oHtmlToMove);
            dLimBottom = dLimTop + oHtmlToMove.offsetHeight;
        } else {
            dLimTop = oSpecs.movingLimits.rectLim.top;
            dLimBottom = oSpecs.movingLimits.rectLim.bottom;
        }
        if (oSpecs.movingLimits.orientation == "v") {
            dLimLeft = _rum.$offsetLeft(oHtmlToMove) + iLeftParDivToMoveInVP - iLeftBoundDivToMoveInVP;
            dLimRight = dLimLeft + oHtmlToMove.offsetWidth;
        } else {
            dLimLeft = oSpecs.movingLimits.rectLim.left;
            dLimRight = oSpecs.movingLimits.rectLim.right;
        }
        var gheight = (dLimBottom - dLimTop);
        var gwidth = (dLimRight - dLimLeft);
        if (oSpecs.specs.magneticsGrid) {
            oSpecs.specs.magneticsGrid.nbHorizontalLines = parseInt((gheight - parseInt(oHtmlToMove.offsetHeight)) / oSpecs.specs.magneticsGrid.heightRow) + 1;
            oSpecs.specs.magneticsGrid.nbVerticalLines = parseInt((gwidth - parseInt(oHtmlToMove.offsetWidth)) / oSpecs.specs.magneticsGrid.widthCol) + 1;
        }
    }
    if (oSpecs.movingLimits.isWithLimitsDisplayed) {
        var limRect = document.createElement("DIV");
        limRect.style.width = gwidth;
        limRect.style.height = gheight;
        limRect.className = "line dashed greenBorder";
        document.body.appendChild(limRect);
        _rum.$setWidthConformW3C(limRect);
        var revisedHeight = _rum.$setHeightConformW3C(limRect);
        var IEBorder = revisedHeight - gheight;
        var gridEdgeWidth = _rum.$$getBorderTopWidth(limRect);
        limRect.style.top = iTopBoundDivToMoveInVP - gridEdgeWidth + dLimTop;
        limRect.style.left = iLeftBoundDivToMoveInVP - gridEdgeWidth + dLimLeft;
        if (oSpecs.specs.magneticsGrid && oSpecs.specs.magneticsGrid.bDisplayed) {
            traceExec("MD grid dLimTop= " + dLimTop + " dLimLeft= " + dLimLeft + " gwidth = " + gwidth + " gheight= " + gheight, 2);
            gtop = -gridEdgeWidth;
            for (var i = 0; i < oSpecs.specs.magneticsGrid.nbHorizontalLines; i++) {
                line = document.createElement("DIV");
                line.className = "line horizontal redBorder";
                line.style.top = gtop;
                line.style.left = 0;
                line.style.width = parseInt(limRect.style.width) - (IEBorder);
                line.style.height = 0;
                line.style.clip = "rect(0," + parseInt(line.style.width) + "px," + gridEdgeWidth + ",0)";
                gtop = gtop + oSpecs.specs.magneticsGrid.heightRow;
                limRect.appendChild(line);
            }
            gleft = -gridEdgeWidth;
            for (var i = 0; i < oSpecs.specs.magneticsGrid.nbVerticalLines; i++) {
                lineV = document.createElement("DIV");
                lineV.className = "line vertical aquamarineBorder";
                lineV.style.left = gleft;
                lineV.style.top = 0;
                lineV.style.height = parseInt(limRect.style.height) - (IEBorder);
                lineV.style.clip = "rect(0," + gridEdgeWidth + "," + +parseInt(lineV.style.height) + "px" + ",0)";
                gleft = gleft + oSpecs.specs.magneticsGrid.widthCol;
                limRect.appendChild(lineV);
            }
        }
    }
    if (oSpecs.isWithMovingInfo) {
        var infoFrame = document.createElement("DIV");
        infoFrame.className = "DDinfoFrame";
        infoFrame.topShift = 10;
        infoFrame.leftShift = 20;
        infoFrame.topShiftI = topEvtInVP;
        infoFrame.leftShiftI = leftEvtInVP;
        infoFrame.style.top = infoFrame.topShiftI + infoFrame.topShift;
        infoFrame.style.left = infoFrame.leftShiftI + infoFrame.leftShift;
        infoFrame.style.filter = "alpha(opacity:50)";
        infoFrame.style.opacity = 0.5;
        infoFrame.style.zIndex = rialto.widgetBehavior.DragAndDrop_cstes.zIndexInfoFrame;
        infoFrame.isWithMovingInParentInfo = oSpecs.isWithMovingInParentInfo;
        if (oSpecs.isWithMovingInParentInfo) {
            infoFrame.innerHTML = (parseInt(movingOHtml.style.top) + shiftAbsToRelTop) + "," + (parseInt(movingOHtml.style.left) + shiftAbsToRelLeft);
        } else {
            infoFrame.innerHTML = (parseInt(movingOHtml.style.top) + shiftRelToAbsTop) + "," + (parseInt(movingOHtml.style.left) + shiftRelToAbsLeft);
        }
        document.body.appendChild(infoFrame);
    }
    traceExec("isMovingOHtmlRelPos\t: " + isMovingOHtmlRelPos + " initTopInRel\t\t\t: " + initTopInRel + " initLeftInRel\t\t\t: " + initLeftInRel, 2);
    var dTopParentToBoundRef, dLeftParentToBoundRef;
    if (oHtmlParentRef == boundOHtmlRef) {
        dTopParentToBoundRef = 0;
        dLeftParentToBoundRef = 0;
    } else {
        dTopParentToBoundRef = iTopLeftBoundDivToMoveInVP.top - iTopLeftParDivToMoveInVP.top;
        dLeftParentToBoundRef = iTopLeftBoundDivToMoveInVP.left - iTopLeftParDivToMoveInVP.left;
    }
    top = parseInt(movingOHtml.style.top);
    left = parseInt(movingOHtml.style.left);
    _DDMgr.initDrag({oThis:oSpecs, oSource:oHtml, ghost:oSpecs.specs.ghost, maskSelect:(oSpecs.specs.bSelectMark ? maskSelect : null), movingOHtml:movingOHtml, oHtmlToMove:oHtmlToMove, bMUpAction:oSpecs.specs.bMUpAction, isMovingOHtmlRelPos:isMovingOHtmlRelPos, topInNaturalFlow:topInNaturalFlow, leftInNaturalFlow:leftInNaturalFlow, isMovingOHtmlInDoct:isMovingOHtmlInDoct, initialTop:initTopInRel, initialLeft:initLeftInRel, topDivToMoveInVP:topDivToMoveInVP, leftDivToMoveInVP:leftDivToMoveInVP, topEvtInVP:topEvtInVP, leftEvtInVP:leftEvtInVP, iTopBoundDivToMoveInVP:iTopBoundDivToMoveInVP, iLeftBoundDivToMoveInVP:iLeftBoundDivToMoveInVP, shiftAbsToRelTop:shiftAbsToRelTop, shiftAbsToRelLeft:shiftAbsToRelLeft, shiftRelToAbsTop:shiftRelToAbsTop, shiftRelToAbsLeft:shiftRelToAbsLeft, deltaTopCursOHtmlToMove:deltaTopCursOHtmlToMove, deltaLeftCursOHtmlToMove:deltaLeftCursOHtmlToMove, eventTopLeftInDiv:{top:deltaTopCursOHtmlToMove, left:deltaLeftCursOHtmlToMove}, topMovingDiv:topMovingDiv, leftMovingDiv:leftMovingDiv, totDeltaMoveTop:0, totDeltaMoveLeft:0, dTopParentToBoundRef:dTopParentToBoundRef, dLeftParentToBoundRef:dLeftParentToBoundRef, prevTop:top, prevLeft:left, mvtEffectif:false, cibleOk:false, svgZIndex:movingOHtml.style.zIndex || 0, oHtmlParentRef:oHtmlParentRef, boundOHtmlRef:boundOHtmlRef, oHtmlLimitsRect:limRect, oHtmlInfoFrame:infoFrame});
    _DDMgr.currDrag.movingOHtml.style.zIndex = rialto.widgetBehavior.DragAndDrop_cstes.zIndexMovingOHtml;
    if (this.setCapture) {
        if (!rialto.widgetBehavior.DragAndDrop_attachEventToDocument) {
            this.setCapture();
        }
        if ((!oSpecs.specs.modCurs.avantDD) && (oSpecs.specs.modCurs.auClic)) {
            rialto.widgetBehavior.DDmodCursor(oHtml, direction, oSpecs.movingLimits.orientation, false);
        }
    } else {
        if ((!oSpecs.specs.modCurs.avantDD) && (oSpecs.specs.modCurs.auClic)) {
            if (oSpecs.specs.ghost) {
                rialto.widgetBehavior.DDmodCursor(objetEnDeplact, direction, oSpecs.movingLimits.orientation, true);
            } else {
                rialto.widgetBehavior.DDmodCursor(oHtml, direction, oSpecs.movingLimits.orientation, true);
            }
        }
    }
    var oThis = _DDMgr.currDrag.oThis;
    if (oThis.afterMD) {
        oThis.afterMD();
    }
    stopEvent(e);
};
rialto.widgetBehavior.DragAndDropMouseMoveHandler = function (e) {
    if (!e) {
        var e = window.event;
    }
    var oHtml = e.target ? e.target : e.srcElement;
    if (!_DDMgr.currDrag) {
        if (!oHtml.dragAndDrop) {
            return;
        }
        var oSpecs = oHtml.refObjSpecs;
        if (oSpecs.specs.modCurs.avantDD) {
            var direction = DirDeplact(oHtml, e, _rum.$getHeight(oHtml), _rum.$getWidth(oHtml), oSpecs.specs.sensitiveEdgeWidth, true, oSpecs.movingLimits.orientation);
            rialto.widgetBehavior.DDmodCursor(oHtml, direction, oSpecs.movingLimits.orientation, false);
        }
    } else {
        if (e.clientX >= 0 && e.clientY >= 0) {
            var oMovingStyle = _DDMgr.currDrag.movingOHtml.style;
            traceExec("MM : " + " top= " + oMovingStyle.top + " left= " + oMovingStyle.left + " width= " + oMovingStyle.width + " height = " + oMovingStyle.height + " backColor = " + oMovingStyle.backgroundColor + " e.clientX = " + e.clientX, 2);
            _DDMgr.currDrag.mvtEffectif = true;
            var nvEventTopLeft = _rum.$eventTopLeftInViewPort(e);
            var totDeltaMoveTop = nvEventTopLeft.top - _DDMgr.currDrag.topEvtInVP;
            var totDeltaMoveLeft = nvEventTopLeft.left - _DDMgr.currDrag.leftEvtInVP;
            newPos = {};
            newPos.top = _DDMgr.currDrag.topMovingDiv + totDeltaMoveTop;
            newPos.left = _DDMgr.currDrag.leftMovingDiv + totDeltaMoveLeft;
            var oWithSpecs = _DDMgr.currDrag.oThis;
            var dTopLeft = rialto.widgetBehavior.$$DDMM_AbsToRel();
            if (oWithSpecs.movingLimits.bRectLim) {
                rialto.widgetBehavior.$$DDMM_applyConstraintsLimits(oWithSpecs, newPos, dTopLeft.top, dTopLeft.left);
            }
            if (oWithSpecs.specs.magneticsGrid) {
                rialto.widgetBehavior.$$DDMM_applyConstraintsMagneticsGrid(oWithSpecs, newPos, dTopLeft.top, dTopLeft.left);
            }
            oMovingStyle.left = newPos.left;
            oMovingStyle.top = newPos.top;
            traceExec("apply newPos.top= " + newPos.top + "newPos.left= " + newPos.left, 73);
            if ((oWithSpecs.specs.dropTargets) && (!oWithSpecs.specs.cibleOk)) {
                if (!rialto.widgetBehavior.DragAndDrop_withMouseOverMood || !oWithSpecs.specs.ghost.bIcone) {
                    rialto.widgetBehavior.$$DDMM_applyConstraintTargets(oWithSpecs);
                    rialto.widgetBehavior.DDmodCursor(_DDMgr.currDrag.movingOHtml, oWithSpecs.movingLimits.orientation, _DDMgr.currDrag.orientation, _DDMgr.currDrag.cibleOk);
                }
            }
            _DDMgr.currDrag.totDeltaMoveTop = newPos.top - _DDMgr.currDrag.topMovingDiv;
            _DDMgr.currDrag.totDeltaMoveLeft = newPos.left - _DDMgr.currDrag.leftMovingDiv;
            if (_DDMgr.currDrag.oHtmlInfoFrame) {
                rialto.widgetBehavior.$$DDMM_displayInfos(oMovingStyle, e, nvEventTopLeft);
            }
            if (oWithSpecs.synchro) {
                rialto.widgetBehavior.$$DDMM_CallBackSynchro(oWithSpecs);
            }
        }
    }
};
rialto.widgetBehavior.$$DDMM_AbsToRel = function () {
    var dTop, dLeft;
    if (_DDMgr.currDrag.isMovingOHtmlInDoct) {
        dTop = _DDMgr.currDrag.iTopBoundDivToMoveInVP;
        dLeft = _DDMgr.currDrag.iLeftBoundDivToMoveInVP;
    } else {
        dTop = _DDMgr.currDrag.dTopParentToBoundRef;
        dLeft = _DDMgr.currDrag.dLeftParentToBoundRef;
        if (_DDMgr.currDrag.isMovingOHtmlRelPos) {
            dTop -= _DDMgr.currDrag.topInNaturalFlow;
            dLeft -= _DDMgr.currDrag.leftInNaturalFlow;
        }
    }
    return {top:dTop, left:dLeft};
};
rialto.widgetBehavior.$$DDMM_applyConstraintsMagneticsGrid = function (oSpecs, newPos, dTop, dLeft) {
    var nvTop = newPos.top;
    var nvLeft = newPos.left;
    var dLimLeft = dLimTop = 0;
    if (oSpecs.movingLimits.rectLim) {
        dLimLeft = oSpecs.movingLimits.rectLim.left;
        dLimTop = oSpecs.movingLimits.rectLim.top;
    }
    if (oSpecs.movingLimits.orientation != "v") {
        var nInterv = Math.round((nvLeft - dLeft - dLimLeft) / oSpecs.specs.magneticsGrid.widthCol);
        nInterv = Math.min((oSpecs.specs.magneticsGrid.nbVerticalLines - 1), nInterv);
        nvLeft = (nInterv) * oSpecs.specs.magneticsGrid.widthCol + dLeft + dLimLeft;
    }
    if (oSpecs.movingLimits.orientation != "h") {
        var nInterv = Math.round((nvTop - dTop - dLimTop) / oSpecs.specs.magneticsGrid.heightRow);
        nInterv = Math.min((oSpecs.specs.magneticsGrid.nbHorizontalLines - 1), nInterv);
        nvTop = (nInterv) * oSpecs.specs.magneticsGrid.heightRow + dTop + dLimTop;
    }
    newPos.top = nvTop;
    newPos.left = nvLeft;
};
rialto.widgetBehavior.$$DDMM_displayInfos = function (oMovingStyle, e, nvEventTopLeft) {
    if (_DDMgr.currDrag.oHtmlInfoFrame.isWithMovingInParentInfo) {
        var topLeft = (parseInt(oMovingStyle.top) + _DDMgr.currDrag.shiftAbsToRelTop) + "," + (parseInt(oMovingStyle.left) + _DDMgr.currDrag.shiftAbsToRelLeft);
    } else {
        var topLeft = (parseInt(oMovingStyle.top) + _DDMgr.currDrag.shiftRelToAbsTop) + "," + (parseInt(oMovingStyle.left) + _DDMgr.currDrag.shiftRelToAbsLeft);
    }
    _DDMgr.currDrag.oHtmlInfoFrame.innerHTML = topLeft + " ( " + _DDMgr.currDrag.totDeltaMoveTop + "," + _DDMgr.currDrag.totDeltaMoveLeft + ")";
    _DDMgr.currDrag.oHtmlInfoFrame.style.top = nvEventTopLeft.top + _DDMgr.currDrag.oHtmlInfoFrame.topShift;
    _DDMgr.currDrag.oHtmlInfoFrame.style.left = nvEventTopLeft.left + _DDMgr.currDrag.oHtmlInfoFrame.leftShift;
};
rialto.widgetBehavior.$$DDMM_applyConstraintsLimits = function (oWithSpecs, newPos, dTop, dLeft) {
    var oHtmlToMove = _DDMgr.currDrag.oHtmlToMove;
    var posMovingOHtml = _DDMgr.currDrag.movingOHtml.style;
    var nvTop = newPos.top;
    var nvLeft = newPos.left;
    if (oWithSpecs.movingLimits.orientation == "v") {
        nvLeft = _DDMgr.currDrag.leftMovingDiv;
    } else {
        if (oWithSpecs.movingLimits.orientation == "h") {
            nvTop = _DDMgr.currDrag.topMovingDiv;
        }
    }
    if ((oWithSpecs.movingLimits.orientation == "v") || (oWithSpecs.movingLimits.orientation == "2D")) {
        if ((parseInt(nvTop) - dTop) < parseInt(oWithSpecs.movingLimits.rectLim.top)) {
            nvTop = oWithSpecs.movingLimits.bCircular ? (oWithSpecs.movingLimits.rectLim.bottom - parseInt(posMovingOHtml.height)) : oWithSpecs.movingLimits.rectLim.top;
            nvTop = parseInt(nvTop) + dTop;
        } else {
            if ((parseInt(nvTop) - dTop + parseInt(oHtmlToMove.offsetHeight)) > parseInt(oWithSpecs.movingLimits.rectLim.bottom)) {
                if (parseInt(oHtmlToMove.offsetHeight) > (oWithSpecs.movingLimits.rectLim.bottom - oWithSpecs.movingLimits.rectLim.top)) {
                    nvTop = Math.max(0, parseInt(nvTop));
                } else {
                    if ((parseInt(posMovingOHtml.top) - (parseInt(nvTop) + dTop)) > 0) {
                        nvTop = parseInt(nvTop) - dTop;
                    } else {
                        nvTop = oWithSpecs.movingLimits.bCircular ? oWithSpecs.movingLimits.rectLim.top : (oWithSpecs.movingLimits.rectLim.bottom - parseInt(oHtmlToMove.offsetHeight));
                    }
                }
                nvTop = parseInt(nvTop) + dTop;
            }
        }
    }
    if ((oWithSpecs.movingLimits.orientation == "h") || (oWithSpecs.movingLimits.orientation == "2D")) {
        if ((parseInt(nvLeft) - dLeft) < parseInt(oWithSpecs.movingLimits.rectLim.left)) {
            nvLeft = oWithSpecs.movingLimits.bCircular ? (parseInt(oWithSpecs.movingLimits.rectLim.right) - parseInt(posMovingOHtml.width)) : parseInt(oWithSpecs.movingLimits.rectLim.left);
            nvLeft = parseInt(nvLeft) + dLeft;
        } else {
            if (((parseInt(nvLeft) - dLeft) + parseInt(oHtmlToMove.offsetWidth)) > parseInt(oWithSpecs.movingLimits.rectLim.right)) {
                if (parseInt(oHtmlToMove.offsetWidth) > (oWithSpecs.movingLimits.rectLim.right - oWithSpecs.movingLimits.rectLim.left)) {
                    nvLeft = Math.max(0, parseInt(nvLeft));
                } else {
                    if ((parseInt(posMovingOHtml.left) - (parseInt(nvLeft) + dLeft)) > 0) {
                        nvLeft = parseInt(nvLeft) - dLeft;
                    } else {
                        nvLeft = oWithSpecs.movingLimits.bCircular ? parseInt(oWithSpecs.movingLimits.rectLim.left) : (parseInt(oWithSpecs.movingLimits.rectLim.right) - parseInt(oHtmlToMove.offsetWidth));
                    }
                }
                nvLeft = parseInt(nvLeft) + dLeft;
            }
        }
    }
    newPos.top = nvTop;
    newPos.left = nvLeft;
};
rialto.widgetBehavior.$$DDMM_applyConstraintTargets = function (oWithSpecs) {
    if (!_DDMgr.flyOverTarget()) {
        _DDMgr.flyOverTarget(unauthorized = true);
    }
};
rialto.widgetBehavior.$$DDMM_CallBackSynchro = function (oWithSpecs) {
    var oMovingStyle = _DDMgr.currDrag.movingOHtml.style;
    var deltaTop = parseInt(oMovingStyle.top) - parseInt(_DDMgr.currDrag.prevTop);
    var deltaLeft = parseInt(oMovingStyle.left) - parseInt(_DDMgr.currDrag.prevLeft);
    _DDMgr.currDrag.prevTop = parseInt(oMovingStyle.top);
    _DDMgr.currDrag.prevLeft = parseInt(oMovingStyle.left);
    oWithSpecs.synchro({top:_DDMgr.currDrag.totDeltaMoveTop, left:_DDMgr.currDrag.totDeltaMoveLeft}, {top:deltaTop, left:deltaLeft}, {});
};
rialto.widgetBehavior.DragAndDropMouseUpHandler = function (e) {
    if (!e) {
        var e = window.event;
    }
    if (_DDMgr.currDrag && _DDMgr.currDrag.movingOHtml) {
        if (this.releaseCapture) {
            if ((!_DDMgr.currDrag.oThis.specs.modCurs.avantDD) && (_DDMgr.currDrag.oThis.specs.modCurs.auClic)) {
                this.style.cursor = "default";
            }
            if (!rialto.widgetBehavior.DragAndDrop_attachEventToDocument) {
                this.releaseCapture();
            }
        } else {
            if (_DDMgr.currDrag.ghost) {
                _DDMgr.currDrag.movingOHtml.style.cursor = "default";
            } else {
                _DDMgr.currDrag.oSource.style.cursor = "default";
            }
        }
        var oHtml = _DDMgr.currDrag.movingOHtml;
        _DDMgr.currDrag.oSource.behavior["DD"].isRunning = false;
        var oThis = _DDMgr.currDrag.oThis;
        if (_DDMgr.currDrag.bMUpAction) {
            if ((!oThis.specs.dropTargets) || (_DDMgr.currDrag.cibleOk)) {
                if (_DDMgr.currDrag.oHtmlToMove != _DDMgr.currDrag.movingOHtml) {
                    if (_DDMgr.currDrag.mvtEffectif) {
                        _DDMgr.currDrag.oHtmlToMove.style.top = _rum.$offsetTop(_DDMgr.currDrag.oHtmlToMove) + _DDMgr.currDrag.totDeltaMoveTop + shiftTopForIcon;
                        _DDMgr.currDrag.oHtmlToMove.style.left = _rum.$offsetLeft(_DDMgr.currDrag.oHtmlToMove) + _DDMgr.currDrag.totDeltaMoveLeft + shiftLeftForIcon;
                    }
                } else {
                    _DDMgr.currDrag.oHtmlToMove.style.zIndex = _DDMgr.currDrag.svgZIndex;
                }
                if (oThis.synchroDDMup) {
                    oThis.synchroDDMup({top:_DDMgr.currDrag.totDeltaMoveTop, left:_DDMgr.currDrag.totDeltaMoveLeft}, {});
                }
            } else {
                if (_DDMgr.currDrag.oHtmlToMove == _DDMgr.currDrag.movingOHtml) {
                    _DDMgr.currDrag.movingOHtml.style.top = _DDMgr.currDrag.initialTop;
                    _DDMgr.currDrag.movingOHtml.style.left = _DDMgr.currDrag.initialLeft;
                }
            }
        }
        if (_DDMgr.currDrag.ghost) {
            _DDMgr.currDrag.movingOHtml.style.display = "none";
        }
        if (_DDMgr.currDrag.oThis.movingLimits.isWithLimitsDisplayed) {
            document.body.removeChild(_DDMgr.currDrag.oHtmlLimitsRect);
        }
        if (_DDMgr.currDrag.oHtmlInfoFrame) {
            document.body.removeChild(_DDMgr.currDrag.oHtmlInfoFrame);
        }
        if (_DDMgr.currDrag.maskSelect) {
            var mask = _DDMgr.currDrag.maskSelect;
            mask.parentNode.removeChild(mask);
        }
        _DDMgr.$$RemoveTargetInfo();
        if (_DDMgr.currDrag.mvtEffectif) {
            if (oThis.afterDD) {
                oThis.afterDD(_DDMgr.currDrag.totDeltaMoveTop, _DDMgr.currDrag.totDeltaMoveLeft, (_DDMgr.currDrag.cibleOk ? {oCible:_DDMgr.currDrag.target, topInCible:_DDMgr.currDrag.topInTarget, leftInCible:_DDMgr.currDrag.leftInTarget} : null));
            }
            _DDMgr.drop();
        } else {
            if (oThis.afterClic) {
                oThis.afterClic(e);
            }
        }
        _DDMgr.currDrag = null;
        stopEvent(e);
    }
};


function DDManager() {
    if (instanceUnique = eval(recupSingletonCD())) {
        return instanceUnique;
    }
    this.tMissiles = new Array;
    this.tTargets = new Array;
    this.tTargets["undef"] = new Object;
    this.lastUnderTarget = null;
    this.missInFlight = {tMiss:new Array, top:null, left:null};
    this.currDrag = null;
    this.id = "ID_InstanceUniqueDDManager";
}
DDManager.prototype.addTarget = function (oTarget, domain, domainInvalidTarget, idRegistTarg) {
    var uriDom = domain || "undef";
    if (uriDom.substr(0, 5) != "undef") {
        uriDom = "undef." + uriDom;
    }
    if (this.tTargets[uriDom] == undefined) {
        this.tTargets[uriDom] = new Object;
    }
    var id = (idRegistTarg == undefined) ? oTarget.id : idRegistTarg;
    this.tTargets[uriDom][id] = oTarget;
};
DDManager.prototype.removeTarget = function (oTarget) {
    var uriDom = oTarget.domain;
    if (uriDom.substr(0, 5) != "undef") {
        uriDom = "undef." + uriDom;
    }
    if (this.tTargets[uriDom][oTarget.id]) {
        this.tTargets[uriDom][oTarget.id] = null;
    }
};
DDManager.prototype.$$AddTargetInfo = function () {
    if (this.tTargets) {
        for (var sUri in this.tTargets) {
            for (var i in this.tTargets[sUri]) {
                oTarg = this.tTargets[sUri][i];
                if (oTarg) {
                    targHtml = oTarg.oHtml;
                    borderExclude = !oTarg.specsTarg.borderIsTarget;
                    var targetPosInVP = borderExclude ? _rum.$divInternalTopLeftInViewPort(targHtml) : _rum.$posInViewPort(targHtml);
                    oTarg.topInVP = targetPosInVP.top;
                    oTarg.LeftInVP = targetPosInVP.left;
                    oTarg.widthTarget = _rum.$getWidth(targHtml, bBorderLess = borderExclude);
                    oTarg.heightTarget = _rum.$getHeight(targHtml, bBorderLess = borderExclude);
                }
            }
        }
    }
};
DDManager.prototype.$$RemoveTargetInfo = function () {
    if (this.tTargets) {
        for (var sUri in this.tTargets) {
            for (var i in this.tTargets[sUri]) {
                oTarg = this.tTargets[sUri][i];
                if (oTarg) {
                    oTarg.topInVP = null;
                    oTarg.LeftInVP = null;
                    oTarg.widthTarget = null;
                    oTarg.heightTarget = null;
                }
            }
        }
    }
};
DDManager.prototype.initDrag = function (oDrag) {
    this.currDrag = oDrag;
    var specsODrag = oDrag.oThis.specs;
    this.sUri = "undef";
    if (specsODrag.domain) {
        this.sUri = this.sUri + "." + oDrag.oThis.specs.domain;
    }
    this.tUri = this.sUri.split(".");
    this.sNaUri = "undef";
    if (specsODrag.domainUnauthorizedTarget) {
        this.sNaUri = this.sNaUri + "." + oDrag.oThis.specs.domainUnauthorizedTarget;
    }
    this.tNaUri = this.sNaUri.split(".");
    this.lastGoodTargets = null;
    this.lastGoodTargets = new Array;
};
DDManager.prototype.flyOverTarget = function (isTargetsUnAuthorized) {
    var goodTarg = null;
    var oDrag = this.currDrag;
    var specsODrag = oDrag.oThis.specs;
    var sUri = ((isTargetsUnAuthorized == undefined) || (!isTargetsUnAuthorized)) ? this.sUri : this.sNaUri;
    var tUri = ((isTargetsUnAuthorized == undefined) || (!isTargetsUnAuthorized)) ? this.tUri : this.tNaUri;
    traceExec("isTargetsUnAuthorized = " + isTargetsUnAuthorized + " tUri= " + tUri + "length= " + tUri.length, 9);
    for (var n = tUri.length; n > 0; n--) {
        var targHtml, missHtml;
        if (this.tTargets[sUri]) {
            missHtml = oDrag.movingOHtml;
            var topMissile = _rum.$posInViewPort(missHtml).top;
            var leftMissile = _rum.$posInViewPort(missHtml).left;
            var oTargMiss, oTarg, targHtml, topTarget, leftTarget, widthTarget, heightTarget;
            var widthMissile, heightMissile;
            var j = 0;
            for (var i in this.tTargets[sUri]) {
                j++;
                if (this.tTargets[sUri][i] && this.tTargets[sUri][i].oHtml.style.display != "none") {
                    oTarg = this.tTargets[sUri][i];
                    targHtml = oTarg.oHtml;
                    if (specsODrag.circularDropAuthorized || !rialto.Dom.isDescendantOf(targHtml, oDrag.oHtmlToMove, true)) {
                        if (oTarg.specsTarg.missileAsOnePixel) {
                            widthMissile = 1;
                            heightMissile = 1;
                        } else {
                            widthMissile = oDrag.oHtmlToMove.offsetWidth;
                            heightMissile = oDrag.oHtmlToMove.offsetHeight;
                        }
                        borderExclude = !oTarg.specsTarg.borderIsTarget;
                        if (oTarg.topInVP == "undefined" || oTarg.topInVP == null) {
                            var targetPosInVP = borderExclude ? _rum.$divInternalTopLeftInViewPort(targHtml) : _rum.$posInViewPort(targHtml);
                            oTarg.topInVP = targetPosInVP.top;
                            oTarg.LeftInVP = targetPosInVP.left;
                            oTarg.widthTarget = _rum.$getWidth(targHtml, bBorderLess = borderExclude);
                            oTarg.heightTarget = _rum.$getHeight(targHtml, bBorderLess = borderExclude);
                        }
                        topTarget = oTarg.topInVP;
                        leftTarget = oTarg.LeftInVP;
                        widthTarget = oTarg.widthTarget;
                        heightTarget = oTarg.heightTarget;
                        if ((leftMissile >= leftTarget) && (topMissile >= topTarget) && ((leftMissile + widthMissile) <= (leftTarget + widthTarget)) && ((topMissile + heightMissile) <= (topTarget + heightTarget))) {
                            this.lastGoodTargets.push(goodTarg);
                            if (goodTarg) {
                                if (DDManager.isTargetHover(oTarg, goodTarg)) {
                                    goodTarg = oTarg;
                                    var shiftTop = borderExclude ? 0 : _rum.$$getBorderTopWidth(targHtml);
                                    var shiftLeft = borderExclude ? 0 : _rum.$$getBorderLeftWidth(targHtml);
                                    goodTarg.topInTarget = topMissile - topTarget - shiftTop;
                                    goodTarg.leftInTarget = leftMissile - leftTarget - shiftLeft;
                                } else {
                                }
                            } else {
                                goodTarg = oTarg;
                                var shiftTop = borderExclude ? 0 : _rum.$$getBorderTopWidth(targHtml);
                                var shiftLeft = borderExclude ? 0 : _rum.$$getBorderLeftWidth(targHtml);
                                goodTarg.topInTarget = topMissile - topTarget - shiftTop;
                                goodTarg.leftInTarget = leftMissile - leftTarget - shiftLeft;
                            }
                            if (specsODrag.targetChoice == "firstIsBetter") {
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (goodTarg) {
            break;
        }
        sUri = tUri.slice(0, n - 1).join(".");
    }
    if (this.lastUnderTarget && this.lastUnderTarget.DDOuter) {
        if (!goodTarg || (goodTarg != this.lastUnderTarget)) {
            this.lastUnderTarget.DDOuter({oHtml:this.currDrag.oHtmlToMove, topAbs:topMissile, leftAbs:leftMissile});
        }
    }
    if (goodTarg && goodTarg.DDHover && (goodTarg != this.lastUnderTarget)) {
        goodTarg.DDHover({oHtml:this.currDrag.oHtmlToMove, top:goodTarg.topInTarget, left:goodTarg.leftInTarget}, isTargetsUnAuthorized);
    }
    this.lastUnderTarget = goodTarg;
    this.currDrag.cibleOk = (goodTarg != null) && (!isTargetsUnAuthorized);
    return goodTarg;
};
DDManager.prototype.flyOverOneTarget = function (oTarg, isTargetsUnAuthorized) {
    var goodTarg = null;
    var oDrag = _DDMgr.currDrag;
    var specsODrag = oDrag.oThis.specs;
    var sUri = "undef";
    if (((typeof isTargetsUnAuthorized) == "undefined") || (!isTargetsUnAuthorized)) {
        if (oDrag.oThis.specs.domain) {
            sUri = sUri + "." + oDrag.oThis.specs.domain;
        }
    } else {
        if (oDrag.oThis.specs.domainUnauthorizedTarget) {
            sUri = sUri + "." + oDrag.oThis.specs.domainUnauthorizedTarget;
        }
    }
    var uriDom = oTarg.domain || "undef";
    if (uriDom.substr(0, 5) != "undef") {
        uriDom = "undef." + uriDom;
    }
    var isPrefix = (sUri.indexOf(uriDom) == 0);
    if (isPrefix) {
        borderExclude = !oTarg.specsTarg.borderIsTarget;
        var targHtml, missHtml;
        targHtml = oTarg.oHtml;
        var targetPosInVP = borderExclude ? _rum.$divInternalTopLeftInViewPort(targHtml) : _rum.$posInViewPort(targHtml);
        topTarget = targetPosInVP.top;
        leftTarget = targetPosInVP.left;
        missHtml = oDrag.movingOHtml;
        var topMissile = _rum.$posInViewPort(missHtml).top;
        var leftMissile = _rum.$posInViewPort(missHtml).left;
        goodTarg = oTarg;
        var shiftTop = borderExclude ? 0 : _rum.$$getBorderTopWidth(targHtml);
        var shiftLeft = borderExclude ? 0 : _rum.$$getBorderLeftWidth(targHtml);
        goodTarg.topInTarget = topMissile - topTarget - shiftTop;
        goodTarg.leftInTarget = leftMissile - leftTarget - shiftLeft;
    }
    if (this.lastUnderTarget && this.lastUnderTarget.DDOuter) {
        if (!goodTarg || (goodTarg != this.lastUnderTarget)) {
            this.lastUnderTarget.DDOuter({oHtml:_DDMgr.currDrag.oHtmlToMove, topAbs:topMissile, leftAbs:leftMissile});
        }
    }
    this.lastUnderTarget = goodTarg;
    if (goodTarg && goodTarg.DDHover) {
        goodTarg.DDHover({oHtml:_DDMgr.currDrag.oHtmlToMove, top:goodTarg.topInTarget, left:goodTarg.leftInTarget}, isTargetsUnAuthorized);
    }
    _DDMgr.currDrag.cibleOk = (goodTarg != null) && (!isTargetsUnAuthorized);
    return goodTarg;
};
DDManager.isTargetHover = function (n1, n2) {
    if (rialto.Dom.isDescendantOf(n1, n2)) {
        return true;
    } else {
        return rialto.Dom.isCoveredBy(n2, n1);
    }
};
DDManager.prototype.drop = function () {
    if (this.lastUnderTarget) {
        if (this.lastUnderTarget.DDOuter) {
            this.lastUnderTarget.DDOuter({oHtml:_DDMgr.currDrag.oHtmlToMove, topAbs:_DDMgr.currDrag.topObjEnDeplact, leftAbs:_DDMgr.currDrag.leftObjEnDeplact});
        }
        if (_DDMgr.currDrag.cibleOk) {
            if (this.lastUnderTarget.receiveAfterDrop) {
                this.lastUnderTarget.receiveAfterDrop({oHtml:_DDMgr.currDrag.oHtmlToMove, top:_DDMgr.lastUnderTarget.topInTarget, left:_DDMgr.lastUnderTarget.leftInTarget, pathMissile:_DDMgr.currDrag.oThis.specs.domain});
            } else {
                _DDMgr.currDrag.oHtmlToMove.style.position = "absolute";
                _DDMgr.currDrag.oHtmlToMove.style.top = _DDMgr.lastUnderTarget.topInTarget;
                _DDMgr.currDrag.oHtmlToMove.style.left = _DDMgr.lastUnderTarget.leftInTarget;
                this.lastUnderTarget.appendChild(_DDMgr.currDrag.oHtmlToMove);
            }
        }
        this.lastUnderTarget = null;
    }
};
_DDMgr = new DDManager();


var ENREG_RS = 99;
var oReSize = null;
var defMargeSensibleDD = 3;
rialto.widgetBehavior.RS_SENSITIVEEDGEWIDTH_DEFAULT = 3;
rialto.widgetBehavior.RSLoadLimitsDyn = function (oBase) {
    if (this.limitReDim.bRectLim) {
        this.limitReDim.rectLim.bottom = eval(this.limitReDim.rectLim.bottomSpecs);
        this.limitReDim.rectLim.right = eval(this.limitReDim.rectLim.rightSpecs);
    } else {
        this.limitReDim.rectLim.bottom = pixHeight(oBase);
        this.limitReDim.rectLim.right = pixWidth(oBase);
    }
    if (this.limitReDim.bLimMax) {
        this.limitReDim.widthMax = eval(this.limitReDim.widthMaxSpecs);
        this.limitReDim.heightMax = eval(this.limitReDim.heightMaxSpecs);
    } else {
        this.limitReDim.widthMax = (this.limitReDim.rectLim.right - this.limitReDim.rectLim.left + 1);
        this.limitReDim.heightMax = (this.limitReDim.rectLim.bottom - this.limitReDim.rectLim.top + 1);
    }
    traceExec("RSLoadLimitsDyn id= " + this.id + " this.limitReDim.rectLim.top = " + this.limitReDim.rectLim.top, 60);
    traceExec("RSLoadLimitsDyn this.limitReDim.rectLim.left = " + this.limitReDim.rectLim.left, 58);
    traceExec("RSLoadLimitsDyn this.limitReDim.rectLim.bottom = " + this.limitReDim.rectLim.bottom, 60);
    traceExec("RSLoadLimitsDyn this.limitReDim.rectLim.right = " + this.limitReDim.rectLim.right, 58);
    traceExec("RSLoadLimitsDyn this.limitReDim.rectLim.widthMax = " + this.limitReDim.widthMax, 58);
    traceExec("RSLoadLimitsDyn this.limitReDim.rectLim.heightMax = " + this.limitReDim.heightMax, 60);
};
rialto.widgetBehavior.RSLoadSpecs = function (specs) {
    traceExec("RSLoadSpecs entree", 76);
    this.specsRS = new Object;
    if (!specs) {
        specs = new Object;
    }
    var orientation = specs.orientation || "2D";
    if (!specs.cibleEvt) {
        this.specsRS.cibleEvt = new Array;
        this.specsRS.cibleEvt[0] = {oHtml:this, mode:"mono"};
        this.specsRS.cibleEvt[0].dir = orientation;
        this.specsRS.orientation = orientation;
    } else {
        if (!(specs.cibleEvt instanceof Array)) {
            var wCibleEvt = specs.cibleEvt;
            this.specsRS.cibleEvt = new Array;
            this.specsRS.cibleEvt[0] = new Object;
            this.specsRS.cibleEvt[0].oHtml = wCibleEvt.oHtml;
            this.specsRS.cibleEvt[0].mode = wCibleEvt.mode || "mono";
            this.specsRS.cibleEvt[0].dir = (this.specsRS.cibleEvt[0].mode == "mono") ? orientation : wCibleEvt.dir;
            this.specsRS.orientation = this.specsRS.cibleEvt[0].dir;
        } else {
            if (specs.cibleEvt instanceof Array) {
                this.specsRS.cibleEvt = specs.cibleEvt;
            } else {
                traceExec("pb def cible DD", 30);
            }
        }
    }
    this.specsRS.sensitiveEdgeWidth = specs.sensitiveEdgeWidth || rialto.widgetBehavior.RS_SENSITIVEEDGEWIDTH_DEFAULT;
    this.specsRS.objetADeformer = specs.objetADeformer ? specs.objetADeformer : this;
    this.specsRS.fantome = new Object;
    if (specs.fantome) {
        this.specsRS.fantome.aspect = specs.fantome.aspect || "cadre";
    } else {
        this.specsRS.fantome = null;
    }
    this.specsRS.modCurs = new Object;
    if (specs.modCursor) {
        this.specsRS.modCurs.avantDD = (specs.modCursor.avantDD != "undefined") ? specs.modCursor.avantDD : true;
        this.specsRS.modCurs.auClic = (specs.modCursor.auClic != "undefined") ? specs.modCursor.auClic : true;
    } else {
        this.specsRS.modCurs.avantDD = true;
        this.specsRS.modCurs.auClic = true;
    }
    if (specs.grilleMagnetic) {
        this.specsRS.magnet = new Object;
        this.specsRS.magnet.widthCol = specs.grilleMagnetic.widthCol || 10;
        this.specsRS.magnet.heightRow = specs.grilleMagnetic.heightRow || 10;
    }
    this.limitReDim = new Object;
    this.limitReDim.symetrie = specs.symetrie || false;
    if (this.limitReDim.symetrie) {
        this.limitReDim.centrage = true;
    }
    this.limitReDim.bRectLim = (specs.bRectLim != null) ? specs.bRectLim : true;
    this.limitReDim.bLimMax = (specs.bRectLim != null) ? specs.bLimMax : false;
    this.limitReDim.rectLim = new Object;
    var flagModSpecsRectLim = false;
    if (!specs.rectLim) {
        specs.rectLim = new Object;
        flagModSpecsRectLim = true;
    } else {
        this.limitReDim.bRectLim = true;
    }
    this.limitReDim.rectLim.left = specs.rectLim.left || 0;
    this.limitReDim.rectLim.top = specs.rectLim.top;
    this.specsRS.majDyn = (specs.majDyn != null) ? specs.majDyn : true;
    if (!this.specsRS.majDyn) {
        this.limitReDim.rectLim.right = specs.rectLim.right || pixWidth(this.specsRS.objetADeformer.parentNode);
        this.limitReDim.rectLim.bottom = specs.rectLim.bottom || pixHeight(this.specsRS.objetADeformer.parentNode);
    } else {
        this.limitReDim.rectLim.rightSpecs = specs.rectLim.right || pixWidth(this.specsRS.objetADeformer.parentNode);
        this.limitReDim.rectLim.bottomSpecs = specs.rectLim.bottom || pixHeight(this.specsRS.objetADeformer.parentNode);
        this.limitReDim.widthMaxSpecs = specs.rectLim.widthMax;
        this.limitReDim.heightMaxSpecs = specs.rectLim.heightMax;
    }
    if (!specs.limitReDim) {
        specs.limitReDim = new Object;
    }
    this.limitReDim.heightMin = specs.limitReDim.heightMin || 20;
    this.limitReDim.heightMax = specs.limitReDim.heightMax || (this.limitReDim.bottom - this.limitReDim.top + 1);
    traceExec("** RSLoadSpecs specs.limitReDim.widthMin    = " + specs.limitReDim.widthMin, 76);
    this.limitReDim.widthMin = specs.limitReDim.widthMin || 20;
    traceExec("** RSLoadSpecs this.limitReDim.rectLim.widthMin    = " + this.limitReDim.widthMin, 76);
    this.limitReDim.widthMax = specs.limitReDim.widthMax || (this.limitReDim.right - this.limitReDim.left + 1);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.top    = " + this.limitReDim.rectLim.top, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.left   = " + this.limitReDim.rectLim.left, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.bottom = " + this.limitReDim.rectLim.bottom, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.right  = " + this.limitReDim.rectLim.right, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.bottomSpecs = " + this.limitReDim.rectLim.bottomSpecs, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.rightSpecs  = " + this.limitReDim.rectLim.rightSpecs, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.heightMin   = " + this.limitReDim.heightMin, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.heightMax   = " + this.limitReDim.heightMax, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.widthMin    = " + this.limitReDim.widthMin, 76);
    traceExec("RSLoadSpecs this.limitReDim.rectLim.widthMax    = " + this.limitReDim.widthMax, 76);
    traceExec("RSLoadSpecs fin", 58);
    if (flagModSpecsRectLim) {
        specs.rectLim = null;
    }
};
rialto.widgetBehavior.constructorReSize = function (specs) {
    if (!this.oCiu) {
        this.oCiu = new Array();
    }
    this.oCiu["ReSize"] = this;
    this.oCiu["ReSize"].lockReSize = false;
    if (!this.oCiu["ReSize"].loadSpecsRS) {
        this.oCiu["ReSize"].loadSpecsRS = rialto.widgetBehavior.RSLoadSpecs;
    }
    this.oCiu["ReSize"].loadSpecsRS(specs);
    if (this.oCiu["ReSize"].specsRS.majDyn) {
        if (!this.oCiu["ReSize"].loadLimitsDynRS) {
            this.oCiu["ReSize"].loadLimitsDynRS = rialto.widgetBehavior.RSLoadLimitsDyn;
        }
        this.oCiu["ReSize"].loadLimitsDynRS(this.oCiu["ReSize"].specsRS.objetADeformer.parentNode);
    }
    var oCiu = this.oCiu["ReSize"];
    var oHtmlCible;
    for (var i = 0; i < oCiu.specsRS.cibleEvt.length; i++) {
        oHtmlCible = oCiu.specsRS.cibleEvt[i].oHtml;
        oHtmlCible.reSize = true;
        oHtmlCible.refObjSpecsRS = this;
        oHtmlCible.modeRS = oCiu.specsRS.cibleEvt[i].mode;
        oHtmlCible.dirRS = oCiu.specsRS.cibleEvt[i].dir;
        if (!oHtmlCible.behavior) {
            oHtmlCible.behavior = {};
        }
        if (!oHtmlCible.behavior["RS"]) {
            oHtmlCible.behavior["RS"] = {};
        }
        oHtmlCible.behavior["RS"].running = false;
    }
    if (typeof document.addEventListener == "undefined") {
        for (var i = 0; i < oCiu.specsRS.cibleEvt.length; i++) {
            oHtmlCible = oCiu.specsRS.cibleEvt[i].oHtml;
            oHtmlCible.addHandler = addHandler;
            oHtmlCible.methodRSMouseDown = rialto.widgetBehavior.ReSizeMouseDownHandler;
            oHtmlCible.methodRSMouseMove = rialto.widgetBehavior.ReSizeMouseMoveHandler;
            oHtmlCible.methodRSMouseUp = rialto.widgetBehavior.ReSizeMouseUpHandler;
            oHtmlCible.addHandler(oHtmlCible, "onmousedown", "methodRSMouseDown");
            oHtmlCible.addHandler(oHtmlCible, "onmousemove", "methodRSMouseMove");
            oHtmlCible.addHandler(oHtmlCible, "onmouseup", "methodRSMouseUp");
        }
    } else {
        if (!document.enregtReSize) {
            document.enregtReSize = true;
            document.addEventListener("mousemove", rialto.widgetBehavior.ReSizeMouseMoveHandler, false);
            document.addEventListener("mouseup", rialto.widgetBehavior.ReSizeMouseUpHandler, false);
            document.addEventListener("mousedown", rialto.widgetBehavior.ReSizeMouseDownHandler, false);
            document.addEventListener("mousedown", StopSelectDef, false);
        }
    }
};
rialto.widgetBehavior.createBehavior("ReSize", rialto.widgetBehavior.constructorReSize);
StopSelectDef = function (e) {
    stopDefault(e);
};


rialto.widgetBehavior.ReSizeMouseDownHandler = function (e) {
    if (!e) {
        var e = window.event;
    }
    var oSourceEvt = e.target ? e.target : e.srcElement;
    var oHtml = oSourceEvt;
    if (!oHtml.reSize) {
        return;
    }
    var direction;
    if (oHtml.modeRS != "mono") {
        direction = oHtml.dirRS;
    } else {
        direction = DirDeplact(oHtml, e, pixHeight(oHtml), pixWidth(oHtml), oHtml.refObjSpecsRS.specsRS.sensitiveEdgeWidth, marginLess = false);
    }
    if (!direction) {
        traceExec("position invalide par rapport au RS", 58);
        oHtml.style.cursor = "default";
        return;
    } else {
        oHtml.style.cursor = direction + "-resize";
    }
    if ((oHtml.behavior["DD"]) && (oHtml.behavior["DD"].isRunning)) {
        return;
    } else {
        oHtml.behavior["RS"].isRunning = true;
    }
    traceExec("position valide par rapport au RS", 58);
    var oSpecs = oHtml.refObjSpecsRS;
    if (oSpecs.specsRS.majDyn) {
        oSpecs.loadLimitsDynRS(oSpecs.specsRS.objetADeformer.parentNode);
    }
    var objetADeformer = oSpecs.specsRS.objetADeformer;
    traceExec(";;;Md objetADeformer.style.height= " + parseInt(objetADeformer.style.height), 60);
    if (oSpecs.specsRS.fantome) {
        var cadreFantome = document.getElementById("cadreFantomeUnique");
        if (cadreFantome == null) {
            cadreFantome = document.createElement("DIV");
            cadreFantome.id = "cadreFantomeUnique";
            cadreFantome.className = "fantomeRS_" + oSpecs.specsRS.fantome.aspect;
            objetADeformer.parentNode.appendChild(cadreFantome);
        } else {
            if (cadreFantome.parentNode != objetADeformer) {
                cadreFantome.parentNode.removeChild(cadreFantome);
                cadreFantome = document.createElement("DIV");
                cadreFantome.id = "cadreFantomeUnique";
                cadreFantome.className = "fantomeRS_" + oSpecs.specsRS.fantome.aspect;
                objetADeformer.parentNode.appendChild(cadreFantome);
            }
        }
        cadreFantome.style.zIndex = 100000;
        cadreFantome.style.top = pixTop(objetADeformer);
        cadreFantome.style.left = pixLeft(objetADeformer);
        cadreFantome.style.width = pixWidth(objetADeformer);
        var bWidth = 0;
        if (window.getComputedStyle) {
            var topWidthBord = getComputStyle(cadreFantome, "borderTopWidth", "0");
            var bottomWidthBord = getComputStyle(cadreFantome, "borderBottomWidth", "0");
            if (topWidthBord || bottomWidthBord) {
                bWidth = topWidthBord + bottomWidthBord;
                cadreFantome.style.width = parseInt(cadreFantome.style.width) - bWidth;
            }
        }
        traceExec("!!! objetADeformer.id= " + objetADeformer.id, 60);
        cadreFantome.style.height = pixHeight(objetADeformer);
        traceExec("RS -1- Md cadreFantome.style.height = pixHeight(objetADeformer)= " + pixHeight(objetADeformer), 75);
        traceExec("!!! Md cadreFantome.style.height= " + cadreFantome.style.height, 60);
        var bHeight = 0;
        if (window.getComputedStyle) {
            bHeight = topWidthBord + bottomWidthBord;
            cadreFantome.style.height = parseInt(cadreFantome.style.height) - bHeight;
        }
        cadreFantome.style.visibility = "visible";
        var objetEnDeformation = cadreFantome;
        objetEnDeformation.refObjSpecs = oSpecs;
    } else {
        var objetEnDeformation = objetADeformer;
    }
    var top = pixTop(objetEnDeformation);
    var left = pixLeft(objetEnDeformation);
    var width = pixWidth(objetEnDeformation);
    var height = pixHeight(objetEnDeformation);
    traceExec("++++Md  height obj en def= " + height, 58);
    var topLeftEvtInVP = _rum.$eventTopLeftInViewPort(e);
    var topEvtInVP = topLeftEvtInVP.top;
    var leftEvtInVP = topLeftEvtInVP.left;
    oReSize = {oThis:oSpecs, oSource:oHtml, fantome:oSpecs.specsRS.fantome, objetEnDeformation:objetEnDeformation, objetADeformer:objetADeformer, limitReDim:oSpecs.limitReDim, direction:direction, clientXI:e.clientX, clientYI:e.clientY, topI:top, leftI:left, widthI:width, wBordGD:bWidth, wBordHB:bHeight, heightI:height, magnet:oSpecs.specsRS.magnet, mvtEffectif:false, topEvtInVP:topEvtInVP, leftEvtInVP:leftEvtInVP};
    oReSize.prevTop = parseInt(oReSize.objetEnDeformation.style.top);
    oReSize.prevLeft = parseInt(oReSize.objetEnDeformation.style.left);
    oReSize.prevWidth = parseInt(oReSize.objetEnDeformation.style.width);
    oReSize.prevHeight = parseInt(oReSize.objetEnDeformation.style.height);
    traceExec("RS -0- objetEnDeformation.style.height= " + objetEnDeformation.style.height, 75);
    traceExec("RS -0- heightI = pixHeight(objetEnDeformation)= " + oReSize.heightI, 75);
    traceExec("RS -0- objetADeformer.style.height= " + objetADeformer.style.height, 75);
    traceExec("Md oReSize.objetEnDeformation.style.height= " + parseInt(oReSize.objetEnDeformation.style.height), 62);
    traceExec("Md oReSize.objetADeformer.style.height=     " + pixHeight(oReSize.objetADeformer), 62);
    if (this.setCapture) {
        this.setCapture();
        stopEvent(e);
        if ((!oSpecs.specsRS.modCurs.avantDD) && (oSpecs.specsRS.modCurs.auClic)) {
            rialto.widgetBehavior.DDmodCursor(oHtml, direction, oSpecs.limitDeplact.orientation);
        }
    } else {
        if ((!oSpecs.specsRS.modCurs.avantDD) && (oSpecs.specsRS.modCurs.auClic)) {
            if (oSpecs.specsRS.fantome) {
                rialto.widgetBehavior.DDmodCursor(objetEnDeplact, direction, oSpecs.limitDeplact.orientation);
            } else {
                rialto.widgetBehavior.DDmodCursor(oHtml, direction, oSpecs.limitDeplact.orientation);
            }
        }
    }
};
rialto.widgetBehavior.ReSizeMouseMoveHandler = function (e) {
    if (!e) {
        var e = window.event;
    }
    var oHtml = e.target ? e.target : e.srcElement;
    if (!oReSize) {
        if (oHtml.reSize) {
            var direction;
            if (oHtml.modeRS != "mono") {
                direction = oHtml.dirRS;
            } else {
                traceExec("MM oHtml.margeSensible= " + oHtml.margeSensible + " defMargeSensibleDD= " + defMargeSensibleDD + " oHtml.refObjSpecsRS.sensitiveEdgeWidth= " + oHtml.refObjSpecsRS.specsRS.sensitiveEdgeWidth, 74);
                traceExec("RS MM b", 74);
                direction = DirDeplact(oHtml, e, pixHeight(oHtml), pixWidth(oHtml), oHtml.refObjSpecsRS.specsRS.sensitiveEdgeWidth, marginExcluded = false);
                traceExec("RS MM e", 74);
            }
            if (direction == "") {
                traceExec("RS mm ap DirDeplact dir=" + direction + " curs def restor?", 74);
            } else {
                oHtml.style.cursor = direction + "-resize";
                traceExec("RS mm ap DirDeplact dir=" + direction + " curs ad hoc", 74);
            }
        }
    } else {
        if (e.clientX >= 0 && e.clientY >= 0) {
            oReSize.mvtEffectif = true;
            var nvTop = parseInt(oReSize.objetEnDeformation.style.top);
            var nvLeft = parseInt(oReSize.objetEnDeformation.style.left);
            var nvWidth = parseInt(oReSize.objetEnDeformation.style.width);
            var nvHeight = pixHeight(oReSize.objetEnDeformation);
            traceExec("Mm (oReSize.objetEnDeformation.id= " + oReSize.objetEnDeformation.id, 60);
            traceExec("Mm dim ss mvt height= " + nvHeight, 60);
            var nvEventTopLeft = _rum.$eventTopLeftInViewPort(e);
            var totDeltaMoveY = nvEventTopLeft.top - oReSize.topEvtInVP;
            var totDeltaMoveX = nvEventTopLeft.left - oReSize.leftEvtInVP;
            var direction = oReSize.direction;
            if (oReSize.limitReDim.dbleSymetrie) {
            } else {
                if (!oReSize.limitReDim.symetrie) {
                    if (direction.indexOf("e") != -1) {
                        nvWidth = oReSize.widthI + totDeltaMoveX;
                    } else {
                        if (direction.indexOf("w") != -1) {
                            nvLeft = oReSize.leftI + totDeltaMoveX;
                            nvWidth = oReSize.widthI - totDeltaMoveX;
                        }
                    }
                    if (direction.indexOf("s") != -1) {
                        nvHeight = oReSize.heightI + totDeltaMoveY;
                    } else {
                        if (direction.indexOf("n") != -1) {
                            nvTop = oReSize.topI + totDeltaMoveY;
                            nvHeight = oReSize.heightI - totDeltaMoveY;
                        }
                    }
                } else {
                    var diff;
                    if (direction.indexOf("n") != -1) {
                        nvTop = oReSize.topI + totDeltaMoveY;
                        nvHeight = oReSize.heightI - 2 * totDeltaMoveY;
                        if (oReSize.limitReDim.symetrie == "radiale") {
                            diff = (e.clientY - oReSize.clientYI);
                            nvLeft = oReSize.leftI + diff;
                            nvWidth = oReSize.widthI - 2 * diff;
                        }
                    } else {
                        if (direction.indexOf("s") != -1) {
                            nvTop = oReSize.topI - totDeltaMoveY;
                            nvHeight = oReSize.heightI + 2 * totDeltaMoveY;
                            if (oReSize.limitReDim.symetrie == "radiale") {
                                diff = totDeltaMoveY;
                                nvLeft = oReSize.leftI - diff;
                                nvWidth = oReSize.widthI + 2 * diff;
                            }
                        }
                    }
                    if (direction.indexOf("w") != -1) {
                        nvLeft = oReSize.leftI + totDeltaMoveX;
                        nvWidth = oReSize.widthI - 2 * totDeltaMoveX;
                        if (oReSize.limitReDim.symetrie == "radiale") {
                            diff = totDeltaMoveX;
                            nvTop = oReSize.topI + diff;
                            nvHeight = oReSize.heightI - 2 * diff;
                        }
                    } else {
                        if (direction.indexOf("e") != -1) {
                            nvLeft = oReSize.leftI - totDeltaMoveX;
                            nvWidth = oReSize.widthI + 2 * totDeltaMoveX;
                            if (oReSize.limitReDim.symetrie == "radiale") {
                                diff = totDeltaMoveX;
                                nvTop = oReSize.topI - diff;
                                nvHeight = oReSize.heightI + 2 * diff;
                            }
                        }
                    }
                }
            }
            traceExec("Mm av contraintes nvHeight = " + nvHeight + " nvWidth= " + nvWidth + " nvLeft= " + nvLeft, 58);
            if (oReSize.limitReDim.bRectLim) {
                var rectLim = oReSize.limitReDim.rectLim;
                var lim = oReSize.limitReDim;
                traceExec("Mm rectLim left = " + rectLim.left + " right= " + rectLim.right + " lim.widthMax= " + lim.widthMax + " lim.widthMin= " + lim.widthMin, 58);
                if (!lim.symetrie) {
                    if (nvWidth > lim.widthMax) {
                        nvWidth = lim.widthMax;
                        if (direction == "w") {
                            nvLeft = (oReSize.leftI + oReSize.widthI - 1) - lim.widthMax + 1;
                        }
                        traceExec("contrainte 1");
                    }
                    if ((rectLim.left != undefined) && (nvLeft < rectLim.left)) {
                        nvWidth = nvWidth - (rectLim.left - nvLeft);
                        nvLeft = rectLim.left;
                        traceExec("contrainte 2");
                    } else {
                        if ((rectLim.right != undefined) && ((nvWidth + nvLeft - 1) > rectLim.right)) {
                            nvWidth = rectLim.right - oReSize.leftI + 1;
                            traceExec("contrainte 3");
                        } else {
                            if (nvWidth < lim.widthMin) {
                                nvWidth = lim.widthMin;
                                traceExec("contrainte 4 nvWidth = " + nvWidth + " lim.widthMin= " + lim.widthMin, 58);
                                if (direction.indexOf("w") != -1) {
                                    nvLeft = (oReSize.leftI + oReSize.widthI - 1) - lim.widthMin + 1;
                                }
                            }
                        }
                    }
                    if (nvHeight > lim.heightMax) {
                        traceExec("Mm (nvHeight > lim.heightMax) nvHeight= " + nvHeight + " lim.heightMax= " + lim.heightMax, 60);
                        nvHeight = lim.heightMax;
                        if (direction.indexOf("n") != -1) {
                            nvTop = (oReSize.topI + oReSize.heightI - 1) - lim.heightMax + 1;
                        }
                        traceExec("contrainte 5");
                    }
                    if ((rectLim.top != undefined) && (nvTop < rectLim.top)) {
                        traceExec("Mm (nvTop < rectLim.top) nvHeight= " + nvHeight + " rectLim.top= " + rectLim.top + " nvTop= " + nvTop, 60);
                        nvHeight = nvHeight - (rectLim.top - nvTop);
                        nvTop = rectLim.top;
                        traceExec("contrainte 6");
                    } else {
                        if ((rectLim.bottom != undefined) && ((nvHeight + nvTop - 1) > rectLim.bottom)) {
                            traceExec("Mm (nvHeight + nvTop - 1) > rectLim.bottom) nvHeight= " + nvHeight + " rectLim.bottom= " + rectLim.bottom + " TopI= " + oReSize.topI, 60);
                            nvHeight = rectLim.bottom - oReSize.topI + 1;
                            traceExec("contrainte 7");
                        } else {
                            if (nvHeight < lim.heightMin) {
                                traceExec("Mm (nvHeight < lim.heightMin) nvHeight= " + nvHeight + " lim.heightMin= " + lim.heightMin, 60);
                                nvHeight = lim.heightMin;
                                if (direction.indexOf("n") != -1) {
                                    nvTop = (oReSize.topI + oReSize.heightI - 1) - lim.heightMin + 1;
                                }
                                traceExec("contrainte 8");
                            }
                        }
                    }
                } else {
                    if (nvWidth > lim.widthMax) {
                        nvWidth = lim.widthMax;
                        nvLeft = oReSize.leftI - ((lim.widthMax - oReSize.widthI) / 2) + 1;
                    }
                    if ((rectLim.left != undefined) && (nvLeft < rectLim.left)) {
                        nvWidth = nvWidth - 2 * (rectLim.left - nvLeft);
                        nvLeft = rectLim.left;
                    }
                    if ((rectLim.right != undefined) && ((nvWidth + nvLeft - 1) > rectLim.right)) {
                        var tropW = (nvWidth + nvLeft - 1) - rectLim.right;
                        nvWidth = nvWidth - 2 * tropW;
                        nvLeft = nvLeft + tropW - 1;
                    }
                    if (nvWidth < lim.widthMin) {
                        var manqueW = lim.widthMin - nvWidth;
                        nvWidth = nvWidth + manqueW;
                        nvLeft = nvLeft - 0.5 * manqueW;
                    }
                    if (nvHeight > lim.heightMax) {
                        nvHeight = lim.heightMax;
                        nvTop = oReSize.topI - ((lim.heightMax - oReSize.heightI) / 2) + 1;
                        traceExec("Mm sym contrainte 1");
                    }
                    if ((rectLim.top != undefined) && (nvTop < rectLim.top)) {
                        traceExec("Mm sym ctr 2 nvHeight= " + nvHeight + " rectLim.top= " + rectLim.top + "  nvTop= " + nvTop, 60);
                        nvHeight = nvHeight - 2 * (rectLim.top - nvTop);
                        nvTop = rectLim.top;
                        traceExec("Mm sym contrainte 2", 60);
                    }
                    if ((rectLim.bottom != undefined) && ((nvHeight + nvTop - 1) > rectLim.bottom)) {
                        var tropH = (nvHeight + nvTop - 1) - rectLim.bottom;
                        nvHeight = nvHeight - 2 * tropH;
                        nvTop = nvTop + tropH - 1;
                        traceExec("Mm sym contrainte 3");
                    }
                    if (nvHeight < lim.heightMin) {
                        var manqueH = lim.heightMin - nvHeight;
                        nvHeight = nvHeight + manqueH;
                        nvTop = nvTop - 0.5 * manqueH;
                        traceExec("Mm sym contrainte 4");
                    }
                }
                traceExec("Mm ap nvHeight= contraintes" + nvHeight, 60);
            }
            if (oReSize.magnet) {
                if (!oReSize.limitReDim.symetrie) {
                    if (direction.indexOf("n") != -1) {
                        var nvTopGrille = Math.round(nvTop / oReSize.magnet.heightRow) * oReSize.magnet.heightRow;
                        var diffMagn = nvTop - nvTopGrille;
                        nvTop = nvTopGrille;
                        nvHeight = nvHeight + diffMagn;
                    }
                    if (direction.indexOf("w") != -1) {
                        var nvLeftGrille = Math.round(parseInt(nvLeft) / oReSize.magnet.widthCol) * oReSize.magnet.widthCol;
                        diffMagn = nvLeft - nvLeftGrille;
                        nvLeft = nvLeftGrille;
                        nvWidth = nvWidth + diffMagn;
                    }
                    if (direction.indexOf("s") != -1) {
                        var nvHeightGrille = Math.round(parseInt(nvHeight) / oReSize.magnet.heightRow) * oReSize.magnet.heightRow;
                        diffMagn = nvHeight - nvHeightGrille;
                        nvHeight = nvHeightGrille;
                    }
                    if (direction.indexOf("e") != -1) {
                        nvWidth = Math.round(parseInt(nvWidth) / oReSize.magnet.widthCol) * oReSize.magnet.widthCol;
                    }
                } else {
                    alert("deformation symetrique + grille magnetique non encore impl?ment?e");
                }
            }
            oReSize.objetEnDeformation.style.top = nvTop;
            oReSize.objetEnDeformation.style.left = nvLeft;
            oReSize.objetEnDeformation.style.width = nvWidth;
            oReSize.objetEnDeformation.style.height = nvHeight;
            if (oReSize.oThis.synchroRS) {
                rialto.widgetBehavior.$$RSMM_CallBackSynchro();
            }
        }
    }
    stopEvent(e);
};
rialto.widgetBehavior.$$RSMM_CallBackSynchro = function () {
    var deltaTop = parseInt(oReSize.objetEnDeformation.style.top) - oReSize.prevTop;
    var deltaLeft = parseInt(oReSize.objetEnDeformation.style.left) - oReSize.prevLeft;
    var deltaWidth = parseInt(oReSize.objetEnDeformation.style.width) - oReSize.prevWidth;
    var deltaHeight = pixHeight(oReSize.objetEnDeformation) - oReSize.prevHeight;
    oReSize.prevTop = parseInt(oReSize.objetEnDeformation.style.top);
    oReSize.prevLeft = parseInt(oReSize.objetEnDeformation.style.left);
    oReSize.prevWidth = parseInt(oReSize.objetEnDeformation.style.width);
    oReSize.prevHeight = parseInt(oReSize.objetEnDeformation.style.height);
    if (oReSize.oThis.synchroRS) {
        oReSize.oThis.synchroRS({top:deltaTop, left:deltaLeft, width:deltaWidth, height:deltaHeight});
    }
};
rialto.widgetBehavior.ReSizeMouseUpHandler = function (e) {
    if (!e) {
        var e = window.event;
    }
    if (oReSize && oReSize.objetEnDeformation) {
        if (this.releaseCapture) {
            this.releaseCapture();
        } else {
            if (oReSize.fantome) {
                oReSize.objetEnDeformation.style.cursor = "default";
            } else {
                oReSize.oSource.style.cursor = "default";
            }
        }
        oReSize.oSource.behavior["RS"].isRunning = false;
        var oThis = oReSize.oThis;
        if (oThis.afterRS) {
            if (oReSize.objetADeformer != oReSize.objetEnDeformation) {
                var deltaTop = parseInt(oReSize.objetEnDeformation.style.top) - parseInt(oReSize.objetADeformer.style.top);
                var deltaLeft = parseInt(oReSize.objetEnDeformation.style.left) - parseInt(oReSize.objetADeformer.style.left);
                var deltaWidth = parseInt(oReSize.objetEnDeformation.style.width) - parseInt(oReSize.objetADeformer.style.width) + oReSize.wBordGD;
                traceExec("oReSize.objetEnDeformation.style.height= " + parseInt(oReSize.objetEnDeformation.style.height), 60);
                traceExec("oReSize.objetADeformer.style.height=     " + pixHeight(oReSize.objetADeformer), 60);
                var deltaHeight = parseInt(oReSize.objetEnDeformation.style.height) - pixHeight(oReSize.objetADeformer) + oReSize.wBordHB;
                traceExec("RS -3- Mup  afterRs existe deltaHeight = parseInt(oReSize.objetEnDeformation.style.height)- pixHeight(oReSize.objetADeformer) + oReSize.wBordHB= " + deltaHeight, 75);
                traceExec("______deltaHeight= " + deltaHeight, 62);
            } else {
                var deltaTop = parseInt(oReSize.objetEnDeformation.style.top) - parseInt(oReSize.topI);
                var deltaLeft = parseInt(oReSize.objetEnDeformation.style.left) - parseInt(oReSize.leftI);
                var deltaWidth = parseInt(oReSize.objetEnDeformation.style.width) - parseInt(oReSize.widthI);
                var deltaHeight = parseInt(oReSize.objetEnDeformation.style.height) - parseInt(oReSize.heightI);
                traceExec("RS -4- Mup pas de afterRs deltaHeight = parseInt(oReSize.objetEnDeformation.style.height)- parseInt(oReSize.heightI)= " + deltaHeight, 75);
            }
        }
        if (oReSize.objetADeformer != oReSize.objetEnDeformation) {
            oReSize.objetADeformer.style.top = oReSize.objetEnDeformation.style.top;
            oReSize.objetADeformer.style.left = oReSize.objetEnDeformation.style.left;
            oReSize.objetADeformer.style.width = parseInt(oReSize.objetEnDeformation.style.width) + oReSize.wBordGD;
            oReSize.objetADeformer.style.height = parseInt(oReSize.objetEnDeformation.style.height) + oReSize.wBordHB;
            traceExec("RS -5- Mup oReSize.objetADeformer.id= " + oReSize.objetADeformer.id + " oReSize.objetADeformer.style.height = parseInt(oReSize.objetEnDeformation.style.height) + oReSize.wBordHB=" + oReSize.objetADeformer.style.height, 1);
        }
        if (oReSize.fantome) {
            oReSize.objetEnDeformation.style.visibility = "hidden";
        }
        if (oReSize.mvtEffectif) {
            if (oThis.afterRS) {
                oThis.afterRS({top:deltaTop, left:deltaLeft, width:deltaWidth, height:deltaHeight});
            }
        } else {
            if (oThis.afterClic) {
                oThis.afterClic(e);
            }
        }
        oReSize = null;
        stopEvent(e);
    }
};
rialto.widgetBehavior.ReSize.modCurseur = function (oHtml, direction, orientation) {
    if (direction == "") {
        oHtml.style.cursor = "default";
    } else {
        if (orientation == "v") {
            oHtml.style.cursor = direction + "-resize";
        } else {
            if (orientation == "h") {
                oHtml.style.cursor = direction + "-resize";
            } else {
                oHtml.style.cursor = "move";
            }
        }
    }
};


rialto.widget.Image = function (imageOut, left, top, parent, alternateText, imageOn, objParam) {
    if (arguments.length == 0) {
        return;
    }
    this.base = rialto.widget.AbstractComponent;
    var objPar = (typeof objParam != "undefined") ? objParam : {};
    objPar.type = "image" + imageOut;
    objPar.name = "image" + imageOut;
    objPar.left = left;
    objPar.top = top;
    this.base(objPar);
    this.imgOn = this.ImgRef = imageOut;
    if (imageOn && imageOn != "") {
        this.ImgRef2 = imageOn;
    }
    this.alt = alternateText;
    this.display = "block";
    this.enable = true;
    this.avecLim = false;
    this.imageDisabled = imageOut;
    this.boolFloatRight = false;
    this.boolFloatLeft = false;
    this.onclick = null;
    this.onerror = function (evt) {
        var al = new rialto.widget.Alert("ERROR WHILE LOADING FOLLOWING IMAGE:");
        al.addText("Please check the path");
    };
    if (objPar != null) {
        if (objPar.imageDisabled != null) {
            this.imageDisabled = objPar.imageDisabled;
        }
        if (rialto.lang.isBoolean(objPar.boolFloatRight)) {
            this.boolFloatRight = objPar.boolFloatRight;
        }
        if (rialto.lang.isBoolean(objPar.boolFloatLeft)) {
            this.boolFloatLeft = objPar.boolFloatLeft;
        }
        if (rialto.lang.isFunction(objPar.onerror)) {
            this.onerror = objPar.onerror;
        }
    }
    if (this.boolFloatLeft || this.boolFloatRight) {
        this.position = "relative";
    }
    objPar = null;
    objParam = null;
    this.base = null;
    var oThis = this;
    this.divExt.style.position = this.position;
    this.divExt.style.display = this.display;
    this.divExt.style.left = this.left + "px";
    this.divExt.style.top = this.top + "px";
    this.divExt.className = "img-div";
    this.divExt.style.width = "auto";
    this.divExt.style.height = "auto";
    if (this.boolFloatLeft) {
        this.divExt.style[ATTRFLOAT] = "left";
    }
    if (this.boolFloatRight) {
        this.divExt.style[ATTRFLOAT] = "right";
    }
    if (this.alt != null) {
        this.divExt.title = this.alt;
    }
    this.divExt.onmouseout = function (e) {
        if (oThis.enable) {
            if (!e) {
                e = window.event;
            }
            oThis.$$loadImage();
            oThis.onmouseout(e);
        }
    };
    this.divExt.onselectstart = function () {
        return false;
    };
    this.divExt.onmousemove = function (e) {
        if (oThis.avecLim) {
            if (!e) {
                e = window.event;
            }
            this.onmouseover(e);
        }
    };
    this.divExt.onmouseover = function (e) {
        if (!e) {
            e = window.event;
        }
        if (oThis.verifLimReac(e)) {
            if (oThis.enable) {
                if (oThis.onclick) {
                    this.style.cursor = "pointer";
                } else {
                    this.style.cursor = "default";
                }
                if (oThis.ImgRef2) {
                    oThis.$$loadImage(altImg = true);
                }
            } else {
                this.style.cursor = "default";
            }
            oThis.onmouseover();
        } else {
            this.onmouseout(e);
        }
        stopEvent(e);
    };
    this.divExt.onclick = function (e) {
        if (!e) {
            e = window.event;
        }
        if (oThis.verifLimReac(e)) {
            if (oThis.enable && oThis.onclick) {
                oThis.onclick(e);
                stopEvent(e);
            }
        }
    };
    this.divExt.ondblclick = function (e) {
        if (!e) {
            e = window.event;
        }
        if (oThis.verifLimReac(e)) {
            if (oThis.enable) {
                oThis.ondbleclick(e);
                stopEvent(e);
            }
        }
    };
    this._imgDiv = document.createElement("DIV");
    this._imgImg = document.createElement("IMG");
    this.$$loadImage();
    this.divExt.appendChild(this._img);
    this._img.onerror = this.onerror;
    if (parent != null) {
        this.placeIn(parent);
    }
};
rialto.widget.Image.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Image.prototype.getHtmlDD = function () {
    return this._img;
};
rialto.lang.extend(rialto.widget.Image, {$$loadImage:function (bAlt) {
    var wImgRef;
    if (!this.enable) {
        if (this.imageDisabled) {
            wImgRef = this.imageDisabled;
        } else {
            return;
        }
    } else {
        if (!bAlt) {
            wImgRef = this.ImgRef;
        } else {
            wImgRef = this.ImgRef2;
        }
    }
    if (wImgRef.indexOf(".") != -1) {
        this._imgDiv.style.display = "none";
        this._imgImg.style.display = "block";
        this._imgImg.src = wImgRef;
        this._img = this._imgImg;
    } else {
        this._imgImg.style.display = "none";
        this._imgDiv.style.display = "block";
        this._imgDiv.className = wImgRef;
        this._img = this._imgDiv;
    }
}, $changeImages:function (imageOut, imageOver, imageDisabled) {
    if (imageOut != null) {
        this.imgOn = this.ImgRef = imageOut;
    }
    if (imageOver != null) {
        this.ImgRef2 = imageOver;
    }
    if (imageDisabled != null) {
        this.imageDisabled = imageDisabled;
    }
    this.$$loadImage();
}, setLimReac:function (x, y, delX, delY) {
    this.x = x;
    this.y = y;
    this.delX = delX;
    this.delY = delY;
    this.avecLim = true;
}, verifLimReac:function (e) {
    if (this.avecLim) {
        if (window.event) {
            var evX = parseInt(e.offsetX);
            var evY = parseInt(e.offsetY);
        } else {
            var evX = parseInt(e.layerX);
            var evY = parseInt(e.layerY);
        }
        return ((evX >= this.x && evX <= (this.x + this.delX)) && (evY >= this.y && evY <= (this.y + this.delY)));
    } else {
        return true;
    }
}, setImageReference:function (imageOut, imageOver) {
    this.$changeImages(imageOut, imageOver);
}, setImages:function (imageOut, imageOver, imageDisabled) {
    this.$changeImages(imageOut, imageOver, imageDisabled);
}, setAlt:function (alt) {
    this.alt = alt;
    this._img.title = alt;
}, setVisible:function (visible) {
    var oHtml = this.getHtmlExt();
    if (visible) {
        oHtml.style.display = "block";
        this._img.style.display = this.display;
    } else {
        oHtml.style.display = "none";
    }
    this.visible = visible;
}, setEnable:function (enable) {
    this.enable = enable;
    this.$changeImages(null, null, this.imageDisabled);
}, clignote:function () {
    if (this.imgOn == this.ImgRef) {
        this.imgOn = this.ImgRef2;
    } else {
        this.imgOn = this.ImgRef;
    }
    this._img.className = this.imgOn;
    this.Tclignote = window.setTimeout("rialto.session.objects[\"" + this.id + "\"].clignote()", 500);
}, arreteClignote:function () {
    this.imgOn = this.ImgRef;
    this._img.className = this.ImgRef;
    if (this.Tclignote) {
        window.clearTimeout(this.Tclignote);
    }
}, release:function () {
    this.divExt.onmouseout = null;
    this.divExt.onselectstart = null;
    this.divExt.onmousemove = null;
    this.divExt.onmouseover = null;
    this.divExt.onclick = null;
    this.divExt.ondblclick = null;
    this._img.onerror = null;
    this._img.onload = null;
    this.$changeImages = null;
    this.onclick = null;
}});


function MasqueZones(suffFond, argtZonesCtrlees, oCiuLie, modeMasque) {
    var masque;
    this.creeMasque = CreeVoileHtml;
    if (!argtZonesCtrlees) {
        argtZonesCtrlees = window.document.body;
    }
    var emprise = new Array;
    if (!(argtZonesCtrlees instanceof Array)) {
        emprise[0] = argtZonesCtrlees;
    } else {
        emprise = argtZonesCtrlees;
    }
    if (modeMasque == "strict") {
        traceExec("create mask mode \"strict\"", 1);
        masque = rialto.session ? (rialto.session.masque ? rialto.session.masque : null) : null;
        if ((!masque) || (masque.style.display == "block")) {
            traceExec("no mask exist or hidden mode --> create new mask", 1);
            masque = this.creeMasque(suffFond, withoutStopEvent = true);
        } else {
            traceExec("already a mask", 1);
            masque.className = "ecranMasque" + suffFond;
            masque.style.display = "block";
        }
        emprise[0].appendChild(masque);
    } else {
        traceExec("create mask mode \"no strict\"", 1);
        masque = this.creeMasque(suffFond);
        masque.style.width = emprise[0].offsetWidth;
        masque.style.height = emprise[0].offsetHeight;
        emprise[0].appendChild(masque);
    }
    if (typeof masque.espaceReqLie == "undefined") {
        masque.espaceReqLiee = new Array;
    }
    masque.espaceReqLiee.push(oCiuLie);
    traceExec("mask / area 0 created", 1);
    for (var e = 1; e < emprise.length; e++) {
        traceExec("mask / area " + e, 1);
        if ((emprise[e].firstChild) && (emprise[e].lastChild.className) && (emprise[e].lastChild.className.indexOf("ecranMasque") != -1)) {
            wMasque = emprise[e].lastChild;
            if (wMasque.style.display == "none") {
                masque = wMasque;
                masque.className = "ecranMasque" + suffFond;
                masque.style.display = "block";
            } else {
                if (wMasque.firstChild) {
                    alert("masque activ? avec popup inscrit dedans n? masque= " + wMasque.id);
                    while ((wMasque.firstChild) && (wMasque.lastChild.className) && (wMasque.lastChild.className.indexOf("ecranMasque") != -1)) {
                        wMasque = wMasque.lastChild;
                    }
                    masque = this.creeMasque(suffFond);
                    wMasque.appendChild(masque);
                } else {
                    masque = wMasque;
                }
            }
        } else {
            masque = this.creeMasque(suffFond);
            emprise[e].appendChild(masque);
        }
        masque.espaceReqLiee.push(oCiuLie);
    }
    masque = emprise[0].lastChild;
    return masque;
}
function CreeVoileHtml(suffFond, withoutStopEvent) {
    traceExec("CreeVoileHtml withoutStopEvent= " + withoutStopEvent, 1);
    var masque = document.createElement("DIV");
    masque.className = "ecranMasque" + suffFond;
    masque.style.width = "100%";
    masque.style.height = "100%";
    masque.style.zIndex = 10000;
    masque.espaceReqLiee = new Array;
    masque.id = CreeVoileHtml.prototype.nbInstances++;
    masque.onclick = function (e) {
        for (var i = 0; i < this.espaceReqLiee.length; i++) {
            oCiuLie = this.espaceReqLiee[i];
            if (oCiuLie && oCiuLie.infoAccesInterdit) {
                oCiuLie.infoAccesInterdit();
            } else {
                if (oCiuLie && oCiuLie.fen) {
                    oCiuLie.fen.chgEtat("inactive");
                    setTimeout("rialto.session.objects.singletonCDs[\"" + oCiuLie.sourceReq + "\"].fen.chgEtat('active')", 500);
                }
            }
        }
        if (!withoutStopEvent) {
            traceExec("masque.onclick with StopEvent", 1);
            stopEvent(e);
        } else {
            traceExec("masque.onclick withoutStopEvent", 1);
        }
    };
    masque.suppRef = function (ref) {
        for (var i = 0; i < this.espaceReqLiee.length; i++) {
            if (this.espaceReqLiee[i] == ref) {
                this.espaceReqLiee.splice(i, 1);
                break;
            }
        }
        return this.espaceReqLiee.length;
    };
    return masque;
}
CreeVoileHtml.prototype.nbInstances = 0;


function PrintBehavior() {
    if (!this.getInfoPrint) {
        info = new rialto.widget.Alert("Cette partie du document n'est pas imprimable (pas de m?thode getInfoPrint).");
        return false;
    } else {
        this.objP = this.getInfoPrint();
    }
    var patient = "";
    if (objFenetreSimple.prototype.fenetreActive.patDependant) {
        var wMaladItem = rialto.session.objects["bandeau"].patientActif;
        patient = wMaladItem.dossier + " " + wMaladItem.cle + " - " + wMaladItem.nom + " " + wMaladItem.prenom;
    }
    var titre = new String;
    titre = rialto.string.formatHTTP(this.objP.titre);
    var url = "print_elmt?FENID=" + this.id + "&TITRE=" + titre + "&NBLIGNE=" + this.objP.NbreLig + "&NBCOLONNES=" + this.objP.NBCOL + "&ENTETE=" + this.objP.strEntete + "&PATIENT=" + patient;
    var widthGlobal = document.body.clientWidth;
    var heightGlobal = document.body.clientHeight;
    this.fenImp = window.open(url, "IMPRESSION", "height=" + heightGlobal + ",width=" + widthGlobal + ",top=0,left=0,scrollbars,resizable,toolbar,menubar");
    this.rempFenImp = PrintBehaviorRempFenImp;
    this.rempFenImp();
}
function PrintBehaviorRempFenImp() {
    if (this.fenImp.rempPage) {
        this.fenImp.rempPage(this.objP);
    } else {
        window.setTimeout("rialto.session.objects[\"" + this.id + "\"].rempFenImp()", 50);
    }
}


function SingletonCD(contexte) {
    if (contexte) {
        if (this.constructor.prototype.nbInstances == undefined) {
            this.constructor.prototype.nbInstances = new Array;
        }
        if (this.constructor.prototype.nbInstances[contexte] == undefined) {
            this.constructor.prototype.nbInstances[contexte] = 0;
        }
        if (this.constructor.prototype.nbInstances[contexte] != 0) {
            return rialto.session.objects.singletonCDs[contexte];
        } else {
            this.constructor.prototype.nbInstances[contexte]++;
            if (rialto.session.objects == undefined) {
                rialto.session.objects = new Object;
            }
            if (rialto.session.objects.singletonCDs == undefined) {
                rialto.session.objects.singletonCDs = new Array;
            }
            if (rialto.session.objects.singletonCDs[contexte] == undefined) {
                rialto.session.objects.singletonCDs[contexte] = new Object;
            }
            rialto.session.objects.singletonCDs[contexte] = this;
            return null;
        }
    } else {
        if (this.constructor.prototype.nbInstances == undefined) {
            this.constructor.prototype.nbInstances = 0;
        }
        if (this.constructor.prototype.nbInstances != 0) {
            return rialto.session.objects[this];
        } else {
            this.constructor.prototype.nbInstances++;
            if (rialto.sessionw.objects == undefined) {
                rialto.session.objects = new Array;
            }
            rialto.session.objects[this] = this;
            return null;
        }
    }
}
function recupSingletonCD(ctxt) {
    return "this.recupInst = SingletonCD;  this.recupInst('" + ctxt + "'); ";
}
function recupSingleton() {
    return "this.recupInst = SingletonCD;  this.recupInst(); ";
}
function classTestCD(ctxt) {
    alert("ctxt= " + ctxt);
    if (instanceUnique = eval(recupSingletonCD(ctxt))) {
        return instanceUnique;
    }
    alert("creation de l' unique objet, instance de classTestCD dans le contexte " + ctxt);
    this.id = "ID_InstanceUniqueClassTestCD_" + ctxt;
}
function classTestCD2(ctxt) {
    this.recupInst = SingletonCD;
    if (instDejaCree = this.recupInst(ctxt)) {
        return instDejaCree;
    }
    alert("creation de l' unique objet, instance de classTestCD2 dans le contexte " + ctxt);
    this.id = "ID_instanceUniqueClassTestCD2_" + ctxt;
}
classTestCD.prototype = new classTestCD3;
function classTestCD3() {
    this.attr1 = "essai derivation";
}


ATTRFLOAT = (!window.getComputedStyle) ? "styleFloat" : "cssFloat";
if (!rialto.effect) {
    rialto.effect = {};
}
rialto.effect.opacity = function (oHtml, level) {
    oHtml.style.filter = "alpha(opacity:" + (level * 100) + ")";
    oHtml.style.opacity = level;
};


function replace(strCible, strRech, strRempla) {
    var array;
    var s = new String(strCible);
    if (s != "") {
        array = s.split(strRech);
    }
    s = "";
    for (i = 0; i < array.length; i++) {
        s += array[i] + strRempla;
    }
    s = s.substring(0, s.length - strRech.length - 1);
    return s;
}
function delOHtmlCiu(id) {
    var cible;
    if (id != null) {
        if (id.target) {
            cible = id.target;
        } else {
            cible = document.getElementById(id);
        }
    } else {
        cible = this;
    }
    if (cible.deletePossible()) {
        cible.remove();
    } else {
        setTimeout("delObjHtmlCiu(\"" + cible.id + "\")", 200);
    }
}


function SingletonCD(contexte) {
    if (contexte) {
        if (this.constructor.prototype.nbInstances == undefined) {
            this.constructor.prototype.nbInstances = new Array;
        }
        if (this.constructor.prototype.nbInstances[contexte] == undefined) {
            this.constructor.prototype.nbInstances[contexte] = 0;
        }
        if (this.constructor.prototype.nbInstances[contexte] != 0) {
            return rialto.session.objects.singletonCDs[contexte];
        } else {
            this.constructor.prototype.nbInstances[contexte]++;
            if (rialto.session.objects == undefined) {
                rialto.session.objects = new Object;
            }
            if (rialto.session.objects.singletonCDs == undefined) {
                rialto.session.objects.singletonCDs = new Array;
            }
            if (rialto.session.objects.singletonCDs[contexte] == undefined) {
                rialto.session.objects.singletonCDs[contexte] = new Object;
            }
            rialto.session.objects.singletonCDs[contexte] = this;
            return null;
        }
    } else {
        if (this.constructor.prototype.nbInstances == undefined) {
            this.constructor.prototype.nbInstances = 0;
        }
        if (this.constructor.prototype.nbInstances != 0) {
            return rialto.session.objects[this];
        } else {
            this.constructor.prototype.nbInstances++;
            if (rialto.session.objects == undefined) {
                rialto.session.objects = new Array;
            }
            rialto.session.objects[this] = this;
            return null;
        }
    }
}
function recupSingletonCD(ctxt) {
    return "this.recupInst = SingletonCD;  this.recupInst('" + ctxt + "'); ";
}
function recupSingleton() {
    return "this.recupInst = SingletonCD;  this.recupInst(); ";
}
function classTestCD(ctxt) {
    alert("ctxt= " + ctxt);
    if (instanceUnique = eval(recupSingletonCD(ctxt))) {
        return instanceUnique;
    }
    alert("creation de l' unique objet, instance de classTestCD dans le contexte " + ctxt);
    this.id = "ID_InstanceUniqueClassTestCD_" + ctxt;
}
function classTestCD2(ctxt) {
    this.recupInst = SingletonCD;
    if (instDejaCree = this.recupInst(ctxt)) {
        return instDejaCree;
    }
    alert("creation de l' unique objet, instance de classTestCD2 dans le contexte " + ctxt);
    this.id = "ID_instanceUniqueClassTestCD2_" + ctxt;
}
classTestCD.prototype = new classTestCD3;
function classTestCD3() {
    this.attr1 = "essai derivation";
}


function getComputStyleIf(oHtml, dim, def) {
    if (!oHtml || (!window.getComputedStyle && !oHtml.currentStyle) || (getComputStyleStr(oHtml, "display") == "none")) {
        return 0;
    } else {
        return getComputStyle(oHtml, dim, def);
    }
}
function getComputStyle(oHtml, dim, def) {
    if (def) {
        return (window.getComputedStyle) ? parseInt(window.getComputedStyle(oHtml, null)[dim] || def) : parseInt(oHtml.currentStyle[dim] || def);
    } else {
        return (window.getComputedStyle) ? parseInt(window.getComputedStyle(oHtml, null)[dim]) : parseInt(oHtml.currentStyle[dim]);
    }
}
function getComputStyleStr(oHtml, dim, def) {
    if (def) {
        return (window.getComputedStyle ? window.getComputedStyle(oHtml, null)[dim] || def : oHtml.currentStyle[dim] || def);
    } else {
        return (window.getComputedStyle ? window.getComputedStyle(oHtml, null)[dim] : oHtml.currentStyle[dim]);
    }
}
getBorderStyle = function (oHtml) {
    var bBorder;
    if (!window.getComputedStyle) {
        traceExec("nd.currentStyle.borderWidth = " + oHtml.currentStyle.borderWidth, 20);
        bBorder = ((getComputStyleStr(oHtml, "borderStyle") != "none") && (getComputStyleStr(oHtml, "borderStyle") != ""));
        traceExec("getComputStyleStr(oHtml,borderStyle)= " + getComputStyleStr(oHtml, "borderStyle"), 20);
    } else {
        bBorder = (getComputStyle(oHtml, "borderTopWidth") != 0);
    }
    traceExec("getBorderStyle= " + bBorder, 20);
    return bBorder;
};
getBorderWidth = function (oHtml) {
    return (window.getComputedStyle) ? parseInt(window.getComputedStyle(oHtml, null)["borderTopWidth"]) : getBorderStyle(oHtml) ? parseInt(oHtml.currentStyle["borderWidth"]) : 0;
};
borderIfNecess = function (oHtml) {
    return ((window.getComputedStyle) ? (parseInt(window.getComputedStyle(oHtml, null)["borderTopWidth"]) + parseInt(window.getComputedStyle(oHtml, null)["borderBottomWidth"])) : 0);
};


function execAfterLoad(id, fct, cdtion) {
    var oThis;
    oHtml = document.getElementById(id);
    traceExec("execAfterLoad id= " + id + " fct= " + fct, 76);
    if (!cdtion) {
        if (oHtml) {
            oThis = oHtml.oCiu;
            traceExec("execAfterLoad oHtml.id= " + oHtml.id, 76);
            traceExec("execAfterLoad oHtml.oCiu= " + oHtml.oCiu, 76);
            traceExec("execAfterLoad oHtml.oCiu.id= " + oHtml.oCiu.id, 76);
            eval("oThis." + fct + "()");
        } else {
            setTimeout("execAfterLoad(\"" + id + "\",\"" + fct + "\")", 2);
        }
    } else {
        if (oHtml) {
            oThis = oHtml.oCiu;
            cdtionVerifiee = eval("oThis." + cdtion + "()");
            if (cdtionVerifiee) {
                eval("oThis." + fct + "()");
            } else {
                setTimeout("execAfterLoad(\"" + id + "\",\"" + fct + "\",\"" + cdtion + "\")", 2);
            }
        } else {
            setTimeout("execAfterLoad(\"" + id + "\",\"" + fct + "\",\"" + cdtion + "\")", 2);
        }
    }
}
function execAfterLoad_2(id, fct) {
    var oThis;
    var oHtml;
    if (id != null) {
        oHtml = document.getElementById(id);
        if (oHtml) {
            oThis = oHtml.oCiu;
            traceExec("charge", 20);
        }
    } else {
        oThis = this;
    }
    if (oHtml) {
        alert(oThis.idObjComp + " " + fct);
        eval("oThis." + fct + "()");
    } else {
        setTimeout("execAfterLoad_2(\"" + id + "\",\"" + fct + "\")", 2);
    }
}
function execAfter(bool, val, fct, oThis) {
    traceExec("execAfter val= " + val + " bool= " + bool + " fct= " + fct, 74);
    var oCiu;
    if (oThis) {
        oCiu = oThis;
    } else {
        oCiu = this;
    }
    traceExec("execAfter val = " + eval("oCiu." + bool), 74);
    var cdtion = "oCiu." + bool + " == " + val;
    if (eval(cdtion)) {
        eval("oCiu." + fct + "()");
    } else {
        traceExec("execAfter oCiu = " + oCiu, 74);
        var fct = "execAfter(\"" + bool + "\",\"" + val + "\",\"" + fct + "\"," + oCiu + " )";
        setTimeout(fct, 2);
    }
}


if (!("console" in window) || !("firebug" in console)) {
    (function () {
        window.console = {log:function () {
            logFormatted(arguments, "");
        }, debug:function () {
            logFormatted(arguments, "debug");
        }, info:function () {
            logFormatted(arguments, "info");
        }, warn:function () {
            logFormatted(arguments, "warning");
        }, error:function () {
            logFormatted(arguments, "error");
        }, assert:function (truth, message) {
            if (!truth) {
                var args = [];
                for (var i = 1; i < arguments.length; ++i) {
                    args.push(arguments[i]);
                }
                logFormatted(args.length ? args : ["Assertion Failure"], "error");
                throw message ? message : "Assertion Failure";
            }
        }, dir:function (object) {
            var html = [];
            var pairs = [];
            for (var name in object) {
                try {
                    pairs.push([name, object[name]]);
                }
                catch (exc) {
                }
            }
            pairs.sort(function (a, b) {
                return a[0] < b[0] ? -1 : 1;
            });
            html.push("<table>");
            for (var i = 0; i < pairs.length; ++i) {
                var name = pairs[i][0], value = pairs[i][1];
                html.push("<tr>", "<td class=\"propertyNameCell\"><span class=\"propertyName\">", escapeHTML(name), "</span></td>", "<td><span class=\"propertyValue\">");
                appendObject(value, html);
                html.push("</span></td></tr>");
            }
            html.push("</table>");
            logRow(html, "dir");
        }, dirxml:function (node) {
            var html = [];
            appendNode(node, html);
            logRow(html, "dirxml");
        }, group:function () {
            logRow(arguments, "group", pushGroup);
        }, groupEnd:function () {
            logRow(arguments, "", popGroup);
        }, time:function (name) {
            timeMap[name] = (new Date()).getTime();
        }, timeEnd:function (name) {
            if (name in timeMap) {
                var delta = (new Date()).getTime() - timeMap[name];
                logFormatted([name + ":", delta + "ms"]);
                delete timeMap[name];
            }
        }, count:function () {
            this.warn(["count() not supported."]);
        }, trace:function () {
            this.warn(["trace() not supported."]);
        }, profile:function () {
            this.warn(["profile() not supported."]);
        }, profileEnd:function () {
        }, clear:function () {
            consoleBody.innerHTML = "";
        }, open:function () {
            toggleConsole(true);
        }, close:function () {
            if (frameVisible) {
                toggleConsole();
            }
        }};
        var consoleFrame = null;
        var consoleBody = null;
        var commandLine = null;
        var frameVisible = true;
        var messageQueue = [];
        var groupStack = [];
        var timeMap = {};
        var clPrefix = ">>> ";
        var isFirefox = navigator.userAgent.indexOf("Firefox") != -1;
        var isIE = navigator.userAgent.indexOf("MSIE") != -1;
        var isOpera = navigator.userAgent.indexOf("Opera") != -1;
        var isSafari = navigator.userAgent.indexOf("AppleWebKit") != -1;
        var fr;
        function toggleConsole(forceOpen) {
            frameVisible = forceOpen || !frameVisible;
            if (consoleFrame) {
                if (fr && fr.setVisible) {
                    fr.setVisible(frameVisible);
                }
            } else {
                waitForBody();
            }
        }
        function focusCommandLine() {
            toggleConsole(true);
            if (commandLine) {
                commandLine.focus();
            }
        }
        function waitForBody() {
            if (document.body) {
                createFrame();
            } else {
                setTimeout(waitForBody, 200);
            }
        }
        function createFrame() {
            if (consoleFrame) {
                return;
            }
            consoleFrame = document.createElement("DIV");
            consoleFrame.style.position = "absolute";
            consoleFrame.style.width = "100%";
            consoleFrame.style.left = "0";
            consoleFrame.style.bottom = "0";
            consoleFrame.style.height = "200px";
            consoleFrame.innerHTML = "" + "<div id=\"toolbar\" class=\"toolbar\">" + "<a href=\"#\" onclick=\"parent.console.clear()\">Clear</a>" + "<span class=\"toolbarRight\">" + "<a href=\"#\" onclick=\"parent.console.close()\">Close</a>" + "</span>" + "</div>" + "<div id=\"log\"></div>" + "<input type=\"text\" id=\"commandLine\">";
            var widthGlobal = document.body.clientWidth;
            var heightGlobal = document.body.clientHeight;
            var top = heightGlobal - 230;
            var left = widthGlobal - 400;
            try {
                fr = new rialto.widget.Frame({name:"Dashboard", top:top, left:left, width:400, height:230, title:"DEBUG", dynamic:true, draggable:true, parent:document.body});
                fr.placeInTop();
                fr.add(consoleFrame);
            }
            catch (e) {
                alert(e.message);
            }
            commandLine = document.getElementById("commandLine");
            addEvent(commandLine, "keydown", onCommandLineKeyDown);
            addEvent(document, isIE || isSafari ? "keydown" : "keypress", onKeyDown);
            consoleBody = document.getElementById("log");
            layout();
            flush();
        }
        function evalCommandLine() {
            var text = commandLine.value;
            commandLine.value = "";
            logRow([clPrefix, text], "command");
            var value;
            try {
                value = eval(text);
            }
            catch (exc) {
            }
            console.log(value);
        }
        function layout() {
            var toolbar = document.getElementById("toolbar");
            var height = consoleFrame.offsetHeight - (toolbar.offsetHeight + commandLine.offsetHeight);
            consoleBody.style.top = toolbar.offsetHeight + "px";
            consoleBody.style.height = height + "px";
            commandLine.style.top = (consoleFrame.offsetHeight - commandLine.offsetHeight) + "px";
        }
        function logRow(message, className, handler) {
            if (consoleBody) {
                writeMessage(message, className, handler);
            } else {
                messageQueue.push([message, className, handler]);
                waitForBody();
            }
        }
        function flush() {
            var queue = messageQueue;
            messageQueue = [];
            for (var i = 0; i < queue.length; ++i) {
                writeMessage(queue[i][0], queue[i][1], queue[i][2]);
            }
        }
        function writeMessage(message, className, handler) {
            var isScrolledToBottom = consoleBody.scrollTop + consoleBody.offsetHeight >= consoleBody.scrollHeight;
            if (!handler) {
                handler = writeRow;
            }
            handler(message, className);
            if (isScrolledToBottom) {
                consoleBody.scrollTop = consoleBody.scrollHeight - consoleBody.offsetHeight;
            }
        }
        function appendRow(row) {
            var container = groupStack.length ? groupStack[groupStack.length - 1] : consoleBody;
            container.appendChild(row);
        }
        function writeRow(message, className) {
            var row = consoleBody.ownerDocument.createElement("div");
            row.className = "logRow" + (className ? " logRow-" + className : "");
            row.innerHTML = message.join("");
            appendRow(row);
        }
        function pushGroup(message, className) {
            logFormatted(message, className);
            var groupRow = consoleBody.ownerDocument.createElement("div");
            groupRow.className = "logGroup";
            var groupRowBox = consoleBody.ownerDocument.createElement("div");
            groupRowBox.className = "logGroupBox";
            groupRow.appendChild(groupRowBox);
            appendRow(groupRowBox);
            groupStack.push(groupRowBox);
        }
        function popGroup() {
            groupStack.pop();
        }
        function logFormatted(objects, className) {
            var html = [];
            var format = objects[0];
            var objIndex = 0;
            if (typeof (format) != "string") {
                format = "";
                objIndex = -1;
            }
            var parts = parseFormat(format);
            for (var i = 0; i < parts.length; ++i) {
                var part = parts[i];
                if (part && typeof (part) == "object") {
                    var object = objects[++objIndex];
                    part.appender(object, html);
                } else {
                    appendText(part, html);
                }
            }
            for (var i = objIndex + 1; i < objects.length; ++i) {
                appendText(" ", html);
                var object = objects[i];
                if (typeof (object) == "string") {
                    appendText(object, html);
                } else {
                    appendObject(object, html);
                }
            }
            logRow(html, className);
        }
        function parseFormat(format) {
            var parts = [];
            var reg = /((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/;
            var appenderMap = {s:appendText, d:appendInteger, i:appendInteger, f:appendFloat};
            for (var m = reg.exec(format); m; m = reg.exec(format)) {
                var type = m[8] ? m[8] : m[5];
                var appender = type in appenderMap ? appenderMap[type] : appendObject;
                var precision = m[3] ? parseInt(m[3]) : (m[4] == "." ? -1 : 0);
                parts.push(format.substr(0, m[0][0] == "%" ? m.index : m.index + 1));
                parts.push({appender:appender, precision:precision});
                format = format.substr(m.index + m[0].length);
            }
            parts.push(format);
            return parts;
        }
        function escapeHTML(value) {
            function replaceChars(ch) {
                switch (ch) {
                  case "<":
                    return "&lt;";
                  case ">":
                    return "&gt;";
                  case "&":
                    return "&amp;";
                  case "'":
                    return "&#39;";
                  case "\"":
                    return "&quot;";
                }
                return "?";
            }
            return String(value).replace(/[<>&"']/g, replaceChars);
        }
        function objectToString(object) {
            try {
                return object + "";
            }
            catch (exc) {
                return null;
            }
        }
        function appendText(object, html) {
            html.push(escapeHTML(objectToString(object)));
        }
        function appendNull(object, html) {
            html.push("<span class=\"objectBox-null\">", escapeHTML(objectToString(object)), "</span>");
        }
        function appendString(object, html) {
            html.push("<span class=\"objectBox-string\">&quot;", escapeHTML(objectToString(object)), "&quot;</span>");
        }
        function appendInteger(object, html) {
            html.push("<span class=\"objectBox-number\">", escapeHTML(objectToString(object)), "</span>");
        }
        function appendFloat(object, html) {
            html.push("<span class=\"objectBox-number\">", escapeHTML(objectToString(object)), "</span>");
        }
        function appendFunction(object, html) {
            var reName = /function ?(.*?)\(/;
            var m = reName.exec(objectToString(object));
            var name = m ? m[1] : "function";
            html.push("<span class=\"objectBox-function\">", escapeHTML(name), "()</span>");
        }
        function appendObject(object, html) {
            try {
                if (object == undefined) {
                    appendNull("undefined", html);
                } else {
                    if (object == null) {
                        appendNull("null", html);
                    } else {
                        if (typeof object == "string") {
                            appendString(object, html);
                        } else {
                            if (typeof object == "number") {
                                appendInteger(object, html);
                            } else {
                                if (typeof object == "function") {
                                    appendFunction(object, html);
                                } else {
                                    if (object.nodeType == 1) {
                                        appendSelector(object, html);
                                    } else {
                                        if (typeof object == "object") {
                                            appendObjectFormatted(object, html);
                                        } else {
                                            appendText(object, html);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (exc) {
            }
        }
        function appendObjectFormatted(object, html) {
            var text = objectToString(object);
            var reObject = /\[object (.*?)\]/;
            var m = reObject.exec(text);
            html.push("<span class=\"objectBox-object\">", m ? m[1] : text, "</span>");
        }
        function appendSelector(object, html) {
            html.push("<span class=\"objectBox-selector\">");
            html.push("<span class=\"selectorTag\">", escapeHTML(object.nodeName.toLowerCase()), "</span>");
            if (object.id) {
                html.push("<span class=\"selectorId\">#", escapeHTML(object.id), "</span>");
            }
            if (object.className) {
                html.push("<span class=\"selectorClass\">.", escapeHTML(object.className), "</span>");
            }
            html.push("</span>");
        }
        function appendNode(node, html) {
            if (node.nodeType == 1) {
                html.push("<div class=\"objectBox-element\">", "&lt;<span class=\"nodeTag\">", node.nodeName.toLowerCase(), "</span>");
                for (var i = 0; i < node.attributes.length; ++i) {
                    var attr = node.attributes[i];
                    if (!attr.specified) {
                        continue;
                    }
                    html.push("&nbsp;<span class=\"nodeName\">", attr.nodeName.toLowerCase(), "</span>=&quot;<span class=\"nodeValue\">", escapeHTML(attr.nodeValue), "</span>&quot;");
                }
                if (node.firstChild) {
                    html.push("&gt;</div><div class=\"nodeChildren\">");
                    for (var child = node.firstChild; child; child = child.nextSibling) {
                        appendNode(child, html);
                    }
                    html.push("</div><div class=\"objectBox-element\">&lt;/<span class=\"nodeTag\">", node.nodeName.toLowerCase(), "&gt;</span></div>");
                } else {
                    html.push("/&gt;</div>");
                }
            } else {
                if (node.nodeType == 3) {
                    html.push("<div class=\"nodeText\">", escapeHTML(node.nodeValue), "</div>");
                }
            }
        }
        function addEvent(object, name, handler) {
            if (document.all) {
                object.attachEvent("on" + name, handler);
            } else {
                object.addEventListener(name, handler, false);
            }
        }
        function removeEvent(object, name, handler) {
            if (document.all) {
                object.detachEvent("on" + name, handler);
            } else {
                object.removeEventListener(name, handler, false);
            }
        }
        function cancelEvent(event) {
            if (document.all) {
                event.cancelBubble = true;
            } else {
                event.stopPropagation();
            }
        }
        function onError(msg, href, lineNo) {
            var html = [];
            var lastSlash = href.lastIndexOf("/");
            var fileName = lastSlash == -1 ? href : href.substr(lastSlash + 1);
            html.push("<span class=\"errorMessage\">", msg, "</span>", "<div class=\"objectBox-sourceLink\">", fileName, " (line ", lineNo, ")</div>");
            logRow(html, "error");
        }
        function onKeyDown(event) {
            if (event.keyCode == 123) {
                toggleConsole();
            } else {
                if ((event.keyCode == 108 || event.keyCode == 76) && event.shiftKey && (event.metaKey || event.ctrlKey)) {
                    focusCommandLine();
                } else {
                    return;
                }
            }
            cancelEvent(event);
        }
        function onCommandLineKeyDown(event) {
            if (event.keyCode == 13) {
                evalCommandLine();
            } else {
                if (event.keyCode == 27) {
                    commandLine.value = "";
                }
            }
        }
    })();
}


if ((typeof ria) == "undefined") {
    ria = rialto;
}
if ((typeof ria.utils) == "undefined") {
    ria.utils = {};
}
ria.utils.event = {};
ria.utils.event.srcTarget = function (e) {
    if (e.srcElement) {
        return e.srcElement;
    } else {
        if (e.target) {
            return e.target;
        } else {
            return null;
        }
    }
};
ria.utils.event.isRightClick = function (e) {
    var rightClick;
    if (e.which) {
        rightClick = (e.which == 3);
    } else {
        if (e.button) {
            rightClick = (e.button == 2);
        }
    }
    if (rightClick) {
        return true;
    }
};
ria.utils.event.isLeftClick = function (e) {
    var leftClick;
    if (e.which) {
        leftClick = (e.which == 1);
    } else {
        if (e.button) {
            leftClick = ((e.button == 1) || (e.button == 0));
        }
    }
    if (leftClick) {
        return true;
    }
};
ria.utils.event.genericAddEvent = function (oHtml, e, handler, bindingObject) {
    var fct = handler;
    if (bindingObject) {
        fct = rialto.lang.link(bindingObject, handler);
    }
    if (oHtml.attachEvent) {
        oHtml.attachEvent("on" + e, fct);
    } else {
        oHtml.addEventListener(e, fct, false);
    }
    return fct;
};
ria.utils.event.genericRemoveEvent = function (oHtml, e, handler, bindingObject) {
    var fct = handler;
    if (bindingObject) {
        fct = rialto.lang.link(bindingObject, handler);
    }
    if (oHtml.detachEvent) {
        oHtml.detachEvent("on" + e, fct);
    } else {
        oHtml.removeEventListener(e, fct, false);
    }
};
stopEvent = ria.utils.event.stopEvent = function (e) {
    if (!e) {
        var e = window.event;
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};
stopDefault = ria.utils.event.stopDefault = function (e) {
    if (!e) {
        var e = window.event;
    }
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};
propageEvent = ria.utils.event.propageEvent = function (e) {
    if (!e) {
        var e = window.event;
    }
    if (!e.stopPropagation) {
        e.cancelBubble = false;
    }
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};
addHandler = ria.utils.event.addHandler = function (oHtml, typeEvt, handler, oThis) {
    if (!oHtml.tHandler) {
        oHtml.tHandler = new Array();
    }
    if (!oHtml.tHandler[typeEvt]) {
        oHtml.tHandler[typeEvt] = new Array();
    }
    oHtml.tHandler[typeEvt][oHtml.tHandler[typeEvt].length] = {fct:handler, oThis:oThis};
    var fct = "{";
    for (var i = 0; i < oHtml.tHandler[typeEvt].length; i++) {
        if (oHtml.tHandler[typeEvt][i].oThis) {
            fct += oHtml.tHandler[typeEvt][i].fct + "(e,this);";
        } else {
            fct += "this." + oHtml.tHandler[typeEvt][i].fct + "(e);";
        }
    }
    fct += "}";
    oHtml[typeEvt] = new Function("e", fct);
};
DirDeplact = ria.utils.event.DirDeplact = function (oHtml, e, height, width, margeSens, exclusionMarge, specOrientation) {
    var limOrientation = specOrientation || oHtml.dirRS;
    margeSens = margeSens || 0;
    var dir = "";
    var xy = _rum.$eventTopLeftInDiv(e);
    var xPRC = xy.left;
    var yPRC = xy.top;
    if (exclusionMarge) {
        if ((margeSens != 0) && ((xPRC < margeSens) || (xPRC > (width - margeSens)) || (yPRC < margeSens) || (yPRC > (height - margeSens)))) {
            dir = "";
        } else {
            if (limOrientation == "h") {
                dir = "w";
            } else {
                if (limOrientation == "v") {
                    dir = "n";
                } else {
                    dir = "x";
                }
            }
        }
    } else {
        if (limOrientation != "h") {
            if (yPRC < margeSens) {
                dir = "n";
            } else {
                if (yPRC > (height - margeSens)) {
                    dir = "s";
                }
            }
        }
        if (limOrientation != "v") {
            if (xPRC < margeSens) {
                dir += "w";
            } else {
                if (xPRC > (width - margeSens)) {
                    dir += "e";
                }
            }
        }
        traceExec("(width - margeSens) = " + (width - margeSens), 58);
    }
    return dir;
};


rialto.widget.decoration = function (style, parent) {
    this.style = "";
    if (rialto.lang.isStringIn(style, ["popup", "simplewindow", "splitter", "calendar"])) {
        this.style = "_" + style;
    }
    this.id = this.style + "_decoration_" + (rialto.widget.AbstractComponent.prototype.nbreInstance++);
    var str = "<TABLE class=\"decoration_table" + this.style + "\" height=\"100%\" cellSpacing=0 cellPadding=0 width=\"100%\" border=0>";
    str += "<TBODY>";
    str += "<TR class='line1" + this.style + "'>";
    str += "<TD class='line1Cell1" + this.style + "'></TD>";
    str += "<TD colspan='3' class='line1Cell2" + this.style + "' ></TD>";
    str += "<TD class='line1Cell3" + this.style + "'></TD>";
    str += "</TR>";
    str += "<TR class='line2" + this.style + "'>";
    str += "<TD class='line2Cell1" + this.style + "'></TD>";
    str += "<TD colspan='3' class='line2Cell2" + this.style + "' >";
    str += "<TABLE  height=\"20\" cellSpacing=0 cellPadding=0 width=\"100%\" border=0>";
    str += "<TBODY>";
    str += "<TR>";
    str += "<TD id='" + this.id + "_DIVICONG'></TD>";
    str += "<TD colspan='3' id='" + this.id + "_DIVTITLE'></TD>";
    str += "<TD id='" + this.id + "_DIVICOND'></TD>";
    str += "</TR>";
    str += "</TBODY>";
    str += "</TABLE>";
    str += "</TD>";
    str += "<TD class='line2Cell3" + this.style + "'></TD>";
    str += "</TR>";
    str += "<TR class='line3" + this.style + "'>";
    str += "<TD class='line3Cell1" + this.style + "'></TD>";
    str += "<TD colspan='3' class='line3Cell2" + this.style + "' ></TD>";
    str += "<TD class='line3Cell3" + this.style + "'></TD>";
    str += "</TR>";
    str += "<TR class='line4" + this.style + "'>";
    str += "<TD class='line4Cell1" + this.style + "'></TD>";
    str += "<TD colspan='3' class='line4Cell2" + this.style + "' ></TD>";
    str += "<TD class='line4Cell3" + this.style + "'></TD>";
    str += "</TR>";
    str += "<TR class='line5" + this.style + "'>";
    str += "<TD class='line5Cell1" + this.style + "'></TD>";
    str += "<TD colspan='3' class='line5Cell2" + this.style + "' ></TD>";
    str += "<TD class='line5Cell3" + this.style + "'></TD>";
    str += "</TR>";
    str += "</TBODY>";
    str += "</TABLE>";
    this.tDecor = document.createElement("DIV");
    this.tDecor.innerHTML = str;
    var tableStyle = this.tDecor.style;
    tableStyle.top = 0;
    tableStyle.left = 0;
    tableStyle.width = "100%";
    tableStyle.height = "100%";
    tableStyle.position = "absolute";
    parent.appendChild(this.tDecor);
    this.DivIconG = document.getElementById(this.id + "_DIVICONG");
    if (this.DivIconG) {
        this.DivIconG.className = "iconG" + this.style;
    }
    this.DivIconD = document.getElementById(this.id + "_DIVICOND");
    if (this.DivIconD) {
        this.DivIconD.className = "iconD" + this.style;
    }
    this.DivTitle = document.getElementById(this.id + "_DIVTITLE");
    if (this.DivTitle) {
        this.DivTitle.className = "title" + this.style;
    }
};


$$fx = window.getComputedStyle ? true : false;
if ((typeof ria) == "undefined") {
    ria = rialto;
}
if ((typeof ria.utils) == "undefined") {
    ria.utils = {};
}
ria.utils.measures = {};
ria.utils.measures.$setSizeWithAllAvailable = function (oHtml) {
    var borH = _rum.$$getBorderTopWidth(oHtml) + _rum.$$getBorderBottomWidth(oHtml);
    var borW = _rum.$$getBorderLeftWidth(oHtml) + _rum.$$getBorderRightWidth(oHtml);
    oHtml.style.height = oHtml.parentNode.offsetHeight - oHtml.offsetTop - borH;
    oHtml.style.width = oHtml.parentNode.offsetWidth - oHtml.offsetLeft - borW;
    ria.utils.measures.$setSizeConformW3C(oHtml);
};
ria.utils.measures.$getHeight = function (oHtml, bBorderLess, bNotAlreadyInDoct) {
    if (bNotAlreadyInDoct) {
        alert("not yet implemented");
    } else {
        return ria.utils.measures.$$getHeightInDoct(oHtml, bBorderLess);
    }
};
ria.utils.measures.$$getHeightInDoct = function (oHtml, bBorderLess) {
    var wH;
    if (oHtml.nodeName == "BODY") {
        wH = document.body.clientHeight;
    } else {
        wH = (oHtml.offsetHeight || parseInt(oHtml.style.height));
    }
    var b = 0;
    if (bBorderLess) {
        b -= ria.utils.measures.$$getBorderTopWidth(oHtml);
        b -= ria.utils.measures.$$getBorderBottomWidth(oHtml);
    }
    return (wH + b);
};
ria.utils.measures.$$getBorderTopWidth = function (oHtml) {
    if (!oHtml) {
        return 0;
    }
    if ((oHtml.nodeName == "BODY") || (oHtml.nodeName == "#document")) {
        return 0;
    }
    var topEdge = 0;
    if (!window.getComputedStyle) {
        if (((oHtml.style) && (oHtml.style.borderTopStyle != "none") && (oHtml.style.borderTopStyle != "")) || (oHtml.currentStyle && (oHtml.currentStyle.borderTopStyle != "none") && (oHtml.currentStyle.borderTopStyle != ""))) {
            topEdge = parseInt(oHtml.style.borderTopWidth) || parseInt(oHtml.currentStyle.borderTopWidth);
        }
    } else {
        if ((window.getComputedStyle(oHtml, null).getPropertyValue("border-top-style") != "none") && (window.getComputedStyle(oHtml, null).getPropertyValue("border-top-style") != "")) {
            if (window.getComputedStyle(oHtml, null).getPropertyValue("border-top-width")) {
                topEdge = parseInt(window.getComputedStyle(oHtml, null).getPropertyValue("border-top-width"));
            }
        }
    }
    return topEdge;
};
ria.utils.measures.$$getBorderBottomWidth = function (oHtml) {
    if (!oHtml) {
        return 0;
    }
    if ((oHtml.nodeName == "BODY") || (oHtml.nodeName == "#document")) {
        return 0;
    }
    var bottomEdge = 0;
    if (!window.getComputedStyle) {
        if (((oHtml.style) && (oHtml.style.borderBottomStyle != "none") && (oHtml.style.borderBottomStyle != "")) || (oHtml.currentStyle && (oHtml.currentStyle.borderBottomStyle != "none") && (oHtml.currentStyle.borderBottomStyle != ""))) {
            bottomEdge = parseInt(oHtml.style.borderBottomWidth) || parseInt(oHtml.currentStyle.borderBottomWidth);
        }
    } else {
        if ((window.getComputedStyle(oHtml, null).getPropertyValue("border-bottom-style") != "none") && (window.getComputedStyle(oHtml, null).getPropertyValue("border-bottom-style") != "")) {
            if (window.getComputedStyle(oHtml, null).getPropertyValue("border-bottom-width")) {
                bottomEdge = parseInt(window.getComputedStyle(oHtml, null).getPropertyValue("border-bottom-width"));
            }
        }
    }
    return bottomEdge;
};
ria.utils.measures.$$getBorderRightWidth = function (oHtml) {
    if (!oHtml) {
        return 0;
    }
    if ((oHtml.nodeName == "BODY") || (oHtml.nodeName == "#document")) {
        return 0;
    }
    var rightEdge = 0;
    if (!window.getComputedStyle) {
        if (((oHtml.style) && (oHtml.style.borderRightStyle != "none") && (oHtml.style.borderRightStyle != "")) || (oHtml.currentStyle && (oHtml.currentStyle.borderRightStyle != "none") && (oHtml.currentStyle.borderRightStyle != ""))) {
            rightEdge = parseInt(oHtml.style.borderRightWidth) || parseInt(oHtml.currentStyle.borderRightWidth);
        }
    } else {
        if ((window.getComputedStyle(oHtml, null).getPropertyValue("border-right-style") != "none") && (window.getComputedStyle(oHtml, null).getPropertyValue("border-right-style") != "")) {
            if (window.getComputedStyle(oHtml, null).getPropertyValue("border-right-width")) {
                rightEdge = parseInt(window.getComputedStyle(oHtml, null).getPropertyValue("border-right-width"));
            }
        }
    }
    return rightEdge;
};
ria.utils.measures.$$getBorderLeftWidth = function (oHtml) {
    if (!oHtml) {
        return 0;
    }
    if ((oHtml.nodeName == "BODY") || (oHtml.nodeName == "#document")) {
        return 0;
    }
    var leftEdge = 0;
    if (!window.getComputedStyle) {
        if (((oHtml.style) && (oHtml.style.borderLeftStyle != "none") && (oHtml.style.borderLeftStyle != "")) || (oHtml.currentStyle && (oHtml.currentStyle.borderLeftStyle != "none") && (oHtml.currentStyle.borderLeftStyle != ""))) {
            leftEdge = parseInt(oHtml.style.borderLeftWidth) || parseInt(oHtml.currentStyle.borderLeftWidth);
        }
    } else {
        if ((window.getComputedStyle(oHtml, null).getPropertyValue("border-left-style") != "none") && (window.getComputedStyle(oHtml, null).getPropertyValue("border-left-style") != "")) {
            if (window.getComputedStyle(oHtml, null).getPropertyValue("border-left-width")) {
                leftEdge = parseInt(window.getComputedStyle(oHtml, null).getPropertyValue("border-left-width"));
            }
        }
    }
    return leftEdge;
};
ria.utils.measures.$setHeightConformW3C = function (oHtml, oHtmlRef) {
    if (oHtmlRef) {
        if (window.getComputedStyle) {
            oHtml.style.height = _rum.$getHeight(oHtmlRef);
            -_rum.$$getBorderTopWidth(oHtml) - _rum.$$getBorderBottomWidth(oHtml);
        } else {
            oHtml.style.height = _rum.$getHeight(oHtmlRef);
        }
    }
    if (!window.getComputedStyle) {
        oHtml.style.height = _rum.$getHeight(oHtml) + ria.utils.measures.$$getBorderTopWidth(oHtml) + ria.utils.measures.$$getBorderBottomWidth(oHtml);
    }
    return (parseInt(oHtml.style.height));
};
ria.utils.measures.$setWidthConformW3C = function (oHtml, oHtmlRef) {
    if (oHtmlRef) {
        if (window.getComputedStyle) {
            oHtml.style.width = _rum.$getWidth(oHtmlRef) - _rum.$$getBorderLeftWidth(oHtml) - _rum.$$getBorderRightWidth(oHtml);
        } else {
            oHtml.style.width = _rum.$getWidth(oHtmlRef);
        }
    }
    if (!window.getComputedStyle) {
        oHtml.style.width = _rum.$getWidth(oHtml) + ria.utils.measures.$$getBorderLeftWidth(oHtml) + ria.utils.measures.$$getBorderRightWidth(oHtml);
    }
    return (parseInt(oHtml.style.width));
};
ria.utils.measures.$setSizeConformW3C = function (oHtml, oHtmlRef) {
    ria.utils.measures.$setHeightConformW3C(oHtml, oHtmlRef);
    ria.utils.measures.$setWidthConformW3C(oHtml, oHtmlRef);
};
ria.utils.measures.$getWidth = function (oHtml, bBorderLess, bNotAlreadyInDoct) {
    if (bNotAlreadyInDoct) {
        alert("not yet implemented, impossible with IE ?");
    } else {
        return ria.utils.measures.$$getWidthInDoct(oHtml, bBorderLess);
    }
};
ria.utils.measures.$$getWidthInDoct = function (oHtml, bBorderLess) {
    var wW;
    if (oHtml.nodeName == "BODY") {
        wW = document.body.clientWidth;
    } else {
        wW = (oHtml.offsetWidth || parseInt(oHtml.style.width));
    }
    var b = 0;
    if (bBorderLess) {
        b -= ria.utils.measures.$$getBorderLeftWidth(oHtml);
        b -= ria.utils.measures.$$getBorderRightWidth(oHtml);
    }
    return (wW + b);
};
ria.utils.measures.$getStyle = function (oHtml, style) {
    var s;
    if (window.getComputedStyle) {
        s = window.getComputedStyle(oHtml, null)[style];
    } else {
        s = oHtml.style[style] || oHtml.currentStyle[style];
    }
    return s;
};
ria.utils.measures.$centerW = function (oHtml) {
    Pw = oHtml.parentNode.offsetWidth / 2;
    Ow = oHtml.offsetWidth / 2;
    oHtml.style.left = (Pw - Ow) + "px";
};
ria.utils.measures.$divInternalTopLeftInViewPort = ria.utils.measures.$internalPosInViewPort = function (oHtml) {
    var topLeftExtern = ria.utils.measures.$posInViewPort(oHtml);
    return {top:(topLeftExtern.top + _rum.$$getBorderTopWidth(oHtml)), left:(topLeftExtern.left + _rum.$$getBorderLeftWidth(oHtml))};
};
ria.utils.measures.$offsetTop = function (oHtml) {
    var wOffset;
    if (rialtoConfig.userAgentIsGecko && (oHtml.parentNode.nodeName != "BODY") && (oHtml.parentNode.nodeName != "#document")) {
        var parentEdgeWidth;
        if ((window.getComputedStyle(oHtml.parentNode, null).getPropertyValue("overflow") == "hidden") && ((parentEdgeWidth = ria.utils.measures.$$getBorderLeftWidth(oHtml.parentNode)) > 0)) {
            wOffset = oHtml.offsetTop + parentEdgeWidth;
        } else {
            wOffset = oHtml.offsetTop;
        }
    } else {
        wOffset = oHtml.offsetTop;
    }
    return wOffset;
};
ria.utils.measures.$offsetLeft = function (oHtml) {
    var wOffset;
    if (rialtoConfig.userAgentIsGecko && (oHtml.parentNode.nodeName != "BODY") && (oHtml.parentNode.nodeName != "#document")) {
        var parentEdgeWidth;
        if ((window.getComputedStyle(oHtml.parentNode, null).getPropertyValue("overflow") == "hidden") && ((parentEdgeWidth = ria.utils.measures.$$getBorderLeftWidth(oHtml.parentNode)) > 0)) {
            wOffset = oHtml.offsetLeft + parentEdgeWidth;
        } else {
            wOffset = oHtml.offsetLeft;
        }
    } else {
        wOffset = oHtml.offsetLeft;
    }
    return wOffset;
};
ria.utils.measures.$divTopLeftInViewPort = ria.utils.measures.$posInViewPort = function (oHtml) {
    traceExec("---- $divTopLeftInViewPort begin", 77);
    var x = y = 0;
    traceExec("oHtml.style.top = " + oHtml.style.top + " oHtml.offsetTop= " + oHtml.offsetTop, 77);
    while (oHtml && (oHtml.nodeName != "BODY") && (oHtml.nodeName != "#document")) {
        traceExec("y = " + y + "ria.utils.measures.$offsetTop(oHtml) = " + ria.utils.measures.$offsetTop(oHtml) + "ria.utils.measures.$$getBorderTopWidth(oHtml.parentNode)= " + ria.utils.measures.$$getBorderTopWidth(oHtml.parentNode) + " oHtml.scrollTop= " + oHtml.scrollTop, 77);
        x = x + ria.utils.measures.$offsetLeft(oHtml) + ria.utils.measures.$$getBorderLeftWidth(oHtml.parentNode) - oHtml.scrollLeft;
        y = y + ria.utils.measures.$offsetTop(oHtml) + ria.utils.measures.$$getBorderTopWidth(oHtml.parentNode) - oHtml.scrollTop;
        oHtml = oHtml.offsetParent;
    }
    traceExec("--- $divTopLeftInViewPort end", 77);
    return {left:x, top:y};
};
ria.utils.measures.$divTopLeftInDiv = function (oHtml) {
    var x = y = 0;
    x = ria.utils.measures.$offsetLeft(oHtml) + ria.utils.measures.$$getBorderLeftWidth(oHtml.parentNode);
    y = ria.utils.measures.$offsetTop(oHtml) + ria.utils.measures.$$getBorderTopWidth(oHtml.parentNode);
    return {left:x, top:y};
};
ria.utils.measures.$eventTopLeftInViewPort = function (e) {
    if (!e) {
        var e = window.event;
    }
    return {top:e.clientY, left:e.clientX};
};
ria.utils.measures.$eventTopLeftInDiv = ria.utils.measures.$offsetPosInDiv = function (e) {
    var oHtmlSource = (e.target ? e.target : e.srcElement);
    var left;
    if (e.offsetX != undefined) {
        left = e.offsetX + ria.utils.measures.$$getBorderLeftWidth(oHtmlSource);
    } else {
        left = e.layerX;
    }
    var top;
    if (e.offsetY != undefined) {
        top = e.offsetY + ria.utils.measures.$$getBorderTopWidth(oHtmlSource);
    } else {
        top = e.layerY;
    }
    return {top:top, left:left};
};
ria.utils.$placeInViewPort = function (oHtml, basePointSpecs, shift) {
    var top = (basePointSpecs.top != undefined) ? basePointSpecs.top : basePointSpecs.clientY;
    var left = (basePointSpecs.left != undefined) ? basePointSpecs.left : basePointSpecs.clientX;
    var heightAvailable = -1;
    var rightSpace = document.body.clientWidth - left;
    var bottomSpace = document.body.clientHeight - top;
    if (rightSpace < oHtml.offsetWidth) {
        oHtml.style.left = document.body.scrollLeft + left - oHtml.offsetWidth;
    } else {
        oHtml.style.left = document.body.scrollLeft + left;
    }
    if (oHtml.offsetHeight > bottomSpace) {
        if (oHtml.offsetHeight < (top - 3 - (shift || 0))) {
            oHtml.style.top = document.body.scrollTop + top - oHtml.offsetHeight - 3 - (shift || 0);
        } else {
            if (top > bottomSpace) {
                heightAvailable = top - 9 - (shift || 0);
                oHtml.style.top = 3;
            } else {
                heightAvailable = bottomSpace - 3;
                oHtml.style.top = document.body.scrollTop + top;
            }
        }
    } else {
        oHtml.style.top = document.body.scrollTop + top;
    }
    return heightAvailable;
};
_r = ria;
_ru = ria.utils;
_rum = ria.utils.measures;


function getTailleTexte(wText, className) {
    var div = document.createElement("DIV");
    div.innerHTML = wText;
    div.className = className;
    div.style.position = "absolute";
    div.style.top = 150;
    div.style.left = 150;
    div.style.width = "auto";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "nowrap";
    document.body.appendChild(div);
    width = div.offsetWidth + 0;
    document.body.removeChild(div);
    div = null;
    return width;
}
function positionneSelonEvent(eltApos, e) {
    var droite = document.body.clientWidth - e.clientX;
    var bas = document.body.clientHeight - e.clientY;
    if (droite < eltApos.offsetWidth) {
        eltApos.style.left = document.body.scrollLeft + e.clientX - eltApos.offsetWidth;
    } else {
        eltApos.style.left = document.body.scrollLeft + e.clientX;
    }
    if (bas < eltApos.offsetHeight) {
        eltApos.style.top = document.body.scrollTop + e.clientY - eltApos.offsetHeight;
    } else {
        eltApos.style.top = document.body.scrollTop + e.clientY;
    }
}
function positionneSelonPosFournie(eltApos, top, left, height) {
    var heightAvailable = -1;
    var droite = document.body.clientWidth - left;
    var bas = document.body.clientHeight - top;
    if (droite < eltApos.offsetWidth) {
        eltApos.style.left = document.body.scrollLeft + left - eltApos.offsetWidth;
    } else {
        eltApos.style.left = document.body.scrollLeft + left;
    }
    traceExec("top= " + top + " bas= " + bas + " eltApos.offsetHeight= " + eltApos.offsetHeight, 1);
    if (eltApos.offsetHeight > bas) {
        if (eltApos.offsetHeight < top) {
            eltApos.style.top = document.body.scrollTop + top - eltApos.offsetHeight - 3 - (height || 0);
        } else {
            if (top > bas) {
                heightAvailable = top - 9 - (height || 0);
                eltApos.style.top = 3;
            } else {
                heightAvailable = bas - 3;
                eltApos.style.top = document.body.scrollTop + top;
            }
        }
    } else {
        eltApos.style.top = document.body.scrollTop + top;
    }
    return heightAvailable;
}
pixWidth = function (oHtml, sansBordure) {
    if (oHtml.pixWidth) {
        return oHtml.pixWidth();
    }
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    var nivRemontee = 0;
    do {
        if (nd.nodeName == "BODY") {
            return (prc * parseInt(document.body.clientWidth));
        }
        var ndstyle = nd.currentStyle ? nd.currentStyle : nd.style;
        var taille = ndstyle.width;
        if (taille == "auto") {
            i = 1;
            taille = 100;
        } else {
            i = ndstyle.width.indexOf("%");
        }
        if (i == -1) {
            percent = false;
        } else {
            prc = prc * parseInt(taille) / 100;
            nivRemontee += 1;
        }
    } while (percent && (nd = nd.parentNode));
    if ((nivRemontee > 0) && (ndstyle.borderStyle != "none") && (ndstyle.borderStyle != "")) {
        tailleBord = parseInt(ndstyle.borderWidth);
    } else {
        tailleBord = 0;
    }
    if (sansBordure) {
        if (parseInt(oHtml.style.borderWidth)) {
            tailleBord += parseInt(oHtml.style.borderWidth);
        }
    }
    return (prc * (parseInt(taille) - tailleBord * 2));
};
pixHeight = function (oHtml, sansBordure) {
    traceExec("pixHeight entree sansBordure= " + sansBordure, 20);
    if (sansBordure && (!window.getComputedStyle)) {
        sansBordure = true;
    } else {
        sansBordure = false;
    }
    traceExec("pixHeightsansBordure= " + sansBordure, 20);
    var taille, tailleBord = 0;
    var prc = 1;
    if (!oHtml) {
        alert("ds pixHeight argt  oHtml undef");
    }
    if (oHtml.pixHeight) {
        traceExec("pixHeight utilisation de la fct surcharg?e pour oHtml.id= " + oHtml.id, 20);
        taille = oHtml.pixHeight();
    } else {
        var nd = oHtml;
        var percent = true;
        var nivRemontee = 0;
        do {
            if (nd.nodeName == "BODY") {
                taille = document.body.clientHeight;
                percent = false;
                traceExec("pixHeight  body sortie", 1);
            } else {
                traceExec("pixHeight nd.id=" + nd.id + " taille= " + getComputStyleStr(nd, "height"), 20);
                var taille = getComputStyleStr(nd, "height");
                if (taille == "auto") {
                    i = 1;
                    taille = 100;
                } else {
                    i = taille.indexOf("%");
                }
                if (i == -1) {
                    percent = false;
                } else {
                    prc = prc * parseInt(taille) / 100;
                    nivRemontee += 1;
                    traceExec("nivRemontee = " + nivRemontee, 20);
                }
                if (sansBordure) {
                    tailleBord += getBorderWidth(nd);
                }
            }
        } while (percent && (nd = nd.parentNode));
    }
    traceExec("pixHeight nivRemontee= " + nivRemontee + " prc= " + prc + " taille= " + taille + " tailleBord= " + tailleBord, 20);
    traceExec("pixHeight sortie", 20);
    return (prc * (parseInt(taille) - tailleBord * 2));
};
compOffsetParent = function (oHtml) {
    var offsetTop = 0;
    while (oHtml) {
        offsetTop += oHtml.offsetTop;
        oHtml = oHtml.offsetParent;
    }
    return offsetTop;
};
compOffsetTop = function (oHtml) {
    var offsetTop = 0;
    var scrollTop = 0;
    var initOhtml = oHtml;
//maskat start
    offsetTop -= document.body.scrollTop;
//maskat end
    while (oHtml) {
        offsetTop += oHtml.offsetTop;
        oHtml = oHtml.offsetParent;
    }
    oHtml = initOhtml;
    while (oHtml != document.body) {
        scrollTop += oHtml.scrollTop;
        oHtml = oHtml.parentNode;
    }
    return offsetTop - scrollTop;
};
compOffsetLeft = function (oHtml) {
    var offsetLeft = 0;
    var scrollLeft = 0;
    var initOhtml = oHtml;
    while (oHtml) {
        offsetLeft += oHtml.offsetLeft;
        oHtml = oHtml.offsetParent;
    }
    oHtml = initOhtml;
    while (oHtml != document.body) {
        scrollLeft += oHtml.scrollLeft;
        oHtml = oHtml.parentNode;
    }
    return offsetLeft - scrollLeft;
};
compOffsetHeight = function (oHtml) {
    var offsetHeight = 0;
    while (oHtml) {
        offsetHeight += oHtml.offsetHeight;
        oHtml = oHtml.offsetParent;
    }
    return offsetHeight;
};
pixTop = function (oHtml) {
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    var i;
    i = nd.style.top.indexOf("%");
    if (i == -1) {
        percent = false;
    } else {
        prc = prc * parseInt(nd.style.top) / 100;
    }
    return ((prc == 1) ? (parseInt(nd.style.top) || 0) : (prc * pixHeight(nd)));
};
pixLeft = function (oHtml) {
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    i = nd.style.left.indexOf("%");
    if (i == -1) {
        percent = false;
    } else {
        prc = prc * parseInt(nd.style.left) / 100;
    }
    return ((prc == 1) ? (parseInt(nd.style.left) || 0) : (prc * pixWidth(nd)));
};
nvPixLeft = function (oHtml) {
    var prc;
    i = oHtml.style.left.indexOf("%");
    if (i == -1) {
        prc = 1;
    } else {
        prc = parseInt(oHtml.style.left) / 100;
    }
    return ((prc == 1) ? (parseInt(oHtml.style.left) || 0) : (prc * pixWidth(oHtml.parentNode)));
};
oldpixTop = function (oHtml) {
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    var i;
    do {
        i = nd.style.top.indexOf("%");
        if (i == -1) {
            percent = false;
        } else {
            prc = prc * parseInt(nd.style.top) / 100;
        }
    } while (percent && (nd = nd.parentNode));
    return ((prc == 1) ? (parseInt(nd.style.top) || 0) : (prc * parseInt(nd.style.height)));
};
oldpixLeft = function (oHtml) {
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    do {
        i = nd.style.left.indexOf("%");
        if (i == -1) {
            percent = false;
        } else {
            prc = prc * parseInt(nd.style.left) / 100;
        }
    } while (percent && (nd = nd.parentNode));
    return ((prc == 1) ? (parseInt(nd.style.left) || 0) : (prc * parseInt(nd.style.width)));
};


rialto.widget.objFenData = function (width, height, divData, titre) {
    var oThis = this;
    var widthGlobal = document.body.clientWidth;
    var heightGlobal = document.body.clientHeight;
    var top = (heightGlobal / 2) - 120;
    var left = (widthGlobal / 2) - 100;
    this.fen = new rialto.widget.PopUp("fen", top, left, width, height, "", titre, "transparent");
    this.divData = divData;
    this.divData.className = "libNormal";
    this.divData.style.width = width - 25;
    this.divData.style.height = height - 35;
    this.divData.style.border = "1px outset white";
    this.divData.style.position = "absolute";
    this.divData.style.overflow = "auto";
    this.divData.style.top = 5;
    this.fen.add(this.divData);
    this.fen.onClose = function () {
        oThis.onclose();
    };
    var wBtn = parseInt(width) / 2 - 50;
    var hBtn = height - 25;
    this.BQUIT = new rialto.widget.Button(hBtn, wBtn, rialto.I18N.getLabel("lanCloseButtonText"), rialto.I18N.getLabel("lanCloseWindow"));
    this.BQUIT.onclick = function () {
        oThis.onclose();
        this.fen.closeWindow();
    };
    this.BQUIT.fen = this.fen;
    this.fen.add(this.BQUIT);
};
rialto.widget.objFenData.prototype.onclose = function () {
};
rialto.widget.Alert = function (mess) {
    this.message = mess;
    var oThis = this;
    var widthGlobal = document.body.clientWidth;
    var heightGlobal = document.body.clientHeight;
    var top = (heightGlobal / 2) - 120;
    var left = (widthGlobal / 2) - 100;
    this.width = getTailleTexte(mess) + 40;
    if (this.width < 200) {
        this.width = 200;
    }
    this.fen = new rialto.widget.PopUp("fen", top, left, this.width, 50, this.message, "Information", "inherit");
    var wBtn = parseInt(this.width) / 2 - 57;
    var hBtn = 25;
    this.BQUIT = new rialto.widget.Button(hBtn, wBtn, rialto.I18N.getLabel("lanCloseButtonText"), rialto.I18N.getLabel("lanCloseWindow"));
    this.BQUIT.onclick = function () {
        oThis.onclose();
        oThis.fen.closeWindow();
    };
    this.BQUIT.fen = this.fen;
    this.fen.add(this.BQUIT);
};
rialto.widget.Alert.prototype.onclose = function () {
};
rialto.widget.Alert.prototype.getHtmlExt = function () {
    return this.fen.getHtmlExt();
};
rialto.widget.Alert.prototype.placeIn = function (par) {
    this.fen.placeIn(par);
};
rialto.widget.Alert.prototype.isContainer = false;
rialto.widget.Alert.prototype.setTop = function (top) {
    this.fen.setTop(top);
    this.top = top;
};
rialto.widget.Alert.prototype.setLeft = function (left) {
    this.fen.setLeft(left);
    this.left = left;
};
rialto.widget.Alert.prototype.setMessage = function (mess) {
    this.message = mess;
    var fenCont = this.fen.divCont;
    fenCont.removeChild(fenCont.firstChild);
    fenCont.appendChild(document.createTextNode(this.message));
};
rialto.widget.Alert.prototype.addText = function (text) {
    var width = getTailleTexte(text) + 40;
    if (this.width < width) {
        this.fen.modWidth(width - this.width);
        this.width = width;
        var wBtn = parseInt(this.width) / 2 - 57;
        this.BQUIT.setLeft(wBtn);
    }
    var div = document.createElement("DIV");
    div.style.position = "relative";
    div.appendChild(document.createTextNode(text));
    this.fen.add(div);
    this.fen.modHeight(20);
    this.BQUIT.moveBy(20, 0);
};
rialto.widget.Alert.prototype.remove = function () {
    this.fen.remove();
    this.BQUIT.remove();
};
rialto.widget.WaitWindow = function (objPar) {
    this.canBeCancel = true;
    this.text = rialto.I18N.getLabel("lanWaitWindowDefaultText");
    if (objPar) {
        if (rialto.lang.isBoolean(objPar.canBeCancel)) {
            this.canBeCancel = objPar.canBeCancel;
        }
        if (rialto.lang.isString(objPar.text)) {
            this.text = objPar.text;
        }
    }
    var widthGlobal = document.body.clientWidth;
    var heightGlobal = document.body.clientHeight;
    var top = (heightGlobal / 2) - 60;
    var left = (widthGlobal / 2) - 100;
    this.fen = new rialto.widget.PopUp("fen", top, left, 200, 90, "", " ", "inherit", {withCloseButon:false});
    var divLib = document.createElement("DIV");
    divLib.className = "libelle2";
    divLib.style.position = "absolute";
    divLib.style.top = "5px";
    divLib.style.left = "65px";
    divLib.style.width = "100%";
    divLib.innerHTML = this.text;
    this.fen.add(divLib);
    var img = document.createElement("IMG");
    img.src = rialtoConfig.buildImageURL("images/sablier.gif");
    img.style.position = "absolute";
    img.style.height = "35px";
    img.style.width = "27px";
    img.style.left = "75px";
    img.style.top = "22px";
    this.fen.add(img);
    if (this.canBeCancel) {
        var oThis = this;
        this.BANN = new rialto.widget.Button(60, 50, rialto.I18N.getLabel("lanCancelButton"));
        this.BANN.onclick = function () {
            oThis.closeWindow();
            oThis.onclick();
        };
        this.fen.add(this.BANN);
    }
};
rialto.widget.WaitWindow.prototype.closeFen = function () {
    rialto.deprecated("rialto.widget.WaitWindow", "closeFen", "closeWindow");
};
rialto.widget.WaitWindow.prototype.closeWindow = function () {
    this.fen.closeWindow();
};
rialto.widget.WaitWindow.prototype.setVisible = function (visible) {
    this.fen.setVisible(visible);
};
rialto.widget.WaitWindow.prototype.onclick = function () {
    return true;
};


rialto.widget.TabFolder = function (objPar) {
    this.base = rialto.widget.AbstractContainer;
    objPar.type = "tabFolder";
    this.base(objPar);
    this.widthTabName = 100;
    this.autoResizeContenu = false;
    this.autoResizeParent = false;
    this.autoRedimTab = false;
    this.isClosable = true;
    this.draggableItem = true;
    this.orientation = "t";
    if (rialto.lang.isBoolean(objPar.autoResizeContenu)) {
        this.autoResizeContenu = objPar.autoResizeContenu;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeParent)) {
        this.autoResizeParent = objPar.autoResizeParent;
        this.autoResizableH = this.autoResizeParent;
    }
    if (rialto.lang.isBoolean(objPar.autoRedimTab)) {
        this.autoRedimTab = objPar.autoRedimTab;
    }
    if (rialto.lang.isBoolean(objPar.isClosable)) {
        this.isClosable = objPar.isClosable;
    }
    if (rialto.lang.isBoolean(objPar.draggableItem)) {
        this.draggableItem = objPar.draggableItem;
    }
    if (rialto.lang.isNumber(objPar.widthTabName)) {
        this.widthTabName = objPar.widthTabName;
    }
    if (rialto.lang.isStringIn(objPar.orientation, ["t", "l", "r", "b"])) {
        this.orientation = objPar.orientation;
        if (rialto.lang.isStringIn(this.orientation, ["r", "l"])) {
            this.draggableItem = false;
            this.autoRedimTab = true;
            this.isClosable = false;
        }
    }
    var oThis = this;
    if (this.height == "100%") {
        this.autoResizableH = true;
    }
    if (this.width == "100%") {
        this.autoResizableW = true;
    }
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.height = this.height;
    this.divExt.style.width = this.width;
    this.divExt.style.position = this.position;
    this.divExt.style.overflow = "hidden";
    var oThis = this;
    this.divOnglet = document.createElement("DIV");
    this.divOnglet.className = "tabTitleContent_" + this.orientation;
    this.divOnglet.id = "DIV_ONGLETS";
    this.divContenuGlobal = document.createElement("DIV");
    this.divContenuGlobal.id = "DIV_CONTENUGLOBAL";
    this.divContenuGlobal.className = "tabGlobalContent";
    if (this.orientation == "t") {
        this.divOnglet.style.width = "100%";
        this.divContenuGlobal.style.position = "relative";
    }
    if (this.orientation == "b") {
        this.divOnglet.style.width = "100%";
        this.divOnglet.style.position = "absolute";
        this.divContenuGlobal.style.left = 0;
        this.divContenuGlobal.style.top = 0;
    }
    if (this.orientation == "l") {
        this.divOnglet.style.height = "100%";
        this.divContenuGlobal.style.top = 0;
        this.divContenuGlobal.style.position = "absolute";
    }
    if (this.orientation == "r") {
        this.divOnglet.style.height = "100%";
        this.divOnglet.style.position = "absolute";
        this.divContenuGlobal.style.left = "0";
        this.divContenuGlobal.style.top = 0;
    }
    this.divExt.appendChild(this.divOnglet);
    this.divExt.appendChild(this.divContenuGlobal);
    this.arrTabItem = new Array();
    this.fenVisible = new Object;
    this.fenVisible.indDeb = 0;
    this.fenVisible.indFin = 0;
    this.fenVisible.tailleFen = 0;
    this.swapInProgress = false;
    if (objPar.parent) {
        this.placeIn(objPar.parent);
    }
    objPar = null;
    this.lefTitre = 0;
    this.divImg = document.createElement("DIV");
    this.divImg.className = "tab_imgArea_" + this.orientation;
    this.divImg.style.display = "none";
    this.divOnglet.appendChild(this.divImg);
    var ob = {position:"relative", boolFloatRight:true};
    if (this.isClosable) {
        this.btnClose = new rialto.widget.Image("crossCloseOff", -2, 3, this.divImg, rialto.I18N.getLabel("lanCloseTab"), "crossCloseOn", ob);
        this.btnClose.onclick = function () {
            oThis.removeTabItem(oThis.indActiveTab);
        };
    }
    if (!this.autoRedimTab) {
        var ob = {name:"MENU-ONGLET", className:"tab_list"};
        this.liste = new rialto.widget.simpleMenu(ob);
        var ob = {position:"relative", boolFloatRight:true};
        this.MC = new rialto.widget.Image("tabListOff", -8, 3, this.divImg, rialto.I18N.getLabel("lanAnotherTab"), "tabListOn", ob);
        this.MC.setVisible(false);
        this.MC.onclick = function (e) {
            var ev = e || window.event;
            oThis.displayMenu(ev);
        };
        ob = {position:"relative", boolFloatRight:true, imageDisabled:"rightArrowGroundlessOff"};
        this.next = new rialto.widget.Image("rightArrowOff", -11, 3, this.divImg, rialto.I18N.getLabel("lanGridButtonNext"), "rightArrowOn", ob);
        this.next.setVisible(false);
        this.next.onclick = function () {
            if (!oThis.swapInProgress) {
                oThis.moveOneTab(1);
            }
        };
        ob = {position:"relative", boolFloatRight:true, imageDisabled:"leftArrowGroundlessOff"};
        this.previous = new rialto.widget.Image("leftArrowOff", -14, 3, this.divImg, rialto.I18N.getLabel("lanGridButtonPrevious"), "leftArrowOn", ob);
        this.previous.setVisible(false);
        this.previous.onclick = function () {
            if (!oThis.swapInProgress) {
                oThis.moveOneTab(-1);
            }
        };
    }
};
rialto.widget.TabFolder.prototype = new rialto.widget.AbstractContainer;
rialto.widget.TabFolder.prototype.getHtmlCont = function () {
    return this.divContenuGlobal;
};
rialto.widget.TabFolder.prototype.adaptAfterSizeChange = function () {
    this.divContenuGlobal.style.height = this.divExt.offsetHeight - this.divContenuGlobal.offsetTop - 5 + "px";
    this.resizeChilds();
    this.redimTitreOnglet();
};
rialto.widget.TabFolder.prototype.adaptToContext = function () {
    if (this.orientation == "r" || this.orientation == "l") {
        this.$tabSize = getComputStyle(this.divOnglet, "width");
    } else {
        this.$tabSize = getComputStyle(this.divOnglet, "height");
    }
    if (this.orientation == "l") {
        this.divContenuGlobal.style.left = this.$tabSize;
    }
    if (this.autoResizableH) {
        this.divExt.style.height = this.getNewParentHeight() - this.divExt.offsetTop;
    }
    if (this.autoResizableW) {
        this.divExt.style.width = this.getNewParentWidth() - this.divExt.offsetLeft;
    }
    ria.utils.measures.$setSizeWithAllAvailable(this.divContenuGlobal);
    if (this.orientation == "r") {
        this.divContenuGlobal.style.width = parseInt(this.divContenuGlobal.style.width) - this.$tabSize;
        this.divOnglet.style.left = this.divContenuGlobal.offsetWidth;
    }
    if (this.orientation == "b") {
        this.divContenuGlobal.style.height = parseInt(this.divContenuGlobal.style.height) - this.$tabSize;
        this.divOnglet.style.top = this.divContenuGlobal.offsetHeight;
    }
};
rialto.widget.TabFolder.prototype.updateSize = function () {
    this.divContenuGlobal.style.overflow = "hidden";
    if (this.autoResizableH) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    this.divContenuGlobal.style.overflow = "auto";
};
rialto.widget.TabFolder.prototype.updateWidth = function () {
    if (this.visible == true) {
        if (this.autoResizableW) {
            var tailleCalc = parseInt(this.getNewParentWidth());
            this.divExt.style.width = tailleCalc - this.divExt.offsetLeft;
            this.resizeChilds(true, false);
        }
    }
};
rialto.widget.TabFolder.prototype.updateHeight = function () {
    if (this.visible == true) {
        if (this.autoResizableH) {
            var tailleCalc = parseInt(this.getNewParentHeight());
            this.divExt.style.height = tailleCalc - this.divExt.offsetTop;
            this.divContenuGlobal.style.height = tailleCalc - this.divContenuGlobal.offsetTop - 10 + "px";
            this.resizeChilds(false, true);
            this.redimTitreOnglet();
        }
    }
};
rialto.widget.TabFolder.prototype.moveOneTab = function (nbreTab) {
    if (nbreTab > 0) {
        this.ongAaug = this.arrTabItem[this.fenVisible.indFin + 1];
        this.ongAdim = this.arrTabItem[this.fenVisible.indDeb];
        indongADim = this.fenVisible.indDeb;
    } else {
        this.ongAaug = this.arrTabItem[this.fenVisible.indDeb - 1];
        this.ongAdim = this.arrTabItem[this.fenVisible.indFin];
        indongADim = this.fenVisible.indFin;
    }
    this.fenVisible.indDeb += nbreTab;
    this.fenVisible.indFin += nbreTab;
    this.ongAaug.setWidth(0);
    this.ongAaug.displayTitle();
    if (this.indActiveTab == indongADim) {
        this.activeTab(indongADim + nbreTab);
    }
    this.majImages();
    this.swapEffect();
};
rialto.widget.TabFolder.prototype.swapEffect = function (oldDelai) {
    this.swapInProgress = true;
    if (!oldDelai) {
        delai = 100;
    } else {
        delai = oldDelai / 10;
    }
    if (parseInt(this.ongAdim.titreOnglet.style.width) > 20) {
        this.ongAdim.changeWidth(-20);
        this.ongAaug.changeWidth(+20);
        this.time = window.setTimeout("rialto.session.objects['" + this.id + "'].swapEffect(" + delai + ");", delai);
    } else {
        this.ongAdim.setWidth(this.widthTabName);
        this.ongAdim.setVisible(false);
        this.ongAaug.setWidth(this.widthTabName);
        this.swapInProgress = false;
    }
};
rialto.widget.TabFolder.prototype.activeTabByName = function (tab) {
    var indTab = rialto.array.indexOf(this.arrTabItem, tab);
    if (indTab != -1) {
        this.activeTab(indTab);
    }
};
rialto.widget.TabFolder.prototype.activeTab = function (nOnglet) {
    if (this.arrTabItem.length < nOnglet) {
        alert("pas d'onglet n? " + nOnglet);
    } else {
        var onglet = this.arrTabItem[nOnglet];
        if (onglet.enable) {
            if (!this.autoRedimTab) {
                this.setTabVisible(nOnglet);
            }
            onglet.activeOnglet();
            this.indActiveTab = nOnglet;
        }
    }
};
rialto.widget.TabFolder.prototype.replaceAfterDD = function (tab, place, sens) {
    if (place == this.arrTabItem.length - 1) {
        this.divOnglet.appendChild(tab.titreOnglet);
    } else {
        if (sens) {
            placeInser = place + 1;
        } else {
            placeInser = place;
        }
        this.divOnglet.insertBefore(tab.titreOnglet, this.arrTabItem[placeInser].titreOnglet);
    }
    var oldPlace = rialto.array.indexOf(this.arrTabItem, tab);
    this.arrTabItem.splice(oldPlace, 1);
    rialto.array.insert(this.arrTabItem, place, tab);
    this.activeTab(place);
};
rialto.widget.TabFolder.prototype.addTabItem = function (titre, enable) {
    var onglet = new rialto.widget.TabItem(titre, this, enable);
    if (this.isClosable) {
        if (this.arrTabItem.length == 0) {
            this.divImg.style.display = "block";
        }
    }
    var ind = this.arrTabItem.push(onglet);
    this.divOnglet.appendChild(onglet.titreOnglet);
    onglet.placeIn(this.divContenuGlobal);
    ria.utils.measures.$setSizeWithAllAvailable(onglet.contenuOnglet);
    this.redimTitreOnglet(true);
    if (this.autoRedimTab) {
        onglet.setVisible(true);
        this.majImages();
    }
    var oThis = this;
    if (this.draggableItem) {
        rialto.widgetBehavior.affect(onglet.titreOnglet, "DragAndDrop", {oHtmlEvtTarget:onglet.div, ghost:{aspect:"rect"}, bSelectMark:false, bMUpAction:false, isWithLimitsDisplayed:false, movingLimits:{orientation:"h"}});
        onglet.titreOnglet.afterDD = function (dTop, dLeft) {
            var indInit = rialto.array.indexOf(oThis.arrTabItem, onglet);
            var decal = parseInt(dLeft / (oThis.widthTabName));
            var nvPlace = indInit + decal;
            if (nvPlace > oThis.fenVisible.indFin) {
                nvPlace = oThis.fenVisible.indFin;
            } else {
                if (nvPlace < 0) {
                    nvPlace = 0;
                }
            }
            oThis.replaceAfterDD(onglet, nvPlace, (decal > 0));
        };
        onglet.titreOnglet.afterClic = function () {
            oThis.activeTab(rialto.array.indexOf(oThis.arrTabItem, onglet));
        };
    } else {
        onglet.titreOnglet.onclick = function () {
            oThis.activeTab(rialto.array.indexOf(oThis.arrTabItem, onglet));
        };
    }
    this.activeTab(ind - 1);
    return onglet;
};
rialto.widget.TabFolder.prototype.isVisible = function (nOnglet) {
    return (nOnglet >= this.fenVisible.indDeb && nOnglet <= this.fenVisible.indFin);
};
rialto.widget.TabFolder.prototype.setTabVisible = function (nOnglet) {
    if (!this.isVisible(nOnglet)) {
        if (nOnglet < this.fenVisible.indDeb) {
            this.fenVisible.indDeb = nOnglet;
            this.fenVisible.indFin = this.fenVisible.indDeb + this.fenVisible.tailleFen - 1;
        } else {
            this.fenVisible.indFin = nOnglet;
            this.fenVisible.indDeb = this.fenVisible.indFin - this.fenVisible.tailleFen + 1;
        }
        this.majZoneVisible();
    }
};
rialto.widget.TabFolder.prototype.decalFenVisible = function (nbreTab) {
    this.fenVisible.indDeb += nbreTab;
    this.fenVisible.indFin = this.fenVisible.indDeb + this.fenVisible.tailleFen - 1;
    this.majZoneVisible();
    if (!this.isVisible(this.indActiveTab)) {
        this.activeTab(this.fenVisible.indDeb);
    }
};
rialto.widget.TabFolder.prototype.majZoneVisible = function (nOnglet) {
    for (var i = 0; i < this.arrTabItem.length; i++) {
        this.arrTabItem[i].setVisible(false);
    }
    for (var i = this.fenVisible.indDeb; i <= this.fenVisible.indFin; i++) {
        var onglet = this.arrTabItem[i];
        if (i == this.indActiveTab) {
            onglet.setVisible(true);
        } else {
            onglet.displayTitle();
        }
    }
    this.majImages();
};
rialto.widget.TabFolder.prototype.removeTabItem = function (nOnglet) {
    onglet = this.arrTabItem[nOnglet];
    onglet.onClose();
    rialto.array.remove(this.arrTabItem, onglet);
    onglet.remove();
    this.redimTitreOnglet();
    if (nOnglet == this.indActiveTab) {
        if (this.arrTabItem.length > 0) {
            this.activeTab(this.arrTabItem.length - 1);
        }
    } else {
        if (nOnglet < this.indActiveTab) {
            this.indActiveTab -= 1;
        }
    }
    if (this.isClosable) {
        if (this.arrTabItem.length == 0) {
            this.divImg.style.display = "none";
        }
    }
};
rialto.widget.TabFolder.prototype.redimTitreOnglet = function (bDisplayEnd) {
    var tailleTot = (this.arrTabItem.length) * this.widthTabName;
    if (this.autoRedimTab) {
        if (this.orientation == "t" || this.orientation == "b") {
            if (tailleTot > this.divOnglet.offsetWidth - 20) {
                taille = Math.floor((this.divOnglet.offsetWidth - 20) / this.arrTabItem.length);
                for (i = 0; i < this.arrTabItem.length; i++) {
                    this.arrTabItem[i].setWidth(Math.max(0, taille));
                }
            }
        } else {
            if (tailleTot > this.divOnglet.offsetHeight - 20) {
                taille = Math.floor((this.divOnglet.offsetHeight - 20) / this.arrTabItem.length);
                for (i = 0; i < this.arrTabItem.length; i++) {
                    this.arrTabItem[i].setHeight(Math.max(0, taille));
                }
            }
        }
    } else {
        if (tailleTot > this.divOnglet.offsetWidth - 75) {
            this.fenVisible.tailleFen = parseInt((this.divOnglet.offsetWidth - 75) / this.widthTabName);
        } else {
            this.fenVisible.tailleFen = this.arrTabItem.length;
        }
        if (bDisplayEnd) {
            this.fenVisible.indFin = this.arrTabItem.length - 1;
            this.fenVisible.indDeb = this.fenVisible.indFin - this.fenVisible.tailleFen + 1;
        } else {
            this.fenVisible.indDeb = 0;
            this.fenVisible.indFin = this.fenVisible.indDeb + this.fenVisible.tailleFen - 1;
        }
        this.majZoneVisible();
    }
};
rialto.widget.TabFolder.prototype.release = function (e, shift) {
    if (this.liste) {
        this.liste.remove();
    }
    if (this.divTirette) {
        rialto.widgetBehavior.desaffect(this.divTirette, "DragAndDrop");
    }
};
rialto.widget.TabFolder.prototype.displayMenu = function (e, shift) {
    var oThis = this;
    var width = 0;
    divVisible = document.createElement("DIV");
    divVisible.className = "tab_list_visibleArea";
    divVisible.style.height = parseInt(this.fenVisible.tailleFen) * 22;
    divVisible.style.top = this.fenVisible.indDeb * 23;
    this.divTirette = document.createElement("DIV");
    this.divTirette.className = "tab_tirette";
    divVisible.appendChild(this.divTirette);
    this.divTirette.style.top = ((this.fenVisible.tailleFen * 22) / 2) - 15;
    this.liste.clear();
    this.liste.add(divVisible);
    this.liste.onclick = function (item) {
        oThis.activeTab(item.ind);
    };
    this.liste.onOver = function (item) {
        oThis.divTirette.ind = item.ind;
    };
    for (var i = 0; i < this.arrTabItem.length; i++) {
        var objStyle = new Object;
        width = Math.max(width, getTailleTexte(this.arrTabItem[i].title));
        var obj = {text:this.arrTabItem[i].title, heigth:22, clOver:"tab_list_item_hilite", clOut:"tab_list_item"};
        if (this.isVisible(i)) {
            objStyle.fontWeight = "bold";
            if (i == this.indActiveTab) {
                objStyle.color = "#F7891E";
            }
        }
        if (!this.arrTabItem[i].enable) {
            objStyle.color = "#AAAAAA";
            objStyle.fontWeight = "normal";
            objStyle.fontStyle = "italic";
        }
        var item = this.liste.addItem(obj);
        item.setStyle(objStyle);
    }
    tailleBord = 0;
    if (!window.event) {
        tailleBord = 2;
    }
    this.liste.setWidth(width + 20 - tailleBord);
    divVisible.style.width = parseInt(width + 20 - tailleBord);
    this.divTirette.style.left = parseInt(divVisible.style.width) - tailleBord;
    rialto.widgetBehavior.affect(this.divTirette, "DragAndDrop", {oHtmlToMove:divVisible, bSelectMark:false, isWithLimitsDisplayed:false, movingLimits:{orientation:"v"}, magneticsGrid:{heightRow:23}});
    this.divTirette.afterDD = function (dTop, dLeft) {
        var decal = parseInt(dTop / 22);
        oThis.decalFenVisible(decal);
        oThis.liste.fermezoneMenu();
    };
    this.divTirette.afterClic = function () {
        oThis.liste.fermezoneMenu();
        oThis.activeTab(this.ind);
    };
    var ev = e || window.event;
    this.liste.affichezoneMenu(ev, shift);
};
rialto.widget.TabFolder.prototype.majImages = function () {
    if (!this.autoRedimTab) {
        if (this.fenVisible.tailleFen == this.arrTabItem.length) {
            if (!this.isClosable) {
                this.divImg.style.display = "none";
            } else {
                this.previous.setVisible(false);
                this.next.setVisible(false);
                this.MC.setVisible(false);
                this.divImg.style.width = 17;
            }
        } else {
            if (!this.isClosable) {
                this.divImg.style.width = 60;
                this.divImg.style.display = "block";
            } else {
                this.divImg.style.width = 70;
            }
            this.previous.setVisible(true);
            this.next.setVisible(true);
            this.MC.setVisible(true);
            if (this.fenVisible.indDeb == 0) {
                this.previous.setEnable(false);
            } else {
                this.previous.setEnable(true);
            }
            if (this.fenVisible.indFin == this.arrTabItem.length - 1) {
                this.next.setEnable(false);
            } else {
                this.next.setEnable(true);
            }
        }
    } else {
        if (!this.isClosable) {
            this.divImg.style.display = "none";
        } else {
            this.divImg.style.width = 17;
        }
    }
};
rialto.widget.TabItem = function (title, parentonglet, enable) {
    var objParam = new Object;
    this.base = rialto.widget.AbstractContainer;
    objParam.type = "tabitem";
    this.base(objParam);
    this.enable = enable != null ? enable : true;
    this.autoResizeParent = parentonglet.autoResizeParent;
    this.autoResizableH = true;
    this.autoResizableW = true;
    this.parentOnglet = parentonglet;
    this.orientation = this.parentOnglet.orientation;
    var oThis = this;
    this.title = title;
    this.titreOnglet = document.createElement("DIV");
    this.titreOnglet.title = title;
    this.titreOnglet.id = "DIV_ONGLET";
    this.titreOnglet.className = "tabTitleDivOn_" + this.orientation;
    this.img1 = document.createElement("DIV");
    this.img1.className = "leftEdgeTabOn_" + this.orientation;
    this.textDiv = document.createElement("DIV");
    this.textDiv.className = "tabTitleTextOn_" + this.orientation;
    this.textDiv.innerHTML = this.title;
    this.img2 = document.createElement("DIV");
    this.img2.className = "rightEdgeTabOn_" + this.orientation;
    this.titreOnglet.appendChild(this.img1);
    this.titreOnglet.appendChild(this.textDiv);
    this.titreOnglet.appendChild(this.img2);
    if (this.orientation == "t" || this.orientation == "b") {
        this.titreOnglet.style.width = this.parentOnglet.widthTabName + "px";
    } else {
        this.titreOnglet.style.height = this.parentOnglet.widthTabName + "px";
    }
    this.contenuOnglet = document.createElement("DIV");
    this.contenuOnglet.id = "tabItem_" + rialto.widget.TabItem.prototype.nbInstances++;
    this.contenuOnglet.className = "ContenuOnglet";
    this.setVisible(false);
    this.contenuOnglet.oCiu = this;
    this.contenuOnglet.onmousemove = function () {
        return true;
    };
    this.setEnable(this.enable);
};
rialto.widget.TabItem.prototype = new rialto.widget.AbstractContainer;
rialto.widget.TabItem.prototype.nbInstances = 0;
rialto.widget.TabItem.prototype.adaptToContext = function () {
    if (this.orientation == "r" || this.orientation == "l") {
        this.$imageSize = getComputStyle(this.img1, "height") + getComputStyle(this.img2, "height");
        this.textDiv.style.height = this.parentOnglet.widthTabName - this.$imageSize;
    } else {
        this.$imageSize = getComputStyle(this.img1, "width") + getComputStyle(this.img2, "width");
        this.textDiv.style.width = this.parentOnglet.widthTabName - this.$imageSize;
    }
};
rialto.widget.TabItem.prototype.setEnable = function (enable) {
    if (enable) {
        this.titreOnglet.className = "tabTitleDivOn_" + this.orientation;
    } else {
        this.titreOnglet.className = "tabTitleDivDisa_" + this.orientation;
    }
    this.enable = enable;
};
rialto.widget.TabItem.prototype.setVisible = function (visible) {
    if (visible) {
        this.titreOnglet.style.display = "block";
        this.contenuOnglet.style.display = "block";
    } else {
        this.titreOnglet.style.display = "none";
        this.contenuOnglet.style.display = "none";
    }
    this.visible = visible;
};
rialto.widget.TabItem.prototype.displayTitle = function () {
    this.titreOnglet.style.display = "block";
    this.visible = true;
};
rialto.widget.TabItem.prototype.changeWidth = function (delta) {
    if (delta == 0) {
        this.titreOnglet.style.width = 0;
    } else {
        this.titreOnglet.style.width = Math.max(0, parseInt(this.titreOnglet.style.width) + delta);
    }
};
rialto.widget.TabItem.prototype.setWidth = function (width) {
    this.titreOnglet.style.width = Math.max(0, width);
    this.textDiv.style.width = Math.max(0, width - this.$imageSize);
};
rialto.widget.TabItem.prototype.setHeight = function (height) {
    this.titreOnglet.style.height = Math.max(0, height);
    this.textDiv.style.height = Math.max(0, height - this.$imageSize);
};
rialto.widget.TabItem.prototype.updateSize = function () {
    this.contenuOnglet.style.overflow = "hidden";
    if (this.autoResizableH) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    this.contenuOnglet.style.overflow = "auto";
    this.onresize();
};
rialto.widget.TabItem.prototype.updateWidth = function () {
    if (this.visible) {
        var tailleCalc = parseInt(this.getNewParentWidth());
        this.contenuOnglet.style.width = tailleCalc;
        this.resizeChilds(true, false);
    }
};
rialto.widget.TabItem.prototype.updateHeight = function () {
    if (this.visible) {
        var tailleCalc = parseInt(this.getNewParentHeight());
        this.contenuOnglet.style.height = tailleCalc;
        this.resizeChilds(false, true);
    }
};
rialto.widget.TabItem.prototype.getHtmlExt = function () {
    return this.contenuOnglet;
};
rialto.widget.TabItem.prototype.getHtmlCont = function () {
    return this.contenuOnglet;
};
rialto.widget.TabItem.prototype.onClose = function () {
};
rialto.widget.TabItem.prototype.activeOnglet = function () {
    if (this.enable) {
        if (this.parentOnglet.currentActiveTab != this) {
            if (this.parentOnglet.currentActiveTab) {
                var oldOng = this.parentOnglet.currentActiveTab;
                oldOng.desactiveOnglet();
            }
            this.parentOnglet.currentActiveTab = this;
            this.img1.className = "leftEdgeTabOn_" + this.orientation;
            this.textDiv.className = "tabTitleTextOn_" + this.orientation;
            this.img2.className = "rightEdgeTabOn_" + this.orientation;
            this.titreOnglet.className = "tabTitleDivOn_" + this.orientation;
            this.contenuOnglet.style.display = "block";
            this.onEnableTab();
        }
    }
};
rialto.widget.TabItem.prototype.desactiveOnglet = function () {
    this.contenuOnglet.style.display = "none";
    this.img1.className = "leftEdgeTabOff_" + this.orientation;
    this.textDiv.className = "tabTitleTextOff_" + this.orientation;
    this.img2.className = "rightEdgeTabOff_" + this.orientation;
    this.titreOnglet.className = "tabTitleDivOff_" + this.orientation;
    if (this.parentOnglet.currentActiveTab == this) {
        this.parentOnglet.currentActiveTab = null;
    }
    this.onDisableTab();
};
rialto.widget.TabItem.prototype.release = function () {
    rialto.array.remove(this.parentOnglet.arrTabItem, this);
    if (this.parentOnglet.currentActiveTab == this) {
        this.parentOnglet.currentActiveTab = null;
    }
    this.titreOnglet.parentNode.removeChild(this.titreOnglet);
    if (this.titreOnglet.dragAnDrop) {
        rialto.widgetBehavior.desaffect(this.titreOnglet, "DragAndDrop");
    }
};
rialto.widget.TabItem.prototype.setName = function (name) {
    this.name = name;
};
rialto.widget.TabItem.prototype.setTitle = function (newtitle) {
    this.title = newtitle;
    this.textDiv.innerHTML = this.title;
};
rialto.widget.TabItem.prototype.onresize = function () {
};
rialto.widget.TabItem.prototype.onEnableTab = function () {
};
rialto.widget.TabItem.prototype.onDisableTab = function () {
};


rialto.widget.SimpleWindow = function (objPar) {
    this.base = rialto.widget.AbstractContainer;
    objPar.type = "SimpleWindow";
    this.base(objPar);
    this.icone = rialtoConfig.buildImageURL("images/imgFenSimple/picto-gr_default.gif");
    this.title = "Window";
    this.autoResizeParent = true;
    this.autoResizableH = true;
    this.autoResizableW = true;
    this.withCloseButon = true;
    if (rialto.lang.isString(objPar.title)) {
        this.title = objPar.title;
    }
    if (rialto.lang.isString(objPar.icone)) {
        this.icone = rialtoConfig.buildImageURL(objPar.icone);
    }
    if (rialto.widget.SimpleWindow.prototype.openWindow) {
        rialto.widget.SimpleWindow.prototype.openWindow.setVisible(false);
    }
    if (rialto.lang.isBoolean(objPar.withCloseButon)) {
        this.withCloseButon = objPar.withCloseButon;
    }
    this.divExt.style.top = this.top || "0";
    this.divExt.style.left = this.left || "0";
    this.divExt.style.position = this.position;
    this.divExt.style.width = "100%";
    this.divExt.style.height = "100%";
    this.divExt.style.overflow = "hidden";
    if (objPar.parent && !this.bWithoutPlaceIn) {
        this.placeIn(objPar.parent);
    }
    objPar = null;
};
rialto.widget.SimpleWindow.prototype = new rialto.widget.AbstractContainer;
rialto.widget.SimpleWindow.prototype.arrOpenWidow = new Array();
rialto.widget.SimpleWindow.prototype.openWindow = null;
rialto.widget.SimpleWindow.prototype.adaptToContext = function (parent) {
    this.divExt.style.height = this.getNewParentHeight();
    var oThis = this;
    var oParent = this.divExt;
    this.deco = new rialto.widget.decoration("simplewindow", oParent);
    this.DivIcone = this.deco.DivIconG;
    this.icoFen = new rialto.widget.Image(this.icone, 0, -5, this.DivIcone, "", "", {boolFloatLeft:true});
    this.divTitle = this.deco.DivTitle;
    this.divTitle.appendChild(document.createTextNode(this.title));
    this.contenuFenetre = document.createElement("DIV");
    this.divExt.appendChild(this.contenuFenetre);
    this.contenuFenetre.style.top = 50;
    this.contenuFenetre.style.left = 15;
    this.contenuFenetre.style.height = this.getNewParentHeight() - 65 + "px";
    this.contenuFenetre.style.width = this.getNewParentWidth() - 30 + "px";
    this.contenuFenetre.style.position = "absolute";
    this.contenuFenetre.style.overflow = "auto";
    if (this.withCloseButon) {
        this.btnClose = new rialto.widget.Image("btonFenFermOff", 0, -5, this.deco.DivIconD, rialto.I18N.getLabel("lanCloseWindow"), "btonFenFermOn", {boolFloatRight:true});
        this.btnClose.onclick = function () {
            oThis.closeWindow();
        };
    }
    rialto.widget.SimpleWindow.prototype.arrOpenWidow.push(this);
    this.activeFen();
};
rialto.widget.SimpleWindow.prototype.release = function () {
    if (this.withCloseButon) {
        this.btnClose.onclick = null;
    }
    if (rialto.widget.SimpleWindow.prototype.openWindow == this) {
        rialto.widget.SimpleWindow.prototype.openWindow = null;
    }
};
rialto.widget.SimpleWindow.prototype.getHtmlCont = function () {
    return this.contenuFenetre;
};
rialto.widget.SimpleWindow.prototype.updateSize = function () {
    this.contenuFenetre.style.overflow = "hidden";
    if (this.autoResizableH || this.autoResizeContenu) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    this.contenuFenetre.style.overflow = "auto";
};
rialto.widget.SimpleWindow.prototype.updateWidth = function () {
    this.contenuFenetre.style.overflow = "hidden";
    var tailleCalc = this.getNewParentWidth();
    this.divExt.style.width = tailleCalc;
    this.contenuFenetre.style.width = tailleCalc - 30;
    this.resizeChilds(true, false);
    this.contenuFenetre.style.overflow = "auto";
};
rialto.widget.SimpleWindow.prototype.updateHeight = function () {
    this.contenuFenetre.style.overflow = "hidden";
    var tailleCalc = parseInt(this.getNewParentHeight());
    this.divExt.style.height = tailleCalc;
    this.contenuFenetre.style.height = tailleCalc - 65;
    this.resizeChilds(false, true);
    this.contenuFenetre.style.overflow = "auto";
};
rialto.widget.SimpleWindow.prototype.closeFen = function () {
    rialto.deprecated("SimpleWindow", "closeFen", "closeWindow");
    this.closeWindow();
};
rialto.widget.SimpleWindow.prototype.closeWindow = function () {
    rialto.array.remove(rialto.widget.SimpleWindow.prototype.arrOpenWidow, this);
    if (rialto.widget.SimpleWindow.prototype.openWindow == this) {
        rialto.widget.SimpleWindow.prototype.openWindow = null;
    }
    this.onClose();
    this.remove();
    if (rialto.widget.SimpleWindow.prototype.arrOpenWidow.length > 0) {
        rialto.widget.SimpleWindow.prototype.arrOpenWidow[rialto.widget.SimpleWindow.prototype.arrOpenWidow.length - 1].activeFen();
    }
};
rialto.widget.SimpleWindow.prototype.activeFen = function () {
    if (rialto.widget.SimpleWindow.prototype.openWindow != this) {
        if (rialto.widget.SimpleWindow.prototype.openWindow) {
            rialto.widget.SimpleWindow.prototype.openWindow.setVisible(false);
        }
        this.divExt.style.display = "block";
        this.updateSize();
        rialto.widget.SimpleWindow.prototype.openWindow = this;
        this.$$activeContent();
        this.onfocus();
    }
};
rialto.widget.SimpleWindow.prototype.setVisible = function (visible) {
    var oHtml = this.getHtmlExt();
    if (visible) {
        rialto.widget.SimpleWindow.prototype.openWindow = this;
        oHtml.style.display = "block";
        this.updateSize();
    } else {
        rialto.widget.SimpleWindow.prototype.openWindow = null;
        oHtml.style.display = "none";
        this.onblur();
    }
    this.visible = visible;
};
rialto.widget.SimpleWindow.prototype.setTitle = function (newtitle) {
    this.divTitle.replaceChild(document.createTextNode(newtitle), this.divTitle.firstChild);
    this.onSetTitle(newtitle);
};
rialto.widget.SimpleWindow.prototype.onSetTitle = function (newtitle) {
};
rialto.widget.SimpleWindow.prototype.onClose = function () {
};


rialto.widget.Frame = function (objPar) {
    this.base = rialto.widget.AbstractContainer;
    objPar.type = "frame";
    this.base(objPar);
    this.title = "Frame";
    this.printTitle = this.title;
    this.dynamic = false;
    this.open = true;
    this.boolPrint = false;
    this.boolMaxi = false;
    this.autoResizeContenu = false;
    this.autoResizeParent = false;
    this.autoResizableH = false;
    this.autoResizableW = false;
    if ((rialto.lang.isBoolean(objPar.dynamic)) || (objPar.dynamic == "buttonLess")) {
        this.dynamic = objPar.dynamic;
    }
    if (rialto.lang.isBoolean(objPar.open)) {
        this.open = objPar.open;
    }
    if (rialto.lang.isString(objPar.title)) {
        this.title = objPar.title;
        this.titrePrint = this.title;
    }
    if (rialto.lang.isString(objPar.printTitle)) {
        this.printTitle = objPar.printTitle;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeContenu)) {
        this.autoResizeContenu = objPar.autoResizeContenu;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeParent)) {
        this.autoResizeParent = objPar.autoResizeParent;
        this.autoResizableH = this.autoResizeParent;
    }
    if (rialto.lang.isBoolean(objPar.boolPrint)) {
        this.boolPrint = objPar.boolPrint;
    }
    if (rialto.lang.isBoolean(objPar.boolMaxi)) {
        this.boolMaxi = objPar.boolMaxi;
    }
    var oThis = this;
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.width = this.width;
    this.divExt.style.height = this.height;
    this.divExt.style.position = this.position;
    this.divExt.id = this.name;
    this.cadre = document.createElement("DIV");
    this.cadre.id = this.id;
    this.cadre.name = this.name;
    this.cadre.style.position = "relative";
    this.cadre.style.overflow = "auto";
    this.cadre.style.width = "100%";
    this.divExt.appendChild(this.cadre);
    if (objPar.parent) {
        this.placeIn(objPar.parent);
    }
    objPar = null;
};
rialto.widget.Frame.prototype = new rialto.widget.AbstractContainer;
rialto.widget.Frame.prototype.adaptAfterSizeChange = function () {
    if (this.dynamic == true) {
        this.cadre.style.height = this.divExt.offsetHeight - this.cadre.offsetTop;
    }
    this.oldHeight = this.divExt.offsetHeight;
    this.oldWidth = this.divExt.offsetWidth;
    this.resizeChilds();
};
rialto.widget.Frame.prototype.adaptToContext = function () {
    if (this.autoResizableH) {
        this.divExt.style.height = this.getNewParentHeight() - this.divExt.offsetTop;
    } else {
        this.divExt.style.height = this.height;
    }
    if (this.autoResizableW) {
        this.divExt.style.width = this.getNewParentWidth() - this.divExt.offsetLeft;
    } else {
        this.divExt.style.width = this.width;
    }
    if (this.dynamic == true) {
        this.cadre.style.height = this.divExt.offsetHeight - 25;
    } else {
        this.cadre.style.height = "100%";
    }
    this.oldHeight = this.divExt.offsetHeight;
    this.oldWidth = this.divExt.offsetWidth;
    var oThis = this;
    if (this.dynamic) {
        this.cadre.className = "frame_content_dynamic";
        this.cadre.style.top = 25;
        this.toolBar = new rialto.widget.ToolBar({width:"100%", parent:this.divExt});
        this.toolBar.ondbleclick = function () {
            oThis.setDisplay(!oThis.open);
        };
        this.labelTitle = new rialto.widget.Label("", 3, 10, this.toolBar, this.title, "frame_titlecbig");
        var ob = {position:"relative", boolFloatRight:true};
        if (this.dynamic != "buttonLess") {
            if (this.open == false) {
                this.cadre.style.display = "none";
                this.divExt.style.height = 25;
                this.BTN = new rialto.widget.Image("moreButtonOff", 0, 2, this.toolBar, rialto.I18N.getLabel("lanOpenFrame"), "moreButtonOn", ob);
            } else {
                this.cadre.style.display = "block";
                this.BTN = new rialto.widget.Image("lessButtonOff", 0, 2, this.toolBar, rialto.I18N.getLabel("lanCloseFrame"), "lessButtonOn", ob);
            }
            this.BTN.onclick = function () {
                oThis.setDisplay(!oThis.open);
            };
            if (this.boolMaxi) {
                this.bMAX = new rialto.widget.Image("maxButtonOff", -5, 2, this.toolBar, "Maximise/minimise the frame", "maxButtonOn", ob);
                this.max = false;
                this.bMAX.onclick = function () {
                    oThis.maximize();
                };
            }
            if (this.boolPrint) {
                this.bPrint = new rialto.widget.Image("printButtonOff", -10, 2, this.toolBar, "Print the content", "printButtonOn", ob);
                this.bPrint.onclick = function () {
                    oThis.print();
                };
            }
        }
    } else {
        this.cadre.className = "frame_content_simple";
        this.labelTitle = new rialto.widget.Label("", -8, 5, this.divExt, this.title, "frame_titlecsmall", {position:"absolute"});
    }
};
rialto.widget.Frame.prototype.getHtmlDD = function () {
    if (this.dynamic) {
        return this.toolBar.divExt;
    } else {
        return this.divExt;
    }
};
rialto.widget.Frame.prototype.getHtmlRZ = function () {
    return this.cadre;
};
rialto.widget.Frame.prototype.getHtmlImp = function () {
    return this.cadre;
};
rialto.widget.Frame.prototype.getHtmlCont = function () {
    return this.cadre;
};
rialto.widget.Frame.prototype.addButton = function (objImage) {
    objImage.placeIn(this.toolBar);
};
rialto.widget.Frame.prototype.print = function () {
    if (this.cadre.childNodes.length == 1) {
        if (this.cadre.childNodes[0].oCiu) {
            if (this.cadre.childNodes[0].oCiu.print) {
                this.filsAImprimer = this.cadre.childNodes[0].oCiu;
            }
        }
    }
    if (this.filsAImprimer) {
        this.filsAImprimer.printTitle = this.printTitle;
        this.filsAImprimer.print();
    } else {
        var widthGlobal = document.body.clientWidth;
        var heightGlobal = document.body.clientHeight;
        this.fenImp = window.open(rialtoConfig.pathRialtoE + "printTab.html", "IMPRESSION", "height=" + heightGlobal + ",width=" + widthGlobal + ",top=0,left=0,scrollbars,resizable,toolbar,menubar");
        var obj = this.getHtmlImp();
        this.inner = obj.innerHTML;
        this.rempFenImp();
    }
};
rialto.widget.Frame.prototype.rempFenImp = function () {
    var obj = {titre:this.printTitle, divInner:this.inner};
    if (this.fenImp.rempPage) {
        this.fenImp.rempPage(obj);
    } else {
        window.setTimeout("rialto.session.objects[\"" + this.id + "\"].rempFenImp()", 50);
    }
};
rialto.widget.Frame.prototype.maximize = function () {
    if (!this.open) {
        this.setDisplay(true);
    }
    if (this.max == false) {
        this.bMAX.setImageReference("minButtonOff", "minButtonOn");
        this.BTN.setVisible(false);
        this.divExt.style.top = 0;
        this.divExt.style.left = 0;
        this.divExt.style.width = "100%";
        this.divExt.style.height = "100%";
        this.divExt.style.position = "absolute";
        var delta = this.parent.offsetHeight - this.divExt.offsetHeight - 10;
    } else {
        this.bMAX.setImageReference("maxButtonOff", "maxButtonOn");
        this.BTN.setVisible(true);
        this.divExt.style.top = this.top;
        this.divExt.style.left = this.left;
        this.divExt.style.width = this.width;
        this.divExt.style.height = this.height;
        this.divExt.style.position = this.position;
    }
    this.max = !this.max;
    this.updateSize(delta);
};
rialto.widget.Frame.prototype.updateSize = function () {
    this.divExt.style.overflow = "hidden";
    this.cadre.style.overflow = "hidden";
    if (this.autoResizableH) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    this.cadre.style.overflow = "auto";
    this.divExt.style.overflow = "auto";
};
rialto.widget.Frame.prototype.updateWidth = function () {
    if (this.open == true) {
        if (this.autoResizableW) {
            var tailleCalc = parseInt(this.getNewParentWidth());
            this.divExt.style.width = tailleCalc - this.divExt.offsetLeft;
            this.cadre.style.height = tailleCalc - this.divExt.offsetLeft - this.cadre.offsetLeft;
            this.resizeChilds(true, false);
        }
    }
};
rialto.widget.Frame.prototype.updateHeight = function () {
    if (this.open == true) {
        if (this.autoResizableH) {
            var tailleCalc = parseInt(this.getNewParentHeight());
            this.divExt.style.height = tailleCalc - this.divExt.offsetTop;
            this.cadre.style.height = tailleCalc - this.divExt.offsetTop - this.cadre.offsetTop;
            traceExec("Apres Calcul this.cadre.style.height:" + this.cadre.style.height + " this.divExt.style.height:" + this.divExt.style.height, 1);
            this.resizeChilds(false, true);
        }
    }
};
rialto.widget.Frame.prototype.resizeContenu = function () {
    if (this.autoResizeContenu && this.autoResizeParent == false) {
        if (this.cadre.childNodes.length > 0) {
            taillelim = 0;
            for (var i = 0; i < this.cadre.childNodes.length; i++) {
                fils = this.cadre.childNodes[i];
                tailleLimFils = fils.offsetTop + fils.offsetHeight;
                if (tailleLimFils > taillelim) {
                    taillelim = tailleLimFils;
                }
            }
            if (taillelim < parseInt(this.height) - this.cadre.offsetTop) {
                this.cadre.style.height = taillelim;
                this.divExt.style.height = this.cadre.offsetHeight + this.cadre.offsetTop + "px";
            } else {
                this.divExt.style.height = this.height;
                if (this.dynamic == true) {
                    this.cadre.style.height = Math.max(0, this.divExt.offsetHeight - this.cadre.offsetTop) + "px";
                } else {
                    this.cadre.style.height = "100%";
                }
            }
            this.resizePereFrere();
        }
    }
};
rialto.widget.Frame.prototype.getContenuHeight = function () {
    return parseInt(this.cadre.style.height);
};
rialto.widget.Frame.prototype.setDisplay = function (open) {
    if (open) {
        if (this.autoResizeParent) {
            this.divExt.style.height = this.getNewParentHeight();
        } else {
            this.divExt.style.height = this.height;
        }
        this.cadre.style.display = "block";
        if (this.autoResizeParent) {
            this.updateSize();
        } else {
            if (this.autoResizeContenu) {
                this.resizeContenu();
            }
            this.resizeChilds();
        }
        this.BTN.setImageReference("lessButtonOff", "lessButtonOn");
        this.BTN.alt = "Close the frame";
    } else {
        this.cadre.style.display = "none";
        this.divExt.style.height = 25;
        this.BTN.setImageReference("moreButtonOff", "moreButtonOn");
        this.BTN.alt = "Open the frame";
    }
    this.open = open;
    if (this.inContainer) {
        this.inContainer.resizeChilds(false, true);
    }
    this.$$activeContent();
    this.onSetDisplay(this.open);
};
rialto.widget.Frame.prototype.setTitle = function (newTitle) {
    this.labelTitle.setText(newTitle);
};
rialto.widget.Frame.prototype.onSetDisplay = function (open) {
};


rialto.widget.Form = function (formName, url, parent, objPar) {
    var objParam = objPar ? objPar : {};
    objParam.type = "form";
    objParam.height = 0;
    objParam.width = 0;
    objParam.name = formName;
    this.base = rialto.widget.AbstractContainer;
    this.base(objParam);
    this.action = url;
    this.url = url;
    this.autoSubmit = true;
    this.imgBtonSubmit = null;
    this.idCont = null;
    this.boolWithFenWait = true;
    this.boolAsynch = true;
    this.method = "get";
    this.boolIframe = false;
    this.canBeCancel = true;
    this.parameters = {};
    if (objPar) {
        if (objPar.imgBtonSubmit) {
            this.imgBtonSubmit = objPar.imgBtonSubmit;
        }
        if (rialto.lang.isBoolean(objPar.autoSubmit)) {
            this.autoSubmit = objPar.autoSubmit;
        }
        if (rialto.lang.isStringIn(objPar.method, ["post", "get"])) {
            this.method = objPar.method;
        }
        if (rialto.lang.isBoolean(objPar.boolWithFenWait)) {
            this.boolWithFenWait = objPar.boolWithFenWait;
        }
        if (rialto.lang.isBoolean(objPar.boolAsynch)) {
            this.boolAsynch = objPar.boolAsynch;
        }
        if (objPar.idCont) {
            this.idCont = objPar.idCont;
            var primCar = this.url.indexOf("?") != -1 ? "&" : "?";
            this.url += primCar + "FENID=" + objPar.idCont;
        }
        if (rialto.lang.isBoolean(objPar.canBeCancel)) {
            this.canBeCancel = objPar.canBeCancel;
        }
        if (rialto.lang.isBoolean(objPar.boolIframe)) {
            this.boolIframe = objPar.boolIframe;
        }
        if (objPar.onSuccess) {
            this.onSuccess = objPar.onSuccess;
        }
        if (objPar.callBackObjectOnSuccess) {
            this.callBackObjectOnSuccess = objPar.callBackObjectOnSuccess;
        }
        if (objPar.parameters) {
            this.parameters = objPar.parameters;
        }
    }
    var oThis = this;
    this.autoSubmit = false;
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.height = this.height;
    this.divExt.style.width = this.width;
    this.divExt.style.position = this.position;
    this.formulaire = document.createElement("FORM");
    this.formulaire.style.position = "relative";
    this.formulaire.method = this.method;
    this.divExt.appendChild(this.formulaire);
    if (this.boolAsynch && !this.boolIframe) {
        this.remote = new rialto.io.AjaxRequest({url:this.url, method:this.method, callBackObjectOnSuccess:this.callBackObjectOnSuccess, withWaitWindow:this.boolWithFenWait, canBeCancel:this.canBeCancel, onSuccess:this.onSuccess});
    }
    if (this.autoSubmit) {
        this.formulaire.onkeypress = function (evt) {
            if (!evt) {
                evt = window.event;
            }
            var key = evt.keyCode ? evt.keyCode : evt.charCode ? evt.charCode : evt.which ? evt.which : void 0;
            if (key == 13) {
                document.onselectstart = new Function("return false");
                oThis.submitForm();
                return false;
            }
        };
    }
    if (this.imgBtonSubmit) {
        this.imgBtonSubmit.oCiu = this;
        this.affComportBtonSubmit();
    }
    if (parent) {
        this.placeIn(parent);
    }
    objPar = null;
    objParam = null;
};
rialto.widget.Form.prototype = new rialto.widget.AbstractContainer;
rialto.widget.Form.prototype.tabIndex = 1;
rialto.widget.Form.prototype.nbReq = 0;
rialto.widget.Form.prototype.release = function (imgBtonSubmit) {
    this.formulaire.onkeypress = null;
    if (this.imgBtonSubmit) {
        if (this.imgBtonSubmit.remove) {
            this.imgBtonSubmit.remove();
        }
        this.imgBtonSubmit.oCiu = null;
        this.imgBtonSubmit.onclick = null;
    }
};
rialto.widget.Form.prototype.addBtonSubmit = function (imgBtonSubmit) {
    this.imgBtonSubmit = imgBtonSubmit;
    this.imgBtonSubmit.oCiu = this;
    this.affComportBtonSubmit();
};
rialto.widget.Form.prototype.affComportBtonSubmit = function () {
    this.imgBtonSubmit.onclick = function () {
        this.oCiu.submitForm();
    };
};
rialto.widget.Form.prototype.getHtmlCont = function () {
    return this.formulaire;
};
rialto.widget.Form.prototype.buildQueryString = function () {
    var qs = "";
    for (param in this.parameters) {
        qs += "&" + param + "=" + escape(this.parameters[param]);
    }
    for (var e = 0; e < this.formulaire.elements.length; e++) {
        var elmt = this.formulaire.elements[e];
        if (elmt.name != "") {
            if (elmt.type == "radio" && elmt.checked == true) {
                qs += "&" + elmt.name + "=" + escape(elmt.value);
            } else {
                if (elmt.type != "radio") {
                    qs += "&" + elmt.name + "=" + escape(elmt.value);
                }
            }
        }
    }
    if (qs != "") {
        qs = qs.substring(1);
    }
    return qs;
};
rialto.widget.Form.prototype.resetForm = function () {
    this.formulaire.reset();
    for (var e = 0; e < this.formulaire.elements.length; e++) {
        var elmt = this.formulaire.elements[e];
        if (elmt.type == "hidden" && elmt.parentNode.parentNode.oCiu.type == "combo") {
            elmt.value = "";
        }
    }
};
rialto.widget.Form.prototype.submitForm = function () {
    if (this.onSubmitForm()) {
        if (this.boolAsynch) {
            if (!this.boolIframe) {
                this.remote.load(this.buildQueryString());
            } else {
                var idExtReq = ++rialto.widget.Form.prototype.nbReq;
                if (!this.iframe) {
                    this.iframe = new objFrame("ifr", 0, 0, 0, 0);
                    this.iframe.create(document.body);
                }
                var primCar = this.url.indexOf("?") != -1 ? "&" : "?";
                this.lastURL = this.url + primCar + this.buildQueryString();
                this.iframe.load(this.lastURL);
                if (this.boolWithFenWait) {
                    this.fen = new rialto.widget.WaitWindow({text:"LOADING", canBeCancel:true});
                }
            }
        } else {
            this.formulaire.action = this.action;
            this.formulaire.submit();
        }
        this.afterSubmitForm();
    }
};
rialto.widget.Form.prototype.onSubmitForm = function () {
    return true;
};
rialto.widget.Form.prototype.afterSubmitForm = function () {
    return true;
};
rialto.widget.Form.prototype.addParameter = function (tab) {
    this.parameters[tab[0]] = tab[1];
};
rialto.widget.Form.prototype.setURL = function (url) {
    this.url = url;
    if (this.idCont) {
        var primCar = this.url.indexOf("?") != -1 ? "&" : "?";
        this.url += primCar + "FENID=" + this.idCont;
    }
};


var oDeplact = null;
var oReSizeCurs = null;
function partitionDiv(orientation, prop, div, colorOne, colorTwo) {
    this.orientation = orientation;
    if (div.nodeName) {
        this.oHtmlPrinc = div.nodeName ? div : new cursPartieFixe(div.top, div.left, div.width.div.height);
    }
    if (!this.oHtmlPrinc.oCiu) {
        this.oHtmlPrinc.oCiu = new Array();
    }
    this.oHtmlPrinc.oCiu["splitter"] = this;
    this.barre = (orientation == "v") ? new cursPartieMobile(0, 0, "100%", partitionDiv.prototype.widthTirette, "red") : new cursPartieMobile(0, 0, partitionDiv.prototype.widthTirette, "100%", "red");
    this.barrePosPreDef = document.createElement("DIV");
    this.barrePosPreDef.style.fontSize = "0.5";
    this.barrePosPreDef.style.position = "absolute";
    this.barrePosPreDef.style.top = (orientation == "h") ? "33%" : 0;
    this.barrePosPreDef.style.left = (orientation == "h") ? 0 : "33%";
    this.barrePosPreDef.style.width = (orientation == "h") ? "100%" : "33%";
    this.barrePosPreDef.style.height = (orientation == "h") ? "33%" : "100%";
    this.barrePosPreDef.style.backgroundColor = "pink";
    this.barre.appendChild(this.barrePosPreDef);
    var oThis = this;
    this.barrePosPreDef.onclick = function () {
        oThis.fixeProp((this.basc = (this.basc == 0) ? 0.8 : 0));
    };
    if (orientation == "v") {
        this.one = new cursPartieFixe(0, 0, "100%", prop * (parseInt(this.oHtmlPrinc.style.height) - parseInt(this.barre.style.height)), colorOne);
        this.two = new cursPartieFixe(parseInt(this.one.style.height) + parseInt(this.barre.style.height), 0, "100%", parseInt(this.oHtmlPrinc.style.height) - parseInt(this.barre.style.height) - parseInt(this.one.style.height), colorTwo);
    } else {
        this.one = new cursPartieFixe(0, 0, prop * (pixWidthCurs(this.oHtmlPrinc) - parseInt(this.barre.style.width)), "100%", colorOne);
        this.two = new cursPartieFixe(0, parseInt(this.one.style.width) + parseInt(this.barre.style.width), pixWidthCurs(this.oHtmlPrinc) - parseInt(this.barre.style.width) - parseInt(this.one.style.width), "100%", colorTwo);
    }
    this.one.style.fontSize = "0.5";
    this.oHtmlPrinc.appendChild(this.one);
    this.two.style.fontSize = "0.5";
    this.oHtmlPrinc.appendChild(this.two);
    this.cursMob = new CurseurMobile(this.oHtmlPrinc, this.barre, {mobilite:"DragAndDrop", orientation:orientation, rectLim:null}, prop);
    this.base = AbstractCurseur;
    this.base(prop);
    this.handlerSplit = new CouplageCurseurs(prop);
    this.handlerSplit.add(this.cursMob);
    this.handlerSplit.add(this);
}
partitionDiv.prototype = new AbstractCurseur;
partitionDiv.prototype.nbInstances = 0;
partitionDiv.prototype.widthTirette = "4px";
partitionDiv.prototype.placeCurs = function (prop) {
    this.prop = (prop != null) ? prop : this.prop;
    if (this.orientation == "v") {
        this.one.style.height = Math.max(0, this.prop * (pixHeightCurs(this.oHtmlPrinc) - parseInt(this.barre.style.height)));
        this.two.style.height = Math.max(0, pixHeightCurs(this.oHtmlPrinc) - parseInt(this.one.style.height) - parseInt(this.barre.style.height));
        this.two.style.top = parseInt(this.one.style.height) + parseInt(this.barre.style.height);
    } else {
        this.one.style.width = Math.max(0, this.prop * (pixWidthCurs(this.oHtmlPrinc) - parseInt(this.barre.style.width)));
        this.two.style.width = Math.max(0, pixWidthCurs(this.oHtmlPrinc) - parseInt(this.one.style.width) - parseInt(this.barre.style.width));
        this.two.style.left = parseInt(this.one.style.width) + parseInt(this.barre.style.width);
    }
    if (this.one.oCiu && this.one.oCiu["splitter"] && this.one.oCiu["splitter"].orientation == this.orientation) {
        this.one.oCiu["splitter"].handler.majPosCurs();
    }
    if (this.two.oCiu && this.two.oCiu["splitter"] && this.two.oCiu["splitter"].orientation == this.orientation) {
        this.two.oCiu["splitter"].handler.majPosCurs();
    }
};
function cursPartieFixe(top, left, width, height, bckcol) {
    var oHtml = document.createElement("DIV");
    oHtml.style.position = "absolute";
    oHtml.style.top = top || 0;
    oHtml.style.left = left || 0;
    oHtml.style.width = width || 100;
    oHtml.style.height = height || 100;
    oHtml.style.backgroundColor = bckcol || "green";
    oHtml.id = "cursPartieFixe_" + (++cursPartieFixe.prototype.nbInstances);
    return oHtml;
}
cursPartieFixe.prototype.nbInstances = 0;
function cursPartieMobile(top, left, width, height, bckcol) {
    var oHtml = document.createElement("DIV");
    oHtml.className = "cursAscenseurWin";
    oHtml.style.position = "absolute";
    oHtml.style.top = top || 0;
    oHtml.style.left = left || 0;
    oHtml.style.width = width || "100px";
    oHtml.style.height = height || "100px";
    oHtml.style.border = "1px black outset";
    oHtml.style.fontSize = "0.5";
    oHtml.id = "oMobile";
    oHtml.id = "cursPartieMobile_" + (++cursPartieMobile.prototype.nbInstances);
    return oHtml;
}
cursPartieMobile.prototype.nbInstances = 0;
function AbstractCurseur(prop) {
    this.prop = prop || 0;
    this.handler = null;
}
AbstractCurseur.prototype.placeIn = function (oHtml, top, left) {
    this.oHtmlPrinc.style.top = top;
    this.oHtmlPrinc.style.left = left;
    this.oHtmlPrinc.style.position = "absolute";
    oHtml.appendChild(this.oHtmlPrinc);
};
AbstractCurseur.prototype.synchro = function (cumulDelta, delta, posInit) {
    traceExec("synchro entree this.id= " + this.id + " appel de calculProp this.prop  = " + this.prop, 10);
    this.calculProp();
    traceExec("synchro apres appel de calculProp this.prop= " + this.prop, 10);
    if (this.handler) {
        traceExec("synchro this.handler.id= " + this.handler.id, 60);
        traceExec("synchro appel de handler.majPosCurs", 10);
        this.handler.majPosCurs(this, true);
    } else {
        traceExec("synchro pas d appel de majPosCurs car pas de handler", 10);
    }
    traceExec("synchro sortie", 10);
};
AbstractCurseur.prototype.synchroDiff = function () {
    if (this.handler) {
        this.calculProp();
        this.handler.majPosCurs();
    }
};
AbstractCurseur.prototype.fixeProp = function (prop, force) {
    if (this.handler) {
        this.handler.majPosCurs({prop:prop}, force);
    } else {
        this.placeCurs(prop);
    }
};
AbstractCurseur.prototype.placeCurs = function () {
    return;
};
AbstractCurseur.prototype.calculProp = function () {
    return;
};
function CurseurCpleBton(limitDeplact, prop, btonUp, btonDown) {
    this.base = AbstractCurseur;
    this.base(prop);
    this.limitDeplact = limitDeplact;
    this.val = limitDeplact.posRelI || 0;
    this.limitDeplact.amplitude = limitDeplact.ampl || 100;
    this.limitDeplact.circulaire = limitDeplact.circulaire || false;
    this.limitDeplact.varDiscrete = limitDeplact.varDiscrete || false;
    this.limitDeplact.nbVal = limitDeplact.nbVal || 2;
    this.limitDeplact.tabVal = limitDeplact.tabVal || null;
    if (this.limitDeplact.varDiscrete && this.limitDeplact.nbVal) {
        this.limitDeplact.iPas = this.limitDeplact.amplitude / this.limitDeplact.nbVal;
        this.limitDeplact.prctPas = 1 / this.limitDeplact.nbVal;
        this.limitDeplact.index = 0;
        traceExec("this.limitDeplact.iPas=" + this.limitDeplact.iPas, 50);
    }
    traceExec("this.limitDeplact.varDiscrete" + ((this.limitDeplact.varDiscrete == false) ? " non discrete" : " discrete"), 10);
    this.scroll = false;
    this.oHtml = document.createElement("DIV");
    this.oHtml.className = "cursCpleBton";
    this.oHtmlPrinc = this.oHtml;
    this.oHtmlPrinc.id = "curs_cple_bton_" + (++CurseurCpleBton.prototype.nbInstances);
    this.oHtmlBtonPlus = btonUp ? btonUp : document.createElement("DIV");
    this.oHtmlBtonPlus.oCiu = this;
    this.oHtmlBtonPlus.className = btonUp ? "cursBton" : "cursBtonUp";
    this.oHtmlBtonPlus.id = "curs_cple_bton_plus_" + CurseurCpleBton.prototype.nbInstances;
    this.oHtmlBtonPlus.onmousedown = function (e) {
        if (!e) {
            var e = window.event;
        }
        this.oCiu.scroll = true;
        this.oCiu.displayProp();
        this.oCiu.propUp();
        stopEvent(e);
    };
    this.oHtmlBtonPlus.onmouseup = this.oHtmlBtonPlus.onmouseout = function (e) {
        if (!e) {
            var e = window.event;
        }
        this.oCiu.scroll = false;
        this.oCiu.displayProp();
        stopEvent(e);
    };
    this.oHtmlBtonPlus.onmouseover = function (e) {
        if (!e) {
            var e = window.event;
        }
        this.oCiu.displayProp();
    };
    this.oHtml.appendChild(this.oHtmlBtonPlus);
    if (this.limitDeplact.oneBton) {
        this.limitDeplact.circulaire = true;
    } else {
        this.oHtmlBtonMoins = btonDown ? btonDown : document.createElement("DIV");
        this.oHtmlBtonMoins.oCiu = this;
        this.oHtmlBtonMoins.className = btonDown ? "cursBton" : "cursBtonDown";
        this.oHtmlBtonMoins.id = "curs_cple_bton_moins_" + CurseurCpleBton.prototype.nbInstances;
        this.oHtmlBtonMoins.onmousedown = function (e) {
            if (!e) {
                var e = window.event;
            }
            this.oCiu.scrollDown = true;
            this.oCiu.displayProp();
            this.oCiu.propDown();
            stopEvent(e);
        };
        this.oHtmlBtonMoins.onmouseup = this.oHtmlBtonMoins.onmouseout = function (e) {
            if (!e) {
                var e = window.event;
            }
            this.oCiu.scrollDown = false;
            this.oCiu.displayProp();
            stopEvent(e);
        };
        this.oHtmlBtonMoins.onmouseover = function (e) {
            if (!e) {
                var e = window.event;
            }
            this.oCiu.displayProp();
        };
        this.oHtml.appendChild(this.oHtmlBtonMoins);
    }
}
CurseurCpleBton.prototype = new AbstractCurseur;
CurseurCpleBton.prototype.nbInstances = 0;
CurseurCpleBton.prototype.displayProp = function () {
};
CurseurCpleBton.prototype.propUp = function (id) {
    if (id) {
        var btonHtml = document.getElementById(id);
        var oThis = btonHtml.oCiu;
    } else {
        oThis = this;
    }
    if (!oThis.limitDeplact.varDiscrete) {
        if (oThis.scroll) {
            oThis.val++;
            oThis.val = (oThis.val > oThis.limitDeplact.amplitude) ? (oThis.limitDeplact.circulaire ? 0 : oThis.limitDeplact.amplitude) : oThis.val;
            oThis.synchro();
            oThis.scrollIdTimeout = setTimeout("CurseurCpleBton.prototype.propUp(\"" + oThis.oHtmlBtonPlus.id + "\")", 1);
        } else {
            clearTimeout(oThis.scrollIdTimeout);
        }
    } else {
        if (!oThis.limitDeplact.tabVal) {
            traceExec("propUp: oThis.val=" + oThis.val, 50);
            oThis.val = ((oThis.val + oThis.limitDeplact.iPas) > oThis.limitDeplact.amplitude) ? (oThis.limitDeplact.circulaire ? 0 : oThis.val) : (oThis.val + oThis.limitDeplact.iPas);
            traceExec("propUp: nv oThis.val=" + oThis.val, 50);
        } else {
            oThis.index = Math.min(oThis.index + 1, oThis.limitDeplact.nbVal);
        }
        oThis.synchro();
    }
};
CurseurCpleBton.prototype.propDown = function (id) {
    if (id) {
        var btonHtml = document.getElementById(id);
        var oThis = btonHtml.oCiu;
    } else {
        oThis = this;
    }
    if (!oThis.limitDeplact.varDiscrete) {
        if (oThis.scrollDown) {
            oThis.val--;
            oThis.val = (oThis.val < 0) ? (oThis.limitDeplact.circulaire ? oThis.limitDeplact.amplitude : 0) : oThis.val;
            oThis.synchro();
            oThis.scrollDownIdTimeout = setTimeout("CurseurCpleBton.prototype.propDown(\"" + oThis.oHtmlBtonPlus.id + "\")", 1);
        } else {
            clearTimeout(oThis.scrollDownIdTimeout);
        }
    } else {
        if (!oThis.limitDeplact.tabVal) {
            traceExec("propDown: oThis.val=" + oThis.val, 50);
            oThis.val = ((oThis.val - oThis.limitDeplact.iPas) < 0) ? (oThis.limitDeplact.circulaire ? (this.limitDeplact.amplitude - this.limitDeplact.iPas) : oThis.val) : (oThis.val - oThis.limitDeplact.iPas);
            traceExec("propDown: nv oThis.val=" + oThis.val, 50);
        } else {
            oThis.index = Math.max(oThis.index - 1, 0);
        }
    }
    oThis.synchro();
};
CurseurCpleBton.prototype.placeCurs = function (prop) {
    this.prop = (prop != null) ? prop : this.prop;
    if (!this.limitDeplact.varDiscrete) {
        this.val = this.limitDeplact.amplitude * this.prop;
    } else {
        if (!this.limitDeplact.tabVal) {
            traceExec("placeCurs: this.val=" + "this.prop(" + this.prop + ") / this.prctPas=(" + this.limitDeplact.prctPas + ")", 50);
            traceExec("parseInt(this.prop / this.limitDeplact.prctPas)=" + parseInt(this.prop / this.limitDeplact.prctPas), 50);
            this.val = this.limitDeplact.amplitude * ((parseInt(this.prop / this.limitDeplact.prctPas)) * this.limitDeplact.prctPas);
            traceExec("placeCurs: nv this.val=" + this.val, 50);
        } else {
            this.val = "arevoir";
        }
    }
};
CurseurCpleBton.prototype.calculProp = function () {
    if (!this.limitDeplact.varDiscrete) {
        this.prop = this.val / this.limitDeplact.amplitude;
    } else {
        if (!this.limitDeplact.tabVal) {
            traceExec("calculprop: this.prop=" + this.prop, 50);
            this.prop = this.val / this.limitDeplact.amplitude;
            traceExec("calculprop: nv this.prop=" + this.prop, 50);
        } else {
            this.prop = "arevoir";
        }
    }
};
function CurseurMobile(oFixe, oMobile, descrVariation1, prop) {
    traceExec("CurseurMobile constructeur entree", 76);
    this.base = AbstractCurseur;
    this.base(prop);
    traceExec("CurseurMobile constructeur apres appel classe base", 76);
    this.id = this.idObjComp = "CurseurMobile_" + CurseurMobile.prototype.nbInstances++;
    this.oHtmlFixe = oFixe;
    this.oHtmlMobile = oMobile;
    this.oHtmlFixe.appendChild(this.oHtmlMobile);
    if (!this.oHtmlMobile.oCiu) {
        this.oHtmlMobile.oCiu = new Array();
    }
    this.oHtmlMobile.oCiu[descrVariation1.mobilite] = this;
    if (descrVariation1) {
        this.typeMobilite = descrVariation1.mobilite;
        if (!descrVariation1.nonInteractif) {
            if (!descrVariation1) {
                descrVariation1 = new Object;
            }
            descrVariation1.objetCibleEvt = this.oHtmlMobile;
            traceExec("cursMob descrVariation1.objetCibleEvt= " + descrVariation1.objetCibleEvt.id, 76);
            descrVariation1.objetADeplacer = this.oHtmlMobile;
            descrVariation1.objetADeformer = this.oHtmlMobile;
            descrVariation1.cibleEvt = {oHtml:this.oHtmlMobile};
            this.comportMobile = eval(descrVariation1.mobilite);
            traceExec("CurseurMobile affectation comport " + descrVariation1.mobilite, 39);
            this.comportMobile(descrVariation1);
            this.afterMD = function () {
                this.DDCursTemoin = true;
            };
            this.afterDD = function () {
                this.DDCursTemoin = false;
            };
        }
    }
    traceExec("-> placeCurs this.id= " + this.id, 76);
}
CurseurMobile.prototype = new AbstractCurseur;
CurseurMobile.prototype.nbInstances = 0;
CurseurMobile.prototype.calculProp = function () {
    traceExec("calculProp entree CurseurMobile.prop = " + this.prop, 10);
    if (this.typeMobilite == "DragAndDrop") {
        traceExec("calculprop deb this.prop = " + this.prop, 39);
        if (this.limitDeplact.orientation == "h") {
            this.prop = (parseInt(this.oHtmlMobile.style.left) - this.limitDeplact.rectLim.left) / ((this.limitDeplact.rectLim.right - this.limitDeplact.rectLim.left) - parseInt(this.oHtmlMobile.style.width));
        } else {
            if (this.limitDeplact.orientation == "v") {
                traceExec("parseInt(this.oHtmlMobile.style.top) = " + parseInt(this.oHtmlMobile.style.top), 10);
                traceExec("this.limitDeplact.rectLim.top = " + this.limitDeplact.rectLim.top, 10);
                traceExec("this.limitDeplact.rectLim.bottom = " + this.limitDeplact.rectLim.bottom, 10);
                traceExec("parseInt(this.oHtmlMobile.style.height) = " + parseInt(this.oHtmlMobile.style.height), 10);
                var posTexte = Math.abs(this.limitDeplact.rectLim.top - parseInt(this.oHtmlMobile.style.top));
                this.prop = (posTexte == 0) ? 0 : posTexte / ((this.limitDeplact.rectLim.bottom - this.limitDeplact.rectLim.top) - parseInt(this.oHtmlMobile.style.height) - borderIfNecess(this.oHtmlMobile));
            }
        }
        traceExec("calculProp ap calcul CurseurMobile.prop = " + this.prop, 10);
        if (this.complementProp) {
            this.prop = 1 - this.prop;
            traceExec("calculProp rectification complt CurseurMobile.prop = " + this.prop, 10);
        }
        traceExec("calculprop fin this.prop = " + this.prop, 10);
    } else {
        if (this.typeMobilite == "ReSize") {
            traceExec("calculProp ReSize this.limitReDim.orientation= " + this.limitReDim.orientation, 60);
            if (this.specs.orientation == "h") {
                this.prop = (parseInt(this.oHtmlMobile.style.width) - this.limitReDim.widthMin) / (this.limitReDim.widthMax - this.limitReDim.widthMin);
            } else {
                if (this.specs.orientation == "v") {
                    this.prop = (parseInt(this.oHtmlMobile.style.height) - this.limitReDim.heightMin) / (this.limitReDim.heightMax - this.limitReDim.heightMin);
                    traceExec("calculProp this.prop = " + this.prop, 60);
                } else {
                    if (this.specs.orientation == "2D") {
                        this.prop = (parseInt(this.oHtmlMobile.style.width) - this.limitReDim.widthMin) / (this.limitReDim.widthMax - this.limitReDim.widthMin);
                    }
                }
            }
        }
    }
    this.displayProp();
    return this.prop;
};
CurseurMobile.prototype.displayProp = function () {
};
CurseurMobile.prototype.placeCurs = function (prop) {
    traceExec("placeCurs entree this.id= " + this.id + " prop= " + prop, 10);
    var propNorm = prop;
    if (this.typeMobilite == "DragAndDrop") {
        if (this.limitDeplact && this.complementProp) {
            prop = 1 - prop;
            traceExec("placeCurs prop modifie utilis?e pour calc= " + prop, 10);
        }
        if ((this.limitDeplact.orientation == "h") || (this.limitDeplact.orientation == "2D")) {
            this.oHtmlMobile.style.left = (this.limitDeplact.rectLim.left + ((this.limitDeplact.rectLim.right - this.limitDeplact.rectLim.left) - parseInt(this.oHtmlMobile.style.width)) * prop);
        }
        if ((this.limitDeplact.orientation == "v") || (this.limitDeplact.orientation == "2D")) {
            traceExec("placeCurs this.id= " + this.id, 10);
            traceExec("placeCurs this.limitDeplact.rectLim.bottom = " + this.limitDeplact.rectLim.bottom, 10);
            traceExec("placeCurs this.limitDeplact.rectLim.top = " + this.limitDeplact.rectLim.top, 10);
            traceExec("placeCurs this.oHtmlMobile.style.height = " + this.oHtmlMobile.style.height, 10);
            traceExec("placeCurs prop = " + prop, 10);
            traceExec("placeCurs avant calcul this.oHtmlMobile.style.top= " + this.oHtmlMobile.style.top, 10);
            this.oHtmlMobile.style.top = (this.limitDeplact.rectLim.top + ((this.limitDeplact.rectLim.bottom - this.limitDeplact.rectLim.top) - parseInt(this.oHtmlMobile.style.height)) * prop);
            traceExec("placeCurs ap calcul this.oHtmlMobile.style.top= " + this.oHtmlMobile.style.top, 10);
        }
    } else {
        if (this.typeMobilite == "ReSize") {
            if (this.specs.orientation != "v") {
                var amplMax = this.limitReDim.widthMax - this.limitReDim.widthMin;
                var nvWidth = Math.floor((amplMax * prop) + this.limitReDim.widthMin);
                if (this.limitReDim.centrage) {
                    var diffLeft = Math.floor((nvWidth - parseInt(this.oHtmlMobile.style.width)) / 2);
                    this.oHtmlMobile.style.left = parseInt(this.oHtmlMobile.style.left) - (diffLeft);
                    this.oHtmlMobile.style.width = parseInt(this.oHtmlMobile.style.width) + (diffLeft * 2);
                } else {
                    this.oHtmlMobile.style.width = nvWidth;
                }
            }
            if (this.specs.orientation != "h") {
                var amplMax = this.limitReDim.heightMax - this.limitReDim.heightMin;
                var nvHeight = Math.floor((amplMax * prop) + this.limitReDim.heightMin);
                if (this.limitReDim.centrage) {
                    var diffTop = Math.floor((nvHeight - parseInt(this.oHtmlMobile.style.height)) / 2);
                    this.oHtmlMobile.style.top = parseInt(this.oHtmlMobile.style.top) - diffTop;
                    this.oHtmlMobile.style.height = parseInt(this.oHtmlMobile.style.height) + (diffTop * 2);
                } else {
                    this.oHtmlMobile.style.height = nvHeight;
                }
            }
        }
    }
    this.prop = propNorm;
    traceExec("placeCurs sortie this.prop= " + this.prop, 10);
};
CurseurMobile.prototype.placeIn = function (oHtml, top, left, position) {
    this.oHtmlFixe.style.top = top;
    this.oHtmlFixe.style.left = left;
    this.oHtmlFixe.style.position = position || "absolute";
    oHtml.appendChild(this.oHtmlFixe);
};
function CouplageCurseurs(prop) {
    this.id = "CouplageCurseurs_" + CouplageCurseurs.prototype.nbInstances++;
    this.cursLies = new Array();
    this.prop = prop || 0;
}
CouplageCurseurs.prototype.nbELtsCouples = function () {
    alert("reste " + this.cursLies.length + " elts");
    return this.cursLies.length;
};
CouplageCurseurs.prototype.add = function (curs, bMajPosCurs, prop) {
    curs.handler = this;
    rialto.array.add(this.cursLies, curs);
    if (!bMajPosCurs) {
        curs.placeCurs(this.prop);
    } else {
        if (prop) {
            this.majPosCurs({prop:prop}, "tous");
        } else {
            this.majPosCurs(curs);
        }
    }
};
CouplageCurseurs.prototype.remove = function (curs) {
    curs.handler = null;
    this.cursLies.remove(curs);
};
CouplageCurseurs.prototype.majPosCurs = function (cursRef, force) {
    traceExec("majPosCurs entree", 10);
    var forceMaj = cursRef ? force || false : true;
    this.prop = cursRef ? cursRef.prop : this.prop;
    traceExec("majPosCurs couplageCurseurs.prop = " + this.prop, 10);
    for (var i = 0; i < this.cursLies.length; i++) {
        traceExec("majPosCurs curs n? " + i + " " + this.cursLies[i].prop + " != ? " + this.prop, 10);
        if ((this.cursLies[i].prop != this.prop) || (forceMaj == "tous") || ((forceMaj) && (this.cursLies[i] != cursRef))) {
            traceExec("majPosCurs curs n? " + i + " ->placeCurs(" + this.prop + ")", 10);
            this.cursLies[i].placeCurs(this.prop);
        }
    }
};
CouplageCurseurs.prototype.nbInstances = 0;
pixWidthCurs = function (oHtml) {
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    do {
        var ndstyle = nd.currentStyle ? nd.currentStyle : nd.style;
        var taille = ndstyle.width;
        if (taille == "auto") {
            i = 1;
            taille = 100;
        } else {
            i = ndstyle.width.indexOf("%");
        }
        if (i == -1) {
            percent = false;
        } else {
            prc = prc * parseInt(taille) / 100;
        }
    } while (percent && (nd = nd.parentNode));
    if ((ndstyle.borderStyle != "none") && (ndstyle.borderStyle != "")) {
        tailleBord = parseInt(ndstyle.borderWidth);
    } else {
        tailleBord = 0;
    }
    return (prc * (parseInt(taille) - tailleBord * 2));
};
pixHeightCurs = function (oHtml) {
    var prc = 1;
    var nd = oHtml;
    var percent = true;
    do {
        var ndstyle = nd.currentStyle ? nd.currentStyle : nd.style;
        var taille = ndstyle.height;
        if (taille == "auto") {
            i = 1;
            taille = 100;
        } else {
            i = ndstyle.height.indexOf("%");
        }
        if (i == -1) {
            percent = false;
        } else {
            prc = prc * parseInt(taille) / 100;
        }
    } while (percent && (nd = nd.parentNode));
    if ((ndstyle.borderStyle != "none") && (ndstyle.borderStyle != "")) {
        tailleBord = parseInt(ndstyle.borderWidth);
    } else {
        tailleBord = 0;
    }
    return (prc * (parseInt(taille) - tailleBord * 2));
};
function dirDeplactElt(elt, width, height) {
    var dir = "";
    var xPRC, yPRC;
    xPRC = window.event.offsetX;
    yPRC = window.event.offsetY;
    if (yPRC < 5) {
        dir = "n";
    } else {
        if (yPRC > (height - 5)) {
            dir = "s";
        }
    }
    if (xPRC < 5) {
        dir += "w";
    } else {
        if (xPRC > (width - 5)) {
            dir += "e";
        }
    }
    return dir;
}


rialto.widget.Text = function (name, top, left, width, datatype, parent, objPar) {
    var objParam = new Object;
    objParam.name = name;
    objParam.type = "text";
    objParam.left = left;
    objParam.top = top;
    objParam.width = width;
    if (objPar != null) {
        objParam.position = objPar.position;
    }
    this.base = rialto.widget.AbstractComponent;
    this.base(objParam);
//maskat start
    if (rialto.lang.isStringIn(datatype, ["T", "P", "A", "N", "FN", "I", "D", "H", "Hi", "DT", "DA"])) {
//maskat end
        this.datatype = datatype;
    } else {
        this.datatype = "A";
    }
    if (this.datatype == "P") {
        this.inputType = "password";
    } else {
        if (this.datatype == "Hi") {
            this.inputType = "hidden";
        } else {
            this.inputType = "text";
        }
    }
    this.autoUp = false;
    this.isRequired = false;
    this.disable = false;
    this.nbchar = 50;
    this.rows = 5;
    this.initValue = null;
    this.wvalue = "";
    this.accessKey = "";
    this.tabIndex = rialto.widget.Form.prototype.tabIndex++;
    if (objPar) {
        if (rialto.lang.isNumber(objPar.nbchar)) {
            this.nbchar = objPar.nbchar;
        }
        if (rialto.lang.isBoolean(objPar.autoUp)) {
            this.autoUp = objPar.autoUp;
        }
        if (rialto.lang.isBoolean(objPar.disable)) {
            this.disable = objPar.disable;
        }
        if (rialto.lang.isBoolean(objPar.isRequired)) {
            this.isRequired = objPar.isRequired;
        }
        if (rialto.lang.isNumber(objPar.rows)) {
            this.rows = objPar.rows;
        }
        if (rialto.lang.isString(objPar.initValue)) {
            this.initValue = objPar.initValue;
        }
        if (rialto.lang.isString(objPar.accessKey, true)) {
            this.accessKey = objPar.accessKey;
        }
        if (rialto.lang.isNumber(objPar.tabIndex)) {
            this.tabIndex = objPar.tabIndex;
        }
    }
    objPar = null;
    objParam = null;
    var oThis = this;
    this.divExt.id = this.id + "_DivGen";
    this.divExt.style.position = this.position;
    this.divExt.style.left = this.left + "px";
    this.divExt.style.top = this.top + "px";
    this.divExt.style.width = this.width;
    this.divExt.style.height = 20;
    this.divExt.className = "field_global";
    var strInner = "";
    if (this.datatype == "T") {
        strInner = "<TEXTAREA  name='" + this.name + "'/>";
    } else {
        strInner = "<input type='" + this.inputType + "' name='" + this.name + "'/>";
    }
    this.divExt.innerHTML = strInner;
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.Text.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Text.prototype.adaptToContext = function () {
    var oThis = this;
    this.champs = this.divExt.childNodes[0];
    if (this.datatype == "T") {
        this.champs.className = "field_textarea";
        this.divExt.style.height = "auto";
        this.champs.rows = this.rows;
    }
    this.champs.tabIndex = this.tabIndex;
    this.champs.maxlength = this.nbchar;
    this.champs.accessKey = this.accessKey;
    this.champs.className = "field_" + this.datatype;
    this.champs.onselectstart = function () {
        return true;
    };
    this.champs.style.width = "100%";
    if (this.initValue) {
        this.setValue(this.initValue);
    }
    this.champs.setAttribute("autocomplete", "off");
    if (this.datatype == "I") {
        this.autoUp = false;
        this.divExt.style.width = 80;
        this.champs.style.width = 80;
        this.champs.size = 10;
        this.champs.maxlength = 10;
    } else {
//maskat start
        if (this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" ) {
//maskat end
            this.autoUp = false;
            this.divExt.style.width = 115;
            this.champs.style.width = 90;
            this.champs.size = 10;
            this.champs.maxlength = 11;
            this.hlpimg = new rialto.widget.Image("pinkHelpButton", 90, -2, this.divExt, rialto.I18N.getLabel("lanCalenderButton"), "redHelpButton", {position:"absolute"});
            this.hlpimg.onclick = function (e) {
                if (!e) {
                    e = window.event;
                }
                oThis.openCalendar(e);
            };
        } else {
            if (this.datatype == "H") {
                this.autoUp = false;
                this.divExt.style.width = 40;
                this.champs.style.width = 40;
                this.champs.size = 5;
                this.champs.maxlength = 5;
            }
        }
    }
    if (this.disable) {
        this.setEnable(false);
    }
    if (this.isRequired) {
        champsAs = document.createElement("DIV");
        champsAs.innerHTML = "*";
        champsAs.style.position = "absolute";
        champsAs.style.top = 0;
        champsAs.style.left = -7;
        champsAs.style.color = "red";
        this.divExt.appendChild(champsAs);
    }
    if (this.datatype != "Hi") {
        this.champs.onkeypress = function (e) {
            if (!e) {
                var e = window.event;
            }
            return oThis.checkKeyPress(e);
        };
        this.champs.onmousedown = function (e) {
            if (!e) {
                var e = window.event;
            }
            stopEvent(e);
        };
        this.champs.onfocus = function (e) {
            if (!e) {
                var e = window.event;
            }
            oThis.afterOnFocus();
        };
        this.champs.onblur = function (e) {
            if (!e) {
                var e = window.event;
            }
            oThis.afterOnBlur();
        };
        this.champs.onclick = function () {
            this.focus();
            return true;
        };
        this.champs.ondbleclick = function () {
            this.select();
            return true;
        };
    }
//maskat start
	if (this.datatype == "FN") {
		this.champs.onkeyup = function (e) {
			if (!e) {
				var e = window.event;
			}
			if (e.keyCode != 37 && e.keyCode != 39) {
				oThis.setComma();
			}
		}
	}
//maskat end
};
rialto.widget.Text.prototype.adaptAfterSizeChange = function () {
//maskat start
    if (this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" ) {
//maskat end
        var width = this.width - 27;
        this.champs.style.width = width;
        this.hlpimg.setLeft(width);
    }
};
rialto.widget.Text.prototype.release = function () {
    this.divExt.onselectstar = null;
    this.champs.onmousedown = null;
    this.champs.onkeypress = null;
    this.champs.onfocus = null;
    this.champs.onblur = null;
    this.champs.onclick = null;
    this.champs.ondbleclic = null;
//maskat start
    if (this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" ) {
//maskat end
        this.hlpimg.onclick = null;
        this.hlpimg.remove();
        if (this.calendar) {
            this.calendar.onclick = null;
            this.calendar.remove();
        }
    }
};
rialto.widget.Text.prototype.setStyle = function (obStyle) {
    for (prop in obStyle) {
        try {
            this.champs.style[prop] = obStyle[prop];
        }
        catch (erreur) {
        }
    }
};
rialto.widget.Text.prototype.openCalendar = function (e) {
    var othis = this;
    if (!this.calendar) {
        this.calendar = new rialto.widget.Calendar({popUpMode:true});
        this.calendar.onclick = function (date) {
            othis.setValue(date);
            othis.setFocus();
        };
    }
    var top = compOffsetTop(this.divExt) + 27;
    var left = compOffsetLeft(this.divExt) - 90;
    if (left < 0) {
        left = 0;
    }
    this.calendar.displayCalendar(top, left);
};
rialto.widget.Text.prototype.checkKeyPress = function (evt) {
    var boolCancel = false;
    boolReplaceKey = false;
    var keyCode = evt.keyCode ? evt.keyCode : evt.charCode ? evt.charCode : evt.which ? evt.which : void 0;
    var key;
    if (keyCode) {
        key = String.fromCharCode(keyCode);
    }
    if (evt.altKey) {
        return true;
    }
    if (evt.ctrlKey) {
        return true;
    }
//maskat start
    if (evt.metaKey){
        return true;
    }
//maskat end

//maskat start
	if (this.datatype == "FN") {
		if ((keyCode == 37) || (keyCode == 39)) {
			return false;
		}
		var text = "" + this.champs.value;
		var checkPeriod = text.indexOf(".") == -1;
		if (!checkPeriod) {
			if (key == ".") {
				return false;
			}
		} else {
			if (key == "." && text.length == 0) {
				this.champs.value = "0" + text;
				return true;
			}
		}
		if (key == "0" && text.length == 0) {
			return false;
		}
	}
//maskat end
    if (keyCode == 9 || (keyCode == 37) || (keyCode == 39) || (keyCode == 46) || keyCode == 8) {
        return true;
    }
    if ((this.champs.value.length + 1) > this.champs.maxlength) {
        if (window.event) {
            return false;
        } else {
            var oldSelectionStart = this.champs.selectionStart;
            var oldSelectionEnd = this.champs.selectionEnd;
            if (oldSelectionEnd - oldSelectionStart == 0) {
                return false;
            }
        }
    }
    if (keyCode == 13 && this.datatype != "T") {
        this.champs.blur();
        return this.blurOK;
    }
    if (this.datatype == "I") {
        boolCancel = "0123456789-".indexOf(key) == -1;
    }
    if (this.autoUp == true) {
        var newKey = key.toUpperCase();
        if (newKey != key) {
            boolReplaceKey = true;
            key = newKey;
        }
    }
//maskat start
    if (this.datatype == "N" || this.datatype == "FN") {
//maskat end
        boolCancel = "0123456789".indexOf(key) == -1;
    }
//maskat start
    if (this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" ) {
//maskat end
        boolCancel = "0123456789/".indexOf(key) == -1;
    }
    if (this.datatype == "H") {
        if ("0123456789:".indexOf(key) == -1) {
            boolCancel = true;
        } else {
            if (key == ":" && this.champs.value.length != 2) {
                boolCancel = true;
            }
        }
    }
    if (keyCode && window.event && !window.opera) {
        if (boolCancel) {
            return false;
        } else {
            if (boolReplaceKey) {
                window.event.keyCode = key.charCodeAt();
                if (window.event.preventDefault) {
                    window.event.preventDefault();
                }
//maskat start
                var isSafari = navigator.userAgent.indexOf("AppleWebKit") != -1;
                if (isSafari) {
                    var oldSelectionStart = this.champs.selectionStart;
                    var oldSelectionEnd = this.champs.selectionEnd;
                    this.champs.value = this.champs.value.substring(0, oldSelectionStart) + key + this.champs.value.substring(oldSelectionEnd);
                    this.champs.setSelectionRange(oldSelectionStart + key.length, oldSelectionStart + key.length);
                }
//maskat end
                return true;
            } else {
                return true;
            }
        }
    } else {
        if (typeof this.champs.setSelectionRange != "undefined") {
            if (boolCancel) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
                return false;
            } else {
                if (boolReplaceKey) {
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }
                    var oldSelectionStart = this.champs.selectionStart;
                    var oldSelectionEnd = this.champs.selectionEnd;
                    this.champs.value = this.champs.value.substring(0, oldSelectionStart) + key + this.champs.value.substring(oldSelectionEnd);
                    this.champs.setSelectionRange(oldSelectionStart + key.length, oldSelectionStart + key.length);
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (boolCancel) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
                return false;
            } else {
                return true;
            }
        }
    }
};
rialto.widget.Text.prototype.focus = function () {
    this.champs.focus();
};
rialto.widget.Text.prototype.afterOnFocus = function () {
    document.onselectstart = function () {
        return true;
    };
    this.champs.select();
    this.blurOK = true;
    this.wchanged = false;
    this.onfocus();
};
rialto.widget.Text.prototype.displayMessage = function (str, boolSetFoc) {
    var oThis = this;
    info = new rialto.widget.Alert(str);
    if (boolSetFoc) {
        info.onclose = function () {
            oThis.setValue("");
            oThis.champs.focus();
        };
        info = null;
    }
};
rialto.widget.Text.prototype.afterOnBlur = function () {
    if (this.champs.value != "") {
        this.champs.value = rialto.string.trim(this.champs.value);
        if (this.datatype == "N" && this.champs.value != "") {
            if (!rialto.lang.isNumber(this.champs.value)) {
                this.displayMessage("MUST BE A NUMBER", true);
                this.blurOK = false;
            }
        }
//maskat start
        if ((this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" )&& this.champs.value != "") {
//maskat end
            if (!this.checkDate()) {
//maskat start
                this.displayMessage("日付フォーマット不正: YYYY年MM月DD日", true);
//maskat end
                this.blurOK = false;
            }
        }
        if (this.datatype == "H" && this.champs.value != "") {
            if (!this.checkHour()) {
                this.displayMessage("Hour is not correct, format must be: HH:MM", true);
                this.blurOK = false;
            }
        }
        if (this.datatype == "I" && this.champs.value != "") {
            var wDoss = this.champs.value;
            var wPos = wDoss.indexOf("-");
            var wPre = "";
            var wSuf = "";
            if (wPos == -1) {
                if (wDoss.length <= 5) {
                    wPre = new Date().getYear().toString();
                    wSuf = wDoss;
                } else {
                    wPre = wDoss.substring(0, 4);
                    wSuf = wDoss.substring(4, wDoss.length);
                }
            } else {
                wPre = wDoss.substring(0, wPos);
                wSuf = wDoss.substring(wPos + 1, wDoss.length);
            }
            if (wPre == "") {
                wPre = new Date().getYear().toString();
            }
            if (wPre.length == 1) {
                wPre = ("200" + wPre);
            }
            if (wPre.length == 2 && wPre < "30") {
                wPre = ("20" + wPre);
            }
            if (wPre.length == 2 && wPre >= "30") {
                wPre = ("19" + wPre);
            }
            if (wPre.length == 3 && wPre < "030") {
                wPre = ("2" + wPre);
            }
            if (wPre.length == 3 && wPre >= "030") {
                wPre = ("1" + wPre);
            }
            if (wSuf.length < 5) {
                var wPad = "";
                for (var wI = wSuf.length; wI <= 4; wI++) {
                    wPad = (wPad + "0");
                }
                wSuf = (wPad + wSuf);
            }
            if (wPre.length != 4 || wSuf.length != 5) {
                this.displayMessage("Num?ro de dossier invalide, format utilisable: AA-NNNNN", true);
                this.blurOK = false;
            } else {
                this.champs.value = (wPre + "-" + wSuf);
            }
        }
        document.onselectstart = new Function("return false");
        if (this.datatype != "P") {
            this.champs.title = this.champs.value;
        }
        this.wchanged = (this.wvalue != this.champs.value);
        this.wvalue = this.champs.value;
        if (this.wchanged && this.blurOK) {
            this.blurOK = this.onblur();
        }
        this.removeAsRequired();
    } else {
        this.blurOK = this.onblur();
        if (this.isRequired) {
            this.showAsRequired();
            this.blurOK = false;
        }
    }
};
rialto.widget.Text.prototype.onblur = function () {
    return true;
};
rialto.widget.Text.prototype.hasChanged = function () {
    return this.wchanged;
};
rialto.widget.Text.prototype.checkHour = function () {
    strHour = this.champs.value;
    strHour = rialto.string.replace(strHour, ":", "");
    switch (strHour.length) {
      case 1:
        h = parseInt(strHour);
        m = 0;
        break;
      case 2:
        if (parseInt(strHour.substring(0, 1)) == 0) {
            h = parseInt(strHour.substring(1, 2));
        } else {
            h = parseInt(strHour);
        }
        m = 0;
        break;
      case 4:
        if (parseInt(strHour.substring(0, 1)) == 0) {
            h = parseInt(strHour.substring(1, 2));
        } else {
            h = parseInt(strHour.substring(0, 2));
        }
        m = parseInt(strHour.substring(2, 4));
        break;
      default:
        return false;
        break;
    }
    strHour = h < 10 ? "0" + h : h;
    strHour += ":" + (m < 10 ? "0" + m : m);
    if (h <= 24 && m <= 60) {
        this.champs.value = strHour;
        return true;
    } else {
        return false;
    }
};
rialto.widget.Text.prototype.checkDate = function () {
    var oDate = new Date();
    strDate = this.champs.value;
    var curMonth = oDate.getMonth() + 1;
    curMonth = (curMonth < 11) ? "0" + curMonth : curMonth;
    var curYear = oDate.getFullYear();
//maskat start
    if (strDate.length < 10)
        return false;

    var regexp = new RegExp(
        "^[0-9]{4}[/年][0-9]{2}[/月][0-9]{2}[日]?$");
    if (!regexp.test(strDate)) {
        return false;
    }

    strDate = strDate.slice(8,10) + "/" + strDate.slice(5,7) + "/" + strDate.slice(0,4);
/*    strDate = rialto.string.replace(strDate, "/", "");
    switch (strDate.length) {
      case 1:
        strDate = "0" + strDate + "/" + curMonth + "/" + curYear;
        break;
      case 2:
        strDate = strDate + "/" + curMonth + "/" + curYear;
        break;
      case 3:
        strDate = strDate.slice(0, 2) + "/0" + strDate.charAt(2) + "/" + curYear;
        break;
      case 4:
        strDate = strDate.slice(0, 2) + "/" + strDate.slice(2, 4) + "/" + curYear;
        break;
      case 6:
        strDate = strDate.slice(0, 2) + "/" + strDate.slice(2, 4) + "/20" + strDate.slice(4, 6);
        break;
      case 8:
        strDate = strDate.slice(0, 2) + "/" + strDate.slice(2, 4) + "/" + strDate.slice(4, 8);
        break;
      default:
        return false;
        break;
    }*/
    if (rialto.date.isDate(strDate)) {
        //this.setValue(strDate);
//maskat end
        return true;
    } else {
        return false;
    }
};
rialto.widget.Text.prototype.setFocus = function () {
    this.champs.focus();
};
rialto.widget.Text.prototype.getValue = function () {
//maskat start
    if (this.datatype == "FN") {
        var val = this.champs.value;
        while (val.match(/,/)) {
            val = val.replace(/,/,"");
        }
        return val;
    }
//maskat end
    return this.champs.value;
};
rialto.widget.Text.prototype.setValue = function (text) {
//maskat start
	if (this.datatype == "FN") {
		text = this.setCommaFunc(text);
	}
//maskat end
    this.champs.value = text;
    this.wvalue = text;
    if (this.datatype != "P") {
        this.champs.title = text;
    }
};
rialto.widget.Text.prototype.active = function () {
    rialto.deprecated("Text", "active", "setEnable(true)");
    this.setEnable(true);
};
rialto.widget.Text.prototype.inactive = function () {
    rialto.deprecated("Text", "inactive", "setEnable(false)");
    this.setEnable(false);
};
rialto.widget.Text.prototype.setEnable = function (enable) {
    if (enable) {
        this.champs.disabled = false;
        this.champs.className = "field_" + this.datatype;
//maskat start
        if (this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" ) {
//maskat end
            this.hlpimg.setEnable(true);
        }
    } else {
        this.champs.disabled = true;
        this.champs.className += " field_desable";
//maskat start
        if (this.datatype == "D" || this.datatype == "DA" || this.datatype == "DT" ) {
//maskat end
            this.hlpimg.setEnable(false);
        }
    }
    this.enable = enable;
};
rialto.widget.Text.prototype.showAsRequired = function () {
    this.champs.className += " field_required";
};
rialto.widget.Text.prototype.removeAsRequired = function () {
    this.champs.className = "field_" + this.datatype;
};


rialto.widget.Label = function (name, top, left, parent, text, className, objPar) {
    var objParam = new Object;
    objParam.name = name;
    objParam.type = "label";
    objParam.left = left;
    objParam.top = top;
    if (objPar != null) {
        objParam.position = objPar.position;
    }
    this.base = rialto.widget.AbstractComponent;
    this.base(objParam);
    objPar = null;
    objParam = null;
    this.text = text;
    if (className != "" && className != null) {
        this.className = className;
    } else {
        this.className = "libNormal";
    }
    var oThis = this;
    this.divExt.id = this.id + "_DivGen";
    this.divExt.style.position = this.position;
    this.divExt.style.left = this.left + "px";
    this.divExt.style.top = this.top + "px";
    this.divExt.style.width = this.getTailleTexte() + "px";
    this.divExt.className = this.className;
    this.divExt.style.overflow = "hidden";
    this.divExt.style.textOverflow = "ellipsis";
    this.divExt.style.whiteSpace = "nowrap";
    this.divExt.title = this.text;
    this.divExt.innerHTML = this.text;
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.Label.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Label.prototype.getTailleTexte = function (wText) {
    var text = wText ? wText : this.text;
    return getTailleTexte(text, this.className);
};
rialto.widget.Label.prototype.setText = function (text) {
    this.text = text;
    this.divExt.innerHTML = this.text;
    this.divExt.title = this.text;
    this.divExt.style.width = this.getTailleTexte() + "px";
};
rialto.widget.Label.prototype.setEnable = function (enable) {
    if (enable) {
        this.divExt.className = this.className;
    } else {
        this.divExt.className += " inactif";
    }
    this.enable = enable;
};


rialto.widget.Button = function (top, left, title, alt, parent, objPar) {
    var src1 = "bigButtonOff";
    var src2 = "bigButtonOn";
    if (!objPar) {
        var objPar = {};
        objPar.name = "button";
    }
    objPar.type = "button";
    objPar.top = top;
    objPar.left = left;
    this.base = rialto.widget.AbstractComponent;
    this.base(objPar);
    this.title = title;
    this.enable = true;
    this.alt = alt ? alt : title;
    this.widthMin = 88;
    this.width = 88;
    this.adaptToText = true;
    if (rialto.lang.isBoolean(objPar.enable)) {
        this.enable = objPar.enable;
    }
    if (rialto.lang.isBoolean(objPar.adaptToText)) {
        this.adaptToText = objPar.adaptToText;
    }
    if (rialto.lang.isNumber(objPar.widthMin)) {
        this.widthMin = objPar.widthMin;
    }
    if (rialto.lang.isNumber(objPar.width)) {
        this.width = objPar.width;
    }
    objPar = null;
    this.base = null;
    if (this.adaptToText) {
        this.width = Math.max(getTailleTexte(this.title, "textButton") + 13, this.widthMin);
    }
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.position = this.position;
    this.divExt.style.width = this.width;
    this.divExt.title = this.alt;
    this.divExt.className = "button_divExt";
    this.imgG = document.createElement("DIV");
    this.imgG.className = "leftEdgeButtonOff";
    this.divCenter = document.createElement("DIV");
    this.divCenter.className = "centerButtonOff";
    this._divTitle = document.createElement("DIV");
    this._divTitle.className = "textButtonOff";
    this._divTitle.innerHTML = this.title;
    this._divTitleShadow = document.createElement("DIV");
    this._divTitleShadow.className = "shadowTextButton";
    this._divTitleShadow.innerHTML = this.title;
    this.imgD = document.createElement("DIV");
    this.imgD.className = "rightEdgeButtonOff";
    this.divExt.appendChild(this.imgG);
    this.divExt.appendChild(this.divCenter);
    this.divCenter.appendChild(this._divTitleShadow);
    this.divCenter.appendChild(this._divTitle);
    this.divExt.appendChild(this.imgD);
    var oThis = this;
    this.divExt.onmouseout = function (e) {
        if (oThis.enable) {
            if (!e) {
                e = window.event;
            }
            oThis.switchImage("Off");
            this.style.cursor = "default";
            oThis.onmouseout(e);
        }
    };
    this.divExt.onmouseover = function (e) {
        if (oThis.enable) {
            if (!e) {
                e = window.event;
            }
            oThis.switchImage("On");
            this.style.cursor = "pointer";
            oThis.onmouseover();
        }
    };
    this.divExt.onclick = function (e) {
        if (!e) {
            e = window.event;
        }
        if (oThis.enable) {
            oThis.onclick(e);
            stopEvent(e);
        }
    };
    if (!this.enable) {
        this.setEnable(this.enable);
    }
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.Button.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Button.prototype.adaptAfterSizeChange = function () {
    var $imageSize = getComputStyle(this.imgG, "width") + getComputStyle(this.imgD, "width");
    this.divCenter.style.width = this.width - $imageSize;
};
rialto.widget.Button.prototype.adaptToContext = function () {
    var $imageSize = getComputStyle(this.imgG, "width") + getComputStyle(this.imgD, "width");
    this.divCenter.style.width = this.width - $imageSize;
};
rialto.widget.Button.prototype.switchImage = function (status) {
    this.imgG.className = "leftEdgeButton" + status;
    this.divCenter.className = "centerButton" + status;
    this._divTitle.className = "textButton" + status;
    this.imgD.className = "rightEdgeButton" + status;
};
rialto.widget.Button.prototype.setEnable = function (enable) {
    if (enable) {
        this._divTitleShadow.style.display = "block";
        this._divTitle.className = "textButton";
        this.switchImage("Off");
    } else {
        this._divTitleShadow.style.display = "none";
        this._divTitle.className = "textButtonDisa";
        this.switchImage("Disa");
    }
    this.enable = enable;
};
rialto.widget.Button.prototype.setTitle = function (title) {
    if (this.alt = this.title) {
        this.alt = title;
    }
    this.title = title;
    this._divTitleShadow.innerHTML = title;
    this._divTitle.innerHTML = title;
};
rialto.widget.Button.prototype.release = function () {
    this.divExt.onmouseout = null;
    this.divExt.onmouseover = null;
    this.divExt.onclick = null;
};


rialto.widget.Radio = function (name, top, left, parent, group, text, checked, className) {
    var objParam = new Object;
    objParam.name = name;
    objParam.type = "radio";
    objParam.left = left;
    objParam.top = top;
    this.base = rialto.widget.AbstractComponent;
    this.base(objParam);
    this.base = null;
    objParam = null;
    this.className = "libNormal";
    this.checked = false;
    this.tabindex = rialto.widget.Form.prototype.tabIndex++;
    this.group = group;
    this.text = text;
    if (rialto.lang.isString(className)) {
        this.className = className;
    }
    if (rialto.lang.isBoolean(checked)) {
        this.checked = checked;
    }
    this.divExt.id = this.id + "_divExt";
    this.divExt.style.position = this.position;
    this.divExt.style.left = this.left + "px";
    this.divExt.style.top = this.top + "px";
    this.divExt.style.height = 20;
    var oThis = this;
    var wInnerHTML = "";
    wInnerHTML = "<input type=\"radio\" id=\"" + this.id + "\" name=\"" + this.group + "\" value=\"" + this.name + "\"  />";
    this.divExt.innerHTML += wInnerHTML;
    this.radio = this.divExt.firstChild;
    this.radio.tabIndex = this.tabindex;
    this.lib = new rialto.widget.Label("LIB1", 2, 20, this.divExt, this.text, this.className, {position:"absolute"});
    this.divExt.style.width = this.lib.getTailleTexte() + 20;
    this.radio.onclick = function () {
        oThis.onclick();
    };
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.Radio.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Radio.prototype.adaptToContext = function () {
    this.radio.checked = this.checked;
};
rialto.widget.Radio.prototype.getCheck = function () {
    rialto.deprecated("Radio", "getCheck()", "isCheck()");
    return this.isCheck();
};
rialto.widget.Radio.prototype.isCheck = function () {
    return this.radio.checked;
};
rialto.widget.Radio.prototype.setCheck = function (check, boolC) {
    this.radio.checked = check;
    this.checked = check;
    if (boolC) {
        this.onclick();
    }
};
rialto.widget.Radio.prototype.release = function () {
    this.radio.onclick = null;
    this.lib.remove();
};
rialto.widget.Radio.prototype.setEnable = function (enable) {
//maskat start
	//this.radio.disabled = !enable;
    this.lib.setEnable(enable);
//maskat end
    this.enable = enable;
};


rialto.widget.Checkbox = function (name, top, left, parent, text, checked, className) {
    var objParam = new Object;
    objParam.name = name;
    objParam.type = "checkbox";
    objParam.left = left;
    objParam.top = top;
    this.base = rialto.widget.AbstractComponent;
    this.base(objParam);
    objParam = null;
    this.className = "libelle1";
    this.initChecked = false;
    this.tabindex = rialto.widget.Form.prototype.tabIndex++;
    this.text = text;
    if (rialto.lang.isString(className)) {
        this.className = className;
    }
    if (rialto.lang.isBoolean(checked)) {
        this.initChecked = checked;
    }
    var oThis = this;
    this.divExt.id = this.id + "_divExt";
    this.divExt.style.position = this.position;
    this.divExt.style.left = this.left + "px";
    this.divExt.style.top = this.top + "px";
    this.divExt.style.height = 20;
    this.checkbox = document.createElement("INPUT");
    this.checkbox.type = "checkbox";
    this.checkbox.id = this.id + "_Check";
    this.checkbox.name = this.name;
    this.checkbox.tabIndex = this.tabIndex;
    this.divExt.appendChild(this.checkbox);
    this.checkbox.onclick = function () {
        oThis.checked = this.checked;
        this.value = this.checked;
        oThis.onclick();
    };
    this.lib = new rialto.widget.Label("LIB1", 3, 20, this.divExt, this.text, this.className, {position:"absolute"});
    this.divExt.style.width = this.lib.getTailleTexte() + 20;
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.Checkbox.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Checkbox.prototype.adaptToContext = function () {
    this.setCheck(this.initChecked, false);
};
rialto.widget.Checkbox.prototype.setEnable = function (enable) {
    if (enable) {
        this.checkbox.disabled = false;
//maskat start
        this.lib.setEnable(true);
//maskat end
    } else {
        this.checkbox.disabled = true;
//maskat start
        this.lib.setEnable(false);
//maskat end
    }
    this.enable = enable;
};
rialto.widget.Checkbox.prototype.setCheck = function (check, boolC) {
    this.checkbox.checked = check;
    this.checked = check;
    this.checkbox.value = check;
    if (boolC) {
        this.onclick();
    }
};
rialto.widget.Checkbox.prototype.getCheck = function () {
    rialto.deprecated("Checkbox", "getCheck()", "isCheck()");
    return this.isCheck();
};
rialto.widget.Checkbox.prototype.isCheck = function () {
    return this.checkbox.checked;
};
rialto.widget.Checkbox.prototype.release = function () {
    this.checkbox.onclick = null;
    this.lib.remove();
};


rialto.widget.Combo = function (tabData, name, top, left, width, parent, objPar) {
    var objParam = new Object;
    objParam.name = name;
    objParam.type = "combo";
    objParam.left = left;
    objParam.top = top;
    objParam.width = width;
    if (objPar != null) {
        objParam.position = objPar.position;
    }
    this.base = rialto.widget.AbstractComponent;
    this.base(objParam);
    this.enable = true;
    this.suggest = true;
    this.open = false;
    this.heightItem = 23;
    if (objPar != null) {
        if (rialto.lang.isBoolean(objPar.suggest)) {
            this.suggest = objPar.suggest;
        }
        if (rialto.lang.isBoolean(objPar.enable)) {
            this.enable = objPar.enable;
        }
        if (rialto.lang.isNumber(objPar.heightItem)) {
            this.heightItem = objPar.heightItem;
        }
    }
    objPar = null;
    objParam = null;
    this.base = null;
    this.currentIndex = -1;
    var oThis = this;
    this.divExt.id = this.id + "_divExt";
    this.divExt.style.position = this.position;
    this.divExt.style.width = this.width;
    this.divExt.style.left = this.left + "px";
    this.divExt.style.top = this.top + "px";
    this.divExt.style.height = 20;
    this.textValue = new rialto.widget.Text(this.name, 0, 0, "", "Hi", this.divExt);
    this.text = new rialto.widget.Text(this.name + "_text", 0, 0, parseInt(this.width) - 14, "A", this.divExt, {autoUp:false, position:"absolute"});
    this.text.champs.className = "combo_input";
    this.text.champs.onkeyup = function (e) {
        if (!e) {
            var e = window.event;
        }
        return oThis.checkKeyPress(e);
        stopEvent(e);
    };
    this.text.champs.onkeypress = function (e) {
        if (!e) {
            var e = window.event;
        }
        return true;
        stopEvent(e);
    };
    this.text.champs.onblur = function () {
//maskat start
    	oThis.onblur();
//maskat end
        oThis.setOpen(false);
    };
    this.bouton = document.createElement("DIV");
    this.img = new rialto.widget.Image("bigDownArrow", 0, 0, this.bouton, rialto.I18N.getLabel("lanOpenButtonText"), "", {position:"absolute"});
    this.bouton.className = "combo_bouton";
    this.img.onclick = function () {
        if (oThis.enable) {
            if (oThis.initListItem.length != oThis.currentListItem.length) {
                oThis.currentListItem = new Array;
                for (i = 0; i < oThis.initListItem.length; i++) {
                    oThis.currentListItem.push(oThis.initListItem[i]);
                }
            }
            oThis.setOpen(!oThis.open);
        }
    };
    this.divExt.appendChild(this.bouton);
    var obj = {name:"MENU-COMBO", posFixe:true, width:parseInt(this.divExt.style.width) - 4, className:"combo_list"};
    this.opslist = new rialto.widget.simpleMenu(obj);
    this.opslist.onClose = function () {
        oThis.setOpen(false);
    };
    this.opslist.onclick = function (item) {
        oThis.selInd(item.index, true);
    };
    this.opslist.onOver = function (item) {
        if (oThis.lastOver && oThis.lastOver != item) {
            oThis.lastOver.out();
        }
        oThis.lastOver = item;
        oThis.currentIndex = item.index;
    };
    if (parent) {
        this.placeIn(parent);
    }
    if (!this.enable) {
        this.setEnable(false);
    }
    this.setData(tabData);
};
rialto.widget.Combo.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Combo.prototype.adaptAfterSizeChange = function () {
    this.text.setWidth(parseInt(this.width) - 14);
};
rialto.widget.Combo.prototype.release = function () {
    this.text.champs.onkeypress = null;
    this.text.champs.onkeyup = null;
    this.text.champs.onblur = null;
    this.opslist.onClose = null;
    this.opslist.onclick = null;
    this.opslist.onOver = null;
    this.img.onclick = null;
    this.img.remove();
    this.text.remove();
    this.textValue.remove();
    this.opslist.remove();
};
rialto.widget.Combo.prototype.setData = function (tabData) {
    this.setValue("");
    this.tabData = tabData;
    this.initListItem = new Array();
    this.currentListItem = new Array();
    for (i = 0; i < this.tabData.length; i++) {
        var item = new ComboItem(this.tabData[i][0], this.tabData[i][1]);
        this.initListItem.push(item);
        this.currentListItem.push(item);
    }
};
rialto.widget.Combo.prototype.checkKeyPress = function (evt) {
    var keyCode = evt.keyCode ? evt.keyCode : evt.charCode ? evt.charCode : evt.which ? evt.which : void 0;
    if (keyCode == 38 || keyCode == 40 || keyCode == 13) {
        if (!this.open) {
            this.prepareList();
            this.setOpen(true);
        }
        switch (keyCode) {
          case 38:
            if (this.currentIndex > 0) {
                this.currentIndex -= 1;
            } else {
                this.currentIndex = 0;
            }
            if (this.lastOver) {
                this.lastOver.out();
            }
            this.lastOver = this.opslist.tabItem[this.currentIndex];
            this.lastOver.over();
            break;
          case 40:
            if (this.currentIndex < this.currentListItem.length - 1) {
                this.currentIndex += 1;
            }
            if (this.lastOver) {
                this.lastOver.out();
            }
            this.lastOver = this.opslist.tabItem[this.currentIndex];
            this.lastOver.over();
            break;
          case 13:
            if (this.currentIndex >= 0) {
                this.opslist.onclick(this.lastOver);
            }
            break;
          default:
            break;
        }
        return false;
    } else {
        this.prepareList();
        if (this.currentListItem.length > 0) {
            this.setOpen(true);
        } else {
            this.setOpen(false);
        }
        return true;
    }
};
rialto.widget.Combo.prototype.setOpen = function (open) {
    if (open) {
        this.displayList(this.currentListItem);
    }
    if (open == this.open) {
        return;
    }
    this.open = open;
    if (open) {
        this.img.setImageReference("bigUpArrow");
        this.opslist.setPosTop(compOffsetTop(this.divExt) + 22);
        this.opslist.setPosLeft(compOffsetLeft(this.divExt) + 2);
        this.opslist.affichezoneMenu(null, 22);
    } else {
        this.img.setImageReference("bigDownArrow");
        this.currentIndex = -1;
        if (this.opslist.ouvert) {
            this.opslist.fermezoneMenu();
        }
    }
};
rialto.widget.Combo.prototype.prepareList = function () {
    if (this.suggest) {
        this.currentListItem = new Array;
        strSaisi = this.text.getValue().toLowerCase();
        for (i = 0; i < this.initListItem.length; i++) {
            if (this.initListItem[i].text.toLowerCase().indexOf(strSaisi) == 0) {
                this.currentListItem.push(this.initListItem[i]);
            }
        }
    }
};
rialto.widget.Combo.prototype.displayList = function (arr) {
    this.opslist.clear();
    this.lastOver = null;
    this.currentIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        var obj = {text:"" + arr[i].text, height:this.heightItem, bNotOut:true};
        var item = this.opslist.addItem(obj);
        item.val = arr[i].value;
        item.index = i;
    }
};
rialto.widget.Combo.prototype.addItem = function (valeur, text) {
    var combItem = new ComboItem(valeur, text);
    this.initListItem.push(combItem);
    this.currentListItem.push(combItem);
};
rialto.widget.Combo.prototype.selLast = function (execAppliCode) {
    var indLast = this.initListItem.length - 1;
    this.selInd(indLast, execAppliCode);
};
rialto.widget.Combo.prototype.selInd = function (ind, execAppliCode) {
    if (ind >= 0 && ind < this.currentListItem.length) {
        if (this.opslist.ouvert) {
            this.setOpen(false);
        }
        var text = this.currentListItem[ind].text;
        var value = this.currentListItem[ind].value;
        this.text.setValue(text);
        this.textValue.setValue(value);
        if (execAppliCode) {
            this.onclick(value, text);
        }
    }
};
rialto.widget.Combo.prototype.selFirst = function (execAppliCode) {
    this.selInd(0, execAppliCode);
};
rialto.widget.Combo.prototype.selWithValue = function (value, execAppliCode) {
    var ind = this.indexOf(value);
    if (ind != -1) {
        this.selInd(ind, execAppliCode);
    }
};
rialto.widget.Combo.prototype.selWithText = function (text, execAppliCode) {
    var ind = this.indexOfText(text);
    if (ind != -1) {
        this.selInd(ind, execAppliCode);
    }
};
rialto.widget.Combo.prototype.setValue = function (value) {
    this.text.setValue(value);
};
rialto.widget.Combo.prototype.indexOf = function (value) {
    for (i = 0; i < this.initListItem.length; i++) {
        if (this.initListItem[i].value == value) {
            return i;
        }
    }
    return -1;
};
rialto.widget.Combo.prototype.indexOfText = function (text) {
    for (i = 0; i < this.initListItem.length; i++) {
        if (this.initListItem[i].text == text) {
            return i;
        }
    }
    return -1;
};
rialto.widget.Combo.prototype.setEnable = function (enable) {
//maskat start
    this.text.champs.className = "combo_input";
    if (enable) {
        this.text.setEnable(true);
    	this.text.champs.style.backgroundColor = "white";
    } else {
        this.text.setEnable(false);
    	this.text.champs.style.backgroundColor = "silver";
    }
//maskat end
    this.text.champs.style.border = "1px solid rgb(120,172,255)";
    this.enable = enable;
};
rialto.widget.Combo.prototype.setFocus = function () {
    this.text.setFocus();
};
rialto.widget.Combo.prototype.getSelValue = function () {
    return this.textValue.getValue();
};
rialto.widget.Combo.prototype.getSelText = function () {
    return this.text.getValue();
};
rialto.widget.Combo.prototype.getText = function (ind) {
    if (ind >= 0 && ind < this.initListItem.length) {
        return this.initListItem[ind].text;
    } else {
        return null;
    }
};
rialto.widget.Combo.prototype.getValue = function (ind) {
    if (ind) {
        if (ind >= 0 && ind < this.initListItem.length) {
            return this.initListItem[ind].text;
        } else {
            return null;
        }
    } else {
        return this.text.getValue();
    }
};
rialto.widget.Combo.prototype.onclick = function (value, text) {
};
function ComboItem(value, text) {
    this.text = text;
    this.value = value;
}


rialto.widget.codeLabel = function (codeName, top, left, width, parent, objPar) {
    var objParam = {type:"codelib", name:codeName, left:left, top:top, width:width};
    this.base = rialto.widget.AbstractComponent;
    this.base(objParam);
    this.withLabel = true;
    this.url = null;
    this.submitOnload = true;
    this.arrPermValue = new Array;
    this.codeWidth = 40;
    this.alwaysRefresh = false;
    this.dataLoadOnce = false;
    if (objPar != null) {
        if (objPar.arrValue) {
            this.arrPermValue = objPar.arrValue;
        }
        if (rialto.lang.isBoolean(objPar.withLabel)) {
            this.withLabel = objPar.withLabel;
        }
        if (objPar.url) {
            this.url = objPar.url;
        }
        if (rialto.lang.isBoolean(objPar.submitOnload)) {
            this.submitOnload = objPar.submitOnload;
        }
        if (rialto.lang.isBoolean(objPar.alwaysRefresh)) {
            this.alwaysRefresh = objPar.alwaysRefresh;
        }
        if (rialto.lang.isNumber(objPar.codeWidth)) {
            this.codeWidth = objPar.codeWidth != 0 ? objPar.codeWidth : 40;
        }
    }
    if (!this.withLabel) {
        this.codeWidth = this.width - 27;
    }
    objPar = null;
    objParam = null;
    this.base = null;
    var oThis = this;
    this.divExt.className = "codeLabel_divGen";
    this.divExt.style.width = this.width;
    this.divExt.style.height = 23;
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.code = new rialto.widget.Text(this.name, 0, 0, this.codeWidth, "A", this.divExt, {autoUp:false, position:"absolute"});
    this.img = new rialto.widget.Image("pinkHelpButton", this.codeWidth, -2, this.divExt, rialto.I18N.getLabel("lanHelpButton"), "redHelpButton", {position:"absolute"});
    if (this.withLabel) {
        this.label = new rialto.widget.Text("LIB" + this.name, 0, this.codeWidth + 27, this.width - (this.codeWidth + 27), "A", this.divExt, {disable:true, position:"absolute"});
        this.label.champs.className = "codeLabel_label";
    }
    this.img.onclick = function () {
        var fen = new FenRech(oThis, oThis.submitOnload);
    };
    if (this.url) {
        this.remote = new rialto.io.AjaxRequest({url:this.url, method:"get", callBackObjectOnSuccess:this, withWaitWindow:true, onSuccess:this.refreshPermissiveValue});
    }
    this.code.onblur = function () {
        if (oThis.code.getValue() != "") {
            if (this.wchanged) {
                oThis.checkValue();
            }
        } else {
            if (oThis.withLabel) {
                oThis.label.setValue("");
            }
            oThis.code.removeAsRequired();
        }
    };
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.codeLabel.prototype = new rialto.widget.AbstractComponent;
rialto.widget.codeLabel.prototype.adaptAfterSizeChange = function () {
    if (this.withLabel) {
        this.label.setWidth(this.width - (this.codeWidth + 27));
    } else {
        this.codeWidth = this.width - 27;
        this.code.setWidth(this.codeWidth);
    }
    this.img.setLeft(this.codeWidth);
};
rialto.widget.codeLabel.prototype.release = function () {
    this.code.remove();
    this.img.remove();
    if (this.withLabel) {
        this.label.remove();
    }
};
rialto.widget.codeLabel.prototype.checkValue = function () {
    if ((this.url && this.alwaysRefresh) || (this.url && !this.dataLoadOnce)) {
        var pars = this.name + "=" + this.getValue();
        this.remote.load(pars);
    } else {
        this.checkInPermissiveValue();
    }
};
rialto.widget.codeLabel.prototype.checkInPermissiveValue = function () {
    if (this.getValue() == "") {
        if (this.withLabel) {
            this.label.setValue("");
            return;
        }
    }
    var ind = this.indexOf(this.getValue());
    if (ind != -1) {
        if (this.withLabel) {
            this.label.setValue(this.arrPermValue[ind][1]);
        }
        this.code.removeAsRequired();
    } else {
        if (this.withLabel) {
            this.label.setValue("?");
        }
        info = new rialto.widget.Alert(rialto.I18N.getLabel("lanInvalidCode"));
        this.code.showAsRequired();
        this.code.setFocus();
    }
};
rialto.widget.codeLabel.prototype.indexOf = function (obj) {
    for (var i = 0; i < this.arrPermValue.length; i++) {
        if (this.arrPermValue[i][0] == obj) {
            return i;
        }
    }
    return -1;
};
rialto.widget.codeLabel.prototype.setPermissiveValue = function (arrPermValue) {
    this.arrPermValue = arrPermValue;
};
rialto.widget.codeLabel.prototype.getValue = function () {
    return this.code.getValue();
};
rialto.widget.codeLabel.prototype.isNotEmpty = function () {
    return (this.label.getValue() != "");
};
rialto.widget.codeLabel.prototype.setValue = function (code, libelle) {
    this.code.setValue(code);
    if (this.withLabel) {
        this.label.setValue(libelle);
    }
    this.code.removeAsRequired();
};
rialto.widget.codeLabel.prototype.refreshPermissiveValue = function (request) {
    var res = eval("(" + request.responseText + ")");
    this.setPermissiveValue(res);
    this.checkInPermissiveValue();
    this.dataLoadOnce = true;
};
rialto.widget.codeLabel.prototype.checkOneValue = function (request) {
    var res = eval("(" + request.responseText + ")");
    if (res.codeOk && this.withLabel) {
        this.label.setValue(res.label);
    }
    this.dataLoadOnce = true;
};
rialto.widget.codeLabel.prototype.active = function () {
    rialto.deprecated("CodeLib", "active", "setEnable(true)");
    this.setEnable(true);
};
rialto.widget.codeLabel.prototype.inactive = function () {
    rialto.deprecated("CodeLib", "inactive", "setEnable(false)");
    this.setEnable(false);
};
rialto.widget.codeLabel.prototype.setEnable = function (enable) {
    if (enable) {
        this.code.setEnable(true);
        if (this.withLabel) {
            this.label.setEnable(true);
            this.label.setStyle({backgroundColor:"#E2F4FF"});
        }
        this.img.setEnable(true);
    } else {
        this.setValue("", "");
        this.code.setEnable(false);
        if (this.withLabel) {
            this.label.setEnable(false);
        }
        this.img.setEnable(false);
    }
    this.enable = enable;
};
FenRech.prototype.nbreInstance = 0;
function FenRech(refParent, submitOnload) {
    this.id = "FenRechCodeLib_" + FenRech.prototype.nbreInstance++;
    rialto.session.reccord(this, this.id);
    var oThis = this;
    this.refParent = refParent;
    this.fen = new rialto.widget.PopUp("fen", 50, 200, 420, 410, "", rialto.I18N.getLabel("lanHelpButton"), "transparent");
    this.fen.onClose = function () {
        oThis.remove();
    };
    this.CADRE1 = new rialto.widget.Frame({name:"CADRE1", top:10, left:10, width:375, height:45, title:rialto.I18N.getLabel("lanCodeFind"), dynamic:false, open:true, parent:this.fen});
    var url = this.refParent.url;
    var obj = {boolWithFenWait:true, callBackObjectOnSuccess:this, onSuccess:this.refreshData};
    this.FORM1 = new rialto.widget.Form("FORM1", url, this.CADRE1, obj);
    var oParent = this.FORM1;
    this.CODE = new rialto.widget.Text(refParent.name, 10, 5, 260, "A", oParent, {position:"absolute"});
    this.BRECH = new rialto.widget.Button(11, 270, rialto.I18N.getLabel("lanFindButton"), rialto.I18N.getLabel("lanFindButton"), oParent);
    this.BRECH.onclick = function () {
        if ((oThis.refParent.url && oThis.refParent.alwaysRefresh) || (oThis.refParent.url && !oThis.refParent.dataLoadOnce)) {
            oThis.FORM1.submitForm();
        } else {
            oThis.arrPermValue = oThis.refParent.arrPermValue;
            oThis.checkInPermissiveValue();
        }
    };
    if (this.refParent.withLabel) {
        tabEntete = [rialto.I18N.getLabel("lanCodeHeader"), rialto.I18N.getLabel("lanLabelHeader")];
        tabTypeCol = [["string", 85], ["string", 205]];
    } else {
        tabEntete = ["Code"];
        tabTypeCol = [["string", 290]];
    }
    this.tableauRes = new rialto.widget.Grid({TabEntete:tabEntete, name:"TabRvMvt", top:65, left:10, height:310, bNavig:false, rang:12, tabTypeCol:tabTypeCol, objPar:{autoWidth:true}, parent:this.fen});
    this.tableauRes.onclick = function (indLigne, indCell) {
        oThis.code = this.tabData[indLigne][0];
        oThis.lib = this.tabData[indLigne][1];
    };
    this.tableauRes.ondbleclick = function (indLigne, indCell) {
        var code = this.tabData[indLigne][0];
        var lib = this.tabData[indLigne][1];
        oThis.refParent.setValue(code, lib);
        oThis.fen.closeWindow();
    };
    this.BENTR = new rialto.widget.Button(385, 170, rialto.I18N.getLabel("lanSelectButtonText"), rialto.I18N.getLabel("lanSelectButtonText"), this.fen);
    this.BENTR.onclick = function () {
        oThis.refParent.setValue(oThis.code, oThis.lib);
        oThis.fen.closeWindow();
    };
    if (submitOnload) {
        this.BRECH.onclick();
    }
}
FenRech.prototype.checkInPermissiveValue = function () {
    var text = this.CODE.getValue();
    var arr = new Array;
    if (text == "") {
        arr = this.refParent.arrPermValue;
    } else {
        for (var i = 0; i < this.refParent.arrPermValue.length; i++) {
            for (var j = 0; j < this.refParent.arrPermValue[i].length; j++) {
                if (this.refParent.arrPermValue[i][j].indexOf(text) != -1) {
                    arr.push(this.refParent.arrPermValue[i]);
                    j = this.refParent.arrPermValue[i].length;
                }
            }
        }
    }
    if (arr.length == 0) {
        info = new rialto.widget.Alert(rialto.I18N.getLabel("lanNoCodeFind"));
    }
    this.tableauRes.fillGrid(arr);
};
FenRech.prototype.remove = function (request) {
    this.BRECH.onclick = null;
    this.BENTR.onclick = null;
    this.tableauRes.onclick = null;
    this.tableauRes.ondbleclick = null;
    this.CADRE1.remove();
    this.BENTR.remove();
    this.tableauRes.remove();
    rialto.session.objects[this.id] = null;
};
FenRech.prototype.refreshData = function (request) {
    var res = eval("(" + request.responseText + ")");
    this.arrPermValue = res;
    this.tableauRes.fillGrid(this.arrPermValue);
    this.refParent.arrPermValue = this.arrPermValue;
    this.refParent.dataLoadOnce = true;
};


rialto.widget.Calendar = function (objPar) {
    if (!objPar) {
        var objPar = {};
    }
    objPar.type = "calendar";
    this.base = rialto.widget.AbstractComponent;
    this.base(objPar);
    this.dateMin = null;
    this.dateMax = null;
    this.bOpenOnLastDate = true;
    this.bUkFormat = false;
    this.popUpMode = false;
    this.arrDay = new Array(31);
    this.currentDate = rialto.date.toDay();
    if (objPar != null) {
        if (rialto.lang.isDate(objPar.dateMin)) {
            this.dateMin = objPar.dateMin;
        }
        if (rialto.lang.isDate(objPar.dateMax)) {
            this.dateMax = objPar.dateMax;
            if (this.dateMin && this.dateMax < this.dateMin) {
                var d = this.dateMin;
                this.dateMin = this.dateMax;
                this.dateMax = d;
            }
        }
        if (rialto.lang.isDate(objPar.currentDate)) {
            this.currentDate = objPar.currentDate;
        }
        if (rialto.lang.isBoolean(objPar.bOpenOnLastDate)) {
            this.bOpenOnLastDate = objPar.bOpenOnLastDate;
        }
        if (rialto.lang.isBoolean(objPar.popUpMode)) {
            this.popUpMode = objPar.popUpMode;
        }
        if (rialto.lang.isBoolean(objPar.bUkFormat)) {
            this.bUkFormat = objPar.bUkFormat;
        }
    }
    this._SpecialDate = new Array, this.setCurrent();
    this.createCalendar(objPar.parent);
    objPar = null;
    this.base = null;
};
rialto.widget.Calendar.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Calendar.prototype._Holidays = new Array("01/01", "01/05", "08/05", "14/07", "15/08", "01/11", "11/11", "25/12");
rialto.widget.Calendar.prototype._Month = rialto.I18N.getLabel("lanCalendarMonths");
rialto.widget.Calendar.prototype._Day = rialto.I18N.getLabel("lanCalendarDays");
rialto.widget.Calendar.prototype._LastDayInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
rialto.widget.Calendar.prototype.DimanchePaques = false;
rialto.widget.Calendar.prototype.isDate = function (wDate) {
    return (wDate instanceof Date);
};
rialto.widget.Calendar.prototype.isHolidays = function (jf, mf) {
    var i = 0;
    mf += 1;
    for (var i in this._Holidays) {
        if (test = (((jf < 10) ? "0" + jf : jf) + "/" + ((mf < 10) ? "0" + mf : mf)) == this._Holidays[i++]) {
            return true;
        }
    }
    return false;
};
rialto.widget.Calendar.prototype.isWeekEnd = function (jwe) {
    return (((jwe == 5) || (jwe == 6)) ? true : false);
};
rialto.widget.Calendar.prototype.isToday = function (day) {
    var date1 = new Date(this.currentYear, this.currentMonth, day);
    return rialto.date.equals(date1, rialto.date.toDay());
};
rialto.widget.Calendar.prototype.isDisable = function (day) {
    var dTest = new Date(this.currentYear, this.currentMonth, day);
    var check = false;
    if (rialto.lang.isDate(this.dateMin) && dTest < this.dateMin) {
        check = true;
    }
    if (rialto.lang.isDate(this.dateMax) && dTest > this.dateMax) {
        check = true;
    }
    return check;
};
rialto.widget.Calendar.prototype.setDateMin = function (nDateMin) {
    if (rialto.lang.isDate(nDateMin)) {
        this.dateMin = nDateMin;
    } else {
        this.dateMin = null;
    }
};
rialto.widget.Calendar.prototype.setDateMax = function (nDateMax) {
    if (rialto.lang.isDate(nDateMax)) {
        this.dateMax = nDateMax;
        if (this.dateMin && this.dateMax < this.dateMin) {
            var d = this.dateMin;
            this.dateMin = this.dateMax;
            this.dateMax = d;
        }
    } else {
        this.dateMax = null;
    }
};
rialto.widget.Calendar.prototype.isPaques = function (pan) {
    this.DimanchePaques = true;
    var b = pan - 1900;
    var c = pan % 19;
    var d = Math.floor((7 * c + 1) / 19);
    var e = (11 * c + 4 - d) % 29;
    var f = Math.floor(b / 4);
    var g = (b + f + 31 - e) % 7;
    var date = 25 - e - g;
    if (date > 0) {
        mois = 4;
    } else {
        date = 31 + date;
        mois = 3;
    }
    date = ((date < 10) ? "0" + date : date);
    this._Holidays.push(((date < 10) ? "0" + date : date) + "/" + ((mois < 10) ? "0" + mois : mois));
    date += 1;
    if ((date > 31) && (mois = 3)) {
        date = 1;
        mois += 1;
    }
    this._Holidays.push(((date < 10) ? "0" + date : date) + "/" + ((mois < 10) ? "0" + mois : mois));
    date += 38;
    while (date > 31) {
        var tt = 0;
        date -= this._LastDayInMonth[mois - 1 + tt];
        tt++;
        mois += 1;
    }
    this._Holidays.push(((date < 10) ? "0" + date : date) + "/" + ((mois < 10) ? "0" + mois : mois));
    date += 10;
    while (date > 31) {
        var tt = 0;
        date -= this._LastDayInMonth[mois - 1 + tt];
        mois += 1;
    }
    this._Holidays.push(((date < 10) ? "0" + date : date) + "/" + ((mois < 10) ? "0" + mois : mois));
};
rialto.widget.Calendar.prototype.setCurrent = function () {
    this.currentDay = this.currentDate.getDate();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
};
rialto.widget.Calendar.prototype.setSpecialDate = function (date, color, text) {
    this._SpecialDate.push([date, color, text]);
};
rialto.widget.Calendar.prototype.removeSpecialDate = function () {
    this._SpecialDate = new Array;
};
rialto.widget.Calendar.prototype.isInSpecialDate = function (date) {
    for (var i = 0; i < this._SpecialDate.length; i++) {
        if (rialto.lang.isDate(this._SpecialDate[i][0])) {
            if (rialto.date.equals(this._SpecialDate[i][0], date)) {
                return i;
            }
        } else {
            var inter = this._SpecialDate[i][0];
            if (date >= inter[0] && date <= inter[1]) {
                return i;
            }
        }
    }
    return -1;
};
rialto.widget.Calendar.prototype.setMonthYear = function (m, a) {
    if (m > 11) {
        m = 0;
        a++;
    }
    if (m < 0) {
        m = 11;
        a--;
    }
    this.currentMonth = m;
    this.currentYear = a;
    this.fillCalendar();
};
rialto.widget.Calendar.prototype.displayCalendar = function (top, left) {
    if (!this.bOpenOnLastDate) {
        this.setCurrent();
    }
    this.fillCalendar();
    if (this.popUpMode) {
        this.liste.setPosTop(top);
        this.liste.setPosLeft(left);
        this.liste.affichezoneMenu();
    }
};
rialto.widget.Calendar.prototype.createCalendar = function (parent) {
    var oThis = this;
    this.divExt.id = "divExt";
    this.divExt.style.position = "absolute";
    this.divExt.style.zIndex = 1000;
    this.divExt.style.width = 200;
    this.divExt.onclick = function (e) {
        if (!e) {
            e = window.event;
        }
        stopEvent(e);
    };
    var oParent = this.divExt;
    var divDeco = new rialto.widget.decoration("popup", oParent);
    this.header = document.createElement("DIV");
    this.header.style.width = "100%";
    this.header.style.height = "30px";
    this.header.style.position = "absolute";
    this.header.style.top = 0;
    this.header.style.left = 0;
    this.divExt.appendChild(this.header);
    oParent = this.header;
    this.btnPreviousYear = new rialto.widget.Image("btonFirstDoctOff", 5, 5, oParent, rialto.I18N.getLabel("lanPreviousYear"), "btonFirstDoctOn", {position:"absolute"});
    this.btnPreviousYear.onclick = function () {
        oThis.setMonthYear(oThis.currentMonth, oThis.currentYear - 1);
    };
    this.btnPreviousMonth = new rialto.widget.Image("leftArrowOff", 25, 5, oParent, rialto.I18N.getLabel("lanPreviousMonth"), "leftArrowOn", {position:"absolute"});
    this.btnPreviousMonth.onclick = function () {
        oThis.setMonthYear(oThis.currentMonth - 1, oThis.currentYear);
    };
    this.currentMonthYear = document.createElement("DIV");
    this.currentMonthYear.className = "cal_current_month";
    this.header.appendChild(this.currentMonthYear);
    this.btnNextMonth = new rialto.widget.Image("rightArrowOff", 143, 5, oParent, rialto.I18N.getLabel("lanNextMonth"), "rightArrowOn", {position:"absolute"});
    this.btnNextMonth.onclick = function () {
        oThis.setMonthYear(oThis.currentMonth + 1, oThis.currentYear);
    };
    this.btnNextYear = new rialto.widget.Image("btonLastDoctOff", 160, 5, oParent, rialto.I18N.getLabel("lanNextYear"), "btonLastDoctOn", {position:"absolute"});
    this.btnNextYear.onclick = function () {
        oThis.setMonthYear(oThis.currentMonth, oThis.currentYear + 1);
    };
    if (this.popUpMode) {
        this.btnClose = new rialto.widget.Image("btonFenFermOff", 175, 5, oParent, rialto.I18N.getLabel("lanCloseButtonText"), "btonFenFermOn");
        this.btnClose.onclick = function () {
            oThis.closeCalendar();
        };
    }
    for (var j = 0; j < 7; j++) {
        var LibelleCelluleCalendar = document.createElement("DIV");
        LibelleCelluleCalendar.id = "cal_day_of_week";
        LibelleCelluleCalendar.className = "cal_day_of_week";
        LibelleCelluleCalendar.style.left = (5 + (j * 25)) + "px";
        if (j != 6) {
            LibelleCelluleCalendar.style.borderRight = "1px solid #4AA5C9";
        }
        this.header.appendChild(LibelleCelluleCalendar);
        LibelleCelluleCalendar.innerHTML = this._Day[j];
    }
    this.zoneCalendar = document.createElement("DIV");
    this.zoneCalendar.style.width = "100%";
    this.zoneCalendar.style.position = "absolute";
    this.zoneCalendar.style.top = 50;
    this.zoneCalendar.style.left = 0;
    this.divExt.appendChild(this.zoneCalendar);
    if (this.popUpMode) {
        var obj = {name:"MENU-CALENDAR", posFixe:true};
        this.liste = new rialto.widget.simpleMenu(obj);
        this.liste.add(this.divExt);
    } else {
        if (parent) {
            this.divExt.style.top = this.top;
            this.divExt.style.left = this.left;
            this.placeIn(parent);
            this.fillCalendar();
        }
    }
};
rialto.widget.Calendar.prototype.afterOnClick = function (day, oHtml) {
    this.currentDate = new Date(this.currentYear, this.currentMonth, day);
    var clickDay = day < 10 ? "0" + day : day;
    var clickMonth = this.currentMonth + 1 < 10 ? "0" + (this.currentMonth + 1) : this.currentMonth + 1;
    var clickYear = this.currentYear;
    if (this.clickDiv) {
        this.setSytleOfOneDay(this.clickDiv);
    }
    if (oHtml) {
        this.setSytleOfOneDay(oHtml);
    }
//maskat start
    var strDate = clickYear + "年" + clickMonth + "月" + clickDay + "日";
/*    var strDate = "/" + clickYear;
    if (this.bUkFormat) {
        strDate = clickMonth + "/" + clickDay + strDate;
    } else {
        strDate = clickDay + "/" + clickMonth + strDate;
    }*/
//maskat end
    this.onclick(strDate);
    if (this.popUpMode) {
        this.closeCalendar();
    }
};
rialto.widget.Calendar.prototype.onclick = function (dateSel) {
};
rialto.widget.Calendar.prototype.closeCalendar = function () {
    if (this.popUpMode) {
        this.liste.fermezoneMenu();
    }
};
rialto.widget.Calendar.prototype.fillCalendar = function () {
    var oThis = this;
    this.zoneCalendar.innerHTML = "";
//maskat start
    text = this.currentYear + "年" + this._Month[this.currentMonth];
//maskat end
    this.currentMonthYear.innerHTML = text;
    this.firstDay = new Date(this.currentYear, this.currentMonth).getDay() - 1;
    if (this.firstDay < 0) {
        this.firstDay = 6;
    }
    if (rialto.date.isBissextile(this.currentYear)) {
        this._LastDayInMonth[1] = 29;
    } else {
        this._LastDayInMonth[1] = 28;
    }
    if (!this.DimanchePaques) {
        this.isPaques(this.currentYear);
    }
    var nbCol = Math.ceil((this.firstDay + this._LastDayInMonth[this.currentMonth]) / 7);
    if (nbCol > 5) {
        this.divExt.style.height = 150;
    } else {
        this.divExt.style.height = 135;
    }
    var oThis = this;
    for (s = 0; s < nbCol; s++) {
        for (j = 0; j < 7; j++) {
            var day = 7 * s + j - this.firstDay + 1;
            var oneDay = document.createElement("DIV");
            oneDay.style.left = (5 + (j * 25)) + "px";
            oneDay.style.top = (s * 15) + "px";
            oneDay.borderStyle = {};
            oneDay.jw = j;
            oneDay.jM = day;
            if (s < nbCol) {
                oneDay.borderStyle.borderBottomWidth = "1px";
            }
            if (j != 6) {
                oneDay.borderStyle.borderRightWidth = "1px";
            }
            this.zoneCalendar.appendChild(oneDay);
            this.setSytleOfOneDay(oneDay);
            if (day > 0 && day <= this._LastDayInMonth[this.currentMonth]) {
                oneDay.innerHTML = day;
                this.arrDay[day] = oneDay;
                oneDay.onclick = function () {
                    oThis.afterOnClick(this.jM, this);
                };
                if (day == this._LastDayInMonth[this.currentMonth]) {
                    break;
                }
            }
        }
    }
    oneDay = null;
};
rialto.widget.Calendar.prototype.setSytleOfOneDay = function (oneDay) {
    var day = oneDay.jM;
    var s = oneDay.style;
    oneDay.className = "cal_default_day";
    for (prop in oneDay.borderStyle) {
        s[prop] = oneDay.borderStyle[prop];
    }
    if (day > 0) {
        if (this.isDisable(day)) {
            oneDay.className += " cal_disable_day";
        } else {
            var date1 = new Date(this.currentYear, this.currentMonth, day);
            if (this.isWeekEnd(oneDay.jw)) {
                oneDay.className += " cal_weekend_day";
            }
            if (this.isHolidays(day, this.currentMonth)) {
                oneDay.className += " cal_holidays_day";
            }
            if (this.isToday(day)) {
                oneDay.className += " cal_today_day";
            }
            if (rialto.date.equals(date1, this.currentDate)) {
                this.clickDiv = oneDay;
                oneDay.className += " cal_select_day";
            }
            ind = this.isInSpecialDate(date1);
            if (ind != -1) {
                s.backgroundColor = this._SpecialDate[ind][1];
                oneDay.title = this._SpecialDate[ind][2];
            }
        }
    }
};
rialto.widget.Calendar.prototype.release = function () {
    this.divExt.onclick = null;
    for (i = 0; i < 32; i++) {
        if (this.arrDay[i]) {
            this.arrDay[i].borderStyle = null;
            this.arrDay[i].onclick = null;
            this.arrDay[i] = null;
        }
    }
    this.btnPreviousYear.remove();
    this.btnPreviousMonth.remove();
    this.btnNextMonth.remove();
    this.btnNextYear.remove();
    if (this.popUpMode) {
        this.liste.remove();
        this.btnClose.remove();
    }
};
rialto.widget.Calendar.prototype.getHtmlExt = function () {
    return this.divExt;
};


rialto.widget.Grid = function (objPar) {
    if (!objPar) {
        return;
    }
    this.base = rialto.widget.AbstractComponent;
    objPar.type = "grid";
    this.base(objPar);
    this.base = null;
    this.WIDTHSEP = 3;
    this.navigation = false;
    this.tabData = new Array();
    this.tabEntete = objPar.TabEntete;
    this.NbreCol = objPar.TabEntete.length;
    this.NbreLig = 0;
    this.rang = 15;
    this.autoResizeContenu = false;
    this.autoResizeParent = false;
    this.cellActive = false;
    this.sortable = true;
    this.multiSelect = false;
    this.lineHeight = 16;
    this.decalage = 0;
    this.boolPrint = true;
    this.switchable = true;
    this.actifClic = true;
    this.titrePrint = rialto.I18N.getLabel("lanPrintTableHeadline");
    this.writable = false;
    this.widthLastCell = 20;
    this.indLineClic = -1;
    this.debInd = 0;
    this.finInd = 0;
    if (rialto.lang.isBoolean(objPar.bNavig)) {
        this.navigation = objPar.bNavig;
    }
    if (rialto.lang.isBoolean(objPar.cellActive)) {
        this.cellActive = objPar.cellActive;
    }
    if (rialto.lang.isBoolean(objPar.sortable)) {
        this.sortable = objPar.sortable;
    }
    if (rialto.lang.isBoolean(objPar.multiSelect)) {
        this.multiSelect = objPar.multiSelect;
    }
    if (rialto.lang.isNumber(objPar.lineHeight)) {
        this.lineHeight = objPar.lineHeight;
    }
    if (rialto.lang.isNumber(objPar.rang)) {
        this.rang = objPar.rang;
    }
    if (rialto.lang.isNumber(objPar.widthLastCell)) {
        this.widthLastCell = objPar.widthLastCell;
    }
    if (rialto.lang.isBoolean(objPar.actifClic)) {
        this.actifClic = objPar.actifClic;
    }
    if (rialto.lang.isBoolean(objPar.boolPrint)) {
        this.boolPrint = objPar.boolPrint;
    }
    if (rialto.lang.isBoolean(objPar.switchable)) {
        this.switchable = objPar.switchable;
    }
    if (rialto.lang.isString(objPar.printTitle)) {
        this.printTitle = objPar.printTitle;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeContenu)) {
        this.autoResizeContenu = objPar.autoResizeContenu;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeParent)) {
        this.autoResizeParent = objPar.autoResizeParent;
        this.autoResizableH = this.autoResizeParent;
    }
    if (rialto.lang.isBoolean(objPar.writable)) {
        this.writable = objPar.writable;
        this.lineHeight = Math.max(20, parseInt(this.lineHeight));
    }
    this.idInt = 0;
    this.mapArray = new Array;
    this.tabTypeCol = new Array();
    if (objPar.tabTypeCol) {
        this.tabTypeCol = objPar.tabTypeCol;
    } else {
        for (var i = 0; i < this.NbreCol; i++) {
            this.tabTypeCol.push(["string", 100]);
        }
    }
    this.width = ((this.NbreCol - 1) * parseInt(this.WIDTHSEP)) + 40 + this.widthLastCell;
    for (var i = 0; i < this.NbreCol; i++) {
        this.width += this.tabTypeCol[i][1];
    }
    this.widthMin = this.width;
    this.initWithCol = new Array();
    for (var i = 0; i < this.NbreCol; i++) {
        this.initWithCol[i] = this.tabTypeCol[i][1];
    }
    var line, cell;
    var oThis = this;
    this.divExt.id = this.id + "_divExt";
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.width = this.width + "px";
    this.divExt.style.position = this.position;
    if (this.switchable || this.navigation) {
        this.Div_nav = document.createElement("DIV");
        this.Div_nav.id = this.id + "_Div_nav";
        this.Div_nav.className = "grid_navigationArea";
        this.Div_nav.style.display = "none";
        this.divExt.appendChild(this.Div_nav);
        this.arrG = new rialto.widget.Image("leftEdgeRoundDashBoard", 0, 1, this.Div_nav, "", "", {position:"absolute"});
        this.arrD = new rialto.widget.Image("rightEdgeRoundDashBoard", 255, 1, this.Div_nav, "", "", {position:"absolute"});
        this.Div_navBoutTexte = document.createElement("DIV");
        this.Div_navBoutTexte.id = this.id + "_Div_nav";
        this.Div_navBoutTexte.className = "grid_navigationTextArea";
        this.Div_nav.appendChild(this.Div_navBoutTexte);
        var Parent = this.Div_navBoutTexte;
        this.bouFirst = new rialto.widget.Image("btonFirstDoctOff", 0, 5, Parent, this.rang + rialto.I18N.getLabel("lanGridButtonFirst"), "btonFirstDoctOn", {position:"absolute"});
        this.bouFirst.onclick = function () {
            oThis.firstN();
        };
        this.bouFirst.setVisible(false);
        this.boutPrevious = new rialto.widget.Image("leftArrowOff", 20, 5, Parent, this.rang + rialto.I18N.getLabel("lanGridButtonPrevious"), "leftArrowOn", {position:"absolute"});
        this.boutPrevious.onclick = function () {
            oThis.previousN();
        };
        this.boutPrevious.setVisible(false);
        this.Div_text = document.createElement("DIV");
        this.Div_text.className = "Div_text";
        this.Div_text.id = this.id + "_Div_text";
        this.Div_navBoutTexte.appendChild(this.Div_text);
        this.boutNext = new rialto.widget.Image("rightArrowOff", 190, 5, Parent, this.rang + rialto.I18N.getLabel("lanGridButtonNext"), "rightArrowOn", {position:"absolute"});
        this.boutNext.onclick = function () {
            oThis.nextN();
        };
        this.boutNext.setVisible(false);
        this.boutLast = new rialto.widget.Image("btonLastDoctOff", 210, 5, Parent, this.rang + rialto.I18N.getLabel("lanGridButtonLast"), "btonLastDoctOn", {position:"absolute"});
        this.boutLast.onclick = function () {
            oThis.lastN();
        };
        this.boutLast.setVisible(false);
        if (this.navigation) {
            this.Div_nav.style.display = "block";
        }
    }
    this.tableauEntete = document.createElement("DIV");
    this.tableauEntete.id = this.id + "tableEntete";
    this.tableauEntete.className = "grid_header";
    this.tableauEntete.style.width = "100%";
    this.tableauEntete.position = "relative";
    this.divExt.appendChild(this.tableauEntete);
    this.tableauHTML = document.createElement("DIV");
    this.divExt.appendChild(this.tableauHTML);
    this.tableauHTML.className = "grid_data";
    this.tableauHTML.style.width = "100%";
    this.tableauHTML.style.fontSize = "0";
    this.tableauHTML.style.overflow = "auto";
    this.tableauHTML.id = this.id + "tableData";
    this.tableauHTML.position = "relative";
    this.arrowUp = document.createElement("DIV");
    this.arrowUp.className = "arrowUp";
    this.arrowDown = document.createElement("DIV");
    this.arrowDown.className = "arrowDown";
    this.divCoche = document.createElement("DIV");
    this.divCoche.className = "coche";
    this.cellSep = document.createElement("DIV");
    this.cellSep.className = "cellSep";
    this.cellSep.style.width = this.WIDTHSEP;
    var line = document.createElement("DIV");
    line.style.width = this.width - 20 + "px";
    line.style.height = "100%";
    var cell = document.createElement("DIV");
    cell.className = "header_left_img";
    cell.type = "cell";
    line.appendChild(cell);
    this.oCiu = this;
    this.heightVisibleCol = function () {
        var temp = Math.min(parseInt(this.oCiu.getRealHeight()), parseInt(this.oCiu.divExt.offsetHeight) - (this.oCiu.navigation ? getComputStyle(this.oCiu.Div_nav, "height") : 0));
        return temp;
    };
    for (var j = 0; j < this.NbreCol; j++) {
        cell = document.createElement("DIV");
        cell.id = this.id + "_CellEntete_" + j;
        cell.className = "header_cell";
        cell.style.width = this.tabTypeCol[j][1] + "px";
        cell.ind = j;
        var div = document.createElement("DIV");
        div.className = "header_cell_text";
        div.title = this.tabEntete[j];
        div.innerHTML = this.tabEntete[j];
        cell.appendChild(div);
        line.appendChild(cell);
        if (this.sortable) {
            cell.onclick = function () {
                oThis.triColonne(this.ind);
                oThis.refreshGrid();
            };
        }
        var cellSep = this.cellSep.cloneNode(true);
        line.appendChild(cellSep);
        cellSep.oCiu = this;
        rialto.widgetBehavior.affect(cellSep, "DragAndDrop", {ghost:{aspect:"rect", asChild:true, top:0, height:"this.oCiu.heightVisibleCol()"}, bSelectMark:false, isWithLimitsDisplayed:false, movingLimits:{orientation:"h", rectLim:{left:"parseInt(this.previousSibling.firstChild.offsetLeft)" + " + 12 + parseInt(this.previousSibling.offsetLeft)", right:"parseInt(this.parentNode.offsetWidth)-20"}}});
        cellSep.synchroDDMup = function (mod, posI) {
            var c = this.previousSibling;
            c.style.width = Math.max(10, parseInt(c.style.width) + mod.left);
            oThis.reDimColTabData(c.ind, mod.left);
        };
    }
    this.DerCell = document.createElement("DIV");
    this.DerCell.id = this.id + "_Cell" + j;
    this.DerCell.className = "header_cell";
    this.DerCell.style.width = this.widthLastCell;
    line.appendChild(this.DerCell);
    var cell = document.createElement("DIV");
    cell.className = "header_right_img";
    cell.type = "cell";
    line.appendChild(cell);
    this.tableauEntete.appendChild(line);
    if (this.switchable) {
        var ind = this.tableauEntete.childNodes[0].childNodes.length - 1;
        this.tableauEntete.childNodes[0].childNodes[ind].style.display = "none";
        this.DerCell.style.width = parseInt(this.DerCell.style.width) + 8;
        this.imgBascule = new rialto.widget.Image(rialtoConfig.buildImageURL("images/imgTableau/bt_bascul_off.gif"), 8, 0, this.DerCell, rialto.I18N.getLabel("lanGridSwitchButton"), rialtoConfig.buildImageURL("images/imgTableau/bt_bascul_on.gif"), {position:"absolute"});
        this.imgBascule.onclick = function () {
            oThis.switchDisplayMode();
        };
    }
    if (objPar.parent) {
        this.placeIn(objPar.parent);
    }
    this.menuContex = new objMenuCont("men1", 220);
    this.menuContex.createMenu(this.divExt);
    this.menuContex.add(rialto.I18N.getLabel("lanSelectButtonText"), false, false, false, rialtoConfig.buildImageURL("images/Entoure.gif"));
    this.menuContex.addSeparation();
    this.menuContex.add(rialto.I18N.getLabel("lanGridSwitchButton"), this.switchable, false, false, rialtoConfig.buildImageURL("images/imgTableau/bt_bascul_off.gif"));
    if (this.boolPrint) {
        this.menuContex.add(rialto.I18N.getLabel("lanPrintButtonText"), true, false, false, rialtoConfig.buildImageURL("images/imTreeview/icone_compte_rendu.gif"));
    }
    this.divExt.oncontextmenu = function (e) {
        oThis.menuContex.srcEvent = null;
        oThis.menuContex.inactiveItem(0);
        oThis.menuContex.afficheMenu(e);
    };
    this.menuContex.itemClickApplicatif = function (ind) {
        if (ind == 0) {
            if (oThis.menuContex.srcEvent != null) {
                oThis.menuContex.srcEvent.onclick();
            }
            return true;
        }
        if (ind == 1) {
            oThis.switchDisplayMode();
            return true;
        }
        if (ind == 2) {
            oThis.print();
            return true;
        }
    };
    objPar = null;
};
rialto.widget.Grid.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Grid.prototype.onmouseover = function () {
};
rialto.widget.Grid.prototype.onmouseout = function () {
};
rialto.widget.Grid.prototype.getTabData = function () {
    return this.tabData;
};
rialto.widget.Grid.prototype.print = function () {
    var widthGlobal = document.body.clientWidth;
    var heightGlobal = document.body.clientHeight;
    this.fenImp = window.open(rialtoConfig.pathRialtoE + "printTab.html", "IMPRESSION", "height=" + heightGlobal + ",width=" + widthGlobal + ",top=0,left=0,scrollbars,resizable,toolbar,menubar");
    this.rempFenImp();
};
rialto.widget.Grid.prototype.rempFenImp = function () {
    if (this.fenImp.rempPage) {
        var obj = this.getInfoPrint();
        this.fenImp.rempPage(obj);
    } else {
        window.setTimeout("rialto.session.objects[\"" + this.id + "\"].rempFenImp()", 50);
    }
};
rialto.widget.Grid.prototype.getInfoPrint = function () {
    var obj = new Object;
    obj.strEntete = new String;
    obj.strEntete = this.tabEntete.join("$");
    obj.tabEntete = this.tabEntete;
    obj.strEntete = rialto.string.formatHTTP(obj.strEntete);
    obj.titre = this.titrePrint;
    obj.NBCOL = this.tabEntete.length;
    obj.NbreLig = this.NbreLig;
    obj.tabData = this.tabData;
    return obj;
};
rialto.widget.Grid.prototype.adaptToContext = function () {
    var oThis = this;
    if (this.autoResizableH) {
        this.divExt.style.height = this.getNewParentHeight() - this.divExt.offsetTop;
        this.rang = Math.floor((parseInt(this.height) - 24) / this.lineHeight) - 1;
    } else {
        this.divExt.style.height = this.height;
    }
    if (this.autoResizableW) {
        this.divExt.style.width = this.getNewParentWidth() - this.divExt.offsetLeft;
    } else {
        this.divExt.style.width = this.width;
    }
    this.tableauHTML.style.height = Math.max(0, parseInt(this.divExt.style.height) - this.tableauHTML.offsetTop) + "px";
    if (this.autoResizeContenu && !this.autoResizeParent) {
        this.resizeContenu();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    if (this.navigation) {
        ria.utils.measures.$centerW(this.Div_nav);
    }
};
rialto.widget.Grid.prototype.adaptAfterContainerChange = function () {
    this.adaptToContext();
};
rialto.widget.Grid.prototype.setColumnVisible = function (visible, indexColumn) {
    var celE = document.getElementById(this.id + "_CellEntete_" + indexColumn);
    if (visible) {
        if (this.tabTypeCol[indexColumn][1] == 0) {
            var modDim = this.initWithCol[indexColumn];
            celE.style.width = modDim;
        } else {
            return;
        }
    } else {
        var modDim = -this.tabTypeCol[indexColumn][1];
        celE.style.width = 0;
    }
    this.reDimColTabData(indexColumn, modDim);
};
rialto.widget.Grid.prototype.reDimColTabData = function (indCol, modDim) {
    this.divExt.style.overflow = "hidden";
    this.width = parseInt(this.width) + modDim;
    this.divExt.style.width = this.width + "px";
    this.tableauEntete.childNodes[0].style.width = parseInt(this.tableauEntete.childNodes[0].style.width) + modDim;
    this.tabTypeCol[indCol][1] += modDim;
    try {
        for (var i = this.debInd; i < this.finInd; i++) {
            var line = this.getHtmlLineFromIndex(i);
            line.style.width = parseInt(line.style.width) + modDim;
            var cell = this.getHtmlCellFromIndex(i, indCol);
            cell.style.width = parseInt(cell.style.width) + modDim;
        }
    }
    catch (e) {
        alert(i + ":" + e);
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    if (this.navigation) {
        ria.utils.measures.$centerW(this.Div_nav);
    }
    this.divExt.style.overflow = "";
    if (!rialtoConfig.userAgentIsIE && !this.navigation) {
        this.setVisible(false);
        this.setVisible(true);
    }
};
rialto.widget.Grid.prototype.updateSize = function (delta) {
    this.divExt.style.overflow = "hidden";
    if (this.autoResizableH || this.autoResizeContenu) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    this.divExt.style.overflow = "auto";
};
rialto.widget.Grid.prototype.updateWidth = function () {
    if (this.autoResizableW) {
        this.divExt.style.overflow = "hidden";
        var tailleCalc = parseInt(this.getNewParentWidth()) - 2;
        var delta = tailleCalc - this.width - this.left;
        var deltaReel = 0;
        if (delta > 0 && (this.width + delta) > this.widthMin) {
            var deltaReel = delta;
        } else {
            if (delta < 0) {
                var deltaMax = parseInt(this.DerCell.style.width) - 20;
                var deltaReel = -(Math.min(-delta, deltaMax));
            }
        }
        if (deltaReel != 0) {
            this.width += deltaReel;
            this.divExt.style.width = this.width;
            this.tableauEntete.childNodes[0].style.width = this.width - 20;
            this.widthLastCell += deltaReel;
            this.DerCell.style.width = this.widthLastCell;
            if (this.imgBascule) {
                this.imgBascule.setLeft(this.widthLastCell - 20);
            }
            for (var i = 0; i < this.tableauHTML.childNodes.length; i++) {
                var line = this.tableauHTML.childNodes[i];
                line.style.width = this.width - 20 + "px";
                ind = this.tableauHTML.childNodes[i].childNodes.length - 2;
                derCol = this.tableauHTML.childNodes[i].childNodes[ind];
                derCol.style.width = this.widthLastCell;
            }
            if (this.navigation) {
                ria.utils.measures.$centerW(this.Div_nav);
            }
        }
    }
    this.divExt.style.overflow = "auto";
};
rialto.widget.Grid.prototype.updateHeight = function () {
    if (this.autoResizableH) {
        var tailleCalc = parseInt(this.getNewParentHeight());
        this.divExt.style.height = tailleCalc - this.divExt.offsetTop;
        this.tableauHTML.style.height = tailleCalc - this.divExt.offsetTop - this.tableauHTML.offsetTop;
        if (this.navigation) {
            this.rang = Math.floor(parseInt(this.tableauHTML.style.height) / this.lineHeight);
            if (this.tabData.length > 0) {
                this.debInd = 0;
                this.finInd = Math.min(this.debInd + this.rang, this.NbreLig);
                this.refreshGrid();
            }
        }
    }
};
rialto.widget.Grid.prototype.resizeContenu = function () {
    if (this.autoResizeContenu && !this.autoResizeParent) {
        tailleR = this.getRealHeight();
        if (tailleR < parseInt(this.height)) {
            tailleNavig = 0;
            if (this.navigation) {
                tailleNavig = this.Div_nav.offsetHeight;
            }
            this.divExt.style.height = tailleR + tailleNavig;
            this.tableauHTML.style.height = tailleR + "px";
        } else {
            this.divExt.style.height = this.height;
            this.tableauHTML.style.height = Math.max(0, this.divExt.offsetHeight - this.tableauHTML.offsetTop) + "px";
        }
        this.resizePereFrere();
    }
};
rialto.widget.Grid.prototype.getRealHeight = function () {
    return (this.lineHeight * this.NbreLig) + this.tableauEntete.offsetHeight;
};
rialto.widget.Grid.prototype.switchDisplayMode = function () {
    var heightNav = getComputStyle(this.Div_nav, "height");
    if (this.switchable) {
        if (this.navigation) {
            this.navigation = false;
            this.Div_nav.style.display = "none";
            this.tableauHTML.style.height = parseInt(this.tableauHTML.style.height) + heightNav;
        } else {
            this.navigation = true;
            this.tableauHTML.style.height = parseInt(this.tableauHTML.style.height) - heightNav;
            this.Div_nav.style.display = "block";
            ria.utils.measures.$centerW(this.Div_nav);
        }
        this.resizeContenu();
        if (this.tabData.length > 0) {
            this.debInd = 0;
            if (!this.navigation) {
                this.finInd = this.NbreLig;
            } else {
                this.finInd = Math.min(this.rang, this.NbreLig);
            }
            this.refreshGrid();
        }
    }
};
rialto.widget.Grid.prototype.setText = function (text) {
    this.Div_text.innerHTML = text;
};
rialto.widget.Grid.prototype.getLineIndex = function (node) {
    var indL = -1;
    tab = node.id.split("_");
    if (this.isCell(node)) {
        var idInt = tab[tab.length - 2];
        indL = this.mapArray[idInt];
    } else {
        if (this.isLine(node)) {
            var idInt = tab[tab.length - 1];
            indL = this.mapArray[idInt];
        }
    }
    return indL;
};
rialto.widget.Grid.prototype.getCellIndex = function (node) {
    tab = node.id.split("_");
    if (this.isCell(node)) {
        return tab[tab.length - 1];
    }
    return -1;
};
rialto.widget.Grid.prototype.getHtmlLineFromIndex = function (indL) {
    var node = null;
    var idInt = rialto.array.indexOf(this.mapArray, indL);
    if (idInt != -1) {
        node = document.getElementById(this.id + "_LineTab_" + idInt);
    }
    return node;
};
rialto.widget.Grid.prototype.getHtmlCellFromIndex = function (indL, indC) {
    var node = null;
    var idInt = rialto.array.indexOf(this.mapArray, indL);
    if (idInt != -1) {
        node = document.getElementById(this.id + "_CellTab_" + idInt + "_" + indC);
    }
    return node;
};
rialto.widget.Grid.prototype.isLine = function (node) {
    return (node.id.indexOf(this.id + "_LineTab_") != -1);
};
rialto.widget.Grid.prototype.isCell = function (node) {
    return (node.id.indexOf(this.id + "_CellTab_") != -1);
};
rialto.widget.Grid.prototype.deleteLines = function (titre, withoutRestoreIndex) {
    if (!withoutRestoreIndex) {
        this.debInd = 0;
        this.finInd = 0;
        this.indLineClic = -1;
        this.idInt = 0;
    }
    var dataLines = this.tableauHTML.childNodes;
    for (var lnIdx = 0; lnIdx < dataLines.length; lnIdx++) {
        this.deleteJSRef(dataLines[lnIdx]);
    }
    this.tableauHTML.innerHTML = "";
    if (this.navigation) {
        this.setText(titre);
        this.bouFirst.setVisible(false);
        this.boutPrevious.setVisible(false);
        this.boutNext.setVisible(false);
        this.boutLast.setVisible(false);
    }
};
rialto.widget.Grid.prototype.deleteData = function () {
    this.deleteLines();
    this.tabData = new Array;
    this.mapArray = new Array;
};
rialto.widget.Grid.prototype.deleteJSRef = function (dataLine) {
    if (dataLine.img) {
        dataLine.img.onclick = null;
        dataLine.img = null;
    }
    dataLine.onmouseout = null;
    dataLine.onmouseover = null;
    for (var colIdx = 0; colIdx < dataLine.childNodes.length; colIdx++) {
        var dataItem = dataLine.childNodes[colIdx];
        dataItem.onclick = null;
        dataItem.oncontextmenu = null;
        dataItem.ondblclick = null;
        dataItem.onmouseout = null;
        dataItem.onmouseover = null;
        dataItem.onkeypress = null;
    }
};
rialto.widget.Grid.prototype.deleteOneLine = function (indL) {
    if (indL == this.indLineClic) {
        this.deselNode(indL);
    } else {
        if (this.indLineClic > indL) {
            this.indLineClic -= 1;
        }
    }
    this.tabData.splice(indL, 1);
    this.NbreLig -= 1;
    var line = this.getHtmlLineFromIndex(indL);
    if (line) {
        if (this.navigation) {
            if (this.finInd == (this.NbreLig + 1)) {
                this.finInd -= 1;
            }
            this.refreshGrid();
        } else {
            this.finInd -= 1;
            this.deleteJSRef(line);
            this.tableauHTML.removeChild(line);
            var idInt = rialto.array.indexOf(this.mapArray, indL);
            if (idInt != -1) {
                this.mapArray[idInt] = null;
            }
            this.refreshMapArray(indL, -1);
        }
    }
};
rialto.widget.Grid.prototype.initTab = function () {
    this.deleteLines();
    this.tabData = new Array;
};
rialto.widget.Grid.prototype.findLine = function (col, valCol) {
    var ret = -1;
    var trouve = false;
    var i = 0;
    var val;
    while (i < this.NbreLig && !trouve) {
        val = this.tabData[i][col];
        if (val == valCol) {
            ret = i;
            trouve = true;
        } else {
            i++;
        }
    }
    return ret;
};
rialto.widget.Grid.prototype.fillGrid = function (TabData, ind, boolOrder) {
    this.NbreLig = TabData.length;
    if (this.NbreLig >= 100 && this.switchable && !this.navigation) {
        this.switchDisplayMode();
    }
    this.tabData = new Array();
    this.tabData = (this.tabData.concat(TabData));
    this.deleteLines();
    this.indLineClic = -1;
    this.oldColCLic = null;
    for (var i = 0; i < this.NbreLig; i++) {
        this.initLine(i);
    }
    this.debInd = 0;
    if (!this.navigation) {
        this.finInd = this.NbreLig;
    } else {
        this.finInd = Math.min(this.rang, this.NbreLig);
    }
    if (this.sortable) {
        if (!ind) {
            ind = 0;
        }
        this.triColonne(ind, boolOrder);
    }
    this.refreshGrid();
    this.updateSize();
};
rialto.widget.Grid.prototype.initLine = function (ind) {
    this.tabData[ind].sel = false;
    this.tabData[ind].sTexte = null;
    var cellProp = new Array;
    for (var j = 0; j < this.NbreCol + 1; j++) {
        cellProp[j] = {sel:false, objPar:null, obStyle:null, tabValue:null};
        if (typeof this.tabData[ind][j] == "object") {
            var obj = this.tabData[ind][j];
            cellProp[j].tabValue = obj.authValue;
            this.tabData[ind][j] = obj.value;
        }
    }
    this.tabData[ind].cellProp = cellProp;
};
rialto.widget.Grid.prototype.refreshGrid = function () {
    var debInd = this.debInd;
    var finInd = this.finInd;
    var indLineClic = this.indLineClic;
    this.deleteLines();
    this.debInd = debInd;
    this.finInd = finInd;
    this.indLineClic = indLineClic;
    this.idInt = 0;
    this.mapArray = new Array;
    if (this.navigation) {
        this.majZoneNavigation();
    }
    var tabINNERHTML = new Array();
    for (var i = this.debInd; i < this.finInd; i++) {
        tabINNERHTML.push(this.addLineWithINNER(i));
    }
    this.tableauHTML.innerHTML = tabINNERHTML.join("");
    this.updateLineCell();
};
rialto.widget.Grid.prototype.updateLineCell = function () {
    var oThis = this;
    for (var i = 0; i < this.tableauHTML.childNodes.length; i++) {
        var line = this.tableauHTML.childNodes[i];
        var indL = this.getLineIndex(line);
        line.sel = false;
        if (this.tabData[indL].sel) {
            this.selNode(indL, 0);
        }
        if (!this.cellActive) {
            line.onmouseout = function () {
                oThis.afterMouseout(this);
            };
            line.onmouseover = function () {
                oThis.afterMouseover(this);
            };
        }
        for (var j = 1; j < line.childNodes.length; j += 2) {
            if (this.isCell(line.childNodes[j])) {
                var cell = line.childNodes[j];
                var indC = this.getCellIndex(cell);
                cell.sel = false;
                if (this.tabData[indL].cellProp[indC].objPar != null) {
                    this.addObjectInCell(indL, indC, this.tabData[indL].cellProp[indC].objPar);
                }
                if (this.tabData[indL].cellProp[indC].sel) {
                    this.selNode(indL, indC);
                }
                if (this.tabData[indL].cellProp[indC].obStyle != null) {
                    var obStyle = this.tabData[indL].cellProp[indC].obStyle;
                    this.setStyle(indL, indC, obStyle);
                }
                if (this.actifClic) {
                    cell.onclick = function () {
                        oThis.afterOnClick(oThis.getLineIndex(this), oThis.getCellIndex(this), true);
                    };
                    cell.oncontextmenu = function (e) {
                        var e = e ? e : window.event;
                        oThis.oncontextmenu(this, e);
                    };
                    cell.ondblclick = function () {
                        oThis.afterOnDbleClick(oThis.getLineIndex(this), oThis.getCellIndex(this), true);
                    };
                }
                if (this.cellActive) {
                    cell.onmouseout = function () {
                        oThis.afterMouseout(this);
                    };
                    cell.onmouseover = function () {
                        oThis.afterMouseover(this);
                    };
                }
            }
        }
    }
};
rialto.widget.Grid.prototype.addOneLine = function (tabLine, hidden) {
    if (!this.tabData) {
        this.tabData = new Array;
    }
    var i = this.tabData.push(tabLine) - 1;
    this.NbreLig += 1;
    this.initLine(i);
    if (this.navigation) {
        if (this.finInd == (this.NbreLig - 1)) {
            this.lastN();
        } else {
            this.majZoneNavigation();
        }
    } else {
        this.finInd += 1;
        var divLine = this.createOneLine(tabLine, i);
        if (hidden) {
            divLine.style.display = "none";
        }
        this.tableauHTML.appendChild(divLine);
    }
    return i;
};
rialto.widget.Grid.prototype.insertOneLineBefore = function (tabLine, indexPreviousLine, hidden) {
    if (!this.tabData) {
        this.tabData = new Array;
    }
    if (indexPreviousLine >= this.tabData.length) {
        this.addOneLine(tabLine);
    } else {
        rialto.array.insert(this.tabData, indexPreviousLine, tabLine);
        if (this.indLineClic >= indexPreviousLine) {
            this.indLineClic += 1;
        }
        this.NbreLig += 1;
        this.initLine(indexPreviousLine);
        if (this.navigation) {
            if (indexPreviousLine >= this.debInd && indexPreviousLine <= this.finInd) {
                this.refreshGrid();
            } else {
                if (indexPreviousLine < this.debInd) {
                    this.debInd += 1;
                    this.finInd += 1;
                }
                this.majZoneNavigation();
            }
        } else {
            this.finInd += 1;
            this.refreshMapArray(indexPreviousLine, 1);
            var divLine = this.createOneLine(tabLine, indexPreviousLine);
            if (hidden) {
                divLine.style.display = "none";
            }
            this.tableauHTML.insertBefore(divLine, this.tableauHTML.childNodes[indexPreviousLine]);
        }
    }
    return indexPreviousLine;
};
rialto.widget.Grid.prototype.refreshMapArray = function (fromIndex, shift) {
    for (var i = 0; i < this.mapArray.length; i++) {
        if (rialto.lang.isNumber(this.mapArray[i]) && this.mapArray[i] >= fromIndex) {
            this.mapArray[i] += shift;
        }
    }
};
rialto.widget.Grid.prototype.createOneLine = function (tabLine, indexLine) {
    var oThis = this;
    var idL = this.id + "_LineTab_" + this.idInt;
    var prefIdC = this.id + "_CellTab_" + this.idInt + "_";
    this.mapArray[this.idInt++] = indexLine;
    if (indexLine % 2 == 1) {
        var type = "1";
    } else {
        var type = "2";
    }
    var divLigne = document.createElement("DIV");
    divLigne.id = idL;
    divLigne.sel = false;
    divLigne.className = "grid_line" + type;
    divLigne.style.height = this.lineHeight + "px";
    divLigne.style.width = this.width - 20 + "px";
    var divCellDec = document.createElement("DIV");
    divCellDec.className = "grid_cellDecL" + type;
    divLigne.appendChild(divCellDec);
    if (!this.cellActive) {
        divLigne.onmouseout = function () {
            oThis.afterMouseout(this);
        };
        divLigne.onmouseover = function () {
            oThis.afterMouseover(this);
        };
    }
    for (var j = 0; j < this.NbreCol; j++) {
        var divCell = document.createElement("DIV");
        divCell.id = prefIdC + j;
        divCell.className = "grid_cellData";
        divCell.style.width = this.tabTypeCol[j][1] + "px";
        divCell.sel = false;
        if (this.cellActive) {
            divCell.onmouseout = function () {
                oThis.afterMouseout(this);
            };
            divCell.onmouseover = function () {
                oThis.afterMouseover(this);
            };
        }
        if (this.actifClic) {
            divCell.onclick = function () {
                oThis.afterOnClick(oThis.getLineIndex(this), oThis.getCellIndex(this), true);
            };
            divCell.oncontextmenu = function (e) {
                var e = e ? e : window.event;
                oThis.oncontextmenu(this, e);
            };
            divCell.ondblclick = function () {
                oThis.afterOnDbleClick(oThis.getLineIndex(this), oThis.getCellIndex(this), true);
            };
        }
        var divText = document.createElement("DIV");
        divText.className = "grid_textData";
        divText.title = this.tabData[indexLine][j];
        divText.innerHTML = this.tabData[indexLine][j];
        divCell.appendChild(divText);
        divLigne.appendChild(divCell);
        var divCellSep = document.createElement("DIV");
        divCellSep.className = "cellSep";
        divLigne.appendChild(divCellSep);
    }
    var divCell = document.createElement("DIV");
    divCell.id = prefIdC + this.NbreCol;
    divCell.className = "grid_cellData";
    divCell.style.width = this.widthLastCell + "px";
    divLigne.appendChild(divCell);
    divCellDec = document.createElement("DIV");
    divCellDec.className = "grid_cellDecR" + type;
    divLigne.appendChild(divCellDec);
    return divLigne;
};
rialto.widget.Grid.prototype.addLineWithINNER = function (i) {
    var idL = this.id + "_LineTab_" + this.idInt;
    var prefIdC = this.id + "_CellTab_" + this.idInt + "_";
    this.mapArray[this.idInt++] = i;
    var tabTemp = new Array();
    if (i % 2 == 1) {
        var type = "1";
    } else {
        var type = "2";
    }
    tabTemp.push("<DIV ID=\"" + idL + "\" style=\"width:" + (this.width - 20) + "px;height:" + this.lineHeight + "px;\" class=\"grid_line" + type + "\" class=\"grid_line\">");
    tabTemp.push("<DIV type=\"cell\" class=\"grid_cellDecL" + type + "\"></DIV>");
    for (var j = 0; j < this.NbreCol; j++) {
        idC = prefIdC + j;
        tabTemp.push("<DIV ID=\"" + idC + "\" style=\"width:" + this.tabTypeCol[j][1] + "px;\" class=\"grid_cellData\"><DIV title=\"" + this.tabData[i][j] + "\" class=\"grid_textData\">" + this.tabData[i][j] + "</DIV></DIV>");
        tabTemp.push("<DIV class=\"cellSep\"></DIV>");
    }
    idC = this.id + "_CellTab_" + i + "_" + this.NbreCol;
    tabTemp.push("<DIV  ID=\"" + idC + "\" class=\"grid_cellData\" style=\"width:" + this.widthLastCell + "px;\"></DIV>");
    tabTemp.push("<DIV type=\"cell\" class=\"grid_cellDecR" + type + "\"></DIV>");
    tabTemp.push("</DIV>");
    return tabTemp.join("");
};
rialto.widget.Grid.prototype.majZoneNavigation = function () {
    if (this.rang < this.NbreLig) {
        var text = (this.debInd + 1) + "-" + (this.finInd) + " (total:" + (this.NbreLig) + ")";
        if (!this.bouFirst.visible) {
            this.bouFirst.setVisible(true);
            this.boutPrevious.setVisible(true);
            this.boutNext.setVisible(true);
            this.boutLast.setVisible(true);
        }
        this.bouFirst.setAlt(this.rang + rialto.I18N.getLabel("lanGridButtonFirst"));
        this.boutPrevious.setAlt(this.rang + rialto.I18N.getLabel("lanGridButtonPrevious"));
        this.boutNext.setAlt(this.rang + rialto.I18N.getLabel("lanGridButtonNext"));
        this.boutLast.setAlt(this.rang + rialto.I18N.getLabel("lanGridButtonLast"));
    } else {
        var text = "1-" + this.NbreLig;
        if (this.bouFirst.visible) {
            this.bouFirst.setVisible(false);
            this.boutPrevious.setVisible(false);
            this.boutNext.setVisible(false);
            this.boutLast.setVisible(false);
        }
    }
    this.setText(text);
};
rialto.widget.Grid.prototype.setCellText = function (indL, indC, text) {
    this.tabData[indL][indC] = text;
    var cell = this.getHtmlCellFromIndex(indL, indC);
    if (cell) {
        var i = 0;
        divText = cell.childNodes[0];
        while (divText.className != "grid_textData" && i < cell.childNodes.length) {
            i += 1;
            divText = cell.childNodes[i];
        }
        divText.innerHTML = text;
    }
};
rialto.widget.Grid.prototype.setCellToolTipText = function (indL, indC, text) {
    var cell = this.getHtmlCellFromIndex(indL, indC);
    if (cell) {
        var i = 0;
        divText = cell.childNodes[0];
        while (divText.className != "DivTexData" && i < cell.childNodes.length) {
            i += 1;
            divText = cell.childNodes[i];
        }
        divText.title = text;
    }
};
rialto.widget.Grid.prototype.getCellText = function (indL, indC) {
    return this.tabData[indL][indC];
};
rialto.widget.Grid.prototype.setStyle = function (indL, indC, obStyle) {
    if (indC != -1) {
        if (obStyle) {
            if (this.tabData[indL].cellProp[indC].obStyle != null) {
                oldObStyle = this.tabData[indL].cellProp[indC].obStyle;
                for (prop in oldObStyle) {
                    if (obStyle[prop] == null) {
                        obStyle[prop] = oldObStyle[prop];
                    }
                }
            }
            this.tabData[indL].cellProp[indC].obStyle = obStyle;
        } else {
            var obStyle = this.tabData[indL].cellProp[indC].obStyle;
        }
        var cell = this.getHtmlCellFromIndex(indL, indC);
        if (cell) {
            for (prop in obStyle) {
                try {
                    cell.style[prop] = obStyle[prop];
                }
                catch (erreur) {
                }
            }
        }
    } else {
        for (var j = 0; j < (this.NbreCol + 1); j++) {
            this.setStyle(indL, j, obStyle);
        }
    }
};
rialto.widget.Grid.prototype.disableLine = function (indL, indC) {
    if (indC != -1) {
        var cell = this.getHtmlCellFromIndex(indL, indC);
        if (cell) {
            cell.onclick = function () {
            };
            cell.ondblclick = function () {
            };
            cell.onmouseover = function (e) {
                if (!e) {
                    e = window.event;
                }
                stopEvent(e);
            };
            cell.onmouseout = function (e) {
                if (!e) {
                    e = window.event;
                }
                stopEvent(e);
            };
        }
    } else {
        var line = this.getHtmlLineFromIndex(indL);
        if (line) {
            for (var j = 0; j < this.NbreCol; j++) {
                var cell = document.getElementById(this.id + "_CellTab_" + indL + "_" + j);
                cell.onclick = function () {
                };
                cell.ondblclick = function () {
                };
            }
            line.onmouseover = function () {
            };
            line.onmouseout = function () {
            };
        }
    }
};
rialto.widget.Grid.prototype.addObjectInCell = function (indL, indC, objPar) {
    this.tabData[indL].cellProp[indC].objPar = objPar;
    var cell = this.getHtmlCellFromIndex(indL, indC);
    if (cell) {
        if (objPar.placeIn) {
            objPar.placeIn(cell);
        } else {
            cell.appendChild(objPar);
        }
    }
};
rialto.widget.Grid.prototype.removeObjectFromCell = function (indL, indC, objPar) {
    this.tabData[indL].cellProp[indC].objPar = null;
    var cell = this.getHtmlCellFromIndex(indL, indC);
    if (cell) {
        cell.removeChild(objPar);
    }
};
rialto.widget.Grid.prototype.release = function () {
    var titleLine = this.tableauEntete.childNodes[0];
    for (var colIdx = 0; colIdx < titleLine.childNodes.length; colIdx++) {
        var titleItem = titleLine.childNodes[colIdx];
        if (titleItem.dragAndDrop) {
            rialto.widgetBehavior.desaffect(titleItem, "DragAndDrop");
        }
        titleItem = null;
    }
    this.deleteLines();
    if (this.Div_nav) {
        this.arrG.remove();
        this.arrD.remove();
        this.bouFirst.remove();
        this.boutPrevious.remove();
        this.boutNext.remove();
        this.boutLast.remove();
    }
    if (this.imgBascule) {
        this.imgBascule.remove();
    }
    this.menuContex.remove();
    this.menuContex.itemClickApplicatif = null;
    this.menuContex = null;
    this.divExt.oncontextmenu = null;
};
rialto.widget.Grid.prototype.nextN = function () {
    if (this.debInd + this.rang < this.NbreLig) {
        this.debInd += this.rang;
        if (this.debInd + this.rang <= this.NbreLig) {
            this.finInd = this.debInd + this.rang;
        } else {
            this.finInd = this.NbreLig;
        }
        this.refreshGrid();
    }
};
rialto.widget.Grid.prototype.previousN = function () {
    if (this.debInd >= this.rang) {
        this.finInd = this.debInd;
        this.debInd -= this.rang;
        this.refreshGrid();
    }
};
rialto.widget.Grid.prototype.firstN = function () {
    this.debInd = 0;
    if (this.NbreLig < this.rang) {
        this.finInd = this.NbreLig;
    } else {
        this.finInd = this.rang;
    }
    this.refreshGrid();
};
rialto.widget.Grid.prototype.lastN = function () {
    if (this.NbreLig >= this.rang) {
        var reste = this.NbreLig % this.rang;
        if (reste != 0) {
            this.debInd = this.NbreLig - reste;
        } else {
            this.debInd = this.NbreLig - this.rang;
        }
        this.finInd = this.NbreLig;
        this.refreshGrid();
    }
};
rialto.widget.Grid.prototype.triColonne = function (ind, boolOrder) {
    if (this.oldColCLic != null) {
        if (this.oldColCLic.ind == ind && boolOrder == null) {
            boolOrder = !this.oldColCLic.boolOrder;
        }
        var cell = document.getElementById(this.id + "_CellEntete_" + this.oldColCLic.ind);
        cell.removeChild(this.arrowEnCours);
    }
    var cell = document.getElementById(this.id + "_CellEntete_" + ind);
    var type = this.tabTypeCol[ind][0];
    this.tabData.sort(compareTwoColumns(ind, boolOrder, type));
    if (boolOrder) {
        this.arrowEnCours = this.arrowUp;
    } else {
        this.arrowEnCours = this.arrowDown;
    }
    cell.appendChild(this.arrowEnCours);
    this.oldColCLic = {ind:ind, boolOrder:boolOrder};
};
function compareTwoColumns(nCol, bDescending, sType) {
    var c = nCol;
    if (bDescending) {
        var triDesc = 1;
    } else {
        var triDesc = -1;
    }
    if (sType == "number") {
        return function (n1, n2) {
            return (parseInt(n1[c]) - parseInt(n2[c])) * triDesc;
        };
    }
    if (sType == "date") {
        return function (n1, n2) {
            var tab = n1[c].split("/");
            var date1 = new Date(tab[2], tab[1], tab[0]);
            tab = n2[c].split("/");
            var date2 = new Date(tab[2], tab[1], tab[0]);
            if (date1 >= date2) {
                return -1 * triDesc;
            }
            if (date2 > date1) {
                return 1 * triDesc;
            }
            return 0;
        };
    }
    if (sType == "string") {
        return function (n1, n2) {
            if (n1[c] >= n2[c]) {
                return -1 * triDesc;
            }
            if (n1[c] < n2[c]) {
                return 1 * triDesc;
            }
            return 0;
        };
    }
}
rialto.widget.Grid.prototype.afterMouseover = function (node) {
    if (!node.sel) {
        node.className += " grid_line_over";
        this.onmouseover(node);
    }
};
rialto.widget.Grid.prototype.afterMouseout = function (node) {
    if (!node.sel) {
        node.className = this.getInitClassName(node);
        if (this.isCell(node)) {
            var indL = this.getLineIndex(node);
            var indC = this.getCellIndex(node);
            if (this.tabData[indL].cellProp[indC].obStyle != null) {
                this.setStyle(indL, indC);
            }
        }
        this.onmouseout(node);
    }
};
rialto.widget.Grid.prototype.oncontextmenu = function (node, e) {
    this.menuContex.srcEvent = node;
    this.menuContex.activeItem(0);
    this.menuContex.afficheMenu(e);
};
rialto.widget.Grid.prototype.afterOnDbleClick = function (indLine, indCell) {
    if (this.multiSelect) {
        if (this.tabData[indLine].sel == false && this.tabData[indLine][indCell] == false) {
            this.selNode(indLine, indCell);
        }
    } else {
        if (this.indLineClic != -1 && (this.indLineClic != indLine || (this.indLineClic == indLine && this.indCellClic != indCell))) {
            this.deselNode(this.indLineClic, this.indCellClic);
            this.selNode(indLine, indCell);
        }
    }
    if (this.writable) {
        var oThis = this;
        var node = this.getHtmlCellFromIndex(indLine, indCell);
        node.onkeydown = function (evt) {
            // maskat start
            if (!oThis.text) {
                return false;
            }
            // maskat end
            if (!evt) {
                var evt = window.event;
            }
            var keyCode = evt.keyCode ? evt.keyCode : evt.charCode ? evt.charCode : evt.which ? evt.which : void 0;
            if (keyCode == 9 || keyCode == 13 || keyCode == 27 || keyCode == 38 || keyCode == 40) {
                bDecalLine = false;
                bDecalCell = false;
                iDecal = 0;
                bReset = false;
                switch (keyCode) {
                  case 9:
                    iDecal = evt.shiftKey ? -1 : 1;
                    bDecalCell = true;
                    break;
                  case 13:
                    break;
                  case 27:
                    bReset = true;
                    break;
                  case 38:
                    bDecalLine = true;
                    iDecal = -1;
                    break;
                  case 40:
                    bDecalLine = true;
                    iDecal = 1;
                    break;
                }
                oThis.afterCellEdit(indLine, indCell, oThis.getCellText(indLine, indCell), oThis.text.getValue(), bDecalLine, bDecalCell, iDecal, bReset);
                return false;
            }
        };
        if (this.text) {
            this.text.remove();
            this.text = null;
        }
        if (this.tabData[indLine].cellProp[indCell].tabValue) {
            this.text = new rialto.widget.Combo(this.tabData[indLine].cellProp[indCell].tabValue, "gridCombo", 0, 0, node.offsetWidth - 4, node, {suggest:false});
            this.text.selWithText(this.tabData[indLine][indCell]);
        } else {
            if (this.tabTypeCol[indCell][2]) {
                this.text = new rialto.widget.Combo(this.tabTypeCol[indCell][2], "gridCombo", 0, 0, node.offsetWidth - 4, node, {suggest:false});
                this.text.selWithText(this.tabData[indLine][indCell]);
            } else {
                if (this.tabTypeCol[indCell][0] == "date") {
                    var type = "D";
                } else {
                    if (this.tabTypeCol[indCell][0] == "number") {
                        var type = "N";
                    } else {
                        var type = "A";
                    }
                }
                this.text = new rialto.widget.Text("Gridtext", 0, 0, node.offsetWidth - 4, type, node);
                this.text.setValue(this.tabData[indLine][indCell]);
            }
        }
        this.text.setFocus();
        // maskat start
        this.text.champs.select();
        // maskat end
        this.text.indL = indLine;
        this.text.indC = indCell;
    }
    this.ondbleclick(indLine, indCell);
};
rialto.widget.Grid.prototype.afterCellEdit = function (indLine, indCell, oldVal, newVal, bDecalLine, bDecalCell, iDecal, bReset) {
    var bResetA = !this.onCellEdit(indLine, indCell, oldVal, newVal);
    if (!bReset && !bResetA) {
        this.setCellText(indLine, indCell, newVal);
        this.onCellWrite(indLine, indCell, newVal);
    }
    this.text.remove();
    this.text = null;
    var nouvCell = indCell;
    var nouvLine = indLine;
    var bOpenNextCell = false;
    if (bDecalCell) {
        bOpenNextCell = true;
        nouvCell = parseInt(indCell) + iDecal;
        if (nouvCell >= this.NbreCol) {
            nouvCell = 0;
        } else {
            if (nouvCell < 0) {
                nouvCell = this.NbreCol - 1;
            }
        }
    }
    if (bDecalLine) {
        bOpenNextCell = true;
        nouvLine = parseInt(indLine) + iDecal;
        if (nouvLine >= this.tableauHTML.childNodes.length) {
            nouvLine = 0;
        } else {
            if (nouvLine < 0) {
                nouvLine = this.tableauHTML.childNodes.length - 1;
            }
        }
    }
    if (bOpenNextCell) {
        this.afterOnDbleClick(nouvLine, nouvCell);
    }
};
rialto.widget.Grid.prototype.afterOnClick = function (indLine, indCell, boolAction) {
    if (this.cellActive) {
        var node = this.getHtmlCellFromIndex(indLine, indCell);
    } else {
        var node = this.getHtmlLineFromIndex(indLine);
    }
    if (this.multiSelect) {
        if (node.sel) {
            this.deselNode(indLine, indCell);
            if (boolAction) {
                this.onDeclickApplicatif(indLine, indCell);
            }
        } else {
            if (this.text) {
                if (this.text.type == "combo") {
                    var val = this.text.getSelText();
                } else {
                    var val = this.text.getValue();
                }
                this.afterCellEdit(this.text.indL, this.text.indC, this.getCellText(indLine, indCell), val, false, false, 0, false);
            }
            this.selNode(indLine, indCell);
            if (boolAction) {
                this.onclick(indLine, indCell);
            }
        }
    } else {
        if (this.indLineClic != -1) {
            if ((!this.cellActive && this.indLineClic != indLine) || (this.cellActive && (this.indLineClic != indLine || (this.indLineClic == indLine && this.indCellClic != indCell)))) {
                this.deselNode(this.indLineClic, this.indCellClic);
                this.selNode(indLine, indCell);
                if (boolAction) {
                    this.onclick(indLine, indCell);
                }
            }
        } else {
            this.selNode(indLine, indCell);
            if (boolAction) {
                this.onclick(indLine, indCell);
            }
        }
    }
};
rialto.widget.Grid.prototype.selNode = function (indLine, indCell) {
    if (this.cellActive) {
        var node = this.getHtmlCellFromIndex(indLine, indCell);
    } else {
        var node = this.getHtmlLineFromIndex(indLine);
    }
    node.sel = true;
    if (this.isLine(node)) {
        var cellCoche = node.childNodes[1];
        this.tabData[indLine].sel = true;
    } else {
        var cellCoche = node;
        this.tabData[indLine].cellProp[indCell].sel = true;
    }
    var divCoche = this.divCoche.cloneNode(true);
    cellCoche.insertBefore(divCoche, cellCoche.firstChild);
    node.className = this.getInitClassName(node);
    node.className += " grid_line_sel";
    this.indLineClic = indLine;
    this.indCellClic = indCell;
};
rialto.widget.Grid.prototype.getInitClassName = function (node) {
    var tab = node.className.split(" ");
    return tab[0];
};
rialto.widget.Grid.prototype.deselNode = function (indLine, indCell) {
    if (this.cellActive) {
        var node = this.getHtmlCellFromIndex(indLine, indCell);
    } else {
        var node = this.getHtmlLineFromIndex(indLine);
    }
    if (node) {
        node.sel = false;
        node.className = this.getInitClassName(node);
        if (this.isLine(node)) {
            var cellCoche = node.childNodes[1];
            for (var j = 0; j < this.NbreCol; j++) {
                objS = this.tabData[indLine].cellProp[j].obStyle;
                if (objS != null) {
                    this.setStyle(indLine, j);
                }
            }
        } else {
            var cellCoche = node;
            objS = this.tabData[indLine].cellProp[indCell].obStyle;
            if (objS != null) {
                this.setStyle(indLine, indCell);
            }
        }
        if (cellCoche.childNodes.length > 0) {
            cellCoche.removeChild(cellCoche.firstChild);
        }
    }
    if (!this.cellActive) {
        this.tabData[indLine].sel = false;
    } else {
        this.tabData[indLine].cellProp[indCell].sel = false;
    }
    this.indLineClic = -1;
    if (this.text) {
        if (this.text.type == "combo") {
            var val = this.text.getSelText();
        } else {
            var val = this.text.getValue();
        }
        this.afterCellEdit(this.text.indL, this.text.indC, this.getCellText(indLine, indCell), val, false, false, 0, false);
    }
};
rialto.widget.Grid.prototype.getIndLineClic = function () {
    return this.indLineClic;
};
rialto.widget.Grid.prototype.getIndCellClic = function () {
    return this.indCellClic;
};
rialto.widget.Grid.prototype.unselectLine = function () {
    if (this.indLineClic != -1) {
        this.deselNode(this.indLineClic, this.indCellClic);
    }
};
rialto.widget.Grid.prototype.clickLine = function (indLine, indCell) {
    this.afterOnClick(indLine, indCell, true);
    this.tableauHTML.scrollTop = indLine * this.lineHeight;
};
rialto.widget.Grid.prototype.clickNext = function () {
    ind = parseInt(this.indLineClic) + 1;
    if (this.navigation) {
        if (ind >= this.finInd) {
            this.nextN();
        }
    } else {
        if (ind > this.NbreLig - 1) {
            ind = 0;
        }
    }
    this.afterOnClick(ind, this.indCellClic, true);
};
rialto.widget.Grid.prototype.clickPrevious = function () {
    ind = parseInt(this.indLineClic) - 1;
    if (this.navigation) {
        if (ind < this.debInd) {
            this.previousN();
        }
    } else {
        if (ind < 0) {
            ind = this.NbreLig - 1;
        }
    }
    this.afterOnClick(ind, this.indCellClic, true);
};
rialto.widget.Grid.prototype.clickLast = function () {
    if (this.navigation) {
        this.lastN();
    }
    this.afterOnClick(parseInt(this.NbreLig) - 1, this.indCellClic, true);
};
rialto.widget.Grid.prototype.clickFirst = function () {
    if (this.navigation) {
        this.firstN();
    }
    this.afterOnClick(0, this.indCellClic, true);
};
rialto.widget.Grid.prototype.ondbleclick = function (indLine, indCell) {
};
rialto.widget.Grid.prototype.onclick = function (indLine, indCell) {
};
rialto.widget.Grid.prototype.onCellEdit = function (indLine, indCell, oldVal, newVal) {
    return true;
};
rialto.widget.Grid.prototype.onCellWrite = function (indLine, indCell, newVal) {
};
rialto.widget.Grid.prototype.onDeclickApplicatif = function (indLine, indCell) {
};


rialto.widget.GridTree = function (objPar) {
    objPar.type = "Gridtreeview";
    objPar.switchable = false;
    objPar.sortable = false;
    objPar.lineHeight = 23;
    objPar.bNavig = false;
    this.titleFirstCol = "";
    this.widthFirstCol = 220;
    if (rialto.lang.isNumber(objPar.widthFirstCol)) {
        this.widthFirstCol = objPar.widthFirstCol;
    }
    if (rialto.lang.isString(objPar.titleFirstCol)) {
        this.titleFirstCol = objPar.titleFirstCol;
    }
    if (!objPar.tabTypeCol) {
        objPar.tabTypeCol = new Array();
        for (var i = 0; i < objPar.TabEntete.length; i++) {
            objPar.tabTypeCol.push(["string", 100]);
        }
    }
    this.childLines = new Array;
    rialto.array.insert(objPar.TabEntete, 0, this.titleFirstCol);
    rialto.array.insert(objPar.tabTypeCol, 0, ["string", this.widthFirstCol]);
    this.base = rialto.widget.Grid;
    this.base(objPar);
    this.type = "Gridtree";
    var oThis = this;
};
rialto.widget.GridTree.prototype = new rialto.widget.Grid;
rialto.widget.GridTree.prototype.getInfoPrint = function () {
    var obj = new Object;
    obj.strEntete = new String;
    obj.strEntete = this.tabEntete.join("$");
    obj.tabEntete = this.tabEntete;
    obj.strEntete = rialto.string.formatHTTP(obj.strEntete);
    obj.titre = this.titrePrint;
    obj.NBCOL = this.tabEntete.length;
    obj.NbreLig = this.NbreLig;
    obj.tabData = new Array;
    for (var i = 0; i < this.tabData.length; i++) {
        var li = this.getHtmlLineFromIndex(i).oCiu;
        if (li.text != "Loading...") {
            var ind = obj.tabData.push(rialto.array.copy(this.tabData[i])) - 1;
            obj.tabData[ind][0] = li.text;
        }
    }
    return obj;
};
rialto.widget.GridTree.prototype.addNodeLine = function (objPar) {
    objPar.parent = this;
    var lineNode = new rialto.widget.LineNode(objPar);
    return lineNode;
};
rialto.widget.GridTree.prototype.fillGrid = function (arrData) {
    var arrLineNodes = new Array();
    for (var i = 0; i < arrData.length; i++) {
        var wText = arrData[i][0];
        var wTabData = new Array;
        for (var j = 1; j < arrData[i].length; j++) {
            wTabData.push(arrData[i][j]);
        }
        var objPar = {text:wText, reload:true, icon:"", parentLine:null, tabData:wTabData};
        var lineNode = this.addNodeLine(objPar);
        arrLineNodes.push(lineNode);
    }
    return arrLineNodes;
};
rialto.widget.GridTree.prototype.baseDeleteOneLine = rialto.widget.Grid.prototype.deleteOneLine;
rialto.widget.GridTree.prototype.deleteOneLine = function (indL) {
    var dataLine = this.getHtmlLineFromIndex(indL);
    if (dataLine.oCiu) {
        dataLine.oCiu.remove(true);
    }
    this.baseDeleteOneLine(indL);
};
rialto.widget.GridTree.prototype.baseDeleteLines = rialto.widget.Grid.prototype.deleteLines;
rialto.widget.GridTree.prototype.deleteLines = function () {
    this.baseDeleteLines();
    this.childLines = new Array;
};
rialto.widget.GridTree.prototype.onrefreshline = function (line) {
};
rialto.widget.LineNode = function (objPar) {
    this.grid = objPar.parent;
    this.text = "node";
    this.open = true;
    this.reload = false;
    this.url = "";
    this.parentLine = null;
    this.tabData = null;
    this.iconParent = rialtoConfig.buildImageURL("images/imTreeview/pict_synthetik_off.gif");
    this.iconChild = rialtoConfig.buildImageURL("images/imTreeview/puce.gif");
    this.initIcon = null;
    this.name = "Linenode";
    this.typeInfo = "";
    this.type = "Linenode";
    if (rialto.lang.isString(objPar.icon, true)) {
        this.initIcon = rialtoConfig.buildImageURL(objPar.icon);
        this.iconParent = this.iconChild = this.initIcon;
    }
    if (rialto.lang.isString(objPar.name)) {
        this.name = objPar.name;
    }
    if (rialto.lang.isString(objPar.text)) {
        this.text = objPar.text;
    }
    if (rialto.lang.isArray(objPar.tabData)) {
        this.tabData = objPar.tabData;
    }
    if (rialto.lang.isBoolean(objPar.open)) {
        this.open = objPar.open;
    }
    if (objPar.parentLine) {
        this.parentLine = objPar.parentLine;
    }
    if (rialto.lang.isString(objPar.url, true)) {
        this.open = false;
        this.url = objPar.url;
        this.reload = true;
    }
    if (rialto.lang.isString(objPar.typeInfo)) {
        this.typeInfo = objPar.typeInfo;
    }
    this.childLines = new Array;
    if (!this.tabData) {
        this.tabData = new Array;
        for (var i = 0; i < this.grid.NbreCol - 1; i++) {
            this.tabData.push("");
        }
    }
    rialto.array.insert(this.tabData, 0, "");
    if (this.parentLine) {
        var indL = this.parentLine.addLine(this);
    } else {
        this.depth = 1;
        var indL = this.grid.addOneLine(this.tabData);
        this.root = true;
        this.grid.childLines.push(this);
    }
    this.htmlGridLine = this.grid.getHtmlLineFromIndex(indL);
    this.htmlGridLine.oCiu = this;
    var parent = this.htmlGridLine.childNodes[1];
    parent.style.overflow = "hidden";
    parent.ondblclick = function (e) {
        if (!e) {
            e = window.event;
        }
        if (this.onclick) {
            this.onclick(e);
        }
        oThis.toogle();
    };
    var shift = this.depth * 20;
    this.img1 = document.createElement("DIV");
    this.img1.className = "imgTreeview";
    this.img1.style.top = 0;
    this.img1.style.left = shift;
    this.img1.style.backgroundImage = "url('" + rialtoConfig.buildImageURL("images/imTreeview/icT/plus.gif") + "')";
    this.img1.style.visibility = "hidden";
    parent.appendChild(this.img1);
    this.img2 = document.createElement("DIV");
    this.img2.className = "imgTreeview";
    this.img2.style.top = 0;
    this.img2.style.left = shift + 20;
    this.img2.style.backgroundImage = "url('" + this.iconChild + "')";
    parent.appendChild(this.img2);
    this.divText = document.createElement("DIV");
    this.divText.className = "DivText";
    this.divText.style.left = shift + 40;
    this.divText.appendChild(document.createTextNode(this.text));
    this.divText.title = this.text;
    parent.appendChild(this.divText);
    var oThis = this;
    this.img1.onclick = function (e) {
        if (!e) {
            e = window.event;
        }
        oThis.toogle();
        stopEvent(e);
    };
    this.divText.onclick = function () {
        oThis.onclick();
    };
    if (this.reload) {
        this.lineReload = new rialto.widget.LineNode({open:false, text:"Loading...", icon:"images/imTreeview/find.small.gif", parentLine:this, parent:this.grid});
    }
    if (objPar.objStyle) {
        this.grid.setStyle(this.getHtmlInd(), -1, objPar.objStyle);
    }
    objPar = null;
};
rialto.widget.LineNode.prototype.onclick = function () {
};
rialto.widget.LineNode.prototype.reloadNode = function (url) {
    this.remote = new rialto.io.AjaxRequest({url:url, callBackObjectOnSuccess:this, onSuccess:this.refreshReloadNode});
    this.remote.load("NODE=" + this.name);
    if (!this.open) {
        this.toggle();
    }
};
rialto.widget.LineNode.prototype.refreshReloadNode = function (request) {
    try {
        this.reload = false;
        this.lineReload.remove();
        var colNode = eval("(" + request.responseText + ")");
        for (var i = 0; i < colNode.arrNode.length; i++) {
            var obj = colNode.arrNode[i].objPar;
            obj.parentLine = this;
            obj.parent = this.grid;
            var node = new rialto.widget.LineNode(obj);
        }
        this.grid.onrefreshline(this);
    }
    catch (e) {
        alert(e.message);
    }
};
rialto.widget.LineNode.prototype.setIcon = function () {
    var src;
    if (this.hasChild()) {
        this.img1.style.visibility = "visible";
        this.img2.style.backgroundImage = "url('" + this.iconParent + "')";
        if (this.open) {
            src = rialtoConfig.buildImageURL("images/imTreeview/icT/minus.gif");
        } else {
            src = rialtoConfig.buildImageURL("images/imTreeview/icT/plus.gif");
        }
        this.img1.style.backgroundImage = "url('" + src + "')";
    } else {
        this.img1.style.visibility = "hidden";
        this.img2.style.backgroundImage = "url('" + this.iconChild + "')";
    }
};
rialto.widget.LineNode.prototype.toogle = function (line) {
    if (this.hasChild()) {
        this.open = !this.open;
        this.displayChilds(this.open);
        this.setIcon();
        if (this.reload) {
            this.reloadNode(this.url);
        }
    }
};
rialto.widget.LineNode.prototype.displayChilds = function (isVisible) {
    for (var i = 0; i < this.childLines.length; i++) {
        var lineNode = this.childLines[i];
        var htmlLine = lineNode.htmlGridLine;
        if (isVisible && this.open) {
            htmlLine.style.display = "block";
        } else {
            htmlLine.style.display = "none";
        }
        lineNode.displayChilds(isVisible);
    }
};
rialto.widget.LineNode.prototype.setText = function (sText) {
    this.text = sText;
    this.divText.removeChild(this.divText.firstChild);
    this.divText.appendChild(document.createTextNode(this.text));
};
rialto.widget.LineNode.prototype.isGridLastLine = function () {
    var status = false;
    var testLine = this;
    var lastLine = this.grid.tableauHTML.lastChild;
    while (testLine && !status) {
        if (testLine.htmlGridLine == lastLine) {
            status = true;
        }
        testLine = testLine.last();
    }
    return status;
};
rialto.widget.LineNode.prototype.addLine = function (line) {
    var hidden = false;
    if (!this.open || this.isFatherClose()) {
        hidden = true;
    }
    if (this.isGridLastLine()) {
        var indL = this.grid.addOneLine(line.tabData, hidden);
    } else {
        if (this.hasChild()) {
            var nextInd = this.grid.getLineIndex(this.last().htmlGridLine.nextSibling);
        } else {
            var nextInd = this.grid.getLineIndex(this.htmlGridLine.nextSibling);
        }
        var indL = this.grid.insertOneLineBefore(line.tabData, nextInd, hidden);
    }
    this.childLines.push(line);
    this.afterAdd(line);
    return indL;
};
rialto.widget.LineNode.prototype.isFatherClose = function () {
    var close = false;
    var father = this.parentLine;
    while (father && !close) {
        close = !father.open;
        father = father.parentLine;
    }
    return close;
};
rialto.widget.LineNode.prototype.insertLine = function (line) {
};
rialto.widget.LineNode.prototype.afterAdd = function (line) {
    this.setIcon();
    line.depth = this.depth + 1;
};
rialto.widget.LineNode.prototype.remove = function (becauseHtmlLineRemove) {
    this.img1.onclick = null;
    this.divText.onclick = null;
    this.htmlGridLine.oCiu = null;
    if (!becauseHtmlLineRemove) {
        this.grid.deleteOneLine(this.grid.getLineIndex(this.htmlGridLine));
    }
    if (!this.root) {
        rialto.array.remove(this.parentLine.childLines, this);
    }
    while (this.hasChild()) {
        this.last().remove();
    }
};
rialto.widget.LineNode.prototype.hasChild = function () {
    if (this.childLines.length == 0) {
        return false;
    } else {
        return true;
    }
};
rialto.widget.LineNode.prototype.isLast = function () {
    if (!this.root) {
        return (this.parentLine.childLines[this.parentLine.childLines.length - 1] == this);
    } else {
        return true;
    }
};
rialto.widget.LineNode.prototype.getIndex = function () {
    return rialto.array.indexOf(this.parentLine.childLines, this);
};
rialto.widget.LineNode.prototype.isChild = function (line) {
    return rialto.array.indexOf(this.childLines, line) != -1;
};
rialto.widget.LineNode.prototype.isFirst = function () {
    if (!this.root) {
        return (this.parentLine.childLines[0] == this);
    } else {
        return true;
    }
};
rialto.widget.LineNode.prototype.first = function () {
    if (this.hasChild()) {
        return (this.childLines[0]);
    } else {
        return null;
    }
};
rialto.widget.LineNode.prototype.last = function () {
    if (this.hasChild()) {
        return (this.childLines[this.childLines.length - 1]);
    } else {
        return null;
    }
};
rialto.widget.LineNode.prototype.next = function () {
    if (!this.root) {
        var index = this.getIndex();
        if (index < this.parentLine.childLines.length - 1) {
            return this.parentLine.childLines[index + 1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
rialto.widget.LineNode.prototype.previous = function () {
    if (!this.root) {
        var index = this.getIndex();
        if (index > 0) {
            return this.parentLine.childLines[index - 1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
rialto.widget.LineNode.prototype.getHtmlInd = function () {
    return this.grid.getLineIndex(this.htmlGridLine);
};


objMenuCont.prototype.nbreInstance = 0;
function objMenuCont(name, width, objPar) {
    this.name = name;
    this.id = name + "_" + (objMenuCont.prototype.nbreInstance++);
    if (rialto.lang.isNumber(width)) {
        this.width = width;
    } else {
        this.width = "100%";
    }
    rialto.session.reccord(this, this.id);
    this.avecImage = false;
    this.position = "absolute";
    this.posFixe = false;
    this.posTop = 0;
    this.posLeft = 0;
    this.className = null;
    if (objPar != null) {
        if (rialto.lang.isBoolean(objPar.avecImage)) {
            this.avecImage = objPar.avecImage;
        }
        if (rialto.lang.isStringIn(objPar.position, ["static", "absolute", "relative"])) {
            this.position = objPar.position;
        }
        if (rialto.lang.isBoolean(objPar.posFixe)) {
            this.posFixe = objPar.posFixe;
        }
        if (rialto.lang.isNumber(objPar.posTop)) {
            this.posTop = objPar.posTop;
        }
        if (rialto.lang.isNumber(objPar.posLeft)) {
            this.posLeft = objPar.posLeft;
        }
        if (rialto.lang.isString(objPar.className, true)) {
            this.className = objPar.className;
        }
    }
}
objMenuCont.prototype.createMenu = function (parent) {
    this.divExt = document.createElement("DIV");
    this.divExt.style.width = this.width;
    this.divExt.className = "divMenu";
    this.divExt.style.position = this.position;
    this.divExt.style.overflow = "hidden";
    this.divExt.id = this.name;
    this.divExt.style.display = "none";
    this.divExt.style.zIndex = 10002;
    if (this.posFixe) {
        this.divExt.style.top = this.posTop;
        this.divExt.style.left = this.posLeft;
        this.divExt.className = "divMenuFixe";
    }
    if (this.className) {
        this.divExt.className = this.className;
    }
    this.tabItem = new Array();
    parent.appendChild(this.divExt);
    this.dansBody = false;
    this.divCoche = document.createElement("DIV");
    this.divCoche.className = "coche";
    this.divCoche.style.left = "5px";
    var coche = document.createElement("IMG");
    coche.src = rialtoConfig.buildImageURL("images/imgTableau/coche.gif");
    coche.style.display = "inline";
    this.divCoche.appendChild(coche);
};
objMenuCont.prototype.add = function (titre, actif, boolAvecCoche, boolCoche, img) {
    var oThis = this;
    var item = new objItemMenu(this.width, titre, actif, boolAvecCoche, img);
    var ind = this.tabItem.push(item) - 1;
    item.ind = ind;
    item.divExt.onclick = function (e) {
        if (this.oCiu.actif) {
            this.className = "divItemOff";
            oThis.itemClick(this.oCiu.ind);
            stopEvent(e);
        }
    };
    if (boolCoche) {
        item.divImg.appendChild(this.divCoche);
    }
    this.divExt.appendChild(item.divExt);
};
objMenuCont.prototype.itemClick = function (ind) {
    var item = this.tabItem[ind];
    if (item.boolAvecCoche) {
        item.divImg.appendChild(this.divCoche);
    }
    this.masqueMenu();
    this.itemClickApplicatif(ind);
};
objMenuCont.prototype.itemClickApplicatif = function (ind) {
};
objMenuCont.prototype.activeItem = function (ind) {
    var item = this.tabItem[ind];
    item.actif = true;
    item.divExt.className = "divItemOff";
};
objMenuCont.prototype.inactiveItem = function (ind) {
    var item = this.tabItem[ind];
    item.actif = false;
    item.divExt.className = "divItemInactif";
};
objMenuCont.prototype.addSeparation = function () {
    var sep = document.createElement("HR");
    this.divExt.appendChild(sep);
};
objMenuCont.prototype.afficheMenu = function (e) {
    if (objMenuCont.prototype.menuActif) {
        objMenuCont.prototype.menuActif.masqueMenu();
    }
    objMenuCont.prototype.menuActif = this;
    if (!this.posFixe) {
        if (!e) {
            var e = window.event;
        }
        if (this.dansBody == false) {
            document.body.appendChild(this.divExt);
            this.dansBody = true;
        }
        positionneSelonEvent(this.divExt, e);
        stopEvent(e);
    }
    this.divExt.style.display = "block";
};
objMenuCont.prototype.masqueMenu = function (e) {
    objMenuCont.prototype.menuActif = null;
    if (!e) {
        var e = window.event;
    }
    this.divExt.style.display = "none";
};
objMenuCont.prototype.changeTitre = function (ind, titre) {
    var item = this.tabItem[ind];
    item.changeTitre(titre);
};
objMenuCont.prototype.remove = function () {
    if (this.divExt && this.divExt.childNodes) {
        for (var idx = 0; idx < this.divExt.childNodes.length; idx++) {
            var divExt = this.divExt.childNodes[idx];
            if (divExt.oCiu) {
                divExt.oCiu.remove();
            }
        }
    }
    this.divExt.parentNode.removeChild(this.divExt);
    rialto.session.objects[this.id] = null;
};
function objItemMenu(width, titre, actif, boolAvecCoche, img) {
    var oThis = this;
    this.actif = actif;
    this.titre = titre;
    this.srcImg = img;
    if (boolAvecCoche) {
        this.boolAvecCoche = true;
    } else {
        this.boolAvecCoche = false;
    }
    this.divExt = document.createElement("DIV");
    this.divExt.style.width = width;
    this.divExt.style.height = "20px";
    if (this.actif) {
        this.divExt.className = "divItemOff";
    } else {
        this.divExt.className = "divItemInactif";
    }
    this.divImg = document.createElement("DIV");
    this.divImg.style.width = "25px";
    this.divImg.style.height = "20px";
    this.divImg.className = "imgItem";
    if (this.srcImg && !this.boolAvecCoche) {
        this.img = document.createElement("IMG");
        this.img.style.display = "inline";
        this.img.src = this.srcImg;
        this.divImg.appendChild(this.img);
    }
    this.divExt.appendChild(this.divImg);
    this.divTxt = document.createElement("DIV");
    this.divTxt.style.height = "20px";
    this.divTxt.style.width = width - 27;
    this.divTxt.style.display = "inline";
    this.divTxt.className = "textItem";
    this.divTxt.appendChild(document.createTextNode(this.titre));
    this.divExt.appendChild(this.divTxt);
    this.divExt.oCiu = this;
    this.divExt.onmouseover = function () {
        if (oThis.actif) {
            this.className += " divItemOn";
        } else {
            this.className += " divItemInactifOn";
        }
    };
    this.divExt.onmouseout = function () {
        if (oThis.actif) {
            this.className = "divItemOff";
        } else {
            this.className = "divItemInactif";
        }
    };
}
objItemMenu.prototype.changeTitre = function (titre) {
    var text = document.createTextNode(titre);
    this.divTxt.replaceChild(text, this.divTxt.firstChild);
};
objItemMenu.prototype.remove = function () {
    this.divExt.oCiu = null;
    this.divExt.onmouseover = null;
    this.divExt.onmouseout = null;
    this.divExt.onclick = null;
};


rialto.widget.simpleMenu = function (objPar) {
    if (!objPar) {
        objPar = {};
    }
    objPar.name = "menu";
    objPar.height = 0;
    if (!objPar.width) {
        objPar.width = 200;
    }
    this.base = rialto.widget.AbstractComponent;
    this.base(objPar);
    this.posFixe = false;
    this.posTop = 0;
    this.posLeft = 0;
    this.avecCoche = false;
    if (objPar != null) {
        if (objPar.name) {
            this.name = objPar.name;
        }
        if (rialto.lang.isNumber(objPar.width)) {
            this.width = objPar.width;
        }
        if (rialto.lang.isBoolean(objPar.posFixe)) {
            this.posFixe = objPar.posFixe;
        }
        if (rialto.lang.isNumber(objPar.posTop)) {
            this.posTop = objPar.posTop;
        }
        if (rialto.lang.isNumber(objPar.posLeft)) {
            this.posLeft = objPar.posLeft;
        }
        if (rialto.lang.isString(objPar.className, true)) {
            this.className = objPar.className;
        }
        if (rialto.lang.isBoolean(objPar.avecCoche)) {
            this.avecCoche = objPar.avecCoche;
        }
    }
    var oThis = this;
    this.tabItem = new Array;
    this.arrChildMenu = new Array;
    this.zoneMasque = document.createElement("DIV");
    this.zoneMasque.style.display = "none";
    this.zoneMasque.style.width = "100%";
    this.zoneMasque.style.height = "100%";
    this.zoneMasque.style.zIndex = 10002;
    this.zoneMasque.className = "ecranMasquetransparent";
    this.zoneMasque.style.display = "none";
    document.body.appendChild(this.zoneMasque);
    this.zoneMasque.onclick = function (e) {
        oThis.fermezoneMenu();
    };
    this.zoneMasque.oncontextmenu = function (e) {
        oThis.fermezoneMenu();
    };
    this.divExt = document.createElement("DIV");
    this.divExt.className = this.className;
    this.zoneMasque.appendChild(this.divExt);
    this.divExt.style.width = this.width;
    this.divExt.style.position = "absolute";
    this.ouvert = false;
    this.divExt.style.visibility = "hidden";
    this.isMenufils = false;
};
rialto.widget.simpleMenu.prototype = new rialto.widget.AbstractComponent;
rialto.widget.simpleMenu.prototype.nbreInstance = 0;
rialto.widget.simpleMenu.prototype.release = function () {
    for (var i = 0; i < this.tabItem.length; i++) {
        this.tabItem[i].remove();
    }
    this.zoneMasque.onclick = null;
    this.zoneMasque.oncontextmenu = null;
    this.divExt.parentNode.removeChild(this.divExt);
    this.zoneMasque.parentNode.removeChild(this.zoneMasque);
    rialto.session.objects[this.id] = null;
};
rialto.widget.simpleMenu.prototype.setPosLeft = function (left) {
    this.posLeft = left;
    this.divExt.style.left = this.posLeft;
};
rialto.widget.simpleMenu.prototype.setPosTop = function (top) {
    this.posTop = top;
    this.divExt.style.top = this.posTop;
};
rialto.widget.simpleMenu.prototype.setWidth = function (width) {
    this.width = width;
    this.divExt.style.width = width;
    for (var i = 0; i < this.tabItem.length; i++) {
        this.tabItem[i].setWidth(this.width);
    }
};
rialto.widget.simpleMenu.prototype.setHeight = function (height) {
    this.height = height;
    this.divExt.style.height = height;
};
rialto.widget.simpleMenu.prototype.setClassName = function (classname) {
    this.divExt.className = classname;
};
rialto.widget.simpleMenu.prototype.clear = function () {
    for (var i = 0; i < this.tabItem.length; i++) {
        this.tabItem[i].remove();
    }
    this.divExt.innerHTML = "";
    this.tabItem = new Array;
    for (var i = 0; i < this.arrChildMenu.length; i++) {
        this.zoneMasque.removeChild(this.arrChildMenu[i].divExt);
    }
    this.arrChildMenu = new Array;
};
rialto.widget.simpleMenu.prototype.add = function (obj) {
    this.divExt.appendChild(obj);
};
rialto.widget.simpleMenu.prototype.addItem = function (objPar) {
    var oThis = this;
    objPar.width = this.width;
    var item = new rialto.widget.simpleMenuItem(objPar);
    var ind = this.tabItem.push(item);
    item.parMenu = this;
    item.ind = ind - 1;
    this.add(item.divExt);
    if (item.menuFils) {
        this.addMenuFils(item.menuFils);
    }
    return item;
};
rialto.widget.simpleMenu.prototype.addMenuFils = function (objMenuFils) {
    objMenuFils.isMenufils = true;
    objMenuFils.menuPere = this;
    this.arrChildMenu.push(objMenuFils);
    this.arrChildMenu = this.arrChildMenu.concat(objMenuFils.arrChildMenu);
    objMenuFils.posFixe = true;
    this.zoneMasque.appendChild(objMenuFils.divExt);
    for (var i = 0; i < objMenuFils.arrChildMenu.length; i++) {
        this.zoneMasque.appendChild(objMenuFils.arrChildMenu[i].divExt);
    }
    if (objMenuFils.zoneMasque) {
        document.body.removeChild(objMenuFils.zoneMasque);
        objMenuFils.zoneMasque = null;
    }
};
rialto.widget.simpleMenu.prototype.addSeparation = function () {
    var oThis = this;
    divExt = document.createElement("DIV");
    divExt.style.position = "relative";
    divExt.style.width = this.width;
    divExt.style.height = 10;
    divExt.innerHTML = "<HR/>";
    divExt.onmouseover = function (e) {
        if (!e) {
            var e = window.event;
        }
        if (oThis.menuFilsActif) {
            oThis.menuFilsActif.fermezoneMenu();
            oThis.menuFilsActif = "";
        }
        stopEvent(e);
    };
    this.add(divExt);
};
rialto.widget.simpleMenu.prototype.fermezoneMenu = function () {
    for (var i = 0; i < this.arrChildMenu.length; i++) {
        this.arrChildMenu[i].fermezoneMenu();
    }
    this.divExt.style.visibility = "hidden";
    this.divExt.style.height = "";
    if (this.divExt.saveWidth != undefined) {
        this.divExt.style.width = this.divExt.saveWidth;
    }
    if (!this.isMenufils) {
        this.zoneMasque.style.display = "none";
    }
    this.ouvert = false;
    this.onClose();
};
rialto.widget.simpleMenu.prototype.affichezoneMenu = function (e, shift) {
    if (!this.isMenufils) {
        this.zoneMasque.style.display = "block";
    }
    var base = this.posFixe ? {top:this.posTop, left:this.posLeft} : e;
    var heightAvailable = _ru.$placeInViewPort(this.divExt, base, shift);
    if (heightAvailable > 0) {
        this.divExt.style.overflow = "auto";
        this.divExt.style.height = heightAvailable;
    }
    this.ouvert = true;
    if (this.isMenufils) {
        this.menuPere.menuFilsActif = this;
    }
    this.divExt.style.visibility = "visible";
};
rialto.widget.simpleMenu.prototype.clickItem = function (item) {
    if (this.avecCoche) {
        item.imgG.style.background = "url(images/imgTableau/coche.gif)";
    }
    this.onclick(item);
};
rialto.widget.simpleMenu.prototype.onOverItem = function (item) {
    if (this.menuFilsActif) {
        this.menuFilsActif.fermezoneMenu();
        this.menuFilsActif = "";
    }
    this.onOver(item);
};
rialto.widget.simpleMenu.prototype.onClose = function () {
};
rialto.widget.simpleMenu.prototype.onOver = function (item) {
};
rialto.widget.simpleMenu.prototype.onOut = function (item) {
};
rialto.widget.simpleMenu.prototype.onclick = function (item) {
};
rialto.widget.simpleMenuItem = function (objPar) {
    this.text = "";
    this.srcG = "";
    this.srcD = "";
    this.clOver = "itemMenuOn";
    this.clOut = "itemMenuOff";
    this.enable = true;
    this.width = 100;
    this.height = 23;
    this.boolcoche = false;
    this.bNotOut = false;
    this.menuFils = "";
    if (objPar) {
        if (rialto.lang.isString(objPar.text)) {
            this.text = objPar.text;
        }
        if (objPar.srcG) {
            this.srcG = objPar.srcG;
        }
        if (objPar.srcD) {
            this.srcD = objPar.srcD;
        }
        if (objPar.clOver) {
            this.clOver = objPar.clOver;
        }
        if (objPar.clOut) {
            this.clOut = objPar.clOut;
        }
        if (rialto.lang.isBoolean(objPar.enable)) {
            this.enable = objPar.enable;
        }
        if (rialto.lang.isNumber(objPar.width)) {
            this.width = objPar.width;
        }
        if (rialto.lang.isNumber(objPar.height) && objPar.height > 0) {
            this.height = objPar.height;
        }
        if (rialto.lang.isBoolean(objPar.boolcoche)) {
            this.boolcoche = objPar.boolcoche;
        }
        if (rialto.lang.isBoolean(objPar.bNotOut)) {
            this.bNotOut = objPar.bNotOut;
        }
        if (objPar.menuFils) {
            this.menuFils = objPar.menuFils;
            this.menuFils.item = this;
            this.srcD = rialtoConfig.buildImageURL("images/fleches/flecheD23-19.gif");
        }
    }
    var oThis = this;
    this.divExt = document.createElement("DIV");
    this.divExt.className = this.clOut;
    this.divExt.style.position = "relative";
    this.divExt.style.width = this.width;
    this.divExt.style.height = this.height;
    this.decal = 0;
    if (this.srcG || this.boolcoche) {
        this.decal = 19;
        this.imgG = document.createElement("DIV");
        this.imgG.className = "imgItemMenu";
        this.imgG.style.background = "url(" + this.srcG + ")";
        this.divExt.appendChild(this.imgG);
    }
    this.divText = document.createElement("DIV");
    this.divText.className = "itemText";
    this.divText.style[ATTRFLOAT] = "left";
    this.divText.appendChild(document.createTextNode(this.text));
    this.divText.title = this.text;
    this.divExt.appendChild(this.divText);
    if (this.srcD) {
        this.decal += 19;
        this.imgD = document.createElement("DIV");
        this.imgD.style.background = "url(" + this.srcD + ")";
        this.imgD.className = "imgItemMenu";
        this.divExt.appendChild(this.imgD);
    }
    this.divText.style.width = this.width - this.decal;
    this.divExt.onmouseover = function (e) {
        if (!e) {
            var e = window.event;
        }
        oThis.over(e);
    };
    if (!this.bNotOut) {
        this.divExt.onmouseout = function (e) {
            if (!e) {
                var e = window.event;
            }
            oThis.out(e);
        };
    }
    this.divExt.onclick = function (e) {
        this.className = oThis.clOut;
        if (!e) {
            var e = window.event;
        }
        oThis.parMenu.clickItem(oThis);
    };
};
rialto.widget.simpleMenuItem.prototype.remove = function () {
    this.divExt.parentNode.removeChild(this.divExt);
    this.divExt.onmouseover = null;
    this.divExt.onmouseout = null;
    this.divExt.onclick = null;
};
rialto.widget.simpleMenuItem.prototype.setWidth = function (width) {
    this.width = width;
    this.divExt.style.width = this.width;
    this.divText.style.width = this.width - this.decal;
};
rialto.widget.simpleMenuItem.prototype.over = function (e) {
    this.divExt.className = this.clOver;
    this.parMenu.onOverItem(this);
    if (this.menuFils) {
        this.menuFils.setPosTop(compOffsetTop(this.imgD) + 2);
        this.menuFils.setPosLeft(compOffsetLeft(this.imgD) + 10);
        this.menuFils.affichezoneMenu(e);
    }
};
rialto.widget.simpleMenuItem.prototype.out = function (e) {
    this.divExt.className = this.clOut;
    this.parMenu.onOut(this);
};
rialto.widget.simpleMenuItem.prototype.changeTitre = function (titre) {
    this.text = titre;
    this.divText.innerHTML = this.text;
};
rialto.widget.simpleMenuItem.prototype.setStyle = function (obStyle) {
    for (prop in obStyle) {
        try {
            this.divText.style[prop] = obStyle[prop];
        }
        catch (erreur) {
        }
    }
    this.obStyle = obStyle;
};


rialto.widget.Tree = function (objPar) {
    objPar.type = "treeview";
    this.base = rialto.widget.AbstractComponent;
    this.base(objPar);
    var oThis = this;
    this.rootOpen = true;
    this.boolSelActive = true;
    this.withRoot = true;
    this.withT = true;
    this.autoResizableH = false;
    this.autoResizableW = false;
    this.draggableNode = false;
    if (rialto.lang.isBoolean(objPar.boolSelActive)) {
        this.boolSelActive = objPar.boolSelActive;
    }
    if (rialto.lang.isBoolean(objPar.withT)) {
        this.withT = objPar.withT;
    }
    if (rialto.lang.isBoolean(objPar.rootOpen)) {
        this.rootOpen = objPar.rootOpen;
    }
    if (rialto.lang.isBoolean(objPar.withRoot)) {
        this.withRoot = objPar.withRoot;
    }
    if (rialto.lang.isBoolean(objPar.autoResizableH)) {
        this.autoResizableH = objPar.autoResizableH;
    }
    if (rialto.lang.isBoolean(objPar.autoResizableW)) {
        this.autoResizableW = objPar.autoResizableW;
    }
    if (rialto.lang.isBoolean(objPar.draggableNode)) {
        this.draggableNode = objPar.draggableNode;
    }
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divDD = document.createElement("DIV");
    this.divDD.className = "treeDivDD";
    this.divExt.style.className = "Tree_DIVSUP";
    this.divExt.style.position = this.position;
    this.divExt.style.overflow = "auto";
    this.divExt.id = this.name;
    if (objPar.rootNode) {
        this.addRoot(objPar.rootNode);
    }
    if (objPar.parent) {
        this.placeIn(objPar.parent);
    }
    objPar = null;
};
rialto.widget.Tree.prototype = new rialto.widget.AbstractComponent;
rialto.widget.Tree.prototype.release = function () {
    if (this.rootNode) {
        if (this.rootNode.img2) {
            this.rootNode.img2.onclick = null;
        }
        this.rootNode.remove();
    }
};
rialto.widget.Tree.prototype.adaptToContext = function (parent) {
    if (this.autoResizableH) {
        this.divExt.style.height = this.getNewParentHeight() - this.divExt.offsetTop;
    } else {
        this.divExt.style.height = this.height;
    }
    if (this.autoResizableW) {
        this.divExt.style.width = this.getNewParentWidth() - this.divExt.offsetLeft;
    } else {
        this.divExt.style.width = this.width;
    }
};
rialto.widget.Tree.prototype.addRoot = function (rootNode) {
    var oThis = this;
    this.rootNode = rootNode;
    this.divExt.appendChild(this.rootNode.divExt);
    this.rootNode.refTree = this;
    this.rootNode.root = true;
    this.rootNode.divText.style.top = "5px";
    this.rootNode.img1.style.diplay = "none";
    this.rootNode.img2.style.left = "0px";
    this.rootNode.divText.style.left = "24px";
    this.rootNode.DIVFILLE.style.left = "0";
    this.rootNode.DIVCONTENU.style.display = "block";
    this.rootNode.open = true;
    this.rootNode.changeIcone();
    if (!this.withRoot) {
        this.rootNode.divExt.removeChild(this.rootNode.DIVENTETE);
    } else {
        this.rootNode.img1.style.display = "none";
        this.rootNode.DIVT.style.display = "none";
        this.rootNode.img2.onclick = function (e) {
            oThis.rootNode.toggle();
        };
    }
    if (this.draggableNode) {
        this.rootNode.addTargetBehavior();
    }
};
rialto.widget.Tree.prototype.updateSize = function () {
    if (this.autoResizableH) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
};
rialto.widget.Tree.prototype.updateWidth = function () {
    var tailleCalc = parseInt(this.getNewParentWidth());
    this.divExt.style.width = tailleCalc - this.divExt.offsetLeft;
};
rialto.widget.Tree.prototype.updateHeight = function () {
    var tailleCalc = parseInt(this.getNewParentHeight());
    this.divExt.style.height = tailleCalc - this.divExt.offsetTop;
};
rialto.widget.Tree.prototype.exist = function (node, nodeId, compt) {
    var stat = {trouve:false, nd:null, nbC:compt};
    if (!compt) {
        compt = 0;
    }
    if (node.id == nodeId) {
        stat = {trouve:true, nd:node, nbC:compt};
    } else {
        var i = 0;
        while (i < node.arrChildNode.length && !stat.trouve) {
            compt++;
            stat = this.exist(node.arrChildNode[i], nodeId, compt);
            i++;
        }
    }
    return stat;
};
rialto.widget.Tree.prototype.getCount = function (node, curNode) {
    stat = {trouve:false};
    if (!curNode) {
        this.count = 0;
        curNode = this.rootNode;
    }
    if (node == curNode) {
        stat = {trouve:true, nbC:this.count};
    } else {
        var i = 0;
        while (i < curNode.arrChildNode.length && !stat.trouve) {
            this.count++;
            stat = this.getCount(node, curNode.arrChildNode[i]);
            i++;
        }
    }
    return stat;
};
rialto.widget.Tree.prototype.findValue = function (node, val) {
    stat = {trouve:false, nd:null};
    if (node.val == val) {
        stat = {trouve:true, nd:node};
    } else {
        var i = 0;
        while (i < node.arrChildNode.length && !stat.trouve) {
            stat = this.findValue(node.arrChildNode[i], val);
            i++;
        }
    }
    return stat;
};
rialto.widget.Tree.prototype.addNode = function (node, nodeIdParent) {
    if (!nodeIdParent) {
        this.add(node);
    } else {
        if (nodeIdParent == this.id) {
            this.add(node);
        } else {
            var resRech = this.exist(this.rootNode, nodeIdParent);
            if (resRech.trouve) {
                resRech.nd.addNode(node);
            } else {
                alert("not find " + node.text + " in " + nodeIdParent);
            }
        }
    }
};
rialto.widget.Tree.prototype.add = function (node) {
    if (!this.rootNode) {
        this.addRoot(node);
        node.inContainer = this;
    } else {
        this.rootNode.addNode(node);
        node.inContainer = this.rootNode;
    }
};
rialto.widget.Tree.prototype.createAndAddNode = function (nodeId, objPar) {
    var node = new rialto.widget.TreeNode(objPar);
    this.addNode(node, nodeId);
    return node;
};
rialto.widget.Tree.prototype.setStyle = function (obStyle) {
    for (prop in obStyle) {
        try {
            this.divExt.style[prop] = obStyle[prop];
        }
        catch (erreur) {
        }
    }
};
rialto.widget.Tree.prototype.getRoot = function () {
    return this.rootNode;
};
rialto.widget.Tree.prototype.onclick = function (node) {
};
rialto.widget.Tree.prototype.createCol = function (nodeDep, typeInfo) {
    var collection = new Array();
    this.examineBranche(nodeDep, typeInfo, collection);
    collection.inCourCol = 0;
    collection.isFirst = function (ind) {
        return ind == 0;
    };
    collection.isLast = function (ind) {
        return ind == (this.length - 1);
    };
    collection.clickFirst = function () {
        var node = this[0];
        node.click();
        this.inCourCol = 0;
    };
    collection.clickLast = function () {
        var node = this[this.length - 1];
        node.click();
        this.inCourCol = this.length - 1;
    };
    collection.clickNext = function () {
        if (this.inCourCol != this.length - 1) {
            var node = this[this.inCourCol + 1];
            node.click();
            this.inCourCol += 1;
        }
    };
    collection.clickPrevious = function () {
        if (this.inCourCol != 0) {
            var node = this[this.inCourCol - 1];
            node.click();
            this.inCourCol -= 1;
        }
    };
    return collection;
};
rialto.widget.Tree.prototype.examineBranche = function (node, typeInfo, collection) {
    if (node.typeInfo == typeInfo) {
        collection.push(node);
    }
    for (var i = 0; i < node.arrChildNode.length; i++) {
        this.examineBranche(node.arrChildNode[i], typeInfo, collection);
    }
};
rialto.widget.TreeNode = function (objPar) {
    objPar.type = "treenode";
    this.base = rialto.widget.AbstractComponent;
    this.base(objPar);
    var oThis = this;
    this.arrChildNode = new Array();
    this.typeInfo = "node";
    this.text = "node";
    this.icon = rialtoConfig.buildImageURL("images/imTreeview/pict_synthetik_off.gif");
    this.icon2 = this.icon;
    this._onclick = function () {
        if (!this.open) {
            this.toggle();
        }
    };
    this.open = true;
    this.reload = false;
    this.url = "";
    this.srcPlus = rialtoConfig.buildImageURL("images/imTreeview/icT/L.gif");
    this.srcMoins = rialtoConfig.buildImageURL("images/imTreeview/icT/L.gif");
    this.draggable = true;
    if (rialto.lang.isString(objPar.typeInfo)) {
        this.typeInfo = objPar.typeInfo;
    }
    if (rialto.lang.isString(objPar.text)) {
        this.text = objPar.text;
    }
    if (rialto.lang.isString(objPar.icon, true)) {
        this.icon = rialtoConfig.buildImageURL(objPar.icon);
        this.icon2 = this.icon;
    }
    if (rialto.lang.isString(objPar.icon2, true)) {
        this.icon2 = rialtoConfig.buildImageURL(objPar.icon2);
    }
    if (objPar.onclick) {
        this._onclick = objPar.onclick;
    }
    if (rialto.lang.isBoolean(objPar.open)) {
        this.open = objPar.open;
    }
    if (rialto.lang.isBoolean(objPar.reload)) {
        this.reload = objPar.reload;
    }
    if (rialto.lang.isBoolean(objPar.draggable)) {
        this.draggable = objPar.draggable;
    }
    if (rialto.lang.isString(objPar.url, true)) {
        this.url = objPar.url;
    }
    this.divExt.className = "divTree";
    this.divExt.style.width = "100%";
    this.divExt.oCiu = this;
    this.DIVENTETE = document.createElement("DIV");
    this.DIVENTETE.style.height = "23px";
    this.DIVENTETE.style.position = "relative";
    this.DIVENTETE.style.overflow = "hidden";
    this.DIVCONTENU = document.createElement("DIV");
    this.DIVCONTENU.className = "divTree";
    if (rialto.config.userAgentIsIE) {
        this.DIVCONTENU.style.height = "0px";
    }
    this.img1 = document.createElement("DIV");
    this.img1.className = "imgTreeview";
    this.DIVENTETE.appendChild(this.img1);
    this.img1.onclick = function (e) {
        if (!e) {
            var e = window.event;
        }
        oThis.toggle();
        stopEvent(e);
    };
    this.img2 = document.createElement("DIV");
    this.img2.style.backgroundImage = "url('" + this.icon + "')";
    this.img2.className = "imgTreeview";
    this.img2.style.left = 19;
    this.img2.onclick = function () {
        oThis.click();
    };
    this.DIVENTETE.appendChild(this.img2);
    this.divText = document.createElement("DIV");
    this.divText.className = "DivText";
    this.divText.style.left = 40;
    this.divText.appendChild(document.createTextNode(this.text));
    this.divText.title = this.text;
    this.DIVENTETE.appendChild(this.divText);
    this.divText.onclick = function (e) {
        if (!e) {
            e = window.event;
        }
        oThis.click();
    };
    this.DIVT = document.createElement("DIV");
    this.DIVT.style.display = "none";
    this.DIVT.style.position = "absolute";
    this.DIVT.style.width = "19px";
    this.DIVT.style.height = "100%";
    this.DIVT.style.background = "url('" + rialtoConfig.buildImageURL("images/imTreeview/icT/I.gif") + "') repeat";
    this.DIVCONTENU.appendChild(this.DIVT);
    this.DIVFILLE = document.createElement("DIV");
    this.DIVFILLE.style.left = "19px";
    this.DIVFILLE.style.position = "relative";
    this.DIVFILLE.style.overflow = "hidden";
    this.DIVFILLE.style.width = "90%";
    this.DIVCONTENU.appendChild(this.DIVFILLE);
    this.DIVCONTENU.style.display = "none";
    this.divExt.appendChild(this.DIVENTETE);
    this.divExt.appendChild(this.DIVCONTENU);
    if (this.reload) {
        this.noeudReload = new rialto.widget.TreeNode({text:"Loading...", icon:"images/imTreeview/find.small.gif"});
        this.addNode(this.noeudReload);
    }
    objPar = null;
};
rialto.widget.TreeNode.prototype = new rialto.widget.AbstractComponent;
rialto.widget.TreeNode.prototype.release = function () {
    this.img1.onclick = null;
    this.img2.onclick = null;
    this.divText.onclick = null;
    this.divText.oCiu = null;
    oThis = null;
};
rialto.widget.TreeNode.prototype.addTargetBehavior = function () {
    var oThis = this;
    rialto.widgetBehavior.affect(this.divText, "Target", {missileAsOnePixel:true, domain:"tree.node"});
    this.divText.oCiu = this;
    this.divText.DDOuter = function (missile) {
        oThis.refTree.divDD.style.display = "none";
        oThis.divText.style.backgroundColor = "";
    };
    this.divText.DDHover = function (missile) {
        var top = missile.top;
        if (top > 5 && top < 18) {
            this.insert = "add";
            oThis.refTree.divDD.style.display = "none";
            oThis.divText.style.backgroundColor = "#99CCFF";
        } else {
            oThis.divText.style.backgroundColor = "";
            if (top < 5) {
                this.insert = "before";
                oThis.refTree.divDD.style.top = 0;
            } else {
                this.insert = "after";
                oThis.refTree.divDD.style.top = 23;
            }
            oThis.refTree.divDD.style.display = "block";
            oThis.divExt.appendChild(oThis.refTree.divDD);
        }
    };
    this.divText.receiveAfterDrop = function (missile) {
        oThis.refTree.divDD.style.display = "none";
        if (rialto.config.userAgentIsIE) {
            var bBugIe = false;
            var nextNode = missile.oHtml.oCiu.next();
            if (nextNode && nextNode.hasChild()) {
                bBugIe = true;
            }
        }
        var dropOk = oThis.beforeDropIn(missile.oHtml.oCiu);
        if (dropOk) {
            var oldParentNode = missile.oHtml.oCiu.fatherNode;
            var resRech = oThis.refTree.exist(missile.oHtml.oCiu, oThis.id);
            if (!resRech.trouve) {
                if (this.oCiu != missile.oHtml.oCiu) {
                    if (this.insert == "add") {
                        oThis.addNode(missile.oHtml.oCiu);
                    } else {
                        if (this.insert == "before") {
                            oThis.insertBefore(missile.oHtml.oCiu);
                        } else {
                            oThis.insertAfter(missile.oHtml.oCiu);
                        }
                    }
                    if (rialto.config.userAgentIsIE && bBugIe) {
                        window.setTimeout("rialto.session.objects['" + nextNode.id + "'].setVisible(false);rialto.session.objects['" + nextNode.id + "'].setVisible(true)", 100);
                    }
                    oThis.onDropIn(missile.oHtml.oCiu, oldParentNode);
                }
            }
        }
    };
};
rialto.widget.TreeNode.prototype.beforeDropIn = function (node) {
    return true;
};
rialto.widget.TreeNode.prototype.onDropIn = function (node, oldParentNode) {
};
rialto.widget.TreeNode.prototype.addDDBehavior = function () {
    var oThis = this;
    this.divText.oCiu = this;
    this.addTargetBehavior();
    rialto.widgetBehavior.affect(this.divText, "Missile", {bMUpAction:false, bRectLim:false, ghost:{bIcone:true, aspect:"icon"}, domainTargets:"tree.node", targetChoice:"firstIsBetter"});
    this.divText.afterClic = function (e) {
        oThis.click();
    };
    this.bDD = true;
};
rialto.widget.TreeNode.prototype.removeDDBehavior = function () {
    rialto.widgetBehavior.desaffect(this.divText, "Missile");
    rialto.widgetBehavior.desaffect(this.divText, "Target");
};
rialto.widget.TreeNode.prototype.reloadNode = function (url) {
    var i = url.indexOf("?");
    if (i == -1) {
        url += "?TREEID=" + this.refTree.id + "&NODEID=" + this.id;
    } else {
        url += "&TREEID=" + this.refTree.id + "&NODEID=" + this.id;
    }
    this.remote = new rialto.io.AjaxRequest({url:url, callBackObjectOnSuccess:this, withWaitWindow:false, onSuccess:this.refreshReloadNode});
    this.remote.load("");
    if (!this.open) {
        this.toggle();
    }
};
rialto.widget.TreeNode.prototype.refreshReloadNode = function (request) {
    try {
        this.reload = false;
        this.removeNode(this.noeudReload.id);
        var colNode = eval("(" + request.responseText + ")");
        for (var i = 0; i < colNode.arrNode.length; i++) {
            var node = new rialto.widget.TreeNode(colNode.arrNode[i].objPar);
            this.addNode(node);
        }
    }
    catch (e) {
        alert(e);
    }
};
rialto.widget.TreeNode.prototype.click = function () {
    this.selNode();
    if (rialto.lang.isString(this._onclick)) {
        eval(this._onclick);
    } else {
        this._onclick();
    }
    var stopClick;
    stopClick = this.onclick();
    if (!stopClick) {
        this.refTree.onclick(this);
    }
};
rialto.widget.TreeNode.prototype.toggle = function () {
    var oThis = this;
    if (this.hasChild()) {
        if (this.open) {
            this.DIVCONTENU.style.display = "none";
            this.open = false;
        } else {
            this.DIVCONTENU.style.display = "block";
            this.open = true;
            if (this.reload) {
                if (this.url) {
                    this.reloadNode(this.url);
                }
            }
        }
        this.changeIcone();
    }
};
rialto.widget.TreeNode.prototype.setText = function (sText) {
    this.text = sText;
    this.divText.removeChild(this.divText.firstChild);
    this.divText.appendChild(document.createTextNode(this.text));
};
rialto.widget.TreeNode.prototype.selNode = function () {
    if (this.refTree.boolSelActive) {
        if (this.refTree.currentSelNode != null && this.refTree.currentSelNode != this) {
            this.refTree.currentSelNode.deSelNode();
        }
        this.refTree.currentSelNode = this;
        if (this.hasChild()) {
            this.divText.className += " NodeSel";
        } else {
            this.divText.className += " textSel";
        }
    }
};
rialto.widget.TreeNode.prototype.deSelNode = function () {
    if (this.refTree.boolSelActive) {
        this.divText.className = "DivText";
        if (this.refTree.currentSelNode != null && this.refTree.currentSelNode == this) {
            this.refTree.currentSelNode = null;
        }
    }
};
rialto.widget.TreeNode.prototype.hasChild = function () {
    if (this.arrChildNode.length == 0) {
        return false;
    } else {
        return true;
    }
};
rialto.widget.TreeNode.prototype.existChild = function (nodeID) {
    trouve = false;
    i = 0;
    ind = -1;
    while (!trouve && i < this.arrChildNode.length) {
        var node = this.arrChildNode[i];
        if (node.id == nodeID) {
            trouve = true;
            ind = i;
        }
        i += 1;
    }
    return ind;
};
rialto.widget.TreeNode.prototype.baseRemove = rialto.widget.AbstractComponent.prototype.remove;
rialto.widget.TreeNode.prototype.remove = function (bFromContainer, removeComeFromFather) {
    if (this.root) {
        if (this.refTree.draggableNode == true) {
            rialto.widgetBehavior.desaffect(this.divText, "Target");
        }
        this.refTree.rootNode = null;
    }
    if (this.draggable && this.refTree.draggableNode && !this.root) {
        this.removeDDBehavior();
    }
    this.draggable = false;
    if (this.fatherNode && !removeComeFromFather && !this.root) {
        rialto.array.remove(this.fatherNode.arrChildNode, this);
        if (this == this.refTree.currentSelNode) {
            this.deSelNode();
        }
        if (this.fatherNode.hasChild()) {
            var lastNode = this.fatherNode.last();
            lastNode.changeIcone();
        } else {
            this.fatherNode.changeIcone();
        }
    }
    for (var i = this.arrChildNode.length - 1; i >= 0; i--) {
        this.arrChildNode[i].remove(bFromContainer);
    }
    this.baseRemove(bFromContainer);
};
rialto.widget.TreeNode.prototype.removeNode = function (id, bjustHTML) {
    var ind = this.existChild(id);
    if (ind != -1) {
        var node = this.arrChildNode.splice(ind, 1)[0];
        if (node == this.refTree.currentSelNode) {
            node.deSelNode();
        }
        if (bjustHTML) {
            try {
                this.DIVFILLE.removeChild(node.divExt);
            }
            catch (e) {
            }
        } else {
            node.remove(false, true);
        }
        if (this.hasChild()) {
            var lastNode = this.last();
            lastNode.changeIcone();
        } else {
            this.changeIcone();
        }
    }
};
rialto.widget.TreeNode.prototype.updateParentH = function (decal) {
    var parent = this.fatherNode;
    while (parent) {
        parent.DIVFILLE.style.height = parseInt(parent.DIVFILLE.style.height) + decal;
        parent = parent.fatherNode;
    }
};
rialto.widget.TreeNode.prototype.afterAdd = function () {
    this.refTree = this.fatherNode.refTree;
    if (this.draggable && this.refTree.draggableNode && !this.bDD) {
        this.addDDBehavior();
    }
    this.changeIcone();
    for (var i = 0; i < this.arrChildNode.length; i++) {
        var node = this.arrChildNode[i];
        node.afterAdd();
    }
};
rialto.widget.TreeNode.prototype.placeIn = function (node) {
    if (node.type == "treeview") {
        node.add(this);
        this.inContainer = node;
    } else {
        node.addNode(this);
        this.inContainer = node.refTree;
    }
};
rialto.widget.TreeNode.prototype.addNode = function (node, omit_alreadyAdd_check) {
    if (!omit_alreadyAdd_check && node.fatherNode && node.fatherNode == this) {
        return;
    }
    if (node.fatherNode) {
        node.fatherNode.removeNode(node.id, true);
    }
    node.inContainer = this;
    node.fatherNode = this;
    this.arrChildNode.push(node);
    this.DIVFILLE.appendChild(node.divExt);
    if (this.open) {
        this.DIVCONTENU.style.display = "block";
    } else {
        this.DIVCONTENU.style.display = "none";
    }
    if (this.refTree) {
        node.afterAdd();
        if (this.hasChild() && this.arrChildNode.length > 1) {
            var beforelastNode = this.last().previous();
            beforelastNode.changeIcone();
        } else {
            this.changeIcone();
        }
    }
};
rialto.widget.TreeNode.prototype.insertBefore = function (node) {
    if (node.fatherNode) {
        node.fatherNode.removeNode(node.id, true);
    }
    node.fatherNode = this.fatherNode;
    ind = this.getIndex();
    if (ind != -1) {
        rialto.array.insert(this.fatherNode.arrChildNode, ind, node);
        this.fatherNode.DIVFILLE.insertBefore(node.divExt, this.divExt);
    }
    if (this.fatherNode.refTree) {
        node.afterAdd();
    }
};
rialto.widget.TreeNode.prototype.insertAfter = function (node) {
    if (this.isLast()) {
        this.fatherNode.addNode(node, true);
    } else {
        var nodeP = this.next();
        if (nodeP != node) {
            nodeP.insertBefore(node);
        }
    }
};
rialto.widget.TreeNode.prototype.changeIcone = function () {
    this.DIVT.style.display = "none";
    if (!this.refTree.withT) {
        if (this.hasChild()) {
            this.srcPlus = rialtoConfig.buildImageURL("images/imTreeview/icT/plus.gif");
            this.srcMoins = rialtoConfig.buildImageURL("images/imTreeview/icT/minus.gif");
        }
    } else {
        if (this.isLast() || (this.isLast() && this.isFirst())) {
            if (this.hasChild()) {
                this.srcPlus = rialtoConfig.buildImageURL("images/imTreeview/icT/Lplus.gif");
                this.srcMoins = rialtoConfig.buildImageURL("images/imTreeview/icT/Lminus.gif");
            } else {
                this.srcPlus = rialtoConfig.buildImageURL("images/imTreeview/icT/L.gif");
                this.srcMoins = rialtoConfig.buildImageURL("images/imTreeview/icT/L.gif");
            }
        } else {
            if (this.hasChild()) {
                this.srcPlus = rialtoConfig.buildImageURL("images/imTreeview/icT/Tplus.gif");
                this.srcMoins = rialtoConfig.buildImageURL("images/imTreeview/icT/Tminus.gif");
                this.DIVT.style.display = "block";
            } else {
                this.srcPlus = rialtoConfig.buildImageURL("images/imTreeview/icT/T.gif");
                this.srcMoins = rialtoConfig.buildImageURL("images/imTreeview/icT/T.gif");
            }
        }
    }
    if (this.open) {
        this.img1.style.background = "url('" + this.srcMoins + "')";
        this.img2.style.background = "url('" + this.icon2 + "')";
    } else {
        this.img1.style.background = "url('" + this.srcPlus + "')";
        this.img2.style.background = "url('" + this.icon + "')";
    }
    if (!this.refTree.withT) {
        if (this.hasChild()) {
            this.img1.style.visibility = "visible";
        } else {
            this.img1.style.visibility = "hidden";
        }
    } else {
        this.img1.style.visibility = "visible";
    }
};
rialto.widget.TreeNode.prototype.isLast = function () {
    if (!this.root) {
        return (this.fatherNode.arrChildNode[this.fatherNode.arrChildNode.length - 1] == this);
    } else {
        return true;
    }
};
rialto.widget.TreeNode.prototype.getIndex = function () {
    return rialto.array.indexOf(this.fatherNode.arrChildNode, this);
};
rialto.widget.TreeNode.prototype.isChild = function (node) {
    return rialto.array.indexOf(this.arrChildNode, node) != -1;
};
rialto.widget.TreeNode.prototype.getIndexInTree = function () {
    ob = this.refTree.getCount(this);
    return ob.nbC;
};
rialto.widget.TreeNode.prototype.isFirst = function () {
    if (!this.root) {
        return (this.fatherNode.arrChildNode[0] == this);
    } else {
        return true;
    }
};
rialto.widget.TreeNode.prototype.first = function () {
    if (this.hasChild()) {
        return (this.arrChildNode[0]);
    } else {
        return null;
    }
};
rialto.widget.TreeNode.prototype.last = function () {
    if (this.hasChild()) {
        return (this.arrChildNode[this.arrChildNode.length - 1]);
    } else {
        return null;
    }
};
rialto.widget.TreeNode.prototype.next = function () {
    if (!this.root) {
        var index = this.getIndex();
        if (index < this.fatherNode.arrChildNode.length - 1) {
            return this.fatherNode.arrChildNode[index + 1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
rialto.widget.TreeNode.prototype.previous = function () {
    if (!this.root) {
        var index = this.getIndex();
        if (index > 0) {
            return this.fatherNode.arrChildNode[index - 1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
rialto.widget.TreeNode.prototype.onclick = function () {
};
rialto.widget.TreeNode.prototype.onclickActionCommuneBefClic = function () {
};
rialto.widget.TreeNode.prototype.setStyle = function (obStyle) {
    for (prop in obStyle) {
        try {
            this.divText.style[prop] = obStyle[prop];
        }
        catch (erreur) {
        }
    }
};

rialto.widget.GoogleCalendar = function (objPar) {
    objPar.type = "googlecalendar";
    this.base = rialto.widget.Calendar;
    this.base(objPar);
};
rialto.widget.GoogleCalendar.prototype = new rialto.widget.Calendar;
rialto.widget.GoogleCalendar.prototype.loadSpecialDate = function (url, color) {
    this.color = color ? color : "#99CCFF";
    this.remote = new rialto.io.AjaxRequest({url:"serverSideProxy?URL=" + url, withWaitWindow:true, callBackObjectOnSuccess:this, onSuccess:this.refreshSpecialDate});
    this.remote.load("");
};
rialto.widget.GoogleCalendar.prototype.refreshSpecialDate = function (request) {
    try {
        var xmlDoc = request.responseXML;
        var arr = xmlDoc.getElementsByTagName("entry");
        for (var i = 0; i < arr.length; i++) {
            var entry = arr[i];
            var nodeTitle = entry.getElementsByTagName("title")[0];
            var titleValue = nodeTitle.firstChild.nodeValue;
            if (rialtoConfig.userAgentIsIE) {
                var nodeDate = entry.getElementsByTagName("gd:when")[0];
            } else {
                var nodeDate = entry.getElementsByTagName("when")[0];
            }
            if (nodeDate) {
                var startTime = nodeDate.getAttribute("startTime");
                var endTime = nodeDate.getAttribute("endTime");
                startTime = startTime.substr(0, 4) + startTime.substr(5, 2) + startTime.substr(8, 2);
                endTime = endTime.substr(0, 4) + endTime.substr(5, 2) + endTime.substr(8, 2);
            } else {
                var nodeDate = entry.getElementsByTagName("summary")[0];
                var nodeDateValue = nodeDate.firstChild.nodeValue;
                var arrD = nodeDateValue.split(" ");
                var startTime = rialto.string.replace(arrD[1], "-", "");
                var j = 2;
                while (arrD[j] != "to") {
                    j += 1;
                }
                var endTime = arrD[j + 1];
                if (endTime.indexOf("-") != -1) {
                    endTime = parseInt(rialto.string.replace(endTime, "-", "")) - 1 + "";
                } else {
                    endTime = startTime;
                }
            }
            var dstarTime = rialto.date.setDateFromYYYYMMDD(startTime);
            var dendTime = rialto.date.setDateFromYYYYMMDD(endTime);
            this.setSpecialDate([dstarTime, dendTime], this.color, titleValue);
        }
        this.fillCalendar();
    }
    catch (error) {
        alert(error);
    }
};

function areaAccesCtrl(libel, sourceReq, emprise) {
    var instanceExistante = eval(recupSingletonCD(sourceReq));
    if (instanceExistante) {
        return instanceExistante;
    } else {
        this.init(libel, sourceReq, emprise);
    }
}
areaAccesCtrl.prototype.init = function (libel, sourceReq, emprise, typeVoile) {
    this.libel = libel;
    this.sourceReq = sourceReq;
    this.emprise = emprise;
    if (this.libel) {
        this.titre = libel;
        var top = (document.body.clientWidth / 2) - 60;
        var left = (document.body.clientHeight / 2) - 100;
        this.fen = new rialto.widget.Dialog("fen", 0, 0, 200, 90, "", " ", typeVoile || "transparent", null, this.emprise, this);
        this.divLib = document.createElement("DIV");
        this.divLib.className = "libelle1";
        this.divLib.style.position = "absolute";
        this.divLib.style.top = "5px";
        this.divLib.style.left = "25px";
        this.divLib.style.width = "100%";
        this.text = document.createTextNode(this.libel);
        this.divLib.appendChild(this.text);
        this.fen.add(this.divLib);
        this.img = document.createElement("IMG");
        this.img.src = "images/sablier.gif";
        this.img.style.position = "absolute";
        this.img.style.height = "35px";
        this.img.style.width = "27px";
        this.img.style.left = "75px";
        this.img.style.top = "22px";
        this.fen.add(this.img);
        var wBtn = 50;
        var hBtn = 60;
        this.BANN = new rialto.widget.Button(hBtn, wBtn, "ANN", "Annuler la demande", this.fen);
        this.BANN.oCiu = this;
        this.BANN.requete = function () {
            var url = this.oCiu.urlStopServ;
            if (!this.iframe) {
                this.iframe = new objFrame("ifr", 0, 0, 0, 0, hidden = true);
                this.iframe.create(window.document);
            }
            traceExec("areaAccesCtrl.requete iframe.load url= " + url, 1);
            this.iframe.load(url);
        };
        this.BANN.onclick = function () {
            this.oCiu.stopEnCours = true;
            this.requete();
        };
    } else {
        var suffFond = typeVoile || "transparent";
        var masque;
        this.comportVerrouillage = MasqueZones;
        masque = this.comportVerrouillage(suffFond, emprise, this);
    }
};
areaAccesCtrl.prototype.specNewReq = function (idReq, url) {
    if (!this.libel) {
        return;
    }
    if (!idReq) {
        this.BANN.setVisible(false);
    } else {
        this.BANN.setVisible(true);
        this.idReq = idReq;
        i = url.indexOf("?");
        this.urlStopServ = (i == -1) ? url : url.substr(0, i);
        this.urlStopServ = this.urlStopServ + "?METHOD=STOP" + "&SOURCEREQ=" + this.sourceReq + "&IDREQ=" + this.idReq;
    }
    this.nbPeriodeAttente = 0;
    this.animeText();
};
areaAccesCtrl.prototype.animeText = function (id) {
    var strPoints = "";
    this.nbPeriodeAttente++;
    this.nbPeriodeAttente = this.nbPeriodeAttente % 5;
    for (i = 0; i < this.nbPeriodeAttente; i++) {
        strPoints += ".";
    }
    this.divLib.removeChild(this.divLib.firstChild);
    this.text = document.createTextNode(this.titre + " " + strPoints);
    this.divLib.appendChild(this.text);
    this.time = window.setTimeout("rialto.session.objects.singletonCDs[\"" + this.sourceReq + "\"].animeText()", 500);
};
areaAccesCtrl.prototype.stopControl = function (modeStop) {
    for (var e = 0; e < this.emprise.length; e++) {
        if ((nbRef = this.emprise[e].lastChild.suppRef(this)) == 0) {
            this.emprise[e].removeChild(this.emprise[e].lastChild);
        }
    }
    if (this.libel) {
        if (this.stopEnCours && (!modeStop)) {
            return;
        }
        this.stopEnCours = false;
        window.clearTimeout(this.time);
        this.fen.masqueFen();
    }
};


objFrame.prototype.nbreInstance = 0;
function objFrame(name, top, left, width, height, bAffiche) {
    this.name = name;
    this.id = name + "_" + (objFrame.prototype.nbreInstance++);
    if (!bAffiche) {
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.visibility = "hidden";
    } else {
        this.visibility = "visible";
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}
objFrame.prototype.create = function (parent) {
    rialto.session.reccord(this, this.id);
    var oThis = this;
    this.frame = document.createElement("iframe");
    this.frame.style.position = "absolute";
    this.frame.style.visibility = this.visibility;
    this.frame.style.top = this.top;
    this.frame.style.left = this.left;
    this.frame.style.width = this.width;
    this.frame.style.border = "0px solid black";
    this.frame.style.backgroundColor = "white";
    this.frame.style.height = this.height;
    this.frame.id = this.id + "IFRAME";
    this.frame.name = this.id + "IFRAME";
    this.frame.src = "";
    this.frame.oCiu = this;
    if (parent) {
        this.placeIn(parent);
    } else {
        document.body.appendChild(this.frame);
    }
};
objFrame.prototype.masque = function () {
    this.frame.style.width = 0;
    this.frame.style.height = 0;
};
objFrame.prototype.placeIn = function (parent) {
    if (parent.add) {
        parent.add(this.frame);
    } else {
        parent.appendChild(this.frame);
    }
    this.parent = this.frame.parentNode;
};
objFrame.prototype.remplit = function (inner) {
    fr = document.getElementById(this.id + "IFRAME");
    fr.contentWindow.document.write(inner);
};
objFrame.prototype.reload = function (inner) {
    fr = document.getElementById(this.id + "IFRAME");
    fr.contentWindow.document.location.reload();
};
objFrame.prototype.load = function (url) {
    if (url != null) {
        this.url = String(url);
        this.IFrameDoc = this.frame.contentWindow.document;
        this.IFrameDoc.location.replace(this.url);
    }
};
objFrame.prototype.masque = function () {
    this.frame.style.visibility = "hidden";
};
objFrame.prototype.affiche = function () {
    this.frame.style.visibility = "visible";
};
objFrame.prototype.trace = function () {
};
objFrame.prototype.getObjHtml = function () {
    return this.frame;
};
objFrame.prototype.delFrame = function (parent) {
    this.parent.removeChild(this.frame);
};


rialto.io = {};
rialto.io.AjaxRequest = function (objPar) {
    this.withWaitWindow = true;
    this.callBackObjectOnSuccess = null;
    this.callBackObjectOnFailure = null;
    this.canBeCancel = true;
    this.config = {asynchronous:true, method:"get", onSuccess:this.reportSuccess, onFailure:this.reportError};
    this.setUp(objPar);
    this.xhttpr = null;
    if (window.ActiveXObject) {
        try {
            this.xhttpr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            this.xhttpr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else {
        if (window.XMLHttpRequest) {
            this.xhttpr = new XMLHttpRequest();
        } else {
            this.xhttpr = false;
        }
    }
    this.status = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
};
rialto.io.AjaxRequest.prototype = {setUp:function (objPar) {
    if (objPar != null) {
        if (objPar.url) {
            this.url = objPar.url;
        }
        if (objPar.callBackObjectOnSuccess) {
            this.callBackObjectOnSuccess = objPar.callBackObjectOnSuccess;
        }
        if (objPar.callBackObjectOnFailure) {
            this.callBackObjectOnFailure = objPar.callBackObjectOnFailure;
        }
        if (rialto.lang.isBoolean(objPar.canBeCancel)) {
            this.canBeCancel = objPar.canBeCancel;
        }
        if (rialto.lang.isBoolean(objPar.withWaitWindow)) {
            this.withWaitWindow = objPar.withWaitWindow;
        }
        if (rialto.lang.isStringIn(objPar.method, ["post", "get"])) {
            this.config.method = objPar.method;
        }
        if (objPar.onSuccess) {
            if (this.callBackObjectOnSuccess) {
                this.config.onSuccess = rialto.lang.link(this.callBackObjectOnSuccess, objPar.onSuccess);
            } else {
                this.config.onSuccess = objPar.onSuccess;
            }
        }
        if (objPar.onFailure) {
            if (this.callBackObjectOnFailure) {
                this.config.onFailure = rialto.lang.link(this.callBackObjectOnFailure, objPar.onFailure);
            } else {
                this.config.onFailure = objPar.onFailure;
            }
        }
    }
    if (this.withWaitWindow) {
        this.config.onLoading = rialto.lang.link(this, this.displayWaitWindow);
    }
}, load:function (parameters) {
    var url = this.url;
    this.config.parameters = parameters;
    try {
        if (this.config.method == "get" && this.config.parameters.length > 0) {
            url += (url.match(/\?/) ? "&" : "?") + parameters;
        }
        this.xhttpr.open(this.config.method, url, this.config.asynchronous);
        this.xhttpr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        if (this.config.method == "post") {
            this.xhttpr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (this.config.asynchronous) {
            this.xhttpr.onreadystatechange = rialto.lang.link(this, this.respondToReadyState);
        }
        this.xhttpr.send(this.config.method == "post" ? this.config.parameters : null);
    }
    catch (e) {
        alert(e + "\n (url :" + url + ")");
    }
}, responseIsSuccess:function () {
    return (this.xhttpr.status == undefined || this.xhttpr.status == 0 || (this.xhttpr.status >= 200 && this.xhttpr.status < 300));
}, responseIsFailure:function () {
    return !this.responseIsSuccess();
}, respondToReadyState:function () {
    var readyState = this.xhttpr.readyState;
    var status = this.status[readyState];
    switch (status) {
      case "Complete":
        if (this.withWaitWindow && this.fen) {
            this.fen.setVisible(false);
        }
        try {
            this.config["on" + (this.responseIsSuccess() ? "Success" : "Failure")](this.xhttpr);
        }
        catch (e) {
        }
        break;
      default:
        try {
            this.config["on" + status](this.xhttpr);
        }
        catch (e) {
        }
        break;
    }
}, abort:function () {
    if (this.canBeCancel) {
        this.xhttpr.abort();
    }
}, displayWaitWindow:function () {
    if (this.fen) {
        this.fen.setVisible(true);
    } else {
        var oThis = this;
        this.fen = new rialto.widget.WaitWindow({text:"LOADING", canBeCancel:this.canBeCancel});
        if (this.canBeCancel) {
            this.fen.onclick = function () {
                oThis.abort();
                this.setVisible(false);
            };
        }
    }
}, reportSuccess:function (request) {
    var div = document.createElement("DIV");
    div.innerHTML = request.responseText;
    var fen = new rialto.widget.objFenData(600, 400, div, "Response");
}, reportError:function (request) {
    var div = document.createElement("DIV");
    div.innerHTML = request.responseText;
    var fen = new rialto.widget.objFenData(600, 400, div, "Sorry. There was an error.");
}};


rialto.widget.Splitter = function (objPar) {
    this.base = rialto.widget.AbstractContainer;
    objPar.type = "splitter";
    this.base(objPar);
    this.prop = 0.5;
    this.orientation = "h";
    this.autoResizableH = true;
    this.autoResizableW = true;
    this.style = "normal";
    this.withImg = false;
    this.overflow = "hidden";
    this.reverseClose = false;
    this.modeLim = "%";
    this.limInf = 0;
    this.limSup = 1;
    this.tailleCurs = 4;
    if (rialto.lang.isNumber(objPar.prop) && objPar.prop >= 0 && objPar.prop <= 1) {
        this.prop = objPar.prop;
    }
    if (rialto.lang.isStringIn(objPar.orientation, ["v", "h"])) {
        this.orientation = objPar.orientation;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeContenu)) {
        this.autoResizeContenu = objPar.autoResizeContenu;
    }
    if (rialto.lang.isBoolean(objPar.autoResizeParent)) {
        this.autoResizeParent = objPar.autoResizeParent;
        this.autoResizableH = this.autoResizeParent;
    }
    if (rialto.lang.isBoolean(objPar.autoResizableH)) {
        this.autoResizableH = objPar.autoResizableH;
    }
    if (rialto.lang.isBoolean(objPar.autoResizableW)) {
        this.autoResizableW = objPar.autoResizableW;
    }
    if (rialto.lang.isStringIn(objPar.style, ["normal", "3D"])) {
        this.style = objPar.style;
    }
    if (rialto.lang.isStringIn(objPar.overflow, ["auto", "hidden"])) {
        this.overflow = objPar.overflow;
    }
    if (rialto.lang.isStringIn(objPar.modeLim, ["%", "abs"])) {
        this.modeLim = objPar.modeLim;
    }
    if (this.modeLim == "%") {
        if (rialto.lang.isNumber(objPar.limInf) && objPar.limInf >= 0 && objPar.limInf <= 1) {
            this.limInf = objPar.limInf;
        }
        if (rialto.lang.isNumber(objPar.limSup) && objPar.limSup >= 0 && objPar.limSup <= 1) {
            this.limSup = objPar.limSup;
        }
    } else {
        if (rialto.lang.isNumber(objPar.limInf)) {
            this.limInf = objPar.limInf;
        }
        if (rialto.lang.isNumber(objPar.limSup)) {
            this.limSup = objPar.limSup;
        }
    }
    if (rialto.lang.isBoolean(objPar.reverseClose)) {
        this.reverseClose = objPar.reverseClose;
    }
    if (rialto.lang.isBoolean(objPar.withImg)) {
        this.withImg = objPar.withImg;
    }
    if (rialto.lang.isNumber(objPar.tailleCurs)) {
        this.tailleCurs = objPar.tailleCurs;
    }
    this.$$createSpliter(objPar.parent);
};
rialto.widget.Splitter.prototype = new rialto.widget.AbstractContainer;
rialto.widget.Splitter.prototype.$$createSpliter = function (parent) {
    var oThis = this;
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.width = this.width;
    this.divExt.style.height = this.height;
    this.divExt.style.position = this.position;
    this.divExt.style.overflow = "hidden";
    this.divExt.id = "splitter";
    this.div1 = document.createElement("DIV");
    this.div1.className = "Spliter_div1";
    this.div1.style.position = "absolute";
    this.div1.style.overflow = this.overflow;
    this.divExt.appendChild(this.div1);
    this.div1.oCiu = this;
    this.div2 = document.createElement("DIV");
    this.div2.className = "Spliter_div2";
    this.div2.style.position = "absolute";
    this.div2.style.overflow = this.overflow;
    this.divExt.appendChild(this.div2);
    this.div2.oCiu = this;
    this.Divcurs = document.createElement("DIV");
    this.Divcurs.style.position = "absolute";
    this.Divcurs.style.fontSize = 0;
    this.divExt.appendChild(this.Divcurs);
    this.Boutcurs = document.createElement("DIV");
    this.Boutcurs.style.position = "absolute";
    this.Boutcurs.style.fontSize = 0;
    if (this.withImg) {
        this.Divcurs.className = "Spliter_Divcurs_withImg";
        this.Boutcurs.className = "Spliter_Boutcurs_withImg";
        this.img = document.createElement("DIV");
        this.img.className = "imgTirrette_" + this.orientation;
        this.Boutcurs.appendChild(this.img);
    } else {
        this.img = this.Boutcurs;
        this.Divcurs.className = "Spliter_Divcurs_withoutImg";
        this.Boutcurs.className = "Spliter_Boutcurs_withoutImg";
    }
    this.Divcurs.appendChild(this.Boutcurs);
    this.Boutcurs.onmouseover = function () {
        oThis.Boutcurs.style.cursor = "pointer";
        if (oThis.withImg) {
            oThis.img.className = "imgTirrette_" + oThis.orientation + "_on";
        } else {
            this.className = "Spliter_Boutcurs_over";
        }
    };
    this.Boutcurs.onmouseout = function () {
        if (oThis.withImg) {
            oThis.img.className = "imgTirrette_" + oThis.orientation;
        } else {
            this.className = "Spliter_Boutcurs_withoutImg";
        }
    };
    if (parent) {
        this.placeIn(parent);
    }
};
rialto.widget.Splitter.prototype.removeAllContents = function (divSplit) {
    for (var i = this.arrChild.length - 1; i >= 0; i--) {
        if (this.arrChild[i].remove) {
            if (this.arrChild[i].parent == divSplit) {
                this.arrChild[i].remove(true);
                rialto.array.remove(this.arrChild, this.arrChild[i]);
            }
        }
    }
    divSplit.innerHTML = "";
};
rialto.widget.Splitter.prototype.removeDiv1Contents = function () {
    this.removeAllContents(this.div1);
};
rialto.widget.Splitter.prototype.removeDiv2Contents = function () {
    this.removeAllContents(this.div2);
};
rialto.widget.Splitter.prototype.release = function () {
    this.div1.oCiu = null;
    this.div2.oCiu = null;
    this.Boutcurs.onmouseover = null;
    this.Boutcurs.onmouseout = null;
    this.img.onmousedown = null;
    this.afterDD = null;
    this.afterClic = null;
    rialto.widgetBehavior.desaffect(this, "DragAndDrop");
};
rialto.widget.Splitter.prototype.masqueContenuDiv2 = function () {
    var nd = this.div2.firstChild;
    var ndSuiv = null;
    while (nd) {
        ndSuiv = nd.nextSibling;
        if (nd.oCiu && nd.oCiu.setVisible) {
            nd.oCiu.setVisible(false);
        } else {
            nd.parentNode.removeChild(nd);
        }
        nd = ndSuiv;
    }
};
rialto.widget.Splitter.prototype.getHtmlDD = function () {
    return this.img;
};
rialto.widget.Splitter.prototype.adaptToContext = function () {
    var oThis = this;
    if (this.orientation == "v") {
        this.Divcurs.style.width = "100%";
        this.Divcurs.style.height = this.tailleCurs;
        ria.utils.measures.$setHeightConformW3C(this.Divcurs);
        this.Boutcurs.style.height = this.tailleCurs;
        this.Boutcurs.style.left = "40%";
        this.Boutcurs.style.width = "20%";
        this.div1.style.width = "100%";
        this.div2.style.width = "100%";
    } else {
        this.Divcurs.style.height = "100%";
        this.Divcurs.style.width = this.tailleCurs;
        ria.utils.measures.$setWidthConformW3C(this.Divcurs);
        this.Boutcurs.style.top = "40%";
        this.Boutcurs.style.width = this.tailleCurs;
        this.Boutcurs.style.height = "20%";
        this.div1.style.height = "100%";
        this.div2.style.height = "100%";
    }
    if (this.autoResizableH) {
        this.divExt.style.height = this.getNewParentHeight() - this.divExt.offsetTop;
    } else {
        this.divExt.style.height = this.height;
    }
    if (this.autoResizableW) {
        this.divExt.style.width = this.getNewParentWidth() - this.divExt.offsetLeft;
    } else {
        this.divExt.style.width = this.width;
    }
    if (this.style == "3D") {
        var oParent = this.div1;
        var deco = new rialto.widget.decoration("", oParent);
        oParent = this.div2;
        deco = new rialto.widget.decoration("", oParent);
    }
    if (!this.parent.oCiu) {
        this.parent.oCiu = new Array();
    }
    this.parent.oCiu["splitter"] = this;
    this.img.onmousedown = function (e) {
        stopDefault(e);
    };
    rialto.widgetBehavior.affect(this, "DragAndDrop", {oHtmlToMove:this.Divcurs, oHtmlEvtTarget:this.img, ghost:{aspect:"rect", asChild:true}, bSelectMark:false, isWithLimitsDisplayed:false, movingLimits:{orientation:oThis.orientation}});
    this.afterDD = function () {
        this.div1.style.overflow = "hidden";
        this.div2.style.overflow = "hidden";
        if (oThis.withImg) {
            oThis.img.src = rialtoConfig.buildImageURL("images/tirette_" + oThis.orientation + ".gif");
        } else {
            oThis.Boutcurs.style.background = "#0099CC";
        }
//maskat start
        if (this.orientation == "v") {
            prop = parseInt(this.Divcurs.style.top) / (this.divExt.offsetHeight - parseInt(this.Divcurs.offsetHeight));
            this.fixeProp(prop, false);
        } else {
            prop = parseInt(this.Divcurs.style.left) / (this.divExt.offsetWidth - parseInt(this.Divcurs.offsetWidth));
            this.fixeProp(prop, false);
        }
//maskat end
        this.div1.style.overflow = this.overflow;
        this.div2.style.overflow = this.overflow;
    };
    this.afterClic = function () {
        if (this.reduce) {
            this.reduce = false;
            this.fixeProp(this.oldProp, false);
        } else {
            this.oldProp = this.prop;
            this.reduce = true;
            if (this.reverseClose) {
                this.fixeProp(1, false);
            } else {
                this.fixeProp(0, false);
            }
        }
    };
    this.fixeProp();
};
rialto.widget.Splitter.prototype.adaptAfterContainerChange = function () {
    this.fixeProp();
};
rialto.widget.Splitter.prototype.adaptAfterSizeChange = function () {
    this.fixeProp();
};
rialto.widget.Splitter.prototype.modDim = function (dHeight, impactPart) {
    dHeight = parseInt(dHeight);
    if (!dHeight) {
        return;
    }
    impactPart += "";
    if ("012".indexOf(impactPart) == -1) {
        return;
    }
    var newHeight = this.divExt.offsetHeight + dHeight;
    var newProp;
    this.divExt.style.height = newHeight;
    newProp = this.$$getNewProp({height:newHeight, dHeight:dHeight, part:impactPart});
    this.fixeProp(newProp, false);
};
rialto.widget.Splitter.prototype.$$getNewProp = function (specs) {
    var prop = this.prop;
    var hGlob = specs.height;
    var dHeight = specs.dHeight;
    var part = specs.part;
    if (part == 1) {
        prop = (parseInt(this.Divcurs.style.top) + dHeight) / (this.divExt.offsetHeight - parseInt(this.Divcurs.style.height));
    } else {
        if (part == 2) {
            prop = (parseInt(this.Divcurs.style.top) - dHeight) / (this.divExt.offsetHeight - parseInt(this.Divcurs.style.height));
        }
    }
    return prop;
};
rialto.widget.Splitter.prototype.updateSize = function () {
    this.div1.style.overflow = "hidden";
    this.div2.style.overflow = "hidden";
    if (this.autoResizableH) {
        this.updateHeight();
    }
    if (this.autoResizableW) {
        this.updateWidth();
    }
    this.div1.style.overflow = this.overflow;
    this.div2.style.overflow = this.overflow;
};
rialto.widget.Splitter.prototype.updateWidth = function () {
    var tailleCalc = parseInt(this.getNewParentWidth());
    this.divExt.style.width = tailleCalc;
    if (this.orientation == "v") {
        this.div1.style.width = tailleCalc;
        this.div2.style.width = tailleCalc;
    }
    this.fixeProp(this.prop, true);
    this.resizeChilds(true, false);
};
rialto.widget.Splitter.prototype.updateHeight = function () {
    var tailleCalc = parseInt(this.getNewParentHeight());
    this.divExt.style.height = tailleCalc;
    if (this.orientation == "h") {
        this.div1.style.height = tailleCalc;
        this.div2.style.height = tailleCalc;
    }
    this.fixeProp(this.prop, true);
    this.resizeChilds(false, true);
};
rialto.widget.Splitter.prototype.fixeProp = function (prop, boolMajT) {
    var oldProp = this.prop;
    if (prop != null) {
        this.prop = prop;
    }
    if (this.modeLim == "%") {
        if (this.prop < this.limInf) {
            this.prop = this.limInf;
        }
        if (this.prop > this.limSup) {
            this.prop = this.limSup;
        }
    } else {
        if ((this.prop * parseInt(this.divExt.offsetHeight)) < this.limInf) {
            this.prop = (this.limInf + 1) / parseInt(this.divExt.offsetHeight);
        } else {
            if ((this.prop * parseInt(this.divExt.offsetHeight)) > (parseInt(this.divExt.offsetHeight) - this.limInf)) {
                this.prop = (parseInt(this.divExt.offsetHeight) - this.limInf - 1) / parseInt(this.divExt.offsetHeight);
            }
        }
    }
    if (this.orientation == "v") {
        var tailleDispo = this.divExt.offsetHeight - this.Divcurs.offsetHeight;
        // maskat start
        if (tailleDispo < 0) {
            tailleDispo = 0;
        }
        // maskat end
        var tailleDiv1 = Math.floor(this.prop * (tailleDispo));
        var tailleDiv2 = tailleDispo - tailleDiv1;
        this.div1.style.height = tailleDiv1;
        this.Divcurs.style.top = parseInt(this.div1.style.height);
        this.div2.style.top = parseInt(this.Divcurs.style.top) + this.Divcurs.offsetHeight;
        this.div2.style.height = tailleDiv2;
    } else {
        var tailleDispo = this.divExt.offsetWidth - this.Divcurs.offsetWidth;
        // maskat start
        if (tailleDispo < 0) {
            tailleDispo = 0;
        }
        // maskat end
        var tailleDiv1 = Math.floor(this.prop * (tailleDispo));
        var tailleDiv2 = tailleDispo - tailleDiv1;
        this.div1.style.width = tailleDiv1;
        this.Divcurs.style.left = parseInt(this.div1.style.width);
        this.div2.style.left = parseInt(this.Divcurs.style.left) + this.Divcurs.offsetWidth;
        this.div2.style.width = tailleDiv2;
    }
    this.onresizeDiv1(this.currHeightDiv1, this.currWidthDiv1, this.div1.offsetHeight, this.div1.offsetWidth);
    this.onresizeDiv2(this.currHeightDiv2, this.currWidthDiv2, this.div2.offsetHeight, this.div2.offsetWidth);
    this.currHeightDiv1 = this.div1.offsetHeight;
    this.currWidthDiv1 = this.div1.offsetWidth;
    this.currHeightDiv2 = this.div2.offsetHeight;
    this.currWidthDiv2 = this.div2.offsetWidth;
    if (!boolMajT) {
        this.resizeChilds();
    }
};
rialto.widget.Splitter.prototype.onresizeDiv1 = function (oldH, oldW, newH, newW) {
};
rialto.widget.Splitter.prototype.onresizeDiv2 = function (oldH, oldW, newH, newW) {
};


rialto.widget.ToolBar = function (objPar) {
    this.base = rialto.widget.AbstractContainer;
    objPar.type = "toolbar";
    this.base(objPar);
    if (objPar) {
    }
    var oThis = this;
    this.divExt.style.top = this.top;
    this.divExt.style.left = this.left;
    this.divExt.style.width = this.width;
    this.divExt.style.position = "absolute";
    this.divExt.className = "toolBarDiv";
    this.imgG = document.createElement("DIV");
    this.imgG.className = "leftEdgeToolbar";
    this.imgD = document.createElement("DIV");
    this.imgD.className = "rightEdgeToolbar";
    this.divExt.appendChild(this.imgG);
    this.divExt.appendChild(this.imgD);
    if (objPar.parent) {
        this.placeIn(objPar.parent);
    }
    this.divExt.ondblclick = function (e) {
        var ev = e ? e : window.event;
        oThis.ondbleclick(ev);
    };
    objPar = null;
};
rialto.widget.ToolBar.prototype = new rialto.widget.AbstractContainer;
rialto.widget.ToolBar.prototype.addText = function (top, left, text, classname) {
    var textWidth = getTailleTexte(text, "libelle1");
    var div = document.createElement("DIV");
    div.className = "libelle1";
    div.style.top = 2;
    div.style[ATTRFLOAT] = "left";
    div.style.position = "relative";
    div.style.width = textWidth;
    div.innerHTML = text;
    this.divExt.appendChild(div);
    return div;
};
rialto.widget.ToolBar.prototype.addSpace = function () {
    var div = document.createElement("DIV");
    div.style.width = 20;
    div.style.height = "100%";
    div.style[ATTRFLOAT] = "left";
    div.style.position = "relative";
    this.divExt.appendChild(div);
};
rialto.widget.ToolBar.prototype.addSeparation = function () {
    var div = document.createElement("DIV");
    div.className = "cellSep";
    div.style[ATTRFLOAT] = "left";
    div.style.position = "relative";
    this.divExt.appendChild(div);
};
rialto.widget.ToolBar.prototype.addMenu = function (title, menu) {
    var oThis = this;
    div = this.addText("", "", title);
    div.onmouseover = function () {
        this.style.height = parseInt(this.offsetHeight) - 2;
        this.style.border = "1px solid cyan";
    };
    div.onmouseout = function () {
        this.style.border = null;
        this.style.height = parseInt(this.offsetHeight) + 2;
    };
    div.onclick = function () {
        menu.setPosTop(compOffsetTop(oThis.divExt) + 22);
        menu.setPosLeft(compOffsetLeft(oThis.divExt) + 2);
        menu.affichezoneMenu(evt = null, heightCombo = 22);
    };
    this.addSpace();
};
rialto.widget.ToolBar.prototype.addButton = function (obj) {
    ob = {position:"relative", boolFloatLeft:true};
    var but = new rialto.widget.Image("printButtonOff", 0, 2, this, "Print the content", "printButtonOn", ob);
    this.addSpace();
    return but;
};
rialto.widget.ToolBar.prototype.release = function () {
    this.divExt.ondblclick = null;
    var childDivs = this.divExt.childNodes;
    for (var lnIdx = 0; lnIdx < childDivs.length; lnIdx++) {
        var childDiv = childDivs[lnIdx];
        childDiv.onmouseover = null;
        childDiv.onmouseout = null;
        childDiv.onclick = null;
    }
};


rialto.utils.DataManager = {saveInCookie:function (key, content) {
    document.cookie = key + "=;";
    alert(escape(content));
    try {
        var dateToDay = rialto.date.toDay();
        var dateplusUnAn = rialto.date.add("year", dateToDay, 1);
        document.cookie = key + "=" + escape(content) + ";expires=" + dateplusUnAn.toGMTString();
    }
    catch (err) {
        alert(err.message);
    }
}, loadInCookie:function (key) {
    var value = "";
    var strCherher = key + "=";
    if (document.cookie.length > 0) {
        place = document.cookie.indexOf(strCherher);
        if (place != -1) {
            debut = place + strCherher.length;
            fin = document.cookie.indexOf(";", debut);
            if (fin == -1) {
                fin = document.cookie.length;
            }
            value = document.cookie.substring(debut, fin);
        }
    }
    return unescape(value);
}, getFileName:function (filePath) {
    var fileName = null;
    var ind = filePath.lastIndexOf("\\");
    if (ind != -1) {
        fileName = filePath.substr(ind + 1);
    } else {
        fileName = filePath;
    }
    return fileName;
}, saveInFile:function (content, filePath) {
    var satus = null;
    if (rialtoConfig.userAgentIsIE) {
        status = this.IESaveFile(content, filePath);
    } else {
        if (rialtoConfig.userAgentIsGecko) {
            status = this.FFSaveFile(content, filePath);
        }
    }
    return status;
}, IESaveFile:function (content, filePath) {
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
    }
    catch (e) {
        alert("Exception while attempting to save\n\n" + e.toString());
        return (null);
    }
    var file = fso.OpenTextFile(filePath, 2, -1, 0);
    file.Write(content);
    file.Close();
    return (true);
}, FFSaveFile:function (content, filePath) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    if (!filePath) {
        file = this.FxChoiceFile();
    } else {
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(filePath);
    }
    if (window.Components) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            if (file.exists()) {
            } else {
                file.create(0, 436);
            }
            var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
            out.init(file, 32 | 2, 4, null);
//maskat start
            var charset = "UTF-8";
            var os = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
            os.init(out, charset, 0, 0x0000);
            os.writeString(content);
            //out.write(content, content.length);
            //out.flush();
//maskat end
            out.close();
            return (true);
        }
        catch (e) {
            alert("Exception while attempting to save\n\n" + e);
            return (false);
        }
    }
    return (null);
}, loadFile:function (filePath) {
    var content = null;
    if (rialtoConfig.userAgentIsIE) {
        content = this.IELoadFile(filePath);
    } else {
        if (rialtoConfig.userAgentIsGecko) {
            content = this.FFLoadFile(filePath);
        }
    }
    return content;
}, IELoadFile:function (filePath) {
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var file = fso.OpenTextFile(filePath, 1);
        var content = file.ReadAll();
        file.Close();
    }
    catch (e) {
        return (null);
    }
    return (content);
}, FFLoadFile:function (filePath) {
    if (window.Components) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(filePath);
            if (!file.exists()) {
                return (null);
            }
            var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
            inputStream.init(file, 1, 4, null);
//maskat start
            //var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
            //sInputStream.init(inputStream);
            //return (sInputStream.read(sInputStream.available()));
            var charset = "UTF-8";
            var replacementChar = Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER;
            var is = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
            is.init(inputStream, charset, 1024, replacementChar);
            var str = {};
            var result="";
            while (is.readString(1024, str) != 0) {
              result+=str.value;
            }
            is.close();
            return result;
//maskat end
        }
        catch (e) {
            return (false);
        }
    }
    return (null);
}, FxChoiceFile:function (initialDirectory) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select or create a file", nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
    var rv = fp.show();
    if (rv == nsIFilePicker.returnOK) {
        alert(fp.file);
        return fp.file;
    } else {
        return null;
    }
}};


rialto.utils.RialtoWriter = function (objPar) {
    this.stringBuffer = new Array;
};
rialto.utils.RialtoWriter.prototype.createFunction = function (name, bExecute) {
    try {
        if (!name) {
            var name = "myFunct";
        }
        eval(name + "=function(){" + this.stringBuffer.join("") + "}");
        if (bExecute) {
            eval(name + "();");
        }
    }
    catch (e) {
        alert("erreur:" + e.message);
    }
    this.stringBuffer = new Array;
};
rialto.utils.RialtoWriter.prototype.getJavascriptCall = function () {
    var str = this.stringBuffer.join("\n");
    this.stringBuffer = new Array;
    return str;
};
rialto.utils.RialtoWriter.prototype.loadComponents = function (xmlDesc, withThisKeyWord) {
    if (rialto.lang.isString(xmlDesc)) {
        xmlDesc = rialto.utils.xml.createDocumentFromString(xmlDesc);
    }
    this.xmlDoc = rialto.utils.xml.getByTagName("rialto", xmlDesc)[0];
    this.topParent = this.xmlDoc.getAttribute("topParent");
    if (!this.topParent) {
        this.topParent = "document.body";
    }
    for (var i = 0; i < this.xmlDoc.childNodes.length; i++) {
        this.loadOneComponent(this.xmlDoc.childNodes[i], this.topParent, withThisKeyWord);
    }
};
rialto.utils.RialtoWriter.prototype.loadOneComponent = function (node, parent, withThisKeyWord) {
    try {
        var nodeName = node.nodeName;
        var objAttr = rialto.utils.xml.parseAttribute(node);
        objAttr.parent = parent;
        var objectName = objAttr.name;
        var strHeader = "";
        if (withThisKeyWord) {
            strHeader = "this." + objectName + "=";
        } else {
            if (objectName) {
                strHeader = "var " + objectName + "=";
            }
        }
        switch (nodeName) {
          case "alert":
            var lookAttribute = {message:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Alert(" + str + ");");
            break;
          case "button":
            var lookAttribute = {top:"", left:"", title:"", alt:"", parent:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Button(" + str + ");");
            break;
          case "checkbox":
            var lookAttribute = {name:"", top:"", left:"", parent:"", text:"", checked:"", className:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Checkbox(" + str + ");");
            break;
          case "codeLabel":
            var lookAttribute = {name:"", top:"", left:"", width:"", parent:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.codeLabel(" + str + ");");
            break;
          case "comboItem":
            this.stringBuffer.push(parent + ".addItem(\"" + objAttr.value + "\",\"" + objAttr.text + "\");");
            if (objAttr.selected) {
                this.stringBuffer.push(parent + ".selWithText(\"" + objAttr.text + "\");");
            }
            break;
          case "combo":
            var lookAttribute = {tabData:"", name:"", top:"", left:"", width:"", parent:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Combo(" + str + ");");
            break;
          case "divHtml":
            var str = rialto.utils.xml.innerNode(node);
            var bodyStr = str.split("\n");
            this.stringBuffer.push("var strHTML=\"\";\n");
            for (var i = 0; i < bodyStr.length; i++) {
                var str = rialto.string.replace(bodyStr[i], "\"", "'");
                this.stringBuffer.push("strHTML+=\"" + str + "\";\n");
            }
            this.stringBuffer.push("var " + objectName + "=document.createElement('DIV');");
            this.stringBuffer.push(objectName + ".innerHTML=strHTML;");
            this.stringBuffer.push("if(" + parent + ".add){" + parent + ".add(" + objectName + ")}else{" + parent + ".appendChild(" + objectName + ")};");
            return;
          case "javascript":
            var str = rialto.utils.xml.innerNode(node);
            var bodyStr = str.split("\n");
            for (var i = 0; i < bodyStr.length; i++) {
                this.stringBuffer.push(bodyStr[i] + "\n");
            }
            return;
          case "form":
            var lookAttribute = {name:"", url:"", parent:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Form(" + str + ");");
            break;
          case "frame":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.Frame(" + str + ");");
            break;
          case "grid":
            var gridInit = this.loadGridChild(node);
            if (!objAttr.TabEntete) {
                objAttr.TabEntete = gridInit.tabEntete;
                objAttr.tabTypeCol = gridInit.tabTypeCol;
            }
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.Grid(" + str + ");");
            if (gridInit.tabData.length > 0) {
                this.stringBuffer.push(objectName + ".fillGrid(" + rialto.array.arrayToString(gridInit.tabData) + ");");
            }
            return;
          case "gridTree":
            var gridInit = this.loadGridChild(node);
            if (!objAttr.TabEntete) {
                objAttr.TabEntete = gridInit.tabEntete;
                objAttr.tabTypeCol = gridInit.tabTypeCol;
            }
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.GridTree(" + str + ");");
            return;
          case "image":
            var lookAttribute = {imageOut:"", left:"", top:"", parent:"", alt:"", imageOn:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Image(" + str + ");");
            break;
          case "label":
            var lookAttribute = {name:"", top:"", left:"", parent:"", text:"", className:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Label(" + str + ");");
            break;
          case "popup":
            var lookAttribute = {name:"", top:"", left:"", width:"", height:"", contenu:"", title:"", fond:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.PopUp(" + str + ");");
            break;
          case "radio":
            var lookAttribute = {name:"", top:"", left:"", parent:"", group:"", text:"", checked:"", className:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Radio(" + str + ");");
            break;
          case "splitter":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.Splitter(" + str + ");");
            break;
          case "divSplitter":
            var arrDivSplitChild = rialto.utils.xml.getByTagName("divSplitter", node.parentNode);
            var index = rialto.array.indexOf(arrDivSplitChild, node) + 1;
            var objectName = parent + ".div" + index;
            var str = this.parseAttributeToString(objAttr);
            if (objAttr.backgroundColor) {
                this.stringBuffer.push(objectName + ".style.backgroundColor='" + objAttr.backgroundColor + "';");
            }
            break;
          case "tabfolder":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.TabFolder(" + str + ");");
            break;
          case "tabitem":
            var lookAttribute = {title:"", enable:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + parent + ".addTabItem(" + str + ");");
            break;
          case "text":
            var lookAttribute = {name:"", top:"", left:"", width:"", datatype:"", parent:""};
            var str = this.parseAttributeToString(objAttr, lookAttribute);
            this.stringBuffer.push(strHeader + "new rialto.widget.Text(" + str + ");");
            break;
          case "treeview":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.Tree(" + str + ");");
            break;
          case "treenode":
            objAttr.parent = null;
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.TreeNode(" + str + ");");
            this.stringBuffer.push(parent + ".addNode(" + objectName + ");");
            break;
          case "simpleWindow":
            objAttr.top = 0;
            objAttr.left = 0;
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new rialto.widget.SimpleWindow(" + str + ");");
            break;
//maskat start
          case "screen":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new maskat.widget.Window(" + str + ");");
            break;
          case "confirmDialog":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new maskat.widget.ConfirmDialog(" + str + ");");
            this.stringBuffer.push(objectName+".initialize();");
            break;
          case "endDialog":
            var str = this.parseAttributeToString(objAttr);
            this.stringBuffer.push(strHeader + "new maskat.widget.EndDialog(" + str + ");");
            this.stringBuffer.push(objectName+".initialize();");
            break;
//maskat end
          default:
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            this.loadOneComponent(node.childNodes[i], objectName);
        }
    }
    catch (e) {
        alert("erreur:" + e.message + "\nnodeName:" + nodeName);
    }
};
rialto.utils.RialtoWriter.prototype.parseAttributeToString = function (objAttr, lookAttribute) {
    var str = "";
    var attValue = "";
    if (lookAttribute) {
        for (var prop in lookAttribute) {
            attValue = "";
            if (objAttr[prop]) {
                attValue = objAttr[prop];
            }
            if (attValue == "true" || attValue == "false" || rialto.lang.isBoolean(attValue) || rialto.lang.isNumber(attValue) || prop == "parent") {
                str += attValue + ",";
            } else {
                if (rialto.lang.isString(attValue)) {
                    attValue = attValue.replace(new RegExp("\\\\", "g"), "\\\\").replace(new RegExp("\"", "g"), "\\\"");
                }
                str += "\"" + attValue + "\",";
            }
        }
    }
    str += "{";
    for (var prop in objAttr) {
        attValue = objAttr[prop];
        if (rialto.lang.isArray(attValue)) {
            str += prop + ":" + rialto.array.arrayToString(attValue) + ",";
        } else {
            if (attValue == "true" || attValue == "false" || rialto.lang.isBoolean(attValue) || rialto.lang.isNumber(attValue) || prop == "parent" || attValue.indexOf("[") != -1) {
                str += prop + ":" + attValue + ",";
            } else {
                if (rialto.lang.isString(attValue)) {
                    attValue = attValue.replace(new RegExp("\\\\", "g"), "\\\\").replace(new RegExp("\"", "g"), "\\\"");
                }
                str += prop + ":\"" + attValue + "\",";
            }
        }
    }
    str = str.substr(0, str.length - 1) + "}";
    return str;
};
rialto.utils.RialtoWriter.prototype.loadGridChild = function (node) {
    var gridInit = {tabEntete:new Array(), tabTypeCol:new Array(), tabData:new Array()};
    for (var i = 0; i < node.childNodes.length; i++) {
        var childG = node.childNodes[i];
        var nodeName = childG.nodeName;
        if (nodeName == "gridHeader") {
            var objAttr = rialto.utils.xml.parseAttribute(childG);
            gridInit.tabEntete.push(objAttr.title);
            gridInit.tabTypeCol.push([objAttr.type, objAttr.width]);
        } else {
            if (nodeName == "gridLine") {
                var tabLine = new Array;
                for (var j = 0; j < childG.childNodes.length; j++) {
                    var childC = childG.childNodes[j];
                    nodeName = childC.nodeName;
                    if (nodeName == "gridCell") {
                        var objAttr = rialto.utils.xml.parseAttribute(childC);
                        tabLine.push(objAttr.value);
                    }
                }
                gridInit.tabData.push(tabLine);
            }
        }
    }
    return gridInit;
};


rialto.utils.xml = {getByTagName:function (name, node) {
    return node.getElementsByTagName(name);
}, parseAttribute:function (node) {
    var objAttr = {};
    if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
            var attValue = node.attributes[i].value;
            var attName = node.attributes[i].name;
            objAttr[attName] = attValue;
        }
    }
    return objAttr;
}, parseObjectAsAttribute:function (objAttr) {
    var strXML = "";
    for (prop in objAttr) {
//maskat start
        if (rialto.lang.isArray(objAttr[prop])) {
            strXML+=" "+prop+"=\""+rialto.array.arrayToString(objAttr[prop]).replace(new RegExp("\\\"","g"),"'")+"\"";
        } else {
            if (rialto.lang.isString(objAttr[prop]))
                strXML+=" "+prop+"=\""+objAttr[prop].replace(new RegExp("\&","g"),"&amp;").replace(new RegExp("\"","g"),"&quot;").replace(new RegExp("<","g"),"&lt;")+"\""
            else
                strXML+=" "+prop+"=\""+objAttr[prop]+"\""
            //strXML += " " + prop + "='" + objAttr[prop] + "'";
//maskat end
        }
    }
    return strXML;
}, outerNode:function (node) {
    if (node.xml) {
        return node.xml;
    } else {
        if (typeof XMLSerializer != "undefined") {
            return (new XMLSerializer()).serializeToString(node);
        }
    }
}, innerNode:function (node) {
    var str = this.outerNode(node);
    var nameLength = node.nodeName.length;
    var start = str.indexOf(">");
    var end = str.lastIndexOf("<") - 1;
    return str.substr(start + 1, end - start);
}, createDocument:function (url, onload, obj) {
    var xmlDoc = null;
    var onLoadFunc = null;
    if (onload) {
        if (obj) {
            onLoadFunc = rialto.lang.link(obj, onload);
        } else {
            onLoadFunc = onload;
        }
    }
    if (document.implementation && document.implementation.createDocument) {
        xmlDoc = document.implementation.createDocument("", "", null);
        if (onLoadFunc) {
            xmlDoc.onload = onLoadFunc;
        }
    } else {
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
//maskat start
			//disable DTD resolve
            xmlDoc.resolveExternals = false;
            //disable DTD validation
            xmlDoc.validateOnParse = false;
//maskat end
            if (onLoadFunc) {
                xmlDoc.onreadystatechange = function () {
                    if (xmlDoc.readyState == 4) {
                        onLoadFunc();
                    }
                };
            }
        }
    }
    if (url) {
        xmlDoc.load(url);
    }
    return xmlDoc;
}, createDocumentFromString:function (str) {
    if (window.DOMParser) {
        var parser = new DOMParser();
        return parser.parseFromString(str, "text/xml");
    } else {
        if (window.ActiveXObject) {
            var xmlDoc = this.createDocument();
            if (xmlDoc) {
                xmlDoc.async = false;
                xmlDoc.loadXML(str);
                return xmlDoc;
            }
        }
    }
    return null;
}, XSLTransform:function (xslDoc, xmlDoc) {
    if (window.XSLTProcessor) {
        var proc = new XSLTProcessor();
        proc.importStylesheet(xslDoc);
        var newDoc = proc.transformToDocument(xmlDoc);
    } else {
        var newDoc = xmlDoc.transformNode(xslDoc);
    }
    return newDoc;
}};


rialto.widget.PopUp = function (name, top, left, width, height, content, title, suffFond, objPar) {
    if (!objPar) {
        var objPar = {};
    }
    objPar.name = name;
    objPar.top = top;
    objPar.left = left;
    objPar.width = width;
    objPar.height = height;
    objPar.title = title;
    this.base = rialto.widget.AbstractContainer;
    objPar.type = "PopUp";
    this.base(objPar);
    this.title = "Window";
    this.suffFond = "transparent";
    this.withCloseButon = true;
    this.visible = true;
    this.content = null;
    if (rialto.lang.isStringIn(suffFond, ["Gris", "transparent", "inherit"])) {
        this.suffFond = suffFond;
    }
    if (rialto.lang.isString(objPar.title)) {
        this.title = objPar.title;
    }
    if (rialto.lang.isBoolean(objPar.withCloseButon)) {
        this.withCloseButon = objPar.withCloseButon;
    }
    if (rialto.lang.isBoolean(objPar.visible)) {
        this.visible = objPar.visible;
    }
    if (objPar.associatedContainer) {
        this.associatedContainer = objPar.associatedContainer;
    }
    if (rialto.lang.isString(content, true)) {
        this.content = content;
    }
    this.mask = document.getElementById("popupMask");
    if (!this.mask) {
        this.mask = document.createElement("DIV");
        this.mask.id = "popupMask";
        this.mask.className = "ecranMasquetransparent";
        document.body.appendChild(this.mask);
    }
    rialto.widget.PopUp.prototype.pileWindow.push(this);
    this.updatePile();
    if (this.suffFond != "inherit") {
        this.mask.className = "ecranMasque" + this.suffFond;
    }
    var divStyle = this.divExt.style;
    divStyle.top = this.top;
    divStyle.left = this.left;
    divStyle.width = this.width;
    divStyle.height = parseInt(this.height) + 46;
    divStyle.position = this.position;
    this.placeIn(this.mask);
    this.divCont = document.createElement("DIV");
    this.divCont.className = "contenuActif";
    divStyle = this.divCont.style;
    divStyle.top = 33;
    divStyle.left = 12;
    divStyle.position = "absolute";
    divStyle.width = parseInt(this.width) - 20;
    divStyle.height = parseInt(this.height);
    this.divExt.appendChild(this.divCont);
    if (this.associatedContainer && this.associatedContainer.record) {
        this.associatedContainer.record(this);
    }
    if (this.content) {
        this.divCont.appendChild(document.createTextNode(this.content));
    }
    this.insideMask = document.createElement("DIV");
    this.insideMask.className = "ecranMasqueTransparent";
    this.insideMask.style.zIndex = 0;
    this.insideMask.style.display = "none";
    this.divExt.appendChild(this.insideMask);
    objPar = null;
};
rialto.widget.PopUp.prototype = new rialto.widget.AbstractContainer;
rialto.widget.PopUp.prototype.adaptToContext = function (parent) {
    var oThis = this;
    var oParent = this.divExt;
    this.deco = new rialto.widget.decoration("popup", oParent);
    this.divTitle = this.deco.DivTitle;
    this.divTitle.appendChild(document.createTextNode(this.title));
    this.divIcon = this.deco.DivIconD;
    this.holdImg = document.createElement("DIV");
    this.holdImg.className = "imgTirrette_popup";
    this.divExt.appendChild(this.holdImg);
    ria.utils.measures.$centerW(this.holdImg);
    if (this.withCloseButon) {
        this.btnClose = new rialto.widget.Image("btonFenFermOff", 0, 0, this.divIcon, rialto.I18N.getLabel("lanCloseWindow"), "btonFenFermOn", {boolFloatRight:true});
        this.btnClose.onclick = function () {
            oThis.closeWindow();
        };
    }
    rialto.widgetBehavior.affect(this.holdImg, "DragAndDrop", {oHtmlToMove:this.divExt, oHtmlEvtTarget:this.deco.tDecor.tirette, ghost:{aspect:"frame"}, bRectLim:false, bSelectMark:false});
};
rialto.widget.PopUp.prototype.pileWindow = new Array;
rialto.widget.PopUp.prototype.updatePile = function () {
    var almostOnevisible = false;
    for (var i = 0; i < rialto.widget.PopUp.prototype.pileWindow.length; i++) {
        var pop = rialto.widget.PopUp.prototype.pileWindow[i];
        if (pop.isVisible()) {
            almostOnevisible = true;
            if (i != rialto.widget.PopUp.prototype.pileWindow.length - 1 && pop.isEnable()) {
                pop.setEnable(false, true);
            }
        }
    }
    if (!almostOnevisible) {
        this.mask.style.display = "none";
    } else {
        this.mask.style.display = "block";
    }
};
rialto.widget.PopUp.prototype.release = function () {
    this.mask.className = "ecranMasqueTransparent";
    this.removeFromPile();
    var pop = this.getLastEnableInPile();
    if (pop) {
        pop.setEnable(true);
    }
    this.updatePile();
    if (this.btnClose) {
        this.btnClose.onclick = null;
    }
    rialto.widgetBehavior.desaffect(this.holdImg, "DragAndDrop");
};
rialto.widget.PopUp.prototype.getHtmlCont = function () {
    return this.divCont;
};
rialto.widget.PopUp.prototype.closeWindow = function () {
    this.onClose();
    this.remove();
};
rialto.widget.PopUp.prototype.removeFromPile = function () {
    rialto.array.remove(rialto.widget.PopUp.prototype.pileWindow, this);
};
rialto.widget.PopUp.prototype.setAsLastInPile = function () {
    this.removeFromPile();
    rialto.widget.PopUp.prototype.pileWindow.push(this);
};
rialto.widget.PopUp.prototype.getLastEnableInPile = function () {
    for (var i = rialto.widget.PopUp.prototype.pileWindow.length - 1; i >= 0; i--) {
        var pop = rialto.widget.PopUp.prototype.pileWindow[i];
        if (pop.isVisible()) {
            return pop;
        }
    }
    return null;
};
rialto.widget.PopUp.prototype.setEnable = function (enable, fromUpdatePile) {
    if (enable) {
        this.insideMask.style.display = "none";
        if (this.suffFond != "inherit") {
            this.mask.className = "ecranMasque" + this.suffFond;
        }
        this.setAsLastInPile();
    } else {
        this.insideMask.style.display = "block";
        if (!fromUpdatePile) {
            var pop = this.getLastEnableInPile();
            if (pop) {
                pop.setEnable(true);
            }
        }
    }
    this.enable = enable;
};
rialto.widget.PopUp.prototype.setVisible = function (visible) {
    if (visible) {
        this.setEnable(true);
        if (this.suffFond != "inherit") {
            this.mask.className = "ecranMasque" + this.suffFond;
        }
        this.mask.style.display = "block";
        this.divExt.style.display = "block";
    } else {
        this.mask.className = "ecranMasqueTransparent";
        this.visible = false;
        var pop = this.getLastEnableInPile();
        if (pop) {
            pop.setEnable(true);
        }
        this.divExt.style.display = "none";
    }
    this.visible = visible;
    this.updatePile();
};
rialto.widget.PopUp.prototype.setTitle = function (newtitle) {
    this.divTitle.replaceChild(document.createTextNode(newtitle), this.divTitle.firstChild);
    this.onSetTitle(newtitle);
};
rialto.widget.PopUp.prototype.onSetTitle = function (newtitle) {
};
rialto.widget.PopUp.prototype.onClose = function () {
};


rialto.onLoad = function () {
    if (rialto.loaded) {
        return;
    }
    rialto.loaded = true;
    rialto.session.oParameters = rialto.url.getObjectParameter();
    rialto.appearence.initSkin();
    if (rialto.config.isDebug) {
        console.info("CONSOLE READY FOR DEBUG");
    } else {
        var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
        if (!window.console || !window.console.firebug) {
            window.console = {};
        }
        for (var i = 0; i < names.length; ++i) {
            window.console[names[i]] = function () {
            };
        }
    }
    rialto._boot();
};
rialto.onUnLoad = function () {
    if (rialto) {
        rialto.session.removeAll();
    }
    return true;
};
if (rialtoConfig.userAgentIsIE) {
    if (document.body) {
        ria.utils.event.genericAddEvent(document.body, "readystatechange", rialto.onLoad);
    } else {
        ria.utils.event.genericAddEvent(document, "readystatechange", rialto.onLoad);
    }
} else {
    ria.utils.event.genericAddEvent(window, "load", rialto.onLoad);
}
ria.utils.event.genericAddEvent(window, "beforeunload", rialto.onUnLoad);
rialto.appearence = {};
rialto.appearence.initSkin = function () {
    if (!rialto.config.skinList) {
        return;
    }
    rialto.appearence.currentSkin = rialtoConfig.skin || "standart";
    var cssId = rialto.appearence.currentSkin + "_" + rialtoConfig.baseIdCssWithSkin;
    var linkCss = document.getElementById(cssId);
    if (linkCss) {
        linkCss.disabled = false;
    }
    for (var i = 0; i < rialtoConfig.skinList.length; i++) {
        var othCssId = rialtoConfig.skinList[i] + "_" + rialtoConfig.baseIdCssWithSkin;
        linkCss = document.getElementById(othCssId);
        if (linkCss) {
            linkCss.disabled = (cssId != othCssId);
        }
    }
};
rialto.appearence.setSkin = function (skin, isForcedUpdate) {
    if (!rialto.config.skinList) {
        return;
    }
    traceExec("setSkin " + skin, 73);
    if (!isForcedUpdate && (skin == rialto.appearence.currentSkin)) {
        return;
    }
    var cssId = rialto.appearence.currentSkin + "_" + rialtoConfig.baseIdCssWithSkin;
    document.getElementById(cssId).disabled = true;
    rialto.appearence.currentSkin = skin;
    cssId = rialto.appearence.currentSkin + "_" + rialtoConfig.baseIdCssWithSkin;
    document.getElementById(cssId).disabled = false;
};
rialto._boot = function () {
    rialto.I18N.setLanguage(rialto.config.language);
    var widthGlobal = document.body.clientWidth;
    var heightGlobal = document.body.clientHeight;
    document.onclick = function () {
        if (objMenuCont.prototype.menuActif) {
            objMenuCont.prototype.menuActif.masqueMenu();
        }
    };
    document.oncontextmenu = function () {
        if (objMenuCont.prototype.menuActif) {
            objMenuCont.prototype.menuActif.masqueMenu();
        }
        return false;
    };
    document.body.style.overflow = "hidden";
    document.body.arrChild = new Array();
    document.body.oRia = document.body;
    document.body.id = "body";
    document.body.isContainer = true;
    document.body.record = rialto.widget.AbstractContainer.prototype.record;
    document.body.removeContents = rialto.widget.AbstractContainer.prototype.removeContents;
    document.body.updateToContent = function () {
    };
    document.body.resizeChilds = rialto.widget.AbstractContainer.prototype.resizeChilds;
    document.body.remove = function () {
        document.body.oRia = null;
        document.onselectstart = null;
        document.onclick = null;
        document.oncontextmenu = null;
        document.body.record = null;
        document.body.removeContents = null;
        document.body.updateToContent = null;
        document.body.resizeChilds = null;
    };
    window.onresize = function () {
        var over = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.body.resizeChilds();
        document.body.style.overflow = over;
    };
};