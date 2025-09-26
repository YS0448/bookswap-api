const moment = require("moment-timezone");

const getUTCDateTime = ({
  format = 'YYYY-MM-DD HH:mm:ss',
  addMinutes = 0,
  addHours = 0,
  addDays = 0
  } = {}) => {
  let dt = moment.utc();

  if (addMinutes) dt = dt.add(addMinutes, 'minutes');
  if (addHours) dt = dt.add(addHours, 'hours');
  if (addDays) dt = dt.add(addDays, 'days');

  
  // for date time - getUTCDateTime({format:"YYYY-MM-DD HH:mm:ss"})
  // for date - YYYY-MM-DD
  // for time - HH:mm:ss

  // if you want to add - addHours:3 or addMinutes:5 
  //  getUTCDateTime({addHours:3})
  //  getUTCDateTime({addMinutes:5})
  return dt.format(format);
  
};


module.exports = { getUTCDateTime };
