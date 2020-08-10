/*                          Example of Module
*********************************************************************

//budget controller

//Module
var moduleVariable = (function(){
  //private properties of module
  var x = 24;
  var add = function(b){
    return x+b;
  };

  //public properties to module
  return{
    test: function(b){
      console.log(add(b));
  } 
  };
})();

//Using module in execution stack
budgetController.test(5);

********************************************************************************/

//                              Budget Module

var budgetController = (function(){
  //private properties

  var Expenses = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.perc = -1;
  };

  Expenses.prototype.calcPerc = function(){
    if(data.totals.inc > 0)
      this.perc = Math.round((this.value/data.totals.inc) * 100);
  }

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var CalculateSum = function(type){
    var sum = 0;
    data.allItems[type].forEach(element => {
      sum += element.value;
    });
    data.totals[type] = sum;
  };

  var CalculatePerc = function(){
    if(data.totals.inc > 0)
      data.totals.perc = Math.round((data.totals.exp / data.totals.inc) * 100);
  };

  var data = {
    allItems : {
      exp : [],
      inc : []
    },
    totals : {
      exp : 0,
      inc : 0,
      perc : -1
    }
  };

  //public properties
  return{
    //add item
    addItem : function(type, des, val){
      if(type==='inc'){
        data.allItems.inc.push(new Income(data.allItems.inc.length>0? data.allItems.inc[data.allItems.inc.length-1].id+1 : 0, des, val));
        return data.allItems.inc[data.allItems.inc.length-1];
      }else if(type==='exp'){
        data.allItems.exp.push(new Expenses(data.allItems.exp.length>0? data.allItems.exp[data.allItems.exp.length-1].id+1 : 0, des, val));
        console.log(data.allItems.exp);
        return data.allItems.exp[data.allItems.exp.length-1];
      }
    },

    //remove item
    removeItem : function(type, id){
      var ids, index;
      ids = data.allItems[type].map(function(current){
        return current.id;
      });
      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index, 1);
      }
      console.log(data.allItems[type]);
    },

    //adjust budget
    adjustBudget : function(){
      CalculateSum('inc');
      CalculateSum('exp');
      CalculatePerc();
      return data.totals;
    },

    //calculate percentages of each item
    calculatePercentages : function(){
      data.allItems.exp.forEach(function(item, index){
        item.calcPerc();
      });
    },

    //Get percentage array
    getExpensePercentages : function(){
      return data.allItems.exp.map(function(item){
        console.log(item.perc);
        return item.perc;
      })
    }
  }
})();
/******************************************************************************** */

//                                  UI module

var UIController = (function(){

  //private properties
  var UIStrings = {
    addBtn : '.add__btn',
    addType : '.add__type',
    addDesctiption : '.add__description',
    addValue : '.add__value',
    incomeContainer : '.income__list',
    expensesContainer : '.expenses__list',
    budgetUI : '.budget__value',
    incomeUI : '.budget__income--value',
    expenseUI : '.budget__expenses--value',
    expensePercUI : '.budget__expenses--percentage',
    containerUI : '.container',
    expensePerc : '.item__percentage',
    monthUI : '.budget__title--month'
  };



  //public properties
  return{
    readItem: function(){
      return{
        type : document.querySelector(UIStrings.addType).value,
        description : document.querySelector(UIStrings.addDesctiption).value,
        amount : parseFloat(document.querySelector(UIStrings.addValue).value)
      }
    },

    getUIStrings: function(){
      return UIStrings;
    },

    displayMonth: function(){
      var now, month, year;

      now = new Date();
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      year = now.getFullYear();

      document.querySelector(UIStrings.monthUI).textContent = months[now.getMonth()] + ", " + year;


    },

    displayItem: function(type, item){
      //1. Create HTMl string with placeholder text
      var html, element;

      if(type === 'inc'){
        element = UIStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      else{
        element = UIStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //2. Replace Placeholder with actual values
      var newhtml = html.replace('%id%', item.id);
      newhtml = newhtml.replace('%description%', item.description);
      newhtml = newhtml.replace('%value%', this.formatNumbers(item.value, type));

      //3. Insert the HTML into the document
      document.querySelector(element).insertAdjacentHTML('beforeend', newhtml)

    },

    clearFields: function(){
      document.querySelector(UIStrings.addDesctiption).value = '';
      document.querySelector(UIStrings.addValue).value = '';
      document.querySelector(UIStrings.addDesctiption).focus();

    },

    displayBudget: function(budget){
      var adj = budget.inc - budget.exp;
      document.querySelector(UIStrings.budgetUI).textContent = adj>=0 ? " + " + this.formatNumbers(adj, 'inc') : " - " + this.formatNumbers(adj, 'inc');
      document.querySelector(UIStrings.incomeUI).textContent = this.formatNumbers(budget.inc, 'inc');
      document.querySelector(UIStrings.expenseUI).textContent = this.formatNumbers(budget.exp, 'exp');
      if(budget.perc>0)
        document.querySelector(UIStrings.expensePercUI).textContent = budget.perc + '%';
      else
      document.querySelector(UIStrings.expensePercUI).textContent = '---';
    },

    displayPercentages: function(){
      var expPercNodeList = document.querySelectorAll(UIStrings.expensePerc);
      var percArray = budgetController.getExpensePercentages();
      expPercNodeList.forEach(function(item, index, nodeList){
        console.log(percArray[index]);
        if(percArray[index]>0){
          item.textContent = percArray[index] + '%';
        }
        else
          item.textContent = '---';
      })
    },

    removeItem: function(id){
      document.getElementById(id).parentNode.removeChild(document.getElementById(id));
    },

    formatNumbers: function(num, type){
      var numSplit, whole, decimal;

      num = Math.abs(num);

      //1. Two Decimal places
      num = num.toFixed(2);

      //2. Comma at thousands place
      numSplit = num.split('.');
      whole = numSplit[0]
      decimal = numSplit[1];

      if(whole.length > 3)
      {
        whole = whole.substring(0, whole.length-3) + ',' + whole.substring(whole.length-3, whole.length);
      }

      return whole + '.' + decimal;
    },

    changeType : function(){
      document.querySelector(UIStrings.addDesctiption).classList.toggle('red-focus');
      document.querySelector(UIStrings.addValue).classList.toggle('red-focus');
      document.querySelector(UIStrings.addBtn).classList.toggle('red');
    }


  }
})();
/******************************************************************************** */

//                                  Controller

var controller = (function(){
  //private properties
  
  var ctrlAddItem = function(){
    //1. Get the input data from the UI
    var item = UIController.readItem();

    if(item.description !== "" && !isNaN(item.amount) && item.amount > 0)
    {
      //2. Add the item to budget controller
      var addedItem = budgetController.addItem(item.type, item.description, item.amount);

      //3. Display the added idem to UI
      UIController.displayItem(item.type, addedItem);

      //4. Clear the UI input fields
      UIController.clearFields();

      //5. Adjust DB and Update UI
      updateUI();
    }
  };

  var ctrlDeleteItem = function(e){
    var itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID.includes('inc') || itemID.includes('exp'))
    {
      var splitID, id, type;
      splitID = itemID.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);

      //1. Remove item from database
      budgetController.removeItem(type, id);

      //2. Remove item from UI
      UIController.removeItem(itemID);

      //3. Adjust the budget and update UI
      updateUI();
    }
  };

  var updateUI = function(){
    //1. Adjust the main budget
    totals = budgetController.adjustBudget();

    //2. Display the adjusted main budget
    UIController.displayBudget(totals);

    //3. Update Percentages
    updatePercentages();
  };

  var updatePercentages = function(){
    //1. Calculate percentages
    budgetController.calculatePercentages();

    //2. Read Percentage from budget controller


    //3. Update UI with new percentages
    UIController.displayPercentages();
  }
  
  //Add Event Listeners
  var setEventListeners = function(){

    //add event listener to add button
  document.querySelector(UIController.getUIStrings().addBtn).addEventListener('click', ctrlAddItem);

  //add event listener to enter key btn
  document.addEventListener('keypress', function(e){
    if(e.keyCode === 13 || e.which === 13)
    {
      ctrlAddItem();
    }
  });

  //add event listener to the container
  document.querySelector(UIController.getUIStrings().containerUI).addEventListener('click', ctrlDeleteItem);

  //add event listener to type selector
  document.querySelector(UIController.getUIStrings().addType).addEventListener('change', UIController.changeType);

  };



  //public properties

  return{
    init : function(){
      UIController.displayBudget({
        exp : 0,
        inc : 0,
        perc : -1
      });
      UIController.displayMonth();
      setEventListeners();
    }
  }
})();
/******************************************************************************** */

//Main Execution
controller.init();