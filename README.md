# eCraft KPI Extension

eCraft KPI extension is configurable and clean looking KPI Extension for Qlik Sense.

Unlimited amount of custom actions can be added when clicking the extension

## Import Extension to Sense Server ##
1. Download comment.zip
2. Import extension in QMC Extension section

![qmc.png](https://bitbucket.org/repo/R9rrbbo/images/918736976-qmc.png)

## Features ##
* Custom and conditional coloring of indicator and KPI Text
* Indicator depending on if measure 1 is larger or smaller than measure 2
* Custom text for second measure
* Compare measures by percentage
* Automatic formatting of large numbers

### KPI Colors ###

You can customize following colors:
* Header text
* Header background
* KPI color
* Second measure color
* Indicator color

Color can be added from Qlik Expression or directly as CSS compatible color code (RGB, RGBA, HEX or color name).

### Actions ###

Multiple actions can be added in extension property panel. You can chain actions together, for example select value and move to analysis sheet.

Custom actions when clicking KPI can be configured:
* Selection in field
Settings:
Field name: Name of the field
Value: Value to be selected
Append to field selection: Either replace current selections or add to selection. Multiple values can be selected if you first replace selections and then add other values.
* Set variable
Settings:
Variable name: Name of the variable to be setted
Value: Desired value of the variable
* Move to sheet
Settings:
Sheet: Dropdown of all sheets in Qlik Sense application. Select desired sheet from dropdown

Color can be added from Qlik Expression or directly as CSS compatible color code (RGB, RGBA, HEX or color name).

