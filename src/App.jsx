// eslint-disable-next-line
import React, { Fragment, useState, useEffect, useReducer } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

// A functional component that displays pagination buttons based on the number of pages required
const Pagination = ({ items = [], pageSize, onPageChange }) => {
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1); // Create an array of page numbers
  // Map through the array of pages and return a button for each page
  const list = pages.map((page) => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item">
        {page}
      </Button>
    );
  });

  // Return the pagination buttons in an unordered list
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};
// A utility function that generates an array of numbers based on a start and end value
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
// A function that takes an array of items, a page number, and a page size and returns a subset of the items for that page
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
// A custom React hook that fetches data from an API using axios and handles the loading and error states
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          console.log(result.data);
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};
// The main App component that fetches data from an API, displays it in a list, and handles pagination
// eslint-disable-next-line
const App = () => {
  // eslint-disable-next-line
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://api.mediastack.com/v1/news?access_key='Your-API-Key-Here'",
    [{}]
  );
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", isError);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  let page = data.data;
  if (page && page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }

  return (
    <Fragment>
      {isLoading ? (
        <div>Loading ...</div>
      ) : isError ? (
        <div>Error fetching data</div>
      ) : (
        <div>
          <ul className="list-group">
            {data && data.data && data.data.length > 0 ? ( // Check if data has elements
              page.map((item) => (
                <li key={item.title} className="list-group-item">
                  <a href={item.url}>{item.title}</a>
                </li>
              ))
            ) : (
              <div>No data to display.</div> // Show placeholder for no data
            )}
          </ul>
          <Pagination
            items={data && data.data && Array.isArray(data.data) ? data.data : []} // Pass data only if it exists
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Fragment>
  );
};

export default App;
