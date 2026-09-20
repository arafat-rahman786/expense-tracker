
let body = document.getElementById("body");
let modeControl = document.getElementById("mode");
let timeCase = document.getElementById("date");
let totalExpense = document.getElementById("totalExpense");
let foodExpense = document.getElementById("foodExpense");
let transportExpense = document.getElementById("transportExpense");
let shoppingExpense = document.getElementById("shoppingExpense");
let otherExpense = document.getElementById("otherExpense");
let expenseForm = document.getElementById("expenseForm");
let expenseTitle = document.getElementById("expenseTitle");
let expenseAmount = document.getElementById("expenseAmount");
let expenseCategory = document.getElementById("expenseCategory");
let expenseDate = document.getElementById("expenseDate");
let clearAll = document.getElementById("clearAll");
let itemCountBadge = document.getElementById("itemCountBadge");
let expensesList = document.getElementById("expensesList");
let tasklist = [];

function dateShow() {
  let now = new Date();
  let date = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();
  let final = `${date}-${month + 1}-${year}`;
  timeCase.textContent = final;
  expenseDate.value = final;
}
dateShow();

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  tasklist.push({
    id: crypto.randomUUID(),
    title: expenseTitle.value,
    date: expenseDate.value,
    amount: expenseAmount.value,
    category: expenseCategory.value,
  });

  tasklistFunction();
  totalExpenseresult();
  foodExpenseResult();
  transportExpenseResult();
  ShoppingExpenseResult();
  OtherExpenseResult();
  expenseForm.reset();
  itemCountBadge.innerText = tasklist.length;
  new Toast("Expense added successfully!");
});

function tasklistFunction() {
  let newTasklist = tasklist.map((item) => {
    let icon = "";
    if (item.category === "Food") {
      icon = `<div class="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                        <i class="fa-solid fa-utensils"></i>
                    </div>`;
    } else if (item.category === "Transport") {
      icon = `<div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <i class="fa-solid fa-bus"></i>
                    </div>`;
    } else if (item.category === "Shopping") {
      icon = `<div class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <i class="fa-solid fa-bag-shopping"></i>
                    </div>`;
    } else if (item.category === "Other") {
      icon = `<div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>`;
    }

    return `<div class="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3.5 flex items-center justify-between text-white">
                <div class="flex items-center space-x-3">
                    ${icon}
                    <div>
                        <h4 class="text-sm font-semibold">${item.title}</h4>
                        <p class="text-xs text-slate-400">${item.category} • ${item.date}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="font-bold text-sm">৳ ${item.amount}</span>
                    <button id="${item.id}" class="delete text-slate-400 hover:text-red-400 p-1.5 cursor-pointer">
                        <i class="fa-regular fa-trash-can text-xs"></i>
                    </button>
                </div>
            </div>`;
  });
  expensesList.innerHTML = newTasklist;
}

tasklistFunction();

// =============total expense ===========

function totalExpenseresult() {
  let total = tasklist.reduce((sum, task) => {
    return sum + Number(task.amount);
  }, 0);
  totalExpense.innerText = total;
}

totalExpenseresult();

// ============== delete button ==========

expensesList.addEventListener("click", (e) => {
  let deleteBtn = e.target.closest(".delete");
  if (!deleteBtn) return;
  deleteId = deleteBtn.getAttribute("id");
  let update = tasklist.filter((task) => {
    return task.id !== deleteId;
  });
  tasklist = update;
  tasklistFunction();
  totalExpenseresult();
  itemCountBadge.innerText = tasklist.length;
  new Toast("Expense deleted successfully!");
});

// ============= clearAll ==========

clearAll.addEventListener("click", () => {
  tasklist = [];
  itemCountBadge.innerText = tasklist.length;
  totalExpenseresult()
  tasklistFunction();
  foodExpense.innerText = 0;
  transportExpense.innerText = 0;
  shoppingExpense.innerText = 0;
  otherExpense.innerText = 0;
});

// ============= Total Food Cost ======

function foodExpenseResult() {
  let update = tasklist.filter((task) => {
    return task.category === "Food";
  });
  let total = update.reduce((sum, task) => {
    return sum + Number(task.amount);
  }, 0);
  foodExpense.innerText = total;
}
foodExpenseResult();

// ============= Total Transport Cost ======

function transportExpenseResult() {
  let update = tasklist.filter((task) => {
    return task.category === "Transport";
  });
  let total = update.reduce((sum, task) => {
    return sum + Number(task.amount);
  }, 0);
  transportExpense.innerText = total;
}

transportExpenseResult();

// ============= Total Shopping Cost ======

function ShoppingExpenseResult() {
  let update = tasklist.filter((task) => {
    return task.category === "Shopping";
  });
  let total = update.reduce((sum, task) => {
    return sum + Number(task.amount);
  }, 0);
  shoppingExpense.innerText = total;
}

ShoppingExpenseResult();

// ============= Total Other Cost ======

function OtherExpenseResult() {
  let update = tasklist.filter((task) => {
    return task.category === "Other";
  });
  let total = update.reduce((sum, task) => {
    return sum + Number(task.amount);
  }, 0);
  otherExpense.innerText = total;
}

OtherExpenseResult();

modeControl.addEventListener("click", () => {
  if (
    modeControl.innerHTML === `<i class="fa-solid fa-moon text-[#091628]"></i>`
  ) {
    body.classList.remove("bg-[#091628]");
    body.classList.add("bg-[#f8fafc]");

    modeControl.innerHTML = `<i class="fa-solid fa-lightbulb text-[#091628]"></i>`;
  } else {
    body.classList.remove("bg-[#f8fafc]");
    body.classList.add("bg-[#091628]");
    modeControl.innerHTML = `<i class="fa-solid fa-moon text-[#091628]"></i>`;
  }
});
