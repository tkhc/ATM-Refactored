let dt = Date();
document.getElementById("date-time").innerHTML = dt.toString();

class Atm {
  constructor() {
    this.accounts = [];
    this.currentAccount = null;
  }
  createAccount(pin) {
    let newAccount = new Account(pin);
    this.accounts.push(newAccount);
    this.currentAccount = newAccount;
    updateATM();
    return newAccount;
  }

  updateAccount(newPin) {
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].pin === this.currentAccount.pin) {
        this.currentAccount.changePin(newPin);
        this.accounts[i] = this.currentAccount;
        updateATM();
      }
    }
  }

  getAccount(pin) {
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].pin === pin) {
        this.currentAccount = this.accounts[i];
        updateATM();
        return this.accounts[i];
      }
    }
    return null;
  }
}

class Account {
  constructor(pin) {
    this.pin = pin;
    this.balance = 0;
  }

  withdrawal(wdAmount) {
    this.balance -= wdAmount;
    updateATM();
  }

  deposit(depAmount) {
    this.balance += depAmount;
    updateATM();
  }

  changePin(newPin) {
    this.pin = newPin;
    updateATM();
  }
}

/* When the page loads get the ATM accounts out of local storage */
let atm = new Atm();
atm.accounts = JSON.parse(localStorage.getItem("atm_accts"));
/* if there are no accounts, make sure we initialize with an empty array */
if (atm.accounts === null) {
  atm.accounts = [];
}

function updateATM() {
  console.log(atm.accounts);
  localStorage.setItem("atm_accts", JSON.stringify(atm.accounts));
}

//display login
function returnToMenu() {
  document.getElementById("balance").innerHTML = null;
  document.getElementById("menu").style.display = "none";
  document.getElementById("start").style.display = "block";
  atm.currentAccount = null;
}

function displayBalance() {
  document.getElementById("balance").innerHTML = atm.currentAccount.balance;
}

function displayWithrawal() {
  if (confirm("We charge fees.")) {
    let amount = Number(prompt("How much would you like to withdrawal?", ""));
    if (amountValid("w", amount)) {
      atm.currentAccount.withdrawal(amount);
      displayBalance();
    } else {
      alert("Amount must be <= $200 and in increments of $20.");
    }
  }
}

function displayDeposit() {
  let amount = Number(prompt("How much would you like to deposit?", ""));
  if (amountValid("d", amount)) {
    atm.currentAccount.deposit(amount);
    displayBalance();
  } else {
    alert("Amount must be <= $200 and in increments of $20.");
  }
}

//error checking
function amountValid(type, amount) {
  let val = true;
  if (amount > 200) {
    val = false;
  }
  if (amount % 20 != 0) {
    val = false;
  }
  if (type === "w") {
    if (amount > atm.currentAccount.balance) {
      val = false;
    }
  }
  return val;
}

function newAccount() {
  let pin = parseInt(document.getElementById("newpinput").value);
  if (pin <= 9999 && pin >= 1000) {
    if (atm.getAccount(pin) != null) {
      alert("This account exists!");
    } else {
      atm.createAccount(pin);
      displayMenu();
    }
  } else {
    alert("Your pin needs to be 4 numbers.");
  }
}

function login() {
  let pin = parseInt(document.getElementById("pinput").value);
  let acct = atm.getAccount(pin);
  if (acct === null) {
    alert("Invalid pin!");
  } else {
    atm.currentAccount = acct;
    displayMenu();
  }
}

function displayMenu() {
  document.getElementById("pinput").value = null;
  document.getElementById("newpinput").value = null;
  document.getElementById("start").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function displayChangePin() {
  let pin = Number(prompt("Please enter your new pin.", ""));
  if (atm.getAccount(pin) === null) {
    atm.updateAccount(pin);
  } else {
    alert("This account exists, please choose another pin!");
  }
}
console.log(atm);
