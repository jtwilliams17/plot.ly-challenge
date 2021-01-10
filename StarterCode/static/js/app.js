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
    var otu_ids = data.samples[index].otu_ids;
    console.log(otu_ids);
    var sample_values = data.samples[index].sample_values;
    var otu_labels = data.samples[index].otu_labels;

    var washFrequency = data.metadata[+index].wfreq;
    console.log(washFrequency);

    var Keys = Object.keys(data.metadata[index]);
    var Values = Object.values(data.metadata[index]);
    var demoData = d3.select("#sample-metadata");

    demoData.html("");

    for (var i = 0; i < Keys.length; i++) {
      demoData.append("p").text(`${Keys[i]}: ${Values[i]}`);
    }

    var OTUs = otu_ids.slice(0, 10).reverse();
    var Frequencies = sample_values.slice(0, 10).reverse();
    var OTUhovertext = data.samples[0].otu_labels.slice(0, 10).reverse();
    var OTU_labels = OTUs.map((otu) => "OTU " + otu);
    var revLabels = OTU_labels.reverse();

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
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sample_values,
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
          bar: { color: "#850000" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#F8F3EC" },
            { range: [1, 2], color: "#F4F1E4" },
            { range: [2, 3], color: "#E9E6C9" },
            { range: [3, 4], color: "#E5E8B0" },
            { range: [4, 5], color: "#D5E599" },
            { range: [5, 6], color: "#B7CD8F" },
            { range: [6, 7], color: "#8AC086" },
            { range: [7, 8], color: "#89BC8D" },
            { range: [8, 9], color: "#84B589" },
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

  // Data refresh function
  function refreshData() {
    var dropDown = d3.select("#selDataset");

    var IDs = dropDown.property("value");
    console.log(IDs);
    console.log(data);

    for (var i = 0; i < data.names.length; i++) {
      if (IDs === data.names[i]) {
        createPlots(i);
        return;
      }
    }
  }
});
