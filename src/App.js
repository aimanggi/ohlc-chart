import React, { Component } from "react";
import "./App.css";
import Chart from "./components/OhlcChart";
import Options from "./components/Labels";

class App extends Component {
  
    state = {
      stock: localStorage.getItem("id" || "AAPL"),
      options: ["AAPL", "DIS", "FB", "FDX", "HAL", "MMM","NFLX", "PYPL", "SBUX", "SLB", "TIF", "UPS",  "WMT", ]
    };

  selectOption(e) {
    e.preventDefault();

    let target = e.target,
        selectedStock = target.innerHTML;

    localStorage.setItem("id", selectedStock);

    let allButtons = document.querySelectorAll(".button");
    let arr = []
    arr.forEach.call(allButtons, function(ul) {
      ul.classList.remove("active");
    });

    target.classList.add("active");

    this.setState({
      stock: selectedStock
    });
  }

  render() {
    return (
      <div className="ohlcChart">
      <header>
          <h1>OHLC Chart</h1>
          <p>Bambu Frontend Test</p>
        </header>
        <div className="ohlcChart content">
        
          <div className="labels">
            <Options
              options={this.state.options} selected={this.state.stock}
              selectOption={this.selectOption.bind(this)}
            />
          </div>
          <Chart stock={this.state.stock} />
        </div>
        <footer>@aimanggi</footer>
      </div>
    );
  }
}

export default App;
