/*
 * mongoDB atlas・mongooseを使ったmongoDbエクササイズ
 */

const mongoose = require('mongoose')

// ネットワーク問題のローカルな回避策．いずれ削除予定
const dns = require('node:dns')
dns.setServers(['1.1.1.1'])

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://8126502_db_user:${password}@cluster0.rhy7fxe.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

// 1. DBに接続
mongoose.connect(url, { family: 4 })
        .then(() => {
            console.log("connected")
        })
        .catch(e => {
            console.log(e)
        })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// 2. モデルの作成
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'hai world',
  important: true,
})

// 3. ドキュメントをDBに保存 & DBから切断
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})