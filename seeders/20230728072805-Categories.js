'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [{
      name: 'Electronics',
      parent_id: null
    }, {
      name: 'Cars',
      parent_id: null
    },
    {
      name: 'Mobile',
      parent_id: 1
    },
    {
      name: 'Honda',
      parent_id: 2
    },
    {
      name: 'Samsung',
      parent_id: 3
    },
    {
      name: 'IPhone',
      parent_id: 3
    },
    {
      name: 'Mivi',
      parent_id: 3
    }
  ], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Categories', null, {});

  }
};
