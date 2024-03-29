import React, { Fragment, useState, useEffect, useReducer } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const Pagination = ({ items, pageSize, onPageChange }) => {
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map((page) => {
    return (
      <Button key= { page } onClick = { onPageChange } className = "page-item" >
        { page }
        < /Button>
    );
});

return (
  <nav>
  <ul className= "pagination" > { list } < /ul>
  < /nav>
  );
};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

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
          dispatch({ type: "FETCH_SUCCESS", payload: result.data.hits });
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

const App = () => {
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://api.mediastack.com/v1/news?access_key=fb975fc0360fcf4241f55c825e054af7",
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  let page = data;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }

  return (
    <Fragment>
    {
      isLoading?(
        <div> Loading ...</div>
      ) : isError ? (
  <div>Error fetching data < /div>
      ) : (
  <div>
  <ul className= "list-group" >
  {
    page.map((item) => (
      <li key= { item.objectID } className = "list-group-item" >
      <a href={ item.url } > { item.title } < /a>
    < /li>
    ))
  }
  < /ul>
  < Pagination
items = { data }
pageSize = { pageSize }
onPageChange = { handlePageChange }
  />
  </div>
      )}
</Fragment>
  );
};

export default App;
