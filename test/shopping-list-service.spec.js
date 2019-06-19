const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List object`, function () {
  let db
  let testShoppingList = [
    {
      id: 1,
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      name: 'Fish tricks',
      price: '13.10',
      checked: false,
      category: 'Main'
    },
    {
      id: 2,
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      name: 'Not Dogs',
      price: '4.99',
      checked: true,
      category: 'Snack'
    },
    {
      id: 3,
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      name: 'Bluffalo Wings',
      price: '5.50',
      checked: false,
      category: 'Snack'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  after(() => db.destroy())

  afterEach(() => db('shopping_list').truncate())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testShoppingList)
    })

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'updated name',
        price: '0.99',
        checked: false,
        category: 'Snack',
        date_added: new Date()
      }
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          })
        })
    })

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test ShoppingList array without the "deleted" article
          const expected = testShoppingList.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected)
        })
    })

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestItem = testShoppingList[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            checked: thirdTestItem.checked,
            category: thirdTestItem.category,
            date_added: thirdTestItem.date_added,
          })
        })
    })

    it(`getAllItems() resolves all ShoppingList from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testShoppingList.map(item => ({
            ...item,
            date_added: new Date(item.date_added)
          })))
        })
    })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        name: 'Test new name',
        price: '1.99',
        checked: false,
        category: 'Main',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
      }
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            checked: newItem.checked,
            category: newItem.category,
            date_added: new Date(newItem.date_added),
          })
        })
    })
  })

})