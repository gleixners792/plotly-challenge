// Get a reference to the location to put the <p> tag records.
var sampleTag = d3.select("#sample-metadata");

var optionTag = d3.select("#selDataset");

function init() {
  // Use D3 fetch to read the JSON file
  // load the <option> entries to display data.

  d3.json("samples.json").then((importedData) => {
    var data = importedData;
    var idNames = data.names;

    //console.log("Made it to here #0-1.");
    //console.log(idNames);

    Object.entries(idNames).forEach(([key, value]) => {
      var row = optionTag.append("option").text(value);
    });
  });

}

// On change to the DOM, call optionChanged()
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {

  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var id_selection = dropdownMenu.property("value");
  var id_num = parseInt(id_selection)
  console.log("Data Selected--> ", id_selection)

  // The data from the JSON file is arbitrarily named importedData as the argument
  d3.json("samples.json").then((importedData) => {
    // console.log(importedData);
    console.log("Made it to here #1.");
    var data = importedData;

    //console.log(data);

    //console.log("MetaData Next -->Made it to here #3.");
    var metaData = data.metadata;
    //console.log(metaData);

    //console.log("Sample Values Next -->Made it to here #4.");
    var sampleData = data.samples;
    //console.log(sampleData);

    var filteredMeta = metaData.filter(meta_Data => meta_Data.id === id_num);
    //console.log("Filtered Meta Data Next -->Made it to here #51.");
    //console.log(filteredMeta);

    //Clean-up previous data in the html sampleTag area if it is there.
    sampleTag.html("");

    //load the <p> entries to display data.
    filteredMeta.forEach((id) => {
      Object.entries(id).forEach(([key, value]) => {
        var row = sampleTag.append("p").text(`${key}: ${value}`);
      });
    });

    var filteredData = sampleData.filter(samples_Data => samples_Data.id === id_selection);
    console.log("Filtered Sample Values Next -->Made it to here #5.");
    console.log(filteredData);

    var otuID_data = filteredData.map(otu_id => otu_id.otu_ids);

    //console.log("otu_ID_data going in Sample Values Next -->Made it to here #6.");
    //console.log(otuID_data);

    var y_data = otuID_data[0].slice(0, 10);

    console.log("1st 10 of y_data out Sample Values Next -->Made it to here #7.");

    for (var i = 0; i < y_data.length; i++) {
      y_data[i] = "OTU " + y_data[i];
    }
    y_data = y_data.reverse();
    console.log(y_data);

    var sample_data = filteredData.map(samp_val => samp_val.sample_values);
    var x_data = sample_data[0].slice(0, 10);
    x_data = x_data.reverse();

    console.log("1st 10 of x_data out Sample Values Next -->Made it to here #8.");
    console.log(x_data);

    var otu_label_data = filteredData.map(hovert => hovert.otu_labels);
    var hover_data = otu_label_data[0].slice(0, 10);
    hover_data = hover_data.reverse();
    console.log("1st 10 of hoover-text -->Made it to here #9.");
    console.log(hover_data);

    // Trace1 for the Top OTU Data
    var trace1 = {
      x: x_data,
      y: y_data,
      text: hover_data,
      type: "bar",
      orientation: "h"
    };

    // create chart array data.
    var chartData_1 = [trace1];

    // Apply the group bar mode to the layout
    var layout_g1 = {
      margin: {
        l: 100,
        r: 100,
        t: 30,
        b: 50
      }
    };

    // Render the bar plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData_1, layout_g1);

    var trace2 = {
      x: otuID_data[0],
      y: sample_data[0],
      text: otu_label_data[0],
      mode: "markers",
      marker: {
        size: sample_data[0],
        color: otuID_data[0],
        colorscale: 'Earth'
      }

    };

    // create chart array data.
    var chartData_2 = [trace2];

    // Apply the group bar mode to the layout
    var layout_g2 = {
      xaxis: { title: "OTU ID" },
      margin: {
        l: 50,
        r: 50,
        t: 30,
        b: 35
      }
    };

    // Render the bar plot to the div tag with id "plot"
    Plotly.newPlot("bubble", chartData_2, layout_g2);

    //console.log("Going into displaying gauge chart. Wash frequency-->", filteredMeta[0].id, filteredMeta[0].wfreq);

    var level = parseInt(filteredMeta[0].wfreq) * 20;

    console.log("Going into displaying gauge chart Value. Graph Value-->", level);

    // Trig to calc meter pointer
    var degrees = 180 - level;
    console.log("Going into displaying gauge chart Value. Needle Degrees>>>", degrees);
    radius = .5;

    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var chartData_3 = [
      {
        type: 'category',
        x: [0], y: [0],
        marker: { size: 28, color: '850000' },
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'skip'
      },

      {
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: ['rgba(132, 181, 137, 1.0)', 'rgba(137, 188, 141, 1.0)',
            'rgba(139, 192, 134, 1.0)', 'rgba(183, 205, 143, 1.0)',
            'rgba(213, 229, 153, 1.0)', 'rgba(229, 232, 176, 1.0)',
            'rgba(233, 231, 201, 1.0)', 'rgba(244, 241, 228, 1.0)',
            'rgba(244, 241, 228, 0.4)',
            'rgba(0, 0, 0, 0.5)'
          ]
        },
        
        hoverinfo: 'skip',
        hole: .5,
        type: 'pie',
        showlegend: false
      }
    ];

    var layout_g3 = {
      width: 425,
      height: 500,
      title: { text: "<b>Belly Button Washing Frequency</b><br><i>Scrubs per Week</i>", font: { size: 18 } },

      margin: {
        l: 0,
        r: 0,
        t: 150,
        b: 0
      },

      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],

      xaxis: {
        type: 'category',
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },

      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };


    Plotly.newPlot("gauge", chartData_3, layout_g3);


  });

}

init();
