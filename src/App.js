
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      dataIsLoaded: false,
      pageSize: 100, // Number of records to fetch per page
    };
  }

  componentDidMount() {
    this.loadMoreData();
  }

  loadMoreData() {
    const { items, pageSize } = this.state;
    const apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${pageSize}&offset=${items.length}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        if (json.results.length > 0) {
          this.setState(
            (prevState) => ({
              items: [...prevState.items, ...json.results],
              dataIsLoaded: true,
            }),
            () => {
              // If there are still more records, continue fetching
              if (json.results.length === pageSize) {
                this.loadMoreData();
              }
            }
          );
        } else {
          this.setState({ dataIsLoaded: true });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ dataIsLoaded: true });
      });
  }

  render() {
    const { dataIsLoaded, items } = this.state;
    if (!dataIsLoaded) {
      return (
        <div>
          <h1>Please wait some time....</h1>
        </div>
      );
    }

    return (
      <div className="App" style={{ backgroundColor: "lightcoral", padding: "20px" }}>
        <br />
        <div className="input-box">
          <label
            style={{
              color: "Blue",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            Search Here
          </label>{" "}
          {"\t"}
          <input
            type="text"
            id="myInput"
            onKeyUp={() => this.searchFunction()}
            placeholder="Search for city.."
            title="Type in a name"
            style={{ borderRadius: "10px" }}
          />
        </div>
        <br />
        <table id="myTable" className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">City</th>
              <th scope="col">Country</th>
              <th scope="col">TimeZone</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td scope="row">{index}</td>
                <td>{item.name}</td>
                <td>{item.cou_name_en}</td>
                <td>
                  {item.timezone}
                  <button
                    onClick={() => this.openWeatherTab(item.timezone)}
                    style={{
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Weather
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  openWeatherTab(timezone) {
    // Open a new tab with weather information
    const weatherUrl = `https://example.com/weather?timezone=${encodeURIComponent(timezone)}`;
    window.open(weatherUrl, "_blank");
  }

  searchFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

export default App;

