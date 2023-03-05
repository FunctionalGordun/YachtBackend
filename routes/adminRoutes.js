const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

const isUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admins = await Admin.find({ admins: id});
    if (admins && admins.length !== 0)
      res.send(true);
    else
      res.send(false);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};



router.get('/:id', isUserAdmin);

module.exports = router;