const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays=[];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Backlog', 'Sample task'];
    progressListArray = ['In progress', 'Sample task'];
    completeListArray = ['Completed', 'Very cool'];
    onHoldListArray = ['On hold', 'Sample task'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames=['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index)=>{
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  //append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index)=>{
    createItemEl(backlogList, 0, backlogItem, index);
  });
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index)=>{
    createItemEl(progressList, 1, progressItem, index);
  });
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index)=>{
    createItemEl(completeList, 2, completeItem, index);
  });
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index)=>{
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(index, column){
  const selectedArr = listArrays[column];
  const selectedColEl = itemLists[column].children;
  if(!dragging){
    if(!selectedColEl[index].textContent){
      selectedArr.splice(index, 1); 
    } else {
      selectedArr[index] = selectedColEl[index].textContent;
    }
    console.log(selectedArr);
    updateDOM();
  }
}

function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArr = listArrays[column];
  selectedArr.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

function rebuildArrays(){
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

function drag(evt){
  draggedItem = evt.target;
  dragging = true;

}

function allowDrop(evt){
  evt.preventDefault();
}

function dragEnter(column){
  // console.log(itemLists[column]);
  itemLists[column].classList.add('over');
  currentColumn = column;
}

function drop(evt){
  evt.preventDefault();
  itemLists.forEach((column)=>{
    column.classList.remove('over');
  });
  const parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();
