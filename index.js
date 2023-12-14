// Import stylesheets
import './style.css';

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 20, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Parse the Data

let data = [
  { id: '08', a: 158, b: 8 },
  { id: '09', a: 701, b: 258 },
  { id: '10', a: 963, b: 658 },
  { id: '11', a: 1011, b: 1058 },
  { id: '12', a: 1151, b: 2058 },
];

// List of subgroups = header of the csv files = soil condition here
const subgroups = Object.keys(data[0]).slice(1, data[0].length);

// List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = data.map((d) => d.id);

// Add X axis
let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.1]);
svg
  .append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSize(0));

// Add Y axis
let y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

// Another scale for subgroup position?
let xSubgroup = d3
  .scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()])
  .padding([0.05]);

// color palette = one color per subgroup
const color = d3.scaleOrdinal().domain(subgroups).range(['#e41a1c', '#377eb8']);

let g = svg.append('g');

let gBars;

let rects;

function draw(data) {
  const yMax = d3.max(data, (d) => (d.a > d.b ? d.a : d.b));
  const groups = data.map((d) => d.id);
  console.log(yMax);
  console.log(groups);

  y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);
  x = d3.scaleBand().domain(groups).range([0, width]).padding([0.1]);

  xSubgroup = xSubgroup
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  //console.log(svg.selectAll('.x-axis'));

  svg.selectAll('.x-axis').call(d3.axisBottom(x).tickSize(0));
  svg.selectAll('.y-axis').call(d3.axisLeft(y));

  //console.log(groups);

  // Show the bars
  gBars = g
    .selectAll('g')
    // Enter in data = loop group per group
    .data(data, (d) => d.id)
    .join(
      (enter) => {
        //console.log(enter);
        return enter.append('g').transition().duration(1500);
      },
      (update) => {
        //console.log(update);
        return update;
      },
      (exit) => {
        //console.log(exit);
        return exit.transition().duration(500).remove();
      }
    )
    .attr('transform', (d) => `translate(${x(d.id)}, 0)`);

  console.log(gBars);

  rects = gBars.selectAll('rect').data(
    function (d) {
      //console.log(d);
      return subgroups.map(function (id) {
        //console.log({ id, value: d[id] });
        return { id, value: d[id] };
      });
    },
    (d) => d.id + d.value
  );
  console.log(rects);

  rects.join(
    (enter) => {
      console.log(enter.nodes());
      return enter
        .append('rect')
        .attr('x', (d) => xSubgroup(d.id))
        .attr('y', (d) => y(0))
        .transition()
        .duration(1500)
        .attr('y', (d) => y(d.value))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', (d) => height - y(d.value))
        .attr('fill', (d) => color(d.id));
    },
    (update) => {
      console.log(update.nodes());
      return update
        .attr('x', (d) => xSubgroup(d.id))
        .attr('width', xSubgroup.bandwidth());
    },
    (exit) => {
      console.log(exit.nodes());
      return exit.transition().duration(500).ease(d3.easeLinear).remove();
    }
  );
}

draw(data);

//{ id: '13', a: 972, b: 5 },

data = [
  { id: '08', a: 158, b: 8 },
  { id: '09', a: 701, b: 258 },
  { id: '10', a: 963, b: 658 },
  { id: '11', a: 1011, b: 1058 },
  { id: '12', a: 1151, b: 1058 },
  { id: '13', a: 972, b: 16 },
  { id: '14', a: 372, b: 316 },
];

setTimeout(() => {
  console.log('---------');
  draw(data);
}, 3000);
