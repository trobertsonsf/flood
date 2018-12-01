import React, { Component } from "react";
import "./App.css";

const barWidth = 80;
const numBars = 10;
const totalWidth = barWidth * numBars;
const totalHeight = 500;

const barWrapper = {
  width: barWidth - 2,
  // background: 'red',
  height: totalHeight,
  display: "inline-block",
  border: "1px solid white"
};

let label = {
  display: "block",
  float: "left",
  margin: "15px"
};

const DEFAULT_BUILDINGS = [4, 6, 2, 8, 5, 2, 4, 5, 9, 2];

const genRandom = () => {
  let newVal = Math.floor(Math.random() * 100000) % 11;
  return newVal === 0 ? 1 : newVal;
};

const buildMaxesTable = arr => {
  const maxesFromLeft = [];
  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i];
    if (i === 0) {
      maxesFromLeft[i] = curr;
    } else {
      maxesFromLeft[i] = Math.max(curr, maxesFromLeft[i - 1]);
    }
  }

  const maxesFromRight = [];
  for (let j = arr.length - 1; j >= 0; j--) {
    const curr = arr[j];
    if (j === arr.length - 1) {
      maxesFromRight[j] = curr;
    } else {
      maxesFromRight[j] = Math.max(curr, maxesFromRight[j + 1]);
    }
  }

  return [maxesFromLeft, maxesFromRight];
};

console.log(buildMaxesTable(DEFAULT_BUILDINGS));

const findFillAmount = (units, idx, bldgs, table) => {
  let fill = 0;
  if (idx > 0 && idx < bldgs.length - 1) {
    /* Uncomment these lines to do the brute force approach to find fills */
    // let leftMax = Math.max(...bldgs.slice(0, idx));
    // let rightMax = Math.max(...bldgs.slice(idx + 1));
    // let diff = Math.min(leftMax, rightMax);

    //slow way times...
    //10,000 Time to compute fill (ms) 528
    //100,000 Time to compute fill (ms) 119083

    //fast way times
    // 10000 Time to compute fill (ms) 2
    // 100000 Time to compute fill (ms) 17

    /* uncomment this line to use the fast, table lookup approach */
    let diff = Math.min(table[0][idx], table[1][idx]) - units;
    if (diff > 0) {
      fill = (totalHeight / 10) * diff;
    }


  }
  return fill;
};

/* uncomment to test the speed of the impl for finding fills */
// const tenX = function() {
//   let a = [];
//   for(let i =0; i < 10000; i++) {
//     a = a.concat(DEFAULT_BUILDINGS);
//   }
//   return a;
// }();
// const tenXTable = buildMaxesTable(tenX);
// console.log('finding ammounts for array length', tenX.length);
// let start = Date.now();
// findFillAmount(tenX.map((units, idx, bldgs) => {
//   findFillAmount(units, idx, bldgs, tenXTable);
// }))
// console.log("Time to compute fill (ms)", Date.now() - start);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bldgs: DEFAULT_BUILDINGS,
      table: buildMaxesTable(DEFAULT_BUILDINGS),
      userInput: ""
    };

    this.updateUserInput = this.updateUserInput.bind(this);
    this.getBuildingStyles = this.getBuildingStyles.bind(this);
    this.getNew = this.getNew.bind(this);
    this.goOnClick = this.goOnClick.bind(this);
    this.genBuilding = this.genBuilding.bind(this);
    this.addNBuildings = this.addNBuildings.bind(this);
    this.addBuildings = this.addBuildings.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  setBuildings(arr) {
    const tbl = buildMaxesTable(arr);
    this.setState({
      bldgs: arr,
      table: tbl
    });
  }

  updateUserInput(e) {
    this.setState({ userInput: e.target.value });
  }

  getNew() {
    const newVals = [];
    while (newVals.length < 10) {
      newVals.push(genRandom());
    }
    this.setBuildings(newVals);
  }

  goOnClick() {
    try {
      const arr = JSON.parse(this.state.userInput);
      if (!Array.isArray(arr) || arr.length !== 10) {
        throw new Error("nope");
      }
      if (arr.filter(x => x <= 10 && x >= 1).length !== 10) {
        throw new Error("nuupe");
      }
      this.setBuildings(arr);
    } catch (e) {
      console.error("no way jose");
      alert("no way jose");
    }
  }

  getBuildingStyles(units, idx) {
    const bh = (totalHeight / 10) * units;
    const { bldgs, table } = this.state;
    let fill = findFillAmount(units, idx, bldgs, table);

    const sky = totalHeight - bh - fill;
    return {
      bldg: {
        background: "grey",
        height: bh,
        width: "100%"
      },
      fill: {
        background: "blue",
        height: fill
      },
      sky: {
        background: "white",
        height: sky
      }
    };
  }

  genBuilding(u, idx) {
    const styles = this.getBuildingStyles(u, idx);
    return (
      <div style={barWrapper} key={`${u}-${idx}`}>
        <div style={styles.sky} />
        <div style={styles.fill} />
        <div style={styles.bldg}>
          <span style={label}>{u}</span>
        </div>
      </div>
    );
  }

  startTimer() {
    setInterval(() => {
      this.addNBuildings(1);
    }, 200);
  }

  addNBuildings(n) {
    let { bldgs } = this.state;
    bldgs = bldgs.slice(n);
    for (let i = 0; i < n; i++) {
      bldgs.push(genRandom());
    }
    this.setBuildings(bldgs);
  }

  addBuildings(n) {
    return () => {
      this.addNBuildings(n);
    };
  }

  render() {
    return (
      <div style={{ marginLeft: "20px" }}>
        <h1>flood game</h1>
        <div
          style={{
            width: totalWidth,
            border: "1px solid black",
            height: totalHeight,
            display: "inline-block"
          }}
        >
          {this.state.bldgs.map(this.genBuilding)}
        </div>
        <div style={{ marginLeft: "10px" }}>
          <button onClick={this.getNew}>Gen New Buildings</button>
          <button onClick={this.addBuildings(3)}>Add 3</button>
          <button onClick={this.addBuildings(5)}>Add 5</button>
          <button onClick={this.startTimer}>Start loop</button>
          <div style={{ marginTop: "20px" }}>
            Input your own, ex: [1,2,3,4,5,6,7,8,9,10] must be a json array of
            10 numbers between 1 and 10{" "}
            <input
              type="text"
              onChange={this.updateUserInput}
              value={this.state.userInput}
            />
            <button onClick={this.goOnClick}>go</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
