const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters')
const agentConfigs = require('../utils/agentConfig'); 
const { triggerAgent } = require('../utils/communicateWithAgent'); 
const { mintSPLToken,transferSPLToken,checkMyBalance }  = require('../utils/web3'); 

const { User } = require('../config/db.js')

function startTelegramBots() {
  agentConfigs.forEach(({ name, telegramBotToken, agent_project_id, agent_id, tokenMint }) => {
    const bot = new Telegraf(telegramBotToken);

    

    bot.command('wallet', async (ctx) => {
      const telegramId = ctx.message.from.id
      const username = ctx.message.from.username || ctx.message.from.first_name
      const wallet = ctx.payload
  
      const tgUser = await User.findOne({ telegramId: ctx.message.from.id })
  
      if (tgUser.wallet != "") {
          return ctx.reply(`Wallet address already exists, address: ${hasWallet}`)
      }
  
      if (!tgUser) {
          return ctx.reply('Please provide a wallet address')
      }
  
      const user = await User.findOneAndUpdate({ telegramId }, { username, wallet }, { upsert: true, new: true })
          
      if (!user) {
          return ctx.reply('Failed to save wallet address')
      }
  
      return ctx.reply(`Wallet address ${wallet} has been saved`)
  })
  
  bot.command('removewallet', async (ctx) => {
      const telegramId = ctx.message.from.id
  
      const wallet = await User.findOne({ telegramId: ctx.message.from.id })
      if (!wallet) {
          return ctx.reply('No wallet address found')
      }
  
      await User.findOneAndUpdate({ telegramId }, { $set: { wallet: "" } })
  
      return ctx.reply('Wallet address has been removed')
  })

  bot.on(message('text'), async (ctx) => {
    const tgUser = await User.findOne({ telegramId: ctx.message.from.id })
    if(!tgUser){
      return ctx.reply('Please provide a wallet address')
    }
    console.log(tgUser)
    if(tgUser.wallet ==""){
      return ctx.reply('Please provide a wallet address')
    }
    console.log("Valid wallet")
    const myBalance = await checkMyBalance(tgUser.wallet, tokenMint)
    console.log("Balance checked")
    console.log(myBalance)
    if(!myBalance){
      return ctx.reply('You do not hold any necessary tokens')
    }
    if(myBalance == 0){
      return ctx.reply('Top up your balance')
    }
    if(myBalance.value.amount <=0){
      return ctx.reply('Top up your balance')
    }
    const msg = `${ctx.message.from?.username || ctx.message.from?.first_name} said on telegram: ${ctx.message.text}.
      tgid: ${ctx.message.from.id}
      reply to it using the telegram message tool!`;

    await triggerAgent(agent_project_id, agent_id, ctx.message.chat.id, msg);
  });

    console.log(`Launching bot with token: ${telegramBotToken}`);
    bot.launch()
      .then(() => {
        console.log(`Bot ${name} launched with token: ${telegramBotToken}`);
      })
      .catch((error) => {
        console.error(`Error launching bot ${name}:`, error);
      });
  });

  
}

module.exports = { startTelegramBots };
