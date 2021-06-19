import "./styles.css";

var database = "GROCERY_LIST";
var editing = false;
var itemName = document.getElementById("itemName");
var itemQty = document.getElementById("itemQty");
var addItemButton = document.getElementById("addItem");
var grocerylistView = document.getElementById("groceryListView");
localStorage.clear();

const addItemStorage = (name, qty) => {
  let allItems = getItems();
  if (name in allItems) {
    let oldquantity = allItems[name];
    let newquantity = parseInt(oldquantity) + parseInt(qty);
    allItems[name] = newquantity;
  } else {
    allItems[name] = qty;
  }
  localStorage.setItem(database, JSON.stringify(allItems));
  return allItems;
};

const deleteItemStorage = (itemName) => {
  let allItems = getItems();
  console.log("Found ", allItems);
  if (Object.keys(allItems).length == 1) {
    localStorage.clear();
    console.log("Local ", localStorage);
  } else {
    delete allItems.itemName;
    localStorage.setItem(database, allItems);
  }
};

const editItemStorage = (itemName, quantity) => {
  let allItems = getItems();
  /* Updating the Item */
  if (itemName in allItems) {
    allItems[itemName] = quantity;
  }
  // console.log(allItems);
  /* Updating Local Storage */
  localStorage.setItem(database, JSON.stringify(allItems));
};

const getItems = () => {
  let grocerylist = localStorage.getItem(database);
  let itemslist = JSON.parse(grocerylist);
  if (itemslist == null) {
    itemslist = {};
  }
  return itemslist;
};

const newGroceryListElement = (name, quantity) => {
  let listItemView = document.createElement("div");
  listItemView.setAttribute("id", name);
  listItemView.classList.add("listItem");

  let itemName = document.createElement("p");
  itemName.classList.add("listItemName");
  itemName.textContent = name;

  let itemQuantity = document.createElement("p");
  itemQuantity.classList.add("listItemQuantity");
  itemQuantity.textContent = quantity;

  let editButton = document.createElement("button");
  editButton.classList.add("editButton");
  editButton.textContent = "Edit";

  editButton.addEventListener("click", (event) => {
    updateItem(itemName);
  });

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", (event) => {
    deleteItem(name);
  });

  let itemValues = document.createElement("div");
  listItemView.appendChild(itemName);
  listItemView.appendChild(itemQuantity);
  listItemView.appendChild(editButton);
  listItemView.appendChild(deleteButton);
  grocerylistView.appendChild(listItemView);
};

const deleteItem = (itemName) => {
  let listElementDeleted = document.getElementById(itemName);
  deleteItemStorage(itemName);

  grocerylistView.removeChild(listElementDeleted);
};

const updateItem = (itemName) => {
  itemName.value = itemName;
  addItemButton.textContent = "Edit";
  itemQty.value = 0;
  editing = true;
};

const display = () => {
  let allItems = getItems();
  for (const [itemname, quantity] of Object.entries(allItems)) {
    newGroceryListElement(itemname, quantity);
  }
};

const addItem = (name, quantity, editing) => {
  let allItems = getItems();
  console.log("EDITING AT START ", editing);
  if (editing === false) {
    if (name in allItems) {
      let listItemAdded = document.getElementById(name);
      let quantityElement = listItemAdded.getElementsByTagName("p")[1];
      let oldquantity = quantityElement.textContent;
      console.log(quantityElement);

      addItemStorage(name, quantity);
      let newvalue = parseInt(oldquantity) + parseInt(quantity);

      quantityElement.textContent = newvalue.toString();
    } else {
      addItemStorage(name, quantity);
      newGroceryListElement(name, quantity);
    }
  } else if (editing === true) {
    /* Edit Button Was Pressed */
    editItemStorage(name, quantity);
    let elementUpdated = document.getElementById(name);
    let quantityElement = elementUpdated.getElementsByTagName("p")[1];
    quantityElement.textContent = quantity;
    addItemButton.textContent = "Add";
    editing = false;
  }
  console.log("EDITING AT end ", editing);
};

display();

const buttonClick = () => {
  let newitemName = itemName.value;
  let quantity = itemQty.value;
  if (newitemName.length === 0) {
    /* Item Name not being given */

    alert("Please enter the Item Name");
  }
  if (quantity.length === "0") {
    quantity = 0;
  }
  console.log("Button presesd", editing);
  addItem(newitemName, quantity, editing);
};

addItemButton.addEventListener("click", buttonClick);
