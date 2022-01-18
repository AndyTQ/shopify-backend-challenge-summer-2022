// Utility helpers that can be used, such as validating value and validating id.

// Validate the metadata (value) of an item.
const validateValue = (data) => {
    let err = "";
    const countDecimals = (num) => {
      const numStr = String(num);
      if (numStr.includes(".")) {
        return numStr.split(".")[1].length;
      }
      return 0;
    };
    if (data.item === undefined || data.item == "") {
      err += "Item name cannot be empty.\n";
    }
    if (
      data.price === undefined ||
      data.price == "" ||
      isNaN(data.price) ||
      countDecimals(data.price) > 2
    ) {
      err += "Invalid price (need decimal number (<=2 decimals) or integer.)\n";
    }
    if (
      data.quantity === undefined ||
      data.quantity == "" ||
      isNaN(data.quantity) ||
      data.quantity % 1 != 0
    ) {
      err += "Quantity is not valid (needs to be an integer.)\n";
    }
    return err;
};

// Validate whether the id has the correct format.
const validateId = (id) => {
    let err = "";
    if (id === undefined || id == "") {
        err += "Item id cannot be empty.";
    } else if (!/^[a-z0-9]+$/i.test(id)) {
        err += "Item id should be alphanumeric.";
    }
    return err;
};

module.exports.validateValue = validateValue;
module.exports.validateId = validateId;