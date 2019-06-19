require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function searchByItemName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log('Search', { searchTerm })
      console.log(result)
    })
}

searchByItemName('burger')

function paginateItems(page) {
  const limit = 6
  const offset = limit * (page - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then(result => {
      console.log('Paginate', { page })
      console.log(result)
    })
}

paginateItems(2)

function costPerCategory() {
  knexInstance
    .select('category')
    .count('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log('Total cost for each category')
      console.log(result)
    })
}

costPerCategory()

function searchByItemDate(searchDate) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('date_added', '>=', `%${searchDate}%`)
    .then(result => {
      console.log('Search after date', { searchDate })
      console.log(result)
    })
}

searchByItemDate('2019-06-18T00:00:00.000Z')
