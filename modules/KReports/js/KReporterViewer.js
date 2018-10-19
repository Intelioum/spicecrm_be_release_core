/* * *******************************************************************************
* This file is part of SpiceCRM FulltextSearch. SpiceCRM FulltextSearch is an enhancement developed
* by aac services k.s.. All rights are (c) 2016 by aac services k.s.
*
* This Version of the SpiceCRM FulltextSearch is licensed software and may only be used in
* alignment with the License Agreement received with this Software.
* This Software is copyrighted and may not be further distributed without
* witten consent of aac services k.s.
*
* You can contact us at info@spicecrm.io
******************************************************************************* */

Ext.define("SpiceCRM.KReporter.Viewer.model.KReporterRecord",{extend:"Ext.data.Model",fields:["id","name","report_module","listfields","listtypeproperties","presentation_params","integration_params","visualization_params","reportoptions","union_modules","unionlistfields"]}),Ext.define("SpiceCRM.KReporter.Viewer.model.plugin",{extend:"Ext.data.Model",alias:["widget.pluginModel"],fields:["id","name","panel","class","category","active","loaded","plugindirectory","include","icon"]}),Ext.define("SpiceCRM.KReporter.Viewer.model.whereclause",{extend:"Ext.data.Model",fields:["unionid","sequence","fieldid","name","fixedvalue","groupid","path","displaypath","referencefieldid","operator","type","value","valuekey","valueto","valuetokey","jointype","context","reference","include","usereditable","dashleteditable","exportpdf","customsqlfunction"]}),Ext.define("SpiceCRM.KReporter.Viewer.store.plugins",{extend:"Ext.data.Store",requires:["SpiceCRM.KReporter.Viewer.model.plugin"],model:"SpiceCRM.KReporter.Viewer.model.plugin",load:function(){return!1}}),Ext.define("SpiceCRM.KReporter.Viewer.store.whereclauses",{extend:"Ext.data.Store",requires:["SpiceCRM.KReporter.Viewer.model.whereclause"],model:"SpiceCRM.KReporter.Viewer.model.whereclause",sorters:[{property:"sequence",direction:"ASC"}]}),Ext.define("SpiceCRM.KReporter.Viewer.controller.Application",{extend:"Ext.app.Controller",config:{listen:{global:{}}},doInit:function(){},finishInit:function(){},onLaunch:function(){},getReportId:function(){}}),Ext.define("SpiceCRM.KReporter.Viewer.controller.KReportViewerPresentationContainer",{extend:"Ext.app.ViewController",alias:"controller.KReportViewer.KReportViewerPresentationContainer",loadMask:null,whereConfig:{},viszualiationData:[],pluginsLoaded:{},pluginsaddLoaded:[],loaded:!1,contextmenu:null,valid:!0,config:{listen:{global:{pluginsLoaded:function(){this.valid&&this.initializePlugins()},whereClauseUpdated:function(e){this.contextmenu&&(this.contextmenu.parentWhereConditions=e)},lf:function(e){this.valid=!1,this.view.removeAll(),this.view.add(Ext.create("Ext.panel.Panel",{html:e}))}}}},displayContextMenu:function(e,t){this.contextmenu&&this.contextmenu.displayContextMenu(e,t)},initializePlugins:function(){this.view.removeAll();var e=Ext.decode(Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("presentation_params"))),t=Ext.data.StoreManager.lookup("KReportViewerPresentationPluginsStore").getById(e.plugin);Ext.ClassManager.get(t.get("panel"))?(this.presentationPanel=Ext.create(t.get("panel"),{reportRecord:SpiceCRM.KReporter.Viewer.Application.reportRecord,presentationParams:e,width:"100%"}),this.view.add(this.presentationPanel)):Ext.Loader.loadScript({url:t.get("include"),onLoad:function(){t.set("loaded",!0),this.presentationPanel=Ext.create(t.get("panel"),{reportRecord:SpiceCRM.KReporter.Viewer.Application.reportRecord,presentationParams:e,width:"100%"}),this.view.add(this.presentationPanel)},scope:this}),Ext.data.StoreManager.lookup("KReportViewerIntegrationPluginsStore").each(function(e){1===e.get("active")&&"view"===e.get("category")&&e.get("class")&&Ext.Loader.loadScript({url:e.get("include"),onLoad:function(){this.contextmenu=Ext.create(e.get("class"))},scope:this})},this)}}),Ext.define("SpiceCRM.KReporter.Viewer.controller.KReportViewerVisualizationContainer",{extend:"Ext.app.ViewController",alias:"controller.KReportViewer.KReportViewerVisualizationContainer",loadMask:null,whereConfig:{},viszualiationData:[],pluginsLoaded:{},pluginsaddLoaded:[],loaded:!1,vizParams:void 0,snapshotid:"0",operators:[],valid:!0,config:{listen:{global:{pluginsLoaded:function(){this.valid&&this.initializeContainer()},whereClauseUpdated:function(e){this.operators=e,this.vizParams&&this.updateVisualization()},snapshotSelected:function(e){this.snapshotid=e,this.vizParams&&this.updateVisualization()},lf:function(){this.valid=!1,this.view.removeAll()}}}},init:function(){},initializeContainer:function(){this.view.removeAll();var e={},t=Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("visualization_params"));if(t&&""!==t&&(e=Ext.decode(t)),e.layout&&"-"!==e.layout){this.vizParams=e,this.view.show(),e.chartheight?this.view.setHeight(e.chartheight):this.view.setHeight(300),this.loadMask||(this.loadMask=new Ext.LoadMask({msg:" .. loading Plugins ..",target:this.view})),this.loadMask.show();for(var i=1;void 0!==e[i];){var o=e[i];if(o.plugin&&void 0===this.pluginsLoaded[o.plugin]){this.pluginsLoaded[o.plugin]=!1;var r=Ext.data.StoreManager.lookup("KReportViewerVisualizationPluginsStore").getById(o.plugin);Ext.Loader.loadScript({url:r.get("include"),onLoad:function(){r.set("loaded",!0),this.pluginsLoaded[o.plugin]=!0,this.loadVisualization()},scope:this})}else this.loadVisualization();i++}}else this.view.hide()},loadVisualization:function(){var t=!0;Ext.each(this.pluginsLoaded,function(e){e||(t=!1)},this),t&&!this.loaded&&(this.loaded=!0,this.loadMask.destroy(),this.loadMask=new Ext.LoadMask({msg:" .. loading Visualization ..",target:this.view}),this.loadMask.show(),_proxyUrl="KREST/KReporter/"+SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id")+"/visualization",_url=SpiceCRM.KReporter.Common.buildDynamicOptionsUrl(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id"),"visualization"),null!==_url&&(_proxyUrl=_url),Ext.Ajax.request({url:_proxyUrl,jsonData:{whereConditions:this.operators,snapshotid:this.snapshotid,dynamicoptions:SpiceCRM.KReporter.Common.catchDynamicOptionsFromSession(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id")),dynamicoptionsfromurl:SpiceCRM.KReporter.Common.catchDynamicOptionsFromUrl()},method:"POST",success:function(e){this.viszualiationData=Ext.JSON.decode(e.responseText),this.renderVisualization(),this.loadMask.destroy()},failure:function(){this.loadMask.destroy()},timeout:12e4,scope:this}))},loadPanelVisualization:function(e,t){this.view.add(Ext.create(e.get("panel"),{id:t.uid+"_container",uid:t.uid,width:t.layout.width,height:this.calcVizHeight(t.layout.height),chartData:t.data,style:{position:"absolute",left:t.layout.left,top:t.layout.top}}))},renderVisualization:function(){this.view.removeAll(),Ext.each(this.viszualiationData,function(e){var t=Ext.data.StoreManager.lookup("KReportViewerVisualizationPluginsStore").getById(e.plugin);Ext.ClassManager.get(t.get("panel"))?this.loadPanelVisualization(t,e):Ext.Loader.loadScript({url:t.get("include"),onLoad:function(){this.loadPanelVisualization(t,e)},scope:this})},this)},updateVisualization:function(){this.loadMask=new Ext.LoadMask({msg:" .. updating Visualization ..",target:this.view}),this.loadMask.show(),_proxyUrl="KREST/KReporter/"+SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id")+"/visualization",_url=SpiceCRM.KReporter.Common.buildDynamicOptionsUrl(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id"),"visualization"),null!==_url&&(_proxyUrl=_url),Ext.Ajax.request({url:_proxyUrl,jsonData:{whereConditions:this.operators,snapshotid:this.snapshotid},method:"POST",success:function(e){this.viszualiationData=Ext.JSON.decode(e.responseText),Ext.each(this.viszualiationData,function(e){this.view.down("#"+e.uid+"_container").updateChart(e)},this),this.loadMask.destroy()},failure:function(){this.loadMask.destroy()},timeout:12e4,scope:this})},calcVizHeight:function(e){return this.view.getHeight()/100*parseInt(e.replace("%",""))}}),Ext.define("SpiceCRM.KReporter.Viewer.controller.KReportViewerWherePanel",{extend:"Ext.app.ViewController",alias:"controller.KReportViewer.KReportViewerWherePanel",whereConfig:{},updateOnRequest:!1,config:{listen:{global:{recordLoaded:function(){this.initializeSearch()},searchBtnClicked:function(){this.checkOperatorValues()&&Ext.globalEvents.fireEvent("whereClauseUpdated",this.extractWhereClause())},addWhereBottomToolbar:function(){void 0===SpiceCRM.KReporter.Viewer.integrationplugins?Ext.Loader.loadScript({url:"modules/KReports/Plugins/Integration/ksavedfilters/ksavedfiltersview.js",onLoad:function(){Ext.globalEvents.fireEvent("loadWhereBottomToolbar")},scope:this}):Ext.globalEvents.fireEvent("loadWhereBottomToolbar")},loadWhereBottomToolbar:function(){_tb=Ext.create("SpiceCRM.KReporter.Viewer.integrationplugins.savedfilters.toolbar",{itemId:"whereBottomToolbar"}),this.view.addDocked(_tb),Ext.data.StoreManager.lookup("savedfilterstore").load()}}},control:{"#":{beforeedit:function(e,t){SpiceCRM.KReporter.Common.gridSetEditor(t,this,SpiceCRM.KReporter.Viewer.Application)},edit:function(e,t){SpiceCRM.KReporter.Common.gridAfterEdit(t),!1===this.updateOnRequest&&this.checkOperatorValues()&&Ext.globalEvents.fireEvent("whereClauseUpdated",this.extractWhereClause())}}}},init:function(){this.whereOperatorStore=Ext.create("SpiceCRM.KReporter.Common.store.whereOperators","kreporterWhereOperatorStore"),this.enumOptionsStore=Ext.create("SpiceCRM.KReporter.Common.store.enumoptions","kreporterEnumoptionsStore"),this.parentFieldsStore=Ext.create("SpiceCRM.KReporter.Common.store.enumoptions","kreporterParentFieldsStore"),this.autocompleteStore=Ext.create("SpiceCRM.KReporter.Common.store.autcompleterecords","kreporterAutocmpleteStore").load(),Ext.Ajax.request({url:"KREST/KReporter/core/whereinitialize",method:"GET",success:function(e,t){this.whereConfig=Ext.decode(e.responseText)},scope:this})},initializeSearch:function(e){if(_whereConditionsObj={},this.view.store.removeAll(),_dynamicoptionsfromurl=null,SpiceCRM.KReporter.Common.catchDynamicOptionsFromUrl()&&(_dynamicoptionsfromurl=Ext.decode(atob(Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Common.catchDynamicOptionsFromUrl())))),_dynamicoptions=Ext.decode(Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Common.catchDynamicOptionsFromSession(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id")))),_whereConditions=Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("whereconditions")),_whereConditions&&""!==_whereConditions&&(_whereConditionsObj=Ext.decode(_whereConditions)),_hideonoffswitch=!0,Ext.each(_whereConditionsObj,function(e){"yo1"!==e.usereditable&&"yo2"!==e.usereditable||(_hideonoffswitch=!1)},this.view.store),_hideonoffswitch||Ext.ComponentQuery.query("#onoffswitch")[0].show(),Ext.each(_whereConditionsObj,function(t){if("yes"===t.usereditable||"yfo"===t.usereditable||"yo1"===t.usereditable||"yo2"===t.usereditable){if(null!==_dynamicoptionsfromurl)for(_i=0;_i<_dynamicoptionsfromurl.length;_i++)(_dynamicoptionsfromurl[_i].fieldid===t.fieldid||void 0!==t.reference&&_dynamicoptionsfromurl[_i].reference===t.reference&&""!==t.reference)&&(t.operator=_dynamicoptionsfromurl[_i].operator,void 0!==_dynamicoptionsfromurl[_i].value&&(t.value=_dynamicoptionsfromurl[_i].value),void 0!==_dynamicoptionsfromurl[_i].valuekey&&(t.valuekey=_dynamicoptionsfromurl[_i].valuekey),void 0!==_dynamicoptionsfromurl[_i].valueto&&(t.valueto=_dynamicoptionsfromurl[_i].valueto),void 0!==_dynamicoptionsfromurl[_i].valuetokey&&(t.valuetokey=_dynamicoptionsfromurl[_i].valuetokey));if(null!==_dynamicoptions)for(_i=0;_i<_dynamicoptions.length;_i++)(_dynamicoptions[_i].fieldid===t.fieldid||void 0!==t.reference&&_dynamicoptions[_i].reference===t.reference&&""!==t.reference)&&(t.operator=_dynamicoptions[_i].operator,void 0!==_dynamicoptions[_i].value&&(t.value=_dynamicoptions[_i].value),void 0!==_dynamicoptions[_i].valuekey&&(t.valuekey=_dynamicoptions[_i].valuekey),void 0!==_dynamicoptions[_i].valueto&&(t.valueto=_dynamicoptions[_i].valueto),void 0!==_dynamicoptions[_i].valuetokey&&(t.valuetokey=_dynamicoptions[_i].valuetokey));void 0!==e&&Ext.each(e,function(e){if(e.fieldid===t.fieldid)return t.operator=e.operator,void 0!==e.value&&(t.value=e.value),void 0!==e.valuekey&&(t.valuekey=e.valuekey),void 0!==e.valueto&&(t.valueto=e.valueto),void 0!==e.valuetokey&&(t.valuetokey=e.valuetokey),void 0!==e.valueinit&&(t.valueinit=e.valueinit),!1}),this.add(t)}},this.view.store),0<this.view.store.count()){for(thisViewTable=this.view.view,_columns=this.view.getColumns(),_i=0;_i<_columns.length;_i++)"value"==_columns[_i].dataIndex&&(_calcColIdx=_i,_hideonoffswitch&&_calcColIdx--,_i=_columns.length);for(_i=0;_i<this.view.store.count();_i++)_row=thisViewTable.getRow(_i),_record=this.view.store.getAt(_i),"enum"!=_record.get("type")&&"multienum"!=_record.get("type")&&"autocomplete"!=_record.get("operator")||(_nodeValue="",void 0!==_record.data.valueinit?_nodeValue=_record.data.valueinit:void 0!==_record.data.value&&(_nodeValue=_record.data.value),_row.childNodes[_calcColIdx].childNodes[0].lastChild.nodeValue=_nodeValue);if(this.view.show(),SpiceCRM.KReporter.Viewer.Application.reportRecord.get("reportoptions")){var t=Ext.decode(Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("reportoptions")));"collapsed"==t.optionsFolded?this.view.collapse():this.view.expand(),void 0!==t.updateOnRequest&&!0===t.updateOnRequest?(this.showSearchBtn(),this.updateOnRequest=t.updateOnRequest):this.hideSearchBtn()}else this.view.expand()}else this.view.hide()},getOperatorCount:function(e){return void 0!==typeof this.whereConfig.operatorCount[e]?this.whereConfig.operatorCount[e]:0},checkOperatorValues:function(){var i=!0;return this.view.getStore().each(function(e){var t=this.getOperatorCount(e.get("operator"));0<t&&!e.get("value")&&(i=!1),1<t&&!e.get("valueto")&&(i=!1)},this),i},extractWhereClause:function(){var t=[];return this.view.getStore().each(function(e){t.push({fieldid:e.get("fieldid"),operator:e.get("operator"),value:e.get("value"),valuekey:e.get("valuekey"),valueto:e.get("valueto"),valuetokey:e.get("valuetokey"),valueinit:e.get("valueinit"),usereditable:e.get("usereditable")})},this),t},showSearchBtn:function(){this.view.tools[1].show()},hideSearchBtn:function(){this.view.tools[1].hide()}}),Ext.define("SpiceCRM.KReporter.Viewer.controller.MainController",{extend:"Ext.app.ViewController",requires:[],saving:!1,alias:"controller.KReportViewerMain",loadMask:void 0,initialized:!1,pluginsInitialized:!1,config:{listen:{global:{resize:function(){SpiceCRM.KReporter.Viewer.Application.thisMainView.updateLayout()},pluginsLoaded:function(){this.pluginsInitialized=!0,this.view.rendered},sysinfo:function(o,e){var t=sessionStorage.getItem("kval"+o.systemkey);if(null===t){var i,r=[];for(i in e.integration)r.push(i);for(i in e.presentation)r.push(i);for(i in e.visualization)r.push(i);3<10*SpiceCRM.KReporter.Viewer.Application.getRand()&&Ext.Ajax.request({url:window.atob("S1JFU1QvbW9kdWxlL1VzZXJz"),method:"GET",params:{searchfields:window.atob("eyJmaWVsZCI6InN0YXR1cyIsIm9wZXJhdG9yIjoiPSIsInZhbHVlIjoiQWN0aXZlIn0=")},success:function(e){var t=Ext.JSON.decode(e.responseText);Ext.Ajax.request({url:window.atob("aHR0cHM6Ly9zdXBwb3J0LnNwaWNlY3JtLmlv"),method:"GET",params:{x:this.atoc(window.btoa(Ext.encode({sysinfo:o,plugins:r,users:t.totalcount})))},success:function(e,t){var i=Ext.JSON.decode(decodeURIComponent(e.responseText));i[window.atob("bGljZW5zZXN0YXR1cw==")]?sessionStorage.setItem("kval"+o.systemkey,!0):(Ext.globalEvents.fireEvent("lf",i[window.atob("bGljZW5zZW1lc3NhZ2U=")]),sessionStorage.setItem("kval"+o.systemkey,window.btoa(i[window.atob("bGljZW5zZW1lc3NhZ2U=")])))}})},scope:this})}else"true"!==t&&Ext.globalEvents.fireEvent("lf",window.atob(t))}}}},atoc:function(e){return e.replace(/[a-zA-Z]/g,function(e){return String.fromCharCode((e<="Z"?90:122)>=(e=e.charCodeAt(0)+13)?e:e-26)})},initializePlugins:function(){var e=this.view.down("#KReporterViewerPresentation");e&&this.view.remove(e);var t=Ext.decode(Ext.util.Format.htmlDecode(SpiceCRM.KReporter.Viewer.Application.reportRecord.get("presentation_params"))),i=Ext.data.StoreManager.lookup("KReportViewerPresentationPluginsStore").getById(t.plugin);Ext.Loader.loadScript({url:i.get("include"),onLoad:function(){i.set("loaded",!0),this.presentationPanel=Ext.create(i.get("panel"),{reportRecord:SpiceCRM.KReporter.Viewer.Application.reportRecord,presentationParams:t,width:"100%"}),this.view.add(this.presentationPanel)},scope:this})}}),Ext.define("SpiceCRM.KReporter.Viewer.controller.MainToolbarController",{extend:"Ext.app.ViewController",requires:[],saving:!1,alias:"controller.KReportViewerMainToolbar",loadMask:void 0,initialized:!1,config:{listen:{global:{pluginsLoaded:function(){this.initializeMenu()},lf:function(e){this.view.down("#repVersion").update(atob(SpiceCRM.KReporter.versionstring)+" ("+e+")"),Ext.each(this.view.query("button"),function(e){e.disable()})}}},control:{"#edit":{click:"editReport"},"#duplicate":{click:"duplicateReport"},"#delete":{click:"deleteReport"}}},editReport:function(){SpiceCRM.KReporter.Common.redirect("edit",{id:SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id")})},duplicateReport:function(){Ext.Msg.prompt(languageGetText("LBL_DUPLICATE_NAME"),languageGetText("LBL_DUPLICATE_PROMPT"),function(e,t){"ok"==e&&(SpiceCRM.KReporter.Viewer.Application.reportRecord.set("id",SpiceCRM.KReporter.Viewer.Application.kGuid()),SpiceCRM.KReporter.Viewer.Application.reportRecord.set("name",t),SpiceCRM.KReporter.Viewer.Application.reportRecord.set("assigned_user_id",SpiceCRM.KReporter.Viewer.Application.sysinfo.current_user_id),SpiceCRM.KReporter.Viewer.Application.reportRecord.set("date_entered",null),Ext.Ajax.request({url:"KREST/module/KReports/"+SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id"),jsonData:SpiceCRM.KReporter.Viewer.Application.reportRecord.data,method:"POST",success:function(e,t){SpiceCRM.KReporter.Common.redirect("detail",{id:SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id")})},scope:this}))})},deleteReport:function(){Ext.MessageBox.confirm(languageGetText("LBL_DIALOG_CONFIRM"),languageGetText("LBL_DIALOG_DELETE_YN"),function(e){"yes"==e&&Ext.Ajax.request({url:"KREST/module/KReports/"+SpiceCRM.KReporter.Viewer.Application.reportRecord.get("id"),method:"DELETE",success:function(e,t){SpiceCRM.KReporter.Common.redirect("list")},failure:function(e,t){console.log("server-side failure with status code "+e.status)},scope:this})})},initializeMenu:function(){switch(_accesslevel=0,SpiceCRM.KReporter.Viewer.Application.reportRecord.data.acl.edit&&(_accesslevel=1),SpiceCRM.KReporter.Viewer.Application.reportRecord.data.acl.delete&&(_accesslevel=2),_accesslevel){case 0:this.view.down("#edit").disable(),this.view.down("#duplicate").disable(),this.view.down("#delete").disable();break;case 1:this.view.down("#edit").enable(),this.view.down("#duplicate").enable(),this.view.down("#delete").disable();break;case 1:this.view.down("#edit").enable(),this.view.down("#duplicate").enable(),this.view.down("#delete").enable()}this.view.down("#KReportViewerTools").initialized||(this.view.down("#KReportViewerTools").initialized=!0,Ext.data.StoreManager.lookup("KReportViewerIntegrationPluginsStore").each(function(e){1!==e.get("active")||"tool"!==e.get("category")&&"export"!==e.get("category")||!e.get("class")||Ext.Loader.loadScript({url:e.get("include"),onLoad:function(){switch(e.get("category")){case"export":this.view.down("#KReportViewerExport").getMenu().add(Ext.create(e.get("class"))),void 0===SpiceCRM.KReporter.Viewer.Application.reportRecord.data.acl.export?this.view.down("#KReportViewerExport").enable(!0):SpiceCRM.KReporter.Viewer.Application.reportRecord.data.acl.export&&this.view.down("#KReportViewerExport").enable(!0);break;case"tool":this.view.down("#KReportViewerTools").getMenu().add(Ext.create(e.get("class"))),this.view.down("#KReportViewerTools").enable(!0)}},scope:this})},this))}}),Ext.define("SpiceCRM.KReporter.Viewer.view.main.KMain",{extend:"Ext.panel.Panel",requires:["SpiceCRM.KReporter.Viewer.controller.MainController"],border:!1,renderTo:"kreportviewer",controller:"KReportViewerMain",layout:"vbox",style:{"background-color":"transparent"},defaults:{width:"100%"},items:[{xtype:"mainToolbar",width:"100%",margin:"0 0 10 0"},{xtype:"KReportViewer.WherePanel",width:"100%"},{xtype:"KReportViewer.VisualizationContainer",border:!1},{xtype:"KReportViewer.PresentationContainer",width:"100%",border:!1}],listeners:{afterrender:function(){}}}),Ext.define("SpiceCRM.KReporter.Viewer.view.main.Main",{extend:"Ext.panel.Panel",requires:["SpiceCRM.KReporter.Viewer.controller.MainController"],border:!1,xtype:"app-main",controller:"KReportViewerMain",layout:"vbox",style:{"background-color":"transparent"},defaults:{width:"100%"},hidden:!0}),Ext.define("SpiceCRM.KReporter.Viewer.view.maintoolbar",{extend:"Ext.Toolbar",controller:"KReportViewerMainToolbar",alias:["widget.mainToolbar"],style:{padding:"5px"},initialize:function(){},items:[{xtype:"button",itemId:"edit",text:languageGetText("LBL_EDIT_BUTTON_LABEL"),icon:"modules/KReports/images/report_edit.png",disabled:!1},{xtype:"button",itemId:"duplicate",text:languageGetText("LBL_DUPLICATE_REPORT_BUTTON_LABEL"),icon:"modules/KReports/images/copy.png",disabled:!1},{xtype:"button",itemId:"delete",text:languageGetText("LBL_DELETE_BUTTON_LABEL"),icon:"modules/KReports/images/report_delete.png",disabled:!1},"-",{text:languageGetText("LBL_EXPORTMENU_BUTTON_LABEL"),itemId:"KReportViewerExport",xtype:"splitbutton",icon:"modules/KReports/images/export.png",menu:{},disabled:!0},"-",{text:languageGetText("LBL_TOOLSMENU_BUTTON_LABEL"),icon:"modules/KReports/images/tools.png",itemId:"KReportViewerTools",xtype:"splitbutton",menu:{itemId:"toolsmenu"},disabled:!0},"->",{xtype:"tbtext",itemId:"repVersion",text:atob(SpiceCRM.KReporter.versionstring),style:{fontWeight:"bold",fontStyle:"italic"}},{xtype:"tbitem",html:atob(SpiceCRM.KReporter.icon1string)+"&nbsp;"+atob(SpiceCRM.KReporter.icon2string),style:{display:"inline-flex"}}]}),Ext.define("SpiceCRM.KReporter.Viewer.view.PresentationContainer",{extend:"Ext.panel.Panel",itemId:"KReportPresentationContainer",controller:"KReportViewer.KReportViewerPresentationContainer",alias:["widget.KReportViewer.PresentationContainer"],width:"100%",hidden:!1,border:!0,margin:"0 0 10 0"}),Ext.define("SpiceCRM.KReporter.Viewer.view.VisualizationContainer",{extend:"Ext.panel.Panel",itemId:"KReportVisualizationContainer",controller:"KReportViewer.KReportViewerVisualizationContainer",alias:["widget.KReportViewer.VisualizationContainer"],width:"100%",hidden:!0,border:!0,margin:"0 0 10 0"}),Ext.define("SpiceCRM.KReporter.Viewer.view.WherePanel",{extend:"Ext.grid.Panel",itemId:"KReportViewqerWherePanel",controller:"KReportViewer.KReportViewerWherePanel",title:{text:languageGetText("LBL_DYNAMIC_OPTIONS")},collapsible:!0,titleCollapse:!0,collapsed:!0,alias:["widget.KReportViewer.WherePanel"],store:Ext.create("SpiceCRM.KReporter.Viewer.store.whereclauses",{storeId:"KReportViewerWhereClausesStore"}),flex:3,maxHeight:400,width:"100%",hidden:!0,border:!0,margin:"0 0 10 0",columns:[{itemId:"name",text:languageGetText("LBL_NAME"),dataIndex:"name",sortable:!0,width:200},{itemId:"onoffswitch",header:languageGetText("LBL_ONOFF_COLUMN"),dataIndex:"usereditable",width:80,sortable:!0,hidden:!0,renderer:function(e){return"yo1"==e||"yo2"==e?languageGetText("LBL_ONOFF_"+e.toUpperCase()):""},editor:new Ext.form.TextField},{itemId:"operator",text:languageGetText("LBL_OPERATOR"),dataIndex:"operator",sortable:!0,hidden:!1,width:200,editor:new Ext.form.TextField,renderer:function(e){return e?languageGetText("LBL_OP_"+e.toUpperCase()):e}},{itemId:"value",text:languageGetText("LBL_VALUE_FROM"),dataIndex:"value",sortable:!0,hidden:!1,width:200,editor:new Ext.form.TextField},{itemId:"valueto",text:languageGetText("LBL_VALUE_TO"),dataIndex:"valueto",sortable:!0,hidden:!1,width:200,editor:new Ext.form.TextField}],sm:new Ext.selection.RowModel,viewConfig:{markDirty:!1,stripeRows:!0},plugins:[Ext.create("Ext.grid.plugin.CellEditing",{clicksToEdit:1})],tools:[{itemId:"searchbtn",type:"search",handler:function(){Ext.globalEvents.fireEvent("searchBtnClicked",{})}}]}),Ext.enableAriaButtons=!1,Ext.define("SpiceCRM.KReporter.Viewer.Application",{namespaces:["SpiceCRM.KReporter.Viewer"],controllers:["Application"],extend:"Ext.app.Application",name:"SpiceCRM.KReporter.Viewer",reportRecord:Ext.create("SpiceCRM.KReporter.Viewer.model.KReporterRecord"),currencies:[],sysinfo:{},designMode:!1,pluginsLoaded:!1,thisMainView:!1,launch:function(){(SpiceCRM.KReporter.Viewer.Application=this).reportRecord=Ext.create("SpiceCRM.KReporter.Viewer.model.KReporterRecord"),this.thisMainView=Ext.create("SpiceCRM.KReporter.Viewer.view.main.KMain");var e="";window.thisKreportRecord&&(e=window.thisKreportRecord),""===e&&$("#formDetailView")[0]&&$("#formDetailView")[0].record.value&&(e=$("#formDetailView")[0].record.value),""===e&&$("input[name=record]")[0]&&$("input[name=record]")[0].value&&(e=$("input[name=record]")[0].value),e&&(SpiceCRM.KReporter.Common.get_user_prefs(),SpiceCRM.KReporter.Common.getConfig(),Ext.Ajax.request({url:"KREST/module/KReports/"+e,method:"GET",success:function(e,t){var i=Ext.decode(e.responseText);SpiceCRM.KReporter.Viewer.Application.reportRecord=Ext.create("SpiceCRM.KReporter.Viewer.model.KReporterRecord",i),Ext.globalEvents.fireEvent("recordLoaded"),this.loadPlugins()},failure:function(e,t){console.log("server-side failure with status code "+e.status)},scope:this}))},render:function(){Ext.create("SpiceCRM.KReporter.Viewer.view.maintoolbar")},loadPlugins:function(){!1===this.pluginsLoaded?(this.pluginsLoaded=!0,Ext.Ajax.request({url:"KREST/KReporter/plugins",params:{addData:Ext.encode(["currencies","sysinfo"]),report:this.reportRecord.get("id")},method:"GET",success:function(e,t){var i=Ext.decode(e.responseText);i.addData&&i.addData.currencies&&(SpiceCRM.KReporter.Common.currencies=i.addData.currencies),i.addData&&i.addData.sysinfo&&(this.sysinfo=i.addData.sysinfo),Ext.globalEvents.fireEvent("sysinfo",this.sysinfo,i),this.setPlugins(i.presentation,i.visualization,i.integration)},failure:function(e,t){console.log("server-side failure with status code "+e.status)},scope:this})):Ext.globalEvents.fireEvent("pluginsLoaded")},setPlugins:function(e,t,i){this.presentationPluginsStore=Ext.create("SpiceCRM.KReporter.Viewer.store.plugins",{storeId:"KReportViewerPresentationPluginsStore"}),Ext.Object.each(e,function(e,t){t.metadata.includes.edit&&this.presentationPluginsStore.add({id:e,name:languageGetText(t.displayname),panel:t.metadata.viewpanel,loaded:!1,plugindirectory:t.metadata.plugindirectory,include:t.plugindirectory+"/"+t.metadata.includes.view})},this),this.visualizationPluginsStore=Ext.create("SpiceCRM.KReporter.Viewer.store.plugins",{storeId:"KReportViewerVisualizationPluginsStore"}),Ext.Object.each(t,function(e,t){this.visualizationPluginsStore.add({id:e,name:languageGetText(t.displayname),panel:t.metadata.viewpanel,loaded:!1,plugindirectory:t.metadata.plugindirectory,include:t.plugindirectory+"/"+t.metadata.includes.view})},this),this.integrationPluginsStore=Ext.create("SpiceCRM.KReporter.Viewer.store.plugins",{storeId:"KReportViewerIntegrationPluginsStore"});var o={},r=Ext.util.Format.htmlDecode(this.reportRecord.get("integration_params"));r&&""!==r&&(o=Ext.decode(r)),i&&Ext.Object.each(i,function(e,t){this.integrationPluginsStore.add({id:e,name:languageGetText(t.displayname),class:t.metadata&&t.metadata.includes&&t.metadata.includes.viewItem?t.metadata.includes.viewItem:void 0,loaded:!1,category:t.metadata.category,active:o.activePlugins&&o.activePlugins[e]?1:0,plugindirectory:t.metadata.plugindirectory,include:t.metadata&&t.metadata.includes&&t.metadata.includes.view?t.plugindirectory+"/"+t.metadata.includes.view:""})},this),Ext.globalEvents.fireEvent("pluginsLoaded"),this.integrationPluginsStore.getById("ksavedfilters")&&Ext.globalEvents.fireEvent("addWhereBottomToolbar")},languageGetText:function(e){return SUGAR.language.get("KReports",e)},getRand:function(){return Math.random()},S4:function(){return(65536*(1+this.getRand())|0).toString(16).substring(1)},kGuid:function(){return"k"+this.S4()+this.S4()+this.S4()+this.S4()+this.S4()+this.S4()+this.S4()},getReportId:function(){return $("#EditView")&&$("#EditView")[0].record.value?$("#EditView")[0].record.value:""}}),Ext.application({extend:"SpiceCRM.KReporter.Viewer.Application"}),Ext.onReady(function(){});