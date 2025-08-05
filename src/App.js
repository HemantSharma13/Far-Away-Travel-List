import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
];

export default function App() {
  const [myArray, setmyArray] = useState(initialItems);
  console.log("NOTE:MyArray object is:", myArray);

  return (
    <div className="app">
      <Logo />
      <Form setmyArray={setmyArray} />
      <PackingList myArray={myArray} setmyArray={setmyArray} />
      <Stats myArray={myArray} />
    </div>
  );
}

function Logo() {
  return <h1>🏝️ Far Away 🧳</h1>;
}

function Form({ setmyArray }) {
  function handleSubmit(e) {
    e.preventDefault();
    const newData = {
      id: Date.now(),
      description: e.target.elements.itemName.value,
      quantity: e.target.elements.quantity.value,
      packed: false,
    };
    console.log(newData);

    setmyArray((array) => [...array, newData]);
    e.target.reset();
    // to reset the form
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>What do you need for your 😍 trip?</h3>
      <select name="quantity">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num}>{num}</option>
        ))}
        <option value="custom">Custom</option>
      </select>
      <input name="itemName" placeholder="items..."></input>
      <button>Add</button>
    </form>
  );
}

function PackingList({ myArray, setmyArray }) {
  const [sortType, setSortType] = useState("input");
  let sortedArray = [];
  if (sortType === "input") {
    sortedArray = myArray;
  } else if (sortType === "description") {
    sortedArray = myArray
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  } else if (sortType === "packed") {
    sortedArray = myArray
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  return (
    <div className="list">
      <ul>
        {sortedArray.map((thisItem) => (
          <Item
            key={thisItem.id}
            setmyArray={setmyArray}
            currentItem={thisItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select
          onChange={(e) => {
            console.log("value of E:", e.target.value);
            setSortType(e.target.value);
          }}
        >
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={() => setmyArray([])}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ currentItem, setmyArray }) {
  function handleRemoval(e, key) {
    console.log("For removel, object:", e);
    console.log("For removel, key:", key);
    setmyArray((myArray) => myArray.filter((item) => item.id !== key));
  }

  function onToggleItem(id) {
    setmyArray((myArray) =>
      myArray.map((item) =>
        item.id !== id ? item : { ...item, packed: !item.packed }
      )
    );
  }

  return (
    <li>
      <input
        type="checkbox"
        onChange={() => onToggleItem(currentItem.id)}
      ></input>
      <span
        style={currentItem.packed ? { textDecoration: "line-through" } : {}}
      >
        {currentItem.quantity} {currentItem.description}
      </span>
      <button onClick={(e) => handleRemoval(e, currentItem.id)}>❌</button>
    </li>
  );
}

function Stats({ myArray }) {
  let packedCount = myArray.filter((item) => item.packed).length;
  let percentage = 0;

  percentage = (packedCount / myArray.length) * 100;

  return (
    <footer className="stats">
      <em>
        You have {myArray.length} items on your list, and you already packed
        {packedCount}({percentage.isNaN ? 0 : percentage.toFixed(2)}%)
      </em>
    </footer>
  );
}
