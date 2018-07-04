var xlsStyle = require('./xlsStyles')



// You can define styles as json object
// More info: https://github.com/protobi/js-xlsx#cell-styles
xlsStyle.styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FF000000'
        }
      },
      alignment: {
        vertical: 'center',
        horizontal:'center'
      },
      font: {
        color: {
          rgb: 'FFFFFFFF'
        },
        sz: 14,
        bold: true,
        underline: true        
      },
      border: {
          top: { style:"medium", color: { auto: 1} },
          bottom: { style:"medium", color: { auto: 1} },
          left: { style:"medium", color: { auto: 1} },
          right: { style:"medium", color: { auto: 1} },

      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: 'FFFFCCFF'
        }
      },
      border: {
          top: { style:"medium", color: { auto: 1} },
          bottom: { style:"medium", color: { auto: 1} },
          left: { style:"medium", color: { auto: 1} },
          right: { style:"medium", color: { auto: 1} },

      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      },
      border: {
          top: { style:"medium", color: { auto: 1} },
          bottom: { style:"medium", color: { auto: 1} },
          left: { style:"medium", color: { auto: 1} },
          right: { style:"medium", color: { auto: 1} },
  
      }
    }, cellEmptyOnlyBorder: {
      alignment : {
        horizontal: "center"
      },
      border: {
          top: { style:"thin", color: { auto: 1} },
          bottom: { style:"thin", color: { auto: 1} },
          left: { style:"thin", color: { auto: 1} },
          right: { style:"thin", color: { auto: 1} },
      }
    }, cellValueNumber: {
      alignment : {
        horizontal: "bottom"
      },
      border: {
          top: { style:"thin", color: { auto: 1} },
          bottom: { style:"thin", color: { auto: 1} },
          left: { style:"thin", color: { auto: 1} },
          right: { style:"thin", color: { auto: 1} },
      }
    }, cellValueCurrency: {
      alignment : {
        horizontal: "bottom"
      },
      numFmt: "_-* #.##0,00 €_-;-* #.##0,00 €_-;_-* "-"?? €_-;_-@_-",
      border: {
          top: { style:"thin", color: { auto: 1} },
          bottom: { style:"thin", color: { auto: 1} },
          left: { style:"thin", color: { auto: 1} },
          right: { style:"thin", color: { auto: 1} },
      }
    }, cellValueText: {
      alignment : {
        horizontal: "top"
      },
      border: {
          top: { style:"thin", color: { auto: 1} },
          bottom: { style:"thin", color: { auto: 1} },
          left: { style:"thin", color: { auto: 1} },
          right: { style:"thin", color: { auto: 1} },
      }
    }, headerSimple: {
      alignment : {
        horizontal: "center",
        vertical: "center"
      },
      font : {
        bold : true
      },
      border: {
          top: { style:"thin", color: { auto: 1} },
          bottom: { style:"thin", color: { auto: 1} },
          left: { style:"thin", color: { auto: 1} },
          right: { style:"thin", color: { auto: 1} },
      }
    }
  };
 

  module.exports = xlsStyle;