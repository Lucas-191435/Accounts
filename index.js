import chalk from "chalk";
import fs from "fs";
import inquirer from "inquirer";

console.log("iniciamos o Accounts");

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (action === "Criar Conta") {
        createAccount();
      }
      if (action === "Consultar Saldo") {
        
      }
      if (action === "Depositar") {
        deposit();
      }
      if (action === "Sacar") {
      }
      if (action === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  console.log(chalk.bgGreen.black("Parabén por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome pra sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Parabéns, a sua conta foi criada!"));
      operation();
    })
    .catch((err) => console.log(err));
}

function deposit() {
  inquirer
    .prompt({
      name: "accountName",
      message: "Qual o nome da conta?",
    })
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checkAccount(accountName)) {
        deposit();
      }

      inquirer
        .prompt({
          name: "amount",
          message: "Qual quantia que vc deseja depositar?",
        })
        .then((answer) => {
          const amount = answer["amount"];
          addAmount(accountName, amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Aconteu um erro, tente novamente mais tarde!")
    );
    return deposit();
  }
  console.log(accountData)

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(chalk.bgRed.black("Aconteceu algum erro!"));
    }
  );



    console.log(chalk.green(`Foi adicionado o valor de R$${amount}, na sua conta`))
  const accountData2 = getAccount(accountName);

console.log(accountData2)

    operation()
}

function getAccount(accountName) {
  const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJson);
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  } else {
    return true;
  }
}
