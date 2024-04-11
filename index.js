// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
   
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
  const accounts = [account1, account2, account3, account4];

  //elements
  const inputLoginPin = document.querySelector('.login__input--pin');
  const inputLoginUsername = document.querySelector('.login__input--user');
  const btnLogin= document.querySelector('.login__btn');
  const labelWelcome=document.querySelector('.welcome');
  const containerApp = document.querySelector('.app');

  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelBalance = document.querySelector('.balance__value');
  const containerMovements = document.querySelector('.movements');
  const btnSort = document.querySelector('.btn--sort');
  
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');

//create username
const createUsername=account=>{
    account.forEach(acc=>{
        acc.username=acc.owner.toLowerCase().split(" ").map(word=>word[0]).join("");
    })
}
createUsername(accounts)


//Login
let currentAccount;
btnLogin.addEventListener('click',function(e){
    e.preventDefault();
     currentAccount=accounts.find(acc=>acc.username===inputLoginUsername.value)

    if(currentAccount?.pin===Number(inputLoginPin.value)){
        labelWelcome.textContent="Welcome " + currentAccount.owner;
        containerApp.style.opacity=100;
        inputLoginPin.value=inputLoginUsername.value=" "
        inputLoginPin.blur();

        updateUI(currentAccount)
    }
})

//displayMovements
const displayMovements=(account ,toSort=false)=>{

    //sort
    const movs=toSort?account.movements.slice().sort((a,b)=>a-b):account.movements;

    containerMovements.innerHTML=" "
     movs.forEach(function(ele,ind){
        const type=ele>0?"deposit":"withdrawal";

        const amTemplate=`   
    <div class="movements__row">
      <div class="movements__type movements__type--deposit">${ind+1} :${type}</div>
      
      <div class="movements__value">${ele}</div>
   </div>`

   containerMovements.insertAdjacentHTML('afterbegin',amTemplate)
     })
}


//displayBalance
let balance;
const displayBalance=account=>{
     balance=account.movements.reduce((begin,rem)=>begin+rem,0)
    console.log(balance)
    labelBalance.textContent=balance + "€";
}




//displaySummary
const displaySummary=account=>{
    const income=account.movements.filter(mov=>mov>0).reduce((begin,rem)=>begin+rem)
    const out=account.movements.filter(mov=>mov<0).reduce((begin,rem)=>begin+rem)
    const interest=account.movements.filter(mov=>mov>0).map(mov=>mov*account.interestRate/100).filter(inte=>inte>=1).reduce((begin,rem)=>begin+rem,0)
    
    labelSumIn.textContent=income+ "€"
    labelSumOut.textContent=Math.abs(out)+ "€"
    labelSumInterest.textContent=interest    + "€"
}


//update UI
const updateUI=account=>{

        displayMovements(account)
        displayBalance(account)
        displaySummary(account)

        //sort button
        let sorted=false
        btnSort.addEventListener('click',function(e){
            e.preventDefault();
            displayMovements(account,!sorted)
            sorted=!sorted
        })   
        
        
}

//transfer
btnTransfer.addEventListener('click',function(e){
    e.preventDefault();

    const transferAmount=Number(inputTransferAmount.value)
    const receiver=accounts.find(account=>account.username===inputTransferTo.value)
    
    console.log(currentAccount)

    if(transferAmount>0 && receiver && balance>=transferAmount &&  receiver?.username!==currentAccount.username){
        currentAccount.movements.push(-transferAmount)
        receiver.movements.push(transferAmount)
        updateUI(currentAccount)
       
    }
   
})

// //close button
// btnClose.addEventListener('click',function(e){
//     e.preventDefault();
//     if(inputCloseUsername.value===currentAcc.you && Number(inputClosePin.value)===(currentAcc.pin)){
//       const index=accounts.findIndex(acc=>acc.you===currentAcc.you)
//       console.log(index)
//       accounts.splice(index,1);
//       containerApp.style.opacity=0;   
//     }
//   })

//close button
btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
        const index=accounts.findIndex(account=>account.username===currentAccount.username)
         accounts.splice(index,1);
        containerApp.style.opacity=0;  
    }
 
})

//loan
btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Number(inputLoanAmount.value);
    if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
      currentAccount.movements.push(amount);
      updateUI(currentAccount)
    }
 })