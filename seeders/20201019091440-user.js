'use strict';
const bcrypt = require('bcrypt');
//CMD
//create seeder file : $sequelize seed:generate --name ${seed_file_name}
//input data : $sequelize db:seed:all

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   return queryInterface.bulkInsert('users_tbl', [
    {
      userid: 'admin',
      password_hash: bcrypt.hashSync(
        process.env.ADMINPW,
        bcrypt.genSaltSync(10),
        null
      ),
      username: 'test',
      user_email: 'test',
      user_phone: '1111',
      is_account_lock: false,
      is_admin: true,
      login_ip: '127.0.0.1',
      created_at: new Date(Date.now()),
      updated_at:new Date(Date.now())
    },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
