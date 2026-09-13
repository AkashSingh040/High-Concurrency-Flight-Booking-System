const flightService = require("../services/flight.service");

const getFlights = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const flights = await flightService.getFlights({
      from,
      to,
      page,
      limit
    });

    res.json({
      success: true,
      data: flights.data,
      pagination: flights.pagination
    });
  } catch (error) {
    next(error);
  }
};


const getFlightById = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FLIGHT_NOT_FOUND",
          message: "Flight not found"
        }
      });
    }

    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};


const createFlight = async (req, res, next) => {
  try {
    const flight = await flightService.createFlight(req.body);

    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};


const updateFlight = async (req, res, next) => {
  try {
    const flight = await flightService.updateFlight(
      req.params.id,
      req.body
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FLIGHT_NOT_FOUND",
          message: "Flight not found"
        }
      });
    }

    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};


const patchFlight = async (req, res, next) => {
  try {
    const flight = await flightService.patchFlight(
      req.params.id,
      req.body
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FLIGHT_NOT_FOUND",
          message: "Flight not found"
        }
      });
    }

    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};


const deleteFlight = async (req, res, next) => {
  try {
    const deleted = await flightService.deleteFlight(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FLIGHT_NOT_FOUND",
          message: "Flight not found"
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  patchFlight,
  deleteFlight
};