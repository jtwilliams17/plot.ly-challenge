// Read JSON with D3
d3.json("../data/samples.json").then((importData) => {
  console.log(importData);
  var data = importData;

  // Create Id dropdown
  var IDs = data.names;
  for (var i = 0; i < IDs.length; i++) {
    dropBox = d3.select("#selDataset");
    dropBox.append("option").text(IDs[i]);
  }

  createPlots(0);

  function createPlots(index) {
    //Create variables for horizontal bar chart & gauge chart
    var otuIds = data.samples[index].otu_ids;
    console.log(otuIds);
    var sampleValues = data.samples[index].sample_values;
    var otuLabels = data.samples[index].otu_labels;

    var washFrequency = data.metadata[+index].wfreq;
    console.log(washFrequency);

    var Keys = Object.keys(data.metadata[index]);
    var Values = Object.values(data.metadata[index]);
    var demoData = d3.select("#sample-metadata");

    demoData.html("");

    for (var i = 0; i < Keys.length; i++) {
      demoData.append("p").text(`${Keys[i]}: ${Values[i]}`);
    }

    var OTUs = otuIds.slice(0, 10).reverse();
    var Frequencies = sampleValues.slice(0, 10).reverse();
    var OTUhovertext = data.samples[0].otu_labels.slice(0, 10).reverse();
    var OTULabels = OTUs.map((otu) => "OTU " + otu);
    var revLabels = OTULabels.reverse();

    //   Create bar chart
    var trace1 = {
      x: Frequencies,
      y: revLabels,
      text: OTUhovertext,
      name: "",
      type: "bar",
      orientation: "h",
    };

    var barData = [trace1];

    var layout = {
      margin: {
        l: 75,
        r: 75,
        t: 75,
        b: 50,
      },
    };

    Plotly.newPlot("bar", barData, layout);

    // Create bubble chart
    trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues,
      },
    };

    var bubbleData = [trace2];

    var layout = {
      showlegend: false,
      height: 600,
      width: 930,
    };

    Plotly.newPlot("bubble", bubbleData, layout);

    // Create Gauge chart
    var trace3 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washing Frequency" },
        gauge: {
          axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
          bar: { color: "#669999" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#fff" },
            { range: [1, 2], color: "#e6fff5" },
            { range: [2, 3], color: "ccffeb" },
            { range: [3, 4], color: "b3ffe0" },
            { range: [4, 5], color: "#99ffd6" },
            { range: [5, 6], color: "#80ffcc" },
            { range: [6, 7], color: "#66ffc2" },
            { range: [7, 8], color: "#4dffb8" },
            { range: [8, 9], color: "#33ffad" },
          ],
        },
      },
    ];

    gaugeData = trace3;

    var layout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
    };

    Plotly.newPlot("gauge", gaugeData, layout);
  }

  d3.selectAll("#selDataset").on("change", refreshData);

  function refreshData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var personsID = dropdownMenu.property("value");
    console.log(personsID);
    // Initialize an empty array for the person's data
    console.log(data);

    for (var i = 0; i < data.names.length; i++) {
      if (personsID === data.names[i]) {
        createPlots(i);
        return;
      }
    }
  }
});
