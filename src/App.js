import { useEffect, useState } from "react";
import "./styles/App.css";
import List from "./componets/List";
import AddItem from "./componets/AddItem";
import { API_HOST } from "./config";
import Filters from "./componets/Filters";
import sortList from "./modules/sortList";
import filter from "./modules/filterData";
import concatTags from "./modules/concatTags";
import concatCollections from "./modules/concatCollections";
import Loader from "./componets/Loader";
import SideBar from "./componets/SideBar";
import Tags from "./routes/Tags.js";
import Collections from "./routes/Collections.js";
import { Route, Routes } from "react-router-dom";

function App() {
  const [data, setData] = useState([]),
    [newBox, setNewBox] = useState(false),
    [filterBox, setFilterBox] = useState(false),
    [searchQuery, setSearchQuery] = useState(""),
    [filterCheckbox, setFilterCheckbox] = useState([true, true, true]),
    [sortBy, setSortBy] = useState(1),
    [loader, setLoader] = useState(false),
    [path, setPath] = useState("/"),
    [lightMode, setLightMode] = useState(
      localStorage.getItem("light-mode") === "true"
    ),
    [toggle, setToggle] = useState(false);

  function SetLoader(x) {
    setLoader(x);
  }

  function handleFilterCheckbox(newVal) {
    setFilterCheckbox(newVal);
  }

  function exitAdding() {
    setNewBox(false);
  }

  function exitFilter() {
    setFilterBox(false);
  }

  function search(e) {
    setSearchQuery(e.target.value);
  }

  function handleSorting(e) {
    setSortBy(e);
  }

  function handleToggleSidebar() {
    setToggle(!toggle);
  }

  function SetPath(pathname) {
    setPath(pathname);
    console.log(path)
  }

  const filteredData = filter(data, searchQuery, filterCheckbox);

  async function fetchData() {
    const res = await fetch(API_HOST + "/api");
    const resJSON = await res.json();
    const data = resJSON.reverse();
    setData(data);
  }

  useEffect(() => {
    const sortedData = sortList(data, sortBy);
    setData(sortedData);
    exitFilter();
    // eslint-disable-next-line
  }, [sortBy, filterCheckbox]);

  useEffect(() => {
    const currentURL = new URL(window.location.href);
    SetPath(currentURL.pathname);
  }, [path])

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }

    localStorage.setItem("light-mode", lightMode);
  }, [lightMode]);

  return (
    <div className="App">
      <SideBar
        tags={concatTags(data)}
        collections={concatCollections(data)}
        handleToggleSidebar={handleToggleSidebar}
        toggle={toggle}
      />

      <div className="content">
        <div className="head">
          <button
            className="sidebar-btn btn"
            style={{ marginRight: "10px" }}
            onClick={handleToggleSidebar}
          >
            &#xf0c9;
          </button>
          <input
            className="search"
            type="search"
            placeholder={` Search "${path}"`}
            onChange={search}
          />

          <button
            className="btn"
            style={{ marginLeft: "10px" }}
            onClick={() => setFilterBox(true)}
          >
            &#xf160;
          </button>
          <button className="add-btn btn" onClick={() => setNewBox(true)}>
            &#xf067;
          </button>
          <button
            className="dark-light-btn btn"
            onClick={() => setLightMode(!lightMode)}
          ></button>
        </div>

        {filterBox ? (
          <Filters
            filterCheckbox={filterCheckbox}
            handleFilterCheckbox={handleFilterCheckbox}
            sortBy={handleSorting}
            sort={sortBy}
            onExit={exitFilter}
          />
        ) : null}

        {newBox ? (
          <AddItem
            SetLoader={SetLoader}
            onExit={exitAdding}
            reFetch={fetchData}
            lightMode={lightMode}
            tags={() => concatTags(data)}
            collections={() => concatCollections(data)}
          />
        ) : null}

        

        {loader ? <Loader lightMode={lightMode} /> : null}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="content">
              <List
                SetPath={() => SetPath()}
                lightMode={lightMode}
                SetLoader={SetLoader}
                data={filteredData}
                tags={concatTags(data)}
                collections={concatCollections(data)}
                reFetch={fetchData}
              />
            </div>
          }
        />

        <Route
          path="tags/:tagId"
          element={
            <Tags
              SetPath={() => SetPath()}
              lightMode={lightMode}
              SetLoader={SetLoader}
              data={filteredData}
              tags={concatTags(data)}
              collections={concatCollections(data)}
              reFetch={fetchData}
            />
          }
        />

        <Route
          path="collections/:collectionId"
          element={
            <Collections
              SetPath={() => SetPath()}
              lightMode={lightMode}
              SetLoader={SetLoader}
              data={filteredData}
              tags={concatTags(data)}
              collections={concatCollections(data)}
              reFetch={fetchData}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
