import React, { Component } from "react";


class OhlcChart extends Component {
  constructor(props) {
    super(props);
    this.renderCanvas = this.renderCanvas.bind(this);
  }

  componentDidMount() {
    this.renderCanvas(this.props.stock);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stock !== nextProps.stock) {
      this.renderCanvas(nextProps.stock);
    }
  }
 
  renderCanvas(stock) {
     fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=4194FC0L3U6R5NLT`)
      .then((res) => res.json())
      .then((data) => {
        let arr = Object.keys(data["Time Series (Daily)"]),
            stocksPrice = []

        // Show 50 Days Stock Data
        arr.forEach(function(date, index) {
          if (index < 50) {
            let obj = {
              data: data["Time Series (Daily)"][date]
            }

            stocksPrice.push(obj)
          }
        })

        //Define variable for canvas drawing
        const canvas = document.getElementById("chart")
        const grid = document.getElementById("grid")
        const width = canvas.width
        const height = canvas.height
        const ctx = canvas.getContext("2d")
        const gridCtx = grid.getContext("2d")
            
        // Define start point
        let xStart = (width - 20) / stocksPrice.length
        let xSpace = xStart,
            xNewStart = xStart + 15;

        ctx.clearRect(0, 0, width, height);

        let highPrice = []
        let lowPrice = []

        stocksPrice.forEach(function(price) {
          let high = price.data["2. high"]
          let low = price.data["3. low"]
          
              highPrice.push(high)
              lowPrice.push(low)
          
        })

        let highest = Math.max(...highPrice)
        let lowest = Math.min(...lowPrice)

        // round up/down in 5
        highest = Math.ceil(highest / 5) * 5;
        lowest = Math.floor(lowest / 5) * 5;

        let range = highest - lowest,
            oneUnitLength = height / range,
            yValueLabel = highest, 
            yValueLabelXPos = 0,
            yValueLabelYPos = 10;

        //Define interval for y axis
        let y = 0;
        while (y <= range) {
          ctx.fillText(`$${yValueLabel}`, yValueLabelXPos, yValueLabelYPos);

          yValueLabel -= 5;
          y += 5;
          yValueLabelYPos += 5 * oneUnitLength;
        }

        stocksPrice.forEach(function(point) {
          let high = parseInt(point.data["2. high"])
          let low = parseInt(point.data["3. low"])
          let open = parseInt(point.data["1. open"])
          let close = parseInt(point.data["4. close"])
          let isBullish = true

          //List color for chart
          let red = "#ff0038"
          let green = "#00c04a"
          let orange = "#ff9a00"
          
          // Bearish and Bullish
          if (close > open) {
            isBullish = false 
          }

          if (isBullish) {
            ctx.strokeStyle = green;
          } else {
            ctx.strokeStyle = red;
          }

          // No changes
          if (close === open){
            ctx.strokeStyle = orange;
          } 

          // Draw high low chart
          let yStart = highest - high;
          yStart *= oneUnitLength; 

          let realLength = high - low,
            displayLength = realLength * oneUnitLength, 
            yEnd = yStart + displayLength;

          ctx.beginPath();
          ctx.moveTo(xNewStart, yStart);
          ctx.lineTo(xNewStart, yEnd);
          ctx.lineWidth = 1.5;
          ctx.closePath();
          ctx.stroke();

          // Open price line
          let yToMoveOpenBranch = high - open;
          yToMoveOpenBranch *= oneUnitLength;

          let yOpenPos = yStart + yToMoveOpenBranch;

          ctx.beginPath();
          ctx.moveTo(xNewStart, yOpenPos);
          ctx.lineTo(xNewStart - 5, yOpenPos);
          ctx.closePath();
          ctx.stroke();

          // Close price line
          let yToMoveCloseBranch = high - close;
          yToMoveCloseBranch *= oneUnitLength;

          let yClosePos = yStart + yToMoveCloseBranch;

          ctx.beginPath();
          ctx.moveTo(xNewStart, yClosePos);
          ctx.lineTo(xNewStart + 5, yClosePos);
          ctx.closePath();
          ctx.stroke();

        // Canvas Column
         gridCtx.beginPath();
         gridCtx.moveTo(xNewStart, 0);
         gridCtx.lineTo(xNewStart, height);
         gridCtx.lineWidth = 0.1;
         gridCtx.closePath();
         gridCtx.stroke();
         gridCtx.strokeStyle = "rgba(0,0,0,0.4)";

         // Space between each other price
          xNewStart += xSpace;
        });

      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    
    return (
      <div className="chart">
        <div className="chart box">
          <canvas className="chart content" id="chart" width="1100" height="500">
          </canvas>
          <canvas className="chart content" id="grid" width="1100" height="500">
          </canvas>
        </div>
      </div>
    );
  }
}

export default OhlcChart;