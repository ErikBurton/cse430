// utilities/index.js
const invModel = require('../models/inventory-model')
const Util = {}

Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = '<ul>'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += `<li>`
    list += `<a href="/inv/type/${row.classification_id}"
                 title="See our inventory of ${row.classification_name} vehicles">
                 ${row.classification_name}
             </a>`
    list += `</li>`
  })
  list += '</ul>'
  return list
}

module.exports = Util


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/**
 * Build Vehicle Detail HTML
 */
Util.buildVehicleDetail = function (vehicle) {
  // Format the price and mileage
  const price = Number(vehicle.inv_price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const mileage = Number(vehicle.inv_mileage).toLocaleString('en-US')

  return `
    <div class="vehicle-detail">
      <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      <ul>
        <li><strong>Year:</strong> ${vehicle.inv_year}</li>
        <li><strong>Price:</strong> ${price}</li>
        <li><strong>Mileage:</strong> ${mileage} miles</li>
        <li><strong>Description:</strong> ${vehicle.inv_description}</li>
      </ul>
    </div>
  `
}

