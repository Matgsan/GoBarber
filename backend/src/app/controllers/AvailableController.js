import {
  startOfDay,
  startOfHour,
  setHours,
  endOfDay,
  isEqual,
  isBefore,
  addHours,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    const searchDate = Number(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [];
    let startDate = startOfHour(setHours(searchDate, 8));
    const endDate = startOfHour(setHours(searchDate, 19));
    while (isBefore(startDate, endDate) || isEqual(startDate, endDate)) {
      schedule.push(startDate);
      startDate = addHours(startDate, 1);
    }

    const available = schedule.map(time => {
      return {
        time: format(time, 'HH:mm'),
        value: format(time, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(time, new Date()) &&
          !appointments.find(appointment => {
            return isEqual(startOfHour(appointment.date), startOfHour(time));
          }),
      };
    });
    return res.json(available);
  }
}
export default new AvailableController();
