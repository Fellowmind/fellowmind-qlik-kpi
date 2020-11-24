define(["qlik",
		 "jquery", 
		 "css!./style.css", 
		 "./getSheets"], 
		 function (qlik, $, cssContent, getSheets) {
	'use strict';
	var app;
	var sheets = [];
	var template = '<div qv-extension style="height: 100%; position: relative; overflow: auto;">	<div class="frame" ng-class="{\'default\': data.rows[0].measures.length == 1, \'green\': 1==1}" ng-click="action()">	    <div class="content" ng-style="content">			<div class="header" ng-style="header" >				<h2 lui-popover-trigger x-dock="right" x-template="$ctrl.popoverTemplate">{{settings.label}}</h2>			</div>			<div class="main-kpi" ng-style="mainKpi">				<p>					<i class="lui-icon  lui-icon--triangle-top" aria-hidden="true" ng-if="change == \'up\' && settings.ShowIcon"></i>					<i class="lui-icon  lui-icon--triangle-bottom" aria-hidden="true" ng-if="change == \'down\' && settings.ShowIcon"></i>					<span ng-if="Math.abs(data.rows[0].measures[0].qNum) < 1000 || settings.simple">{{data.rows[0].measures[0].qText}}</span>					<span ng-if="Math.abs(data.rows[0].measures[0].qNum) >= 1000000000 && !settings.simple">{{data.rows[0].measures[0].qNum / 1000000000 | number:2}} G</span>					<span ng-if="Math.abs(data.rows[0].measures[0].qNum) < 1000000000 && Math.abs(data.rows[0].measures[0].qNum) >= 1000000 && !settings.simple">{{data.rows[0].measures[0].qNum / 1000000 | number:2}} M </span>					<span ng-if="Math.abs(data.rows[0].measures[0].qNum) < 1000000 && Math.abs(data.rows[0].measures[0].qNum) >= 1000 && !settings.simple">{{data.rows[0].measures[0].qNum / 1000 | number:2}} k </span>				</p>			</div>			<!-- Show the comparison % -->			<div class="compare-kpi" ng-style="compareKpi" ng-if="settings.ShowCompValue==1">				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) < 1000 || settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qText}} /					{{ ((data.rows[0].measures[0].qNum) / (data.rows[0].measures[1].qNum ) -1) *100 | number:1 }}%				</p>				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) >= 1000000000 && !settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qNum / 1000000000 | number:2}} G /					{{ ((data.rows[0].measures[0].qNum) / (data.rows[0].measures[1].qNum )-1)*100 | number:1 }}%				</p>				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) < 1000000000 &amp;&amp; Math.abs(data.rows[0].measures[1].qNum) >= 1000000 && !settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qNum / 1000000 | number:2}} M /					{{ ((data.rows[0].measures[0].qNum) / (data.rows[0].measures[1].qNum )-1)*100 | number:1 }}%				</p>				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) < 1000000 &amp;&amp; Math.abs(data.rows[0].measures[1].qNum) >= 1000 && !settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qNum / 1000 | number:2}} k /					{{ ((data.rows[0].measures[0].qNum) / (data.rows[0].measures[1].qNum )-1)*100 | number:1 }}%				</p>			</div>			<!-- Dont show the comparison % -->			<div class="compare-kpi" ng-style="compareKpi" ng-if="settings.ShowCompValue==0">				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) < 1000 || settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qText}}				</p>				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) >= 1000000000 && !settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qNum / 1000000000 | number:2}} G				</p>				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) < 1000000000 &amp;&amp; Math.abs(data.rows[0].measures[1].qNum) >= 1000000 && !settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qNum / 1000000 | number:2}} M				</p>				<p ng-if="Math.abs(data.rows[0].measures[1].qNum) < 1000000 &amp;&amp; Math.abs(data.rows[0].measures[1].qNum) >= 1000 && !settings.simple">					{{settings.secondarylabel}}&nbsp;{{data.rows[0].measures[1].qNum / 1000 | number:2}} k				</p>			</div>		</div>	</div></div>';

	return {
		template: template,
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			},
			listItems: []
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				measures: {
					uses: "measures",
					min: 1,
					max: 2
				},
				settings: {
					uses: "settings",
					items: {
						MyList: {
							type: "array",
							ref: "listItems",
							label: "Actions",
							itemTitleRef: "settings.action1type",
							allowAdd: true,
							allowRemove: true,
							addTranslation: "Add action",
							items: {
								actionType: {
									component: "dropdown",
									type: "string",
									defaultValue: "Field",
									options: [{
											"label": "Variable",
											"value": "Variable"
										},
										{
											"label": "Sheet",
											"value": "Sheet"
										},
										{
											"label": "Field",
											"value": "Field"
										}
									],
									ref: "settings.action1type",
									label: "Action Type"
								},
								actionName: {
									type: "string",
									expression: "optional",
									defaultValue: "",
									ref: "settings.action1name",
									label: function (data) {
										if (data.settings.action1type === 'Field') {
											return 'Field name';
										} else {
											return 'Variable name';
										}
									},
									show: function (data) {
										return data.settings.action1type !== 'Sheet';
									}
								},
								actionValue: {
									type: "string",
									expression: "optional",
									defaultValue: "",
									ref: "settings.action1value",
									label: "Value",
									show: function (data) {
										return data.settings.action1type !== 'Sheet';
									}
								},
								action1Method: {
									ref: "settings.action1Method",
									defaultValue: false,
									component: "switch",
									type: "bool",
									label: "Append to field selections",
									show: function (data) {
										return data.settings.action1type === 'Field';
									},
									options: [{
											"label": "Append",
											"value": true
										},
										{
											"label": "Replace",
											"value": false
										}
									],
								},
								sheet: {
									type: "string",
									defaultValue: "",
									ref: "settings.sheet",
									label: "Select Sheet",
									component: "dropdown",
									options: function () {
										return getSheets().then(function (items) {
											return items;
										});
									},
									show: function (data) {
										return data.settings.action1type === 'Sheet'
									}
								},
							}
						},
						colors: {
							type: "items",
							label: "Colors",
							items: {
								headerbg: {
									type: "string",
									expression: "optional",
									defaultValue: "#efefef",
									ref: "settings.headerbg",
									label: "Header background"
								},
								bg: {
									type: "string",
									expression: "optional",
									defaultValue: "transparent",
									ref: "settings.bg",
									label: "Background"
								},
								headerColor: {
									type: "string",
									expression: "optional",
									defaultValue: "black",
									ref: "settings.headercolor",
									label: "Header font color"
								},
								mainColor: {
									type: "string",
									expression: "optional",
									defaultValue: "black",
									ref: "settings.maincolor",
									label: "KPI Color (Measure 1)"
								},
								secondaryColor: {
									type: "string",
									expression: "optional",
									defaultValue: "gray",
									ref: "settings.secondarycolor",
									label: "Comparison color (Measure 2)"
								},
								indicatorColor: {
									type: "string",
									expression: "optional",
									defaultValue: "green",
									ref: "settings.indicatorcolor",
									label: "Indicator color"
								},
								borderColor: {
									type: "string",
									expression: "optional",
									defaultValue: "none",
									ref: "settings.bordercolor",
									label: "Border color"
								},
								borderWidth: {
									type: "string",
									expression: "optional",
									defaultValue: "1px",
									ref: "settings.borderwidth",
									label: "Border width"
								},
								headerBorderColor: {
									type: "string",
									expression: "optional",
									defaultValue: "none",
									ref: "settings.headerborder",
									label: "Header border color"
								},
							}
						},
						styles: {
							type: "items",
							label: "Settings",
							items: {
								label: {
									type: "string",
									expression: "optional",
									defaultValue: "",
									ref: "settings.label",
									label: "Header"
								},
								secondaryLabel: {
									type: "string",
									expression: "optional",
									defaultValue: "",
									ref: "settings.secondarylabel",
									label: "Comparison header"
								},
								simpleNumbers: {
									ref: "settings.simple",
									defaultValue: false,
									component: "switch",
									type: "number",
									label: "Show simplified numbers",
									options: [{
											"label": "Yes",
											"value": false
										},
										{
											"label": "No",
											"value": true
										}
									],
								},
								showComparison: {
									ref: "settings.ShowCompValue",
									defaultValue: 0,
									component: "switch",
									type: "number",
									label: "Show comparison",
									options: [{
											"label": "No",
											"value": 0
										},
										{
											"label": "Yes",
											"value": 1
										}
									],
								},
								showIcon: {
									ref: "settings.ShowIcon",
									defaultValue: false,
									component: "switch",
									type: "bool",
									label: "Show comparison icon",
									options: [{
											"label": "Yes",
											"value": true
										},
										{
											"label": "No",
											"value": false
										}
									],
								}
							}
						},
					}
				}
			}
		},
		support: {
			snapshot: true,
			export: true,
			exportData: true
		},
		paint: function ($element, layout) {
			app = qlik.currApp(this);

			if (!this.$scope.data && layout.settings) {
				this.$scope.data = qlik.table(this);
				this.$scope.settings = layout.settings;
				this.$scope.listItems = layout.listItems;
			}

			if (this.$scope.data.rows[0].measures.length > 1) {
				if ((this.$scope.data.rows[0].measures[0].qNum - this.$scope.data.rows[0].measures[1].qNum) > 0) {
					this.$scope.change = "up";
				} else if ((this.$scope.data.rows[0].measures[0].qNum - this.$scope.data.rows[0].measures[1].qNum) < 0) {
					this.$scope.change = "down";
				}
			}

			this.$scope.applyStyles();
			return qlik.Promise.resolve();
		},
		controller: ['$scope', function ($scope) {
			$scope.Math = window.Math;

			$scope.applyStyles = function () {
				$scope.mainKpi = {
					color: $scope.settings.maincolor,
					borderRight: $scope.settings.borderwidth + ' solid ' + $scope.settings.bordercolor,
					background: $scope.settings.bg,
				};
				$scope.header = {
					color: $scope.settings.headercolor,
					background: $scope.settings.headerbg,
					borderBottom: '1px solid ' + $scope.settings.headerborder,
					borderRight: $scope.settings.borderwidth + ' solid ' + $scope.settings.bordercolor,
					borderTop: $scope.settings.borderwidth + ' solid ' + $scope.settings.bordercolor,
				};
				$scope.compareKpi = {
					color: $scope.settings.secondarycolor,
					borderRight: $scope.settings.borderwidth + ' solid ' + $scope.settings.bordercolor,
					borderBottom: $scope.settings.borderwidth + ' solid ' + $scope.settings.bordercolor,
					background: $scope.settings.bg,
				};
				$scope.content = {
					borderLeftColor: $scope.settings.indicatorcolor,
				};
			};

			$scope.action = function () {
				if (qlik.navigation.getMode() !== 'edit') {
					for (var i = 0; i <= $scope.listItems.length - 1; i++) {
						switch ($scope.listItems[i].settings.action1type) {
							//app level commands
						case 'Field':
							app.field($scope.listItems[i].settings.action1name).selectValues([$scope.listItems[i].settings.action1value], $scope.listItems[i].settings.action1Method);
							break;
						case 'Sheet':
							var num = i;
							qlik.navigation.gotoSheet($scope.listItems[i].settings.sheet.split("|")[1]);

							break;
						case 'Variable':
							app.variable.setContent($scope.listItems[i].settings.action1name, $scope.listItems[i].settings.action1value);
							break;
						}
					}
				}
			}
		}]
	};
});