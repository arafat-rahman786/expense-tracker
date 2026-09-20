const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function makeElement(id = "") {
  const classes = new Set();

  return {
    id,
    value: "",
    innerText: "",
    innerHTML: "",
    textContent: "",
    classList: {
      add(...names) {
        names.forEach((name) => classes.add(name));
      },
      remove(...names) {
        names.forEach((name) => classes.delete(name));
      },
      contains(name) {
        return classes.has(name);
      },
      toggle(name, force) {
        if (force === undefined) {
          if (classes.has(name)) {
            classes.delete(name);
            return false;
          }

          classes.add(name);
          return true;
        }

        if (force) {
          classes.add(name);
          return true;
        }

        classes.delete(name);
        return false;
      },
    },
    listeners: {},
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    },
    dispatch(type, event = {}) {
      const handler = this.listeners[type];
      if (handler) handler(event);
    },
    reset() {
      this.value = "";
    },
    closest(selector) {
      if (selector === ".delete") return { getAttribute: () => this.id };
      return null;
    },
    getAttribute(name) {
      return this[name];
    },
  };
}

test("filterCategory exists and clearAll resets totals", () => {
  const ids = [
    "body",
    "mode",
    "date",
    "totalExpense",
    "foodExpense",
    "transportExpense",
    "shoppingExpense",
    "otherExpense",
    "expenseForm",
    "expenseTitle",
    "expenseAmount",
    "expenseCategory",
    "expenseDate",
    "clearAll",
    "filterAll",
    "filterFood",
    "filterTransport",
    "filterShopping",
    "filterOther",
    "itemCountBadge",
    "expensesList",
  ];

  const elements = Object.fromEntries(ids.map((id) => [id, makeElement(id)]));
  elements.expenseForm = makeElement("expenseForm");
  elements.expenseForm.reset = function reset() {
    Object.assign(this, { value: "" });
  };

  const document = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = makeElement(id);
      }
      return elements[id];
    },
  };

  global.document = document;
  global.crypto = { randomUUID: () => "test-id-1" };

  const scriptPath = path.join(__dirname, "..", "src", "js", "script.js");
  const source = fs
    .readFileSync(scriptPath, "utf8")
    .replace(/^import .*$/gm, "");
  const context = {
    document,
    crypto: global.crypto,
    console,
    window: {},
  };

  vm.createContext(context);
  vm.runInContext(source, context);

  assert.equal(typeof context.filterCategory, "function");

  elements.expenseTitle.value = "Lunch";
  elements.expenseAmount.value = "250";
  elements.expenseCategory.value = "Food";
  elements.expenseDate.value = "20-9-2026";
  elements.expenseForm.dispatch("submit", { preventDefault() {} });

  assert.equal(elements.itemCountBadge.innerText, "1");
  assert.equal(elements.totalExpense.innerText, "250");
  assert.equal(elements.foodExpense.innerText, "250");

  elements.clearAll.dispatch("click");

  assert.equal(elements.itemCountBadge.innerText, "0");
  assert.equal(elements.totalExpense.innerText, "0");
  assert.equal(elements.foodExpense.innerText, "0");
});

test("theme toggle switches the dark class and light background", () => {
  const ids = [
    "body",
    "mode",
    "date",
    "totalExpense",
    "foodExpense",
    "transportExpense",
    "shoppingExpense",
    "otherExpense",
    "expenseForm",
    "expenseTitle",
    "expenseAmount",
    "expenseCategory",
    "expenseDate",
    "clearAll",
    "filterAll",
    "filterFood",
    "filterTransport",
    "filterShopping",
    "filterOther",
    "itemCountBadge",
    "expensesList",
  ];

  const elements = Object.fromEntries(ids.map((id) => [id, makeElement(id)]));
  const document = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = makeElement(id);
      }
      return elements[id];
    },
  };

  global.document = document;
  global.crypto = { randomUUID: () => "test-id-1" };

  const scriptPath = path.join(__dirname, "..", "src", "js", "script.js");
  const source = fs
    .readFileSync(scriptPath, "utf8")
    .replace(/^import .*$/gm, "");
  const context = {
    document,
    crypto: global.crypto,
    console,
    window: {},
  };

  vm.createContext(context);
  vm.runInContext(source, context);

  assert.equal(elements.body.classList.contains("dark"), true);
  elements.mode.dispatch("click");
  assert.equal(elements.body.classList.contains("dark"), false);
  assert.equal(elements.body.classList.contains("bg-[#f8fafc]"), true);
});
